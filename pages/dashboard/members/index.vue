<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col gap-8">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
      <!-- Theme Motif Pattern -->
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <!-- Decorative Background Elements (Glows) -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-4">
          <!-- Mobile-styled Breadcrumb -->
          <div
            class="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary/80">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
            <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
            <span class="text-white">Roster Anggota</span>
          </div>

          <div class="flex items-center gap-4">
            <div
              class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Icon icon="ph:users-three-bold" class="text-primary text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 class="text-xl sm:text-3xl font-black tracking-tight">Roster Anggota</h1>
              <p class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">Kelola pemanah dan atlet yang terdaftar
                di
                klub Anda</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <BaseButton @click="openInviteModal" variant="white" icon="ph:user-plus-bold"
            class="h-10 sm:h-11 px-6 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md font-black text-[10px] sm:text-xs tracking-widest uppercase">
            Invite
          </BaseButton>
          <NuxtLink to="/dashboard/members/create" class="w-full sm:w-auto">
            <BaseButton variant="primary" icon="ph:plus-bold"
              class="w-full h-10 sm:h-11 px-6 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[10px] sm:text-xs">
              Tambah Anggota
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
        <div
          class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
          <Icon icon="ph:users-three" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold  tracking-wider">Total Anggota</p>
          <p class="text-lg font-bold text-navy">{{ members.length }}</p>
        </div>
      </div>
      <div
        class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
        <div
          class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
          <Icon icon="ph:gender-male" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold  tracking-wider">Putra</p>
          <p class="text-lg font-bold text-navy">{{members.filter(m => m.gender === 'M').length}}</p>
        </div>
      </div>
      <div
        class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
        <div
          class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
          <Icon icon="ph:gender-female" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold  tracking-wider">Putri</p>
          <p class="text-lg font-bold text-navy">{{members.filter(m => m.gender === 'F').length}}</p>
        </div>
      </div>
      <div
        class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
        <div
          class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
          <Icon icon="ph:target" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold  tracking-wider">Event Diikuti</p>
          <p class="text-lg font-bold text-navy">{{ totalEvents }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-grow w-full">
        <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" placeholder="Cari nama, bow type, atau kota..."
          label="Pencarian" />
      </div>
      <div class="w-full md:w-48">
        <BaseSelect v-model="bowTypeFilter" :items="bowTypeOptions" label="Jenis Busur" />
      </div>
      <div class="w-full md:w-48">
        <BaseSelect v-model="genderFilter" :items="genderOptions" label="Jenis Kelamin" />
      </div>
      <div class="w-full md:w-48">
        <BaseSelect v-model="statusFilter" :items="statusOptions" label="Status" />
      </div>
      <BaseButton @click="resetFilters" variant="white" size="md" icon="ph:funnel"
        class="h-11 px-6 font-semibold text-sm text-navy bg-white border-gray-200 hover:bg-gray-50">
        Reset
      </BaseButton>
    </div>

    <!-- Members List -->
    <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">Anggota</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">Kategori</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">Jenis Busur</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">Status</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest text-right">Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="member in filteredMembers" :key="member.uuid || member.id"
              class="hover:bg-primary/5 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-xl bg-navy flex items-center justify-center overflow-hidden">
                    <img :src="useImageOrDefault(member.photo_url, member.full_name)"
                      class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <NuxtLink :to="`/dashboard/members/${member.id || member.uuid}`"
                      class="font-bold text-navy group-hover:text-primary transition-colors">
                      {{ member.full_name }}
                    </NuxtLink>
                    <div class="flex items-center gap-2 text-xs text-gray-400">
                      <Icon
                        :icon="member.gender === 'M' ? 'ph:gender-male' : member.gender === 'F' ? 'ph:gender-female' : 'ph:gender-neuter'"
                        :class="member.gender === 'M' ? 'text-blue-500' : member.gender === 'F' ? 'text-pink-500' : 'text-gray-400'" />
                      <span>{{ calculateAge(member.date_of_birth) }} tahun</span>
                      <span class="text-gray-300">•</span>
                      <span>{{ member.city || '-' }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-gray-700 capitalize">
                  {{ member.category || member.age_group || 'Senior' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-3 py-1.5 rounded-full text-xs font-bold tracking-wider inline-flex items-center gap-2 capitalize',
                  member.bow_type === 'Recurve' ? 'bg-blue-50 text-blue-600' :
                    member.bow_type === 'Compound' ? 'bg-purple-50 text-purple-600' :
                      member.bow_type === 'Barebow' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-100 text-gray-600'
                ]">
                  <img :src="`/${getBowIcon(member.bow_type)}`" class="w-4 h-4 opacity-70" alt="bow" />
                  <span>{{ member.bow_type || 'Recurve' }}</span>
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusBadgeClass(member.status)"
                  class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border">
                  {{ getStatusLabel(member.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button v-if="member.status === 'pending'" @click="approveMember(member)"
                    class="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Terima Anggota">
                    <Icon icon="ph:check-bold" class="text-lg" />
                  </button>
                  <NuxtLink :to="`/dashboard/members/${member.id || member.uuid}`"
                    class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                    title="Detail">
                    <Icon icon="ph:eye" class="text-lg" />
                  </NuxtLink>
                </div>
              </td>
            </tr>

            <tr v-if="filteredMembers.length === 0">
              <td colspan="5" class="px-6 py-24 text-center">
                <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                  <div class="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                    <Icon icon="ph:users-three" class="text-4xl" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-lg font-bold text-navy">Belum Ada Anggota</p>
                    <p class="text-sm text-gray-500 font-medium leading-relaxed">
                      Tambahkan pemanah pertama Anda untuk mengelola roster klub.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invite Modal -->
    <div v-if="isInviteOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-navy/60 backdrop-blur-sm p-6 sm:p-4">
      <div
        class="bg-white rounded-[2rem] sm:rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 flex flex-col max-h-[90vh] sm:max-h-[80vh] animate-in zoom-in-95 duration-300">
        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:user-plus-bold" class="text-primary text-xl" />
            </div>
            <div>
              <h3 class="text-lg font-black text-navy leading-none">Undang Pemanah</h3>
              <p class="text-xs text-gray-400 font-medium mt-1">Cari dan tambahkan anggota ke klub Anda</p>
            </div>
          </div>
          <button @click="isInviteOpen = false"
            class="size-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors">
            <Icon icon="ph:x-bold" class="text-xl" />
          </button>
        </div>

        <!-- Search Bar -->
        <div class="px-6 py-4 border-b border-gray-50 bg-gray-50/30 shrink-0">
          <div class="relative">
            <Icon icon="ph:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input v-model="inviteSearchQuery" type="text" placeholder="Cari pemanah berdasarkan nama..."
              class="w-full h-11 pl-11 pr-4 rounded-xl border-gray-100 bg-white text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
        </div>

        <!-- Archer List -->
        <div class="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar">
          <div v-if="loadingInvite" class="py-20 flex flex-col items-center justify-center gap-4 text-gray-400">
            <div class="loading-spinner"></div>
            <p class="text-sm font-medium">Mencari pemanah...</p>
          </div>

          <div v-else-if="filteredInviteList.length === 0" class="py-20 text-center">
            <div class="size-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-200">
              <Icon icon="ph:magnifying-glass-minus" class="text-4xl" />
            </div>
            <p class="text-navy font-bold">Pemanah tidak ditemukan</p>
            <p class="text-xs text-gray-400 mt-1">Coba gunakan kata kunci pencarian lain</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-2">
            <div v-for="archer in filteredInviteList" :key="archer.id || archer.uuid"
              class="group flex items-center justify-between p-3 sm:p-4 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all">
              <div class="flex items-center gap-4 min-w-0">
                <div
                  class="size-12 rounded-xl bg-navy/5 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100 group-hover:ring-primary/20 transition-all shrink-0">
                  <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                    class="size-full object-cover" />
                </div>
                <div class="min-w-0">
                  <p
                    class="font-bold text-navy text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                    {{ archer.full_name }}
                  </p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[10px] sm:text-xs text-gray-400 font-medium truncate">
                      {{ archer.city || 'Independent' }}
                    </span>

                  </div>
                </div>
              </div>
              <BaseButton @click="inviteToClub(archer)" variant="primary" size="sm"
                :loading="invitingId === archer.uuid"
                class="px-5 h-10 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10">
                Undang
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            {{ filteredInviteList.length }} Pemanah Tersedia
          </p>
          <BaseButton @click="isInviteOpen = false" variant="ghost" size="sm"
            class="font-bold text-gray-500 hover:text-navy">
            Kembali
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import { ref, computed } from 'vue'
import { definePageMeta, onMounted } from '#imports'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '#imports'

definePageMeta({
  title: 'Anggota Klub',
  layout: 'dashboard',
  middleware: ['auth']
})

useHead({
  title: 'Anggota Klub - ArcheryHub Dashboard'
})

const { get, post, put } = useApi()
const { user } = useAuth()
const toast = useToast()

const getSafeArray = (resp) => {
  if (Array.isArray(resp)) return resp
  if (!resp) return []
  return Array.isArray(resp.archers) ? resp.archers :
    Array.isArray(resp.athletes) ? resp.athletes :
      Array.isArray(resp.data) ? resp.data : []
}

const breadcrumbItems = computed(() => [
  { label: 'Dashboard', path: '/dashboard' }
])

const members = ref([])
const inviteList = ref([])
const isInviteOpen = ref(false)
const isLoading = ref(true)
const loadingInvite = ref(false)
const invitingId = ref(null)
const searchQuery = ref('')
const inviteSearchQuery = ref('')
const bowTypeFilter = ref('all')
const genderFilter = ref('all')
const statusFilter = ref('all')

const bowTypeOptions = [
  { title: 'Semua', value: 'all' },
  { title: 'Recurve', value: 'Recurve' },
  { title: 'Compound', value: 'Compound' },
  { title: 'Barebow', value: 'Barebow' },
  { title: 'Tradisional', value: 'Traditional' }
]

const genderOptions = [
  { title: 'Semua', value: 'all' },
  { title: 'Putra', value: 'male' },
  { title: 'Putri', value: 'female' }
]

const statusOptions = [
  { title: 'Semua', value: 'all' },
  { title: 'Aktif', value: 'active' },
  { title: 'Menunggu Acc', value: 'pending' },
  { title: 'Diundang', value: 'invited' },
  { title: 'Keluar', value: 'left' }
]

const fetchMembers = async () => {
  isLoading.value = true
  try {
    const isClub = user?.value?.user_type === 'club' || user?.value?.type === 'club'

    if (isClub) {
      // Use the dedicated club members endpoint
      const clubId = user.value?.uuid || user.value?.id
      const resp = await get(`/clubs/members/${clubId}`)

      // The endpoint returns { data: [...] } where each item has archer_name and ClubMember fields
      // But we need it in the format the rest of the page expects (Archer objects)
      // Actually, let's see what the page uses. It uses full_name, etc.
      if (resp && resp.data) {
        members.value = resp.data.map(m => ({
          ...m,
          membership_uuid: m.uuid, // Preserve the club_members record UUID
          uuid: m.archer_id,
          photo_url: m.avatar_url, // Map avatar_url to what the frontend expects
        }))
      } else {
        members.value = []
      }
    } else {
      const resp = await get('/archers')
      members.value = getSafeArray(resp)
    }
  } catch (error) {
    console.error('Fetch members error:', error)
    toast.error('Gagal memuat anggota klub')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMembers()
})

const calculateAge = (dob) => {
  if (!dob) return '-'
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const totalEvents = computed(() => members.value.reduce((acc, a) => acc + (a.total_events || 0), 0))

const filteredMembers = computed(() => {
  return members.value.filter(member => {
    const search = searchQuery.value.toLowerCase()
    const matchesSearch = member.full_name?.toLowerCase().includes(search) ||
      (member.city && member.city.toLowerCase().includes(search)) ||
      (member.bow_type && member.bow_type.toLowerCase().includes(search))

    const matchesBow = bowTypeFilter.value === 'all' || member.bow_type === bowTypeFilter.value
    const matchesGender = genderFilter.value === 'all' ||
      (genderFilter.value === 'male' && member.gender === 'M') ||
      (genderFilter.value === 'female' && member.gender === 'F')
    const matchesStatus = statusFilter.value === 'all' || member.status === statusFilter.value

    return matchesSearch && matchesBow && matchesGender && matchesStatus
  })
})

const filteredInviteList = computed(() => {
  if (!inviteSearchQuery.value) return inviteList.value
  const query = inviteSearchQuery.value.toLowerCase()
  return inviteList.value.filter(a =>
    a.full_name?.toLowerCase().includes(query) ||
    (a.city && a.city.toLowerCase().includes(query))
  )
})

const resetFilters = () => {
  searchQuery.value = ''
  bowTypeFilter.value = 'all'
  genderFilter.value = 'all'
  statusFilter.value = 'all'
}

const getStatusBadgeClass = (status) => {
  const s = status?.toLowerCase() || 'active'
  if (s === 'active') return 'bg-green-50 text-green-600 border-green-100'
  if (s === 'invited') return 'bg-blue-50 text-blue-600 border-blue-100'
  if (s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100'
  if (s === 'left') return 'bg-red-50 text-red-600 border-red-100'
  return 'bg-gray-50 text-gray-600 border-gray-100'
}

const getStatusLabel = (status) => {
  const s = status?.toLowerCase() || 'active'
  const labels = {
    'active': 'Aktif',
    'invited': 'Diundang',
    'pending': 'Menunggu Acc',
    'left': 'Keluar'
  }
  return labels[s] || s
}

const openInviteModal = async () => {
  isInviteOpen.value = true
  loadingInvite.value = true
  try {
    const resp = await get('/archers?limit=100')
    const data = getSafeArray(resp)
    // Archers not yet in any club
    inviteList.value = data.filter(a => {
      const clubId = a.club_id || a.organization_id
      const clubName = a.club_name || a.club || a.organization_name
      return !clubId && !clubName
    })
  } catch (e) {
    console.error('Invite error:', e)
    toast.error('Gagal memuat daftar pemanah')
  } finally {
    loadingInvite.value = false
  }
}

const inviteToClub = async (archer) => {
  invitingId.value = archer.uuid
  try {
    const archerId = archer.uuid || archer.id
    if (!archerId) {
      toast.error('ID Pemanah tidak valid')
      return
    }

    await post('/clubs/invite', {
      archer_id: archerId,
      role: 'member'
    })

    toast.success(`Undangan berhasil dikirim ke ${archer.full_name}`)
    inviteList.value = inviteList.value.filter(i => (i.id || i.uuid) !== archerId)
  } catch (e) {
    console.error('Invite error:', e)
    toast.error(e.response?.data?.error || 'Gagal mengirim undangan')
  } finally {
    invitingId.value = null
  }
}

const approveMember = async (member) => {
  try {
    const memberId = member.membership_uuid || member.uuid
    await post(`/clubs/approve/${memberId}`)
    toast.success(`${member.full_name} berhasil diterima sebagai anggota`)
    await fetchMembers()
  } catch (error) {
    console.error('Approve member error:', error)
    toast.error(error.data?.error || 'Gagal menerima anggota')
  }
}
</script>
