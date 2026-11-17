import React from 'react';
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

export const AnswerKeyView: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-navy">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-10 print:py-0">
        {/* 제목 */}
        <header className="space-y-2 border-b-2 border-navy pb-4">
          <p className="text-xs font-bold text-navy/60">선생님용 · 학생에게 보여 주지 마세요</p>
          <h1 className="text-3xl">아프리카 택배 대작전 답지</h1>
          <p className="text-sm text-navy/70">
            택배 5개의 배송지, 주요 특징, 주소 문장 정답, 자료별 모범 해설을 모았습니다.
          </p>
        </header>

        {/* 한눈에 보기 */}
        <section className="space-y-3">
          <h2 className="text-xl">한눈에 보기</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-navy text-white text-left">
                  <th className="p-2 font-bold">택배</th>
                  <th className="p-2 font-bold">배송지</th>
                  <th className="p-2 font-bold">지도 번호</th>
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

        {/* 택배별 상세 */}
        {BOX_ORDER.map((id) => {
          const b = DELIVERY_BOXES[id];
          return (
            <section key={id} className="space-y-4 break-before-page">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-navy pb-2">
                <span className="text-sm font-bold bg-sun text-navy px-2 py-0.5 rounded">택배 {id}</span>
                <h2 className="text-2xl">
                  {b.cityName}({b.countryName})
                </h2>
                <span className="text-sm text-navy/70">지도 {b.pinNumber}번</span>
              </div>

              <div className="border border-navy/20 rounded-xl p-4 space-y-1">
                <p className="text-xs font-bold text-navy/60">주소 문장 정답</p>
                <p className="text-base leading-relaxed">
                  이 도시는 아프리카 <b className="bg-leaf px-1 rounded">{b.address.region}</b>에 있고, 적도의{' '}
                  <b className="bg-leaf px-1 rounded">{b.address.equatorSide}</b>에 있으며,{' '}
                  <b className="bg-leaf px-1 rounded">{b.address.environment}</b>에 자리 잡고 있다.
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-navy/60">주요 특징</p>
                <ul className="list-disc pl-5 text-sm leading-relaxed space-y-0.5">
                  {FEATURES[id].map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-navy/60">자료별 모범 해설</p>
                {DOC_ORDER.map((dId) => {
                  const d = b.docs[dId];
                  return (
                    <div
                      key={dId}
                      className="grid grid-cols-[96px_1fr] md:grid-cols-[160px_1fr] gap-3 border border-navy/15 rounded-xl p-3 break-inside-avoid"
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
              </div>
            </section>
          );
        })}

        <footer className="text-xs text-navy/50 border-t border-navy/15 pt-3 print:hidden">
          인쇄하려면 Ctrl+P(⌘+P). 택배마다 새 쪽에서 시작합니다.
        </footer>
      </div>
    </div>
  );
};
