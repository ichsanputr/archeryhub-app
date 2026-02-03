<template>
  <DashboardOrganizationEventsList v-if="!isArcher" />
  <DashboardArcherEventsList v-else />
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Daftar Event - ArcheryHub Dashboard'
})

const { user } = useAuth()
const { clearEvent } = useEventContext()

// Role-based permissions
const isArcher = computed(() => user.value?.role === 'archer')

onMounted(() => {
  clearEvent() // Reset header when back to general list
})
</script>
