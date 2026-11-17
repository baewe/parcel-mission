import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, X } from 'lucide-react';
import { TEXTBOOK_PAGES } from '../data';

interface TextbookViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAGE_WIDTH = 1000; // 교과서 쪽 표시 크기(px)
const PAGE_HEIGHT = 1440;
const EDGE = 8;

const ZoomButtons: React.FC<{ onZoomIn: () => void; onZoomOut: () => void; onFit: () => void }> = ({
  onZoomIn,
  onZoomOut,
  onFit,
}) => {
  const btn =
    'min-w-[44px] min-h-[44px] px-3 rounded-xl bg-white border border-navy/25 text-navy font-bold text-sm flex items-center justify-center gap-1 cursor-pointer active:scale-95';
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label="축소" onClick={onZoomOut} className={btn}>
        <Minus className="w-5 h-5" />
      </button>
      <button type="button" aria-label="화면에 맞추기" onClick={onFit} className={btn}>
        <Maximize2 className="w-4 h-4" />
        <span className="hidden sm:inline">맞추기</span>
      </button>
      <button type="button" aria-label="확대" onClick={onZoomIn} className={btn}>
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export const TextbookViewer: React.FC<TextbookViewerProps> = ({ isOpen, onClose }) => {
  const [page, setPage] = useState(0);
  const total = TEXTBOOK_PAGES.length;
  const areaRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<ReactZoomPanPinchRef>(null);

  // 화면 가로에 맞추기 (원래 크기보다 크게 키우지는 않음), 위쪽부터 보이게
  const fitWidth = useCallback((animate = true) => {
    const area = areaRef.current;
    const zoom = zoomRef.current;
    if (!area || !zoom) return;
    const w = area.clientWidth;
    const scale = Math.min(1, (w - 16) / PAGE_WIDTH);
    zoom.setTransform((w - PAGE_WIDTH * scale) / 2, 8, scale, animate ? 250 : 0);
  }, []);

  // 위아래(좌우) 이동: 화면 밖으로 너무 나가지 않게 막음
  const panBy = useCallback((dx: number, dy: number) => {
    const area = areaRef.current;
    const zoom = zoomRef.current;
    if (!area || !zoom) return;
    const { positionX, positionY, scale } = zoom.instance.state;
    const w = area.clientWidth;
    const h = area.clientHeight;
    const cw = PAGE_WIDTH * scale;
    const ch = PAGE_HEIGHT * scale;
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const x = cw <= w ? (w - cw) / 2 : clamp(positionX - dx, w - cw - EDGE, EDGE);
    const y = ch <= h ? EDGE : clamp(positionY - dy, h - ch - EDGE, EDGE);
    zoom.setTransform(x, y, scale, 0);
  }, []);

  // 마우스 휠·트랙패드 두 손가락 스크롤 = 위아래 이동, Ctrl(⌘)+휠·트랙패드 집기 = 확대·축소
  useEffect(() => {
    if (!isOpen) return;
    const area = areaRef.current;
    if (!area) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoom = zoomRef.current;
      if (!zoom) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.deltaY < 0) zoom.zoomIn(0.15, 0);
        else zoom.zoomOut(0.15, 0);
      } else {
        panBy(e.shiftKey ? e.deltaY : e.deltaX, e.shiftKey ? 0 : e.deltaY);
      }
    };
    area.addEventListener('wheel', onWheel, { passive: false });
    return () => area.removeEventListener('wheel', onWheel);
  }, [isOpen, page, panBy]);

  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => fitWidth(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen, fitWidth]);

  // 열려 있는 동안 뒤 화면 스크롤 막기 + 키보드(←, →, Esc)
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setPage((p) => Math.min(total - 1, p + 1));
      if (e.key === 'ArrowLeft') setPage((p) => Math.max(0, p - 1));
      if (e.key === 'ArrowDown') panBy(0, 120);
      if (e.key === 'ArrowUp') panBy(0, -120);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose, total, panBy]);

  if (!isOpen) return null;
  const current = TEXTBOOK_PAGES[page];

  return createPortal(
    <div className="fixed inset-0 z-[2000] bg-white flex flex-col" role="dialog" aria-label="교과서">
      {/* 위: 제목 + 닫기 */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-navy text-white">
        <span className="font-bold text-sm truncate">교과서 · {current.title}</span>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 text-sm font-bold bg-sun text-navy px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" /> 닫기
        </button>
      </div>

      {/* 쪽 고르기 */}
      <div className="flex gap-1.5 px-3 py-2 border-b border-navy/15 overflow-x-auto">
        {TEXTBOOK_PAGES.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setPage(i)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
              i === page ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-navy/25'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* 교과서 쪽: 두 손가락으로 확대·축소, 끌어서 이동, 두 번 탭하면 확대 */}
      <TransformWrapper
        key={page}
        ref={zoomRef}
        minScale={0.2}
        maxScale={4}
        limitToBounds={false}
        doubleClick={{ mode: 'zoomIn', step: 0.8 }}
        wheel={{ disabled: true }}
        pinch={{ step: 5 }}
      >
        <div ref={areaRef} className="flex-1 min-h-0 bg-[#F4F4F4] relative">
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ display: 'block' }}
          >
            <img
              src={current.src}
              alt={`교과서 ${current.title}`}
              draggable={false}
              onLoad={() => fitWidth(false)}
              className="block max-w-none select-none shadow-none"
              style={{ width: 1000, height: 'auto' }}
            />
          </TransformComponent>
        </div>

        {/* 아래: 확대·축소 + 쪽 넘기기 */}
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-t border-navy/15 bg-white pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="min-h-[44px] px-3 rounded-xl border border-navy/25 text-navy font-bold text-sm flex items-center gap-1 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">이전 쪽</span>
          </button>

          <ZoomButtons
            onZoomIn={() => zoomRef.current?.zoomIn(0.4)}
            onZoomOut={() => zoomRef.current?.zoomOut(0.4)}
            onFit={() => fitWidth(true)}
          />

          <button
            type="button"
            disabled={page === total - 1}
            onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
            className="min-h-[44px] px-3 rounded-xl border border-navy/25 text-navy font-bold text-sm flex items-center gap-1 disabled:opacity-30 cursor-pointer"
          >
            <span className="hidden sm:inline">다음 쪽</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </TransformWrapper>
    </div>,
    document.body
  );
};
