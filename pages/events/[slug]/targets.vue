<template>
  <div class="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
    <LayoutAppHeaderDynamic />

    <main class="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      <!-- Breadcrumb Header -->
      <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
        <NuxtLink to="/events" class="hover:text-navy">Events</NuxtLink>
        <Icon icon="ph:caret-right-bold" />
        <NuxtLink :to="`/events/${slug}`" class="hover:text-navy">{{ event?.name || 'Event' }}</NuxtLink>
        <Icon icon="ph:caret-right-bold" />
        <span class="text-navy">Daftar Target Face</span>
      </div>

      <div class="bg-navy text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.15;"></div>
        <div class="relative z-10 space-y-2">
          <span class="px-3 py-1 bg-primary/20 text-primary text-xs font-black rounded-full capitalize tracking-wider">
            Denah & Alokasi Target
          </span>
          <h1 class="text-2xl sm:text-4xl font-black tracking-tight">{{ event?.name || 'Daftar Target' }}</h1>
          <p class="text-xs sm:text-sm text-slate-300">Temukan nomor bantalan target dan posisi Anda pada sesi kualifikasi.</p>
        </div>
      </div>

      <!-- Search & Category Filters -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-3.5 shadow-xs">
        <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div class="relative flex-1 max-w-md">
            <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input v-model="search" type="text" placeholder="Cari nama pemanah, klub, atau bantalan..."
              class="w-full pl-9 pr-8 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all" />
            <button v-if="search" @click="search = ''" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy">
              <Icon icon="ph:x-circle-fill" class="text-sm" />
            </button>
          </div>
          <div class="text-xs font-bold text-slate-500 self-center">
            Total Pemanah: <span class="text-navy font-black">{{ filteredTargets.length }}</span>
          </div>
        </div>

        <!-- Category Filter Chips -->
        <div v-if="categories.length > 1" class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button type="button" @click="selectedCategory = ''"
            :class="selectedCategory === '' ? 'bg-navy text-white font-black shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold'"
            class="px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap">
            Semua Kategori ({{ targets.length }})
          </button>
          <button v-for="cat in categories" :key="cat.name" type="button" @click="selectedCategory = cat.name"
            :class="selectedCategory === cat.name ? 'bg-navy text-white font-black shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold'"
            class="px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap">
            {{ cat.name }} ({{ cat.count }})
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="h-80 bg-white rounded-3xl animate-pulse border border-slate-200/80" />

      <!-- Empty -->
      <div v-else-if="filteredTargets.length === 0" class="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-500 space-y-2">
        <Icon icon="ph:target-bold" class="text-4xl mx-auto text-slate-300" />
        <div class="font-bold text-sm text-navy">Tidak ada data alokasi target yang sesuai</div>
        <div class="text-xs text-slate-400">Silakan sesuaikan kata kunci pencarian atau kategori filter Anda.</div>
      </div>

      <!-- Target List -->
      <div v-else class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold capitalize tracking-wider">
                <th class="p-4 w-20 text-center">Bantalan</th>
                <th class="p-4 w-16 text-center">Posisi</th>
                <th class="p-4">Nama Pemanah</th>
                <th class="p-4">Klub / Kontingen</th>
                <th class="p-4">Kategori</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(t, idx) in filteredTargets" :key="t.uuid || idx" class="hover:bg-slate-50/50 transition-colors">
                <td class="p-4 text-center font-black text-navy text-sm">{{ t.target_name || '—' }}</td>
                <td class="p-4 text-center">
                  <span class="size-7 rounded-lg bg-primary/20 text-navy font-black text-xs inline-flex items-center justify-center">
                    {{ t.target_board || t.board_code || 'A' }}
                  </span>
                </td>
                <td class="p-4 font-black text-navy text-sm">{{ t.archer_name || t.full_name }}</td>
                <td class="p-4 text-slate-600 font-bold">{{ t.club_name || 'Independen' }}</td>
                <td class="p-4">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                    {{ t.category_name || '-' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const { get } = useApi()

const slug = computed(() => route.params.slug as string)
const isLoading = ref(true)
const event = ref<any>(null)
const targets = ref<any[]>([])
const search = ref('')
const selectedCategory = ref('')

const categories = computed(() => {
  const map: Record<string, number> = {}
  for (const t of targets.value) {
    const cat = t.category_name || 'Lainnya'
    map[cat] = (map[cat] || 0) + 1
  }
  return Object.entries(map).map(([name, count]) => ({ name, count }))
})

const filteredTargets = computed(() => {
  let list = targets.value

  if (selectedCategory.value) {
    list = list.filter(t => (t.category_name || 'Lainnya') === selectedCategory.value)
  }

  if (search.value) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(t =>
      (t.archer_name || t.full_name || '').toLowerCase().includes(q) ||
      (t.club_name || '').toLowerCase().includes(q) ||
      (t.target_name || '').toLowerCase().includes(q) ||
      (t.category_name || '').toLowerCase().includes(q)
    )
  }

  return list
})

async function fetchData() {
  isLoading.value = true
  try {
    const eRes = await get(`/events/${slug.value}`)
    event.value = eRes?.event || eRes

    const tRes = await get(`/events/${slug.value}/targets`)
    targets.value = tRes?.targets || tRes?.data || []
  } catch {
    targets.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)

useHead({
  title: computed(() => `Target Face - ${event.value?.name || 'Event'} - Archeris.net`)
})
</script>