import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ArrowLeft, Package } from 'lucide-react';
import { BoxId, DELIVERY_BOXES, DocId, DOC_METAS, ADDRESS_OPTIONS } from '../data';

// 선생님용 답지: 주소 끝에 ?view=answer-key 를 붙이면 열림 (학생 화면에는 링크 없음)
// 내용은 data.ts에서 그대로 가져오므로, 자료를 고치면 답지도 자동으로 바뀜

// 도시별 주요 특징 (답지에만 표시)
const FEATURES: Record<BoxId, string[]> = {
  A: [
    '중앙아프리카, 적도 바로 남쪽',
    '1년 내내 덥고 비가 많은 열대 기후 (6~8월은 비가 적음)',
    '콩고강을 사이에 두고 이웃 나라 수도(브라자빌, 콩고 공화국)와 마주 봄',
    '강 상류에 넓은 열대 우림, 풀·나무로 지붕을 덮은 집',
  ],
  B: [
    '남부 아프리카, 대륙 남서쪽 끝',
    '온화한 온대 기후 (1~2월이 따뜻하고 6~8월이 서늘함)',
    '서쪽은 대서양, 동쪽은 인도양에 접한 나라',
    '포도 재배, 일찍부터 유럽인이 진출해 항구에 유럽풍 건물',
  ],
  C: [
    '북부 아프리카, 지중해 가까이',
    '비가 거의 오지 않는 건조 기후 (연강수량 약 24mm)',
    '사막을 지나 북쪽 지중해로 흐르는 나일강 가에 자리함',
    '이슬람의 영향 (모스크)',
  ],
  D: [
    '동부 아프리카, 적도 바로 남쪽',
    '해발 약 1,700m 고원이라 1년 내내 20℃ 안팎으로 선선함',
    '우기와 건기가 뚜렷해 초원(사바나)이 넓음, 야생 동물',
    '동아프리카 지구대, 마사이족 전통 의상',
  ],
  E: [
    '서부 아프리카, 기니만 해안',
    '1년 내내 덥고 비가 많은 열대 기후 (연강수량 약 1,550mm)',
    '아프리카에서 인구가 가장 많은 대도시 가운데 하나',
    '항구와 수출 산업, 파도를 막는 방파제',
  ],
};

const BOX_ORDER: BoxId[] = ['A', 'B', 'C', 'D', 'E'];
const DOC_ORDER: DocId[] = ['1', '2', '3', '4'];

const readBoxFromUrl = (): BoxId | null => {
  const v = new URLSearchParams(window.location.search).get('box')?.toUpperCase();
  return v && (BOX_ORDER as string[]).includes(v) ? (v as BoxId) : null;
};

// 답지용 지도: 다섯 지점 모두 표시, 이 택배의 정답 지점만 연두색 + 도시 이름
const AnswerMap: React.FC<{ boxId: BoxId }> = ({ boxId }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, {
      center: [0, 20],
      zoom: 3,
      minZoom: 1.5,
      maxZoom: 8,
      zoomSnap: 0.25,
      attributionControl: true,
    });
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; Esri', maxZoom: 18 }
    ).addTo(map);
    L.polyline(
      [
        [0, -25],
        [0, 55],
      ],
      { color: '#FFFFFF', weight: 2, dashArray: '6, 8', opacity: 0.9, interactive: false }
    ).addTo(map);

    Object.values(DELIVERY_BOXES).forEach((b) => {
      const isAnswer = b.id === boxId;
      const html = `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);">
          <div style="width:${isAnswer ? 44 : 32}px;height:${isAnswer ? 44 : 32}px;border-radius:9999px;background:${
            isAnswer ? '#B1D992' : '#F5BA53'
          };border:3px solid ${isAnswer ? '#FFFFFF' : '#274480'};color:#274480;font-family:'Pretendard Variable',sans-serif;font-weight:800;font-size:${
            isAnswer ? 22 : 16
          }px;display:flex;align-items:center;justify-content:center;opacity:${isAnswer ? 1 : 0.75};">${b.pinNumber}</div>
          ${
            isAnswer
              ? `<div style="margin-top:3px;background:#274480;color:#fff;font-size:12px;font-weight:700;padding:2px 7px;border-radius:3px;white-space:nowrap;">${b.cityName}</div>`
              : ''
          }
        </div>`;
      L.marker([b.lat, b.lng], {
        icon: L.divIcon({ className: '', html, iconSize: [0, 0], iconAnchor: [0, 0] }),
        interactive: false,
        zIndexOffset: isAnswer ? 1000 : 0,
      }).addTo(map);
    });
    // 다섯 지점이 모두 보이게
    const bounds = L.latLngBounds(Object.values(DELIVERY_BOXES).map((b) => [b.lat, b.lng] as [number, number]));
    const fit = () => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [40, 40] });
    };
    fit();
    const timer = window.setTimeout(fit, 150);
    return () => {
      window.clearTimeout(timer);
      map.remove();
    };
  }, [boxId]);

  return (
    <div className="relative isolate z-0 w-full h-[320px] md:h-[420px] rounded-xl overflow-hidden border border-navy/20">
      <div ref={ref} className="w-full h-full" />
      <span className="absolute top-3 right-3 z-[500] px-2 py-1 rounded bg-navy/80 text-white text-[11px] font-bold pointer-events-none">
        - - - 적도
      </span>
    </div>
  );
};

const BackButton: React.FC<{ onClick: () => void; className?: string }> = ({ onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-1.5 rounded-xl bg-sun text-navy font-bold text-sm cursor-pointer active:scale-[0.98] ${className}`}
  >
    <ArrowLeft className="w-4 h-4" />
    <span>택배 목록</span>
  </button>
);

export const AnswerKeyView: React.FC = () => {
  const [boxId, setBoxId] = useState<BoxId | null>(readBoxFromUrl);

  // 주소에 택배를 남겨서 새로고침·뒤로 가기도 자연스럽게
  useEffect(() => {
    const onPop = () => setBoxId(readBoxFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const go = (id: BoxId | null) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('box', id);
    else url.searchParams.delete('box');
    window.history.pushState({}, '', url.toString());
    setBoxId(id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white text-navy">
      {boxId ? <BoxDetail boxId={boxId} onBack={() => go(null)} /> : <Home onPick={go} />}
    </div>
  );
};

const Home: React.FC<{ onPick: (id: BoxId) => void }> = ({ onPick }) => (
  <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-8">
    <header className="space-y-2 border-b-2 border-navy pb-4">
      <p className="text-xs font-bold text-navy/60">선생님용 · 학생에게 보여 주지 마세요</p>
      <h1 className="text-3xl">아프리카 택배 대작전 답지</h1>
      <p className="text-sm text-navy/70">택배를 누르면 배송지, 지도 위치, 주소 정답, 자료별 모범 해설을 볼 수 있어요.</p>
    </header>

    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
      {BOX_ORDER.map((id) => {
        const b = DELIVERY_BOXES[id];
        return (
          <button
            key={id}
            type="button"
            onClick={() => onPick(id)}
            className="aspect-[5/4] rounded-2xl border-2 border-navy/20 bg-white hover:border-navy active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 p-2 cursor-pointer"
          >
            <Package className="w-6 h-6 text-sun" />
            <span className="text-xs font-bold text-navy/60">택배 {id}</span>
            <span className="text-xl font-extrabold text-navy leading-tight text-center">{b.cityName}</span>
            <span className="text-[11px] text-navy/60 text-center">{b.countryName} · 지도 {b.pinNumber}번</span>
          </button>
        );
      })}
    </div>

    <section className="space-y-3">
      <h2 className="text-xl">한눈에 보기</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-navy text-white text-left">
              <th className="p-2 font-bold">택배</th>
              <th className="p-2 font-bold">배송지</th>
              <th className="p-2 font-bold">지도</th>
              <th className="p-2 font-bold">칸 1 지역</th>
              <th className="p-2 font-bold">칸 2 적도</th>
              <th className="p-2 font-bold">칸 3 자연환경</th>
            </tr>
          </thead>
          <tbody>
            {BOX_ORDER.map((id) => {
              const b = DELIVERY_BOXES[id];
              return (
                <tr key={id} className="border-b border-navy/15">
                  <td className="p-2 font-extrabold">{id}</td>
                  <td className="p-2 font-bold">
                    {b.cityName}({b.countryName})
                  </td>
                  <td className="p-2">{b.pinNumber}번</td>
                  <td className="p-2">{b.address.region}</td>
                  <td className="p-2">{b.address.equatorSide}</td>
                  <td className="p-2">{b.address.environment}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-navy/60">
        지도 번호는 북쪽부터 매김. 칸 1 선택지: {ADDRESS_OPTIONS.region.join(' / ')} · 칸 3 선택지:{' '}
        {ADDRESS_OPTIONS.environment.join(' / ')}
      </p>
    </section>
  </div>
);

const BoxDetail: React.FC<{ boxId: BoxId; onBack: () => void }> = ({ boxId, onBack }) => {
  const b = DELIVERY_BOXES[boxId];
  return (
    <>
      {/* 위: 제목 + 오른쪽 위 돌아가기 */}
      <div className="sticky top-0 z-[1100] bg-navy text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">
          <span className="font-bold text-sm truncate">
            택배 {boxId} · {b.cityName}
          </span>
          <BackButton onClick={onBack} className="px-3 py-1.5 shrink-0" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-navy pb-2">
          <span className="text-sm font-bold bg-sun text-navy px-2 py-0.5 rounded">택배 {boxId}</span>
          <h1 className="text-2xl">
            {b.cityName}({b.countryName})
          </h1>
        </div>

        <section className="space-y-2">
          <p className="text-xs font-bold text-navy/60">지도 위치 · 정답 {b.pinNumber}번</p>
          <AnswerMap boxId={boxId} />
        </section>

        <section className="border border-navy/20 rounded-xl p-4 space-y-1">
          <p className="text-xs font-bold text-navy/60">주소 문장 정답</p>
          <p className="text-base leading-relaxed">
            이 도시는 아프리카 <b className="bg-leaf px-1 rounded">{b.address.region}</b>에 있고, 적도의{' '}
            <b className="bg-leaf px-1 rounded">{b.address.equatorSide}</b>에 있으며,{' '}
            <b className="bg-leaf px-1 rounded">{b.address.environment}</b>에 자리 잡고 있다.
          </p>
        </section>

        <section className="space-y-1">
          <p className="text-xs font-bold text-navy/60">주요 특징</p>
          <ul className="list-disc pl-5 text-sm leading-relaxed space-y-0.5">
            {FEATURES[boxId].map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold text-navy/60">자료별 모범 해설</p>
          {DOC_ORDER.map((dId) => {
            const d = b.docs[dId];
            return (
              <div
                key={dId}
                className="grid grid-cols-[96px_1fr] md:grid-cols-[160px_1fr] gap-3 border border-navy/15 rounded-xl p-3"
              >
                <img
                  src={d.image}
                  alt={DOC_METAS[dId].label}
                  className="w-full h-auto max-h-40 object-contain rounded-lg border border-navy/10 bg-white"
                />
                <div className="space-y-1.5 text-sm leading-relaxed">
                  <p className="font-bold">{DOC_METAS[dId].label}</p>
                  {d.observation && <p className="text-navy/70">학생 화면 설명: {d.observation}</p>}
                  <p>
                    <b className="mr-1">모범 해설</b>
                    {d.model}
                  </p>
                  <p className="text-xs text-navy/50">출처: {d.credit}</p>
                </div>
              </div>
            );
          })}
        </section>

        <BackButton onClick={onBack} className="w-full min-h-[52px]" />
      </div>
    </>
  );
};
