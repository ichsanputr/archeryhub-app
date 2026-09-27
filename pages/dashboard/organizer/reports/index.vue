<template>
  <div class="space-y-6 md:space-y-8 pb-12 font-body text-navy antialiased">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('dashboard.reports.title', 'Laporan & Analisis')"
      subtitle="Pilih turnamen di bawah untuk melihat laporan komprehensif demografi peserta, pendapatan, kuota, dan presensi."
      icon="ph:chart-bar-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('dashboard.reports.title', 'Laporan & Analisis') }
      ]"
    />

    <!-- Quick Search & Tournament List -->
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div class="relative flex-1 min-w-[240px] max-w-md">
          <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari turnamen..."
            class="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-4 py-2.5 text-xs text-navy placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs font-medium"
          />
        </div>

        <div class="text-xs font-bold text-slate-500">
          Total: <span class="text-navy font-black">{{ filteredTournaments.length }}</span> Turnamen
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 3" :key="i" class="h-44 bg-white rounded-2xl animate-pulse border border-slate-200/80"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredTournaments.length === 0" class="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-3">
        <div class="size-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
          <Icon icon="ph:trophy-bold" />
        </div>
        <div class="space-y-1">
          <h3 class="text-sm font-black text-navy">Turnamen Tidak Ditemukan</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            {{ searchQuery ? 'Tidak ada turnamen yang cocok dengan pencarian Anda.' : 'Anda belum memiliki turnamen. Buat turnamen baru untuk mulai melihat laporan.' }}
          </p>
        </div>
        <BaseButton
          v-if="!searchQuery"
          to="/dashboard/organizer/tournaments/create"
          variant="primary"
          class="text-xs font-black px-4 py-2"
        >
          Buat Turnamen Baru
        </BaseButton>
      </div>

      <!-- Tournaments Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="tournament in filteredTournaments"
          :key="tournament.id || tournament.uuid"
          class="bg-white border border-slate-200/90 hover:border-primary/40 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center font-black text-sm shrink-0">
                <Icon icon="ph:trophy-bold" />
              </div>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase"
                :class="[
                  tournament.status === 'published'
                    ? 'bg-emerald-100 text-emerald-800'
                    : tournament.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                ]"
              >
                {{ tournament.status || 'Draft' }}
              </span>
            </div>

            <div>
              <h3 class="font-black text-navy text-sm line-clamp-1">
                {{ tournament.name }}
              </h3>
              <p class="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                {{ tournament.venue || tournament.location || 'Venue Belum Ditentukan' }}
              </p>
            </div>

            <!-- Quick Metrics -->
            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div class="p-2.5 rounded-xl bg-slate-50">
                <div class="text-[10px] text-slate-400 font-bold uppercase">Peserta</div>
                <div class="font-black text-navy mt-0.5">{{ tournament.participant_count || 0 }} Atlet</div>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50">
                <div class="text-[10px] text-slate-400 font-bold uppercase">Kategori</div>
                <div class="font-black text-navy mt-0.5">{{ tournament.event_count || 0 }} Kategori</div>
              </div>
            </div>
          </div>

          <!-- Open Tournament Report Button -->
          <NuxtLink
            :to="`/dashboard/organizer/tournaments/${tournament.slug || tournament.uuid || tournament.id}/reports`"
            class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-navy text-primary font-black text-xs hover:bg-slate-900 transition-all shadow-2xs group cursor-pointer"
          >
            <span>Buka Laporan Turnamen</span>
            <Icon icon="ph:arrow-right-bold" class="text-xs group-hover:translate-x-0.5 transition-transform" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import BaseButton from '~/components/common/BaseButton.vue'

definePageMeta({
  layout: 'dashboard'
})

const api = useApi()
const { t } = useDashboardI18n()

useHead({
  title: computed(() => `${t('dashboard.reports.title', 'Laporan & Analisis')} - Archeris Dashboard`)
})

const isLoading = ref(true)
const searchQuery = ref('')
const tournaments = ref<any[]>([])

const filteredTournaments = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return tournaments.value
  return tournaments.value.filter((item) => {
    const name = (item.name || '').toLowerCase()
    const code = (item.code || '').toLowerCase()
    const venue = (item.venue || '').toLowerCase()
    return name.includes(query) || code.includes(query) || venue.includes(query)
  })
})

const fetchTournaments = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/tournaments/my?limit=100')
    const list = res?.tournaments || res?.events || (Array.isArray(res) ? res : [])
    tournaments.value = list
  } catch (err) {
    console.error('Failed to load tournaments:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTournaments()
})
</script>
