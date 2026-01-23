<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight">Klub Saya</h1>
        <p class="text-gray-500 mt-1 font-medium">Kelola keanggotaan klub panahan Anda</p>
      </div>
    </div>

    <!-- Membership Status -->
    <div v-if="isLoadingMembership" class="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
      <div class="flex flex-col items-center gap-4">
        <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin" />
        <p class="text-gray-400 font-bold animate-pulse">Memuat data keanggotaan...</p>
      </div>
    </div>

    <!-- Active Membership -->
    <div v-else-if="myMembership" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Club Card -->
        <div class="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm">
          <div class="h-32 bg-navy relative overflow-hidden">
            <div class="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800" class="w-full h-full object-cover" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
            <div class="absolute -bottom-10 left-8">
                 <div class="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden">
                   <img v-if="myMembership.club_avatar_url || myMembership.avatar_url" :src="myMembership.club_avatar_url || myMembership.avatar_url" class="w-full h-full object-cover" />
                   <div v-else class="w-full h-full bg-primary flex items-center justify-center font-black text-navy text-2xl">
                      {{ myMembership.club_name?.charAt(0) || 'C' }}
                   </div>
                 </div>
            </div>
          </div>
          <div class="pt-12 p-8">
            <div class="flex flex-wrap items-start justify-between gap-4">
               <div>
                  <h2 class="text-2xl font-black text-navy">{{ myMembership.club_name }}</h2>
                  <p class="text-gray-500 font-medium">Status: 
                    <span :class="myMembership.status === 'active' ? 'text-green-500' : 'text-amber-500'" class="font-bold uppercase tracking-tighter ml-1">
                      {{ myMembership.status === 'active' ? 'Aktif' : 'Menunggu Persetujuan' }}
                    </span>
                  </p>
               </div>
               <div class="flex gap-2">
                 <BaseButton variant="outline" size="sm" icon="ph:sign-out" @click="confirmLeaveClub" :loading="isLeaving">
                   Keluar Klub
                 </BaseButton>
               </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
               <div>
                 <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Peran</p>
                 <p class="text-navy font-bold">{{ myMembership.role === 'member' ? 'Anggota' : 'Admin' }}</p>
               </div>
               <div>
                 <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bergabung Sejak</p>
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
          <p class="text-sm text-navy/70 leading-relaxed font-medium">
            Anda adalah anggota resmi <strong>{{ myMembership.club_name }}</strong>. Anda dapat melihat pengumuman internal dan berpartisipasi dalam event yang mewakili klub ini.
          </p>
        </div>
      </div>
    </div>

    <!-- No Membership / Directory Search -->
    <div v-else class="space-y-8">
      <div class="bg-white rounded-2xl border border-gray-100 p-10 text-center space-y-4">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
          <Icon icon="ph:buildings-bold" class="text-5xl text-gray-200" />
        </div>
        <div>
          <h3 class="text-xl font-black text-navy">Belum Bergabung dengan Klub</h3>
          <p class="text-gray-500 max-w-md mx-auto mt-2">Cari dan temukan klub panahan di sekitar Anda untuk mulai berlatih dan berprestasi bersama.</p>
        </div>
      </div>

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

        <!-- Club Results -->
        <div v-if="isSearching" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
           <div v-for="i in 3" :key="i" class="h-64 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse"></div>
        </div>
        <div v-else-if="clubResults.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div v-for="club in clubResults" :key="club.uuid" 
              class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-primary transition-all shadow-sm">
              <div class="h-24 bg-gray-100 relative overflow-hidden">
                <img v-if="club.banner_url" :src="club.banner_url" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div v-else class="w-full h-full bg-gradient-to-br from-navy to-navy-light"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div class="absolute bottom-3 left-4 flex items-center gap-2">
                  <span v-if="club.city" class="text-[10px] font-black bg-white/90 px-2 py-0.5 rounded-full text-navy uppercase">{{ club.city }}</span>
                </div>
              </div>
              <div class="p-5">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 -mt-8 rounded-lg bg-white border-2 border-white shadow-lg overflow-hidden shrink-0">
                    <img v-if="club.avatar_url" :src="club.avatar_url" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full bg-primary flex items-center justify-center font-black text-navy text-sm uppercase">
                      {{ club.name?.charAt(0) || 'C' }}
                    </div>
                  </div>
                  <div class="min-w-0">
                    <h4 class="font-bold text-navy truncate">{{ club.name }}</h4>
                    <p class="text-[10px] text-gray-400 font-bold uppercase">{{ club.member_count || 0 }} Anggota</p>
                  </div>
                </div>
                <div class="mt-4">
                  <NuxtLink :to="`/klub/${club.slug}`" class="block mb-2">
                    <BaseButton variant="outline" size="xs" block icon="ph:eye">
                      Lihat Detail
                    </BaseButton>
                  </NuxtLink>
                  <BaseButton variant="primary" size="xs" block icon="ph:user-plus" @click="handleJoinClub(club)">
                    Minta Bergabung
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

const { get, post, del } = useApi()
const toast = useToast()

const myMembership = ref(null)
const isLoadingMembership = ref(true)
const isLeaving = ref(false)

const searchQuery = ref('')
const clubResults = ref([])
const isSearching = ref(false)
const hasSearched = ref(false)

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
  if (confirm('Apakah Anda yakin ingin keluar dari klub ini?')) {
    handleLeaveClub()
  }
}

const handleLeaveClub = async () => {
  isLeaving.value = true
  try {
    await del('/clubs/my/membership')
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
