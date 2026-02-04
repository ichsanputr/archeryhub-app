<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <Breadcrumbs :items="breadcrumbItems" current="Anggota Klub" />

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">Roster Anggota Klub</h1>
          <p class="text-gray-500 font-medium mt-1 text-sm md:text-base">Kelola seluruh pemanah yang terdaftar di klub
            Anda.</p>
        </div>
        <div class="flex gap-2">
          <button
            class="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-xs md:text-sm text-navy shadow-sm hover:bg-gray-50 transition"
            @click="openInviteModal">
            <Icon icon="ph:user-plus" class="text-lg" />
            <span class="hidden sm:inline">Invite Archery</span>
            <span class="sm:hidden">Invite</span>
          </button>
          <NuxtLink to="/dashboard/members/create">
            <button
              class="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-navy text-white rounded-xl font-semibold text-xs md:text-sm shadow-md shadow-primary/20 hover:bg-navy-dark transition">
              <Icon icon="ph:plus-bold" class="text-lg" />
              <span class="hidden sm:inline">Tambah Anggota</span>
              <span class="sm:hidden">Tambah</span>
            </button>
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
          <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Anggota</p>
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
          <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Putra</p>
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
          <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Putri</p>
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
          <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Event Diikuti</p>
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
      <button
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-sm text-navy shadow-sm hover:bg-gray-50 transition"
        @click="resetFilters">
        <Icon icon="ph:funnel" class="text-lg" />
        Reset
      </button>
    </div>

    <!-- Members List -->
    <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Anggota</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Kategori</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Jenis Busur</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Event Terakhir
              </th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Aksi
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
                    <NuxtLink :to="`/dashboard/members/${member.uuid || member.id}`"
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
                <span class="text-sm font-medium text-gray-700">
                  {{ member.category || member.age_group || 'Senior' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                  member.bow_type === 'Recurve' ? 'bg-blue-50 text-blue-600' :
                    member.bow_type === 'Compound' ? 'bg-purple-50 text-purple-600' :
                      member.bow_type === 'Barebow' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-100 text-gray-600'
                ]">
                  {{ member.bow_type || 'Recurve' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-gray-700">{{ member.last_event || '—' }}</p>
                <p class="text-xs text-gray-400">{{ member.last_event_date || '' }}</p>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink :to="`/dashboard/members/${member.uuid || member.id}`"
                    class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors">
                    <Icon icon="ph:eye" class="text-lg" />
                  </NuxtLink>
                  <button class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <Icon icon="ph:chart-line-up" class="text-lg" />
                  </button>
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div class="bg-white rounded-2xl shadow-md w-full max-w-3xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-lg font-extrabold text-navy">Invite Archery ke Klub</h3>
          <button class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg" @click="isInviteOpen = false">
            <Icon icon="ph:x" class="text-lg" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-500">Daftar akun pemanah yang belum tergabung klub.</p>
          <div
            class="bg-gray-50/60 rounded-xl border border-gray-100 max-h-[380px] overflow-y-auto divide-y divide-gray-100">
            <div v-for="archer in inviteList" :key="archer.id || archer.uuid"
              class="flex items-center justify-between px-4 py-3 hover:bg-white transition">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-navy flex items-center justify-center overflow-hidden">
                  <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                    class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="font-semibold text-navy">{{ archer.full_name }}</p>
                  <p class="text-xs text-gray-400">{{ archer.email || 'Tidak ada email' }}</p>
                </div>
              </div>
              <button
                class="inline-flex items-center gap-2 px-3 py-2 bg-navy text-white rounded-lg text-xs font-semibold hover:bg-navy-dark transition"
                @click="inviteToClub(archer)">
                <Icon icon="ph:user-plus" class="text-sm" />
                Undang
              </button>
            </div>
            <div v-if="inviteList.length === 0" class="px-4 py-12 text-center text-sm text-gray-500">
              Semua pemanah sudah memiliki klub atau data kosong.
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 text-right">
          <button class="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-navy" @click="isInviteOpen = false">
            Tutup
          </button>
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

const { get, post } = useApi()
const { user } = useAuth()
const toast = useToast()

const breadcrumbItems = computed(() => [
  { label: 'Dashboard', path: '/dashboard' }
])

const members = ref([])
const inviteList = ref([])
const isInviteOpen = ref(false)
const isLoading = ref(true)
const searchQuery = ref('')
const bowTypeFilter = ref('all')
const genderFilter = ref('all')

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

const fetchMembers = async () => {
  isLoading.value = true
  try {
    const resp = await get('/archers')
    const data = resp.data || []
    if (user?.value?.user_type === 'club' || user?.value?.type === 'club') {
      const clubName = user.value?.club_name || user.value?.organization_name || user.value?.full_name || ''
      members.value = data.filter(a => (a.club || a.club_name || '').toLowerCase() === clubName.toLowerCase())
    } else {
      members.value = data
    }
  } catch {
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

    return matchesSearch && matchesBow && matchesGender
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  bowTypeFilter.value = 'all'
  genderFilter.value = 'all'
}

const openInviteModal = async () => {
  isInviteOpen.value = true
  try {
    const resp = await get('/archers')
    const data = resp.data || resp || []
    // Archers not yet in any club
    inviteList.value = data.filter(a => !a.club && !a.club_id)
  } catch {
    toast.error('Gagal memuat daftar undangan')
  }
}

const inviteToClub = async (archer) => {
  try {
    const clubName = user.value?.club_name || user.value?.organization_name || user.value?.full_name || ''
    if (!clubName) {
      toast.error('Profil klub tidak lengkap')
      return
    }
    await useApi().put(`/archers/${archer.id || archer.uuid}`, { club: clubName })
    toast.success('Berhasil mengundang pemanah ke klub')
    inviteList.value = inviteList.value.filter(i => (i.id || i.uuid) !== (archer.id || archer.uuid))
    fetchMembers()
  } catch {
    toast.error('Gagal mengundang pemanah')
  }
}
</script>
