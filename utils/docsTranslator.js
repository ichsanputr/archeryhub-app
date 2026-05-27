// Archery Hub / Archeris Documentation Translator Utility
// Supports English (en), Indonesian (id), and Korean (kr)
import { idTranslations } from '~/data/docs/translations/id/index.js'

const docTranslations = {
  'apa-itu-archeris': {
    kr: {
      title: 'Archeris.net이란 무엇인가요?',
      excerpt: 'Archeris.net의 핵심 아키텍처, 주요 기능 및 대상 사용자에 대해 알아봅니다.',
      content: `
        <p><strong>Archeris.net</strong>은 양궁 대회 운영, 실시간 스코어 기록, 그리고 선수 포트폴리오 관리를 돕기 위해 설계된 통합 양궁 관리 플랫폼입니다. 아처(선수), 클럽 및 대회 운영사(조직), 그리고 양궁 장비 판매자(벤더)를 위한 맞춤형 서비스를 제공합니다.</p>
        <h2>1. 핵심 비전</h2>
        <p>전통적인 종이 기반의 양궁 운영 방식을 디지털화하여 혁신합니다. 자동 사로 배정 시스템, 오프라인 입력을 지원하는 디지털 스코어카드, 토너먼트 대진표 자동 생성 기능을 제공하여 운영의 효율성을 극대화합니다.</p>
        <h2>2. 주요 핵심 기능</h2>
        <ul>
          <li><strong>디지털 스코어keeper:</strong> 실시간 점수 입력 및 공공 리더보드 즉시 동기화 기능.</li>
          <li><strong>스마트 토너먼트 대진표:</strong> 예선 순위에 기반한 엘리미네이션 대진표 자동 생성.</li>
          <li><strong>통합 결제 시스템:</strong> QRIS, 가상계좌, 신용카드를 지원하는 원스톱 참가비 수납.</li>
        </ul>
      `
    }
  },
  'cara-daftar': {
    kr: {
      title: '계정 등록 방법',
      excerpt: 'Archeris.net에서 새로운 계정을 등록하는 단계별 가이드입니다.',
      content: `
        <h2 id="pilih-tipe">1. 회원 유형 선택</h2>
        <p>Archeris.net은 세 가지 기본 계정 유형을 제공합니다: <strong>궁사(선수)</strong>, <strong>단체/조직(운영사)</strong>, <strong>판매자(벤더)</strong>. 귀하의 역할에 맞는 유형을 선택하십시오.</p>
        <h2 id="daftar-email">2. 이메일로 가입하기</h2>
        <ol>
          <li>가입 페이지로 이동합니다.</li>
          <li>이름, 이메일 주소 및 비밀번호를 입력합니다.</li>
          <li>회원 유형을 선택합니다.</li>
          <li><strong>지금 가입하기</strong> 버튼을 클릭합니다.</li>
          <li>이메일로 발송된 인증 링크를 눌러 완료합니다.</li>
        </ol>
      `
    }
  },
  'jenis-busur': {
    kr: {
      title: '활의 종류 및 경기 부문',
      excerpt: '대회에서 사용되는 표준 활 분류 및 부문에 대한 종합 안내서입니다.',
      content: `
        <h2>1. 리커브 활 (올림픽 라운드)</h2>
        <p>올림픽 공식 종목에 사용되는 활로, 날개 끝이 조준선 반대 방향으로 휜 형태입니다. 조준기, 스테빌라이저, 클릭커 부착이 허용됩니다.</p>
        <h2>2. 컴파운드 활</h2>
        <p>도르래(캠)와 케이블 시스템을 적용하여 만작 시 당기는 힘을 크게 줄여주며, 매우 높은 정밀도의 조준을 가능하게 합니다.</p>
        <h2>3. 베어보우 및 트래디셔널</h2>
        <p>조준기나 스테빌라이저 등 일체의 조준 보조 장치를 달지 않은 활로, 선수의 직관이나 스트링 워킹 기술에 의존합니다.</p>
      `
    }
  },
  'paket-berlangganan': {
    kr: {
      title: '구독 요금제 및 패키지 안내',
      excerpt: '개인 및 클럽 구독 등급에 대한 자세한 비교 안내입니다.',
      content: `
        <h2>1. 아처 베이직 (무료)</h2>
        <p>기본적인 디지털 스코어카드 기록, 개인 기록 통계 및 대회 온라인 참가 신청 기능이 제공됩니다.</p>
        <h2>2. 아처 프로 (월 29,000루피아 / 약 2,500원)</h2>
        <p>상세한 발사 분석, 공인 실적 디지털 포트폴리오 생성, 사착군 분석 표적 차트를 제공합니다.</p>
        <h2>3. 클럽 엘리트 (월 149,000루피아 / 약 13,000원)</h2>
        <p>무제한 대회 개설, 동시 스코어키퍼 등록, 자동 참가비 정산 및 화이트라벨 토너먼트 대진표 지원.</p>
      `
    }
  }
};

const metadataTranslations = {
  'apa-itu-end': {
    kr: { title: '엔드(End)의 개념이란?', excerpt: '양궁 토너먼트에서 점수 기록과 발사 수 단위에 대해 배웁니다.' }
  },
  'cara-menjual-barang': {
    kr: { title: '상품 판매 등록 방법', excerpt: '셀러 회원이 마켓플레이스에 장비 및 액세서리를 업로드하는 방법 안내.' }
  },
  'fase-eliminasi': {
    kr: { title: '엘리미네이션 토너먼트 규정', excerpt: '대진표 매치, 동점 슛오프 및 공식 1:1 토너먼트 규정을 학습합니다.' }
  },
  'fase-kualifikasi': {
    kr: { title: '예선 라운드 운영 가이드', excerpt: '순위 결정을 위한 예선 라운드 스코어 기록 및 표적 배치 기준 안내.' }
  },
  'fee-biaya-admin': {
    kr: { title: '수수료 및 관리 비용 안내', excerpt: '안전 결제 게이트웨이 수수료 및 마켓플레이스 거래 수수료 투명 정보.' }
  },
  'jarak-dan-target': {
    kr: { title: '경기 거리 및 표적 규격', excerpt: '각 경기 부문별 공식 타겟 규격(80cm, 122cm) 및 사거리 기준.' }
  },
  'kategori-lomba': {
    kr: { title: '대회 세부 종목 카테고리', excerpt: '연령대, 활 부문, 단체전 구성을 위한 카테고리 설정 개요.' }
  },
  'mobile-app-scoring': {
    kr: { title: '모바일 앱 실시간 스코어링', excerpt: '심판 및 기록원이 모바일 앱을 통해 실시간으로 점수를 입력하는 가이드.' }
  },
  'sinkronisasi-tim': {
    kr: { title: '팀 자동 동기화 기능', excerpt: '예선 개인전 점수를 기반으로 단체전 팀을 시스템에서 자동 빌드하는 가이드.' }
  },
  'scorekeeper': {
    kr: { title: '스코어키퍼 등록 및 권한 설정', excerpt: '운영진이 사로별 기록원을 할당하고 보안 로그인 코드를 부여하는 법.' }
  },
  'membuat-event': {
    kr: { title: '신규 양궁 이벤트 생성', excerpt: '이벤트 상세 일정, 참가 요금제, 사로 배정 규칙을 디자인하는 방법.' }
  },
  'mendaftar-event': {
    kr: { title: '양궁 대회 참가 신청', excerpt: '궁사(선수) 회원이 진행 중인 대회에 참가 신청 및 결제하는 가이드.' }
  }
};

const dictionary = {
  id: {
    'All': 'Semua',
    'Platform': 'Platform',
    'Archer Account': 'Akun Pemanah',
    'Archery Technical': 'Teknis Panahan',
    'Subscription': 'Berlangganan',
    'Event Management': 'Manajemen Event',
    'Scoring': 'Scoring',
    'Marketplace': 'Marketplace',
    'min': 'menit',
    'read': 'membaca'
  },
  kr: {
    'All': '전체',
    'Platform': '플랫폼',
    'Archer Account': '궁사 계정',
    'Archery Technical': '양궁 기술',
    'Subscription': '구독 요금제',
    'Event Management': '이벤트 관리',
    'Scoring': '스코어링',
    'Marketplace': '마켓플레이스',
    'min': '분',
    'read': '읽기'
  }
};

export function translateText(text, locale, slug = '') {
  if (!locale || locale === 'en') return text;

  // 1. Check ID translations dictionary
  if (locale === 'id') {
    if (dictionary.id[text]) return dictionary.id[text];
    return text;
  }

  // 2. Check direct doc translations for Korean
  if (slug && docTranslations[slug] && docTranslations[slug][locale]) {
    const matched = docTranslations[slug][locale];
    if (text === matched.title || text === matched.excerpt) {
      return text;
    }
  }

  // 3. Check metadata translations for Korean
  if (slug && metadataTranslations[slug] && metadataTranslations[slug][locale]) {
    const item = metadataTranslations[slug][locale];
    return item.title;
  }

  // 4. Fallback dictionary translations for Korean
  if (dictionary.kr[text]) {
    return dictionary.kr[text];
  }

  return text;
}

export function translateDoc(doc, locale) {
  if (!doc) return doc;

  const slug = doc.slug;

  // 1. If Indonesian is requested and we have the translation, return it!
  if (locale === 'id') {
    if (idTranslations[slug]) {
      return idTranslations[slug];
    }
    return doc;
  }

  // 2. If English or default is requested, return base English doc
  if (locale === 'en' || !locale) {
    return {
      ...doc,
      readTime: doc.readTime ? doc.readTime.replace('menit', 'min').replace('hari', 'days') : ''
    };
  }

  // 3. For Korean (kr)
  const hasFullTranslation = docTranslations[slug] && docTranslations[slug]['kr'];

  return {
    ...doc,
    title: hasFullTranslation ? docTranslations[slug]['kr'].title : translateText(doc.title, 'kr', slug),
    excerpt: hasFullTranslation ? docTranslations[slug]['kr'].excerpt : translateText(doc.excerpt, 'kr', slug),
    content: hasFullTranslation ? docTranslations[slug]['kr'].content : doc.content,
    readTime: doc.readTime ? doc.readTime.replace('menit', '분').replace('hari', '일') : ''
  };
}
