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
  gender?: string
  date_of_birth?: string
  bow_type?: string
  city?: string
  province?: string
  club_id?: string
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
  const archerProfile = useState<any | null>('auth.archerProfile', () => null)
  const organizationProfile = useState<any | null>('auth.organizationProfile', () => null)
  const clubProfile = useState<any | null>('auth.clubProfile', () => null)
  const sellerProfile = useState<any | null>('auth.sellerProfile', () => null)

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
      await fetchUser() // Fetch detailed profile after login
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
      await fetchUser() // Fetch detailed profile after register
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
    archerProfile.value = null
    organizationProfile.value = null
    clubProfile.value = null
    sellerProfile.value = null

    if (import.meta.client) {
      window.location.href = '/'
    }
  }

  const fetchUser = async (headers?: any): Promise<void> => {
    try {
      isUserLoading.value = true
      const baseUrl = config.public.apiBaseUrl as string
      const fetchOptions = {
        headers: { ...headers },
        credentials: 'include' as const
      }

      // If user state is not populated (e.g. client side refresh), try to fetch generic user info
      // using the /user/ endpoint which acts as a session check
      if (!user.value) {
        try {
          const response = await $fetch<AuthUser | { data?: AuthUser }>(`${baseUrl}/user/`, fetchOptions)
          const userData = (response as { data?: AuthUser }).data ?? (response as AuthUser)
          if (userData && (userData.id ?? userData.uuid)) {
            user.value = userData
          }
        } catch (e) {
          // Token invalid or expired
          user.value = null
          return
        }
      }

      if (user.value) {
        const userType = user.value.user_type ?? user.value.type ?? user.value.role

        // Step 2: Fetch detailed profile based on type
        if (userType === 'archer') {
          const profileRes = await $fetch<{ data: any }>(`${baseUrl}/archer/me`, fetchOptions).catch(() => null)
          archerProfile.value = profileRes?.data || profileRes
        } else if (userType === 'organization') {
          const profileRes = await $fetch<{ data: any }>(`${baseUrl}/organization/me`, fetchOptions).catch(() => null)
          organizationProfile.value = profileRes?.data || profileRes
        } else if (userType === 'club') {
          const profileRes = await $fetch<{ data: any }>(`${baseUrl}/club/me`, fetchOptions).catch(() => null)
          clubProfile.value = profileRes?.data || profileRes
        } else if (userType === 'seller') {
          const profileRes = await $fetch<{ data: any }>(`${baseUrl}/seller/me`, fetchOptions).catch(() => null)
          sellerProfile.value = profileRes?.data || profileRes
        }
      }
    } catch (error: unknown) {
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
      await fetchUser()
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
    archerProfile: readonly(archerProfile),
    organizationProfile: readonly(organizationProfile),
    clubProfile: readonly(clubProfile),
    sellerProfile: readonly(sellerProfile),
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
