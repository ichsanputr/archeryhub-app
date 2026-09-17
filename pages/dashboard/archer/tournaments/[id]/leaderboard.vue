<template>
  <div class="flex flex-col gap-6 pb-16">
    <!-- Header Banner -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.15);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <div class="relative p-6 sm:p-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Icon icon="ph:ranking-bold" class="text-primary text-2xl" />
            </div>
            <div>
              <nav class="flex text-[10px] font-bold text-white/40 tracking-widest mb-1 items-center gap-1.5">
                <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/overview`" class="hover:text-white transition-colors">
                  {{ t('leaderboard_page.nav_event', 'Event') }}
                </NuxtLink>
                <Icon icon="ph:caret-right-bold" class="text-[9px]" />
                <span class="text-white/70">{{ t('leaderboard_page.title', 'Event Leaderboard') }}</span>
              </nav>
              <h1 class="text-2xl font-black tracking-tight">{{ t('leaderboard_page.title', 'Event Leaderboard') }}</h1>
              <div class="text-xs text-white/60 mt-0.5">{{ t('leaderboard_page.subtitle', 'Live qualification rankings and total scores by category') }}</div>
            </div>
          </div>

          <!-- Category Selector -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <BaseSelect
              v-if="categoryOptions.length > 0"
              v-model="selectedCategoryId"
              :options="categoryOptions"
              item-title="title"
              item-value="value"
              class="w-64 text-xs"
              @update:model-value="fetchLeaderboard"
            />
            <button
              @click="fetchLeaderboard"
              :disabled="isLoading"
              class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-colors flex items-center gap-1.5"
              :title="t('leaderboard_page.refresh', 'Refresh')"
            >
              <Icon icon="ph:arrows-clockwise-bold" class="text-sm" :class="{ 'animate-spin': isLoading }" />
              <span class="hidden sm:inline">{{ t('leaderboard_page.refresh', 'Refresh') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div class="h-44 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
      <div class="h-96 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="leaderboard.length === 0"
      class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm p-12 text-center flex flex-col items-center gap-4 w-full"
    >
      <div class="h-20 w-20 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
        <Icon icon="ph:ranking-light" class="text-4xl text-slate-400" />
      </div>
      <div>
        <div class="text-lg font-black text-navy dark:text-white mb-1">
          {{ t('leaderboard_page.empty_title', 'Belum Ada Skor Kualifikasi') }}
        </div>
        <div class="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
          {{ t('leaderboard_page.empty_desc', 'Skor kualifikasi untuk kategori ini belum diinput oleh panitia atau sedang berlangsung.') }}
        </div>
      </div>
    </div>

    <!-- Content: Podium & Table -->
    <template v-else>
      <!-- Top 3 Podium Summary (if 3 or more) -->
      <div v-if="leaderboard.length >= 3" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 2nd Place -->
        <div class="order-2 md:order-1 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-slate-300"></div>
          <div class="relative size-16 mb-3">
            <img :src="useImageOrDefault(leaderboard[1]?.avatar_url, leaderboard[1]?.archer_name)" class="size-16 rounded-2xl object-cover ring-2 ring-slate-200" />
            <div class="absolute -bottom-2 -right-2 size-7 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shadow">2</div>
          </div>
          <div class="font-black text-sm text-navy dark:text-white truncate max-w-full">{{ leaderboard[1]?.archer_name }}</div>
          <div class="text-[11px] text-slate-400 font-medium truncate max-w-full">{{ leaderboard[1]?.club_name || '-' }}</div>
          <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 w-full flex justify-between items-center text-xs">
            <span class="text-slate-400 font-bold">{{ t('leaderboard_page.col_score', 'Total Skor') }}</span>
            <span class="font-black text-navy dark:text-white text-base">{{ leaderboard[1]?.total_score }}</span>
          </div>
        </div>

        <!-- 1st Place (Gold / Champion) -->
        <div class="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-500/10 dark:via-slate-800 dark:to-slate-800 rounded-3xl p-6 border-2 border-amber-400/50 shadow-md flex flex-col items-center text-center relative overflow-hidden -mt-0 md:-mt-2">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400"></div>
          <div class="flex items-center gap-1 text-amber-500 text-xs font-black capitalize tracking-widest mb-2">
            <Icon icon="ph:crown-fill" class="text-sm" />
            <span>Leader #1</span>
          </div>
          <div class="relative size-20 mb-3">
            <img :src="useImageOrDefault(leaderboard[0]?.avatar_url, leaderboard[0]?.archer_name)" class="size-20 rounded-2xl object-cover ring-4 ring-amber-400/40 shadow-md" />
            <div class="absolute -bottom-2 -right-2 size-8 rounded-xl bg-amber-400 text-navy font-black text-sm flex items-center justify-center shadow-lg">1</div>
          </div>
          <div class="font-black text-base text-navy dark:text-white truncate max-w-full">{{ leaderboard[0]?.archer_name }}</div>
          <div class="text-xs text-slate-400 font-medium truncate max-w-full">{{ leaderboard[0]?.club_name || '-' }}</div>
          <div class="mt-4 pt-3 border-t border-amber-200/50 dark:border-slate-700 w-full flex justify-between items-center text-xs">
            <span class="text-slate-400 font-bold">{{ t('leaderboard_page.stats_summary', { tens: leaderboard[0]?.total_10x || 0, x: leaderboard[0]?.total_x || 0 }) }}</span>
            <span class="font-black text-amber-600 dark:text-amber-400 text-xl">{{ leaderboard[0]?.total_score }}</span>
          </div>
        </div>

        <!-- 3rd Place -->
        <div class="order-3 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-amber-700/50"></div>
          <div class="relative size-16 mb-3">
            <img :src="useImageOrDefault(leaderboard[2]?.avatar_url, leaderboard[2]?.archer_name)" class="size-16 rounded-2xl object-cover ring-2 ring-amber-700/30" />
            <div class="absolute -bottom-2 -right-2 size-7 rounded-lg bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow">3</div>
          </div>
          <div class="font-black text-sm text-navy dark:text-white truncate max-w-full">{{ leaderboard[2]?.archer_name }}</div>
          <div class="text-[11px] text-slate-400 font-medium truncate max-w-full">{{ leaderboard[2]?.club_name || '-' }}</div>
          <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 w-full flex justify-between items-center text-xs">
            <span class="text-slate-400 font-bold">{{ t('leaderboard_page.col_score', 'Total Skor') }}</span>
            <span class="font-black text-navy dark:text-white text-base">{{ leaderboard[2]?.total_score }}</span>
          </div>
        </div>
      </div>

      <!-- Rankings Table -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden w-full">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon icon="ph:list-numbers-bold" class="text-primary text-lg" />
            <span class="font-black text-sm text-navy dark:text-white capitalize tracking-wider">
              {{ t('leaderboard_page.table_title', 'Peringkat Kualifikasi Lengkap') }}
            </span>
          </div>
          <span class="text-xs font-bold text-slate-400">
            {{ leaderboard.length }} {{ t('leaderboard_page.archers_count', 'Peserta') }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-black capitalize text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-700">
                <th class="py-3.5 px-4 text-center w-14">#</th>
                <th class="py-3.5 px-4">{{ t('leaderboard_page.col_archer', 'Archer') }}</th>
                <th class="py-3.5 px-4 text-center hidden md:table-cell">{{ t('leaderboard_page.col_club', 'Klub / Kontingen') }}</th>
                <th class="py-3.5 px-4 text-center hidden sm:table-cell">{{ t('leaderboard_page.col_session', 'Sesi') }}</th>
                <th class="py-3.5 px-4 text-center hidden sm:table-cell">10+X</th>
                <th class="py-3.5 px-4 text-center hidden sm:table-cell">X</th>
                <th class="py-3.5 px-6 text-right font-black">{{ t('leaderboard_page.col_score', 'Total Skor') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
              <tr
                v-for="(item, idx) in leaderboard"
                :key="item.participant_uuid || idx"
                class="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors"
                :class="{
                  'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary font-bold': isMyEntry(item)
                }"
              >
                <!-- Rank -->
                <td class="py-3.5 px-4 text-center">
                  <span
                    class="inline-flex size-6 rounded-lg font-black text-xs items-center justify-center"
                    :class="
                      idx === 0 ? 'bg-amber-400 text-navy shadow-sm' :
                      idx === 1 ? 'bg-slate-200 text-slate-700' :
                      idx === 2 ? 'bg-amber-700/80 text-white' :
                      'text-slate-500'
                    "
                  >
                    {{ idx + 1 }}
                  </span>
                </td>

                <!-- Archer -->
                <td class="py-3.5 px-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      :src="useImageOrDefault(item.avatar_url, item.archer_name)"
                      class="size-9 rounded-xl object-cover shrink-0 ring-1 ring-slate-100 dark:ring-slate-700"
                    />
                    <div class="min-w-0">
                      <div class="font-black text-navy dark:text-white truncate flex items-center gap-1.5">
                        <span>{{ item.archer_name }}</span>
                        <span v-if="isMyEntry(item)" class="px-1.5 py-0.5 rounded bg-primary text-navy text-[9px] font-black tracking-tighter">YOU</span>
                      </div>
                      <div class="text-[10px] text-slate-400 md:hidden truncate">{{ item.club_name || '-' }}</div>
                    </div>
                  </div>
                </td>

                <!-- Club -->
                <td class="py-3.5 px-4 text-center hidden md:table-cell text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                  {{ item.club_name || '-' }}
                </td>

                <!-- Session -->
                <td class="py-3.5 px-4 text-center hidden sm:table-cell text-slate-500 dark:text-slate-400">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold">
                    {{ item.session_name || item.session_code || 'Sesi 1' }}
                  </span>
                </td>

                <!-- 10+X -->
                <td class="py-3.5 px-4 text-center hidden sm:table-cell font-bold text-slate-600 dark:text-slate-300">
                  {{ item.total_10x || 0 }}
                </td>

                <!-- X -->
                <td class="py-3.5 px-4 text-center hidden sm:table-cell font-bold text-slate-600 dark:text-slate-300">
                  {{ item.total_x || 0 }}
                </td>

                <!-- Total Score -->
                <td class="py-3.5 px-6 text-right font-black text-sm md:text-base text-navy dark:text-white tabular-nums">
                  <span :class="{ 'text-primary font-black': idx === 0 }">{{ item.total_score }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
const route = useRoute()
const { $api } = useNuxtApp()
const { user } = useAuth()

const eventId = computed(() => route.params.id as string)

useHead({
  title: computed(() => `${t('leaderboard_page.title', 'Event Leaderboard')} - Archeris Dashboard`)
})

const isLoading = ref(true)
const categories = ref<any[]>([])
const selectedCategoryId = ref('')
const leaderboard = ref<any[]>([])

const categoryOptions = computed(() => {
  return categories.value.map(cat => {
    const title = cat.category_name_custom || `${cat.bow_type || ''} ${cat.age_group || ''} ${cat.gender || ''}`.trim() || 'General Category'
    return {
      title,
      value: cat.uuid || cat.id || cat.category_id
    }
  })
})

function isMyEntry(item: any): boolean {
  if (!user.value) return false
  const myName = user.value.full_name || user.value.name || ''
  const myId = user.value.uuid || user.value.id || ''
  return item.archer_uuid === myId || (myName && item.archer_name?.toLowerCase() === myName.toLowerCase())
}

async function fetchCategories() {
  try {
    const res = await $api(`/tournaments/${eventId.value}/categories`)
    const rawCats = Array.isArray(res) ? res : res?.categories || res?.data || []
    categories.value = rawCats
    if (rawCats.length > 0 && !selectedCategoryId.value) {
      selectedCategoryId.value = rawCats[0].uuid || rawCats[0].id || rawCats[0].category_id
    }
  } catch (err) {
    console.error('Failed to fetch event categories:', err)
  }
}

async function fetchLeaderboard() {
  if (!selectedCategoryId.value) return
  isLoading.value = true
  try {
    const res = await $api(`/tournaments/${eventId.value}/results/qualification`, {
      params: { category_id: selectedCategoryId.value }
    })
    leaderboard.value = res?.leaderboard || []
  } catch (err) {
    console.error('Failed to load leaderboard:', err)
    leaderboard.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchLeaderboard()
})
</script>