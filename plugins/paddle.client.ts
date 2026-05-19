export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  
  if (process.client) {
    // 1. inject paddle.js script tag
    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.async = true
    script.onload = () => {
      // 2. initialize paddle client
      if (window.Paddle) {
        if (runtimeConfig.public.paddleSandbox) {
          window.Paddle.Environment.set('sandbox')
        }
        window.Paddle.Initialize({
          token: runtimeConfig.public.paddleClientToken || 'test_e8c89b33a59fa8730ad3d1000bb'
        })
        console.log('paddle.js initialized successfully in sandbox mode:', runtimeConfig.public.paddleSandbox)
      }
    }
    document.head.appendChild(script)
  }
})
