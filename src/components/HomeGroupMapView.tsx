import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import confetti from 'canvas-confetti';
import {
  Check,
  X,
  BookOpen,
  RotateCcw,
  Users,
} from 'lucide-react';
import { BoxId, DELIVERY_BOXES, DeliveryBox, DocId, DOC_METAS } from '../data';
import { FullScreenClueModal } from './FullScreenClueModal';

interface HomeGroupMapViewProps {
  myBox: DeliveryBox;
  notes: Record<DocId, string>;
  guesses: Partial<Record<BoxId, number>>;
  friendNotes: Partial<Record<BoxId, string>>;
  onFriendNoteChange: (boxId: BoxId, value: string) => void;
  onGuessBox: (targetBoxId: BoxId, pickedPin: number) => void;
  onAllGuessed: () => void;
  onResetAll: () => void;
}

const ALL_BOXES = Object.values(DELIVERY_BOXES); // 택배 글자 순서
const PIN_ORDER = [...ALL_BOXES].sort((a, b) => a.pinNumber - b.pinNumber); // 지도 번호 순서

export const HomeGroupMapView: React.FC<HomeGroupMapViewProps> = ({
  myBox,
  notes,
  guesses,
  friendNotes,
  onFriendNoteChange,
  onGuessBox,
  onAllGuessed,
  onResetAll,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  // 이미 다 맞힌 상태로 다시 들어오면 축하 알림을 다시 띄우지 않음
  const hasCelebratedRef = useRef<boolean>(
    ALL_BOXES.filter((b) => b.id !== myBox.id).every((b) => guesses[b.id] === b.pinNumber)
  );

  const [isClueModalOpen, setIsClueModalOpen] = useState<boolean>(false);
  const [showDoneOverlay, setShowDoneOverlay] = useState<boolean>(false);
  // 설명할 친구가 없는 택배: 그 택배의 자료를 직접 보기
  const [selfStudyBoxId, setSelfStudyBoxId] = useState<BoxId | null>(null);
  const selfStudyBox = selfStudyBoxId ? DELIVERY_BOXES[selfStudyBoxId] : null;
  // 고르기만 한 번호 (정답 확인 전)
  const [pending, setPending] = useState<Partial<Record<BoxId, number>>>({});

  const otherBoxes = ALL_BOXES.filter((b) => b.id !== myBox.id);
  const isSolved = (b: DeliveryBox) => guesses[b.id] === b.pinNumber;
  const isAllFinished = otherBoxes.every(isSolved);
  const hasMemo = (b: DeliveryBox) => (friendNotes[b.id] || '').trim().length > 0;
  // 설명 메모를 적고 번호를 고른 택배만 정답 확인 가능
  const hasPending = otherBoxes.some((b) => !isSolved(b) && hasMemo(b) && pending[b.id] !== undefined);

  const handleCheckAll = () => {
    otherBoxes.forEach((b) => {
      const pick = pending[b.id];
      if (!isSolved(b) && hasMemo(b) && pick !== undefined) onGuessBox(b.id, pick);
    });
    setPending({});
  };

  useEffect(() => {
    if (isAllFinished && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      onAllGuessed();
      setShowDoneOverlay(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#9480BD', '#B1D992', '#274480', '#F5BA53', '#BD651D'],
        });
      } catch {
        // ignore
      }
    }
  }, [isAllFinished, onAllGuessed]);

  const buildPinHtml = (b: DeliveryBox, showCityLabel: boolean, isMine: boolean) => {
    const bg = showCityLabel ? '#B1D992' : '#F5BA53';

    return `
      <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
        <div style="width: 36px; height: 36px; border-radius: 9999px; background: ${bg}; border: 3px solid ${isMine ? '#FFFFFF' : '#274480'}; color: #274480; font-family: 'Pretendard Variable', sans-serif; font-weight: 800; font-size: 18px; line-height: 1; display: flex; align-items: center; justify-content: center;">
          ${b.pinCircle}
        </div>
        ${
          showCityLabel
            ? `<div style="margin-top: 3px; background: #274480; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 3px; white-space: nowrap;">
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

    // 적도: 흰 점선 (눌리지 않음)
    L.polyline(
      [
        [0, -25],
        [0, 55],
      ],
      {
        color: '#FFFFFF',
        weight: 2,
        dashArray: '6, 8',
        opacity: 0.9,
        interactive: false,
      }
    ).addTo(map);

    ALL_BOXES.forEach((b) => {
      const isMine = b.id === myBox.id;
      const showLabel = isMine || guesses[b.id] === b.pinNumber;
      const icon = L.divIcon({
        className: 'home-group-pin',
        html: buildPinHtml(b, showLabel, isMine),
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([b.lat, b.lng], { icon, interactive: false }).addTo(map);
      markersRef.current[b.pinNumber] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // 정답을 맞힌 택배만 도시 이름 표시
  useEffect(() => {
    ALL_BOXES.forEach((b) => {
      const marker = markersRef.current[b.pinNumber];
      if (!marker) return;
      const isMine = b.id === myBox.id;
      const showLabel = isMine || guesses[b.id] === b.pinNumber;
      marker.setIcon(
        L.divIcon({
          className: 'home-group-pin',
          html: buildPinHtml(b, showLabel, isMine),
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        })
      );
    });
  }, [guesses, myBox.id]);

  return (
    <div className="w-full mx-auto p-3 pb-24 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold text-navy bg-sun px-2 py-0.5 rounded inline-flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>5단계: 원모둠 지도</span>
          </span>
          <h2 className="text-lg text-navy mt-1">
            친구 설명을 듣고 나머지 택배를 찾으세요
          </h2>
        </div>

      </div>

      {isAllFinished && (
        <div className="bg-leaf rounded-2xl px-4 py-6 text-center text-navy border-2 border-navy">
          <p className="font-display text-3xl md:text-4xl leading-tight">모든 택배의 주소를 찾았어요!</p>
          <p className="text-sm mt-2">지도에 아프리카 다섯 도시의 위치와 이름이 모두 표시되었어요.</p>
        </div>
      )}

      {/* 내 택배 + 내가 적은 단서 노트 (친구들에게 설명할 때 보는 곳) */}
      <div className="bg-white rounded-2xl p-4 space-y-3 border-4 border-sun">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display text-lg text-navy leading-tight">내가 적은 단서 노트</p>
            <p className="text-xs text-navy/70 mt-0.5">
              내 택배({myBox.id}): 지도 {myBox.pinCircle}번 · {myBox.cityName}({myBox.countryName})
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsClueModalOpen(true)}
            className="flex items-center gap-1 text-xs font-bold bg-navy text-white px-2.5 py-1.5 rounded-lg shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>자료 사진 보기</span>
          </button>
        </div>
        <ul className="space-y-2">
          {(['1', '2', '3', '4'] as DocId[])
            .filter((dId) => notes[dId]?.trim())
            .map((dId) => (
              <li key={dId} className="text-sm text-navy leading-relaxed">
                <span className="inline-block font-bold text-xs bg-sun text-navy px-1.5 py-0.5 rounded mr-1.5">
                  {DOC_METAS[dId].label}
                </span>
                {notes[dId]}
              </li>
            ))}
        </ul>
      </div>

      {/* Map */}
      <div className="relative isolate z-0 w-full h-[38vh] md:h-[52vh] min-h-[250px] max-h-[340px] md:max-h-[560px] rounded-2xl overflow-hidden border border-navy/20">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>


      {/* 나머지 4개 택배 */}
      <div className="space-y-2.5">
        {otherBoxes.map((targetBox) => {
          const solved = isSolved(targetBox);
          const committed = guesses[targetBox.id];
          const wasWrong = !solved && committed !== undefined;
          const current = solved ? targetBox.pinNumber : pending[targetBox.id];

          return (
            <div
              key={targetBox.id}
              className={`rounded-2xl border-2 p-3.5 bg-white ${
                solved ? 'border-leaf' : wasWrong && current === undefined ? 'border-rust' : 'border-navy/15'
              }`}
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-navy text-white font-bold text-xs">
                    {targetBox.codeName}
                  </span>
                  {solved ? (
                    <span className="text-sm font-bold text-navy">
                      {targetBox.cityName} ({targetBox.countryName})
                    </span>
                  ) : (
                    <span className="text-xs text-navy/70">친구 설명을 적고 번호 선택</span>
                  )}
                </div>

                {solved && (
                  <span className="text-xs font-bold flex items-center gap-1 text-navy bg-leaf px-2 py-0.5 rounded">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> 정답
                  </span>
                )}
                {wasWrong && current === undefined && (
                  <span className="text-xs font-bold flex items-center gap-1 text-white bg-rust px-2 py-0.5 rounded">
                    <X className="w-3.5 h-3.5 stroke-[3]" /> 다시 들어 보세요
                  </span>
                )}
              </div>

              <textarea
                value={friendNotes[targetBox.id] || ''}
                onChange={(e) => onFriendNoteChange(targetBox.id, e.target.value)}
                readOnly={solved}
                rows={2}
                placeholder="친구가 말한 주소를 간단히 적어 보세요. (지역, 적도의 어느 쪽, 자연환경)"
                className="w-full text-sm p-2.5 mb-2 rounded-lg border border-navy/25 bg-white text-navy placeholder:text-navy/40 focus:outline-none focus:border-navy resize-none"
              />

              {!solved && (
                <div className="-mt-1 mb-2 text-right">
                  <button
                    type="button"
                    onClick={() => setSelfStudyBoxId(targetBox.id)}
                    className="text-[11px] text-navy/60 underline underline-offset-2 cursor-pointer"
                  >
                    설명해 줄 친구가 없나요? 자료 보기
                  </button>
                </div>
              )}

              <div className="grid grid-cols-5 gap-1.5">
                {PIN_ORDER.map((pinBox) => {
                  const locked = !solved && !hasMemo(targetBox);
                  const isThisPicked = current === pinBox.pinNumber;
                  let btnStyle = 'bg-white border-navy/30 text-navy';
                  if (solved) {
                    btnStyle = isThisPicked ? 'bg-leaf border-navy text-navy' : 'bg-white border-navy/10 text-navy/30';
                  } else if (locked) {
                    btnStyle = 'bg-white border-navy/10 text-navy/25';
                  } else if (isThisPicked) {
                    btnStyle = 'bg-lav border-navy text-white';
                  }

                  return (
                    <button
                      key={pinBox.pinNumber}
                      type="button"
                      disabled={solved || locked}
                      onClick={() =>
                        setPending((prev) => ({ ...prev, [targetBox.id]: pinBox.pinNumber }))
                      }
                      className={`min-h-[48px] rounded-xl border-2 text-lg font-extrabold transition-all ${
                        solved || locked ? 'cursor-default' : 'cursor-pointer active:scale-95'
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

      {!isAllFinished && (
        <button
          type="button"
          disabled={!hasPending}
          onClick={handleCheckAll}
          className={`w-full min-h-[52px] rounded-xl font-bold text-sm transition-all ${
            hasPending ? 'bg-sun text-navy cursor-pointer active:scale-[0.98]' : 'bg-white border border-navy/20 text-navy/40 cursor-not-allowed'
          }`}
        >
          {hasPending ? '정답 확인하기' : '설명을 적고 번호를 고른 뒤 정답을 확인하세요'}
        </button>
      )}

      {showDoneOverlay && (
        <div
          className="fixed inset-0 z-[2000] bg-navy/85 flex items-center justify-center p-6"
          onClick={() => setShowDoneOverlay(false)}
        >
          <div className="bg-white rounded-3xl px-6 py-10 w-full max-w-lg text-center space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-4xl md:text-5xl text-navy leading-tight">
              모든 택배의
              <br />
              주소를 찾았어요!
            </p>
            <p className="text-sm text-navy/70">다섯 도시가 모두 지도에 표시되었어요.</p>
            <button
              type="button"
              onClick={() => setShowDoneOverlay(false)}
              className="w-full min-h-[52px] rounded-xl bg-sun text-navy font-bold text-base cursor-pointer"
            >
              지도 보기
            </button>
          </div>
        </div>
      )}

      {selfStudyBox && (
        <FullScreenClueModal
          isOpen
          box={selfStudyBox}
          title={`${selfStudyBox.codeName} 자료`}
          memo={{
            value: friendNotes[selfStudyBox.id] || '',
            onChange: (val) => onFriendNoteChange(selfStudyBox.id, val),
          }}
          onClose={() => setSelfStudyBoxId(null)}
        />
      )}

      <FullScreenClueModal
        isOpen={isClueModalOpen}
        box={myBox}
        notes={notes}
        onClose={() => setIsClueModalOpen(false)}
      />
    </div>
  );
};
