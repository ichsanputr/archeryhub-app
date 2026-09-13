/**
 * Unified auth middleware (SSR-only).
 * Replaces: middleware/auth.global.ts, middleware/redirect-auth.global.ts,
 *           server/middleware/auth.ts, server/middleware/auth.global.js
 *
 * 1. Decodes JWT from auth_token cookie and sets event.context.user
 * 2. Redirects unauthenticated users from protected routes to /auth/login
 * 3. Redirects authenticated users from /auth/* to /dashboard
 */
import { getCookie, deleteCookie, sendRedirect } from 'h3'
import type { H3Event } from 'h3'

function decodeJWT(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return null
        const payload = parts[1]
        const decoded = Buffer.from(payload, 'base64url').toString('utf-8')
        return JSON.parse(decoded) as Record<string, unknown>
    } catch {
        return null
    }
}

function getPath(url: string): string {
    return url?.split('?')[0] || '/'
}

export default defineEventHandler(async (event: H3Event) => {

    const url = event.node.req.url || '/'

    // Skip non-page requests (assets, _nuxt, __nuxt, etc.)
    if (!url.startsWith('/') || url.startsWith('/_nuxt') || url.startsWith('/__nuxt')) {
        return
    }

    const path = getPath(url)

    // ——— 1. Resolve user from JWT ———
    const token = getCookie(event, 'auth_token')
    if (!token) {
        event.context.user = null
    } else {
        const payload = decodeJWT(token)
        if (payload && payload.user_id) {
            // Check expiry if exp field exists
            const isExpired = typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()
            if (isExpired) {
                deleteCookie(event, 'auth_token', { path: '/' })
                event.context.user = null
            } else {
                let userVerified = false
                let profileData: any = null

                // Fetch detailed profile server-side to ensure user still exists in DB
                try {
                    const config = useRuntimeConfig()
                    const apiBaseUrl = config.apiBaseUrl || config.public.apiBaseUrl
                    let endpoint = ''

                    if (payload.role === 'archer') endpoint = '/archer/me'
                    else if (payload.role === 'organizer') endpoint = '/organizer/me'
                    else if (payload.role === 'club') endpoint = '/club/me'
                    else if (payload.role === 'root') endpoint = '' // No details endpoint for root

                    if (endpoint && apiBaseUrl) {
                        const response = await $fetch<any>(`${apiBaseUrl}${endpoint}`, {
                            headers: {
                                Cookie: `auth_token=${token}`
                            }
                        })

                        profileData = response?.data || response
                        if (profileData && (profileData.uuid || profileData.id || profileData.email || profileData.name || profileData.full_name)) {
                            userVerified = true
                        }
                    } else if (payload.role === 'root') {
                        userVerified = true
                    }
                } catch (error: any) {
                    // Profile endpoint failed (e.g. 401 Unauthorized / 404 Not Found)
                    console.warn('[auth.global.ts] Session invalid or user removed from DB. Clearing auth_token cookie.')
                    deleteCookie(event, 'auth_token', { path: '/' })
                    event.context.user = null
                }

                if (userVerified) {
                    event.context.user = {
                        uuid: payload.user_id,
                        email: payload.email,
                        full_name: payload.name,
                        avatar_url: payload.avatar,
                        role: payload.role,
                        user_type: payload.user_type,
                        ...(profileData || {})
                    }
                } else if (!event.context.user) {
                    deleteCookie(event, 'auth_token', { path: '/' })
                    event.context.user = null
                }
            }
        } else {
            deleteCookie(event, 'auth_token', { path: '/' })
            event.context.user = null
        }
    }

    const user = event.context.user

    // ——— 2. Auth pages: if logged in → redirect to dashboard ———
    if (path.startsWith('/auth')) {
        if (user) {
            const target = user.role === 'root' ? '/dashboard/root' : '/dashboard'
            return sendRedirect(event, target, 302)
        }
        return
    }

    // ——— 3. Public routes: no redirect ———
    const isPublic =
        path === '/' ||
        path === '/tournaments' ||
        path === '/about'
    if (isPublic) return

    // ——— 4. Protected routes: if not logged in → redirect to login ———
    const isProtected =
        path.startsWith('/dashboard') ||
        path.startsWith('/profile') ||
        (path.includes('/register') && !path.startsWith('/auth') && !path.startsWith('/events/')) ||
        path.includes('/payment')

    if (isProtected && !user) {
        const redirectUrl = '/auth/login?redirect=' + encodeURIComponent(url)
        return sendRedirect(event, redirectUrl, 302)
    }
})
