/* eslint-env node */
module.exports = {
  apps: [
    {
      name: 'archeryhub',
      script: './.output/server/index.mjs',
      cwd: './',
      exec_mode: 'fork', // 👈 non-cluster mode (single process)
      env: {
        NODE_ENV: 'production',
        PORT: 9003,
        NITRO_PORT: 9003,
        NITRO_HOST: '0.0.0.0',
        NUXT_PUBLIC_API_BASE_URL: 'https://api.archeryhub.id'
      }
    },
  ],
}