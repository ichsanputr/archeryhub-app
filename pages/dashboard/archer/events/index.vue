<template>
  <DashboardArcherEventsList />
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useEventContext } from '~/composables/useEventContext'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('my_registration.my_events') + ' - ArcheryHub Dashboard')
})

const { clearEvent } = useEventContext()

onMounted(() => {
  clearEvent() // Reset header when back to general list
})
</script>
