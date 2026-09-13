export default defineNuxtRouteMiddleware((to) => {
    const { user, userPersona } = useAuth()

    // Only handle dashboard routes that are NOT already persona-prefixed
    // We check if the second segment is NOT in our persona list
    const personas = ['archer', 'club', 'organizer', 'root']
    const segments = to.path.split('/').filter(Boolean)

    if (segments[0] === 'dashboard') {
        // If it's just /dashboard, it will be handled by pages/dashboard/index.vue or redirected here
        const secondSegment = segments[1]

        // List of generic paths that should be redirected to persona paths
        const genericPaths = [
            'settings', 'profile', 'reports', 'subscription', 'notifications',
            'news', 'events', 'payments-membership', 'archers', 'clubs', 'organizers'
        ]

        if (genericPaths.includes(secondSegment) || !secondSegment) {
            if (!user.value) return // Let auth middleware handle it

            const persona = userPersona.value
            const remainingPath = segments.slice(secondSegment ? 2 : 1).join('/')

            // Map plural legacy paths to singular
            let targetFeature = secondSegment || ''
            if (targetFeature === 'archers') targetFeature = 'archer'
            if (targetFeature === 'clubs') targetFeature = 'club'
            if (targetFeature === 'organizers') targetFeature = 'organizer'

            const target = `/dashboard/${persona}${targetFeature ? '/' + targetFeature : ''}${remainingPath ? '/' + remainingPath : ''}`

            // Avoid infinite loop if target is same as current (shouldn't happen with our logic)
            if (to.path !== target) {
                return navigateTo({ path: target, query: to.query, hash: to.hash }, { replace: true })
            }
        }
    }
})
