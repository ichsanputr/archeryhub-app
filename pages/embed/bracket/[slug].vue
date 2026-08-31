<template>
  <div class="min-h-screen bg-slate-900 text-white font-sans p-4 antialiased overflow-auto">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:bracket" class="text-primary text-xl" />
        <span class="font-black text-sm text-white">{{ tournamentName || 'Elimination Bracket' }}</span>
      </div>
      <div v-if="categories.length > 0" class="flex gap-2 overflow-x-auto text-xs">
        <button v-for="c in categories" :key="c.uuid || c.id"
          @click="selectedCategory = c.uuid || c.id"
          class="px-3 py-1 rounded-full font-bold transition-colors"
          :class="(selectedCategory === (c.uuid || c.id)) ? 'bg-primary text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'">
          {{ c.name || c.category_name }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20 text-slate-500 font-bold text-sm">
      <Icon icon="ph:spinner-gap-bold" class="animate-spin text-2xl mr-2 text-primary" /> Memuat Bracket...
    </div>

    <!-- Empty -->
    <div v-else-if="!bracket || !bracket.rounds || bracket.rounds.length === 0" class="text-center py-20 text-slate-500 text-sm">
      Bracket eliminasi belum tersedia untuk kategori ini.
    </div>

    <!-- Bracket Display -->
    <div v-else class="overflow-x-auto">
      <div class="flex gap-4 min-w-max items-stretch">
        <div v-for="(round, rIdx) in bracket.rounds" :key="rIdx" class="flex flex-col justify-around gap-3 min-w-[180px]">
          <div class="text-center text-[10px] font-black text-slate-500 capitalize tracking-widest">{{ round.name || `Round ${rIdx + 1}` }}</div>
          <div v-for="(m, mIdx) in round.matches" :key="mIdx" class="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden text-xs">
            <div class="px-3 py-1.5 flex items-center justify-between border-b border-slate-700/50" :class="m.winner_id === m.archer1_id && m.winner_id ? 'bg-primary/20 text-primary font-black' : 'text-slate-300'">
              <span class="truncate max-w-[120px]">{{ m.archer1_name || 'BYE' }}</span>
              <span class="font-mono font-bold">{{ m.score1 ?? '' }}</span>
            </div>
            <div class="px-3 py-1.5 flex items-center justify-between" :class="m.winner_id === m.archer2_id && m.winner_id ? 'bg-primary/20 text-primary font-black' : 'text-slate-300'">
              <span class="truncate max-w-[120px]">{{ m.archer2_name || 'BYE' }}</span>
              <span class="font-mono font-bold">{{ m.score2 ?? '' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { get } = useApi()

const slug = computed(() => route.params.slug as string)
const isLoading = ref(true)
const tournamentName = ref('')
const categories = ref<any[]>([])
const selectedCategory = ref('')
const bracket = ref<any>(null)

async function fetchCategories() {
  try {
    const res = await get(`/events/${slug.value}/categories`)
    categories.value = res?.data || res?.categories || []
    if (categories.value.length > 0) {
      selectedCategory.value = categories.value[0].uuid || categories.value[0].id
    }
  } catch { categories.value = [] }
}

async function fetchBracket() {
  if (!selectedCategory.value) return
  isLoading.value = true
  try {
    const res = await get(`/events/${slug.value}/results/elimination?category_id=${selectedCategory.value}`)
    bracket.value = res?.bracket || res
  } catch { bracket.value = null }
  finally { isLoading.value = false }
}

watch(selectedCategory, fetchBracket)

onMounted(async () => {
  try {
    const eRes = await get(`/events/${slug.value}`)
    tournamentName.value = eRes?.event?.name || eRes?.name || ''
  } catch {}
  await fetchCategories()
})

definePageMeta({ layout: false })

useHead({
  title: 'Bracket Embed Widget - Archeris.net',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>