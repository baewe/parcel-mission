import React, { useState } from 'react';
import { BookOpen, Check, RefreshCw } from 'lucide-react';
import { BoxId, DocId, DOC_METAS } from '../data';
import { TextbookViewer } from './TextbookViewer';

export type StepType =
  | 'my_doc'
  | 'self_check'
  | 'clues'
  | 'pin'
  | 'address'
  | 'home_group';

interface HeaderStepperProps {
  currentStep: StepType;
  boxId: BoxId;
  docId: DocId;
  completedSteps: Record<StepType, boolean>;
  onStepChange: (step: StepType) => void;
  onResetSelection: () => void;
}

const STEP_LIST: { key: StepType; label: string }[] = [
  { key: 'my_doc', label: '내자료' },
  { key: 'self_check', label: '점검' },
  { key: 'clues', label: '단서' },
  { key: 'pin', label: '배송지' },
  { key: 'address', label: '주소' },
  { key: 'home_group', label: '택배센터' },
];

export const HeaderStepper: React.FC<HeaderStepperProps> = ({
  currentStep,
  boxId,
  docId,
  completedSteps,
  onStepChange,
  onResetSelection,
}) => {
  const docMeta = DOC_METAS[docId];
  const [isTextbookOpen, setIsTextbookOpen] = useState(false);
  const openTextbook = () => setIsTextbookOpen(true);
  const currentIdx = STEP_LIST.findIndex((s) => s.key === currentStep);

  // Allow clicking any completed step or the step immediately following the last completed step
  const isStepAccessible = (stepKey: StepType, idx: number) => {
    if (completedSteps[stepKey]) return true;
    if (stepKey === currentStep) return true;
    if (idx === 0) return true;
    const prevKey = STEP_LIST[idx - 1].key;
    return completedSteps[prevKey];
  };

  return (
    <header className="sticky top-0 z-[1100] bg-[#274480] border-b border-amber-900/15 shadow-sm">
      {/* Top Waybill Strip */}
      <div className="bg-[#274480] text-amber-100 px-3.5 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-white truncate">
            택배 {boxId} · {docMeta.shortLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={openTextbook}
          className="flex items-center gap-1.5 text-xs font-bold text-navy bg-sun px-3 py-1.5 rounded shrink-0 cursor-pointer ml-auto"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>교과서 보기</span>
        </button>
      </div>

      {/* 6-Stage Progress Stepper (Completed steps turn into ✔) */}
      <div className="px-2 py-2 bg-white border-b border-stone-200">
        <div className="flex items-center justify-between relative max-w-md md:max-w-2xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-5 right-5 top-3 h-0.5 bg-amber-200/90 -z-0">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${(Math.max(0, currentIdx) / (STEP_LIST.length - 1)) * 100}%` }}
            />
          </div>

          {STEP_LIST.map((s, idx) => {
            const isCurrent = currentStep === s.key;
            const isDone = completedSteps[s.key];
            const accessible = isStepAccessible(s.key, idx);

            return (
              <button
                key={s.key}
                type="button"
                disabled={!accessible}
                onClick={() => accessible && onStepChange(s.key)}
                className={`relative z-10 flex flex-col items-center gap-1 min-w-[44px] transition-all ${
                  accessible ? 'cursor-pointer' : 'cursor-default opacity-55'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-navy shadow-sm'
                      : isCurrent
                      ? 'bg-sun text-navy ring-3 ring-white'
                      : 'bg-[#FFFFFF] text-stone-600'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] tracking-tight whitespace-nowrap ${
                    isCurrent
                      ? 'text-amber-950 font-extrabold'
                      : isDone
                      ? 'text-emerald-800 font-bold'
                      : 'text-stone-500 font-medium'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <TextbookViewer isOpen={isTextbookOpen} onClose={() => setIsTextbookOpen(false)} />
    </header>
  );
};
