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
  club_id?: string
  achievements?: string | string[]
  store_name?: string
  store_slug?: string
  description?: string
  banner_url?: string
  google_id?: string
  is_active?: boolean
  subscription_status?: string
  subscription_expires_at?: string
  created_at?: string
  updated_at?: string
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth.user', () => {
    // Server-side hydration from auth middleware context
    if (import.meta.server) {
      const event = useRequestEvent()
      if (event?.context?.user) {
        return {
          uuid: event.context.user.uuid,
          id: event.context.user.id,
          email: event.context.user.email,
          name: event.context.user.full_name,
          full_name: event.context.user.full_name,
          avatar_url: event.context.user.avatar_url,
          role: event.context.user.role,
          user_type: event.context.user.user_type,
          type: event.context.user.user_type ?? event.context.user.role,

          // Extended fields
          username: event.context.user.username,
          slug: event.context.user.slug,
          bio: event.context.user.bio,
          gender: event.context.user.gender,
          date_of_birth: event.context.user.date_of_birth,
          bow_type: event.context.user.bow_type,
          city: event.context.user.city,
          club_id: event.context.user.club_id,
          achievements: event.context.user.achievements,
          store_name: event.context.user.store_name,
          store_slug: event.context.user.store_slug,
          description: event.context.user.description,
          banner_url: event.context.user.banner_url,
          logo_url: event.context.user.logo_url,
          google_id: event.context.user.google_id,
          is_active: event.context.user.is_active,
          created_at: event.context.user.created_at,
          updated_at: event.context.user.updated_at,
        } as AuthUser
      }
    }
    return null
  })
  const archerProfile = useState<any | null>('auth.archerProfile', () => {
    // Populate archerProfile from server context if user is an archer
    if (import.meta.server) {
      const event = useRequestEvent()
      if (event?.context?.user && (event.context.user.role === 'archer' || event.context.user.user_type === 'archer')) {
        return event.context.user
      }
    }
    return null
  })
  const organizerProfile = useState<any | null>('auth.organizerProfile', () => {
    // Populate organizerProfile from server context if user is an organizer
    if (import.meta.server) {
      const event = useRequestEvent()
      if (event?.context?.user && (event.context.user.role === 'organizer' || event.context.user.user_type === 'organizer')) {
        return event.context.user
      }
    }
    return null
  })

  const isUserLoading = useState<boolean>('auth.isUserLoading', () => false)
  const isLoggedIn = computed(() => !!user.value)
  const config = useRuntimeConfig()

  const login = async (userType = 'archer', metadata: Record<string, string> = {}): Promise<void> => {
    const baseUrl = useApiBaseUrl()
    const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''

    // Build query params including metadata
    const params = new URLSearchParams()
    params.append('app_url', callbackUrl)
    params.append('user_type', userType)

    // Add all metadata fields as separate query params
    // Default: Google sign-in from login page should NOT auto-create accounts.
    // Registration flow sets oauth_mode=register explicitly.
    const finalMetadata = { oauth_mode: 'login', ...metadata }

    Object.entries(finalMetadata).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })

    const { auth_url, state } = await $fetch<{ auth_url?: string; state?: string }>(
      `${baseUrl}/auth/google?${params.toString()}`
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
    const baseUrl = useApiBaseUrl()
    const response = await $fetch<{ user?: AuthUser }>(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email, password },
      credentials: 'include'
    })
    if (response.user) {
      user.value = response.user
      await fetchProfileSSR()
    }
    return response
  }

  const register = async (userData: Record<string, unknown>): Promise<unknown> => {
    const baseUrl = useApiBaseUrl()
    const response = await $fetch<{ user?: AuthUser }>(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: userData,
      credentials: 'include'
    })
    if (response.user) {
      user.value = response.user
      await fetchProfileSSR()
    }
    return response
  }

  const registerWithEmail = async (userData: Record<string, unknown>): Promise<any> => {
    const baseUrl = useApiBaseUrl()
    return await $fetch(`${baseUrl}/auth/register-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: userData,
      credentials: 'include'
    })
  }

  const verifyRegisterOTP = async (email: string, otp: string): Promise<any> => {
    const baseUrl = useApiBaseUrl()
    const response = await $fetch<{ user?: AuthUser; token?: string; redirect_url?: string }>(`${baseUrl}/auth/verify-register-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email, otp },
      credentials: 'include'
    })
    if (response.user) {
      user.value = response.user
      await fetchProfileSSR()
    }
    return response
  }

  const resendRegisterOTP = async (email: string): Promise<any> => {
    const baseUrl = useApiBaseUrl()
    return await $fetch(`${baseUrl}/auth/resend-register-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email },
      credentials: 'include'
    })
  }

  const clearClientAuth = () => {
    user.value = null
    archerProfile.value = null
    organizerProfile.value = null

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
    }
  }

  const logout = async (redirectUrl = '/'): Promise<void> => {
    try {
      const baseUrl = useApiBaseUrl()
      await $fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }).catch(() => {})
    } catch {}

    clearClientAuth()

    if (import.meta.client) {
      window.location.href = redirectUrl
    }
  }

  const fetchProfileSSR = async (): Promise<void> => {
    if (import.meta.server) {
      return // Profile is already loaded by server middleware
    }

    try {
      isUserLoading.value = true
      const baseUrl = useApiBaseUrl()
      const fetchOptions = {
        credentials: 'include' as const
      }

      if (user.value) {
        const userType = user.value.user_type ?? user.value.type ?? user.value.role

        // Populate detailed profile states on client-side only
        if (userType === 'archer') {
          const profileRes = await $fetch<{ data: any }>(`${baseUrl}/archer/me`, fetchOptions)
          archerProfile.value = profileRes?.data || profileRes
        } else if (userType === 'organizer') {
          const profileRes = await $fetch<{ data: any }>(`${baseUrl}/organizer/me`, fetchOptions)
          organizerProfile.value = profileRes?.data || profileRes
        }
      }
    } catch (error: unknown) {
      const status = (error as any)?.response?.status || (error as any)?.statusCode || (error as any)?.status
      // ONLY clear auth if the API explicitly rejects credentials (401/403/404)
      if (status === 401 || status === 403 || status === 404) {
        clearClientAuth()
      } else {
        // If API is down / timeout / 500 / 502 / network error, do NOT logout the user
        console.warn('[useAuth] Backend unreachable or temporary error. Retaining local user session.')
      }
    } finally {
      isUserLoading.value = false
    }
  }

  const handleCallback = async (code: string, state: string): Promise<unknown> => {
    const baseUrl = useApiBaseUrl()
    const response = await $fetch<{ user?: AuthUser }>(`${baseUrl}/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { code, state },
      credentials: 'include'
    })
    if (response.user) {
      user.value = response.user
      await fetchProfileSSR()
    }
    return response
  }

  const initializeAuth = async (): Promise<void> => {
    if (import.meta.client && !user.value) {
      await fetchProfileSSR()
    }
  }

  const userPersona = computed(() => {
    const role = user.value?.role || user.value?.user_type || user.value?.type || 'archer'
    const roleMap: Record<string, string> = {
      'archer': 'archer',
      'organizer': 'organizer',
      'root': 'root',
      'admin': 'organizer'
    }
    return roleMap[role] || 'archer'
  })

  return {
    user: readonly(user) as Ref<AuthUser | null>,
    userPersona,
    archerProfile: readonly(archerProfile),
    organizerProfile: readonly(organizerProfile),
    isUserLoading: readonly(isUserLoading),
    isLoggedIn,
    login,
    loginWithEmail,
    register,
    registerWithEmail,
    verifyRegisterOTP,
    resendRegisterOTP,
    logout,
    fetchProfileSSR,
    handleCallback,
    initializeAuth
  }
}
