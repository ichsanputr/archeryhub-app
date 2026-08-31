<template>
  <div class="min-h-screen flex flex-col bg-navy text-white antialiased font-sans relative overflow-hidden">
    <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.15;"></div>
    <div class="absolute -top-32 -left-32 size-96 rounded-full bg-primary/10 blur-3xl"></div>
    <div class="absolute -bottom-32 -right-32 size-96 rounded-full bg-primary/10 blur-3xl"></div>

    <main class="flex-grow flex items-center justify-center p-4 relative z-10">
      <div class="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl space-y-8 text-center">
        <!-- Logo & Header -->
        <div class="space-y-3">
          <div class="size-16 rounded-2xl bg-primary text-navy flex items-center justify-center mx-auto font-black text-2xl shadow-lg shadow-primary/20">
            <Icon icon="ph:user-focus-bold" />
          </div>
          <h1 class="text-2xl font-black tracking-tight">Scorekeeper Portal</h1>
          <p class="text-xs text-white/60">Masukkan 5 Karakter Kode Akses Scorekeeper yang diberikan oleh panitia event.</p>
        </div>

        <!-- Error Alert -->
        <div v-if="errorMsg" class="bg-red-500/20 border border-red-500/40 rounded-2xl p-4 text-red-200 text-xs font-bold text-left flex items-start gap-2">
          <Icon icon="ph:warning-circle-bold" class="text-lg shrink-0 mt-0.5" />
          <div>{{ errorMsg }}</div>
        </div>

        <!-- 5-Character Code Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-black capitalize tracking-widest text-white/60 block">Kode Scorekeeper (5 Karakter)</label>
            <input
              v-model="code"
              type="text"
              maxlength="5"
              placeholder="e.g. A1B2C"
              class="w-full text-center text-3xl font-mono font-black capitalize tracking-widest bg-navy/60 border-2 border-white/20 focus:border-primary rounded-2xl py-4 text-primary focus:outline-none transition-colors shadow-inner"
              required
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading || code.length < 5"
            class="w-full py-4 bg-primary text-navy font-black text-base rounded-2xl hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Icon v-if="isLoading" icon="ph:spinner-gap-bold" class="animate-spin text-xl" />
            <span v-else>Masuk Portal Scoring</span>
          </button>
        </form>

        <div class="text-xs text-white/40 pt-4 border-t border-white/10">
          Butuh bantuan? Hubungi Tournament Director atau Panitia Event.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { post } = useApi()

const code = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (code.value.length < 5) return
  isLoading.value = true
  errorMsg.value = ''

  try {
    const res = await post('/mobile/auth/scorekeeper/login', { code: code.value.toUpperCase().trim() })
    const token = res?.token
    if (token) {
      // Store token
      const authCookie = useCookie('auth_token')
      authCookie.value = token
      localStorage.setItem('token', token)
      localStorage.setItem('user_role', 'scorekeeper')
      
      // Redirect to scorekeeper dashboard / match list
      router.push('/dashboard/organizer')
    } else {
      errorMsg.value = res?.error || 'Kode scorekeeper tidak valid'
    }
  } catch (err: any) {
    errorMsg.value = err?.data?.error || err?.response?._data?.error || 'Gagal masuk. Periksa kembali kode Anda.'
  } finally {
    isLoading.value = false
  }
}

definePageMeta({
  layout: false
})

useHead({
  title: 'Scorekeeper Login - Archeris.net'
})
</script>