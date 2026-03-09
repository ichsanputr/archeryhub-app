<template>
  <DashboardArcherEventsList />
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useEventContext } from '~/composables/useEventContext'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Daftar Event - ArcheryHub Dashboard'
})

const { user } = useAuth()
const { clearEvent } = useEventContext()
const router = useRouter()

onMounted(() => {
  clearEvent() // Reset header when back to general list

  // If user is an archer, redirect to their dedicated events page
  if (user.value?.role === 'archer') {
    router.replace('/dashboard/archer/events')
  }
})
</script>
