export const useApiBaseUrl = () => {
  const config = useRuntimeConfig()
  
  const isServer = import.meta.server
  const isClient = import.meta.client

  // --- 🛰 DEPLOYMENT DEBUG LOGS ---
  // These logs help diagnose common environment variable issues on VPS
  if (isClient) {
    console.log('[API Debug] Environment: Browser (Client)')
    console.log(`[API Debug] Public Domain: ${config.public.apiBaseUrl}`)
  } else {
    console.log('[API Debug] Environment: Server (SSR)')
    console.log(`[API Debug] Internal URL: ${config.apiBaseUrl || 'NOT_SET'}`)
    console.log(`[API Debug] Public Domain: ${config.public.apiBaseUrl}`)
  }

  const url = (isServer && config.apiBaseUrl) 
    ? config.apiBaseUrl as string
    : config.public.apiBaseUrl as string

  console.log(`[API Debug] Final Selected API Endpoint -> ${url}`)

  return url
}
