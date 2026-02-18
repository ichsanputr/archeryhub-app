<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark p-4">
    <div class="max-w-md w-full">
      <div
        class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center space-y-6">
        <div
          class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          <span class="material-symbols-outlined text-4xl">info</span>
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
            Email sudah terdaftar
          </h1>
          <p class="text-gray-600 dark:text-gray-300 text-sm font-body">
            Email yang kamu pakai buat daftar lewat Google udah punya akun di Archeryhub.id. Kamu bisa langsung masuk
            pakai akun itu.
          </p>
        </div>

        <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 text-left space-y-3">
          <div v-if="email" class="flex items-center gap-3">
            <span class="material-symbols-outlined text-gray-500 dark:text-gray-400 text-xl">mail</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider">Email</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ email }}</p>
            </div>
          </div>
          <div v-if="userTypeLabel" class="flex items-center gap-3">
            <span class="material-symbols-outlined text-gray-500 dark:text-gray-400 text-xl">badge</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400  tracking-wider">Tipe akun</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userTypeLabel }}</p>
            </div>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 font-body">
          Klik tombol di bawah buat masuk ke akun yang udah ada.
        </p>

        <NuxtLink to="/auth/login"
          class="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary text-navy font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20">
          <span class="material-symbols-outlined">login</span>
          Masuk ke akun
        </NuxtLink>

        <NuxtLink to="/"
          class="inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors font-body">
          Kembali ke beranda
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({ layout: 'default' })

useHead({
  title: 'Email Sudah Terdaftar - Archeryhub.id'
})

const route = useRoute()

const email = computed(() => {
  const q = route.query.email
  return typeof q === 'string' ? decodeURIComponent(q) : ''
})

const userTypeLabel = computed(() => {
  const t = route.query.user_type
  const type = typeof t === 'string' ? (t as string).toLowerCase() : ''
  const labels: Record<string, string> = {
    archer: 'Pemanah',
    organization: 'Organisasi',
    club: 'Klub',
    seller: 'Seller',
  }
  return labels[type] || type || ''
})
</script>
