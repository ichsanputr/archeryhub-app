<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark p-4">
    <div class="max-w-md w-full">
      <div
        class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center space-y-6">
        <div
          class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          <Icon icon="ph:info-bold" class="text-4xl" />
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
            Email already registered
          </h1>
          <div class="text-gray-600 dark:text-gray-300 text-sm font-body">
            The email you used to register via Google already has an account on Archeris.net. You can log in directly using that account.
          </div>
        </div>

        <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 text-left space-y-3">
          <div v-if="email" class="flex items-center gap-3">
            <Icon icon="ph:envelope-simple-bold" class="text-gray-500 dark:text-gray-400 text-xl" />
            <div class="min-w-0 flex-1">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider">Email</div>
              <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ email }}</div>
            </div>
          </div>
          <div v-if="userTypeLabel" class="flex items-center gap-3">
            <Icon icon="ph:identification-card-bold" class="text-gray-500 dark:text-gray-400 text-xl" />
            <div class="min-w-0 flex-1">
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider">Account type</div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ userTypeLabel }}</div>
            </div>
          </div>
        </div>

        <div class="text-xs text-gray-500 dark:text-gray-400 font-body">
          Click the button below to log in to the existing account.
        </div>

        <NuxtLink to="/auth/login"
          class="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-navy font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20">
          <Icon icon="ph:sign-in-bold" class="text-lg" />
          Log in to account
        </NuxtLink>

        <NuxtLink to="/"
          class="inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors font-body">
          Back to homepage
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

definePageMeta({ layout: 'default' })

const { t } = useI18n()

useHead({
  title: computed(() => (t ? t('auth.already_registered', 'Email Already Registered') : 'Email Already Registered') + ' - Archeris')
})

const route = useRoute()

const email = computed(() => {
  const q = route.query.email
  return typeof q === 'string' ? decodeURIComponent(q) : ''
})

const userTypeLabel = computed(() => {
  const t = route.query.user_type
  const type = typeof t === 'string' ? t.toLowerCase() : ''
  const labels = {
    archer: 'Archer',
    organizer: 'Organizer',
    club: 'Club',
  }
  return labels[type] || type || ''
})
</script>
