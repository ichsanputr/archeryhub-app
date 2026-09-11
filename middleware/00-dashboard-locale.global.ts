export default defineNuxtRouteMiddleware((to) => {
  const localeCodes = ['en', 'id']
  const segments = to.path.split('/').filter(Boolean)

  if (segments.length >= 2 && localeCodes.includes(segments[0]) && segments[1] === 'dashboard') {
    return navigateTo({
      path: `/${segments.slice(1).join('/')}`,
      query: to.query,
      hash: to.hash
    }, { replace: true })
  }
})
