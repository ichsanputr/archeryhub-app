<template>
  <div class="pb-20">
    <!-- Breadcrumbs & Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-white tracking-tight">Categories & Distances</h1>
        <p class="text-brand-gold mt-1">Define who competes and what targets they shoot.</p>
      </div>

      <!-- Progress Stepper -->
      <div class="flex items-center gap-2 bg-surface-dark p-2 rounded-lg border border-brand-border shadow-sm">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-500">
          <span class="material-symbols-outlined text-[20px]">check_circle</span>
          <span class="text-sm font-medium hidden sm:block">Details</span>
        </div>
        <div class="w-8 h-[1px] bg-gray-600"></div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-navy text-primary">
          <span class="material-symbols-outlined text-[20px]">target</span>
          <span class="text-sm font-bold hidden sm:block">Categories</span>
        </div>
        <div class="w-8 h-[1px] bg-gray-600"></div>
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-md text-gray-500">
          <span class="material-symbols-outlined text-[20px]">calendar_month</span>
          <span class="text-sm font-medium hidden sm:block">Schedule</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Generator & List -->
      <div class="lg:col-span-8 flex flex-col gap-6">
        <!-- Category Generator Card -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">add_circle</span>
              New Category
            </h3>
            <button class="text-sm text-primary hover:text-yellow-400 font-medium flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">download</span>
              Load WA Defaults
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <BaseSelect v-model="newCategory.bowStyle" :items="bowOptions" label="Bow Style"
              placeholder="Select Style" />
            <BaseSelect v-model="newCategory.ageClass" :items="ageOptions" label="Age Class" placeholder="Select Age" />
            <BaseSelect v-model="newCategory.gender" :items="genderOptions" label="Gender"
              placeholder="Select Gender" />
          </div>

          <button @click="addCategory" class="btn-primary flex items-center gap-2">
            <span class="material-symbols-outlined">playlist_add</span>
            Add To List
          </button>
        </div>

        <!-- Configured Categories List -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white pl-1">Configured Categories</h3>
            <div class="flex gap-2">
              <button
                class="text-brand-gold hover:text-primary text-sm font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5">
                <span class="material-symbols-outlined text-[18px]">delete_sweep</span>
                Clear All
              </button>
            </div>
          </div>

          <!-- Category Items -->
          <div v-for="(category, index) in categories" :key="index"
            class="card border-l-4 border-l-primary hover:shadow-lg transition-all">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-start gap-4 flex-1">
                <div class="bg-primary/10 p-2 rounded-lg text-primary hidden sm:block">
                  <span class="material-symbols-outlined">person</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="text-base font-bold text-white">{{ category.name }}</h4>
                    <span :class="category.status === 'ready' ? 'badge-success' : 'badge-warning'">
                      {{ category.status }}
                    </span>
                  </div>
                  <p class="text-sm text-brand-gold">{{ category.round }}</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <div v-if="category.distance"
                  class="flex items-center gap-2 bg-surface-dark px-3 py-2 rounded border border-brand-border">
                  <span class="material-symbols-outlined text-gray-400 text-[18px]">straighten</span>
                  <span class="text-sm font-semibold text-white">{{ category.distance }}m</span>
                </div>
                <div v-if="category.targetFace"
                  class="flex items-center gap-2 bg-surface-dark px-3 py-2 rounded border border-brand-border">
                  <span class="material-symbols-outlined text-gray-400 text-[18px]">adjust</span>
                  <span class="text-sm font-semibold text-white">{{ category.targetFace }}</span>
                </div>
                <div class="w-[1px] h-8 bg-brand-border mx-1"></div>
                <button class="text-gray-400 hover:text-primary transition-colors">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button @click="removeCategory(index)" class="text-gray-400 hover:text-red-500 transition-colors">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="categories.length === 0" class="text-center py-8 text-brand-gold">
            <span class="material-symbols-outlined text-4xl mb-2 block opacity-50">target</span>
            No categories configured yet
          </div>
        </div>
      </div>

      <!-- Right Column: Summary -->
      <div class="lg:col-span-4">
        <div class="sticky top-6 flex flex-col gap-6">
          <!-- Summary Card -->
          <div class="card">
            <div class="bg-surface-dark/50 px-6 py-4 -mx-6 -mt-6 border-b border-brand-border mb-6">
              <h3 class="font-bold text-white">Competition Summary</h3>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-brand-gold text-sm">Total Categories</span>
              <span class="text-2xl font-black text-white">{{ categories.length }}</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2 mb-6">
              <div class="bg-primary h-2 rounded-full" :style="`width: ${completionPercentage}%`"></div>
            </div>

            <div v-if="categories.length > 0" class="space-y-4">
              <div v-for="(stat, index) in categoryStats" :key="index" class="flex items-center gap-3">
                <div :class="stat.colorClass" class="size-8 rounded flex items-center justify-center font-bold text-xs">
                  {{ stat.label }}
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-white">{{ stat.name }}</div>
                  <div class="text-xs text-brand-gold">{{ stat.count }} Categories</div>
                </div>
                <span v-if="stat.pending" class="badge-warning">Pending</span>
                <span v-else class="text-xs font-semibold bg-gray-800 px-2 py-1 rounded text-gray-300">
                  {{ stat.distance }}
                </span>
              </div>
            </div>

            <div class="bg-primary/5 p-4 -mx-6 -mb-6 mt-6 border-t border-brand-border flex items-start gap-3">
              <span class="material-symbols-outlined text-primary text-[20px]">info</span>
              <p class="text-xs text-gray-300 leading-relaxed">
                Ensure all categories have assigned distances before proceeding.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3">
            <button class="btn-primary text-lg py-3.5 flex items-center justify-center gap-2 shadow-lg">
              Save & Continue
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
            <NuxtLink :to="`/dashboard/events/${tournamentId}/create`" class="btn-secondary py-3 text-center">
              Back to Details
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseSelect from '~/components/common/BaseSelect.vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  title: 'Tournament Setup',
  layout: 'default',
})

useHead({
  title: 'Setup Turnamen - Dashboard'
})

const route = useRoute()
const tournamentId = route.params.id
const tournamentName = ref('Summer Cup 2024')

const newCategory = ref({
  bowStyle: '',
  ageClass: '',
  gender: ''
})

const bowTypes = ref([])
const ageGroups = ref([])
const { get } = useApi()

const genderOptions = [
  { value: 'Both (Creates 2)', title: 'Both (Creates 2)' },
  { value: 'Men', title: 'Men' },
  { value: 'Women', title: 'Women' },
  { value: 'Mixed Team', title: 'Mixed Team' }
]

const bowOptions = computed(() => {
  return bowTypes.value.map(type => ({ value: type.id, title: type.name }))
})

const ageOptions = computed(() => {
  return ageGroups.value.map(group => ({ value: group.id, title: group.name }))
})

onMounted(async () => {
  try {
    const [bowRes, ageRes] = await Promise.all([
      get('/bow-types'),
      get('/age-groups')
    ])
    if (bowRes?.bow_types) bowTypes.value = bowRes.bow_types
    if (ageRes?.age_groups) ageGroups.value = ageRes.age_groups
  } catch (err) {
    console.error('Failed to fetch reference data', err)
  }
})

const categories = ref([
  { name: 'Recurve Men Open', round: '70m Round (72 Arrows)', distance: 70, targetFace: '122cm', status: 'ready' },
  { name: 'Recurve Women Open', round: '70m Round (72 Arrows)', distance: 70, targetFace: '122cm', status: 'ready' },
  { name: 'Compound Men Open', round: 'TBD', distance: null, targetFace: null, status: 'incomplete' },
])

const completionPercentage = computed(() => {
  const ready = categories.value.filter(c => c.status === 'ready').length
  return categories.value.length > 0 ? Math.round((ready / categories.value.length) * 100) : 0
})

const categoryStats = computed(() => {
  const stats = {}
  categories.value.forEach(cat => {
    const key = cat.name.split(' ')[0] // Get bow style (e.g., "Recurve")
    if (!stats[key]) {
      stats[key] = { name: key, count: 0, distance: cat.distance ? `${cat.distance}m` : '', pending: false }
    }
    stats[key].count++
    if (!cat.distance) stats[key].pending = true
  })

  const result = Object.values(stats).map((stat, index) => ({
    ...stat,
    label: stat.name[0],
    colorClass: index === 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
  }))

  return result
})

const addCategory = () => {
  if (!newCategory.value.bowStyle || !newCategory.value.ageClass || !newCategory.value.gender) {
    alert('Please fill all fields')
    return
  }

  const genders = newCategory.value.gender === 'Both (Creates 2)' ? ['Men', 'Women'] : [newCategory.value.gender]
  const styleName = bowTypes.value.find(t => t.id === newCategory.value.bowStyle)?.name || newCategory.value.bowStyle
  const className = ageGroups.value.find(g => g.id === newCategory.value.ageClass)?.name || newCategory.value.ageClass

  genders.forEach(gender => {
    categories.value.push({
      name: `${styleName} ${gender} ${className}`,
      round: 'TBD',
      distance: null,
      targetFace: null,
      status: 'incomplete'
    })
  })

  newCategory.value = { bowStyle: '', ageClass: '', gender: '' }
}

const removeCategory = (index) => {
  categories.value.splice(index, 1)
}
</script>
