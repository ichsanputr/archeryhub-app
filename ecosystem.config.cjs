/* eslint-env node */
module.exports = {
  apps: [
    {
      name: 'archeryhub',
      // Nuxt 3 production entry point
      script: './.output/server/index.mjs',
      cwd: './',
      // 'fork' mode is safer for single processes
      exec_mode: 'fork', 
      env: {
        NODE_ENV: 'production',
        PORT: 9003,
        NITRO_PORT: 9003,
        NITRO_HOST: '0.0.0.0',
        
        // --- 🎯 DUAL-DOMAIN API ARCHITECTURE ---
        // Public domain for client-side navigation (XHR/Fetch in browser)
        NUXT_PUBLIC_API_BASE_URL: 'https://api.archeryhub.id/api/v1',
        // Internal IP/local network address for Server-Side Rendering (SSR)
        // This makes SSR much faster by bypassing the public internet round-trip.
        NUXT_API_BASE_URL: 'http://localhost:8001/api/v1',
        
        // --- 🌐 SITE URL ---
        NUXT_PUBLIC_SITE_URL: 'https://archeryhub.id'
      },
      // Optional: Automatic restart if the server crashes
      autorestart: true,
      max_memory_restart: '1G'
    },
  ],
}