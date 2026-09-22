export default defineNuxtConfig({
  ssr: true,
  devServer: {
    port: 3003,
  },
  modules: [
    '@vueuse/motion/nuxt',
    '@nuxtjs/i18n',
  ],
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://archeris.net',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        language: 'en-US',
        files: [
          'en/common.json',
          'en/auth.json',
          'en/dashboard.json',
          'en/tournaments.json',
          'en/archers.json',
          'en/commerce.json'
        ]
      },
      {
        code: 'id',
        iso: 'id-ID',
        name: 'Bahasa Indonesia',
        language: 'id-ID',
        files: [
          'id/common.json',
          'id/auth.json',
          'id/dashboard.json',
          'id/tournaments.json',
          'id/archers.json',
          'id/commerce.json'
        ]
      }
    ],
    lazy: false,
    langDir: 'locales',
    defaultLocale: 'en',
    fallbackLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    compilation: {
      strictMessage: false
    }
  },
  components: [
    {
      path: '~/components/common',
      pathPrefix: false,
    },
    '~/components'
  ],

  css: [
    "~/assets/css/main.css",
    "~/assets/scss/main.scss",
  ],
  runtimeConfig: {
    apiBaseUrl: process.env.NUXT_API_BASE_URL || process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
      siteUrl: 'https://archeris.net',
      siteName: 'Archeris',
      paddleClientToken: process.env.NUXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'test_e8c89b33a59fa8730ad3d1000bb',
      paddleSandbox: process.env.NUXT_PUBLIC_PADDLE_SANDBOX !== 'false',
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: false,
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Archeris - The Best Archery Scoring System',
      meta: [
        { name: 'robots', content: process.env.NUXT_PUBLIC_ROBOTS || 'index, follow' },
        { name: 'googlebot', content: process.env.NUXT_PUBLIC_ROBOTS || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
        {
          name: 'description',
          content: 'Archeris is the complete archery scoring system and competition management platform built for organizers and archers worldwide. It provides a simple and modern way to run tournaments, track standings, and handle archery scoring from any device.'
        },
        {
          name: 'keywords',
          content: 'archery scoring, archery scoring system, digital archery scoring, archery scorekeeper, archery tournament management, target butt allocation, ianseo alternative'
        },
        // Open Graph / Facebook / WhatsApp
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Archeris' },
        { property: 'og:title', content: 'Archeris - The Best Archery Scoring System' },
        { property: 'og:description', content: 'Archeris is the complete archery scoring system and competition management platform built for organizers and archers worldwide. It provides a simple and modern way to run tournaments, track standings, and handle archery scoring from any device.' },
        { property: 'og:image', content: 'https://archeris.net/og-default.jpg' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Archeris - The Best Archery Scoring System' },
        { name: 'twitter:description', content: 'Archeris is the complete archery scoring system and competition management platform built for organizers and archers worldwide. It provides a simple and modern way to run tournaments, track standings, and handle archery scoring from any device.' },
        { name: 'twitter:image', content: 'https://archeris.net/og-default.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Archeris RSS Feed', href: 'https://archeris.net/rss.xml' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap' }
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-ZCZ6KY7V2C',
          async: true
        },
        {
          innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-ZCZ6KY7V2C');`,
          type: 'text/javascript'
        },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js', defer: true }
      ]
    }
  },
  features: {
    inlineStyles: false,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  build: {
    transpile: [],
  },
  vite: {
    define: {
      "process.env.DEBUG": true, // Enable debug logging
    },
    server: {
      allowedHosts: true
    }
  },
  watch: ["data"],
  nitro: {
    minify: false,
    debug: true,
    devProxy: {
      host: 'localhost',
    },
    routeRules: {
      '/feed.xml': { redirect: { to: '/rss.xml', statusCode: 301 } },
      '/pricing': { redirect: { to: '/package', statusCode: 301 } },
      '/events': { redirect: { to: '/tournaments', statusCode: 301 } },
      '/events/**': { redirect: { to: '/tournaments/**', statusCode: 301 } },
      // Static media caching for Google PageSpeed / Lighthouse
      '/**/*.webp': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/**/*.png': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/**/*.jpg': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/**/*.jpeg': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/**/*.svg': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/**/*.mp4': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/**/*.ttf': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/**/*.woff2': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    }
  },
  // Ensure proper client-side error handling
  experimental: {
    payloadExtraction: false,
    appManifest: false
  },
  // Enable source maps for better debugging
  sourcemap: {
    server: true,
    client: true
  },
  // Ensure SSR compatibility for authentication
  compatibilityDate: '2024-10-22'
});
