import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  X,
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

type Field = 'region' | 'equatorSide' | 'environment';

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

  const current: Record<Field, string> = {
    region: selectedRegion,
    equatorSide: selectedEquatorSide,
    environment: selectedEnvironment,
  };
  const answer: Record<Field, string> = {
    region: box.address.region,
    equatorSide: box.address.equatorSide,
    environment: box.address.environment,
  };
  const allCorrectNow = (Object.keys(answer) as Field[]).every((f) => current[f] === answer[f]);

  // '정답 확인하기'를 누른 순간의 선택을 기억 (이미 다 맞힌 상태로 돌아오면 확인된 것으로 봄)
  const [checked, setChecked] = useState<Record<Field, string> | null>(
    allCorrectNow ? { ...current } : null
  );

  // 확인한 뒤 바꾸지 않은 칸만 결과 표시
  const resultOf = (f: Field): 'correct' | 'wrong' | null => {
    if (!checked || !current[f] || checked[f] !== current[f]) return null;
    return current[f] === answer[f] ? 'correct' : 'wrong';
  };
  const isDone = (Object.keys(answer) as Field[]).every((f) => resultOf(f) === 'correct');
  const allFilled = !!(selectedRegion && selectedEquatorSide && selectedEnvironment);

  useEffect(() => {
    if (isDone && !hasTriggeredCelebrationRef.current) {
      hasTriggeredCelebrationRef.current = true;
      onAddressAllCorrect();
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#9480BD', '#B1D992', '#274480', '#F5BA53', '#BD651D'],
        });
      } catch {
        // ignore if confetti fails
      }
    }
  }, [isDone, onAddressAllCorrect]);

  const blankClass = (f: Field) => {
    const r = resultOf(f);
    if (!current[f]) return 'bg-white border-navy/40 text-navy/40';
    if (r === 'correct') return 'bg-leaf border-navy text-navy';
    if (r === 'wrong') return 'bg-rust border-rust text-white';
    return 'bg-lav border-lav text-white';
  };

  const optionClass = (f: Field, opt: string) => {
    if (current[f] !== opt) return 'bg-white border-navy/30 text-navy';
    const r = resultOf(f);
    if (r === 'correct') return 'bg-leaf border-navy text-navy';
    if (r === 'wrong') return 'bg-rust border-rust text-white';
    return 'bg-lav border-navy text-white';
  };

  const ResultTag = ({ f }: { f: Field }) => {
    const r = resultOf(f);
    if (r === 'correct')
      return (
        <span className="text-xs font-bold flex items-center gap-1 text-navy bg-leaf px-2 py-0.5 rounded shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[3]" /> 정답
        </span>
      );
    if (r === 'wrong')
      return (
        <span className="text-xs font-bold flex items-center gap-1 text-white bg-rust px-2 py-0.5 rounded shrink-0">
          <X className="w-3.5 h-3.5 stroke-[3]" /> 다시 골라 보세요
        </span>
      );
    return null;
  };

  const choose = (f: Field, val: string) => {
    if (isDone) return;
    if (f === 'region') onChangeRegion(val);
    if (f === 'equatorSide') onChangeEquatorSide(val);
    if (f === 'environment') onChangeEnvironment(val);
  };

  return (
    <div className="w-full mx-auto p-4 pb-24 space-y-4">
      {/* 배송지 공개 */}
      <div className="bg-white border border-navy/15 rounded-2xl p-4 text-center">
        <span className="inline-block text-[11px] font-bold text-navy bg-sun px-2.5 py-0.5 rounded mb-1.5">
          4단계: 주소 문장 완성
        </span>
        <h2 className="text-2xl text-navy">
          배송지: {box.cityName}({box.countryName})
        </h2>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-bold text-navy flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          <span>세 빈칸을 채워 주소를 완성하세요</span>
        </span>
        <button
          type="button"
          onClick={() => setIsClueModalOpen(true)}
          className="flex items-center gap-1 text-xs font-bold bg-white text-navy px-2.5 py-1.5 rounded-lg cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>단서 보기</span>
        </button>
      </div>

      {/* 주소 문장 */}
      <div className="bg-white border border-navy/15 p-4 rounded-2xl">
        <p className="text-sm font-bold text-navy leading-loose">
          "이 도시는 아프리카{' '}
          <span className={`inline-block px-2 py-0.5 rounded border ${blankClass('region')}`}>
            {selectedRegion || '칸1'}
          </span>
          에 있고, 적도의{' '}
          <span className={`inline-block px-2 py-0.5 rounded border ${blankClass('equatorSide')}`}>
            {selectedEquatorSide || '칸2'}
          </span>
          에 있으며,{' '}
          <span className={`inline-block px-2 py-0.5 rounded border ${blankClass('environment')}`}>
            {selectedEnvironment || '칸3'}
          </span>
          에 자리 잡고 있다."
        </p>
      </div>

      {/* 칸 1 */}
      <div className="bg-white border border-navy/15 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-navy">칸 1. 아프리카의 어느 지역인가요?</span>
          <ResultTag f="region" />
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {ADDRESS_OPTIONS.region.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => choose('region', opt)}
              className={`min-h-[44px] rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${optionClass('region', opt)}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 칸 2 */}
      <div className="bg-white border border-navy/15 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-navy">칸 2. 적도의 어느 쪽에 있나요?</span>
          <ResultTag f="equatorSide" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ADDRESS_OPTIONS.equatorSide.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => choose('equatorSide', opt)}
              className={`min-h-[44px] rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${optionClass('equatorSide', opt)}`}
            >
              적도의 {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 칸 3 */}
      <div className="bg-white border border-navy/15 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-navy">칸 3. 어떤 자연환경에 자리 잡고 있나요?</span>
          <ResultTag f="environment" />
        </div>
        <div className="space-y-1.5">
          {ADDRESS_OPTIONS.environment.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => choose('environment', opt)}
              className={`w-full min-h-[44px] px-3 py-2 rounded-xl border-2 text-sm font-bold text-left transition-all cursor-pointer ${optionClass('environment', opt)}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 정답 확인 */}
      {!isDone && (
        <button
          type="button"
          disabled={!allFilled}
          onClick={() => setChecked({ ...current })}
          className={`w-full min-h-[52px] rounded-xl font-bold text-sm transition-all ${
            allFilled ? 'bg-sun text-navy cursor-pointer active:scale-[0.98]' : 'bg-white border border-navy/20 text-navy/40 cursor-not-allowed'
          }`}
        >
          {allFilled ? '정답 확인하기' : '세 칸을 모두 고른 뒤 정답을 확인하세요'}
        </button>
      )}

      {/* 배송 완료 */}
      {isDone && (
        <div className="space-y-4 pt-2">
          <div className="bg-white border border-navy/15 rounded-2xl p-5">
            <div className="flex justify-center mb-3">
              <div className="animate-stamp inline-block border-4 border-rust text-rust rounded-lg px-5 py-2 text-center select-none">
                <div className="text-3xl leading-none">배송 완료</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-navy/20 text-center">
              <span className="text-xs font-bold text-navy/70 block mb-1">완성된 배송 주소</span>
              <p className="text-base font-bold text-navy leading-relaxed">
                "이 도시는 아프리카 <u>{selectedRegion}</u>에 있고, 적도의 <u>{selectedEquatorSide}</u>에
                있으며, <u>{selectedEnvironment}</u>에 자리 잡고 있다."
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoToHomeGroup}
            className="w-full min-h-[52px] py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all bg-sun text-navy active:scale-[0.98] cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>택배센터 모둠으로 돌아가기</span>
          </button>
        </div>
      )}

      <FullScreenClueModal
        isOpen={isClueModalOpen}
        box={box}
        notes={notes}
        onClose={() => setIsClueModalOpen(false)}
      />
    </div>
  );
};
