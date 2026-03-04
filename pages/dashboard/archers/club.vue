<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-20"
        style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
      </div>

      <!-- Decorative Background Elements -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <!-- Header Content -->
      <div class="relative p-6 sm:p-8">
        <div class="flex items-start gap-4">
          <!-- Icon Badge -->
          <div
            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
            <Icon icon="ph:buildings" class="text-primary text-2xl" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">Klub Saya</h1>
            <p class="text-slate-300 text-sm mt-1">Kelola keanggotaan klub panahan Anda</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Membership Status -->
    <div v-if="isLoadingMembership"
      class="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
      <div class="flex flex-col items-center gap-4">
        <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin" />
        <p class="text-gray-400 font-bold animate-pulse">Memuat data keanggotaan...</p>
      </div>
    </div>

    <!-- Active Membership -->
    <div v-else-if="myMembership" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Club Card -->
        <div class="bg-white rounded-2xl border-2 border-gray-100 shadow-sm relative">
          <div class="h-32 bg-navy relative overflow-hidden rounded-t-2xl">
            <div class="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800"
                class="w-full h-full object-cover" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
          </div>
          <!-- Avatar repositioned outside banner overflow -->
          <div class="absolute top-32 -translate-y-1/2 left-8 z-10">
            <div
              class="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden ring-1 ring-gray-100">
              <img
                :src="useImageOrDefault(myMembership.club_avatar_url || myMembership.avatar_url, myMembership.club_name)"
                class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="pt-12 p-8">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl font-black text-navy">{{ myMembership.club_name }}</h2>
                <p class="text-gray-500 font-medium">Status:
                  <span :class="myMembership.status === 'active' ? 'text-green-500' : 'text-amber-500'"
                    class="font-bold  tracking-tighter ml-1">
                    {{ myMembership.status === 'active' ? 'Aktif' : 'Menunggu Persetujuan' }}
                  </span>
                </p>
              </div>
              <div class="flex gap-2">
                <BaseButton v-if="myMembership.status === 'active'" variant="outline" size="sm" icon="ph:sign-out"
                  @click="confirmLeaveClub" :loading="isLeaving">
                  Keluar Klub
                </BaseButton>
                <BaseButton v-else variant="outline" size="sm" icon="ph:x-circle" @click="confirmCancelApplication"
                  :loading="isLeaving">
                  Batalkan Pengajuan
                </BaseButton>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
              <div>
                <p class="text-[10px] font-black text-gray-400  tracking-widest mb-1">Peran</p>
                <p class="text-navy font-bold">{{ myMembership.role === 'member' ? 'Anggota' : 'Admin' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400  tracking-widest mb-1">
                  {{ myMembership.status === 'active' ? 'Bergabung Sejak' : 'Diajukan Pada' }}
                </p>
                <p class="text-navy font-bold">{{ formatDate(myMembership.joined_at || myMembership.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-primary/5 rounded-2xl border border-primary/20 p-6">
          <h3 class="font-black text-navy mb-4 flex items-center gap-2">
            <Icon icon="ph:info-bold" class="text-primary" />
            Informasi
          </h3>
          <p v-if="myMembership.status === 'active'" class="text-sm text-navy/70 leading-relaxed font-medium">
            Anda adalah anggota resmi <strong>{{ myMembership.club_name }}</strong>. Anda dapat melihat pengumuman
            internal dan berpartisipasi dalam event yang mewakili klub ini.
          </p>
          <p v-else class="text-sm text-navy/70 leading-relaxed font-medium">
            Permintaan bergabung Anda ke <strong>{{ myMembership.club_name }}</strong> sedang menunggu persetujuan dari
            pengelola klub. Fitur anggota akan aktif setelah disetujui.
          </p>
        </div>
      </div>
    </div>

    <!-- No Membership / Directory Search -->
    <div v-else class="space-y-8">
      <!-- Search Section -->
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-1">
            <Icon icon="ph:magnifying-glass-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Cari nama klub atau kota..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all font-medium"
              @keyup.enter="searchClubs" />
          </div>
          <BaseButton variant="primary" icon="ph:magnifying-glass" @click="searchClubs" :loading="isSearching">
            Cari Klub
          </BaseButton>
        </div>

        <div v-if="clubResults.length === 0 && !hasSearched && !isSearching"
          class="bg-white rounded-2xl border border-gray-100 p-10 text-center space-y-4">
          <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
            <Icon icon="ph:buildings-bold" class="text-5xl text-gray-200" />
          </div>
          <div>
            <h3 class="text-xl font-black text-navy">Belum Bergabung dengan Klub</h3>
            <p class="text-gray-500 max-w-md mx-auto mt-2">Cari dan temukan klub panahan di sekitar Anda untuk mulai
              berlatih dan berprestasi bersama.</p>
          </div>
        </div>

        <!-- Club Results -->
        <div v-if="isSearching"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
          <div v-for="i in 3" :key="i" class="h-64 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse"></div>
        </div>
        <div v-else-if="clubResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div v-for="club in clubResults" :key="club.uuid"
            class="group bg-white rounded-2xl border-2 border-gray-100 transition-all shadow-sm hover:border-primary">
            <div class="h-20 bg-navy relative overflow-hidden rounded-t-2xl">
              <img v-if="club.banner_url" :src="club.banner_url"
                class="w-full h-full object-cover opacity-50 transition-transform group-hover:scale-105" />
              <div v-else class="w-full h-full bg-gradient-to-br from-navy to-navy-light opacity-80"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent"></div>
            </div>
            <div class="px-6 pb-6 pt-0 relative">
              <div class="flex items-start gap-4">
                <div
                  class="w-16 h-16 -mt-8 rounded-xl bg-white border-2 border-white shadow-lg overflow-hidden shrink-0 relative z-20">
                  <img :src="useImageOrDefault(club.avatar_url, club.name)" class="w-full h-full object-cover" />
                </div>
                <div class="min-w-0 flex-1 pt-2">
                  <h4 class="font-black text-navy truncate group-hover:text-primary transition-colors">{{ club.name }}
                  </h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span v-if="club.city" class="text-[10px] font-black uppercase tracking-widest text-primary">{{
                      club.city
                    }}</span>
                    <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">• {{ club.member_count
                      ||
                      0 }} Anggota</span>
                  </div>
                </div>
              </div>
              <div class="mt-6 flex gap-3">
                <NuxtLink :to="`/clubs/${club.slug}`" target="_blank" class="flex-1">
                  <BaseButton variant="outline" size="sm" block icon="ph:eye">
                    Lihat
                  </BaseButton>
                </NuxtLink>
                <BaseButton variant="primary" size="sm" block icon="ph:user-plus" @click="handleJoinClub(club)">
                  Gabung
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="hasSearched" class="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Icon icon="ph:magnifying-glass" class="text-4xl text-gray-200 mx-auto mb-3" />
          <p class="text-gray-400 font-bold">Klub tidak ditemukan</p>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <AppDialog v-model:show="confirmModal.show" :title="confirmModal.title" :message="confirmModal.message"
      :type="confirmModal.type" :icon="confirmModal.icon" :confirm-text="confirmModal.confirmText"
      @confirm="confirmModal.onConfirm" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Klub Saya - ArcheryHub Dashboard'
})

const { get, post, del } = useApi()
const toast = useToast()

const myMembership = ref(null)
const isLoadingMembership = ref(true)
const isLeaving = ref(false)

const searchQuery = ref('')
const clubResults = ref([])
const isSearching = ref(false)
const hasSearched = ref(false)

const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  type: 'primary',
  icon: '',
  confirmText: '',
  onConfirm: () => { }
})

const fetchMembership = async () => {
  isLoadingMembership.value = true
  try {
    const res = await get('/clubs/my/membership')
    if (res.data) {
      myMembership.value = res.data
    } else {
      myMembership.value = null
    }
  } catch (error) {
    console.error('Failed to fetch membership:', error)
  } finally {
    isLoadingMembership.value = false
  }
}

const searchClubs = async () => {
  if (!searchQuery.value) return
  isSearching.value = true
  hasSearched.value = true
  try {
    const res = await get(`/clubs?q=${encodeURIComponent(searchQuery.value)}&limit=12`)
    clubResults.value = res.data || []
  } catch (error) {
    console.error('Search failed:', error)
    toast.error('Gagal memuat daftar klub')
  } finally {
    isSearching.value = false
  }
}

const handleJoinClub = async (club) => {
  try {
    await post(`/clubs/join/${club.uuid}`)
    toast.success(`Permintaan bergabung ke ${club.name} telah dikirim`)
    await fetchMembership()
  } catch (error) {
    toast.error(error.message || 'Gagal mengajukan pendaftaran')
  }
}

const confirmLeaveClub = () => {
  confirmModal.value = {
    show: true,
    title: 'Keluar dari Klub',
    message: `Apakah Anda yakin ingin keluar dari ${myMembership.value.club_name}? Anda harus mendaftar ulang jika ingin kembali bergabung.`,
    type: 'danger',
    icon: 'ph:sign-out-bold',
    confirmText: 'Ya, Keluar Klub',
    onConfirm: handleLeaveClub
  }
}

const confirmCancelApplication = () => {
  confirmModal.value = {
    show: true,
    title: 'Batalkan Pengajuan',
    message: `Apakah Anda yakin ingin membatalkan pengajuan bergabung ke ${myMembership.value.club_name}?`,
    type: 'danger',
    icon: 'ph:x-circle-bold',
    confirmText: 'Ya, Batalkan',
    onConfirm: handleCancelApplication
  }
}

const handleLeaveClub = async () => {
  isLeaving.value = true
  try {
    await post('/clubs/leave')
    toast.success('Berhasil keluar dari klub')
    myMembership.value = null
    clubResults.value = []
    hasSearched.value = false
  } catch (error) {
    toast.error('Gagal keluar dari klub')
  } finally {
    isLeaving.value = false
  }
}

const handleCancelApplication = async () => {
  isLeaving.value = true
  try {
    await post('/clubs/cancel-application')
    toast.success('Pengajuan berhasil dibatalkan')
    myMembership.value = null
    clubResults.value = []
    hasSearched.value = false
  } catch (error) {
    toast.error('Gagal membatalkan pengajuan')
  } finally {
    isLeaving.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

onMounted(() => {
  fetchMembership()
})
</script>
