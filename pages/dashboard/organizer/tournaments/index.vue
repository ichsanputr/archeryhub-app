<template>
  <DashboardOrganizerTournamentsList />
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useTournamentContext } from '~/composables/useTournamentContext'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useHead({
  title: computed(() => t('events.list.title', 'Turnamen Saya') + ' - Archeris')
})

const { user } = useAuth()
const { clearTournament } = useTournamentContext()
const router = useRouter()

onMounted(() => {
  clearTournament() // Reset header when back to general list

  // If user is an archer, redirect to their dedicated tournaments page
  if (user.value?.role === 'archer') {
    router.replace('/dashboard/archer/tournaments')
  }
})
</script>
