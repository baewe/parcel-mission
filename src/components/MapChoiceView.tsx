import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';
import { DELIVERY_BOXES, DeliveryBox, DocId } from '../data';
import { FullScreenClueModal } from './FullScreenClueModal';

interface MapChoiceViewProps {
  box: DeliveryBox;
  notes: Record<DocId, string>;
  alreadySolved: boolean;
  onSuccess: () => void;
  onProceedToAddress: () => void;
  onBackToClues: () => void;
}

// 지도 번호 순서(1~5)로 정렬
const ALL_BOXES = Object.values(DELIVERY_BOXES).sort((a, b) => a.pinNumber - b.pinNumber);
const AFRICA_CENTER: [number, number] = [0.0, 20.0];
const AFRICA_ZOOM = 3.2;
const PIN_ZOOM = 6;

export const MapChoiceView: React.FC<MapChoiceViewProps> = ({
  box,
  notes,
  alreadySolved,
  onSuccess,
  onProceedToAddress,
  onBackToClues,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});

  const [selectedPin, setSelectedPin] = useState<number | null>(
    alreadySolved ? box.pinNumber : null
  );
  const [isSolved, setIsSolved] = useState<boolean>(alreadySolved);
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(
    alreadySolved
      ? {
          type: 'success',
          message: `배송지: ${box.cityName}(${box.countryName})`,
        }
      : null
  );
  const [isClueModalOpen, setIsClueModalOpen] = useState<boolean>(false);
  const isSolvedRef = useRef<boolean>(alreadySolved);
  useEffect(() => {
    isSolvedRef.current = isSolved;
  }, [isSolved]);

  // Build pin HTML based on active/solved state
  const createPinHtml = (
    pinLabel: string,
    isSelected: boolean,
    isCorrectSolved: boolean
  ) => {
    // 기본: 노랑 / 선택: 보라 / 정답: 연두
    const bg = isCorrectSolved ? '#B1D992' : isSelected ? '#9480BD' : '#F5BA53';
    const fg = isSelected && !isCorrectSolved ? '#FFFFFF' : '#274480';
    const border = isSelected || isCorrectSolved ? '#FFFFFF' : '#274480';
    const size = isSelected || isCorrectSolved ? 44 : 36;

    return `
      <div style="width: ${size}px; height: ${size}px; margin-left: ${(36 - size) / 2}px; margin-top: ${(36 - size) / 2}px; border-radius: 9999px; background: ${bg}; border: 3px solid ${border}; color: ${fg}; font-family: 'Pretendard Variable', sans-serif; font-weight: 800; font-size: ${size === 44 ? 22 : 18}px; line-height: 1; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ${pinLabel}
      </div>
    `;
  };

  // 번호를 고르면 그 지점으로 확대
  const zoomToPin = (pin: number) => {
    const map = mapInstanceRef.current;
    const target = ALL_BOXES.find((b) => b.pinNumber === pin);
    if (!map || !target) return;
    map.flyTo([target.lat, target.lng], PIN_ZOOM, { duration: 0.8 });
  };

  const showWholeMap = () => {
    mapInstanceRef.current?.flyTo(AFRICA_CENTER, AFRICA_ZOOM, { duration: 0.8 });
  };

  const pickPin = (pin: number) => {
    setSelectedPin(pin);
    setFeedback((prev) => (prev?.type === 'success' ? prev : null));
    zoomToPin(pin);
  };

  // Initialize Leaflet Map (No place labels)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: AFRICA_CENTER,
      zoom: AFRICA_ZOOM,
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

    // Place the 5 numbered city pins (①~⑤) without revealing city names
    ALL_BOXES.forEach((b) => {
      const icon = L.divIcon({
        className: 'custom-numbered-pin',
        html: createPinHtml(b.pinCircle, false, false),
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([b.lat, b.lng], { icon }).addTo(map);
      marker.on('click', () => {
        if (isSolvedRef.current) return;
        pickPin(b.pinNumber);
      });
      markersRef.current[b.pinNumber] = marker;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Update pin marker visuals when selectedPin or isSolved changes
  useEffect(() => {
    ALL_BOXES.forEach((b) => {
      const marker = markersRef.current[b.pinNumber];
      if (!marker) return;
      const isSelected = selectedPin === b.pinNumber;
      const isCorrectSolved = isSolved && b.pinNumber === box.pinNumber;
      marker.setIcon(
        L.divIcon({
          className: 'custom-numbered-pin',
          html: createPinHtml(b.pinCircle, isSelected, isCorrectSolved),
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })
      );
      marker.setZIndexOffset(isSelected ? 1000 : 0);
    });
  }, [selectedPin, isSolved, box.pinNumber]);

  const handleCheckDelivery = () => {
    if (selectedPin === null) return;

    if (selectedPin === box.pinNumber) {
      setIsSolved(true);
      setFeedback({
        type: 'success',
        message: `배송지: ${box.cityName}(${box.countryName})`,
      });
      onSuccess();
      return;
    }

    // Wrong pick: check if hemisphere (North/South of Equator) differs
    const pickedBox = ALL_BOXES.find((b) => b.pinNumber === selectedPin);
    if (!pickedBox) return;

    const pickedNorth = pickedBox.lat >= 0;
    const targetNorth = box.lat >= 0;

    if (pickedNorth !== targetNorth) {
      setFeedback({
        type: 'error',
        message: '적도의 북쪽·남쪽을 다시 생각해 보세요 → 모둠 친구들의 자료 해석을 다시 들어 보세요',
      });
    } else {
      setFeedback({
        type: 'error',
        message: '대륙의 어느 쪽인지 다시 보세요 → 모둠 친구들의 자료 해석을 다시 들어 보세요',
      });
    }
  };

  return (
    <div className="w-full mx-auto p-3 pb-24 flex flex-col">
      {/* Header */}
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
            3단계: 배송지 고르기
          </span>
          <h2 className="text-lg text-navy mt-0.5">
            1~5 중 배송지 위치를 고르세요
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsClueModalOpen(true)}
          className="flex items-center gap-1 text-xs font-bold bg-[#FFFFFF] text-amber-900 hover:bg-amber-100 px-2.5 py-2 rounded-lg border border-amber-800/30 shadow-sm shrink-0 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>단서 다시보기</span>
        </button>
      </div>

      {/* Instruction strip */}
      <div className="text-[11px] text-stone-700 bg-amber-50/90 px-3 py-1.5 rounded-lg border border-amber-200/90 mb-2 flex items-center justify-between">
        <span>번호를 누르면 그곳이 확대돼요</span>
        <span className="font-bold">적도: 흰 점선</span>
      </div>

      {/* Leaflet Satellite Map (Label-free) */}
      <div className="relative isolate z-0 w-full h-[46vh] md:h-[58vh] min-h-[310px] max-h-[420px] md:max-h-[640px] rounded-2xl overflow-hidden border border-amber-900/40">
        <div ref={mapContainerRef} className="w-full h-full" />
        <button
          type="button"
          onClick={showWholeMap}
          className="absolute bottom-3 left-3 z-[500] px-3 py-1.5 rounded-lg bg-white text-navy text-xs font-bold border border-navy cursor-pointer"
        >
          전체 보기
        </button>
      </div>

      {/* Quick Number Buttons ①~⑤ */}
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {ALL_BOXES.map((b) => {
          const isSelected = selectedPin === b.pinNumber;
          const isCorrectSolved = isSolved && b.pinNumber === box.pinNumber;
          return (
            <button
              key={b.pinNumber}
              type="button"
              disabled={isSolved}
              onClick={() => pickPin(b.pinNumber)}
              className={`min-h-[52px] rounded-xl border-2 text-xl font-extrabold transition-all cursor-pointer ${
                isCorrectSolved
                  ? 'bg-leaf border-navy text-navy'
                  : isSelected
                  ? 'bg-lav border-navy text-white'
                  : 'bg-white border-navy/30 text-navy'
              }`}
            >
              {b.pinCircle}
            </button>
          );
        })}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mt-3 p-3.5 rounded-xl border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md'
              : 'bg-rose-50 border-rose-400 text-rose-950 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              {feedback.type === 'success' ? (
                <>
                  <span className="text-[11px] font-bold text-emerald-700 block">
                    정답입니다!
                  </span>
                  <p className="text-lg font-black text-emerald-950 mt-0.5">
                    {feedback.message}
                  </p>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-bold text-rose-700 block">
                    아쉽지만 오답입니다
                  </span>
                  <p className="text-xs font-extrabold text-rose-950 mt-0.5 leading-relaxed">
                    {feedback.message}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-3.5 space-y-2">
        {!isSolved ? (
          <button
            type="button"
            disabled={selectedPin === null}
            onClick={handleCheckDelivery}
            className={`w-full min-h-[50px] py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              selectedPin !== null
                ? 'bg-sun text-navy active:scale-[0.98] cursor-pointer'
                : 'bg-white border border-navy/20 text-navy/40 cursor-not-allowed'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>
              {selectedPin !== null
                ? `${selectedPin}번 위치로 배송하기 (정답 확인)`
                : '1~5 중 하나를 고르세요'}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onProceedToAddress}
            className="w-full min-h-[52px] py-3.5 px-4 rounded-xl bg-sun text-navy active:scale-[0.98] font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <span>4단계: 주소 문장 완성하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onBackToClues}
            className="text-xs text-navy/70 underline underline-offset-2 cursor-pointer"
          >
            ← 단서 4개 화면으로 돌아가기
          </button>
        </div>
      </div>

      {/* Full-screen Clue Review Modal (does NOT overlap map) */}
      <FullScreenClueModal
        isOpen={isClueModalOpen}
        box={box}
        notes={notes}
        onClose={() => setIsClueModalOpen(false)}
      />
    </div>
  );
};
