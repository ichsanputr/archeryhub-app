<template>
  <DashboardOrganizerEventsList />
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useEventContext } from '~/composables/useEventContext'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useHead({
  title: computed(() => t('events.list.title', 'Event & Turnamen Saya') + ' - Archeris')
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
