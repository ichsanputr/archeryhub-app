<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.2;"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
      <div class="relative p-6 sm:p-8">
        <nav class="flex text-[10px] font-bold text-white/40 tracking-widest mb-2 items-center gap-1.5">
          <NuxtLink :to="`/dashboard/organizer/events/${eventId}/targets`" class="hover:text-white transition-colors">Target Assignments</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[9px]" />
          <span class="text-white/70">{{ t("org_target_map.breadcrumb_map") }}</span>
        </nav>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="h-14 w-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Icon icon="ph:map-pin-bold" class="text-primary text-2xl" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight">{{ t("org_target_map.header_title") }}</h1>
              <div class="text-slate-300 text-sm mt-1">{{ t("org_target_map.header_subtitle") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex flex-wrap gap-4 items-center justify-between shadow-sm">
      <div class="flex items-center gap-3 min-w-64">
        <label class="text-xs font-black text-slate-500 capitalize shrink-0">{{ t("org_target_map.session_label") }}</label>
        <BaseSelect v-model="selectedSession" :options="sessionOptions" item-title="title" item-value="value" :placeholder="t('org_target_map.select_session')" class="w-full" />
      </div>
      <div class="text-xs text-slate-500 font-bold">
        {{ t("org_target_map.grid_view_hint") }}
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="h-96 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />

    <!-- Empty State -->
    <div v-else-if="targetGrid.length === 0" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center text-slate-500">
      {{ t("org_target_map.no_targets") }}
    </div>

    <!-- Target Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="t in targetGrid" :key="t.target_name"
        class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        <!-- Target Header -->
        <div class="bg-navy text-white px-5 py-3 flex items-center justify-between border-b border-primary/20">
          <div class="flex items-center gap-2">
            <Icon icon="ph:target-bold" class="text-primary text-lg" />
            <span class="font-black text-base">Target {{ t.target_name }}</span>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-primary">
            {{ t.assigned_count }}/4 Filled
          </span>
        </div>

        <!-- Position Slots A, B, C, D -->
        <div class="p-4 space-y-2 flex-1">
          <div v-for="pos in ['A', 'B', 'C', 'D']" :key="pos"
            class="flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-colors"
            :class="t.positions[pos] ? 'bg-primary/5 border-primary/30' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-100 dark:border-slate-700/50'">
            <div class="size-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0"
              :class="t.positions[pos] ? 'bg-primary text-navy' : 'bg-slate-200 dark:bg-slate-600 text-slate-500'">
              {{ pos }}
            </div>
            <div class="min-w-0 flex-1">
              <div v-if="t.positions[pos]" class="font-black text-navy dark:text-white truncate">
                {{ t.positions[pos].archer_name || t.positions[pos].full_name }}
              </div>
              <div v-if="t.positions[pos]" class="text-[10px] text-slate-500 truncate">
                {{ t.positions[pos].club_name || 'Independen' }}
              </div>
              <div v-else class="text-slate-400 italic text-[11px]">{{ t("org_target_map.empty_slot") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const { get } = useApi()

const eventId = computed(() => route.params.id as string)

useHead({
  title: computed(() => (t ? t('org_targets.map_title', 'Peta Target Bantalan') : 'Peta Target Bantalan') + ' - Archeris Dashboard')
})
const isLoading = ref(false)
const sessions = ref<any[]>([])
const selectedSession = ref('')
const rawAssignments = ref<any[]>([])

const sessionOptions = computed(() =>
  sessions.value.map(s => ({ title: s.name || `Session ${s.session_order}`, value: s.uuid || s.id }))
)

const targetGrid = computed(() => {
  const map: Record<string, any> = {}
  for (const a of rawAssignments.value) {
    const tName = a.target_name || 'TBD'
    if (!map[tName]) {
      map[tName] = { target_name: tName, assigned_count: 0, positions: { A: null, B: null, C: null, D: null } }
    }
    const board = (a.target_board || a.board_code || 'A').toUpperCase()
    map[tName].positions[board] = a
    map[tName].assigned_count++
  }
  return Object.values(map)
})

async function fetchSessions() {
  try {
    const res = await get(`/events/${eventId.value}/qualification/sessions`)
    sessions.value = res?.sessions || res?.data || []
    if (sessions.value.length > 0) {
      selectedSession.value = sessions.value[0].uuid || sessions.value[0].id
    }
  } catch { sessions.value = [] }
}

async function fetchAssignments() {
  if (!selectedSession.value) return
  isLoading.value = true
  try {
    const res = await get(`/qualification/sessions/${selectedSession.value}/assignments`)
    rawAssignments.value = res?.assignments || res?.data || []
  } catch { rawAssignments.value = [] }
  finally { isLoading.value = false }
}

watch(selectedSession, fetchAssignments)

onMounted(async () => {
  await fetchSessions()
})

definePageMeta({ layout: 'dashboard' })
</script>