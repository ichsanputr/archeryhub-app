// Reusable API helper for handling server/client cookie differences
import { $fetch } from 'ofetch'

export const useApi = () => {
  /**
   * Creates fetch options that handle cookies correctly for both server and client
   * @param {Object} options - Additional fetch options
   * @returns {Object} Fetch options with proper cookie handling
   */
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl

  /**
   * Creates fetch options that handle cookies correctly for both server and client
   * @param {Object} options - Additional fetch options
   * @returns {Object} Fetch options with proper cookie handling
   */
  const createFetchOptions = (options = {}) => {
    const isFormData = options.body instanceof FormData

    const defaultHeaders = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...options.headers
    }

    const defaultOptions = {
      baseURL: apiBaseUrl,
      headers: defaultHeaders,
      ...options
    }

    if (import.meta.server) {
      try {
        // Server-side: use cookies from request headers
        const event = useRequestEvent()
        const cookie = event?.node?.req?.headers?.cookie || ''

        return {
          ...defaultOptions,
          headers: {
            ...defaultOptions.headers,
            ...(cookie ? { 'Cookie': cookie } : {})
          }
        }
      } catch (error) {
        console.warn('Failed to get request event on server:', error)
        return defaultOptions
      }
    } else {
      // Client-side: use credentials include
      return {
        ...defaultOptions,
        credentials: 'include'
      }
    }
  }

  /**
   * Makes an authenticated API call with proper cookie handling
   * @param {string} url - The API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise} The API response
   */
  const apiCall = async (url, options = {}) => {
    try {
      const fetchOptions = createFetchOptions(options)
      return await $fetch(url, fetchOptions)
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  /**
   * Makes a GET request with proper cookie handling
   * @param {string} url - The API endpoint URL
   * @param {Object} options - Additional fetch options
   * @returns {Promise} The API response
   */
  const get = async (url, options = {}) => {
    return await apiCall(url, { method: 'GET', ...options })
  }

  /**
   * Makes a POST request with proper cookie handling
   * @param {string} url - The API endpoint URL
   * @param {Object} body - Request body
   * @param {Object} options - Additional fetch options
   * @returns {Promise} The API response
   */
  const post = async (url, body = null, options = {}) => {
    return await apiCall(url, {
      method: 'POST',
      body,
      ...options
    })
  }

  /**
   * Makes a PUT request with proper cookie handling
   * @param {string} url - The API endpoint URL
   * @param {Object} body - Request body
   * @param {Object} options - Additional fetch options
   * @returns {Promise} The API response
   */
  const put = async (url, body = null, options = {}) => {
    return await apiCall(url, {
      method: 'PUT',
      body,
      ...options
    })
  }

  /**
   * Makes a DELETE request with proper cookie handling
   * @param {string} url - The API endpoint URL
   * @param {Object} options - Additional fetch options
   * @returns {Promise} The API response
   */
  const del = async (url, options = {}) => {
    return await apiCall(url, { method: 'DELETE', ...options })
  }

  /**
   * Makes a POST request with FormData (for file uploads)
   * @param {string} url - The API endpoint URL
   * @param {FormData} formData - The form data object
   * @param {Object} options - Additional fetch options
   * @returns {Promise} The API response
   */
  const upload = async (url, formData, options = {}) => {
    return await apiCall(url, {
      method: 'POST',
      body: formData,
      ...options,
      headers: {
        // multipart/form-data should not have Content-Type: application/json
        // Fetch will set it automatically with the boundary
        ...options.headers
      }
    })
  }

  return {
    createFetchOptions,
    apiCall,
    get,
    post,
    put,
    upload,
    delete: del
  }
}
