// OAuth Google authentication composable
import { computed, readonly } from 'vue'
import { useState, useRuntimeConfig, useNuxtApp } from '#imports'
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

  const login = async () => {
    try {
      const baseUrl = config.public.apiBaseUrl
      const { auth_url, state } = await $fetch(`${baseUrl}/auth/google?app_url=${window.location.origin}/auth/callback`)

      if (state && import.meta.client) {
        sessionStorage.setItem('oauth_state', state)
      }

      if (auth_url) {
        if (import.meta.client) {
          window.location.href = auth_url
        } else {
          // For SSR, we can return the URL for server-side redirect
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

      // Store token in cookie if returned
      if (response.token && import.meta.client) {
        document.cookie = `auth_token=${response.token}; path=/; max-age=259200; SameSite=Lax`
      }

      // Set user data
      if (response.user) {
        user.value = {
          id: response.user.id,
          username: response.user.username,
          name: response.user.full_name,
          email: response.user.email,
          role: response.user.role
        }
      }

      return response
    } catch (error) {
      console.error('Email login error:', error)
      throw new Error(error.data?.error || 'Invalid email or password')
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

      // Store token in cookie if returned
      if (response.token && import.meta.client) {
        document.cookie = `auth_token=${response.token}; path=/; max-age=259200; SameSite=Lax`
      }

      // Set user data
      if (response.user) {
        user.value = {
          id: response.user.id,
          username: response.user.username,
          name: response.user.full_name,
          email: response.user.email,
          role: response.user.role
        }
      }

      return response
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error(error.data?.error || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      // Call the logout API endpoint
      await $fetch(`${config.public.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Important: include HTTP-only cookies
      })

      // Clear the token from cookies for localhost and other domains
      if (import.meta.client) {
        // Clear for localhost
        document.cookie = 'auth_token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        // Clear for current domain
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        // Clear for .archeryhub.id
        document.cookie = 'auth_token=; path=/; domain=.archeryhub.id; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      }

      user.value = null;

      // Use window.reload to refresh app state
      if (import.meta.client) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and refresh
      user.value = null;
      if (import.meta.client) {
        window.location.reload();
      }
    }
  }

  const fetchUser = async () => {
    try {
      isUserLoading.value = true

      // On server-side, user data should already be available from middleware
      if (import.meta.server) {
        isUserLoading.value = false
        return
      }

      // On client-side, fetch user data
      const response = await $fetch(`${config.public.apiBaseUrl}/user`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Important: include HTTP-only cookies
      })

      // Handle API response structure - it returns {data: user, message: "..."}
      const userData = response?.data || response

      // Ensure user data matches expected structure
      if (userData && userData.id) {
        user.value = {
          id: userData.id,
          google_id: userData.google_id,
          username: userData.username,
          name: userData.name || userData.full_name,
          email: userData.email,
          avatar_url: userData.avatar_url,
          role: userData.role,
          is_active: userData.is_active,
          created_at: userData.created_at,
          updated_at: userData.updated_at
        }
      } else {
        user.value = null
      }
    } catch (error) {
      // Don't log 401 errors as they're expected when not authenticated
      if (error?.status !== 401 && error?.statusCode !== 401) {
        console.error('Error fetching user:', error)
      }
      user.value = null
    } finally {
      isUserLoading.value = false
    }
  }

  // Initialize auth state on client-side
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
    initializeAuth
  }
}
