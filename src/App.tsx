/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BoxId, DocId, DELIVERY_BOXES } from './data';
import { HeaderStepper, StepType } from './components/HeaderStepper';
import { StartSelectView } from './components/StartSelectView';
import { MyDocStepView, SelfCheckRating } from './components/MyDocStepView';
import { ClueCardsView } from './components/ClueCardsView';
import { MapChoiceView } from './components/MapChoiceView';
import { AddressCompleteView } from './components/AddressCompleteView';
import { HomeGroupMapView } from './components/HomeGroupMapView';

interface SessionProgress {
  currentStep: StepType;
  interpretation: string;
  isSubmitted: boolean;
  selfCheck: SelfCheckRating;
  selfCheckBase: string | null; // '일부'·'다르다'를 고른 순간의 해석
  notes: Record<DocId, string>;
  hasVisitedPin: boolean;
  pinSolved: boolean;
  selectedRegion: string;
  selectedEquatorSide: string;
  selectedEnvironment: string;
  addressCompleted: boolean;
  decisiveDocId: DocId | null;
  homeGroupGuesses: Partial<Record<BoxId, number>>;
  friendNotes: Partial<Record<BoxId, string>>; // 택배센터 모둠에서 친구 설명을 듣고 적은 메모
  homeGroupCompleted: boolean;
}

const DEFAULT_PROGRESS: SessionProgress = {
  currentStep: 'my_doc',
  interpretation: '',
  isSubmitted: false,
  selfCheck: null,
  selfCheckBase: null,
  notes: { '1': '', '2': '', '3': '', '4': '' },
  hasVisitedPin: false,
  pinSolved: false,
  selectedRegion: '',
  selectedEquatorSide: '',
  selectedEnvironment: '',
  addressCompleted: false,
  decisiveDocId: null,
  homeGroupGuesses: {},
  friendNotes: {},
  homeGroupCompleted: false,
};

const STORAGE_PREFIX = 'afri_express_jigsaw_v3_';

function loadSession(boxId: BoxId, docId: DocId): SessionProgress {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${boxId}_${docId}`);
    if (!raw) return { ...DEFAULT_PROGRESS, notes: { ...DEFAULT_PROGRESS.notes } };
    const parsed = JSON.parse(raw) as Partial<SessionProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      notes: { ...DEFAULT_PROGRESS.notes, ...(parsed.notes || {}) },
      homeGroupGuesses: { ...(parsed.homeGroupGuesses || {}) },
      friendNotes: { ...(parsed.friendNotes || {}) },
    };
  } catch {
    return { ...DEFAULT_PROGRESS, notes: { ...DEFAULT_PROGRESS.notes } };
  }
}

function saveSession(boxId: BoxId, docId: DocId, progress: SessionProgress) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${boxId}_${docId}`, JSON.stringify(progress));
  } catch {
    // ignore storage quota errors
  }
}

// 새로 시작할 때는 이전 기록을 지움. 같은 탭에서 새로고침한 경우에만 이어서 진행
// (sessionStorage는 탭을 닫으면 사라지므로, 기기를 돌려 써도 다음 학생은 빈 상태로 시작)
const activeKey = (boxId: BoxId, docId: DocId) => `${STORAGE_PREFIX}active_${boxId}_${docId}`;

function startFresh(boxId: BoxId, docId: DocId): SessionProgress {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${boxId}_${docId}`);
    sessionStorage.setItem(activeKey(boxId, docId), '1');
  } catch {
    // ignore
  }
  return { ...DEFAULT_PROGRESS, notes: { ...DEFAULT_PROGRESS.notes } };
}

function resumeOrStart(boxId: BoxId, docId: DocId): SessionProgress {
  try {
    if (sessionStorage.getItem(activeKey(boxId, docId))) return loadSession(boxId, docId);
  } catch {
    // ignore
  }
  return startFresh(boxId, docId);
}

function parseUrlParams(): { boxId: BoxId | null; docId: DocId | null } {
  const params = new URLSearchParams(window.location.search);
  const rawBox = params.get('box')?.toUpperCase();
  const rawDoc = params.get('doc');
  const boxId =
    rawBox && ['A', 'B', 'C', 'D', 'E'].includes(rawBox) ? (rawBox as BoxId) : null;
  const docId =
    rawDoc && ['1', '2', '3', '4'].includes(rawDoc) ? (rawDoc as DocId) : null;
  return { boxId, docId };
}

export default function App() {
  const initialUrl = parseUrlParams();

  const [selectedBoxId, setSelectedBoxId] = useState<BoxId | null>(
    initialUrl.boxId && initialUrl.docId ? initialUrl.boxId : null
  );
  const [selectedDocId, setSelectedDocId] = useState<DocId | null>(
    initialUrl.boxId && initialUrl.docId ? initialUrl.docId : null
  );
  const [urlPreBox, setUrlPreBox] = useState<BoxId | null>(initialUrl.boxId);
  const [urlPreDoc, setUrlPreDoc] = useState<DocId | null>(initialUrl.docId);

  const [progress, setProgress] = useState<SessionProgress>(() => {
    if (initialUrl.boxId && initialUrl.docId) {
      return resumeOrStart(initialUrl.boxId, initialUrl.docId);
    }
    return { ...DEFAULT_PROGRESS, notes: { ...DEFAULT_PROGRESS.notes } };
  });

  // Sync URL popstate
  useEffect(() => {
    const onPopState = () => {
      const { boxId, docId } = parseUrlParams();
      setUrlPreBox(boxId);
      setUrlPreDoc(docId);
      if (boxId && docId) {
        setSelectedBoxId(boxId);
        setSelectedDocId(docId);
        setProgress(resumeOrStart(boxId, docId));
      } else {
        setSelectedBoxId(null);
        setSelectedDocId(null);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    if (selectedBoxId && selectedDocId) {
      saveSession(selectedBoxId, selectedDocId, progress);
    }
  }, [selectedBoxId, selectedDocId, progress]);

  const handleStartMission = (boxId: BoxId, docId: DocId) => {
    const loaded = startFresh(boxId, docId);
    setSelectedBoxId(boxId);
    setSelectedDocId(docId);
    setProgress(loaded);

    const url = new URL(window.location.href);
    url.searchParams.set('box', boxId);
    url.searchParams.set('doc', docId);
    window.history.pushState({}, '', url.toString());
  };

  const handleResetSelection = () => {
    setSelectedBoxId(null);
    setSelectedDocId(null);
    setUrlPreBox(null);
    setUrlPreDoc(null);

    const url = new URL(window.location.href);
    url.searchParams.delete('box');
    url.searchParams.delete('doc');
    window.history.pushState({}, '', url.toString());
  };

  const handleResetAllAndReplay = () => {
    if (selectedBoxId && selectedDocId) {
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}${selectedBoxId}_${selectedDocId}`);
      } catch {
        // ignore
      }
    }
    handleResetSelection();
  };

  const handleAddressAllCorrect = useCallback(() => {
    setProgress((prev) =>
      prev.addressCompleted ? prev : { ...prev, addressCompleted: true }
    );
  }, []);

  const handleAllHomeGroupGuessed = useCallback(() => {
    setProgress((prev) =>
      prev.homeGroupCompleted ? prev : { ...prev, homeGroupCompleted: true }
    );
  }, []);

  // Entry Screen when box or doc is not yet picked
  if (!selectedBoxId || !selectedDocId) {
    return (
      <StartSelectView
        initialBoxId={urlPreBox}
        initialDocId={urlPreDoc}
        onStartMission={handleStartMission}
      />
    );
  }

  const activeBox = DELIVERY_BOXES[selectedBoxId];

  // Calculate which steps display ✔ in top progress bar
  const completedSteps: Record<StepType, boolean> = {
    my_doc: progress.isSubmitted,
    self_check:
      progress.isSubmitted &&
      progress.selfCheck !== null &&
      (progress.selfCheck === 'same' ||
        progress.selfCheckBase === null ||
        progress.interpretation.trim() !== progress.selfCheckBase.trim()) &&
      (progress.currentStep !== 'my_doc' && progress.currentStep !== 'self_check' ||
        progress.hasVisitedPin ||
        progress.pinSolved),
    clues: progress.hasVisitedPin || progress.pinSolved,
    pin: progress.pinSolved,
    address: progress.addressCompleted,
    home_group: progress.homeGroupCompleted,
  };

  return (
    <div className="min-h-screen bg-white text-navy flex justify-center selection:bg-sun selection:text-navy">
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl bg-white min-h-screen flex flex-col relative">
        <HeaderStepper
          currentStep={progress.currentStep}
          boxId={selectedBoxId}
          docId={selectedDocId}
          completedSteps={completedSteps}
          onStepChange={(step) =>
            setProgress((prev) => ({ ...prev, currentStep: step }))
          }
          onResetSelection={handleResetSelection}
        />

        <main className="flex-1 overflow-x-hidden">
          {(progress.currentStep === 'my_doc' ||
            progress.currentStep === 'self_check') && (
            <MyDocStepView
              box={activeBox}
              docId={selectedDocId}
              stage={progress.currentStep}
              interpretation={progress.interpretation}
              isSubmitted={progress.isSubmitted}
              selfCheck={progress.selfCheck}
              selfCheckBase={progress.selfCheckBase}
              onInterpretationChange={(val) =>
                setProgress((prev) => ({ ...prev, interpretation: val }))
              }
              onSubmitInterpretation={() =>
                setProgress((prev) => ({
                  ...prev,
                  isSubmitted: true,
                  currentStep: 'self_check',
                }))
              }
              onSelectSelfCheck={(rating, base) =>
                setProgress((prev) => ({ ...prev, selfCheck: rating, selfCheckBase: base }))
              }
              onGoToExpertGroup={() =>
                setProgress((prev) => {
                  const existingDocNote = prev.notes[selectedDocId];
                  const nextNotes = {
                    ...prev.notes,
                    [selectedDocId]:
                      existingDocNote && existingDocNote.trim().length > 0
                        ? existingDocNote
                        : prev.interpretation,
                  };
                  return {
                    ...prev,
                    notes: nextNotes,
                    currentStep: 'clues',
                  };
                })
              }
            />
          )}

          {progress.currentStep === 'clues' && (
            <ClueCardsView
              box={activeBox}
              assignedDocId={selectedDocId}
              notes={progress.notes}
              onNoteChange={(dId, val) =>
                setProgress((prev) => ({
                  ...prev,
                  notes: { ...prev.notes, [dId]: val },
                }))
              }
              onProceedToPin={() =>
                setProgress((prev) => ({
                  ...prev,
                  hasVisitedPin: true,
                  currentStep: 'pin',
                }))
              }
            />
          )}

          {progress.currentStep === 'pin' && (
            <MapChoiceView
              box={activeBox}
              notes={progress.notes}
              alreadySolved={progress.pinSolved}
              onSuccess={() =>
                setProgress((prev) => ({ ...prev, pinSolved: true }))
              }
              onProceedToAddress={() =>
                setProgress((prev) => ({ ...prev, currentStep: 'address' }))
              }
              onBackToClues={() =>
                setProgress((prev) => ({ ...prev, currentStep: 'clues' }))
              }
            />
          )}

          {progress.currentStep === 'address' && (
            <AddressCompleteView
              box={activeBox}
              notes={progress.notes}
              selectedRegion={progress.selectedRegion}
              selectedEquatorSide={progress.selectedEquatorSide}
              selectedEnvironment={progress.selectedEnvironment}
              decisiveDocId={progress.decisiveDocId}
              onChangeRegion={(val) =>
                setProgress((prev) => ({ ...prev, selectedRegion: val }))
              }
              onChangeEquatorSide={(val) =>
                setProgress((prev) => ({ ...prev, selectedEquatorSide: val }))
              }
              onChangeEnvironment={(val) =>
                setProgress((prev) => ({ ...prev, selectedEnvironment: val }))
              }
              onSelectDecisiveDoc={(dId) =>
                setProgress((prev) => ({ ...prev, decisiveDocId: dId }))
              }
              onAddressAllCorrect={handleAddressAllCorrect}
              onGoToHomeGroup={() =>
                setProgress((prev) => ({ ...prev, currentStep: 'home_group' }))
              }
            />
          )}

          {progress.currentStep === 'home_group' && (
            <HomeGroupMapView
              myBox={activeBox}
              notes={progress.notes}
              guesses={progress.homeGroupGuesses}
              friendNotes={progress.friendNotes}
              onFriendNoteChange={(targetBoxId, val) =>
                setProgress((prev) => ({
                  ...prev,
                  friendNotes: { ...prev.friendNotes, [targetBoxId]: val },
                }))
              }
              onGuessBox={(targetBoxId, pickedPin) =>
                setProgress((prev) => ({
                  ...prev,
                  homeGroupGuesses: {
                    ...prev.homeGroupGuesses,
                    [targetBoxId]: pickedPin,
                  },
                }))
              }
              onAllGuessed={handleAllHomeGroupGuessed}
              onResetAll={handleResetAllAndReplay}
            />
          )}
        </main>
      </div>
    </div>
  );
}
