<template>
  <div class="space-y-8">
    <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2 font-display">
        <span class="material-symbols-outlined text-primary">info</span> Tentang Turnamen
      </h2>
      <div class="prose max-w-none text-text-sub leading-relaxed space-y-4">
        <p>Indonesian Open Championship 2024 adalah ajang panahan bergengsi tingkat nasional yang mempertemukan talenta
          terbaik dari seluruh nusantara.</p>
        <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
          <h4 class="font-bold text-navy mb-2">Buku Panduan Teknis (THB)</h4>
          <p class="text-sm text-text-sub mb-3">Unduh panduan lengkap yang berisi peraturan, regulasi, dan jadwal detail
            turnamen.</p>
          <button class="text-navy font-bold text-sm hover:underline inline-flex items-center gap-1">
            Unduh PDF <span class="material-symbols-outlined text-lg">download</span>
          </button>
        </div>
      </div>
    </section>
    <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2 font-display">
        <span class="material-symbols-outlined text-primary">category</span> Divisi Kompetisi
      </h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="division in divisions" :key="division.name"
          class="border border-gray-100 rounded-xl p-5 hover:border-primary transition-colors">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-navy/5 rounded-lg flex items-center justify-center text-navy">
              <span class="material-symbols-outlined text-3xl">{{ division.icon }}</span>
            </div>
            <span class="bg-navy text-white text-xs font-bold px-2 py-1 rounded">{{ division.dist }}</span>
          </div>
          <h3 class="text-lg font-bold text-navy mb-2">{{ division.name }}</h3>
          <ul class="space-y-2 text-sm text-text-sub">
            <li v-for="cat in division.categories" :key="cat" class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">check_circle</span> {{ cat }}
            </li>
          </ul>
        </div>
      </div>
    </section>
    <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <h2 class="text-xl font-bold text-navy mb-6 flex items-center gap-2 relative z-10 font-display">
        <span class="material-symbols-outlined text-primary">emoji_events</span> Total Hadiah
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        <div v-for="prize in prizes" :key="prize.pos" :class="prize.bg" class="border rounded-xl p-6 text-center">
          <div class="text-4xl mb-2">{{ prize.emoji }}</div>
          <div class="text-xs font-bold text-text-sub uppercase tracking-wider mb-1">{{ prize.pos }}</div>
          <div class="text-xl font-black text-navy">{{ prize.amount }}</div>
          <div class="text-[10px] text-text-sub mt-2">{{ prize.extra }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const divisions = [
  { name: 'Divisi Recurve', dist: '70m', icon: 'adjust', categories: ['Individu Putra', 'Individu Putri', 'Beregu Campuran'] },
  { name: 'Divisi Compound', dist: '50m', icon: 'gps_fixed', categories: ['Individu Putra', 'Individu Putri', 'Beregu Campuran'] }
]

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
