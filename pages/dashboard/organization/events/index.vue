<template>
  <DashboardOrganizationEventsList />
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useEventContext } from '~/composables/useEventContext'
import { useRouter } from 'vue-router'
import useDashboardI18n from '~/composables/useDashboardI18n'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: useDashboardI18n().t('organization.events.meta_title')
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
