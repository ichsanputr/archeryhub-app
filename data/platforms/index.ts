export type PlatformKey = 'rust' | 'python' | 'java' | 'php' | 'javascript' | 'typescript'

export interface PlatformContent {
  name: string
  heroTitle: string
  heroSubtitle: string
  accentGradient: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  logoIcon: string
  brandName: string
  brandColor: string
}

export const platforms: Record<PlatformKey, PlatformContent> = {
  rust: {
    name: 'Rust',
    heroTitle: 'Rust Coding Challenge Platform',
    heroSubtitle:
      'Learn Rust by solving coding challenges and competitive problems. Practice Rust, learn new concepts, and improve your skills with curated problems.',
    accentGradient: 'hero-gradient-rust',
    seoTitle: 'Rust Coding Challenge Platform - Catsentence',
    seoDescription:
      'Learn Rust programming with free coding challenges and competitive programming problems. Practice Rust code challenges, learn new concepts, and improve your programming skills with curated Rust problems.',
    seoKeywords:
      'rust, code challenge, competitive programming, free, rust programming, coding problems, rust exercises, programming practice, rust language, coding challenges, rust problems',
    logoIcon: 'logos:rust',
    brandName: 'Rust Challenge',
    brandColor: 'text-orange-600'
  },
  python: {
    name: 'Python',
    heroTitle: 'Python Coding Challenge Platform',
    heroSubtitle:
      'Learn Python by solving coding challenges and competitive problems. Practice Python, learn new concepts, and improve your skills with curated problems.',
    accentGradient: 'hero-gradient-python',
    seoTitle: 'Python Coding Challenge Platform - Catsentence',
    seoDescription:
      'Learn Python programming with free coding challenges and competitive programming problems. Practice Python code challenges, learn new concepts, and improve your programming skills with curated Python problems.',
    seoKeywords:
      'python, code challenge, competitive programming, free, python programming, coding problems, python exercises, programming practice, python language, coding challenges, python problems',
    logoIcon: 'devicon:python',
    brandName: 'Python Challenge',
    brandColor: 'text-blue-600'
  },
  java: {
    name: 'Java',
    heroTitle: 'Java Coding Challenge Platform',
    heroSubtitle:
      'Learn Java by solving coding challenges and competitive problems. Practice Java, learn new concepts, and improve your skills with curated problems.',
    accentGradient: 'hero-gradient-java',
    seoTitle: 'Java Coding Challenge Platform - Catsentence',
    seoDescription:
      'Learn Java programming with free coding challenges and competitive programming problems. Practice Java code challenges, learn new concepts, and improve your programming skills with curated Java problems.',
    seoKeywords:
      'java, code challenge, competitive programming, free, java programming, coding problems, java exercises, programming practice, java language, coding challenges, java problems',
    logoIcon: 'devicon:java',
    brandName: 'Java Challenge',
    brandColor: 'text-red-600'
  },
  php: {
    name: 'PHP',
    heroTitle: 'PHP Coding Challenge Platform',
    heroSubtitle:
      'Learn PHP by solving coding challenges and competitive problems. Practice PHP, learn new concepts, and improve your skills with curated problems.',
    accentGradient: 'hero-gradient-php',
    seoTitle: 'PHP Coding Challenge Platform - Catsentence',
    seoDescription:
      'Learn PHP programming with free coding challenges and competitive programming problems. Practice PHP code challenges, learn new concepts, and improve your programming skills with curated PHP problems.',
    seoKeywords:
      'php, code challenge, competitive programming, free, php programming, coding problems, php exercises, programming practice, php language, coding challenges, php problems',
    logoIcon: 'devicon:php',
    brandName: 'PHP Challenge',
    brandColor: 'text-violet-600'
  },
  javascript: {
    name: 'JavaScript',
    heroTitle: 'JavaScript Coding Challenge Platform',
    heroSubtitle:
      'Learn JavaScript by solving coding challenges and competitive problems. Practice JavaScript, learn new concepts, and improve your skills with curated problems.',
    accentGradient: 'hero-gradient-javascript',
    seoTitle: 'JavaScript Coding Challenge Platform - Catsentence',
    seoDescription:
      'Learn JavaScript programming with free coding challenges and competitive programming problems. Practice JavaScript code challenges, learn new concepts, and improve your programming skills with curated JavaScript problems.',
    seoKeywords:
      'javascript, js, code challenge, competitive programming, free, javascript programming, coding problems, javascript exercises, programming practice, javascript language, coding challenges, javascript problems',
    logoIcon: 'devicon:javascript',
    brandName: 'JavaScript Challenge',
    brandColor: 'text-yellow-500'
  },
  typescript: {
    name: 'TypeScript',
    heroTitle: 'TypeScript Coding Challenge Platform',
    heroSubtitle:
      'Learn TypeScript by solving coding challenges and competitive problems. Practice TypeScript, learn new concepts, and improve your skills with curated problems.',
    accentGradient: 'hero-gradient-typescript',
    seoTitle: 'TypeScript Coding Challenge Platform - Catsentence',
    seoDescription:
      'Learn TypeScript programming with free coding challenges and competitive programming problems. Practice TypeScript code challenges, learn new concepts, and improve your programming skills with curated TypeScript problems.',
    seoKeywords:
      'typescript, ts, code challenge, competitive programming, free, typescript programming, coding problems, typescript exercises, programming practice, typescript language, coding challenges, typescript problems',
    logoIcon: 'devicon:typescript',
    brandName: 'TypeScript Challenge',
    brandColor: 'text-blue-700'
  }
}

export function getPlatformContent(platform: string | undefined | null): PlatformContent {
  const key = (platform || 'rust').toLowerCase()
  if (key === 'javascript') return platforms.javascript
  if (key === 'typescript') return platforms.typescript
  if (key === 'php') return platforms.php
  if (key === 'java') return platforms.java
  if (key === 'python') return platforms.python
  return platforms.rust
}


