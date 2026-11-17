import React, { useState } from 'react';
import { X, BookOpen, FileText } from 'lucide-react';
import { DeliveryBox, DocId, DOC_METAS } from '../data';
import { DocRenderer } from './DocRenderer';

interface FullScreenClueModalProps {
  isOpen: boolean;
  box: DeliveryBox;
  notes?: Record<DocId, string>; // 없으면 '내가 적은 메모' 칸을 숨김
  title?: string;
  memo?: { value: string; onChange: (value: string) => void }; // 자료를 보면서 바로 적는 메모 칸
  onClose: () => void;
}

export const FullScreenClueModal: React.FC<FullScreenClueModalProps> = ({
  isOpen,
  box,
  notes,
  title,
  memo,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<DocId>('1');

  if (!isOpen) return null;

  const docOrder: DocId[] = ['1', '2', '3', '4'];
  const docIcons: Record<DocId, React.ReactNode> = {
    '1': <FileText className="w-3.5 h-3.5" />,
    '2': <FileText className="w-3.5 h-3.5" />,
    '3': <FileText className="w-3.5 h-3.5" />,
    '4': <FileText className="w-3.5 h-3.5" />,
  };

  return (
    <div
      className="fixed inset-0 z-[2000] bg-[#274480] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="단서 다시보기 전체 화면"
    >
      {/* Top Bar */}
      <div className="bg-[#274480] text-amber-50 px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-300" />
          <h3 className="font-black text-sm">
            {title ?? `${box.codeName} 단서 다시보기`}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-500/40 cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>닫기</span>
        </button>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="bg-[#FFFFFF] border-b border-amber-800/20 px-3 py-2 shrink-0">
        <div className="max-w-md md:max-w-2xl mx-auto grid grid-cols-4 gap-1 p-1 bg-[#FFFFFF] rounded-xl">
          {docOrder.map((id) => {
            const meta = DOC_METAS[id];
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`py-2 px-1 rounded-lg text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-800 text-white font-bold shadow'
                    : 'text-amber-950/80 hover:bg-white/60 font-medium'
                }`}
              >
                {docIcons[id]}
                <span className="whitespace-nowrap">{meta.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md md:max-w-2xl mx-auto space-y-4 pb-6">
          <div className="bg-white rounded-2xl border border-amber-800/25 p-4 shadow-sm">
            <DocRenderer box={box} docId={activeTab} />
          </div>

          {memo && (
            <div className="bg-white rounded-2xl border-2 border-sun p-3.5 space-y-1.5">
              <span className="text-xs font-bold text-navy block">
                메모
              </span>
              <textarea
                value={memo.value}
                onChange={(e) => memo.onChange(e.target.value)}
                rows={3}
                placeholder="자료를 보고 알게 된 점 (지역, 적도의 어느 쪽, 자연환경)"
                className="w-full text-sm p-2.5 rounded-lg border border-navy/25 bg-white text-navy placeholder:text-navy/40 focus:outline-none focus:border-navy resize-none"
              />
            </div>
          )}

          {/* Student's recorded note for this doc */}
          {notes && (
          <div className="bg-[#FFFFFF] rounded-2xl border border-amber-800/25 p-3.5">
            <span className="text-xs font-bold text-amber-950 block mb-1">
              내가 적은 메모 ({DOC_METAS[activeTab].label})
            </span>
            <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
              {notes[activeTab]?.trim() ? notes[activeTab] : '아직 작성한 메모가 없습니다.'}
            </p>
          </div>
          )}
        </div>
      </div>

      {/* Bottom Close Button */}
      <div className="bg-[#FFFFFF] border-t border-amber-800/20 p-3 shrink-0">
        <div className="max-w-md md:max-w-2xl mx-auto">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] py-3 rounded-xl bg-sun text-navy font-bold text-sm cursor-pointer"
          >
            단서 보기 닫고 지도로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
