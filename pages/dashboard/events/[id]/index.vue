<template>
  <div class="space-y-8">
    <!-- Archer Dashboard View -->
    <template v-if="isArcher">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Data Registrasi Card -->
        <NuxtLink :to="`/dashboard/events/${eventId}/my-registration`"
          class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div
            class="absolute -right-4 -bottom-4 size-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors">
          </div>
          <div class="size-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
            <Icon icon="ph:clipboard-text-bold" class="text-2xl" />
          </div>
          <h3 class="text-xl font-black text-navy mb-2">Data Registrasi</h3>
          <p class="text-sm text-gray-400 font-bold">Cek detail pendaftaran dan bukti pembayaran Anda.</p>
          <div class="mt-6 flex items-center gap-2 text-amber-500 text-xs font-black uppercase tracking-widest">
            Buka Data
            <Icon icon="ph:arrow-right-bold" />
          </div>
        </NuxtLink>

        <!-- Hasil Kualifikasi Card -->
        <NuxtLink :to="`/dashboard/events/${eventId}/my-qualification`"
          class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div
            class="absolute -right-4 -bottom-4 size-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors">
          </div>
          <div class="size-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6">
            <Icon icon="ph:chart-line-up-bold" class="text-2xl" />
          </div>
          <h3 class="text-xl font-black text-navy mb-2">Hasil Kualifikasi</h3>
          <p class="text-sm text-gray-400 font-bold">Lihat skor dan peringkat kualifikasi Anda secara real-time.</p>
          <div class="mt-6 flex items-center gap-2 text-emerald-500 text-xs font-black uppercase tracking-widest">
            Buka Hasil
            <Icon icon="ph:arrow-right-bold" />
          </div>
        </NuxtLink>

        <!-- Hasil Eliminasi Card -->
        <NuxtLink :to="`/dashboard/events/${eventId}/my-elimination`"
          class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div
            class="absolute -right-4 -bottom-4 size-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors">
          </div>
          <div class="size-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
            <Icon icon="ph:git-merge-bold" class="text-2xl" />
          </div>
          <h3 class="text-xl font-black text-navy mb-2">Hasil Eliminasi</h3>
          <p class="text-sm text-gray-400 font-bold">Pantau progres bracket eliminasi dan jadwal tanding Anda.</p>
          <div class="mt-6 flex items-center gap-2 text-indigo-500 text-xs font-black uppercase tracking-widest">
            Buka Hasil
            <Icon icon="ph:arrow-right-bold" />
          </div>
        </NuxtLink>

      </div>

      <!-- Quick Tips / Info -->
      <section class="bg-navy rounded-[32px] p-8 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div class="relative z-10">
          <h4 class="text-xl font-black mb-4 flex items-center gap-3">
            <Icon icon="ph:info-bold" class="text-primary text-2xl" />
            Informasi Penting
          </h4>
          <p class="text-slate-300 text-sm max-w-2xl leading-relaxed mb-6">
            Pastikan Anda sudah melakukan daftar ulang di lokasi sebelum pertandingan dimulai. Scorecard digital akan
            diperbarui secara otomatis oleh panitia.
          </p>
          <div class="flex flex-wrap gap-4">
            <div class="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-slate-300">
              Check-in: 07:00 WIB
            </div>
            <div class="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-slate-300">
              Technical Meeting: Online / Lokasi
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Original Organization / Club View -->
    <template v-else>
      <section class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2 font-display">
          <Icon icon="ph:info-bold" class="text-primary" /> Tentang Turnamen
        </h2>
        <div class="prose max-w-none text-text-sub leading-relaxed space-y-4">
          <p>Indonesian Open Championship 2024 adalah ajang panahan bergengsi tingkat nasional yang mempertemukan
            talenta
            terbaik dari seluruh nusantara.</p>
          <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
            <h4 class="font-bold text-navy mb-2">Buku Panduan Teknis (THB)</h4>
            <p class="text-sm text-text-sub mb-3">Unduh panduan lengkap yang berisi peraturan, regulasi, dan jadwal
              detail
              turnamen.</p>
            <BaseButton variant="white" size="sm" icon="ph:download-simple"
              class="text-navy font-bold text-sm border-none shadow-none p-0 h-auto hover:underline">
              Unduh PDF
            </BaseButton>
          </div>
        </div>
      </section>
      <section class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2 font-display">
          <Icon icon="ph:squares-four-bold" class="text-primary" /> Divisi Kompetisi
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="division in divisions" :key="division.name"
            class="border border-gray-100 rounded-xl p-5 hover:border-primary transition-colors">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-navy rounded-lg flex items-center justify-center p-2 overflow-hidden shadow-sm">
                <img :src="'/' + getCategoryIcon(division.name)" :alt="division.name"
                  class="w-full h-full object-contain invert transition-all" />
              </div>
              <span class="bg-navy text-white text-xs font-bold px-2 py-1 rounded">{{ division.dist }}</span>
            </div>
            <h3 class="text-lg font-bold text-navy mb-2">{{ division.name }}</h3>
            <ul class="space-y-2 text-sm text-text-sub">
              <li v-for="cat in division.categories" :key="cat" class="flex items-center gap-2">
                <Icon icon="ph:check-circle-fill" class="text-primary text-base" /> {{ cat }}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2 relative z-10 font-display">
          <Icon icon="ph:trophy-bold" class="text-primary" /> Total Hadiah
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
          <div v-for="prize in prizes" :key="prize.pos" :class="prize.bg" class="border rounded-xl p-6 text-center">
            <div class="text-4xl mb-2">{{ prize.emoji }}</div>
            <div class="text-xs font-bold text-text-sub  tracking-wider mb-1">{{ prize.pos }}</div>
            <div class="text-xl font-black text-navy">{{ prize.amount }}</div>
            <div class="text-[10px] text-text-sub mt-2">{{ prize.extra }}</div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import { useAuth } from '~/composables/useAuth'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { user } = useAuth()
const route = useRoute()
const eventId = route.params.id

const isArcher = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  return role === 'archer'
})

const divisions = [
  { name: 'Divisi Recurve', dist: '70m', icon: 'ph:target', categories: ['Individu Putra', 'Individu Putri', 'Beregu Campuran'] },
  { name: 'Divisi Compound', dist: '50m', icon: 'ph:target-bold', categories: ['Individu Putra', 'Individu Putri', 'Beregu Campuran'] }
]

useHead({
  title: 'Dashboard Event - ArcheryHub'
})

const prizes = [
  { pos: 'Juara 1', amount: 'Rp 15.000.000', emoji: '🥇', extra: '+ Medali Emas & Sertifikat', bg: 'from-yellow-400/10 to-transparent border-yellow-400/20' },
  { pos: 'Juara 2', amount: 'Rp 10.000.000', emoji: '🥈', extra: '+ Medali Perak & Sertifikat', bg: 'from-gray-400/10 to-transparent border-gray-400/20' },
  { pos: 'Juara 3', amount: 'Rp 7.500.000', emoji: '🥉', extra: '+ Medali Perunggu & Sertifikat', bg: 'from-orange-400/10 to-transparent border-orange-400/20' }
]
</script>

<style scoped>
.text-text-sub {
  color: #4b5563;
}
</style>
