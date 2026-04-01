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
      // If 401 Unauthorized, it means session is expired or invalid
      if (error.response?.status === 401 && !url.includes('/auth/login')) {
        console.error('Session expired or unauthorized, logging out...')
        if (import.meta.client) {
          // Redirect to logout endpoint to clear cookies, then to login
          window.location.href = '/auth/login?expired=true'
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
