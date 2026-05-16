<template>
  <DashboardArcherEventsList />
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Event Saya - Archeris Dashboard'
})

const { clearEvent } = useEventContext()

onMounted(() => {
  clearEvent() // Reset header when back to general list
})
</script>
