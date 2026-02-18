<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div
      class="bg-white rounded-3xl shadow-xl shadow-navy/5 border border-gray-100 p-8 text-center max-w-sm w-full relative overflow-hidden">
      <!-- Decorative element -->
      <div class="absolute top-0 right-0 -mt-8 -mr-8 size-24 bg-primary/10 rounded-full blur-2xl"></div>

      <div class="size-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Icon :ssr="true" icon="ph:check-circle-bold" class="w-10 h-10" />
      </div>

      <h1 class="text-2xl font-black text-navy mb-2 tracking-tight">Login Berhasil!</h1>
      <p class="text-slate-500 font-medium mb-8">Autentikasi kamu berhasil. Sekarang kamu bisa kembali ke halaman utama.
      </p>

      <button @click="goHome"
        class="w-full bg-navy hover:bg-navy-light text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-navy/10 active:scale-[0.98]">
        Kembali ke Beranda
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { setToken } = useAuth()

useHead({
  title: 'Login Berhasil - Archeryhub.id'
})

onMounted(() => {
  const token = new URLSearchParams(window.location.search).get('token')
  if (token) {
    setToken(token)
    // Remove token from URL to prevent leakage
    window.history.replaceState({}, document.title, window.location.pathname)
  }
})

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* No specific styles needed as Tailwind handles it all */
</style>
