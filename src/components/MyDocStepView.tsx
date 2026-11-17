import React, { useRef } from 'react';
import {
  Send,
  Users,
  BookOpenCheck,
  Check,
  Triangle,
  X,
  PencilLine,
} from 'lucide-react';
import { DeliveryBox, DocId, DOC_METAS } from '../data';
import { DocRenderer } from './DocRenderer';

export type SelfCheckRating = 'same' | 'partial' | 'different' | null;

interface MyDocStepViewProps {
  box: DeliveryBox;
  docId: DocId;
  stage: 'my_doc' | 'self_check';
  interpretation: string;
  isSubmitted: boolean;
  selfCheck: SelfCheckRating;
  selfCheckBase: string | null;
  onInterpretationChange: (value: string) => void;
  onSubmitInterpretation: () => void;
  onSelectSelfCheck: (rating: Exclude<SelfCheckRating, null>, base: string | null) => void;
  onGoToExpertGroup: () => void;
}

export const MyDocStepView: React.FC<MyDocStepViewProps> = ({
  box,
  docId,
  stage,
  interpretation,
  isSubmitted,
  selfCheck,
  selfCheckBase,
  onInterpretationChange,
  onSubmitInterpretation,
  onSelectSelfCheck,
  onGoToExpertGroup,
}) => {
  const docMeta = DOC_METAS[docId];
  const modelAnswer = box.docs[docId].model;
  const canSubmit = interpretation.trim().length > 0;
  // '일부'·'다르다'를 고른 순간의 해석 (App에 저장). 이 내용에서 고쳐 써야 넘어갈 수 있음
  const isRevised = selfCheckBase === null || interpretation.trim() !== selfCheckBase.trim();
  const canProceedExpert =
    isSubmitted && selfCheck !== null && interpretation.trim().length > 0 && (selfCheck === 'same' || isRevised);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const focusInterpretation = () => {
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => textareaRef.current?.focus(), 350);
  };

  const chooseSelfCheck = (rating: 'same' | 'partial' | 'different') => {
    onSelectSelfCheck(rating, rating === 'same' ? null : interpretation);
    if (rating !== 'same') focusInterpretation();
  };

  return (
    <div className="w-full mx-auto p-4 pb-24 space-y-4">
      {/* Assigned Role Banner: "당신은 ○○ 담당입니다" */}
      <div className="bg-[#274480] text-amber-50 rounded-2xl p-3.5 shadow-md flex items-center justify-between border border-amber-700">
        <div>
          <span className="text-[11px] font-bold text-amber-300 block">
            {box.codeName} · 개인 탐구
          </span>
          <p className="text-sm font-black mt-0.5">
            당신은 <span className="text-amber-300 underline">{docMeta.label}</span> 담당입니다
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-700/80 border border-amber-400/50 flex items-center justify-center font-black text-lg text-amber-100 shrink-0">
          {docMeta.circleNum}
        </div>
      </div>

      {/* Step Title */}
      <div>
        <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
          {stage === 'my_doc' ? '1단계: 내 자료 해석' : '2단계: 모범 해설 · 자기 점검'}
        </span>
        <h2 className="text-xl text-navy mt-1">
          {stage === 'my_doc'
            ? `${docMeta.label} 자료만 보고 해석을 적으세요`
            : '모범 해설과 비교하고 내 해석을 점검하세요'}
        </h2>
      </div>

      {/* Single Assigned Document Card */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-amber-800/30 p-4 shadow-sm">
        <DocRenderer box={box} docId={docId} />
      </div>

      {/* Student Interpretation Input (Editable in both Step 1 and Step 2) */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-amber-800/30 p-4 shadow-sm space-y-2">
        <label className="block text-xs font-bold text-amber-950 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <PencilLine className="w-4 h-4 text-amber-700" />
            <span>
              {isSubmitted ? '내 해석 (모범 해설을 참고해 고쳐 쓸 수 있어요)' : '내 자료 해석 쓰기'}
            </span>
          </span>
          {!canSubmit && (
            <span className="text-[11px] text-rose-600 font-semibold">필수 입력</span>
          )}
        </label>
        <textarea
          ref={textareaRef}
          value={interpretation}
          onChange={(e) => onInterpretationChange(e.target.value)}
          placeholder="이 자료에서 알 수 있는 자연·인문 환경 특징을 적어 보세요."
          rows={3}
          className="w-full text-xs p-3 rounded-xl border border-amber-800/30 bg-white focus:bg-amber-50/40 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700 text-stone-900 placeholder:text-stone-400 leading-relaxed resize-none shadow-inner"
        />

        {/* Step 1 Submit Button (disabled when empty) */}
        {!isSubmitted && (
          <button
            type="button"
            disabled={!canSubmit}
            onClick={onSubmitInterpretation}
            className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-2 ${
              canSubmit
                ? 'bg-sun text-navy active:scale-[0.98] cursor-pointer'
                : 'bg-white border border-navy/20 text-navy/40 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{canSubmit ? '해석 제출하고 모범 해설 보기' : '해석을 입력해야 제출할 수 있어요'}</span>
          </button>
        )}
      </div>

      {/* Step 2: Model Explanation + Self-Check (Unfolded after submission) */}
      {isSubmitted && (
        <div className="space-y-4">
          {/* Model Answer Card */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-amber-700/50 p-4 shadow-md space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950">
              <BookOpenCheck className="w-4 h-4 text-amber-800" />
              <span>모범 해설 ({docMeta.label})</span>
            </div>
            <p className="text-xs text-stone-800 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-800/15">
              {modelAnswer}
            </p>
          </div>

          {/* Self-check 3-choice buttons */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-amber-800/30 p-4 shadow-sm space-y-3">
            <div>
              <h3 className="text-xs font-black text-amber-950">
                자기 점검: 모범 해설과 내 해석을 비교해 보세요
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5">
                모범 해설과 내 해석이 얼마나 같은지 스스로 판단해 고르세요.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => chooseSelfCheck('same')}
                className={`min-h-[48px] py-2.5 px-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  selfCheck === 'same'
                    ? 'bg-emerald-600 border-emerald-700 text-navy shadow'
                    : 'bg-white border-amber-800/20 text-stone-800 hover:bg-emerald-50'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>같다</span>
              </button>

              <button
                type="button"
                onClick={() => chooseSelfCheck('partial')}
                className={`min-h-[48px] py-2.5 px-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  selfCheck === 'partial'
                    ? 'bg-sun border-navy text-navy'
                    : 'bg-white border-amber-800/20 text-stone-800 hover:bg-amber-50'
                }`}
              >
                <Triangle className="w-3.5 h-3.5" />
                <span>일부</span>
              </button>

              <button
                type="button"
                onClick={() => chooseSelfCheck('different')}
                className={`min-h-[48px] py-2.5 px-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  selfCheck === 'different'
                    ? 'bg-rose-600 border-rose-700 text-white shadow'
                    : 'bg-white border-amber-800/20 text-stone-800 hover:bg-rose-50'
                }`}
              >
                <X className="w-4 h-4" />
                <span>다르다</span>
              </button>
            </div>

            {selfCheck === 'partial' ? (
              <div className="border-l-4 border-sun bg-white px-3 py-2.5 text-xs leading-relaxed text-navy">
                <b>빠진 부분을 채워 볼까요?</b> 모범 해설에는 있지만 내 해석에는 없는 내용을 찾아 보세요.
                자료에서 <b>무엇을 보았는지</b>와 그것이 <b>어떤 기후·지역을 뜻하는지</b>까지 적어 해석을 보완해 보세요.
              </div>
            ) : selfCheck === 'different' ? (
              <div className="border-l-4 border-rust bg-white px-3 py-2.5 text-xs leading-relaxed text-navy">
                <b>근거부터 다시 찾아볼까요?</b> 모범 해설이 자료의 어느 부분을 보고 판단했는지 확인해 보세요.
                그 근거를 바탕으로 내 해석을 다시 써 보세요.
              </div>
            ) : null}
          </div>

          {/* CTA: '배송 전문가 모둠 모이기' */}
          <button
            type="button"
            disabled={!canProceedExpert}
            onClick={onGoToExpertGroup}
            className={`w-full min-h-[52px] py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              canProceedExpert
                ? 'bg-sun text-navy active:scale-[0.98] cursor-pointer'
                : 'bg-white border border-navy/20 text-navy/40 cursor-not-allowed'
            }`}
          >
            <Users className="w-4 h-4 text-amber-300" />
            <span>
              {canProceedExpert
                ? '배송 전문가 모둠 모이기'
                : selfCheck === null
                ? '자기 점검 후에 넘어갈 수 있어요'
                : '해석을 보완한 뒤 넘어갈 수 있어요'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
