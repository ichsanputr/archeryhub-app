import type { FetchOptions } from 'ofetch'

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = useApiBaseUrl()

  const createFetchOptions = (options: FetchOptions & { body?: unknown } = {}): FetchOptions & { body?: unknown } => {
    const isFormData = options.body instanceof FormData
    const defaultHeaders: Record<string, string> = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string>)
    }
    const defaultOptions = {
      baseURL: apiBaseUrl,
      headers: defaultHeaders,
      ...options
    }

    if (import.meta.server) {
      try {
        const event = useRequestEvent()
        const cookie = event?.node?.req?.headers?.cookie || ''
        return {
          ...defaultOptions,
          headers: {
            ...defaultOptions.headers,
            ...(cookie ? { Cookie: cookie } : {})
          }
        }
      } catch (error) {
        console.warn('Failed to get request event on server:', error)
        return defaultOptions
      }
    }
    return {
      ...defaultOptions,
      credentials: 'include' as RequestCredentials
    }
  }

  const apiCall = async <T = unknown>(url: string, options: FetchOptions & { body?: unknown } = {}): Promise<T> => {
    const fetchOptions = createFetchOptions(options)

    try {
      return await $fetch<T>(url, fetchOptions)
    } catch (error: any) {
      const status = error.response?.status || error.statusCode || error.status
      // If 401 Unauthorized or 403 Forbidden on protected API endpoints
      if ((status === 401 || status === 403) && !url.includes('/auth/login') && !url.includes('/auth/register')) {
        console.warn(`[useApi] Session expired or unauthorized (status ${status}) on ${url}. Cleaning auth state...`)
        if (import.meta.client) {
          // Clear cookies across all possible domain scopes and paths
          const cookiesToClear = ['auth_token', 'refresh_token', 'session', 'token']
          const host = window.location.hostname
          const hostParts = host.split('.')
          const domainVariants = ['', `; domain=${host}`]
          if (hostParts.length > 2) {
            domainVariants.push(`; domain=.${hostParts.slice(-2).join('.')}`)
          }

          cookiesToClear.forEach(cookieName => {
            domainVariants.forEach(dom => {
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${dom}`
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=0${dom}`
            })
          })

          try {
            sessionStorage.removeItem('oauth_state')
            sessionStorage.removeItem('auth_user')
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
          } catch {}

          // Avoid redirect loop if already on login page
          if (!window.location.pathname.startsWith('/auth/login')) {
            const currentPath = window.location.pathname + window.location.search
            window.location.href = `/auth/login?expired=true&redirect=${encodeURIComponent(currentPath)}`
          }
        }
      }
      throw error
    }
  }

  const get = async <T = unknown>(url: string, options: FetchOptions = {}): Promise<T> => {
    return await apiCall<T>(url, { method: 'GET', ...options })
  }

  const post = async <T = unknown>(url: string, body: unknown = null, options: FetchOptions = {}): Promise<T> => {
    return await apiCall<T>(url, { method: 'POST', body, ...options })
  }

  const put = async <T = unknown>(url: string, body: unknown = null, options: FetchOptions = {}): Promise<T> => {
    return await apiCall<T>(url, { method: 'PUT', body, ...options })
  }

  const patch = async <T = unknown>(url: string, body: unknown = null, options: FetchOptions = {}): Promise<T> => {
    return await apiCall<T>(url, { method: 'PATCH', body, ...options })
  }

  const del = async <T = unknown>(url: string, options: FetchOptions = {}): Promise<T> => {
    return await apiCall<T>(url, { method: 'DELETE', ...options })
  }

  const upload = async <T = unknown>(url: string, formData: FormData, options: FetchOptions = {}): Promise<T> => {
    return await apiCall<T>(url, {
      method: 'POST',
      body: formData,
      ...options,
      headers: { ...(options.headers as object) }
    })
  }

  return {
    createFetchOptions,
    apiCall,
    get,
    post,
    put,
    patch,
    upload,
    delete: del
  }
}
