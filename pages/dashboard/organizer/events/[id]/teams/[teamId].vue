<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.2;"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
      <div class="relative p-6 sm:p-8">
        <nav class="flex text-[10px] font-bold text-white/40 tracking-widest mb-2 items-center gap-1.5">
          <NuxtLink :to="`/dashboard/organizer/events/${eventId}/teams`" class="hover:text-white transition-colors">Teams</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[9px]" />
          <span class="text-white/70">Detail Tim</span>
        </nav>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Icon icon="ph:users-four-bold" class="text-primary text-2xl" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight">{{ team?.name || 'Detail Tim' }}</h1>
              <div class="text-slate-300 text-sm mt-1">{{ team?.category_name || 'Kategori Beregu' }} • {{ team?.club_name || 'Klub' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="h-80 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />

    <!-- Team Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Members Card -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <h3 class="font-black text-navy dark:text-white text-lg">{{ t("org_team_detail.team_members") }}</h3>
          <div v-if="!team?.members || team.members.length === 0" class="text-slate-500 text-sm py-4">
            {{ t("org_team_detail.no_members") }}
          </div>
          <div v-else class="grid gap-3">
            <div v-for="(m, idx) in team.members" :key="m.uuid || idx" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
              <div class="flex items-center gap-3">
                <div class="size-8 rounded-full bg-primary/20 text-navy font-black text-xs flex items-center justify-center">
                  {{ idx + 1 }}
                </div>
                <div>
                  <div class="font-black text-navy dark:text-white text-sm">{{ m.archer_name || m.full_name }}</div>
                  <div class="text-xs text-slate-500">{{ m.gender || '' }} • ID: {{ m.athlete_code || m.uuid }}</div>
                </div>
              </div>
              <div class="font-mono font-black text-primary text-sm">
                Skor: {{ m.score || 0 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Sidebar -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <h4 class="font-black text-navy dark:text-white text-sm">Ringkasan Tim</h4>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span class="text-slate-500 font-bold">{{ t("org_team_detail.total_team_score") }}</span>
              <span class="font-mono font-black text-navy dark:text-white text-sm">{{ team?.total_score || 0 }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span class="text-slate-500 font-bold">{{ t("org_team_detail.total_x_count") }}</span>
              <span class="font-mono font-black text-navy dark:text-white text-sm">{{ team?.x_count || 0 }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-slate-500 font-bold">Peringkat Kualifikasi Beregu</span>
              <span class="font-black text-primary text-sm">#{{ team?.rank || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { get } = useApi()

const eventId = computed(() => route.params.id as string)
const teamId = computed(() => route.params.teamId as string)

const isLoading = ref(true)
const team = ref<any>(null)

async function fetchTeam() {
  isLoading.value = true
  try {
    const res = await get(`/events/${eventId.value}/teams/${teamId.value}`)
    team.value = res?.team || res?.data || res
  } catch { team.value = null }
  finally { isLoading.value = false }
}

onMounted(fetchTeam)

definePageMeta({ layout: 'dashboard' })
</script>