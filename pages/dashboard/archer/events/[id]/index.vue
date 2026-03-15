<template>
  <div />
</template>

<script setup lang="ts">
const { get } = useApi()
const route = useRoute()
const eventId = String(route.params.id || '')

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Redirecting...'
})

try {
  await get(`/events/${eventId}`)
} catch (error: any) {
  if (error?.response?.status === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Event not found',
      fatal: true,
    })
  }

  throw createError({
    statusCode: error?.response?.status || 500,
    statusMessage: error?.response?._data?.message || 'Failed to load event',
    fatal: true,
  })
}

await navigateTo(`/dashboard/archer/events/${eventId}/my-registration`, {
  redirectCode: 302,
  replace: true,
})
</script>
