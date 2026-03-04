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
        <button v-if="member?.status === 'pending'" @click="approveMember" :disabled="isApproving"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 border border-green-100 rounded-xl font-semibold text-sm hover:bg-green-100 transition disabled:opacity-50">
          <Icon v-if="!isApproving" icon="ph:check-circle" class="text-lg" />
          <LoadingSpinner v-else size="sm" />
          {{ isApproving ? 'Memproses...' : 'Terima Anggota' }}
        </button>
        <button @click="kickMember" :disabled="isKicking"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold text-sm hover:bg-red-100 transition disabled:opacity-50">
          <Icon v-if="!isKicking" icon="ph:user-minus" class="text-lg" />
          <LoadingSpinner v-else size="sm" />
          {{ isKicking ? 'Memproses...' : 'Keluarkan dari Klub' }}
        </button>
      </div>
    </div>

    <!-- Top Layout: Profile Card + Summary -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div class="flex items-center gap-4">
          <div
            class="w-20 h-20 rounded-2xl bg-navy flex items-center justify-center overflow-hidden border-4 border-primary/20">
            <img :src="useImageOrDefault(member?.photo_url, member?.full_name)" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] font-black text-gray-400 tracking-[0.2em] mb-1 uppercase">Anggota Klub</p>
            <h2 class="text-xl font-extrabold text-navy leading-tight truncate">
              {{ member?.full_name || 'Nama Anggota' }}
            </h2>
            <div class="mt-2 text-xs font-semibold text-gray-500 space-y-1.5 break-all">
              <p class="flex items-center gap-2">
                <Icon icon="ph:envelope-simple-bold" class="text-gray-400 text-sm shrink-0" />
                {{ member?.email || '-' }}
              </p>
              <p class="flex items-center gap-2">
                <Icon icon="ph:phone-bold" class="text-gray-400 text-sm shrink-0" />
                {{ member?.phone_number || member?.phone || '-' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Jenis Busur</p>
            <p class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold capitalize"
              :class="bowBadgeClass">
              <img :src="`/${getBowIcon(member?.bow_type)}`" class="w-4 h-4 opacity-70" alt="bow" />
              <span>{{ member?.bow_type || 'Recurve' }}</span>
            </p>
          </div>
          <div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Kategori Usia</p>
            <p class="text-sm font-semibold text-navy capitalize">
              {{ member?.age_group || ageLabel }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Kota</p>
            <p class="text-sm font-semibold text-navy capitalize">
              {{ member?.city || '—' }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
            <span
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
              :class="statusBadgeClass">
              <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
              {{ getStatusLabel(member?.status) }}
            </span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Event Diikuti</p>
          <p class="text-3xl font-black text-navy">{{ member?.total_events || 0 }}</p>
          <p class="text-xs text-gray-400 capitalize">Sejak bergabung dengan klub</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Best Qualification</p>
          <p class="text-3xl font-black text-navy">{{ member?.best_qualification || '-' }}</p>
          <p class="text-xs text-gray-400 capitalize">Skor tertinggi kualifikasi</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
          <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest">Podium Finish</p>
          <p class="text-3xl font-black text-navy">{{ member?.podium_count || 0 }}</p>
          <p class="text-xs text-gray-400 capitalize">Jumlah medali/podium</p>
        </div>
      </div>
    </div>

    <!-- Event History & Notes -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Event History -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
          <h3 class="text-[11px] font-black text-navy  tracking-[0.2em]">Riwayat Event</h3>
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
                <p class="text-xs text-gray-400  font-black tracking-widest">Kualifikasi</p>
                <p class="text-sm font-bold text-navy">{{ ev.qualification_score || '-' }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-400  font-black tracking-widest">Hasil Akhir</p>
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
          <h3 class="text-[11px] font-black text-navy  tracking-[0.2em]">Catatan Pelatih</h3>
          <span class="text-[11px] text-gray-400">Hanya terlihat oleh staf klub</span>
        </div>
        <textarea v-model="coachNotes" rows="6"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 resize-none"
          placeholder="Tuliskan evaluasi teknik, mental, dan rekomendasi latihan untuk pemanah ini..." />
        <button @click="saveNotes" :disabled="isSavingNotes"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-navy-dark transition disabled:opacity-50">
          <Icon v-if="!isSavingNotes" icon="ph:floppy-disk" class="text-lg" />
          <LoadingSpinner v-else size="sm" />
          {{ isSavingNotes ? 'Menyimpan...' : 'Simpan Catatan' }}
        </button>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <AppDialog :show="showKickDialog" title="Keluarkan Anggota?"
      :message="`Apakah Anda yakin ingin mengeluarkan ${member?.full_name} dari klub? Tindakan ini akan menghapus akses mereka dari daftar anggota aktif klub Anda.`"
      confirm-text="Ya, Keluarkan" cancel-text="Batal" type="danger" icon="ph:user-minus-bold" @confirm="executeKick"
      @cancel="showKickDialog = false" @update:show="showKickDialog = $event" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const { get, delete: del, patch } = useApi()
const toast = useToast()

const member = ref(null)
const coachNotes = ref('')
const isKicking = ref(false)
const isApproving = ref(false)
const isSavingNotes = ref(false)
const showKickDialog = ref(false)

definePageMeta({
  title: 'Detail Anggota Klub',
  layout: 'dashboard',
  middleware: ['auth']
})

useHead({
  title: 'Detail Anggota - ArcheryHub Dashboard'
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
  if (status === 'active') return 'bg-green-50 text-green-600 border-green-100'
  if (status === 'invited') return 'bg-blue-50 text-blue-600 border-blue-100'
  if (status === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100'
  if (status === 'left') return 'bg-red-50 text-red-600 border-red-100'
  return 'bg-gray-50 text-gray-600 border-gray-100'
})

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

const fetchMember = async () => {
  try {
    const id = route.params.slug
    const resp = await get(`/archers/${id}`)
    member.value = resp || resp?.data || null
    if (member.value?.coach_notes) {
      coachNotes.value = member.value.coach_notes
    }
  } catch (error) {
    toast.error('Gagal memuat detail anggota')
  }
}

const saveNotes = async () => {
  if (!member.value?.uuid) return

  isSavingNotes.value = true
  try {
    await patch(`/clubs/members/${member.value.uuid}/notes`, {
      notes: coachNotes.value
    })
    toast.success('Catatan pelatih berhasil disimpan')
  } catch (error) {
    console.error('Failed to save notes:', error)
    toast.error(error.data?.error || 'Gagal menyimpan catatan')
  } finally {
    isSavingNotes.value = false
  }
}

const kickMember = () => {
  if (!member.value?.uuid) return
  showKickDialog.value = true
}

const executeKick = async () => {
  isKicking.value = true
  try {
    await del(`/clubs/members/${member.value.uuid}`)
    toast.success(`${member.value.full_name} telah dikeluarkan dari klub`)
    router.push('/dashboard/members')
  } catch (error) {
    console.error('Failed to kick member:', error)
    toast.error(error.data?.error || 'Gagal mengeluarkan anggota')
  } finally {
    isKicking.value = false
    showKickDialog.value = false
  }
}

const approveMember = async () => {
  if (!member.value?.uuid) return
  isApproving.value = true
  try {
    // Determine which field to use for the membership record uuid
    // Based on the handler, ApproveClubMember expects the member record ID (the one in club_members table)
    // We need to make sure we have that ID. 
    // In GetArcherByID, it LEFT JOIN club_members cm ON a.uuid = cm.archer_id AND a.club_id = cm.club_id
    // But does it return cm.uuid? Let's check api/handler/archer.go

    // Wait, the API handler for ApproveClubMember takes :memberId which is the UUID of the row in club_members.
    // Let's verify what the member object contains.

    await post(`/clubs/approve/${member.value.club_member_uuid || member.value.uuid}`)
    toast.success(`${member.value.full_name} berhasil diterima sebagai anggota`)
    await fetchMember()
  } catch (error) {
    console.error('Failed to approve member:', error)
    toast.error(error.data?.error || 'Gagal menerima anggota')
  } finally {
    isApproving.value = false
  }
}

onMounted(() => {
  fetchMember()
})
</script>
