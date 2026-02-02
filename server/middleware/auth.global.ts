/**
 * Unified auth middleware (SSR-only).
 * Replaces: middleware/auth.global.ts, middleware/redirect-auth.global.ts,
 *           server/middleware/auth.ts, server/middleware/auth.global.js
 *
 * 1. Decodes JWT from auth_token cookie and sets event.context.user
 * 2. Redirects unauthenticated users from protected routes to /auth/login
 * 3. Redirects authenticated users from /auth/* to /dashboard
 */
import { getCookie, sendRedirect } from 'h3'
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

export default defineEventHandler((event: H3Event) => {

    console.log("KONTOL 1")
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
            event.context.user = {
                id: payload.user_id,
                email: payload.email,
                full_name: payload.name,
                avatar_url: payload.avatar,
                role: payload.role,
                user_type: payload.user_type
            }
        } else {
            event.context.user = null
        }
    }

    const user = event.context.user

    // ——— 2. Auth pages: if logged in → redirect to dashboard ———
    if (path.startsWith('/auth')) {
        if (user) {
            return sendRedirect(event, '/dashboard', 302)
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
