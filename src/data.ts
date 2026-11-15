/**
 * AFRI-익스프레스 택배 대작전 (직소 수업용) 데이터
 *
 * 정답:
 * A: 카이로 (이집트)       ① 30.04, 31.24  | 북부 / 북쪽 / 사막을 흐르는 큰 강 가
 * B: 라고스 (나이지리아)   ②  6.52,  3.38  | 서부 / 북쪽 / 덥고 습한 바닷가
 * C: 킨샤사 (콩고 민주 공화국) ③ -4.32, 15.31 | 중앙 / 남쪽 / 열대우림에서 흘러오는 큰 강 가
 * D: 나이로비 (케냐)       ④ -1.29, 36.82  | 동부 / 남쪽 / 초원이 펼쳐진 높은 고원
 * E: 케이프타운 (남아프리카 공화국) ⑤ -33.92, 18.42 | 남부 / 남쪽 / 산과 바다가 만나는 해안
 */

export type BoxId = 'A' | 'B' | 'C' | 'D' | 'E';
export type DocId = '1' | '2' | '3' | '4';

export interface DocMeta {
  id: DocId;
  circleNum: '①' | '②' | '③' | '④';
  label: string;
  shortLabel: string;
}

export const DOC_METAS: Record<DocId, DocMeta> = {
  '1': { id: '1', circleNum: '①', label: '자료 ①', shortLabel: '자료 ①' },
  '2': { id: '2', circleNum: '②', label: '자료 ②', shortLabel: '자료 ②' },
  '3': { id: '3', circleNum: '③', label: '자료 ③', shortLabel: '자료 ③' },
  '4': { id: '4', circleNum: '④', label: '자료 ④', shortLabel: '자료 ④' },
};

export const ADDRESS_OPTIONS = {
  region: ['북부', '서부', '중앙', '동부', '남부'] as const,
  equatorSide: ['북쪽', '남쪽'] as const,
  environment: [
    '사막을 흐르는 큰 강 가',
    '덥고 습한 바닷가',
    '열대우림에서 흘러오는 큰 강 가',
    '초원이 펼쳐진 높은 고원',
    '산과 바다가 만나는 해안',
  ] as const,
};

export interface ClueDoc {
  image: string;
  observation: string;
  model: string;
  credit: string;
}

export interface DeliveryBox {
  id: BoxId;
  pinNumber: 1 | 2 | 3 | 4 | 5;
  pinCircle: '①' | '②' | '③' | '④' | '⑤';
  codeName: string;
  cityName: string; // 배송지 정답 전까지 절대 미표시
  countryName: string; // 배송지 정답 전까지 절대 미표시
  lat: number;
  lng: number;
  docs: {
    '1': ClueDoc;
    '2': ClueDoc;
    '3': ClueDoc;
    '4': ClueDoc;
  };
  address: {
    region: (typeof ADDRESS_OPTIONS.region)[number];
    equatorSide: (typeof ADDRESS_OPTIONS.equatorSide)[number];
    environment: (typeof ADDRESS_OPTIONS.environment)[number];
  };
}

export const DELIVERY_BOXES: Record<BoxId, DeliveryBox> = {
  A: {
    id: 'A',
    pinNumber: 1,
    pinCircle: '①',
    codeName: '택배 A',
    cityName: '카이로',
    countryName: '이집트',
    lat: 30.04,
    lng: 31.24,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image13.jpg',
        observation:
          '이 도시는 풀이나 나무가 거의 없는 모래와 돌투성이 땅 위에 세워져 있습니다.',
        model:
          "풀과 나무가 거의 없고 모래와 돌로 덮인 땅이 보이므로 강수량이 매우 적은 건조 기후 지역입니다. 아프리카에서 건조 기후는 북부의 사하라 사막과 남부의 나미브·칼라하리 사막에 나타납니다. → 후보: 북부, 남부 (근거: 75쪽 '아프리카의 기후')",
        credit:
          "사진: Jason Larkin/Panos Pictures, CNN Style 「Egypt's new capital to rise from the sand」(2016. 10. 10.)",
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image16.png',
        observation: '연강수량이 24mm로 극히 적어 매우 건조합니다.',
        model:
          '연강수량이 24mm이고 거의 모든 달의 강수량이 10mm에 못 미칩니다. 비가 거의 내리지 않으므로 건조 기후이며, 75쪽의 카이로 그래프와 모양이 비슷합니다. → 후보: 북부, 남부 (근거: 75쪽 건조 기후 지역 그래프)',
        credit:
          '자료: weatherandclimate.eu, 카이로 국제공항 관측소(WMO 62366) 자료 바탕으로 작성',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image4.png',
        observation:
          '사진 속 건물은 이슬람교 사원인 모스크입니다. 이 도시는 이슬람교의 영향을 많이 받아 모스크를 볼 수 있습니다.',
        model:
          "사진 속 건물은 이슬람교 사원인 모스크입니다. 아프리카에서 이슬람의 영향을 많이 받은 지역은 북부 아프리카입니다. → 후보: 북부 (근거: 73쪽 '북부 아프리카는 이슬람의 영향을 많이 받은 곳')",
        credit:
          '사진: © Vyacheslav Argenberg, 「Egypt, Cairo, The courtyard of Al-Azhar」(2007), Wikimedia Commons, CC BY 4.0',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image9.png',
        observation: '',
        model:
          '비가 거의 없는 땅에 큰 강이 흐르고, 강을 따라서만 초록색 농경지와 마을이 길게 이어져 있습니다. 사막을 지나 흐르는 아프리카의 큰 강은 나일강이며, 나일강은 북쪽으로 흘러 지중해로 들어갑니다. → 후보: 북부 (근거: 74쪽 나일강 설명, 지형 지도)',
        credit: '',
      },
    },
    address: {
      region: '북부',
      equatorSide: '북쪽',
      environment: '사막을 흐르는 큰 강 가',
    },
  },

  B: {
    id: 'B',
    pinNumber: 2,
    pinCircle: '②',
    codeName: '택배 B',
    cityName: '라고스',
    countryName: '나이지리아',
    lat: 6.52,
    lng: 3.38,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image2.png',
        observation:
          '이곳은 바다에 맞닿은 해안 도시입니다. 바다 쪽으로 뻗어 있는 둑은 파도에 해안이 깎여 나가는 것을 막기 위해 쌓은 시설입니다.',
        model:
          '도시가 바다에 바로 맞닿아 있고, 파도를 막는 둑이 바다 쪽으로 뻗어 있습니다. 바닷가에 자리한 지점이 후보가 되고, 바다와 떨어진 중앙·동부 지점은 제외됩니다. → 후보: 해안 지점(서부, 남부 등)',
        credit: '사진: Ben Iwara, Pexels (2024)',
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image20.png',
        observation:
          '1년 내내 월평균 기온이 25℃ 이상(약 25~29℃)으로 덥고, 한 해 강수량은 약 1,550mm로 우리나라(약 1,300mm)보다 많습니다. 이처럼 1년 내내 기온이 높고 비가 많이 오는 기후를 열대 기후라고 합니다.',
        model:
          "1년 내내 월평균 기온이 25℃ 이상이고, 연강수량이 약 1,550mm로 많습니다. 열대 기후는 적도 부근에 나타나므로 북부와 남부는 제외됩니다. 다만 이 자료만으로는 적도 부근의 다른 지역과 구별하기 어렵습니다. → 후보: 서부, 중앙 (근거: 75쪽 '적도 부근은 기온이 높고 강수량이 많은 열대 기후')",
        credit: '자료: weatherandclimate.eu, 라고스 이케자 관측소 자료 바탕으로 작성',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image19.png',
        observation:
          '항구에 컨테이너가 높이 쌓여 있고, 화물을 가득 실은 배가 정박해 있습니다. 바다에 맞닿아 있어 배로 물건을 실어 나르기 좋기 때문에 수출 산업이 발달한 도시입니다.',
        model:
          '컨테이너가 높이 쌓여 있고 화물선이 정박해 있어 바닷길을 이용한 무역이 활발한 곳입니다. 교과서는 해안 지역에서 수출 산업을 중심으로 경제 활동이 활발한 곳으로 서부 아프리카를 소개합니다. → 후보: 서부 (근거: 73쪽 서부 아프리카 설명)',
        credit:
          '사진: scenar308 (Bernd S), 「Port Apapa Lagos Nigeria」, Wikimedia Commons, CC BY 2.0',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image17.png',
        observation: '',
        model:
          "일자리를 찾아 사람들이 몰려들어 인구가 빠르게 늘었고, 아프리카에서 인구가 가장 많은 대도시 가운데 하나라고 합니다. 교과서에서 인구가 많은 대도시로 소개된 곳은 서부 아프리카의 라고스와 아비장입니다. → 후보: 서부 (근거: 73쪽 '나이지리아의 라고스, 코트디부아르의 아비장 등은 인구가 많은 대도시')",
        credit: '',
      },
    },
    address: {
      region: '서부',
      equatorSide: '북쪽',
      environment: '덥고 습한 바닷가',
    },
  },

  C: {
    id: 'C',
    pinNumber: 3,
    pinCircle: '③',
    codeName: '택배 C',
    cityName: '킨샤사',
    countryName: '콩고 민주 공화국',
    lat: -4.32,
    lng: 15.31,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image11.jpg',
        observation:
          '사진은 열대 우림의 모습입니다. 키 큰 나무와 풀이 빽빽하게 자라는 숲 경관이 나타납니다. 이 나라의 강 상류 쪽에는 넓은 열대 우림이 펼쳐져 있습니다.',
        model:
          "키 큰 나무와 풀이 빽빽하게 자란 숲이 보이므로 열대 우림입니다. 교과서는 열대 우림이 발달한 곳으로 중앙아프리카를 소개합니다. → 후보: 중앙 (근거: 73쪽 '중앙아프리카는 열대 우림이 발달하여', 자료 2 사진)",
        credit:
          '사진: Anand Osuri, 「Tropical rainforest Agumbe」(2011), Wikimedia Commons, CC BY-SA 4.0',
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image5.png',
        observation:
          '6~8월처럼 비가 적은 시기가 있지만, 1년 내내 월평균 기온이 23℃ 이상(약 23~27℃)으로 덥고 비가 많아 열대 기후에 속합니다.',
        model:
          '6~8월에 비가 적은 시기가 있지만, 1년 내내 월평균 기온이 23℃ 이상이고 나머지 달에는 비가 많이 내리므로 열대 기후입니다. 열대 기후는 적도 부근에 나타나므로 북부와 남부는 제외됩니다. → 후보: 서부, 중앙 (근거: 75쪽 열대 기후 설명)',
        credit:
          '자료: 일본 기상청 세계 평년값, 킨샤사 관측소(WMO 64210), 1991-2020 자료 바탕으로 작성',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image10.jpg',
        observation:
          '이 나라의 한 농업 시설에 있는 건물입니다. 풀과 나무 같은 주변 재료로 지붕을 덮은, 덥고 비가 많은 지역에서 볼 수 있는 건축 방식이 드러납니다.',
        model:
          "풀과 나무 같은 주변 재료로 지붕을 덮은 건물입니다. 교과서는 고온 다습한 지역에서 풀과 나무, 흙으로 집을 짓는다고 설명하고, 그 예로 콩고 민주 공화국의 가옥을 듭니다. 덥고 비가 많은 지역이므로 건조 기후인 북부와 온대 기후인 남부는 제외됩니다. → 후보: 서부, 중앙 (근거: 77쪽 '아프리카의 생활 문화', 콩고 민주 공화국 전통 가옥 사진)",
        credit: '사진: Ken Wiegand/USAID, Pixnio, CC0 (퍼블릭 도메인)',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image7.png',
        observation: '',
        model:
          "폭이 넓은 큰 강을 사이에 두고 이웃 나라의 수도와 마주 보고 있는 도시입니다. 72쪽 지도에서 찾아보면 큰 강을 사이에 두고 수도 두 곳(킨샤사와 브라자빌)이 맞붙어 있는 곳은 중앙아프리카에 있습니다. → 후보: 중앙 (근거: 72쪽 '아프리카의 위치와 지역 구분' 지도)",
        credit: '',
      },
    },
    address: {
      region: '중앙',
      equatorSide: '남쪽',
      environment: '열대우림에서 흘러오는 큰 강 가',
    },
  },

  D: {
    id: 'D',
    pinNumber: 4,
    pinCircle: '④',
    codeName: '택배 D',
    cityName: '나이로비',
    countryName: '케냐',
    lat: -1.29,
    lng: 36.82,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image1.jpg',
        observation:
          '고도가 높은 이 지역에는 지각이 갈라지고 있는 거대한 골짜기가 있으며, 그 가장자리를 따라 높은 절벽이 이어져 있습니다.',
        model:
          '지각이 갈라져 생긴 거대한 골짜기와 그 가장자리를 따라 이어진 높은 절벽이 보입니다. 아프리카에서 지각이 갈라지고 있는 곳은 동아프리카 지구대입니다. → 후보: 동부 (근거: 74쪽 동아프리카 지구대 설명과 지형 지도)',
        credit:
          '사진: Andreas Wisniowski, 「Kenya-Escarpment」(2014), Wikimedia Commons, CC BY-SA 4.0',
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image18.jpg',
        observation:
          '건기와 우기가 뚜렷한 이 도시에는 그 영향으로 초원이 넓게 분포합니다.',
        model:
          "키가 큰 풀이 자란 넓은 초원에 야생 동물이 살고 있습니다. 이런 초원은 열대 기후 주변의 우기와 건기가 뚜렷한 지역에 나타나며, 교과서는 야생 동식물이 사는 대표적인 초원으로 동부 아프리카의 세렝게티 초원을 소개합니다. → 후보: 동부 (근거: 73쪽 동부 아프리카 설명, 75쪽 '우기와 건기가 뚜렷한 기후')",
        credit:
          '사진: Timothy A. Gonsalves, 「Buffalo Nairobi Skyline Savannah Kenya May19」(2019), Wikimedia Commons, CC BY-SA 4.0',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image3.png',
        observation: '',
        model:
          "적도와 가까운데도 해발 약 1,700m의 높은 땅이어서 1년 내내 20℃ 안팎으로 선선하다고 합니다. 교과서는 기온이 선선하여 예부터 사람이 많이 모여 산 고원 지역이 동부 아프리카에 있다고 설명합니다. → 후보: 동부 (근거: 73쪽 '동부 아프리카는 기온이 선선하여 과거부터 많은 사람이 모여 산 고원 지역이 있다')",
        credit: '사진: pixabay 무료이미지',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image14.png',
        observation: '이 지역 토착민 부족의 전통 의상입니다.',
        model:
          "붉은색 천과 화려한 구슬 장신구가 특징인 전통 의상입니다. 교과서에 실린 동부 아프리카 마사이족의 전통 의상과 모습이 비슷합니다. → 후보: 동부 (근거: 76쪽 '동부 아프리카 마사이족의 전통 의상' 사진)",
        credit:
          '사진: Mrinal Mohit, 「Maasai dancer in Loita Hills, Kenya」(2017), Wikimedia Commons, CC BY-SA 4.0',
      },
    },
    address: {
      region: '동부',
      equatorSide: '남쪽',
      environment: '초원이 펼쳐진 높은 고원',
    },
  },

  E: {
    id: 'E',
    pinNumber: 5,
    pinCircle: '⑤',
    codeName: '택배 E',
    cityName: '케이프타운',
    countryName: '남아프리카 공화국',
    lat: -33.92,
    lng: 18.42,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image12.png',
        observation:
          '이 도시는 해안을 따라 온대 기후가 나타나 일찍부터 유럽인이 진출했고, 그 영향으로 항구 주변에 유럽풍 건물이 많이 남아 있습니다.',
        model:
          '해안의 항구 주변에 유럽풍 건물이 늘어서 있습니다. 교과서는 해안을 따라 온대 기후가 나타나 일찍부터 유럽인이 진출한 곳으로 남부 아프리카를 소개합니다. → 후보: 남부 (근거: 73쪽 남부 아프리카 설명)',
        credit:
          '사진: Andreas Tusche, 「Cape Town Waterfront」(2004), Wikimedia Commons, GFDL 1.2',
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image6.png',
        observation:
          '이 도시 주변에서는 포도 재배가 많이 이루어집니다. 포도는 너무 덥거나 춥지 않은 온화한 기후에서 잘 자랍니다.',
        model:
          "포도는 너무 덥거나 춥지 않은 온화한 기후에서 잘 자라므로 이곳은 온대 기후 지역입니다. 아프리카에서 온대 기후는 대륙의 북쪽 끝과 남쪽 끝에 좁게 나타나며, 교과서의 온대 기후 지역 사진도 포도 재배 모습입니다. → 후보: 북부, 남부 (근거: 75쪽 '온대 기후는 아프리카 대륙의 북단과 남단 지역 등에서', 포도 재배 사진)",
        credit: '사진: pxhere 무료이미지',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image8.png',
        observation:
          '연평균 기온 17.6°C로 온화한 기후가 나타납니다. 가장 따뜻한 달의 기온은 22°C로, 많이 덥지 않습니다. 6~8월의 기온이 가장 서늘하고, 1~2월의 기온이 가장 따뜻합니다.',
        model:
          "연평균 기온이 17.6℃이고 가장 따뜻한 달도 22℃ 정도라 많이 덥지 않습니다. 너무 덥지도 춥지도 않은 온화한 기후이므로 온대 기후 지역입니다. 아프리카에서 온대 기후는 대륙의 북쪽 끝과 남쪽 끝에 좁게 나타납니다. → 후보: 북부, 남부 (근거: 75쪽 '온대 기후는 아프리카 대륙의 북단과 남단 지역 등에서', 온대 기후 지역 그래프)",
        credit:
          '자료: climate-zone.com(NOAA 관측 자료 기반), 케이프타운 국제공항, 1991-2020 자료 바탕으로 작성',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image15.png',
        observation: '',
        model:
          "이 나라의 서쪽 해안과 동쪽 해안이 서로 다른 대양에 맞닿아 있다고 합니다. 72쪽 지도에서 서쪽은 대서양, 동쪽은 인도양에 모두 접한 나라를 찾으면 대륙 남쪽 끝의 남아프리카 공화국입니다. → 후보: 남부 (근거: 72쪽 지도, 73쪽 '해 보자' 2번 예시)",
        credit: '사진: pixabay 무료이미지',
      },
    },
    address: {
      region: '남부',
      equatorSide: '남쪽',
      environment: '산과 바다가 만나는 해안',
    },
  },
};
