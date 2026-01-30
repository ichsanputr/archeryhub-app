<template>
  <div class="space-y-6">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[12px]" />
          <NuxtLink to="/dashboard/members" class="hover:text-primary transition-colors">Anggota Klub</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[12px]" />
          <span class="text-navy">{{ member?.full_name || 'Detail Anggota' }}</span>
        </div>
        <h1 class="text-3xl font-extrabold text-navy tracking-tight">
          {{ member?.full_name || 'Detail Anggota Klub' }}
        </h1>
        <p class="text-gray-500 font-medium mt-1">
          Profil lengkap pemanah dan riwayat partisipasi event di klub Anda.
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-sm text-navy shadow-sm hover:bg-gray-50 transition">
          <Icon icon="ph:pencil-simple" class="text-lg" />
          Edit Profil
        </button>
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm hover:bg-red-100 transition">
          <Icon icon="ph:user-minus" class="text-lg" />
          Keluar dari Klub
        </button>
      </div>
    </div>

    <!-- Top Layout: Profile Card + Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div class="flex items-center gap-4">
          <div
            class="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy to-blue-800 flex items-center justify-center overflow-hidden border-4 border-primary/20">
            <img v-if="member?.photo_url" :src="member.photo_url" class="w-full h-full object-cover" />
            <span v-else class="text-3xl font-black text-white">
              {{ member?.full_name?.charAt(0) || 'A' }}
            </span>
          </div>
          <div>
            <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Anggota Klub</p>
            <h2 class="text-xl font-extrabold text-navy leading-tight">
              {{ member?.full_name || 'Nama Anggota' }}
            </h2>
            <p class="text-xs text-gray-400 mt-1 flex items-center gap-2">
              <Icon :icon="genderIcon" :class="genderColor" class="text-base" />
              <span>{{ ageLabel }}</span>
              <span class="text-gray-300">•</span>
              <span>{{ member?.city || '-' }}</span>
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Jenis Busur</p>
            <p class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
               :class="bowBadgeClass">
              <Icon icon="ph:bow-and-arrow" class="text-base" />
              <span>{{ member?.bow_type || 'Recurve' }}</span>
            </p>
          </div>
          <div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Kategori Usia</p>
            <p class="text-sm font-semibold text-navy">
              {{ member?.age_group || ageLabel }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Kota</p>
            <p class="text-sm font-semibold text-navy">
              {{ member?.city || '—' }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
            <span
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
              :class="statusBadgeClass">
              <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
              {{ member?.status || 'Aktif' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Event Diikuti</p>
          <p class="text-3xl font-black text-navy">{{ member?.total_events || 0 }}</p>
          <p class="text-xs text-gray-400">Sejak bergabung dengan klub</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Best Qualification</p>
          <p class="text-3xl font-black text-navy">{{ member?.best_qualification || '-' }}</p>
          <p class="text-xs text-gray-400">Skor tertinggi kualifikasi</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Podium Finish</p>
          <p class="text-3xl font-black text-navy">{{ member?.podium_count || 0 }}</p>
          <p class="text-xs text-gray-400">Jumlah medali/podium</p>
        </div>
      </div>
    </div>

    <!-- Event History & Notes -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Event History -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
          <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em]">Riwayat Event</h3>
          <span class="text-xs text-gray-400 font-semibold">
            {{ (member?.events || []).length }} event
          </span>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="(ev, idx) in member?.events || []" :key="idx" class="px-6 py-4 flex items-center justify-between">
            <div>
              <p class="font-semibold text-navy">{{ ev.name }}</p>
              <p class="text-xs text-gray-400">
                {{ ev.location || '—' }} • {{ ev.date || '' }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-xs text-gray-400 uppercase font-black tracking-widest">Kualifikasi</p>
                <p class="text-sm font-bold text-navy">{{ ev.qualification_score || '-' }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-400 uppercase font-black tracking-widest">Hasil Akhir</p>
                <p class="text-sm font-bold text-navy">{{ ev.final_rank || '-' }}</p>
              </div>
            </div>
          </div>

          <div v-if="!member?.events || member.events.length === 0" class="px-6 py-16 text-center">
            <p class="text-sm text-gray-500">Belum ada riwayat event untuk anggota ini.</p>
          </div>
        </div>
      </div>

      <!-- Coach Notes -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em]">Catatan Pelatih</h3>
          <span class="text-[11px] text-gray-400">Hanya terlihat oleh staf klub</span>
        </div>
        <textarea
          v-model="coachNotes"
          rows="6"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 resize-none"
          placeholder="Tuliskan evaluasi teknik, mental, dan rekomendasi latihan untuk pemanah ini..."
        />
        <button
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-navy-dark transition">
          <Icon icon="ph:floppy-disk" class="text-lg" />
          Simpan Catatan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const route = useRoute()
const { get } = useApi()
const toast = useToast()

const member = ref(null)
const coachNotes = ref('')

definePageMeta({
  title: 'Detail Anggota Klub',
  layout: 'dashboard',
  middleware: ['auth']
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

const ageLabel = computed(() => {
  if (!member.value?.date_of_birth) return 'Usia tidak diketahui'
  return `${calculateAge(member.value.date_of_birth)} tahun`
})

const genderIcon = computed(() => {
  if (member.value?.gender === 'M') return 'ph:gender-male'
  if (member.value?.gender === 'F') return 'ph:gender-female'
  return 'ph:gender-neuter'
})

const genderColor = computed(() => {
  if (member.value?.gender === 'M') return 'text-blue-500'
  if (member.value?.gender === 'F') return 'text-pink-500'
  return 'text-gray-400'
})

const bowBadgeClass = computed(() => {
  const bow = member.value?.bow_type || 'Recurve'
  if (bow === 'Recurve') return 'bg-blue-50 text-blue-600'
  if (bow === 'Compound') return 'bg-purple-50 text-purple-600'
  if (bow === 'Barebow') return 'bg-amber-50 text-amber-600'
  return 'bg-gray-100 text-gray-600'
})

const statusBadgeClass = computed(() => {
  const status = (member.value?.status || 'active').toLowerCase()
  if (status === 'active') return 'bg-green-50 text-green-600 border border-green-100'
  if (status === 'inactive') return 'bg-gray-50 text-gray-500 border border-gray-200'
  return 'bg-amber-50 text-amber-600 border border-amber-100'
})

const fetchMember = async () => {
  try {
    const id = route.params.slug
    const resp = await get(`/archers/${id}`)
    member.value = resp || resp?.data || null
  } catch (error) {
    toast.error('Gagal memuat detail anggota')
  }
}

onMounted(() => {
  fetchMember()
})
</script>

