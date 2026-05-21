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

function makeNonLocalizedPages(pages: Record<string, boolean>, locales: string[] = ['en', 'id', 'kr']) {
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
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'id', iso: 'id-ID', file: 'id.json', name: 'Bahasa Indonesia' },
      { code: 'kr', iso: 'ko-KR', file: 'kr.json', name: '한국어' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
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
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.archeris.net/api/v1',
      siteUrl: 'https://archeris.net',
      siteName: 'Archeris.net',
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
      title: 'Archeris.net - All In One Platform Panahan Indonesia',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description', content: 'Archeris.net hadir sebagai wadah bagi seluruh penggiat panahan di Indonesia. Dari pemula hingga juara nasional, di sini kita terhubung lewat event, prestasi, dan semangat yang sama.'
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap' }
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
      allowedHosts: ['localhost', '127.0.0.1']
    }
  },
  watch: ["data"],
  nitro: {
    minify: true,
    debug: true,
    devProxy: {
      host: 'localhost',
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
