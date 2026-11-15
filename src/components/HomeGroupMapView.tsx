import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import confetti from 'canvas-confetti';
import {
  Check,
  X,
  Trophy,
  BookOpen,
  RotateCcw,
  Users,
} from 'lucide-react';
import { BoxId, DELIVERY_BOXES, DeliveryBox, DocId } from '../data';
import { FullScreenClueModal } from './FullScreenClueModal';

interface HomeGroupMapViewProps {
  myBox: DeliveryBox;
  notes: Record<DocId, string>;
  guesses: Partial<Record<BoxId, number>>;
  onGuessBox: (targetBoxId: BoxId, pickedPin: number) => void;
  onAllGuessed: () => void;
  onResetAll: () => void;
}

const ALL_BOXES = Object.values(DELIVERY_BOXES);

export const HomeGroupMapView: React.FC<HomeGroupMapViewProps> = ({
  myBox,
  notes,
  guesses,
  onGuessBox,
  onAllGuessed,
  onResetAll,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  const hasCelebratedRef = useRef<boolean>(false);

  const [isClueModalOpen, setIsClueModalOpen] = useState<boolean>(false);

  const otherBoxes = ALL_BOXES.filter((b) => b.id !== myBox.id);
  const answeredCount = otherBoxes.filter((b) => guesses[b.id] !== undefined).length;
  const isAllFinished = answeredCount === otherBoxes.length;
  const correctCount = otherBoxes.filter(
    (b) => guesses[b.id] === b.pinNumber
  ).length;

  useEffect(() => {
    if (isAllFinished && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      onAllGuessed();
      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [isAllFinished, onAllGuessed]);

  const buildPinHtml = (b: DeliveryBox, showCityLabel: boolean, isMine: boolean) => {
    const bg = isMine
      ? '#059669'
      : showCityLabel
      ? '#B45309'
      : '#451A03';
    const border = showCityLabel ? '#FDE68A' : '#FFFFFF';

    return `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
        <div style="width: 32px; height: 32px; border-radius: 9999px; background: ${bg}; border: 2px solid ${border}; color: #FFFFFF; font-weight: 900; font-size: 15px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.45);">
          ${b.pinCircle}
        </div>
        ${
          showCityLabel
            ? `<div style="margin-top: 2px; background: rgba(28, 25, 23, 0.92); color: #FEF3C7; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 6px; white-space: nowrap; border: 1px solid rgba(251,191,36,0.5); box-shadow: 0 2px 4px rgba(0,0,0,0.4);">
                ${b.id}. ${b.cityName}
              </div>`
            : ''
        }
      </div>
    `;
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [0.0, 20.0],
      zoom: 3.1,
      minZoom: 2.5,
      maxZoom: 8,
      zoomControl: true,
      attributionControl: true,
      maxBounds: [
        [-45, -35],
        [45, 65],
      ],
      maxBoundsViscosity: 0.8,
    });

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 18,
      }
    ).addTo(map);

    // Equator dashed red line
    L.polyline(
      [
        [0, -25],
        [0, 55],
      ],
      {
        color: '#EF4444',
        weight: 2.5,
        dashArray: '6, 8',
        opacity: 0.9,
      }
    ).addTo(map);

    ALL_BOXES.forEach((b) => {
      const isMine = b.id === myBox.id;
      const showLabel = isMine || guesses[b.id] !== undefined || isAllFinished;
      const icon = L.divIcon({
        className: 'home-group-pin',
        html: buildPinHtml(b, showLabel, isMine),
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([b.lat, b.lng], { icon }).addTo(map);
      markersRef.current[b.pinNumber] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Update markers whenever guesses or completion change
  useEffect(() => {
    ALL_BOXES.forEach((b) => {
      const marker = markersRef.current[b.pinNumber];
      if (!marker) return;
      const isMine = b.id === myBox.id;
      const showLabel = isMine || guesses[b.id] !== undefined || isAllFinished;
      marker.setIcon(
        L.divIcon({
          className: 'home-group-pin',
          html: buildPinHtml(b, showLabel, isMine),
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        })
      );
    });
  }, [guesses, isAllFinished, myBox.id]);

  return (
    <div className="w-full max-w-md mx-auto p-3 pb-24 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>5단계: 원모둠 지도</span>
          </span>
          <h2 className="text-base font-black text-amber-950 mt-0.5">
            친구 설명을 듣고 나머지 택배를 찾으세요
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsClueModalOpen(true)}
          className="flex items-center gap-1 text-xs font-bold bg-[#FAF6EE] text-amber-900 hover:bg-amber-100 px-2.5 py-2 rounded-lg border border-amber-800/30 shadow-sm shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>내 택배 요약</span>
        </button>
      </div>

      {/* My Solved Parcel Reminder */}
      <div className="bg-emerald-50 border border-emerald-400 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
        <span className="font-bold text-emerald-950">
          ✅ 내 택배({myBox.id}): {myBox.pinCircle} {myBox.cityName}({myBox.countryName})
        </span>
        <span className="font-mono font-bold text-emerald-800">
          {answeredCount} / 4 완료
        </span>
      </div>

      {/* Map displaying ①~⑤ (reveals city names as solved / all 5 when finished) */}
      <div className="relative w-full h-[38vh] min-h-[250px] max-h-[340px] rounded-2xl overflow-hidden border-2 border-amber-900/40 shadow-lg">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Final Score Banner when all 4 are finished */}
      {isAllFinished && (
        <div className="bg-[#FAF3E0] border-2 border-amber-800 rounded-2xl p-4 shadow-md text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-800 text-amber-100 px-3 py-1 rounded-full text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>원모둠 미션 완료!</span>
          </div>
          <p className="text-2xl font-black text-amber-950">
            내가 맞힌 수 {correctCount}/4
          </p>
          <p className="text-xs text-stone-700">
            위 지도에 아프리카 다섯 도시의 위치와 이름이 모두 표시되었습니다.
          </p>
        </div>
      )}

      {/* Remaining 4 Parcel Cards */}
      <div className="space-y-2.5">
        {otherBoxes.map((targetBox) => {
          const pickedNum = guesses[targetBox.id];
          const hasPicked = pickedNum !== undefined;
          const isCorrect = pickedNum === targetBox.pinNumber;

          return (
            <div
              key={targetBox.id}
              className={`rounded-2xl border-2 p-3.5 shadow-sm transition-all ${
                !hasPicked
                  ? 'bg-[#FFFDF9] border-amber-800/25'
                  : isCorrect
                  ? 'bg-emerald-50 border-emerald-500'
                  : 'bg-rose-50 border-rose-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-50 font-black text-xs">
                    {targetBox.codeName}
                  </span>
                  {hasPicked ? (
                    <span className="text-sm font-black text-stone-900">
                      {targetBox.cityName} ({targetBox.countryName})
                    </span>
                  ) : (
                    <span className="text-xs text-stone-500 font-medium">
                      친구의 설명을 듣고 번호 선택
                    </span>
                  )}
                </div>

                {hasPicked && (
                  <span
                    className={`text-xs font-extrabold flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" /> 정답 ({targetBox.pinCircle})
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 stroke-[3]" /> 오답 (정답 {targetBox.pinCircle})
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* ①~⑤ Selector Row */}
              <div className="grid grid-cols-5 gap-1.5">
                {ALL_BOXES.map((pinBox) => {
                  const isThisPicked = pickedNum === pinBox.pinNumber;
                  const isThisAnswer = targetBox.pinNumber === pinBox.pinNumber;

                  let btnStyle =
                    'bg-white border-amber-800/20 text-stone-800 hover:bg-amber-50';
                  if (hasPicked) {
                    if (isThisAnswer) {
                      btnStyle =
                        'bg-emerald-600 border-emerald-700 text-white font-black';
                    } else if (isThisPicked && !isCorrect) {
                      btnStyle =
                        'bg-rose-600 border-rose-700 text-white font-black';
                    } else {
                      btnStyle =
                        'bg-white/60 border-stone-200 text-stone-400';
                    }
                  }

                  return (
                    <button
                      key={pinBox.pinNumber}
                      type="button"
                      disabled={hasPicked}
                      onClick={() => onGuessBox(targetBox.id, pinBox.pinNumber)}
                      className={`min-h-[44px] rounded-xl border-2 font-bold text-sm transition-all ${
                        hasPicked ? 'cursor-default' : 'cursor-pointer active:scale-95'
                      } ${btnStyle}`}
                    >
                      {pinBox.pinCircle}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset Mission Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onResetAll}
          className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-white hover:bg-amber-50 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 border border-amber-800/30 shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-amber-700" />
          <span>새로운 택배·자료로 처음부터 다시하기</span>
        </button>
      </div>

      {/* Full-Screen My Clue Modal for explaining to friends */}
      <FullScreenClueModal
        isOpen={isClueModalOpen}
        box={myBox}
        notes={notes}
        onClose={() => setIsClueModalOpen(false)}
      />
    </div>
  );
};
