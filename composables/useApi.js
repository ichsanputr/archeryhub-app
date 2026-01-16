// Reusable API helper for handling server/client cookie differences
import { $fetch } from 'ofetch'

export const useApi = () => {
  /**
   * Creates fetch options that handle cookies correctly for both server and client
   * @param {Object} options - Additional fetch options
   * @returns {Object} Fetch options with proper cookie handling
   */
  const createFetchOptions = (options = {}) => {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
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

  return {
    createFetchOptions,
    apiCall,
    get,
    post,
    put,
    delete: del
  }
}