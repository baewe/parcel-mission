import React from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X } from 'lucide-react';
import { DeliveryBox, DocId, DOC_METAS } from '../data';

interface AbsentBoxSheetProps {
  box: DeliveryBox;
  onMarkOnMap: () => void;
  onClose: () => void;
}

// 설명해 줄 친구가 결석했을 때: 자료 4개와 예시 답안을 쭉 내려 보고, 맨 아래에서 배송지 확인
export const AbsentBoxSheet: React.FC<AbsentBoxSheetProps> = ({ box, onMarkOnMap, onClose }) => {
  const docOrder: DocId[] = ['1', '2', '3', '4'];

  return createPortal(
    <div className="fixed inset-0 z-[2000] bg-white flex flex-col" role="dialog" aria-label={`${box.codeName} 자료`}>
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-navy text-white shrink-0">
        <span className="font-bold text-sm">{box.codeName} 자료와 예시 답안</span>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 text-sm font-bold bg-sun text-navy px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" /> 닫기
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md md:max-w-2xl mx-auto p-4 space-y-6 pb-10">
          {docOrder.map((dId) => {
            const doc = box.docs[dId];
            return (
              <section key={dId} className="space-y-2">
                <span className="inline-block text-xs font-bold bg-navy text-white px-2 py-0.5 rounded">
                  {DOC_METAS[dId].label}
                </span>
                <img
                  src={doc.image}
                  alt={DOC_METAS[dId].label}
                  className="w-full h-auto max-h-[50vh] object-contain rounded-xl border border-navy/15 bg-white"
                />
                {doc.observation && <p className="text-sm text-navy leading-relaxed">{doc.observation}</p>}
                <p className="text-sm text-navy leading-relaxed bg-sun/25 rounded-lg px-3 py-2.5">
                  <b className="mr-1">예시 답안</b>
                  {doc.model}
                </p>
              </section>
            );
          })}

          <section className="border-2 border-navy rounded-2xl p-4 text-center space-y-3">
            <p className="text-xs font-bold text-navy/60">{box.codeName}의 배송지</p>
            <p className="text-2xl font-extrabold text-navy">
              {box.cityName}({box.countryName})
            </p>
            <p className="text-sm text-navy">
              지도 {box.pinCircle}번 · 아프리카 {box.address.region}, 적도의 {box.address.equatorSide}, {box.address.environment}
            </p>
            <button
              type="button"
              onClick={onMarkOnMap}
              className="w-full min-h-[48px] rounded-xl bg-sun text-navy font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4" /> 지도에 표시하고 돌아가기
            </button>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
};
