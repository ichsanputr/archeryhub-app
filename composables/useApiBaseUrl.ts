export const useApiBaseUrl = () => {
  const config = useRuntimeConfig()
  const rawApiBaseUrl = (config.public?.apiBaseUrl || config.public?.apiBase || config.apiBaseUrl || 'http://localhost:8001') as string

  if (import.meta.client) {
    const hostname = window.location.hostname
    // If accessing via LAN IP (e.g. 192.168.x.x, 10.x.x.x) and API URL was left at default localhost:8001,
    // dynamically adapt to current LAN host on port 8001 for local testing
    const isDefaultLocalhost = rawApiBaseUrl.includes('localhost:8001') || rawApiBaseUrl.includes('127.0.0.1:8001')
    const isLanIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) && hostname !== '127.0.0.1'

    if (isLanIp && isDefaultLocalhost) {
      const protocol = window.location.protocol
      return `${protocol}//${hostname}:8001`
    }
    return rawApiBaseUrl
  }

  // SSR Server
  if (import.meta.server) {
    try {
      const isDefaultLocalhost = rawApiBaseUrl.includes('localhost:8001') || rawApiBaseUrl.includes('127.0.0.1:8001')
      const event = useRequestEvent()
      const hostHeader = event?.node?.req?.headers?.host || ''
      const host = hostHeader.split(':')[0]
      const isLanIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(host) && host !== '127.0.0.1'

      if (isLanIp && isDefaultLocalhost) {
        return `http://${host}:8001`
      }
    } catch {
      // ignore
    }
  }

  return rawApiBaseUrl
}
