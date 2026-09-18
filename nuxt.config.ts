import fs from 'fs'
import path from 'path'

function getDashboardPages(dir: string, base: string = 'dashboard'): Record<string, boolean> {
  const pages: Record<string, boolean> = {}
  if (!fs.existsSync(dir)) return pages

  const items = fs.readdirSync(dir)
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      Object.assign(pages, getDashboardPages(fullPath, `${base}/${item}`))
    } else if (item.endsWith('.vue')) {
      const cleanItem = item.replace(/\.vue$/, '')
      const key = `${base}/${cleanItem}`.replace(/\\/g, '/')
      pages[key] = false
      if (cleanItem === 'index') {
        const indexKey = base.replace(/\\/g, '/')
        pages[indexKey] = false
      }
    }
  }
  return pages
}

const dashboardPages = getDashboardPages(path.resolve(__dirname, 'pages/dashboard'))

function makeNonLocalizedPages(pages: Record<string, boolean>, locales: string[] = ['en', 'id']) {
  const out: Record<string, Record<string, string>> = {}
  for (const key of Object.keys(pages)) {
    // ensure we produce a normalized path starting with '/'
    // examples: 'dashboard/index' -> '/dashboard', 'dashboard/foo' -> '/dashboard/foo'
    let routePath = '/' + key.replace(/index$/, '').replace(/^\/+/, '')
    routePath = routePath.replace(/\/$/, '')
    if (routePath === '') routePath = '/'

    const mapping: Record<string, string> = {}
    for (const loc of locales) {
      mapping[loc] = routePath
    }
    out[key] = mapping
  }
  return out
}

const dashboardI18nPages = makeNonLocalizedPages(dashboardPages)

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
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English', language: 'en-US' },
      { code: 'id', iso: 'id-ID', file: 'id.json', name: 'Bahasa Indonesia', language: 'id-ID' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    fallbackLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    customRoutes: 'config',
    // keep dashboard routes identical across locales (no prefix change)
    pages: dashboardI18nPages,
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
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'googlebot', content: 'noindex, nofollow' },
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
        { rel: 'alternate', hreflang: 'en', href: 'https://archeris.net' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://archeris.net' },
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
    minify: true,
    debug: true,
    devProxy: {
      host: 'localhost',
    },
    routeRules: {
      '/pricing': { redirect: { to: '/package', statusCode: 301 } },
      '/events': { redirect: { to: '/tournaments', statusCode: 301 } },
      '/events/**': { redirect: { to: '/tournaments/**', statusCode: 301 } },
      '/dashboard/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
      '/auth/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
      '/dev/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
      '/test/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
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
