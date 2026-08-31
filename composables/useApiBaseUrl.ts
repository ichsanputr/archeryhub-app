export const useApiBaseUrl = () => {
  const config = useRuntimeConfig()
  
  if (import.meta.client) {
    const hostname = window.location.hostname
    // If accessing via LAN IP / custom host (and not production domain), use the same host for port 8001
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && !config.public.apiBaseUrl?.includes('archeris.net')) {
      const protocol = window.location.protocol
      const dynamicUrl = `${protocol}//${hostname}:8001`
      return dynamicUrl
    }
    return (config.public.apiBaseUrl || 'http://localhost:8001') as string
  }

  // SSR Server
  if (import.meta.server) {
    try {
      const event = useRequestEvent()
      const hostHeader = event?.node?.req?.headers?.host || ''
      const host = hostHeader.split(':')[0]
      if (host && host !== 'localhost' && host !== '127.0.0.1' && !config.public.apiBaseUrl?.includes('archeris.net')) {
        return `http://${host}:8001`
      }
    } catch {
      // ignore
    }
  }

  const url = (config.apiBaseUrl || config.public.apiBaseUrl || 'http://localhost:8001') as string
  return url
}
