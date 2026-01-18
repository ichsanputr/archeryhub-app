// server/middleware/auth.global.js
import { getCookie } from 'h3'

export default defineEventHandler(async (event) => {
    // Skip if not a page request or in CSR mode
    if (!event.node.req.url.startsWith('/') || event.node.req.url.startsWith('/_nuxt/')) {
        return
    }

    /* 
    const token = getCookie(event, 'auth_token')
    if (!token) {
        event.context.user = null
        return
    }

    try {
        const config = useRuntimeConfig()
        const baseUrl = config.public.apiBaseUrl

        // Forward cookie to your external API
        const response = await $fetch(`${baseUrl}/user`, {
            headers: { cookie: `auth_token=${token}` }
        })

        // Handle API response structure - it returns {data: user, message: "..."}
        const userData = response?.data || response
        event.context.user = userData
    } catch (error) {
        // Don't log 401 errors as they're expected when not authenticated
        if (error?.status !== 401 && error?.statusCode !== 401) {
            console.error('Error fetching user in middleware:', error)
        }
        event.context.user = null
    }
    */
    event.context.user = null // Default to null for dev mode

})