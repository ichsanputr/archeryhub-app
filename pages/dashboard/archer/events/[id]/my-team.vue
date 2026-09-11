<template>
  <div class="flex flex-col gap-6 pb-16">
    <!-- Header (Standard Dashboard Style) -->
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
          <NuxtLink to="/dashboard/archer/events" class="hover:text-white transition-colors">{{ t('my_team.nav_event', 'Event Saya') }}</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-base" />
          <span class="text-primary font-medium">{{ t('my_team.nav_title', 'Tim & Beregu') }}</span>
        </div>
        <div class="flex items-start gap-4">
          <!-- Icon Badge -->
          <div
            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
            <Icon icon="ph:users-three-bold" class="text-primary text-2xl" />
          </div>
          <div class="flex-grow">
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">{{ t('my_team.title', 'Tim & Beregu') }}</h1>
            <div class="text-slate-300 text-sm mt-1">{{ t('my_team.subtitle', 'Informasi anggota tim beregu dan status pembagian regu Anda.') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="h-64 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />

    <!-- Empty State: Not In Any Team -->
    <div v-else-if="!team"
      class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs p-8 sm:p-14 text-center w-full flex flex-col items-center justify-center space-y-6">
      <div class="size-20 rounded-3xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600 flex items-center justify-center text-slate-400 shadow-2xs">
        <Icon icon="ph:users-three-bold" class="text-4xl text-slate-400" />
      </div>
      <div class="space-y-2 max-w-lg mx-auto">
        <h3 class="text-xl font-black text-navy dark:text-white tracking-tight">
          {{ t('my_team.not_in_team_title', 'Belum Terdaftar di Tim') }}
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {{ t('my_team.not_in_team_desc', 'Anda terdaftar pada kategori individu atau belum dimasukkan ke dalam susunan regu/tim oleh ofisial klub maupun panitia pertandingan.') }}
        </p>
      </div>
      <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink :to="`/dashboard/archer/events/${eventId}/overview`">
          <BaseButton variant="primary" icon="ph:arrow-left-bold" class="font-bold text-xs h-11 px-6 shadow-sm shadow-primary/20">
            {{ t('my_team.btn_overview', 'Kembali ke Ringkasan Event') }}
          </BaseButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Team Info -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div class="text-xs font-bold text-slate-400 capitalize tracking-wider mb-1">{{ team.category_name || t('my_team.category_fallback', 'Kategori Beregu') }}</div>
            <h2 class="text-2xl font-black text-navy dark:text-white">{{ team.name || t('my_team.team_name_fallback', 'Nama Tim') }}</h2>
          </div>
          <span class="px-3 py-1 bg-primary/20 text-navy dark:text-primary font-black text-xs rounded-full">
            {{ t('my_team.club_label', 'Klub') }}: {{ team.club_name || t('my_team.independent', 'Independen') }}
          </span>
        </div>

        <div class="space-y-4">
          <h4 class="font-black text-navy dark:text-white text-sm">{{ t('my_team.members_title', 'Anggota Tim') }}</h4>
          <div class="grid gap-3">
            <div v-for="(m, idx) in (team.members || [])" :key="m.uuid || idx" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
              <div class="flex items-center gap-3">
                <div class="size-8 rounded-full bg-primary/20 text-navy dark:text-white font-black text-xs flex items-center justify-center">
                  {{ idx + 1 }}
                </div>
                <div>
                  <div class="font-black text-navy dark:text-white text-sm">{{ m.archer_name || m.full_name }}</div>
                  <div class="text-xs text-slate-500">{{ m.club_name || '' }}</div>
                </div>
              </div>
              <div class="font-mono font-black text-primary text-sm">
                {{ m.score || 0 }} {{ t('my_team.pts', 'Poin') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Stats -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <h4 class="font-black text-navy dark:text-white text-sm">{{ t('my_team.stats_title', 'Team Statistics') }}</h4>
        <div class="space-y-3 text-xs">
          <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
            <span class="text-slate-500 font-bold">{{ t('my_team.total_score', 'Total Team Score') }}</span>
            <span class="font-mono font-black text-navy dark:text-white text-base">{{ team.total_score || 0 }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
            <span class="text-slate-500 font-bold">{{ t('my_team.total_x', 'Total X Count') }}</span>
            <span class="font-mono font-black text-navy dark:text-white text-base">{{ team.x_count || 0 }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-slate-500 font-bold">{{ t('my_team.rank', 'Team Rank') }}</span>
            <span class="font-black text-primary text-base">#{{ team.rank || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
const route = useRoute()
const { get } = useApi()

const eventId = computed(() => route.params.id as string)

useHead({
  title: computed(() => `${t('my_team.title', 'My Team & Squad')} - Archeris Dashboard`)
})

const isLoading = ref(true)
const team = ref<any>(null)

async function fetchMyTeam() {
  isLoading.value = true
  try {
    const res = await get(`/events/${eventId.value}/my-team`)
    const rawTeam = res?.team !== undefined ? res.team : (res?.data || res)
    if (rawTeam && (rawTeam.uuid || rawTeam.name)) {
      team.value = rawTeam
    } else {
      team.value = null
    }
  } catch {
    team.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchMyTeam)
</script>