/**
 * Auth state for SSR: sync server-side user into Nuxt state so isLoggedIn is correct
 * on first paint. Server middleware already sets event.context.user from auth_token cookie;
 * this plugin copies it into useState('auth.user') so the app and client receive it.
 * On client, if user is still null we try fetchUser() once as fallback.
 */
import type { AuthUser } from '~/composables/useAuth'

interface ServerContextUser {
  id?: string
  email?: string
  full_name?: string
  avatar_url?: string
  role?: string
  user_type?: string
}

function mapContextUserToAuthUser(ctx: ServerContextUser): AuthUser {
  return {
    id: ctx.id,
    email: ctx.email,
    name: ctx.full_name,
    full_name: ctx.full_name,
    avatar_url: ctx.avatar_url,
    role: ctx.role,
    type: ctx.user_type ?? ctx.role,
    user_type: ctx.user_type,
    slug: ctx.id ?? ctx.email
  }
}

export default defineNuxtPlugin(async () => {
  const { user, fetchUser, initializeAuth } = useAuth()

  if (import.meta.server) {
    const event = useRequestEvent()
    if (event?.context?.user) {
      user.value = mapContextUserToAuthUser(event.context.user)
      if (user.value) {
        await fetchUser() // Fetch detailed profile
      }
    }
    return
  }

  // Client: restore from API if state wasn't hydrated
  // Only call initializeAuth if we have a cookie but no user state
  // We can't easily check for cookie existence here without useCookie, which is reactive
  // But initializeAuth usually does fetchUser anyway
  if (!user.value) {
    await initializeAuth()
  }
})
