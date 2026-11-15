import React, { useState } from 'react';
import { X, BookOpen, FileText } from 'lucide-react';
import { DeliveryBox, DocId, DOC_METAS } from '../data';
import { DocRenderer } from './DocRenderer';

interface FullScreenClueModalProps {
  isOpen: boolean;
  box: DeliveryBox;
  notes: Record<DocId, string>;
  onClose: () => void;
}

export const FullScreenClueModal: React.FC<FullScreenClueModalProps> = ({
  isOpen,
  box,
  notes,
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
      className="fixed inset-0 z-[2000] bg-[#FAFAF8] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="단서 다시보기 전체 화면"
    >
      {/* Top Bar */}
      <div className="bg-[#16181D] text-amber-50 px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-300" />
          <h3 className="font-black text-sm">
            {box.codeName} 단서 다시보기
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
      <div className="bg-[#F4F4F1] border-b border-amber-800/20 px-3 py-2 shrink-0">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 p-1 bg-[#E6E6E1] rounded-xl">
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
        <div className="max-w-md mx-auto space-y-4 pb-6">
          <div className="bg-white rounded-2xl border border-amber-800/25 p-4 shadow-sm">
            <DocRenderer box={box} docId={activeTab} />
          </div>

          {/* Student's recorded note for this doc */}
          <div className="bg-[#F4F4F1] rounded-2xl border border-amber-800/25 p-3.5">
            <span className="text-xs font-bold text-amber-950 block mb-1">
              내가 적은 메모 ({DOC_METAS[activeTab].label})
            </span>
            <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
              {notes[activeTab]?.trim() ? notes[activeTab] : '아직 작성한 메모가 없습니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Close Button */}
      <div className="bg-[#F4F4F1] border-t border-amber-800/20 p-3 shrink-0">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm cursor-pointer"
          >
            단서 보기 닫고 지도로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
