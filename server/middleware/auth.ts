// Server middleware for JWT authentication
import { H3Event, getCookie } from 'h3'

// Simple JWT decode (no verification - just parse payload)
function decodeJWT(token: string) {
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return null

        const payload = parts[1]
        const decoded = Buffer.from(payload, 'base64url').toString('utf-8')
        return JSON.parse(decoded)
    } catch {
        return null
    }
}

export default defineEventHandler(async (event: H3Event) => {
    const token = getCookie(event, 'auth_token')

    if (!token) {
        event.context.user = null
        return
    }

    // Decode JWT payload (we trust the backend issued it correctly)
    const payload = decodeJWT(token)

    if (!payload || !payload.user_id) {
        event.context.user = null
        return
    }

    // Attach user info to context for SSR
    event.context.user = {
        id: payload.user_id,
        email: payload.email,
        name: payload.name,
        avatar_url: payload.avatar,
        role: payload.role,
        type: payload.user_type
    }
})
