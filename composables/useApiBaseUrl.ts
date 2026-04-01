export const useApiBaseUrl = () => {
  const config = useRuntimeConfig()
  
  // Return the internal/local API URL for SSR, and the public domain for the client
  return (import.meta.server && config.apiBaseUrl) 
    ? config.apiBaseUrl as string
    : config.public.apiBaseUrl as string
}
