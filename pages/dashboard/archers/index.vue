<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-navy font-display">Manajemen Atlet</h1>
        <p class="text-text-secondary mt-1 font-medium">Kelola semua atlet yang terdaftar di Archeryhub.id</p>
      </div>
      <BaseButton variant="primary" icon="ph:user-plus" @click="$router.push('/dashboard/archers/create')">
        Tambah Atlet Baru
      </BaseButton>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <BaseInput v-model="searchQuery" placeholder="Cari berdasarkan nama, ID, atau klub..."
          icon="ph:magnifying-glass" />
      </div>
      <div class="flex gap-3">
        <div class="w-48">
          <BaseSelect v-model="activeTab" :options="tabs.map(t => ({ value: t.value, label: t.label }))" />
        </div>
        <BaseButton variant="outline" icon="ph:funnel">
          Filter
        </BaseButton>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      <BaseButton v-for="tab in tabs" :key="tab.value" variant="ghost" size="sm" :class="[
        'whitespace-nowrap font-bold transition-all',
        activeTab === tab.value ? 'bg-navy text-white' : 'bg-white border border-gray-200 text-navy hover:border-primary'
      ]" @click="activeTab = tab.value">
        {{ tab.label }}
        <span v-if="tab.count > 0" class="ml-2 font-black opacity-60">({{ tab.count }})</span>
      </BaseButton>
    </div>

    <!-- Athletes Table -->
    <div class="table-container">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-surface-highlight/50 border-b border-brand-border">
              <th class="table-header w-12">
                <input type="checkbox"
                  class="rounded border-brand-border bg-surface-dark text-primary focus:ring-primary/50" />
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
            <tr v-for="athlete in athletes" :key="athlete.id" class="table-row group">
              <td class="table-cell">
                <input type="checkbox"
                  class="rounded border-brand-border bg-surface-dark text-primary focus:ring-primary/50" />
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-4">
                  <div
                    class="size-10 rounded-full shrink-0 border border-surface-highlight flex items-center justify-center overflow-hidden bg-navy">
                    <img :src="useImageOrDefault(athlete.photo_url, athlete.full_name)"
                      class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-white text-sm font-bold group-hover:text-primary transition-colors cursor-pointer"
                      @click="$router.push(`/dashboard/archers/${athlete.uuid || athlete.id}`)">
                      {{ athlete.full_name }}
                    </p>
                    <p class="text-brand-gold text-xs mt-0.5">
                      ID: {{ athlete.id }} • {{ athlete.email }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="flex flex-col">
                  <span class="text-white text-sm font-medium">{{ athlete.club_name || 'Independent' }}</span>
                  <span class="text-brand-gold text-xs">{{ athlete.city || '-' }}</span>
                </div>
              </td>
              <td class="table-cell text-brand-gold text-sm">
                <div class="flex items-center gap-1.5 uppercase font-bold text-[10px]">
                  <Icon icon="ph:flag-banner" class="text-[16px]" />
                  {{ athlete.city || '-' }}
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
                  <BaseButton variant="ghost" size="sm" icon="ph:user" class="!p-1.5"
                    @click="$router.push(`/dashboard/archers/${athlete.uuid || athlete.id}`)" />
                  <BaseButton variant="ghost" size="sm" icon="ph:pencil-simple"
                    class="!p-1.5 text-navy hover:text-primary" />
                  <BaseButton variant="ghost" size="sm" icon="ph:prohibit"
                    class="!p-1.5 text-red-500 hover:bg-red-50" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <p class="text-xs text-text-secondary font-medium">
          Menampilkan <span class="font-bold text-navy">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span> sampai <span
            class="font-bold text-navy">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span> dari <span
            class="font-bold text-navy">{{ totalItems }}</span> atlet
        </p>
        <div class="flex gap-2">
          <BaseButton variant="outline" size="sm" :disabled="currentPage === 1" @click="currentPage--; fetchData()">
            Sebelumnya
          </BaseButton>
          <div class="flex gap-1">
            <BaseButton v-for="p in Math.min(5, Math.ceil(totalItems / itemsPerPage))" :key="p"
              :variant="currentPage === p ? 'primary' : 'outline'" size="sm" class="!px-3"
              @click="currentPage = p; fetchData()">
              {{ p }}
            </BaseButton>
          </div>
          <BaseButton variant="outline" size="sm" :disabled="currentPage >= Math.ceil(totalItems / itemsPerPage)"
            @click="currentPage++; fetchData()">
            Selanjutnya
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
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
  { label: 'Aktif', value: 'active', count: 0 },
  { label: 'Menunggu', value: 'pending', count: 0 },
  { label: 'Ditangguhkan', value: 'suspended', count: 0 },
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
    const response = await get(`/archers?search=${encodeURIComponent(searchQuery.value)}&status=${status}&limit=${itemsPerPage}&offset=${offset}`)

    if (response) {
      const data = response.archers || response.athletes || []
      athletes.value = data
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
