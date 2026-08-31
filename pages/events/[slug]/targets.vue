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
          <p class="text-xs sm:text-sm text-slate-300">Temukan nomor bantalan target dan posisi posisi Anda pada sesi kualifikasi.</p>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div class="flex items-center gap-3">
          <input v-model="search" type="text" placeholder="Cari nama pemanah / klub..." class="px-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl w-64 focus:outline-none" />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="h-80 bg-white rounded-3xl animate-pulse border border-slate-200/80" />

      <!-- Empty -->
      <div v-else-if="filteredTargets.length === 0" class="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-500">
        Belum ada data alokasi target yang dipublikasikan.
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
              <tr v-for="(t, idx) in filteredTargets" :key="t.uuid || idx" class="hover:bg-slate-50/50">
                <td class="p-4 text-center font-black text-navy text-sm">{{ t.target_name || '—' }}</td>
                <td class="p-4 text-center">
                  <span class="size-7 rounded-lg bg-primary/20 text-navy font-black text-xs inline-flex items-center justify-center">
                    {{ t.target_board || t.board_code || 'A' }}
                  </span>
                </td>
                <td class="p-4 font-black text-navy text-sm">{{ t.archer_name || t.full_name }}</td>
                <td class="p-4 text-slate-600 font-bold">{{ t.club_name || 'Independen' }}</td>
                <td class="p-4 text-slate-500">{{ t.category_name || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { get } = useApi()

const slug = computed(() => route.params.slug as string)
const isLoading = ref(true)
const event = ref<any>(null)
const targets = ref<any[]>([])
const search = ref('')

const filteredTargets = computed(() => {
  if (!search.value) return targets.value
  const q = search.value.toLowerCase()
  return targets.value.filter(t =>
    (t.archer_name || t.full_name || '').toLowerCase().includes(q) ||
    (t.club_name || '').toLowerCase().includes(q) ||
    (t.target_name || '').toLowerCase().includes(q)
  )
})

async function fetchData() {
  isLoading.value = true
  try {
    const eRes = await get(`/events/${slug.value}`)
    event.value = eRes?.event || eRes

    const tRes = await get(`/events/${slug.value}/targets`)
    targets.value = tRes?.targets || tRes?.data || []
  } catch { targets.value = [] }
  finally { isLoading.value = false }
}

onMounted(fetchData)

useHead({
  title: computed(() => `Target Face - ${event.value?.name || 'Event'} - Archeris.net`)
})
</script>