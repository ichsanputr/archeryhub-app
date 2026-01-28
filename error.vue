<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center max-w-lg">
      <!-- Error Illustration -->
      <div class="relative mb-8">
        <div
          class="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-amber-400 rounded-full flex items-center justify-center shadow-xl shadow-primary/20">
          <div class="w-24 h-24 bg-navy rounded-full flex items-center justify-center">
            <Icon icon="ph:target" class="text-5xl text-primary" />
          </div>
        </div>
        <div
          class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
          {{ error?.statusCode || 404 }}
        </div>
      </div>

      <!-- Error Message -->
      <h1 class="text-3xl md:text-4xl font-black text-navy mb-4">
        {{ title }}
      </h1>
      <p class="text-gray-500 mb-8 leading-relaxed">
        {{ message }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink to="/">
          <BaseButton variant="primary" size="lg" icon="ph:house-bold">
            Kembali ke Beranda
          </BaseButton>
        </NuxtLink>
        <button @click="handleError"
          class="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors font-medium">
          <Icon icon="ph:arrow-counter-clockwise" />
          Coba Lagi
        </button>
      </div>

      <!-- Helpful Links -->
      <div class="mt-12 pt-8 border-t border-gray-200">
        <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Mungkin Anda mencari</p>
        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink to="/events"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-primary hover:text-navy transition-all">
            Turnamen
          </NuxtLink>
          <NuxtLink to="/clubs"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-primary hover:text-navy transition-all">
            Klub
          </NuxtLink>
          <NuxtLink to="/news"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-primary hover:text-navy transition-all">
            Berita
          </NuxtLink>
          <NuxtLink to="/products"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-primary hover:text-navy transition-all">
            Marketplace
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

// Get error from Nuxt
const error = useError()

const title = computed(() => {
  const code = error.value?.statusCode
  switch (code) {
    case 404:
      return 'Halaman Tidak Ditemukan'
    case 403:
      return 'Akses Ditolak'
    case 500:
      return 'Terjadi Kesalahan'
    default:
      return 'Terjadi Kesalahan'
  }
})

const message = computed(() => {
  const code = error.value?.statusCode
  switch (code) {
    case 404:
      return 'Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin sudah dipindahkan atau dihapus.'
    case 403:
      return 'Anda tidak memiliki izin untuk mengakses halaman ini. Silakan login atau hubungi administrator.'
    case 500:
      return 'Terjadi kesalahan pada server. Tim kami sedang bekerja untuk memperbaikinya.'
    default:
      return error.value?.message || 'Terjadi kesalahan yang tidak diketahui.'
  }
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
