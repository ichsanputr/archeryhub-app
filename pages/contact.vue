<template>
  <div>
    <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
      <div class="absolute inset-0 z-0">
        <img src="/hero-homepage.jpeg" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl font-display">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-sm font-bold tracking-widest mb-6">
            <Icon icon="ph:headset-bold" class="text-base sm:text-lg" />
            <span class="uppercase">Get in Touch</span>
          </div>
          <h1 class="text-white text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-tight mb-4">
            Hubungi <span class="text-primary">Kami</span>
          </h1>
          <p class="text-slate-300 text-sm md:text-lg leading-relaxed max-w-2xl">
            Ada pertanyaan tentang platform? Baik Anda atlet atau penyelenggara event, kami
            di sini untuk membantu Anda mencapai target.
          </p>
        </div>
      </div>
    </section>

    <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-30">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div class="lg:col-span-8">
          <div
            class="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <h2 class="text-lg md:text-2xl font-black text-navy dark:text-white mb-6">Kirim pesan kepada kami</h2>
            <form class="space-y-6" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-500  tracking-wider mb-2">Nama Anda</label>
                  <input v-model="form.name"
                    class="w-full px-4 py-3 bg-background-light dark:bg-gray-900 border-transparent rounded-xl text-sm text-slate-800 focus:border-navy focus:bg-white focus:ring-0 transition-colors placeholder:text-slate-400"
                    placeholder="Masukkan nama lengkap Anda" type="text" required />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500  tracking-wider mb-2">Alamat Email</label>
                  <input v-model="form.email"
                    class="w-full px-4 py-3 bg-background-light dark:bg-gray-900 border-transparent rounded-xl text-sm text-slate-800 focus:border-navy focus:bg-white focus:ring-0 transition-colors placeholder:text-slate-400"
                    placeholder="nama@example.com" type="email" required />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500  tracking-wider mb-2">Subjek</label>
                <select v-model="form.subject"
                  class="w-full px-4 py-3 bg-background-light dark:bg-gray-900 border-transparent rounded-xl text-sm text-slate-800 focus:border-navy focus:bg-white focus:ring-0 transition-colors cursor-pointer"
                  required>
                  <option disabled value="">Pilih topik</option>
                  <option value="general">Pertanyaan Umum</option>
                  <option value="tech">Masalah Teknis</option>
                  <option value="partnership">Kemitraan</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500  tracking-wider mb-2">Pesan</label>
                <textarea v-model="form.message"
                  class="w-full px-4 py-3 bg-background-light dark:bg-gray-900 border-transparent rounded-xl text-sm text-slate-800 focus:border-navy focus:bg-white focus:ring-0 transition-colors placeholder:text-slate-400 resize-none"
                  placeholder="Bagaimana kami dapat membantu Anda?" rows="5" required></textarea>
              </div>
              <div class="pt-2">
                <button
                  class="w-full md:w-auto bg-primary hover:bg-primary-hover text-navy px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-md flex items-center justify-center gap-2 transform active:scale-95"
                  type="submit" :disabled="loading">
                  <span>{{ loading ? 'Mengirim...' : 'Kirim Pesan' }}</span>
                  <Icon icon="ph:paper-plane-tilt-bold" class="text-lg" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="bg-navy rounded-2xl shadow-sm p-8 relative overflow-hidden text-white">
            <div class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Icon icon="ph:globe-hemisphere-west-bold" class="text-9xl" />
            </div>
            <h3 class="font-black text-lg md:text-xl mb-6 relative z-10">Informasi Kontak</h3>
            <div class="space-y-6 relative z-10">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon icon="ph:map-pin-fill" class="text-primary" />
                </div>
                <div>
                  <h4 class="text-xs md:text-sm font-black text-slate-300 tracking-wide mb-1">Kantor Pusat</h4>
                  <p class="text-white leading-relaxed text-xs md:text-sm">
                    Kompleks Olahraga Gelora Bung Karno<br />
                    Jl. Pintu Satu Senayan<br />
                    Jakarta Pusat, DKI Jakarta 10270
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon icon="ph:envelope-simple-fill" class="text-primary" />
                </div>
                <div>
                  <h4 class="text-xs md:text-sm font-black text-slate-300 tracking-wide mb-1">Dukungan Email</h4>
                  <a class="text-white hover:text-primary transition-colors text-xs md:text-sm font-medium"
                    href="mailto:support@archeryhub.id">support@archeryhub.id</a>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon icon="ph:phone-fill" class="text-primary" />
                </div>
                <div>
                  <h4 class="text-xs md:text-sm font-black text-slate-300 tracking-wide mb-1">Telepon</h4>
                  <a class="text-white hover:text-primary transition-colors text-xs md:text-sm font-medium"
                    href="tel:+62215758888">+62 21 575 8888</a>
                  <div class="text-xs text-slate-400 mt-1">Senin-Jumat, 09.00 - 17.00 WIB</div>
                </div>
              </div>
            </div>
            <div class="mt-8 pt-8 border-t border-white/10 relative z-10">
              <h4 class="text-xs md:text-sm font-black text-slate-300 tracking-wide mb-4">Ikuti Kami</h4>
              <div class="flex gap-4">
                <a href="#"
                  class="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary hover:text-navy transition-all flex items-center justify-center group">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#"
                  class="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary hover:text-navy transition-all flex items-center justify-center group">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#"
                  class="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary hover:text-navy transition-all flex items-center justify-center group">
                  <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path
                      d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.597 1.325-1.326V1.326C24 .597 23.403 0 22.675 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 class="font-black text-lg md:text-xl text-navy dark:text-white mb-2 flex items-center gap-2">
              <Icon icon="ph:question-bold" class="text-primary" />
              Bantuan Cepat
            </h3>
            <p class="text-sm text-slate-500 mb-3">Mencari pertanyaan yang sering diajukan atau panduan teknis? Kunjungi
              Dokumentasi kami untuk
              jawaban instan.</p>
            <NuxtLink to="/docs"
              class="text-xs font-bold text-navy dark:text-white border-b-2 border-primary hover:border-navy transition-colors pb-0.5 inline-block">
              Kunjungi Dokumentasi</NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
definePageMeta({
  layout: 'landing'
})

useHead({
  title: 'Hubungi Kami - Archeryhub.id'
})

const loading = ref(false)
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const { post } = useApi()

const handleSubmit = async () => {
  if (!form.name || !form.email || !form.subject || !form.message) {
    alert('Silakan lengkapi semua field.')
    return
  }

  loading.value = true
  try {
    await post('/contact', {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message
    })

    alert('Terima kasih! Pesan Anda telah dikirim.')
    // Reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (error) {
    console.error('Failed to send message:', error)
    alert('Gagal mengirim pesan. Silakan coba lagi nanti.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
