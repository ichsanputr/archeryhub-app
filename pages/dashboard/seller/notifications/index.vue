<template>
  <NotificationCenter />
</template>

<script setup>
import NotificationCenter from '~/components/notifications/NotificationCenter.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useHead({
  title: computed(() => (t ? t('notifications.title', 'Notifikasi Toko') : 'Notifikasi Toko') + ' - Archeris Dashboard')
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})
</script>
