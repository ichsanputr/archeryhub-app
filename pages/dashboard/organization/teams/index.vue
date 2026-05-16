<template>
  <div class="flex flex-col gap-8">
    <!-- Header Section -->
    <div class="flex flex-col gap-4">
      <Breadcrumbs :items="breadcrumbItems" current="Tim" />

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">Manajemen Tim</h1>
          <p class="text-gray-500 font-medium mt-1 text-sm md:text-base">Kelola tim dan peserta grup dalam event Anda.
          </p>
        </div>
        <BaseButton variant="primary" icon="ph:plus-bold" class="shadow-md shadow-primary/20 h-10 md:h-11 px-4 md:px-6"
          @click="showCreateModal = true">
          <span class="hidden sm:inline">Buat Tim Baru</span>
          <span class="sm:hidden">Buat Tim</span>
        </BaseButton>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
        <div
          class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
          <Icon icon="ph:users-four" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold  tracking-wider">Total Tim</p>
          <p class="text-lg font-bold text-navy">{{ teams.length }}</p>
        </div>
      </div>
      <div
        class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
        <div
          class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
          <Icon icon="ph:check-circle" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold  tracking-wider">Aktif</p>
          <p class="text-lg font-bold text-navy">{{teams.filter(t => t.status === 'active').length}}</p>
        </div>
      </div>
      <div
        class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
        <div
          class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
          <Icon icon="ph:user" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold  tracking-wider">Total Anggota</p>
          <p class="text-lg font-bold text-navy">{{teams.reduce((acc, t) => acc + t.memberCount, 0)}}</p>
        </div>
      </div>
      <div
        class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
        <div
          class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
          <Icon icon="ph:trophy" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold  tracking-wider">Event Aktif</p>
          <p class="text-lg font-bold text-navy">{{[...new Set(teams.map(t => t.eventId))].length}}</p>
        </div>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-grow w-full">
        <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" placeholder="Cari nama tim atau event..."
          label="Pencarian" />
      </div>
      <div class="w-full md:w-64">
        <BaseSelect v-model="statusFilter" :items="statusOptions" label="Status" />
      </div>
      <BaseButton variant="white" icon="ph:funnel" @click="resetFilters" class="h-11">
        Reset
      </BaseButton>
    </div>

    <!-- Teams Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="team in filteredTeams" :key="team.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-primary/30 transition-all group">

        <!-- Team Header -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-4">
              <div
                class="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center text-navy font-black text-xl shadow-md shadow-primary/20">
                {{ team.name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <h3 class="font-bold text-navy text-lg group-hover:text-primary transition-colors">{{ team.name }}</h3>
                <p class="text-sm text-gray-400">{{ team.eventName }}</p>
              </div>
            </div>
            <span :class="[
              'px-3 py-1 rounded-full text-xs font-bold  tracking-wider',
              team.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
            ]">
              {{ team.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
            </span>
          </div>
        </div>

        <!-- Team Info -->
        <div class="p-6 space-y-4">
          <!-- Category Badge -->
          <div class="flex items-center gap-2 text-sm">
            <Icon icon="ph:tag" class="text-gray-400" />
            <span class="text-gray-600">{{ team.category }}</span>
          </div>

          <!-- Members Preview -->
          <div class="flex items-center justify-between">
            <div class="flex -space-x-2">
              <div v-for="(member, idx) in team.members.slice(0, 4)" :key="idx"
                class="h-8 w-8 rounded-full border-2 border-white bg-navy overflow-hidden">
                <img :src="useImageOrDefault(member.avatar || member.photo_url || member.avatar_url, member.name)"
                  class="w-full h-full object-cover" />
              </div>
              <div v-if="team.members.length > 4"
                class="h-8 w-8 rounded-full border-2 border-white bg-navy text-white flex items-center justify-center text-xs font-bold">
                +{{ team.members.length - 4 }}
              </div>
            </div>
            <span class="text-sm text-gray-500 font-medium">{{ team.memberCount }} Anggota</span>
          </div>

          <!-- Stats Row -->
          <div class="flex items-center gap-4 pt-2 border-t border-gray-100">
            <div class="flex items-center gap-1.5 text-sm text-gray-500">
              <Icon icon="ph:crosshair" class="text-primary" />
              <span class="font-bold text-navy">{{ team.totalScore }}</span>
              <span class="text-gray-400">Skor</span>
            </div>
            <div class="flex items-center gap-1.5 text-sm text-gray-500">
              <Icon icon="ph:ranking" class="text-amber-500" />
              <span class="font-bold text-navy">#{{ team.rank }}</span>
              <span class="text-gray-400">Peringkat</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-2">
          <BaseButton variant="white" size="sm" icon="ph:eye" class="flex-1" @click="viewTeam(team)">
            Detail
          </BaseButton>
          <BaseButton variant="outline" size="sm" icon="ph:pencil-simple" class="flex-1" @click="editTeam(team)">
            Edit
          </BaseButton>
          <button @click="deleteTeam(team)"
            class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Icon icon="ph:trash" class="text-lg" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTeams.length === 0" class="col-span-full">
        <div class="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div class="h-20 w-20 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
            <Icon icon="ph:users-four" class="text-5xl" />
          </div>
          <h3 class="text-xl font-bold text-navy mb-2">Belum Ada Tim</h3>
          <p class="text-gray-500 mb-6 max-w-sm mx-auto">Buat tim pertama Anda untuk mengorganisir peserta dalam
            kompetisi grup.</p>
          <BaseButton variant="primary" icon="ph:plus-bold" @click="showCreateModal = true">
            Buat Tim Pertama
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import { ref, computed } from 'vue'

definePageMeta({
  title: 'Tim',
  layout: 'dashboard'
})

useHead({
  title: 'Manajemen Tim - Archeris Dashboard'
})

const { get, delete: del } = useApi()
const toast = useToast()

const breadcrumbItems = computed(() => [
  { label: 'Dashboard', path: '/dashboard' }
])

const teams = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const showCreateModal = ref(false)

const statusOptions = [
  { value: 'all', title: 'Semua Status' },
  { value: 'active', title: 'Aktif' },
  { value: 'inactive', title: 'Tidak Aktif' }
]

const fetchTeams = async () => {
  isLoading.value = true
  try {
    const response = await get('/teams/my')
    teams.value = response.data.map(t => ({
      ...t,
      name: t.team_name,
      eventName: t.event_name,
      category: t.category_name,
      memberCount: t.member_count,
      totalScore: t.total_score,
      rank: t.team_rank || '-',
      members: [] // Not returned in list for performance
    })) || []
  } catch (error) {
    toast.error('Gagal mengambil data tim')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTeams()
})

const filteredTeams = computed(() => {
  return teams.value.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      team.eventName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || team.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
}

const viewTeam = (team) => {
  console.log('View team:', team)
}

const editTeam = (team) => {
  console.log('Edit team:', team)
}

const deleteTeam = async (team) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus tim "${team.name}"?`)) return

  try {
    await del(`/teams/${team.id}`)
    toast.success('Tim berhasil dihapus')
    fetchTeams()
  } catch (error) {
    toast.error('Gagal menghapus tim')
  }
}
</script>
