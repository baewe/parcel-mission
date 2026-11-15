import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  X,
  ShieldAlert,
  BookOpen,
  Users,
  FileText,
} from 'lucide-react';
import {
  ADDRESS_OPTIONS,
  DeliveryBox,
  DocId,
  DOC_METAS,
} from '../data';
import { FullScreenClueModal } from './FullScreenClueModal';

interface AddressCompleteViewProps {
  box: DeliveryBox;
  notes: Record<DocId, string>;
  selectedRegion: string;
  selectedEquatorSide: string;
  selectedEnvironment: string;
  decisiveDocId: DocId | null;
  onChangeRegion: (val: string) => void;
  onChangeEquatorSide: (val: string) => void;
  onChangeEnvironment: (val: string) => void;
  onSelectDecisiveDoc: (docId: DocId) => void;
  onAddressAllCorrect: () => void;
  onGoToHomeGroup: () => void;
}

export const AddressCompleteView: React.FC<AddressCompleteViewProps> = ({
  box,
  notes,
  selectedRegion,
  selectedEquatorSide,
  selectedEnvironment,
  decisiveDocId,
  onChangeRegion,
  onChangeEquatorSide,
  onChangeEnvironment,
  onSelectDecisiveDoc,
  onAddressAllCorrect,
  onGoToHomeGroup,
}) => {
  const [isClueModalOpen, setIsClueModalOpen] = useState<boolean>(false);
  const hasTriggeredCelebrationRef = useRef<boolean>(false);

  const isRegionCorrect = selectedRegion === box.address.region;
  const isEquatorCorrect = selectedEquatorSide === box.address.equatorSide;
  const isEnvCorrect = selectedEnvironment === box.address.environment;

  const isAllThreeCorrect = isRegionCorrect && isEquatorCorrect && isEnvCorrect;

  useEffect(() => {
    if (isAllThreeCorrect && !hasTriggeredCelebrationRef.current) {
      hasTriggeredCelebrationRef.current = true;
      onAddressAllCorrect();
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#D97706', '#DC2626', '#059669', '#F59E0B'],
        });
      } catch {
        // ignore if confetti fails
      }
    }
  }, [isAllThreeCorrect, onAddressAllCorrect]);

  const docOrder: DocId[] = ['1', '2', '3', '4'];

  return (
    <div className="w-full max-w-md mx-auto p-4 pb-24 space-y-4">
      {/* Revealed City Banner */}
      <div className="bg-[#FAF3E0] rounded-2xl border-2 border-amber-800/40 p-4 shadow-md text-center relative overflow-hidden">
        <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-400 px-2.5 py-0.5 rounded-full mb-1.5">
          4단계: 주소 문장 완성
        </span>
        <h2 className="text-2xl font-black text-amber-950 tracking-tight">
          배송지: {box.cityName}({box.countryName})
        </h2>
        <div className="mt-2.5 bg-rose-50 border border-rose-300 rounded-xl px-3 py-2 flex items-center justify-center gap-1.5 text-rose-900 text-xs font-bold">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>도시 이름은 배송 회의 전까지 비밀!</span>
        </div>
      </div>

      {/* Header + Clue Review Trigger */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-amber-700" />
          <span>세 빈칸을 모두 맞혀 주소를 완성하세요</span>
        </span>
        <button
          type="button"
          onClick={() => setIsClueModalOpen(true)}
          className="flex items-center gap-1 text-xs font-bold bg-[#FAF6EE] text-amber-900 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-800/25 shadow-sm cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>단서 보기</span>
        </button>
      </div>

      {/* Live Address Sentence Card */}
      <div className="bg-[#FAF6EE] p-4 rounded-2xl border-2 border-amber-800/25 shadow-inner">
        <p className="text-sm font-bold text-stone-800 leading-loose">
          "이 도시는 아프리카{' '}
          <span
            className={`inline-block px-2 py-0.5 rounded border font-black ${
              !selectedRegion
                ? 'bg-white border-amber-400 text-stone-400'
                : isRegionCorrect
                ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                : 'bg-rose-100 border-rose-400 text-rose-900'
            }`}
          >
            {selectedRegion || '칸1'}
          </span>
          에 있고, 적도의{' '}
          <span
            className={`inline-block px-2 py-0.5 rounded border font-black ${
              !selectedEquatorSide
                ? 'bg-white border-amber-400 text-stone-400'
                : isEquatorCorrect
                ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                : 'bg-rose-100 border-rose-400 text-rose-900'
            }`}
          >
            {selectedEquatorSide || '칸2'}
          </span>
          에 있으며,{' '}
          <span
            className={`inline-block px-2 py-0.5 rounded border font-black ${
              !selectedEnvironment
                ? 'bg-white border-amber-400 text-stone-400'
                : isEnvCorrect
                ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                : 'bg-rose-100 border-rose-400 text-rose-900'
            }`}
          >
            {selectedEnvironment || '칸3'}
          </span>
          에 자리 잡고 있다."
        </p>
      </div>

      {/* Blank 1: Region */}
      <div className="bg-[#FFFDF9] rounded-2xl border-2 border-amber-800/25 p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-950">칸 1. 아프리카의 어느 지역인가요?</span>
          {selectedRegion && (
            <span
              className={`text-xs font-extrabold flex items-center gap-1 ${
                isRegionCorrect ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {isRegionCorrect ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> 정답
                </>
              ) : (
                <>
                  <X className="w-4 h-4 stroke-[3]" /> 오답
                </>
              )}
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {ADDRESS_OPTIONS.region.map((opt) => {
            const isPicked = selectedRegion === opt;
            const correctStyle = isPicked && isRegionCorrect;
            const wrongStyle = isPicked && !isRegionCorrect;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChangeRegion(opt)}
                className={`min-h-[44px] rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  correctStyle
                    ? 'bg-emerald-600 border-emerald-700 text-white shadow'
                    : wrongStyle
                    ? 'bg-rose-600 border-rose-700 text-white shadow'
                    : 'bg-white border-amber-800/20 text-stone-800 hover:bg-amber-50'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selectedRegion && !isRegionCorrect && (
          <p className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
            ✘ 단서 자료를 다시 보세요
          </p>
        )}
      </div>

      {/* Blank 2: Equator Side */}
      <div className="bg-[#FFFDF9] rounded-2xl border-2 border-amber-800/25 p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-950">칸 2. 적도의 어느 쪽에 있나요?</span>
          {selectedEquatorSide && (
            <span
              className={`text-xs font-extrabold flex items-center gap-1 ${
                isEquatorCorrect ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {isEquatorCorrect ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> 정답
                </>
              ) : (
                <>
                  <X className="w-4 h-4 stroke-[3]" /> 오답
                </>
              )}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ADDRESS_OPTIONS.equatorSide.map((opt) => {
            const isPicked = selectedEquatorSide === opt;
            const correctStyle = isPicked && isEquatorCorrect;
            const wrongStyle = isPicked && !isEquatorCorrect;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChangeEquatorSide(opt)}
                className={`min-h-[44px] rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                  correctStyle
                    ? 'bg-emerald-600 border-emerald-700 text-white shadow'
                    : wrongStyle
                    ? 'bg-rose-600 border-rose-700 text-white shadow'
                    : 'bg-white border-amber-800/20 text-stone-800 hover:bg-amber-50'
                }`}
              >
                적도의 {opt}
              </button>
            );
          })}
        </div>

        {selectedEquatorSide && !isEquatorCorrect && (
          <p className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
            ✘ 단서 자료를 다시 보세요
          </p>
        )}
      </div>

      {/* Blank 3: Natural Environment */}
      <div className="bg-[#FFFDF9] rounded-2xl border-2 border-amber-800/25 p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-950">칸 3. 어떤 자연환경에 자리 잡고 있나요?</span>
          {selectedEnvironment && (
            <span
              className={`text-xs font-extrabold flex items-center gap-1 shrink-0 ${
                isEnvCorrect ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {isEnvCorrect ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" /> 정답
                </>
              ) : (
                <>
                  <X className="w-4 h-4 stroke-[3]" /> 오답
                </>
              )}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {ADDRESS_OPTIONS.environment.map((opt) => {
            const isPicked = selectedEnvironment === opt;
            const correctStyle = isPicked && isEnvCorrect;
            const wrongStyle = isPicked && !isEnvCorrect;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChangeEnvironment(opt)}
                className={`w-full min-h-[44px] px-3 py-2 rounded-xl border-2 text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                  correctStyle
                    ? 'bg-emerald-600 border-emerald-700 text-white shadow'
                    : wrongStyle
                    ? 'bg-rose-600 border-rose-700 text-white shadow'
                    : 'bg-white border-amber-800/20 text-stone-800 hover:bg-amber-50'
                }`}
              >
                <span>{opt}</span>
                {correctStyle && <Check className="w-4 h-4 shrink-0" />}
                {wrongStyle && <X className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>

        {selectedEnvironment && !isEnvCorrect && (
          <p className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200">
            ✘ 단서 자료를 다시 보세요
          </p>
        )}
      </div>

      {/* Delivery Completed Stamp + Decisive Document Selection (Unlocks ONLY when all 3 are correct!) */}
      {isAllThreeCorrect && (
        <div className="space-y-4 pt-2">
          <div className="relative bg-[#FFFDF8] rounded-2xl border-4 border-[#854D0E] p-5 shadow-xl overflow-hidden">
            {/* Red Stamp Animation */}
            <div className="flex justify-center mb-3">
              <div className="animate-stamp inline-block border-4 border-red-600 text-red-600 rounded-xl px-4 py-2 font-black text-center shadow-lg bg-white/90 select-none">
                <div className="text-[10px] uppercase tracking-widest font-mono">
                  AFRI-EXPRESS
                </div>
                <div className="text-2xl tracking-tight leading-none my-0.5">
                  배송 완료
                </div>
                <div className="text-[9px] font-mono tracking-wider">
                  DELIVERY COMPLETED
                </div>
              </div>
            </div>

            <div className="bg-[#FAF4E6] p-4 rounded-xl border border-amber-800/25 text-center">
              <span className="text-[11px] font-bold text-amber-800 block mb-1">
                완성된 배송 주소
              </span>
              <p className="text-base font-black text-amber-950 leading-relaxed">
                "이 도시는 아프리카{' '}
                <span className="text-red-700 underline">{selectedRegion}</span>에 있고, 적도의{' '}
                <span className="text-red-700 underline">{selectedEquatorSide}</span>에 있으며,{' '}
                <span className="text-red-700 underline">{selectedEnvironment}</span>에 자리 잡고 있다."
              </p>
            </div>
          </div>

          {/* Decisive Document Selection (①~④) */}
          <div className="bg-[#FFFDF9] rounded-2xl border-2 border-amber-800/30 p-4 shadow-sm space-y-3">
            <div>
              <h3 className="text-xs font-black text-amber-950">
                🔍 이 도시를 찾는 데 가장 결정적이었던 자료는?
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5">
                ①~④ 중 하나를 고르면 원모둠 지도로 이동할 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {docOrder.map((dId) => {
                const meta = DOC_METAS[dId];
                const isSelected = decisiveDocId === dId;
                return (
                  <button
                    key={dId}
                    type="button"
                    onClick={() => onSelectDecisiveDoc(dId)}
                    className={`min-h-[46px] p-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-800 border-amber-900 text-white shadow'
                        : 'bg-white border-amber-800/25 text-stone-800 hover:bg-amber-50'
                    }`}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA to Step 5: 원모둠 지도 */}
          <button
            type="button"
            disabled={!decisiveDocId}
            onClick={onGoToHomeGroup}
            className={`w-full min-h-[52px] py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              decisiveDocId
                ? 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white cursor-pointer'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {decisiveDocId
                ? '원모둠으로 돌아가기 (5단계 원모둠 지도)'
                : '결정적 자료 ①~④ 중 하나를 고르세요'}
            </span>
          </button>
        </div>
      )}

      {/* Full-Screen Clue Review Modal */}
      <FullScreenClueModal
        isOpen={isClueModalOpen}
        box={box}
        notes={notes}
        onClose={() => setIsClueModalOpen(false)}
      />
    </div>
  );
};
