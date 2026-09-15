<template>
  <DashboardArcherTournamentsList />
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useTournamentContext } from '~/composables/useTournamentContext'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('my_events.title', 'Turnamen Saya') + ' - Archeris Dashboard')
})

const { clearTournament } = useTournamentContext()

onMounted(() => {
  clearTournament() // Reset header when back to general list
})
</script>
