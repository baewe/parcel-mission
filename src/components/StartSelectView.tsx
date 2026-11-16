import React, { useState } from 'react';
import {
  Package,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { BoxId, DocId, DELIVERY_BOXES, DOC_METAS } from '../data';

interface StartSelectViewProps {
  initialBoxId?: BoxId | null;
  initialDocId?: DocId | null;
  onStartMission: (boxId: BoxId, docId: DocId) => void;
}

export const StartSelectView: React.FC<StartSelectViewProps> = ({
  initialBoxId = null,
  initialDocId = null,
  onStartMission,
}) => {
  const [pickedBox, setPickedBox] = useState<BoxId | null>(initialBoxId);
  const [pickedDoc, setPickedDoc] = useState<DocId | null>(initialDocId);

  const boxes = Object.values(DELIVERY_BOXES);

  const docIcons: Record<DocId, React.ReactNode> = {
    '1': <FileText className="w-5 h-5" />,
    '2': <FileText className="w-5 h-5" />,
    '3': <FileText className="w-5 h-5" />,
    '4': <FileText className="w-5 h-5" />,
  };

  const docDescriptions: Record<DocId, string> = {
    '1': '첫 번째 단서 자료를 읽고 특징 분석',
    '2': '두 번째 단서 자료를 읽고 특징 분석',
    '3': '세 번째 단서 자료를 읽고 특징 분석',
    '4': '네 번째 단서 자료를 읽고 특징 분석',
  };

  return (
    <div className="min-h-screen bg-white text-navy flex justify-center">
      <div className="w-full max-w-md md:max-w-2xl bg-white min-h-screen p-4 md:p-8 pb-12 flex flex-col">
        {/* Express Title Header */}
        <div className="text-center mt-2 mb-4">
          <div className="inline-flex items-center gap-1.5 bg-[#274480] text-amber-300 text-xs font-bold px-3 py-1 rounded-full tracking-wider mb-2 shadow-sm">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>중1 사회 · 아프리카 직소 탐구</span>
          </div>
          <h1 className="text-3xl text-navy tracking-tight">
            아프리카 택배 대작전
          </h1>
          <p className="text-sm text-navy/70 mt-1 font-medium">
            내 택배와 담당 자료를 고르고 배송을 시작하세요!
          </p>
        </div>

        {/* Step A: Select Parcel Box (A~E) */}
        {!pickedBox ? (
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base text-navy">
                1. 내가 맡은 택배를 고르세요 (A~E)
              </h2>
              <span className="text-[11px] text-navy/60 font-bold">1 / 2</span>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
              {boxes.map((box) => (
                <button
                  key={box.id}
                  type="button"
                  onClick={() => setPickedBox(box.id)}
                  className="aspect-[5/4] rounded-2xl border-2 border-navy/20 bg-white hover:border-navy active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Package className="w-6 h-6 text-sun" />
                  <span className="text-xs font-bold text-navy/60">택배</span>
                  <span className="text-4xl font-extrabold text-navy leading-none">{box.id}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Step B: Select Assigned Document (1~4) */
          <div className="space-y-4 flex-1">
            {/* Chosen Box Pill Summary + Back Button */}
            <div className="flex items-center justify-between bg-[#FFFFFF] px-3.5 py-2.5 rounded-xl border border-amber-800/25">
              <div className="flex items-center gap-2">
                <span className="bg-amber-800 text-white font-black text-xs px-2 py-0.5 rounded">
                  {DELIVERY_BOXES[pickedBox].codeName}
                </span>
                <span className="text-xs font-bold text-amber-950">선택됨</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPickedBox(null);
                  setPickedDoc(null);
                }}
                className="flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>택배 다시 고르기</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between px-1 mb-2.5">
                <h2 className="text-base text-navy">
                  2. 내가 맡은 자료 1개를 고르세요
                </h2>
                <span className="text-[11px] text-navy/60 font-bold">2 / 2</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {(['1', '2', '3', '4'] as DocId[]).map((dId) => {
                  const meta = DOC_METAS[dId];
                  const isSelected = pickedDoc === dId;
                  return (
                    <button
                      key={dId}
                      type="button"
                      onClick={() => setPickedDoc(dId)}
                      className={`w-full min-h-[64px] text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-800 border-amber-900 text-white shadow-md'
                          : 'bg-white border-amber-800/25 text-stone-800 hover:border-amber-700 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold ${
                            isSelected
                              ? 'bg-amber-700 text-amber-100'
                              : 'bg-[#FFFFFF] text-amber-900 border border-amber-800/20'
                          }`}
                        >
                          {docIcons[dId]}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">
                            {meta.label}
                          </div>
                          <div
                            className={`text-xs mt-0.5 ${
                              isSelected ? 'text-amber-100' : 'text-stone-500'
                            }`}
                          >
                            {docDescriptions[dId]}
                          </div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirmation Notice: "당신은 ○○ 담당입니다" */}
            {pickedDoc && (
              <div className="mt-4 bg-[#FFFFFF] border border-amber-800 rounded-2xl p-4 shadow-md space-y-3">
                <div className="text-center">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                    배정 완료
                  </span>
                  <p className="text-base font-black text-amber-950 mt-2">
                    당신은 <span className="text-red-700 underline">{DOC_METAS[pickedDoc].label}</span> 담당입니다
                  </p>
                  <p className="text-xs text-stone-600 mt-1">
                    {DELIVERY_BOXES[pickedBox].codeName}의 {DOC_METAS[pickedDoc].label}만 먼저 보고 스스로 해석해 보세요.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onStartMission(pickedBox, pickedDoc)}
                  className="w-full min-h-[52px] py-3.5 px-4 rounded-xl bg-sun text-navy active:scale-[0.98] font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>1단계: 내 자료 해석 시작하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
