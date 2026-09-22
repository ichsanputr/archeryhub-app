<template>
  <div class="flex flex-col gap-6 pb-16 font-body">
    <!-- Header (Standard Dashboard Style) -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>

      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <!-- Header Content -->
      <div class="relative p-6 sm:p-8">
        <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
          <NuxtLink to="/dashboard/archer/tournaments" class="hover:text-white transition-colors">{{ t('my_team.nav_event') }}</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-base" />
          <span class="text-amber-300 font-medium">{{ t('my_team.nav_title') }}</span>
        </div>
        <div class="flex items-start gap-4">
          <div
            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
            <Icon icon="ph:users-three-bold" class="text-white text-2xl" />
          </div>
          <div class="flex-grow">
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">{{ t('my_team.title') }}</h1>
            <div class="text-slate-300 text-sm mt-1">{{ t('my_team.subtitle') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="h-64 bg-white rounded-3xl animate-pulse border border-slate-100" />

    <!-- Empty State: Not In Any Team -->
    <div v-else-if="teamsList.length === 0"
      class="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-8 sm:p-14 text-center w-full flex flex-col items-center justify-center space-y-4">
      <div class="size-20 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 shadow-2xs">
        <Icon icon="ph:users-three-bold" class="text-4xl text-slate-400" />
      </div>
      <div class="space-y-2 max-w-lg mx-auto">
        <h3 class="text-xl font-black text-navy tracking-tight">
          {{ t('my_team.not_in_team_title') }}
        </h3>
        <div class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          {{ t('my_team.not_in_team_desc') }}
        </div>
      </div>
    </div>

    <!-- Teams List -->
    <div v-else class="space-y-6">
      <div
        v-for="(teamItem, tIdx) in teamsList"
        :key="teamItem.uuid || tIdx"
        class="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        
        <!-- Team Left Card: Members & Details -->
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div class="text-xs font-bold text-slate-400 tracking-wider mb-1">
                {{ teamItem.category_name || t('my_team.category_fallback') }}
              </div>
              <h2 class="text-2xl font-black text-navy">{{ teamItem.team_name || teamItem.name || 'Team Roster' }}</h2>
              <div class="text-xs text-slate-500 font-medium mt-0.5">
                {{ t('my_team.club_label') }}: <span class="font-bold text-navy">{{ teamItem.club_name || 'Independent' }}</span>
              </div>
            </div>

            <!-- Share via WhatsApp CTA -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="shareWhatsApp(teamItem)"
                class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer">
                <Icon icon="ph:whatsapp-logo-bold" class="text-base" />
                <span>{{ t('my_team.share_team') }}</span>
              </button>
              <button
                type="button"
                @click="copyTeamLink(teamItem)"
                class="size-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors">
                <Icon icon="ph:copy-bold" class="text-sm" />
              </button>
            </div>
          </div>

          <!-- Members Grid -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-black text-navy text-sm">{{ t('my_team.members_title') }}</h4>
              <span class="text-xs font-bold font-mono text-slate-400">
                {{ t('my_team.members_count', { count: (teamItem.members || []).length }, `${(teamItem.members || []).length} Pemanah`) }}
              </span>
            </div>

            <div class="grid gap-3">
              <div
                v-for="(m, idx) in (teamItem.members || [])"
                :key="m.uuid || idx"
                class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all">
                
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="size-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-2xs"
                    :class="idx === 0 ? 'bg-navy text-primary' : 'bg-slate-200 text-navy'">
                    <Icon v-if="idx === 0" icon="ph:crown-bold" class="text-sm" />
                    <span v-else>{{ idx + 1 }}</span>
                  </div>
                  <div class="min-w-0">
                    <div class="font-black text-navy text-sm truncate flex items-center gap-1.5">
                      <span>{{ m.archer_name || m.full_name || 'Archer' }}</span>
                      <span v-if="idx === 0" class="text-[10px] font-black px-2 py-0.5 rounded-md bg-primary/20 text-navy">
                        {{ t('my_team.captain') }}
                      </span>
                    </div>
                    <div class="text-xs text-slate-400 truncate">{{ m.club_name || teamItem.club_name || t('my_team.independent') }}</div>
                  </div>
                </div>

                <div class="font-mono font-black text-navy text-sm shrink-0 ml-3">
                  {{ m.score || 0 }} {{ t('my_team.pts') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Stats & Status Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h4 class="font-black text-navy text-sm">{{ t('my_team.stats_title') }}</h4>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-2 border-b border-slate-100">
              <span class="text-slate-500 font-bold">{{ t('my_team.total_score') }}</span>
              <span class="font-mono font-black text-navy text-base">{{ teamItem.total_score || 0 }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-100">
              <span class="text-slate-500 font-bold">{{ t('my_team.total_x') }}</span>
              <span class="font-mono font-black text-navy text-base">{{ teamItem.x_count || 0 }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-slate-500 font-bold">{{ t('my_team.rank') }}</span>
              <span class="font-black text-navy text-base">#{{ teamItem.rank || '-' }}</span>
            </div>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-xs font-medium leading-relaxed">
            {{ t('my_team.live_score_note') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const { get } = useApi()

const eventId = computed(() => route.params.id as string)

useHead({
  title: computed(() => `${t('my_team.title')} - Archeris Dashboard`)
})

const isLoading = ref(true)
const rawData = ref<any>(null)

const teamsList = computed(() => {
  if (!rawData.value) return []
  if (Array.isArray(rawData.value.teams)) return rawData.value.teams
  if (Array.isArray(rawData.value)) return rawData.value
  if (rawData.value.team && (rawData.value.team.uuid || rawData.value.team.name)) return [rawData.value.team]
  if (rawData.value.uuid || rawData.value.name) return [rawData.value]
  return []
})

async function fetchMyTeam() {
  isLoading.value = true
  try {
    const res = await get(`/tournaments/${eventId.value}/my-team`)
    rawData.value = res?.data || res
  } catch {
    rawData.value = null
  } finally {
    isLoading.value = false
  }
}

const shareWhatsApp = (teamItem: any) => {
  const teamName = teamItem.team_name || teamItem.name || 'Tim Beregu'
  const categoryName = teamItem.category_name || 'Kategori Beregu'
  const members = (teamItem.members || []).map((m: any, idx: number) => `${idx + 1}. ${m.archer_name || m.full_name}`).join('\n')
  
  const text = `Halo! Anda terdaftar dalam susunan tim:\n\n*${teamName}*\nKategori: ${categoryName}\n\nAnggota Tim:\n${members}\n\nLihat live score dan jadwal pertandingan di Archeris.net:\nhttps://archeris.net/tournaments/${eventId.value}`
  
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

const copyTeamLink = (teamItem: any) => {
  const link = `https://archeris.net/tournaments/${eventId.value}`
  navigator.clipboard?.writeText(link).then(() => {
    toast.success('Tournament link copied to clipboard')
  }).catch(() => {})
}

onMounted(fetchMyTeam)
</script>