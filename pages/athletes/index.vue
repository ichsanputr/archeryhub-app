<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-white">Athletes Management</h1>
        <p class="text-brand-gold mt-1">Manage all registered athletes</p>
      </div>
      <button class="btn-primary flex items-center gap-2">
        <span class="material-symbols-outlined">person_add</span>
        Add New Athlete
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <div class="flex items-center rounded-lg bg-surface-highlight h-12 px-4">
          <span class="material-symbols-outlined text-brand-gold">search</span>
          <input 
            v-model="searchQuery"
            class="w-full bg-transparent border-none text-white placeholder-brand-gold text-sm focus:ring-0 ml-2"
            placeholder="Search by name, ID, or club..."
          />
        </div>
      </div>
      <div class="flex gap-3">
        <select class="input h-12">
          <option>All Status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>
        <button class="btn-secondary flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">filter_list</span>
          Filter
        </button>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="flex gap-2 overflow-x-auto pb-2">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="activeTab === tab.value ? 'bg-primary text-background-dark' : 'bg-surface-highlight text-white border border-transparent hover:border-primary/50'"
        class="whitespace-nowrap px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="ml-2 font-bold opacity-60">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Athletes Table -->
    <div class="table-container">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-surface-highlight/50 border-b border-brand-border">
              <th class="table-header w-12">
                <input type="checkbox" class="rounded border-brand-border bg-surface-dark text-primary focus:ring-primary/50" />
              </th>
              <th class="table-header">Athlete</th>
              <th class="table-header">Division & Category</th>
              <th class="table-header">Club / Affiliation</th>
              <th class="table-header">Events</th>
              <th class="table-header">Status</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-border">
            <tr 
              v-for="athlete in athletes" 
              :key="athlete.id"
              class="table-row group"
            >
              <td class="table-cell">
                <input type="checkbox" class="rounded border-brand-border bg-surface-dark text-primary focus:ring-primary/50" />
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-4">
                  <div class="size-10 rounded-full bg-cover bg-center shrink-0 border border-surface-highlight flex items-center justify-center overflow-hidden" 
                       :style="athlete.photo_url ? `background-image: url('${athlete.photo_url}')` : ''">
                    <span v-if="!athlete.photo_url" class="material-symbols-outlined text-brand-gold/30">person</span>
                  </div>
                  <div>
                    <p class="text-white text-sm font-bold group-hover:text-primary transition-colors cursor-pointer" @click="$router.push(`/athletes/${athlete.id}`)">
                      {{ athlete.first_name }} {{ athlete.last_name }}
                    </p>
                    <p class="text-brand-gold text-xs mt-0.5">
                      ID: {{ athlete.athlete_code }} • {{ athlete.email }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="flex flex-col">
                  <span class="text-white text-sm font-medium">{{ athlete.club || 'Independent' }}</span>
                  <span class="text-brand-gold text-xs">{{ athlete.country }}</span>
                </div>
              </td>
              <td class="table-cell text-brand-gold text-sm">
                <div class="flex items-center gap-1.5 uppercase font-bold text-[10px]">
                  <span class="material-symbols-outlined text-[16px]">flag</span>
                  {{ athlete.country }}
                </div>
              </td>
              <td class="table-cell">
                <div class="flex flex-col gap-1">
                  <span class="text-white text-xs font-medium">{{ athlete.total_events }} Events</span>
                  <span class="text-brand-gold text-[10px]">Last: {{ formatDate(athlete.last_event_date) }}</span>
                </div>
              </td>
              <td class="table-cell">
                <span :class="getStatusBadge(athlete.status)" class="badge">
                  {{ athlete.status }}
                </span>
              </td>
              <td class="table-cell text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-1.5 rounded text-gray-400 hover:text-white hover:bg-surface-highlight transition-colors" title="View Profile">
                    <span class="material-symbols-outlined text-[20px]">person</span>
                  </button>
                  <button class="p-1.5 rounded text-gray-400 hover:text-primary hover:bg-surface-highlight transition-colors" title="Edit Details">
                    <span class="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button class="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-surface-highlight transition-colors" title="Deactivate">
                    <span class="material-symbols-outlined text-[20px]">block</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-surface-dark border-t border-brand-border px-6 py-4 flex items-center justify-between">
        <p class="text-xs text-brand-gold">
          Showing <span class="font-bold text-white">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> to <span class="font-bold text-white">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span> of <span class="font-bold text-white">{{ totalItems }}</span> results
        </p>
        <div class="flex gap-2">
          <button 
            class="px-3 py-1 text-xs rounded border border-brand-border text-brand-gold hover:bg-surface-highlight transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
            :disabled="currentPage === 1"
            @click="currentPage--; fetchData()"
          >
            Previous
          </button>
          <button 
            v-for="p in Math.min(5, Math.ceil(totalItems / itemsPerPage))" 
            :key="p"
            class="px-3 py-1 text-xs rounded transition-colors"
            :class="currentPage === p ? 'bg-primary text-background-dark font-bold' : 'border border-brand-border text-brand-gold hover:bg-surface-highlight'"
            @click="currentPage = p; fetchData()"
          >
            {{ p }}
          </button>
          <button 
            class="px-3 py-1 text-xs rounded border border-brand-border text-brand-gold hover:bg-surface-highlight transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            :disabled="currentPage >= Math.ceil(totalItems / itemsPerPage)"
            @click="currentPage++; fetchData()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  title: 'Athletes Management',
  layout: 'default'
})

const { get } = useApi()

const loading = ref(false)
const searchQuery = ref('')
const activeTab = ref('all')

const tabs = ref([
  { label: 'All Athletes', value: 'all', count: 0 },
  { label: 'Active', value: 'active', count: 0 },
  { label: 'Pending', value: 'pending', count: 0 },
  { label: 'Suspended', value: 'suspended', count: 0 },
])

const athletes = ref([])
const totalItems = ref(0)
const itemsPerPage = 10
const currentPage = ref(1)

const fetchData = async () => {
  loading.value = true
  try {
    const status = activeTab.value === 'all' ? '' : activeTab.value
    const offset = (currentPage.value - 1) * itemsPerPage
    const response = await get(`/athletes?search=${encodeURIComponent(searchQuery.value)}&status=${status}&limit=${itemsPerPage}&offset=${offset}`)
    
    if (response && response.athletes) {
      athletes.value = response.athletes
      totalItems.value = response.total || 0
      
      // Update tab counts if on "all" tab
      if (activeTab.value === 'all' && !searchQuery.value) {
        tabs.value[0].count = response.total
      }
    }
  } catch (error) {
    console.error('Failed to fetch athletes:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusBadge = (status) => {
  const badges = {
    'active': 'badge-success',
    'pending': 'badge-warning',
    'inactive': 'badge-neutral',
    'suspended': 'badge-error'
  }
  return badges[status?.toLowerCase()] || 'badge-neutral'
}

// Debounce search
let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 500)
})

watch(activeTab, () => {
  currentPage.value = 1
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>
