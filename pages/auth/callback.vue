<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark p-4">
    <div class="max-w-md w-full text-center space-y-8">
      <div v-if="loading" class="space-y-4">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent">
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Menyambungkan akun...</h2>
        <p class="text-gray-500 dark:text-gray-400">Mohon tunggu sebentar sementara kami memproses login Anda.</p>
      </div>

      <div v-else-if="error" class="space-y-6">
        <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600">
          <span class="material-symbols-outlined text-4xl">error</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Gagal Masuk</h2>
        <p class="text-red-500 mb-6">{{ error }}</p>
        <NuxtLink to="/auth/login"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-navy font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined">arrow_back</span>
          Kembali ke Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { handleCallback, user } = useAuth()

useHead({
  title: 'Menyambungkan Akun... - Archeryhub.id'
})

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const code = route.query.code
  const state = route.query.state

  if (!code) {
    error.value = 'Kode otorisasi tidak ditemukan.'
    loading.value = false
    return
  }

  try {
    await handleCallback(code, state)

    // Full page reload so auth state is restored from cookie/SSR
    let redirect = route.query.redirect || '/dashboard'
    if ((!route.query.redirect || redirect === '/dashboard') && user.value?.role === 'archer') {
      redirect = '/dashboard/archer/events'
    }
    window.location.href = redirect
  } catch (err) {
    const statusCode = err?.statusCode ?? err?.status
    const data = err?.data ?? err?.response?._data ?? {}
    if (statusCode === 409 && data?.already_registered) {
      const email = data.email || ''
      const userType = data.user_type || ''
      window.location.href = `/auth/already-registered?email=${encodeURIComponent(email)}&user_type=${encodeURIComponent(userType)}`
      return
    }
    console.error('Callback processing failed:', err)
    error.value = err?.data?.error || err?.message || 'Terjadi kesalahan saat menyambungkan ke Google.'
  } finally {
    loading.value = false
  }
})
</script>
