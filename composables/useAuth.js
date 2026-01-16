// OAuth GitHub authentication composable
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
      const { auth_url, state } = await $fetch(`${baseUrl}/auth/github?app_url=${window.location.origin}/auth/callback`)
      
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
        throw new Error('GitHub auth_url not provided by backend')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
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
        // Clear for .budibadu.com
        document.cookie = 'auth_token=; path=/; domain=.budibadu.com; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
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
          github_id: userData.github_id,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          avatar_url: userData.avatar_url,
          github_profile_url: userData.github_profile_url,
          token_expires_at: userData.token_expires_at,
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
    logout,
    fetchUser,
    initializeAuth
  }
}