import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  MapPin,
  Users,
} from 'lucide-react';
import { DeliveryBox, DocId, DOC_METAS } from '../data';
import { DocRenderer } from './DocRenderer';

interface ClueCardsViewProps {
  box: DeliveryBox;
  assignedDocId: DocId;
  notes: Record<DocId, string>;
  onNoteChange: (docId: DocId, value: string) => void;
  onProceedToPin: () => void;
}

export const ClueCardsView: React.FC<ClueCardsViewProps> = ({
  box,
  assignedDocId,
  notes,
  onNoteChange,
  onProceedToPin,
}) => {
  const [activeDocId, setActiveDocId] = useState<DocId>(assignedDocId);

  const docOrder: DocId[] = ['1', '2', '3', '4'];
  const activeIdx = docOrder.indexOf(activeDocId);

  const docIcons: Record<DocId, React.ReactNode> = {
    '1': <FileText className="w-3.5 h-3.5" />,
    '2': <FileText className="w-3.5 h-3.5" />,
    '3': <FileText className="w-3.5 h-3.5" />,
    '4': <FileText className="w-3.5 h-3.5" />,
  };

  const handlePrev = () => {
    const prevIdx = activeIdx > 0 ? activeIdx - 1 : docOrder.length - 1;
    setActiveDocId(docOrder[prevIdx]);
  };

  const handleNext = () => {
    const nextIdx = activeIdx < docOrder.length - 1 ? activeIdx + 1 : 0;
    setActiveDocId(docOrder[nextIdx]);
  };

  const completedNotesCount = docOrder.filter(
    (id) => notes[id] && notes[id].trim().length > 0
  ).length;

  const activeMeta = DOC_METAS[activeDocId];

  return (
    <div className="w-full mx-auto p-4 pb-24">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300 inline-flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>전문가 집단 모이기</span>
          </span>
          <h2 className="text-xl text-navy mt-1">
            단서 4개를 모두 종합하세요
          </h2>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-amber-900 bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-amber-800/20">
            {completedNotesCount}/4 기록
          </span>
        </div>
      </div>

      {/* 4-Media Tab Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#FFFFFF] rounded-xl border border-amber-800/20 mb-3 shadow-inner">
        {docOrder.map((id) => {
          const meta = DOC_METAS[id];
          const isActive = activeDocId === id;
          const hasNote = notes[id] && notes[id].trim().length > 0;
          const isMine = assignedDocId === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveDocId(id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all relative cursor-pointer ${
                isActive
                  ? 'bg-amber-800 text-amber-50 shadow font-bold'
                  : 'text-amber-950/80 hover:bg-white/50 font-medium'
              }`}
            >
              <div className="flex items-center gap-1">
                {docIcons[id]}
                <span className="text-[11px] whitespace-nowrap">{meta.shortLabel}</span>
              </div>
              {isMine && (
                <span
                  className={`text-[9px] mt-0.5 ${
                    isActive ? 'text-amber-200' : 'text-amber-800 font-bold'
                  }`}
                >
                  내 담당
                </span>
              )}
              {hasNote && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"
                  title="기록 완료"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Clue Card */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-amber-800/30 shadow-md overflow-hidden">
        {/* Card Header Bar */}
        <div className="bg-[#FFFFFF] border-b border-amber-800/20 px-3.5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-amber-950">
              {activeMeta.label} 단서
            </span>
            {assignedDocId === activeDocId && (
              <span className="text-[10px] font-bold bg-amber-800 text-white px-1.5 py-0.5 rounded">
                내 담당 자료
              </span>
            )}
          </div>
          <span className="text-xs text-stone-500">
            {activeIdx + 1} / 4
          </span>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-4">
          <DocRenderer box={box} docId={activeDocId} />

          {/* "매체에서 알게 된 점" Input */}
          <div className="pt-1">
            <label className="block text-xs font-bold text-amber-950 mb-1.5 flex items-center justify-between">
              <span>매체에서 알게 된 점 ({activeMeta.label})</span>
              {notes[activeDocId] && notes[activeDocId].trim().length > 0 && (
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  작성됨
                </span>
              )}
            </label>
            <textarea
              value={notes[activeDocId] || ''}
              onChange={(e) => onNoteChange(activeDocId, e.target.value)}
              placeholder={`${activeMeta.label}에서 확인한 지형, 기후, 도시 특징을 적어 주세요.`}
              rows={3}
              className="w-full text-xs p-2.5 rounded-xl border border-amber-800/30 bg-white focus:bg-amber-50/40 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-900 placeholder:text-stone-400 leading-relaxed resize-none shadow-inner"
            />
          </div>
        </div>

        {/* Prev / Next Controls */}
        <div className="bg-[#FFFFFF] border-t border-amber-800/20 px-3 py-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 px-2.5 py-1.5 rounded-lg hover:bg-amber-200/50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 자료</span>
          </button>

          <span className="text-[11px] font-medium text-stone-600">
            {activeMeta.shortLabel}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 px-2.5 py-1.5 rounded-lg hover:bg-amber-200/50 transition-colors cursor-pointer"
          >
            <span>다음 자료</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CTA Button to Step 3 */}
      <div className="mt-5 space-y-2">
        <p className="text-center text-xs text-navy/70">
          모둠원과 단서를 충분히 분석한 뒤 지도로 넘어가세요. (단서 2개 이상)
        </p>
        <button
          type="button"
          onClick={onProceedToPin}
          disabled={completedNotesCount < 2}
          className={`w-full min-h-[52px] py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            completedNotesCount < 2
              ? 'bg-white border border-navy/20 text-navy/40 cursor-not-allowed'
              : 'bg-sun text-navy active:scale-[0.98] cursor-pointer'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>
            {completedNotesCount < 2
              ? '단서를 2개 이상 분석하면 넘어갈 수 있어요'
              : '3단계: 지도에서 배송지 고르기 (1~5)'}
          </span>
        </button>
      </div>
    </div>
  );
};
