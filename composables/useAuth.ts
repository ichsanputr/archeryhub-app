import { computed, readonly } from 'vue'
import type { Ref } from 'vue'
import { $fetch } from 'ofetch'

export interface AuthUser {
  id?: string
  uuid?: string
  username?: string
  name?: string
  full_name?: string
  email?: string
  avatar_url?: string
  logo_url?: string
  role?: string
  type?: string
  user_type?: string
  slug?: string
  bio?: string
  achievements?: string | string[]
  store_name?: string
  store_slug?: string
  description?: string
  banner_url?: string
  google_id?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth.user', () => null)
  const isUserLoading = useState<boolean>('auth.isUserLoading', () => false)
  const isLoggedIn = computed(() => !!user.value)
  const config = useRuntimeConfig()

  const login = async (userType = 'archer', fullName = ''): Promise<void> => {
    const baseUrl = config.public.apiBaseUrl as string
    const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''
    const { auth_url, state } = await $fetch<{ auth_url?: string; state?: string }>(
      `${baseUrl}/auth/google?app_url=${callbackUrl}&user_type=${userType}&full_name=${encodeURIComponent(fullName)}`
    )
    if (state && import.meta.client) {
      sessionStorage.setItem('oauth_state', state)
    }
    if (auth_url) {
      if (import.meta.client) {
        window.location.href = auth_url
      }
    } else {
      throw new Error('Google auth_url not provided by backend')
    }
  }

  const loginWithEmail = async (email: string, password: string): Promise<unknown> => {
    const baseUrl = config.public.apiBaseUrl as string
    const response = await $fetch<{ user?: AuthUser }>(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email, password },
      credentials: 'include'
    })
    if (response.user) {
      user.value = {
        id: response.user.id ?? response.user.uuid,
        username: response.user.username,
        name: response.user.full_name ?? response.user.name,
        email: response.user.email,
        avatar_url: response.user.avatar_url ?? (response.user as { avatar?: string }).avatar,
        role: response.user.role,
        type: response.user.type ?? response.user.user_type ?? response.user.role,
        slug: response.user.slug ?? response.user.username,
        bio: response.user.bio,
        achievements: response.user.achievements,
        store_name: response.user.store_name,
        store_slug: response.user.slug ?? response.user.username,
        description: response.user.description,
        banner_url: response.user.banner_url
      }
    }
    return response
  }

  const register = async (userData: Record<string, unknown>): Promise<unknown> => {
    const baseUrl = config.public.apiBaseUrl as string
    const response = await $fetch<{ user?: AuthUser }>(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: userData,
      credentials: 'include'
    })
    if (response.user) {
      user.value = {
        id: response.user.id ?? response.user.uuid,
        username: response.user.username,
        name: response.user.full_name ?? response.user.name,
        email: response.user.email,
        avatar_url: response.user.avatar_url ?? (response.user as { avatar?: string }).avatar,
        role: response.user.role,
        type: response.user.type ?? response.user.user_type ?? response.user.role,
        slug: response.user.slug ?? response.user.username,
        bio: response.user.bio,
        achievements: response.user.achievements,
        store_name: response.user.store_name,
        store_slug: response.user.slug ?? response.user.username,
        description: response.user.description,
        banner_url: response.user.banner_url
      }
    }
    return response
  }

  const logout = async (): Promise<void> => {
    const baseUrl = config.public.apiBaseUrl as string
    await $fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
    user.value = null
    if (import.meta.client) {
      window.location.href = '/'
    }
  }

  const fetchUser = async (): Promise<void> => {
    try {
      isUserLoading.value = true
      if (import.meta.server) {
        isUserLoading.value = false
        return
      }
      const baseUrl = config.public.apiBaseUrl as string
      const response = await $fetch<AuthUser | { data?: AuthUser }>(`${baseUrl}/user`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const userData = (response as { data?: AuthUser }).data ?? (response as AuthUser)
      if (userData && (userData.id ?? userData.uuid)) {
        user.value = {
          id: userData.id ?? userData.uuid,
          google_id: userData.google_id,
          username: userData.username,
          name: userData.full_name ?? userData.name,
          full_name: userData.full_name ?? userData.name,
          email: userData.email,
          avatar_url: userData.avatar_url ?? (userData as { avatar?: string }).avatar,
          logo_url: userData.logo_url,
          role: userData.role,
          type: userData.type ?? userData.user_type ?? userData.role,
          slug: userData.slug ?? userData.username,
          bio: userData.bio,
          achievements: userData.achievements,
          store_name: userData.store_name,
          store_slug: userData.slug ?? userData.username,
          description: userData.description,
          banner_url: userData.banner_url,
          is_active: userData.is_active,
          created_at: userData.created_at,
          updated_at: userData.updated_at
        }
      } else {
        user.value = null
      }
    } catch (error: unknown) {
      const err = error as { status?: number; statusCode?: number }
      if (err?.status !== 401 && err?.statusCode !== 401) {
        console.error('Error fetching user:', error)
      }
      user.value = null
    } finally {
      isUserLoading.value = false
    }
  }

  const handleCallback = async (code: string, state: string): Promise<unknown> => {
    const baseUrl = config.public.apiBaseUrl as string
    const response = await $fetch<{ user?: AuthUser }>(`${baseUrl}/auth/google/callback`, {
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
        slug: response.user.slug ?? response.user.username,
        bio: response.user.bio,
        achievements: response.user.achievements,
        store_name: response.user.store_name,
        store_slug: response.user.slug ?? response.user.username,
        description: response.user.description,
        banner_url: response.user.banner_url
      }
    }
    return response
  }

  const initializeAuth = async (): Promise<void> => {
    if (import.meta.client && !user.value) {
      await fetchUser()
    }
  }

  return {
    user: readonly(user) as Ref<AuthUser | null>,
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
