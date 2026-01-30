// OAuth Google authentication composable
import { computed, readonly } from 'vue'
// useState, useRuntimeConfig, and useNuxtApp are auto-imported by Nuxt
import { $fetch } from 'ofetch'

export const useAuth = () => {
  const user = useState('auth.user', () => {
    // Try to get user from SSR context first (only in SSR mode)
    if (import.meta.server && useNuxtApp().ssrContext?.event?.context?.user) {
      return useNuxtApp().ssrContext.event.context.user
    }
    return null
  })

  const isUserLoading = useState('auth.isUserLoading', () => false)
  const isLoggedIn = computed(() => !!user.value)
  const config = useRuntimeConfig()

  // Google OAuth login/registration
  const login = async (userType = 'archer', fullName = '') => {
    try {
      const baseUrl = config.public.apiBaseUrl
      const callbackUrl = `${window.location.origin}/auth/callback`
      const { auth_url, state } = await $fetch(`${baseUrl}/auth/google?app_url=${callbackUrl}&user_type=${userType}&full_name=${encodeURIComponent(fullName)}`)

      if (state && import.meta.client) {
        sessionStorage.setItem('oauth_state', state)
      }

      if (auth_url) {
        if (import.meta.client) {
          window.location.href = auth_url
        } else {
          return auth_url
        }
      } else {
        throw new Error('Google auth_url not provided by backend')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Email/password login
  const loginWithEmail = async (email, password) => {
    try {
      const baseUrl = config.public.apiBaseUrl
      const response = await $fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email, password },
        credentials: 'include'
      })

      // Set user data
      if (response.user) {
        user.value = {
          id: response.user.id || response.user.uuid,
          username: response.user.username,
          name: response.user.full_name || response.user.name,
          email: response.user.email,
          avatar_url: response.user.avatar_url || response.user.avatar,
          role: response.user.role,
          type: response.user.type || response.user.user_type || response.user.role,
          slug: response.user.slug || response.user.username,
          bio: response.user.bio,
          achievements: response.user.achievements,
          store_name: response.user.store_name,
          store_slug: response.user.slug || response.user.username,
          description: response.user.description,
          banner_url: response.user.banner_url
        }
      }

      return response
    } catch (error) {
      console.error('Email login error:', error)
      const errorMessage = error.data?.error || error.response?._data?.error || error.message || 'Invalid email or password'
      const authError = new Error(errorMessage)
      authError.data = error.data || error.response?._data || {}
      throw authError
    }
  }

  // Register new user
  const register = async (userData) => {
    try {
      const baseUrl = config.public.apiBaseUrl
      const response = await $fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: userData,
        credentials: 'include'
      })

      // Set user data
      if (response.user) {
        user.value = {
          id: response.user.id || response.user.uuid,
          username: response.user.username,
          name: response.user.full_name || response.user.name,
          email: response.user.email,
          avatar_url: response.user.avatar_url || response.user.avatar,
          role: response.user.role,
          type: response.user.type || response.user.user_type || response.user.role,
          slug: response.user.slug || response.user.username,
          bio: response.user.bio,
          achievements: response.user.achievements,
          store_name: response.user.store_name,
          store_slug: response.user.slug || response.user.username,
          description: response.user.description,
          banner_url: response.user.banner_url
        }
      }

      return response
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.data?.error || error.response?._data?.error || error.message || 'Registration failed'
      const authError = new Error(errorMessage)
      authError.data = error.data || error.response?._data || {}
      throw authError
    }
  }

  const logout = async () => {
    try {
      await $fetch(`${config.public.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      user.value = null;

      if (import.meta.client) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      user.value = null;
      if (import.meta.client) {
        window.location.href = '/';
      }
    }
  }

  const fetchUser = async () => {
    try {
      isUserLoading.value = true

      if (import.meta.server) {
        isUserLoading.value = false
        return
      }

      const response = await $fetch(`${config.public.apiBaseUrl}/user`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      const userData = response?.data || response

      if (userData && (userData.id || userData.uuid)) {
        user.value = {
          id: userData.id || userData.uuid,
          google_id: userData.google_id,
          username: userData.username,
          name: userData.full_name || userData.name,
          full_name: userData.full_name || userData.name,
          email: userData.email,
          avatar_url: userData.avatar_url || userData.avatar,
          logo_url: userData.logo_url,
          role: userData.role,
          type: userData.type || userData.user_type || userData.role,
          slug: userData.slug || userData.username,
          bio: userData.bio,
          achievements: userData.achievements,
          store_name: userData.store_name,
          store_slug: userData.slug || userData.username,
          description: userData.description,
          banner_url: userData.banner_url,
          is_active: userData.is_active,
          created_at: userData.created_at,
          updated_at: userData.updated_at
        }
      } else {
        user.value = null
      }
    } catch (error) {
      if (error?.status !== 401 && error?.statusCode !== 401) {
        console.error('Error fetching user:', error)
      }
      user.value = null
    } finally {
      isUserLoading.value = false
    }
  }

  const handleCallback = async (code, state) => {
    try {
      const baseUrl = config.public.apiBaseUrl
      const response = await $fetch(`${baseUrl}/auth/google/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { code, state },
        credentials: 'include'
      })

      if (response.user) {
        user.value = {
          id: response.user.id,
          username: response.user.username,
          name: response.user.full_name,
          email: response.user.email,
          avatar_url: response.user.avatar_url,
          role: response.user.role,
          type: response.user.user_type,
          slug: response.user.slug || response.user.username,
          bio: response.user.bio,
          achievements: response.user.achievements,
          store_name: response.user.store_name,
          store_slug: response.user.slug || response.user.username,
          description: response.user.description,
          banner_url: response.user.banner_url
        }
      }

      return response
    } catch (error) {
      console.error('Callback error:', error)
      throw new Error(error.data?.error || 'Authentication failed')
    }
  }

  const initializeAuth = async () => {
    if (import.meta.client && !user.value) {
      await fetchUser()
    }
  }

  return {
    user: readonly(user),
    isUserLoading: readonly(isUserLoading),
    isLoggedIn,
    login,
    loginWithEmail,
    register,
    logout,
    fetchUser,
    handleCallback,
    initializeAuth
  }
}
