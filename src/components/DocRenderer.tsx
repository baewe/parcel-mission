import React, { useEffect, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { DeliveryBox, DocId, DOC_METAS } from '../data';

interface DocRendererProps {
  box: DeliveryBox;
  docId: DocId;
}

export const DocRenderer: React.FC<DocRendererProps> = ({ box, docId }) => {
  const [imgErr, setImgErr] = useState<boolean>(false);
  const meta = DOC_METAS[docId];
  const doc = box.docs[docId];

  useEffect(() => {
    setImgErr(false);
  }, [doc.image]);

  return (
    <div className="space-y-2.5">
      {/* Image: full width, uncropped (object-contain) */}
      {doc.image && !imgErr ? (
        <div className="w-full rounded-xl overflow-hidden border border-amber-800/20 bg-stone-100">
          <img
            src={doc.image}
            alt={`${meta.label} 단서`}
            referrerPolicy="no-referrer"
            onError={() => setImgErr(true)}
            className="w-full h-auto object-contain block"
          />
        </div>
      ) : (
        <div className="w-full h-40 rounded-xl border border-stone-300 bg-stone-200/80 flex flex-col items-center justify-center text-stone-600 p-4 text-center">
          <ImageIcon className="w-8 h-8 text-stone-500 mb-1.5" />
          <span className="text-xs font-bold text-stone-700">
            {meta.label} 이미지를 불러올 수 없습니다
          </span>
        </div>
      )}

      {/* Observation description (hidden when empty) */}
      {doc.observation && doc.observation.trim().length > 0 && (
        <div className="bg-[#F4F4F1] p-3 rounded-xl border border-amber-800/15 text-xs text-stone-800 leading-relaxed">
          {doc.observation}
        </div>
      )}

      {/* Credit (small gray text below, hidden when empty) */}
      {doc.credit && doc.credit.trim().length > 0 && (
        <p className="text-[11px] text-stone-500 leading-snug px-0.5">
          {doc.credit}
        </p>
      )}
    </div>
  );
};
