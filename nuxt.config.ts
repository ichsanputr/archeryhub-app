// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: true,
  devServer: {
    port: 3000,
  },
  modules: [
    '@vueuse/motion/nuxt',
  ],
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
      apiBaseUrl: 'http://localhost:8001/api/v1',
      siteUrl: 'https://archeryhub.id',
      siteName: 'Archeryhub.id',
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Archeryhub.id - Tournament Management System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Modern archery tournament management system for organizing competitions, managing athletes, and live scoring.' },
        { name: 'theme-color', content: '#D9FF00' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Reddit+Sans:wght@300;400;500;600;700&family=Lexend:wght@300;400;500;600;700;800;900&family=Noto+Sans:wght@400;500;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap' }
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
    debug: true
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
