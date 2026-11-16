/**
 * AFRI-익스프레스 택배 대작전 (직소 수업용) 데이터
 *
 * 정답 (택배 글자와 지도 번호가 같은 순서가 되지 않도록 섞어 둠)
 * A: 킨샤사 (콩고 민주 공화국)  지도 4번 | 중앙 / 남쪽 / 열대 우림에서 흘러오는 큰 강가
 * B: 케이프타운 (남아프리카 공화국)  지도 5번 | 남부 / 남쪽 / 산과 바다가 만나는 해안
 * C: 카이로 (이집트)  지도 1번 | 북부 / 북쪽 / 사막을 흐르는 큰 강가
 * D: 나이로비 (케냐)  지도 3번 | 동부 / 남쪽 / 초원이 펼쳐진 높은 고원
 * E: 라고스 (나이지리아)  지도 2번 | 서부 / 북쪽 / 덥고 습한 바닷가
 * 지도 번호는 위치 순서(북쪽 → 남쪽)로 매김
 */

// 교과서 주소 (완성되면 여기에 링크를 넣으면 상단바 '교과서' 버튼이 바로 열림)
export const TEXTBOOK_URL = '';

export type BoxId = 'A' | 'B' | 'C' | 'D' | 'E';
export type DocId = '1' | '2' | '3' | '4';

export interface DocMeta {
  id: DocId;
  circleNum: string;
  label: string;
  shortLabel: string;
}

export const DOC_METAS: Record<DocId, DocMeta> = {
  '1': { id: '1', circleNum: '1', label: '자료 1', shortLabel: '자료 1' },
  '2': { id: '2', circleNum: '2', label: '자료 2', shortLabel: '자료 2' },
  '3': { id: '3', circleNum: '3', label: '자료 3', shortLabel: '자료 3' },
  '4': { id: '4', circleNum: '4', label: '자료 4', shortLabel: '자료 4' },
};

export const ADDRESS_OPTIONS = {
  region: ['북부', '서부', '중앙', '동부', '남부'] as const,
  equatorSide: ['북쪽', '남쪽'] as const,
  // 택배 순서와 겹치지 않도록 순서를 섞어 둠
  environment: [
    '초원이 펼쳐진 높은 고원',
    '산과 바다가 만나는 해안',
    '사막을 흐르는 큰 강가',
    '덥고 습한 바닷가',
    '열대 우림에서 흘러오는 큰 강가',
  ] as const,
};

export interface ClueDoc {
  image: string;
  observation: string; // 사진만으로는 알 수 없는 사실만 짧게 (없으면 빈 문자열)
  model: string; // 모범 해설
  credit: string; // 사진 출처 (화면에는 표시하지 않음, 발표 자료 출처 표기용으로 보관)
}

export interface DeliveryBox {
  id: BoxId;
  pinNumber: 1 | 2 | 3 | 4 | 5;
  pinCircle: string;
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
    pinNumber: 4,
    pinCircle: '4',
    codeName: '택배 A',
    cityName: '킨샤사',
    countryName: '콩고 민주 공화국',
    lat: -4.32,
    lng: 15.31,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image11.jpg',
        observation: '이 나라의 큰 강 상류 쪽에 펼쳐진 숲입니다.',
        model: '키 큰 나무와 풀이 빽빽하게 자란 숲이 보이므로 열대 우림입니다. 교과서는 열대 우림이 발달한 곳으로 중앙아프리카를 소개합니다.',
        credit: '사진: Anand Osuri, 「Tropical rainforest Agumbe」(2011), Wikimedia Commons, CC BY-SA 4.0',
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image5.png',
        observation: '',
        model: '6~8월에 비가 적은 시기가 있지만, 1년 내내 월평균 기온이 23℃ 이상이고 나머지 달에는 비가 많이 내리므로 열대 기후입니다. 열대 기후는 적도 부근에 나타나므로 북부와 남부는 제외됩니다.',
        credit: '자료: 일본 기상청 세계 평년값, 킨샤사 관측소(WMO 64210), 1991-2020 자료 바탕으로 작성',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image10.jpg',
        observation: '이 나라의 한 농업 시설에 있는 건물입니다.',
        model: '풀과 나무 같은 주변 재료로 지붕을 덮은 건물입니다. 교과서는 고온 다습한 지역에서 풀과 나무, 흙으로 집을 짓는다고 설명합니다. 덥고 비가 많은 지역이므로 건조 기후인 북부와 온대 기후인 남부는 제외됩니다.',
        credit: '사진: Ken Wiegand/USAID, Pixnio, CC0 (퍼블릭 도메인)',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image7.png',
        observation: '',
        model: '폭이 넓은 큰 강을 사이에 두고 이웃 나라의 수도와 마주 보고 있는 도시입니다. 교과서 72쪽 지도에서 큰 강을 사이에 두고 두 나라의 수도가 맞붙어 있는 곳을 찾아보면 중앙아프리카에 있습니다.',
        credit: '',
      },
    },
    address: {
      region: '중앙',
      equatorSide: '남쪽',
      environment: '열대 우림에서 흘러오는 큰 강가',
    },
  },
  B: {
    id: 'B',
    pinNumber: 5,
    pinCircle: '5',
    codeName: '택배 B',
    cityName: '케이프타운',
    countryName: '남아프리카 공화국',
    lat: -33.92,
    lng: 18.42,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image12.png',
        observation: '항구 주변의 건물들은 일찍부터 이곳에 들어온 유럽인의 영향을 받은 유럽풍 건물입니다.',
        model: '해안의 항구 주변에 유럽풍 건물이 늘어서 있습니다. 교과서는 해안을 따라 온대 기후가 나타나 일찍부터 유럽인이 진출한 곳으로 남부 아프리카를 소개합니다.',
        credit: '사진: Andreas Tusche, 「Cape Town Waterfront」(2004), Wikimedia Commons, GFDL 1.2',
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image6.png',
        observation: '이 도시 주변에서는 포도를 많이 재배합니다.',
        model: '포도는 너무 덥거나 춥지 않은 온화한 기후에서 잘 자라므로 이곳은 온대 기후 지역입니다. 아프리카에서 온대 기후는 대륙의 북쪽 끝과 남쪽 끝에 좁게 나타납니다.',
        credit: '사진: pxhere 무료이미지',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image8.png',
        observation: '',
        model: '연평균 기온이 17.6℃이고 가장 따뜻한 달도 22℃ 정도라 많이 덥지 않습니다. 너무 덥지도 춥지도 않은 온화한 기후이므로 온대 기후 지역입니다. 아프리카에서 온대 기후는 대륙의 북쪽 끝과 남쪽 끝에 좁게 나타납니다.',
        credit: '자료: climate-zone.com(NOAA 관측 자료 기반), 케이프타운 국제공항, 1991-2020 자료 바탕으로 작성',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image15.png',
        observation: '',
        model: '이 나라의 서쪽 해안과 동쪽 해안이 서로 다른 대양에 맞닿아 있다고 합니다. 교과서 72쪽 지도에서 서쪽은 대서양, 동쪽은 인도양에 모두 접한 나라를 찾으면 대륙의 남쪽 끝에 있습니다.',
        credit: '사진: pixabay 무료이미지',
      },
    },
    address: {
      region: '남부',
      equatorSide: '남쪽',
      environment: '산과 바다가 만나는 해안',
    },
  },
  C: {
    id: 'C',
    pinNumber: 1,
    pinCircle: '1',
    codeName: '택배 C',
    cityName: '카이로',
    countryName: '이집트',
    lat: 30.04,
    lng: 31.24,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image13.jpg',
        observation: '',
        model: '풀과 나무가 거의 없고 모래와 돌로 덮인 땅이 보이므로 강수량이 매우 적은 건조 기후 지역입니다. 아프리카에서 건조 기후는 북부의 사하라 사막과 남부의 나미브·칼라하리 사막에 나타납니다.',
        credit: '사진: Jason Larkin/Panos Pictures, CNN Style 「Egypt\'s new capital to rise from the sand」(2016. 10. 10.)',
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image16.png',
        observation: '',
        model: '연강수량이 24mm이고 거의 모든 달의 강수량이 10mm에 못 미칩니다. 비가 거의 내리지 않으므로 건조 기후이며, 교과서 75쪽의 건조 기후 지역 그래프와 모양이 비슷합니다.',
        credit: '자료: weatherandclimate.eu, 카이로 국제공항 관측소(WMO 62366) 자료 바탕으로 작성',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image4.png',
        observation: '사진 속 건물은 이슬람교 사원인 모스크입니다.',
        model: '사진 속 건물은 이슬람교 사원인 모스크입니다. 아프리카에서 이슬람의 영향을 많이 받은 지역은 북부 아프리카입니다.',
        credit: '사진: © Vyacheslav Argenberg, 「Egypt, Cairo, The courtyard of Al-Azhar」(2007), Wikimedia Commons, CC BY 4.0',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image9.png',
        observation: '',
        model: '비가 거의 없는 땅에 큰 강이 흐르고, 강을 따라서만 초록색 농경지와 마을이 길게 이어져 있습니다. 사막을 지나 흐르는 아프리카의 큰 강은 나일강이며, 나일강은 북쪽으로 흘러 지중해로 들어갑니다.',
        credit: '',
      },
    },
    address: {
      region: '북부',
      equatorSide: '북쪽',
      environment: '사막을 흐르는 큰 강가',
    },
  },
  D: {
    id: 'D',
    pinNumber: 3,
    pinCircle: '3',
    codeName: '택배 D',
    cityName: '나이로비',
    countryName: '케냐',
    lat: -1.29,
    lng: 36.82,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image1.jpg',
        observation: '높은 땅에 있는 이 지역에는 땅(지각)이 갈라지면서 생긴 거대한 골짜기가 있습니다. 사진은 그 골짜기 가장자리의 절벽입니다.',
        model: '지각이 갈라져 생긴 거대한 골짜기와 그 가장자리를 따라 이어진 높은 절벽이 보입니다. 아프리카에서 지각이 갈라지고 있는 곳은 동아프리카 지구대입니다.',
        credit: '사진: Andreas Wisniowski, 「Kenya-Escarpment」(2014), Wikimedia Commons, CC BY-SA 4.0',
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image18.jpg',
        observation: '이 도시는 비가 많이 오는 시기(우기)와 거의 오지 않는 시기(건기)가 뚜렷합니다.',
        model: '키가 큰 풀이 자란 넓은 초원에 야생 동물이 살고 있습니다. 이런 초원은 우기와 건기가 뚜렷한 지역에 나타나며, 교과서는 야생 동식물이 사는 대표적인 초원으로 동부 아프리카의 세렝게티 초원을 소개합니다.',
        credit: '사진: Timothy A. Gonsalves, 「Buffalo Nairobi Skyline Savannah Kenya May19」(2019), Wikimedia Commons, CC BY-SA 4.0',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image3.png',
        observation: '',
        model: '적도와 가까운데도 해발 약 1,700m의 높은 땅이어서 1년 내내 20℃ 안팎으로 선선하다고 합니다. 교과서는 기온이 선선하여 예부터 사람이 많이 모여 산 고원 지역이 동부 아프리카에 있다고 설명합니다.',
        credit: '사진: pixabay 무료이미지',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image14.png',
        observation: '이 지역 토착민 부족의 전통 의상입니다.',
        model: '붉은색 천과 화려한 구슬 장신구가 특징인 전통 의상입니다. 교과서 76쪽에 실린 동부 아프리카 마사이족의 전통 의상과 모습이 비슷합니다.',
        credit: '사진: Mrinal Mohit, 「Maasai dancer in Loita Hills, Kenya」(2017), Wikimedia Commons, CC BY-SA 4.0',
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
    pinNumber: 2,
    pinCircle: '2',
    codeName: '택배 E',
    cityName: '라고스',
    countryName: '나이지리아',
    lat: 6.52,
    lng: 3.38,
    docs: {
      '1': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image2.png',
        observation: '바다 쪽으로 뻗어 있는 둑은 파도에 해안이 깎여 나가는 것을 막기 위해 쌓은 시설입니다.',
        model: '도시가 바다에 바로 맞닿아 있고, 파도를 막는 둑이 바다 쪽으로 뻗어 있습니다. 바닷가에 자리한 지점이 후보가 되고, 바다와 떨어진 중앙·동부 지점은 제외됩니다.',
        credit: '사진: Ben Iwara, Pexels (2024)',
      },
      '2': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image20.png',
        observation: '',
        model: '1년 내내 월평균 기온이 25℃ 이상이고, 연강수량이 약 1,550mm로 많습니다. 열대 기후는 적도 부근에 나타나므로 북부와 남부는 제외됩니다. 다만 이 자료만으로는 적도 부근의 다른 지역과 구별하기 어렵습니다.',
        credit: '자료: weatherandclimate.eu, 라고스 이케자 관측소 자료 바탕으로 작성',
      },
      '3': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image19.png',
        observation: '',
        model: '컨테이너가 높이 쌓여 있고 화물선이 정박해 있어 바닷길을 이용한 무역이 활발한 곳입니다. 교과서는 해안 지역에서 수출 산업을 중심으로 경제 활동이 활발한 곳으로 서부 아프리카를 소개합니다.',
        credit: '사진: scenar308 (Bernd S), 「Port Apapa Lagos Nigeria」, Wikimedia Commons, CC BY 2.0',
      },
      '4': {
        image: 'https://raw.githubusercontent.com/baewe/afri-express/main/images/image17.png',
        observation: '',
        model: '일자리를 찾아 사람들이 몰려들어 인구가 빠르게 늘었고, 아프리카에서 인구가 가장 많은 대도시 가운데 하나라고 합니다. 교과서 73쪽에서 인구가 많은 대도시가 있다고 소개한 지역은 서부 아프리카입니다.',
        credit: '',
      },
    },
    address: {
      region: '서부',
      equatorSide: '북쪽',
      environment: '덥고 습한 바닷가',
    },
  },
};
