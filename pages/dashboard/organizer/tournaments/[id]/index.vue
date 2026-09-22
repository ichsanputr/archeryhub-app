<template>
  <div class="py-12 flex items-center justify-center">
    <Icon icon="ph:spinner-gap-bold" class="text-3xl text-navy animate-spin" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

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
  await get(`/tournaments/${eventId}`)
} catch (error: any) {
  if (error?.response?.status === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tournament not found',
      fatal: true,
    })
  }
}

await navigateTo(`/dashboard/organizer/tournaments/${eventId}/overview`, {
  redirectCode: 302,
  replace: true,
})
</script>
