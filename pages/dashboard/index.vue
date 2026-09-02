<script setup>

useHead({ title: computed(() => t('dashboard.title', 'Dashboard') + ' - Archeris Dashboard') })
import useDashboardI18n from '~/composables/useDashboardI18n'
import { useI18n } from 'vue-i18n'
const { t } = useDashboardI18n()
// Redirection is handled by the global persona-redirect middleware
</script>

<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="flex flex-col items-center gap-4">
      <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin" />
      <div class="text-gray-400 font-bold animate-pulse">{{ t('common.loading_dashboard', 'Loading...') }}</div>
    </div>
  </div>
</template>
