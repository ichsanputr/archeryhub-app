<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Daftar Event</h1>
        <p class="text-text-secondary text-sm font-medium mt-1">Kelola kompetisi dan pantau progres turnamen Anda.</p>
      </div>
      <BaseButton to="/dashboard/events/create" variant="primary" icon="ph:plus">
        Buat Event Baru
      </BaseButton>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-grow">
        <BaseInput v-model="searchQuery" icon="ph:magnifying-glass"
          placeholder="Cari berdasarkan nama event, lokasi..." />
      </div>
      <div class="w-full md:w-64">
        <BaseSelect v-model="statusFilter" :items="[
          { title: 'Semua Status', value: '' },
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
          { title: 'Berlangsung', value: 'ongoing' },
          { title: 'Akan Datang', value: 'upcoming' },
          { title: 'Selesai', value: 'completed' }
        ]" placeholder="Filter Status" />
      </div>
    </div>

    <!-- Events Table -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Event</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center gap-3">
                  <div class="size-10 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                  <p class="text-xs text-gray-500 font-medium">Memuat data event...</p>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredEvents.length === 0" class="hover:bg-gray-50">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center gap-2">
                  <Icon icon="ph:calendar-blank" class="text-4xl text-gray-300" />
                  <p class="text-gray-500 font-medium">Tidak ada event ditemukan</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="event in filteredEvents" :key="event.id" class="group hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                    <Icon icon="ph:trophy" class="text-navy/40 text-xl" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-bold text-navy truncate">{{ event.name }}</div>
                    <div class="text-xs text-gray-500">{{ event.type || 'Tournament' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-navy font-medium">{{ formatDate(event.start_date) }}</div>
                <div class="text-xs text-gray-500">{{ formatTime(event.start_date) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="text-sm text-navy truncate max-w-[200px]">{{ event.venue }}</div>
                  <a v-if="event.gmaps_link" :href="event.gmaps_link" target="_blank"
                    class="text-primary hover:text-primary-hover transition-colors" title="Buka Google Maps">
                    <Icon icon="ph:map-pin" class="text-[16px]" />
                  </a>
                </div>
                <div class="text-xs text-gray-500">{{ event.city || '-' }}</div>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(event.status)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border">
                  {{ getStatusLabel(event.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <BaseButton :to="`/dashboard/events/${event.id}/manage`" variant="ghost" size="sm">
                  Kelola
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span class="text-xs text-gray-500 font-medium">Menampilkan <span class="font-bold text-navy">1-5</span> dari
          <span class="font-bold text-navy">{{ events.length }}</span> event</span>
        <div class="flex gap-2">
          <BaseButton variant="outline" size="sm" disabled>
            Sebelumnya
          </BaseButton>
          <BaseButton variant="outline" size="sm">
            Berikutnya
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
definePageMeta({
  layout: 'dashboard'
})

const { get } = useApi()
const searchQuery = ref('')
const statusFilter = ref('')
const events = ref([])
const isLoading = ref(true)

const fetchEvents = async () => {
  isLoading.value = true
  try {
    const response = await get('/events')
    events.value = response?.events || []
  } catch (error) {
    console.error('Failed to fetch events:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = (event.name?.toLowerCase() || '').includes(searchQuery.value.toLowerCase()) ||
      (event.venue?.toLowerCase() || '').includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || event.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status) => {
  const classes = {
    'published': 'bg-primary/20 text-navy border-primary/20',
    'draft': 'bg-amber-50 text-amber-700 border-amber-100',
    'ongoing': 'bg-primary/20 text-navy border-primary/20',
    'upcoming': 'bg-blue-50 text-blue-700 border-blue-100',
    'completed': 'bg-gray-100 text-gray-600 border-gray-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-600 border-gray-200'
}

const getStatusLabel = (status) => {
  const labels = {
    'published': 'Published',
    'draft': 'Draft',
    'ongoing': 'Berlangsung',
    'upcoming': 'Akan Datang',
    'completed': 'Selesai'
  }
  return labels[status] || status
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatTime = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  }) + ' WIB'
}
</script>
