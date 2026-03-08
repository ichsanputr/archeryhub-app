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
  const organizationProfile = useState<any | null>('auth.organizationProfile', () => {
    // Populate organizationProfile from server context if user is an organization
    if (import.meta.server) {
      const event = useRequestEvent()
      if (event?.context?.user && (event.context.user.role === 'organization' || event.context.user.user_type === 'organization')) {
        return event.context.user
      }
    }
    return null
  })

  const sellerProfile = useState<any | null>('auth.sellerProfile', () => {
    // Populate sellerProfile from server context if user is a seller
    if (import.meta.server) {
      const event = useRequestEvent()
      if (event?.context?.user && (event.context.user.role === 'seller' || event.context.user.user_type === 'seller')) {
        return event.context.user
      }
    }
    return null
  })

  const isUserLoading = useState<boolean>('auth.isUserLoading', () => false)
  const isLoggedIn = computed(() => !!user.value)
  const config = useRuntimeConfig()

  const login = async (userType = 'archer', metadata: Record<string, string> = {}): Promise<void> => {
    const baseUrl = config.public.apiBaseUrl as string
    const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''

    // Build query params including metadata
    const params = new URLSearchParams()
    params.append('app_url', callbackUrl)
    params.append('user_type', userType)

    // Add all metadata fields as separate query params
    Object.entries(metadata).forEach(([key, value]) => {
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
    const baseUrl = config.public.apiBaseUrl as string
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
    const baseUrl = config.public.apiBaseUrl as string
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
    sellerProfile.value = null

    if (import.meta.client) {
      window.location.href = '/'
    }
  }

  const fetchProfileSSR = async (): Promise<void> => {
    if (import.meta.server) {
      return // Profile is already loaded by server middleware
    }

    try {
      isUserLoading.value = true
      const baseUrl = config.public.apiBaseUrl as string
      const fetchOptions = {
        credentials: 'include' as const
      }

      if (user.value) {
        const userType = user.value.user_type ?? user.value.type ?? user.value.role

        // Populate detailed profile states on client-side only
        if (userType === 'archer') {
          if (user.value.bio || user.value.date_of_birth) {
            archerProfile.value = { ...user.value }
          } else {
            const profileRes = await $fetch<{ data: any }>(`${baseUrl}/archer/me`, fetchOptions).catch(() => null)
            archerProfile.value = profileRes?.data || profileRes
          }
        } else if (userType === 'organization') {
          if (user.value.logo_url || user.value.city) {
            organizationProfile.value = { ...user.value }
          } else {
            const profileRes = await $fetch<{ data: any }>(`${baseUrl}/organization/me`, fetchOptions).catch(() => null)
            organizationProfile.value = profileRes?.data || profileRes
          }

        } else if (userType === 'seller') {
          if (user.value.store_name) {
            sellerProfile.value = { ...user.value }
          } else {
            const profileRes = await $fetch<{ data: any }>(`${baseUrl}/seller/me`, fetchOptions).catch(() => null)
            sellerProfile.value = profileRes?.data || profileRes
          }
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
      'organization': 'organization',
      'seller': 'seller',
      'root': 'root',
      'admin': 'organization'
    }
    return roleMap[role] || 'archer'
  })

  return {
    user: readonly(user) as Ref<AuthUser | null>,
    userPersona,
    archerProfile: readonly(archerProfile),
    organizationProfile: readonly(organizationProfile),
    sellerProfile: readonly(sellerProfile),
    isUserLoading: readonly(isUserLoading),
    isLoggedIn,
    login,
    loginWithEmail,
    register,
    logout,
    fetchProfileSSR,
    handleCallback,
    initializeAuth
  }
}
