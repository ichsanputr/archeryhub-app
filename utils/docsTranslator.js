// Archery Hub / Archeris Documentation Translator Utility
// Supports English (en), Indonesian (id), and Korean (kr)

const docTranslations = {
  'apa-itu-archeris': {
    en: {
      title: 'What is Archeris.net?',
      excerpt: 'Learn about the core architecture, target audience, and primary features of Archeris.net.',
      content: `
        <p><strong>Archeris.net</strong> is an integrated archery management platform designed to simplify tournament organization, live scoring, and athlete portfolio development. Built with modern web technologies, the platform caters to three primary user groups: Archers, Organizations (Clubs/Event Organizers), and Vendors.</p>
        <h2>1. Core Vision</h2>
        <p>Our vision is to digitalize the traditional, paper-based archery ecosystem. By introducing automated target butt assignment, digital scorecards with offline support, and automatic bracket generation for elimination rounds, we allow organizers to focus on delivering high-quality events while providing archers with instant performance feedback.</p>
        <h2>2. Key Features</h2>
        <ul>
          <li><strong>Digital Scorekeeper:</strong> Real-time input via mobile apps or browsers with automatic leaderboard updates.</li>
          <li><strong>Smart Bracket Builder:</strong> Generates custom brackets for elimination matches instantly.</li>
          <li><strong>Payment Integration:</strong> Secure registrations supporting digital wallets, bank transfers, and credit cards.</li>
        </ul>
      `
    },
    kr: {
      title: 'Archeris.net이란 무엇인가요?',
      excerpt: 'Archeris.net의 핵심 아키텍처, 주요 기능 및 대상 사용자에 대해 알아봅니다.',
      content: `
        <p><strong>Archeris.net</strong>은 양궁 대회 운영, 실시간 스코어 기록, 그리고 선수 포트폴리오 관리를 돕기 위해 설계된 통합 양궁 관리 플랫폼입니다. 아처(선수), 클럽 및 대회 운영사(조직), 그리고 양궁 장비 판매자(벤더)를 위한 맞춤형 서비스를 제공합니다.</p>
        <h2>1. 핵심 비전</h2>
        <p>전통적인 종이 기반의 양궁 운영 방식을 디지털화하여 혁신합니다. 자동 사로 배정 시스템, 오프라인 입력을 지원하는 디지털 스코어카드, 토너먼트 대진표 자동 생성 기능을 제공하여 운영의 효율성을 극대화합니다.</p>
        <h2>2. 주요 핵심 기능</h2>
        <ul>
          <li><strong>디지털 스코어키퍼:</strong> 실시간 점수 입력 및 공공 리더보드 즉시 동기화 기능.</li>
          <li><strong>스마트 토너먼트 대진표:</strong> 예선 순위에 기반한 엘리미네이션 대진표 자동 생성.</li>
          <li><strong>통합 결제 시스템:</strong> QRIS, 가상계좌, 신용카드를 지원하는 원스톱 참가비 수납.</li>
        </ul>
      `
    }
  },
  'cara-daftar': {
    en: {
      title: 'How to Register an Account',
      excerpt: 'Step-by-step guide to registering a new account on Archeris.net.',
      content: `
        <h2 id="pilih-tipe">1. Choose User Role</h2>
        <p>Archeris.net provides three main account types: <strong>Archer</strong>, <strong>Organization</strong>, and <strong>Vendor</strong>. Select the role that matches your objective.</p>
        <h2 id="daftar-email">2. Sign Up via Email</h2>
        <ol>
          <li>Visit the registration page.</li>
          <li>Fill in your full name, email address, and a secure password.</li>
          <li>Select your account type.</li>
          <li>Click the <strong>Register Now</strong> button.</li>
          <li>Verify your account via the link sent to your email.</li>
        </ol>
      `
    },
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
    en: {
      title: 'Bow Types & Divisions',
      excerpt: 'A comprehensive guide to standard bow classifications used in tournaments.',
      content: `
        <h2>1. Recurve Bow (Olympic)</h2>
        <p>The standard bow type used in the Olympic Games, featuring limbs that curve away from the archer. Allows stabilizers, sights, and clickers.</p>
        <h2>2. Compound Bow</h2>
        <p>Uses a system of cams and cables to reduce draw weight at full draw, allowing for highly precise aiming.</p>
        <h2>3. Barebow & Traditional</h2>
        <p>Recurve bows without any sights or stabilizers, relying completely on instinctive or string-walking aiming techniques.</p>
      `
    },
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
    en: {
      title: 'Subscription Plans & Pricing',
      excerpt: 'Detailed overview of individual and club subscription tiers.',
      content: `
        <h2>1. Archer Basic (Free)</h2>
        <p>Includes basic digital scorecards, personal statistics, and event registration.</p>
        <h2>2. Archer Pro ($2/month)</h2>
        <p>Unlocks detailed performance analytics, verified achievement digital portfolios, and target hit charts.</p>
        <h2>3. Club Elite ($10/month)</h2>
        <p>Complete tournament builder, unlimited scorekeeper registration, QRIS automated billing, and custom white-label brackets.</p>
      `
    },
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
  // Common fallback title translations for metadata listing
  'apa-itu-end': {
    en: { title: 'What is an End?', excerpt: 'Understanding the scoring units and structural rounds in archery tournaments.' },
    kr: { title: '엔드(End)의 개념이란?', excerpt: '양궁 토너먼트에서 점수 기록과 발사 수 단위에 대해 배웁니다.' }
  },
  'cara-menjual-barang': {
    en: { title: 'How to Sell Items', excerpt: 'Complete guide for merchants on listing bow accessories and equipment in the Marketplace.' },
    kr: { title: '상품 판매 등록 방법', excerpt: '셀러 회원이 마켓플레이스에 장비 및 액세서리를 업로드하는 방법 안내.' }
  },
  'fase-eliminasi': {
    en: { title: 'Elimination Phase Rules', excerpt: 'Learn the official head-to-head rules, tie-breaker shoot-offs, and target matches.' },
    kr: { title: '엘리미네이션 토너먼트 규정', excerpt: '대진표 매치, 동점 슛오프 및 공식 1:1 토너먼트 규정을 학습합니다.' }
  },
  'fase-kualifikasi': {
    en: { title: 'Qualification Phase Guide', excerpt: 'Official guidelines for scoring ends, target distances, and seeding ranking rounds.' },
    kr: { title: '예선 라운드 운영 가이드', excerpt: '순위 결정을 위한 예선 라운드 스코어 기록 및 표적 배치 기준 안내.' }
  },
  'fee-biaya-admin': {
    en: { title: 'Fees & Admin Costs', excerpt: 'Transparent breakdown of marketplace commissions and secure payment gateway transaction fees.' },
    kr: { title: '수수료 및 관리 비용 안내', excerpt: '안전 결제 게이트웨이 수수료 및 마켓플레이스 거래 수수료 투명 정보.' }
  },
  'jarak-dan-target': {
    en: { title: 'Distances and Targets', excerpt: 'Official target sizes (80cm, 122cm) and distances designated for standard divisions.' },
    kr: { title: '경기 거리 및 표적 규격', excerpt: '각 경기 부문별 공식 타겟 규격(80cm, 122cm) 및 사거리 기준.' }
  },
  'kategori-lomba': {
    en: { title: 'Competition Categories', excerpt: 'Overview of age groups, bow divisions, and team structures available for creation.' },
    kr: { title: '대회 세부 종목 카테고리', excerpt: '연령대, 활 부문, 단체전 구성을 위한 카테고리 설정 개요.' }
  },
  'mobile-app-scoring': {
    en: { title: 'Scoring via Mobile App', excerpt: 'Referee and scorekeeper guide for real-time digital score entries.' },
    kr: { title: '모바일 앱 실시간 스코어링', excerpt: '심판 및 기록원이 모바일 앱을 통해 실시간으로 점수를 입력하는 가이드.' }
  },
  'sinkronisasi-tim': {
    en: { title: 'Automatic Team Synchronization', excerpt: 'Learn how the system automatically forms teams for the team elimination round.' },
    kr: { title: '팀 자동 동기화 기능', excerpt: '예선 개인전 점수를 기반으로 단체전 팀을 시스템에서 자동 빌드하는 가이드.' }
  },
  'scorekeeper': {
    en: { title: 'Scorekeeper Assignment Guide', excerpt: 'How organizers assign scorekeepers and manage security PIN codes.' },
    kr: { title: '스코어키퍼 등록 및 권한 설정', excerpt: '운영진이 사로별 기록원을 할당하고 보안 로그인 코드를 부여하는 법.' }
  },
  'membuat-event': {
    en: { title: 'Creating a New Event', excerpt: 'How organizers configure target butts, registration schedules, and categories.' },
    kr: { title: '신규 양궁 이벤트 생성', excerpt: '이벤트 상세 일정, 참가 요금제, 사로 배정 규칙을 디자인하는 방법.' }
  },
  'mendaftar-event': {
    en: { title: 'Registering for an Event', excerpt: 'Step-by-step guide for archers to register and pay for tournaments.' },
    kr: { title: '양궁 대회 참가 신청', excerpt: '궁사(선수) 회원이 진행 중인 대회에 참가 신청 및 결제하는 가이드.' }
  }
};

export function translateText(text, locale, slug = '') {
  if (!locale || locale === 'id') return text;

  // 1. Check direct doc translations
  if (slug && docTranslations[slug] && docTranslations[slug][locale]) {
    const matched = docTranslations[slug][locale];
    if (text === matched.title || text === matched.excerpt) {
      return text;
    }
  }

  // 2. Check metadata translations
  if (slug && metadataTranslations[slug] && metadataTranslations[slug][locale]) {
    const item = metadataTranslations[slug][locale];
    // If the original text starts with typical ID strings, map it
    if (text.toLowerCase().includes('cara') || text.toLowerCase().includes('fase') || text.toLowerCase().includes('manajemen') || text.toLowerCase().includes('paket') || text.toLowerCase().includes('apa itu') || text.toLowerCase().includes('sinkronisasi')) {
      return item.title;
    }
  }

  // 3. Fallback dictionary translations for common structural phrases
  const dictionary = {
    en: {
      'Semua': 'All',
      'Platform': 'Platform',
      'Akun Pemanah': 'Archer Account',
      'Teknis Panahan': 'Archery Technical',
      'Berlangganan': 'Subscription',
      'Manajemen Event': 'Event Management',
      'Scoring': 'Scoring',
      'Marketplace': 'Marketplace',
      'Cara Mendaftar Akun': 'How to Register an Account',
      'Cara Menjual Barang': 'How to Sell Items',
      'Fase Eliminasi': 'Elimination Phase',
      'Fase Kualifikasi': 'Qualification Phase',
      'Fee & Biaya Admin': 'Fees & Admin Costs',
      'Jarak dan Target': 'Distance and Targets',
      'Jenis Busur': 'Bow Types',
      'Kategori Lomba': 'Competition Categories',
      'Kategorisasi Produk': 'Product Categorization',
      'Keranjang Belanja': 'Shopping Cart',
      'Manajemen Keuangan': 'Financial Management',
      'Manajemen Peserta': 'Participant Management',
      'Manajemen Profil': 'Profile Management',
      'Membeli Barang': 'Buying Items',
      'Membuat Event': 'Creating Events',
      'Mendaftar Event': 'Registering for Events',
      'Mobile App Scoring': 'Mobile App Scoring',
      'Modul News': 'News Module',
      'Paket Berlangganan': 'Subscription Plans',
      'Pendaftaran Peserta': 'Participant Registration',
      'Penempatan Bantalan': 'Target Butt Placement',
      'Peran Pengguna': 'User Roles',
      'Profil Pemanah': 'Archer Profile',
      'Registrasi Ulang': 'Re-registration',
      'Scorekeeper': 'Scorekeeper Guide',
      'Sinkronisasi Tim': 'Team Synchronization',
      'Sistem Eliminasi': 'Elimination System',
      'Sistem Scoring Kualifikasi': 'Qualification Scoring',
      'Status Pendaftaran': 'Registration Status',
      'Ukuran Bracket': 'Bracket Sizes',
      'Apa Itu Archeris': 'What is Archeris.net?',
      'Apa Itu End': 'What is an End?',
      'Mengenal Archeris.net secara mendalam': 'Getting to know Archeris.net deeply',
      'Panduan khusus untuk pengguna akun Pemanah': 'Guides tailored for Archer account users',
      'Pengetahuan dasar dan teknis panahan': 'Fundamental and technical archery knowledge',
      'Paket dan fitur berlangganan': 'Subscription plans and core features',
      'Panduan pengelolaan event': 'Event setup and tournament guidelines',
      'Sistem penilaian dan scoring': 'Judging system and scoring guides',
      'Jual beli perlengkapan panahan': 'Buying and selling archery equipment',
      'menit': 'min',
      'membaca': 'read'
    },
    kr: {
      'Semua': '전체',
      'Platform': '플랫폼',
      'Akun Pemanah': '궁사 계정',
      'Teknis Panahan': '양궁 기술',
      'Berlangganan': '구독 요금제',
      'Manajemen Event': '이벤트 관리',
      'Scoring': '스코어링',
      'Marketplace': '마켓플레이스',
      'Cara Mendaftar Akun': '계정 등록 방법',
      'Cara Menjual Barang': '상품 판매 등록 방법',
      'Fase Eliminasi': '엘리미네이션 토너먼트 규정',
      'Fase Kualifikasi': '예선 라운드 운영 가이드',
      'Fee & Biaya Admin': '수수료 및 관리 비용',
      'Jarak dan Target': '경기 거리 및 표적 규격',
      'Jenis Busur': '활의 종류 및 경기 부문',
      'Kategori Lomba': '대회 세부 종목 카테고리',
      'Kategorisasi Produk': '상품 카테고리 분류',
      'Keranjang Belanja': '장바구니 기능',
      'Manajemen Keuangan': '재무 정산 관리',
      'Manajemen Peserta': '참가 선수 관리',
      'Manajemen Profil': '프로필 및 클럽 관리',
      'Membeli Barang': '상품 구매 및 결제',
      'Membuat Event': '신규 양궁 이벤트 생성',
      'Mendaftar Event': '양궁 대회 참가 신청',
      'Mobile App Scoring': '모바일 앱 실시간 스코어링',
      'Modul News': '소식 및 뉴스 게시 모듈',
      'Paket Berlangganan': '구독 요금제 및 패키지 안내',
      'Pendaftaran Peserta': '대회 참가자 접수',
      'Penempatan Bantalan': '사로 표적 판 배치 규정',
      'Peran Pengguna': '사용자 권한 및 역할',
      'Profil Pemanah': '궁사 프로필 편집',
      'Registrasi Ulang': '현장 참가 재등록',
      'Scorekeeper': '스코어키퍼 할당 및 핀코드',
      'Sinkronisasi Tim': '단체전 팀 자동 동기화',
      'Sistem Eliminasi': '토너먼트 엘리미네이션 규칙',
      'Sistem Scoring Kualifikasi': '예선 라운드 스코어 기록',
      'Status Pendaftaran': '참가자 승인 상태 조회',
      'Ukuran Bracket': '대진표 브래킷 사이즈',
      'Apa Itu Archeris': 'Archeris.net 소개 문서',
      'Apa Itu End': '양궁 엔드(End)의 개념',
      'Mengenal Archeris.net secara mendalam': 'Archeris.net에 대해 자세히 알아보기',
      'Panduan khusus untuk pengguna akun Pemanah': '궁사 계정 사용자를 위한 맞춤형 가이드',
      'Pengetahuan dasar dan teknis panahan': '양궁 기본 및 기술 지식',
      'Paket dan fitur berlangganan': '구독 패키지 및 핵심 기능',
      'Panduan pengelolaan event': '이벤트 설정 및 토너먼트 가이드라인',
      'Sistem penilaian dan scoring': '심사 시스템 및 스코어링 가이드',
      'Jual beli perlengkapan panahan': '양궁 장비 구매 및 판매',
      'menit': '분',
      'membaca': '읽기'
    }
  };

  if (dictionary[locale] && dictionary[locale][text]) {
    return dictionary[locale][text];
  }

  // Fallback for document titles and excerpts matching metadata list
  for (const s of Object.keys(metadataTranslations)) {
    if (slug === s && metadataTranslations[s][locale]) {
      if (text.toLowerCase().includes(s.replace('-', ' '))) {
        return metadataTranslations[s][locale].title;
      }
    }
  }

  return text;
}

export function translateDoc(doc, locale) {
  if (!doc || !locale || locale === 'id') return doc;

  const slug = doc.slug;
  const hasFullTranslation = docTranslations[slug] && docTranslations[slug][locale];

  return {
    ...doc,
    title: hasFullTranslation ? docTranslations[slug][locale].title : translateText(doc.title, locale, slug),
    excerpt: hasFullTranslation ? docTranslations[slug][locale].excerpt : translateText(doc.excerpt, locale, slug),
    content: hasFullTranslation ? docTranslations[slug][locale].content : convertHtmlHeadings(doc.content, locale, slug),
    readTime: doc.readTime ? doc.readTime.replace('menit', locale === 'kr' ? '분' : 'min') : ''
  };
}

function convertHtmlHeadings(content, locale, slug) {
  if (!content) return '';
  let updated = content;

  // Simple string replacer for headings to match translated TOC in key files
  if (slug === 'cara-daftar') {
    if (locale === 'kr') {
      updated = updated.replace('Pilih Tipe Akun', '회원 유형 선택');
      updated = updated.replace('Daftar via Email', '이메일로 가입하기');
      updated = updated.replace('Daftar via Google', '구글 계정으로 가입');
      updated = updated.replace('Verifikasi & Login', '이메일 인증 및 로그인');
    } else if (locale === 'en') {
      updated = updated.replace('Pilih Tipe Akun', 'Choose Account Type');
      updated = updated.replace('Daftar via Email', 'Register via Email');
      updated = updated.replace('Daftar via Google', 'Register via Google');
      updated = updated.replace('Verifikasi & Login', 'Verification & Login');
    }
  }

  return updated;
}
