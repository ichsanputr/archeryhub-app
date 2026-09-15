<template>
  <div class="flex flex-col gap-6 md:gap-8 pb-16">
    <!-- Header Banner (Standard Dashboard Style) -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Theme Motif Pattern -->
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>

      <!-- Decorative Background Elements -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <!-- Header Content -->
      <div class="relative p-6 sm:p-8">
        <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
          <NuxtLink to="/dashboard/archer/tournaments" class="hover:text-white transition-colors">{{ t('my_target.nav_event', 'Event Saya') }}</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-base" />
          <span class="text-primary font-medium">{{ t('my_target.nav_title', 'Target & Jadwal') }}</span>
        </div>
        <div class="flex items-start gap-4">
          <!-- Icon Badge -->
          <div
            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
            <Icon icon="ph:crosshair-bold" class="text-primary text-2xl" />
          </div>
          <div class="flex-grow">
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              {{ t('my_target.title', 'Target & Jadwal Penembakan') }}
            </h1>
            <div class="text-slate-300 text-sm mt-1">
              {{ t('my_target.subtitle', 'Informasi nomor bantalan, posisi target, dan waktu sesi kualifikasi Anda.') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="h-64 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-xs" />
        <div class="h-44 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-xs" />
      </div>
      <div class="h-96 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-xs" />
    </div>

    <!-- Empty State: Not Yet Assigned -->
    <div v-else-if="targets.length === 0"
      class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
      <div class="size-20 bg-slate-50 dark:bg-slate-700/50 rounded-3xl flex items-center justify-center mx-auto text-slate-300 border border-slate-100 dark:border-slate-700">
        <Icon icon="ph:crosshair-bold" class="text-4xl text-slate-400" />
      </div>
      <div class="space-y-2">
        <h3 class="text-xl font-black text-navy dark:text-white tracking-tight">
          {{ t('my_target.not_assigned_title', 'Bantalan Belum Diatur') }}
        </h3>
        <div class="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
          {{ t('my_target.not_assigned_desc', 'Panitia penyelenggara belum mengalokasikan nomor bantalan untuk kategori ini. Pengaturan target umumnya diterbitkan setelah penutupan pendaftaran.') }}
        </div>
      </div>
      <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-registration`"
          class="inline-flex items-center gap-2 px-6 py-3 bg-navy hover:bg-navy/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
          <Icon icon="ph:clipboard-text-bold" class="text-primary text-base" />
          <span>{{ t('my_target.check_registration', 'Lihat Detail Pendaftaran') }}</span>
        </NuxtLink>
        <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/overview`"
          class="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold rounded-xl transition-all">
          <Icon icon="ph:house-bold" class="text-base" />
          <span>Overview</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Target Cards & Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      
      <!-- Left Column: Target Cards & Features -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Target Cards Loop -->
        <div v-for="(target, idx) in targets" :key="target.session_id || idx"
          class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden relative">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-navy to-primary"></div>

          <!-- Session Header Strip -->
          <div class="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-xl bg-primary/10 text-navy font-black flex items-center justify-center text-xs border border-primary/20">
                {{ target.session_order || `S${idx + 1}` }}
              </div>
              <div>
                <div class="font-black text-navy dark:text-white text-sm">
                  {{ target.session_name || t('my_target.session_label', 'Sesi Pertandingan') }}
                </div>
                <div class="text-xs text-slate-500 font-medium">
                  {{ target.category_name || participant?.club_name || t('my_target.default_category') }}
                </div>
              </div>
            </div>

            <!-- Session Time Pill -->
            <div v-if="target.start_time"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-navy dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-xl shadow-2xs">
              <Icon icon="ph:clock-bold" class="text-primary text-sm" />
              <span>{{ formatTime(target.start_time) }}<template v-if="target.end_time"> – {{ formatTime(target.end_time) }}</template></span>
            </div>
          </div>

          <!-- Card Body: Visual Target Showcase -->
          <div class="p-6 sm:p-8 space-y-6">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              
              <!-- Target Number Big Badge Visual -->
              <div class="shrink-0 size-32 sm:size-36 rounded-3xl bg-gradient-to-br from-navy via-navy to-navy/90 text-white p-4 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden border border-primary/30">
                <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.15;"></div>
                <div class="relative z-10 space-y-1">
                  <span class="text-[10px] font-bold text-primary block">{{ t("my_target.target_badge", "Target") }}</span>
                  <div class="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight font-mono">
                    {{ (target.target_name || '1').replace(/^Target\s*/i, '') }}{{ (target.target_board || 'A').toUpperCase() }}
                  </div>
                  <div class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-lg bg-primary text-navy font-bold text-[11px] shadow-2xs">
                    {{ target.target_name ? `Bantalan ${target.target_name.replace(/^Target\s*/i, '')}` : 'Bantalan 01' }}
                  </div>
                </div>
              </div>

              <!-- Target Attributes Grid -->
              <div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <!-- Target Number -->
                <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-600/50">
                  <div class="text-slate-400 font-bold mb-1">{{ t('my_target.target_label', 'Nomor Bantalan') }}</div>
                  <div class="font-black text-navy dark:text-white text-base font-mono">
                    {{ target.target_name || t('my_target.not_set', 'Belum diatur') }}
                  </div>
                </div>

                <!-- Position / Board -->
                <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-600/50">
                  <div class="text-slate-400 font-bold mb-1">{{ t('my_target.board_label', 'Posisi Pemanah') }}</div>
                  <div class="font-black text-navy dark:text-white text-base flex items-center gap-1.5 font-mono">
                    <span>Posisi {{ (target.target_board || 'A').toUpperCase() }}</span>
                  </div>
                </div>

                <!-- Category -->
                <div class="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-600/50 sm:col-span-2">
                  <div class="text-slate-400 font-bold mb-1">{{ t('my_target.category_label', 'Kategori & Divisi') }}</div>
                  <div class="font-bold text-navy dark:text-white text-sm">
                    {{ target.category_name || primaryCategory?.category_name || t('my_target.default_category') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Whistle Protocol & Venue Info -->
      <div class="space-y-6">

        <!-- Whistle & Shooting Line Protocol Card -->
        <div class="bg-gradient-to-br from-navy to-navy/95 text-white rounded-3xl p-6 shadow-sm space-y-5 border border-white/10">
          <div class="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 class="text-sm font-black flex items-center gap-2">
              <Icon icon="ph:megaphone-simple-bold" class="text-primary text-lg" />
              <span>{{ t('my_target.rules_title', 'Protokol Garis Tembak') }}</span>
            </h4>
            <span class="text-[10px] font-black text-primary px-2 py-0.5 rounded-md bg-white/10 capitalize">WA RULES</span>
          </div>

          <div class="space-y-3.5 text-xs">
            <div class="flex items-start gap-3">
              <div class="size-7 rounded-xl bg-white/10 text-primary font-black flex items-center justify-center shrink-0 border border-white/10">
                2x
              </div>
              <div>
                <div class="font-bold text-white">{{ t('my_target.whistle_2', '2 Peluit: Menuju garis tembak') }}</div>
                <div class="text-[11px] text-slate-300">{{ t("my_target.whistle_2_desc") }}</div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="size-7 rounded-xl bg-primary text-navy font-black flex items-center justify-center shrink-0">
                1x
              </div>
              <div>
                <div class="font-bold text-white">{{ t('my_target.whistle_1', '1 Peluit: Mulai menembak') }}</div>
                <div class="text-[11px] text-slate-300">{{ t("my_target.whistle_1_desc") }}</div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="size-7 rounded-xl bg-white/10 text-primary font-black flex items-center justify-center shrink-0 border border-white/10">
                3x
              </div>
              <div>
                <div class="font-bold text-white">{{ t('my_target.whistle_3', '3 Peluit: Mengambil anak panah & scoring') }}</div>
                <div class="text-[11px] text-slate-300">Maju ke sasaran bersama untuk mencatat skor & cabut panah.</div>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="size-7 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center shrink-0 shadow-sm">
                5+
              </div>
              <div>
                <div class="font-bold text-rose-300">{{ t('my_target.whistle_5', '5+ Peluit: STOP DARURAT') }}</div>
                <div class="text-[11px] text-slate-300">Segera turunkan busur dan amankan anak panah.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Venue & Event Card -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <h4 class="text-sm font-black text-navy dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Icon icon="ph:map-pin-bold" class="text-primary text-lg" />
            <span>{{ t('my_target.venue_title', 'Lokasi & Informasi') }}</span>
          </h4>

          <div class="space-y-3.5 text-xs">
            <div>
              <span class="text-slate-400 font-bold block mb-0.5">Venue Pertandingan</span>
              <span class="font-black text-navy dark:text-white leading-relaxed block">{{ event?.venue || '-' }}</span>
              <span class="text-slate-500 block mt-0.5">{{ event?.location || '' }}</span>
            </div>

            <div>
              <span class="text-slate-400 font-bold block mb-0.5">Tanggal Event</span>
              <span class="font-bold text-navy dark:text-white">{{ formatDateRange(event?.start_date, event?.end_date) }}</span>
            </div>

            <div v-if="event?.technical_guidebook_url" class="pt-2">
              <a :href="event.technical_guidebook_url" target="_blank"
                class="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-xl transition-colors">
                <Icon icon="ph:file-pdf-bold" class="text-base text-red-500" />
                <span>Unduh Petunjuk Teknis (THB)</span>
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
const route = useRoute()
const { get } = useApi()

const eventId = computed(() => route.params.id as string)

useHead({ 
  title: computed(() => (t('my_target.title', 'Target & Jadwal Penembakan')) + ' - Archeris Dashboard') 
})

const isLoading = ref(true)
const event = ref<any>(null)
const participant = ref<any>(null)
const targets = ref<any[]>([])

const primaryCategory = computed(() => {
  if (participant.value?.categories && participant.value.categories.length > 0) {
    return participant.value.categories[0]
  }
  return null
})

function formatWaveLabel(boardStr: string | null | undefined): string {
  if (!boardStr) return t('my_target.not_set', 'Belum diatur')
  const b = boardStr.trim().toUpperCase()
  if (b === 'A') return t('my_target.wave_a', 'Posisi A (Gelombang 1)')
  if (b === 'B') return t('my_target.wave_b', 'Posisi B (Gelombang 2)')
  if (b === 'C') return t('my_target.wave_c', 'Posisi C (Gelombang 1)')
  if (b === 'D') return t('my_target.wave_d', 'Posisi D (Gelombang 2)')
  return `Posisi ${b}`
}

function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return ''
  if (timeStr.includes('T')) {
    return new Date(timeStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
  return timeStr.substring(0, 5)
}

function formatDateRange(start: string | null | undefined, end: string | null | undefined): string {
  if (!start && !end) return '-'
  try {
    const s = start ? new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
    const e = end ? new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
    if (s && e && s !== e) return `${s} - ${e}`
    return s || e
  } catch {
    return `${start || ''} - ${end || ''}`
  }
}

async function fetchInitialData() {
  isLoading.value = true
  try {
    const [eventRes, participantRes, targetRes] = await Promise.allSettled([
      get<any>(`/tournaments/${eventId.value}`),
      get<any>(`/tournaments/${eventId.value}/participants/me`),
      get<any>(`/tournaments/${eventId.value}/my-target`)
    ])

    if (eventRes.status === 'fulfilled') {
      event.value = eventRes.value?.data || eventRes.value
    }

    if (participantRes.status === 'fulfilled') {
      participant.value = participantRes.value?.data || participantRes.value
    }

    if (targetRes.status === 'fulfilled') {
      const resData = targetRes.value?.data || targetRes.value
      if (resData?.targets && resData.targets.length > 0) {
        targets.value = resData.targets
      }
    }

    // Fallback: check participant registration for assigned target if targets is empty
    if (targets.value.length === 0 && participant.value?.categories?.length > 0) {
      const catsWithTarget = participant.value.categories.filter((c: any) => c.target_name || c.division_name)
      if (catsWithTarget.length > 0) {
        targets.value = catsWithTarget.map((c: any, idx: number) => ({
          session_id: c.id || `session-${idx}`,
          session_name: c.event_type_name || 'Sesi Kualifikasi',
          session_order: `S${idx + 1}`,
          target_name: c.target_name || 'Target 01',
          target_board: participant.value.athlete_code ? participant.value.athlete_code.slice(-1) : 'A',
          category_name: `${c.division_name || ''} - ${c.category_name || ''}`.replace(/^ - | - $/g, '')
        }))
      }
    }
  } catch (err) {
    console.error('Failed to load target data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchInitialData)
</script>