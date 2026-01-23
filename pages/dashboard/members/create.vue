<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[12px]" />
          <NuxtLink to="/dashboard/members" class="hover:text-primary transition-colors">Anggota Klub</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[12px]" />
          <span class="text-navy">Tambah Anggota</span>
        </div>
        <h1 class="text-3xl font-extrabold text-navy tracking-tight">Buat Anggota Klub</h1>
        <p class="text-gray-500 font-medium mt-1">Daftarkan pemanah baru dan otomatis kaitkan ke klub Anda.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-navy-dark transition"
          :disabled="isSubmitting"
          @click="submit">
          <Icon v-if="!isSubmitting" icon="ph:floppy-disk" class="text-lg" />
          <LoadingSpinner v-else size="sm" />
          <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Anggota' }}</span>
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <BaseInput v-model="form.full_name" label="Nama Lengkap" placeholder="Nama sesuai identitas" required />
          <BaseInput v-model="form.nickname" label="Nama Panggilan" placeholder="Opsional" />
          <BaseInput v-model="form.email" label="Email" type="email" placeholder="email@example.com" required />
          <BaseInput v-model="form.password" label="Password" type="password" placeholder="Minimal 6 karakter" required />
          <BaseInput v-model="form.phone" label="No. Telepon" type="tel" placeholder="08xxxxxxxxxx" />
          <BaseInput v-model="form.date_of_birth" label="Tanggal Lahir" type="date" />
          <BaseSelect v-model="form.gender" label="Jenis Kelamin" :items="genderOptions" />
          <BaseSelect v-model="form.bow_type" label="Jenis Busur" :items="bowOptions" />
          <BaseInput v-model="form.athlete_code" label="Kode Atlet (opsional)" placeholder="ARC-2025-001" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <BaseInput v-model="form.city" label="Kota/Kabupaten" placeholder="Contoh: Jakarta Selatan" />
          <BaseInput v-model="form.photo_url" label="Foto (URL)" placeholder="https://..." />
        </div>

        <div class="grid grid-cols-1 gap-5">
          <BaseTextarea v-model="form.address" label="Alamat" placeholder="Alamat domisili lengkap" :rows="3" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <BaseInput v-model="form.emergency_contact" label="Kontak Darurat" placeholder="Nama kontak darurat" />
          <BaseInput v-model="form.emergency_phone" label="Telepon Darurat" placeholder="08xxxxxxxxxx" />
        </div>

        <div class="bg-gray-50/60 border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
          Anggota baru akan otomatis ditandai sebagai <span class="font-semibold text-navy">pemanah klub</span> dan dapat login menggunakan email dan password yang Anda buat.
        </div>
      </div>

      <!-- Side Card -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 class="text-[11px] font-black text-navy uppercase tracking-[0.2em]">Informasi</h3>
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              {{ clubInitial }}
            </div>
            <div>
              <p class="font-semibold text-navy">{{ clubName || 'Klub Tidak Diketahui' }}</p>
              <p class="text-xs text-gray-400">Anggota baru akan dikaitkan ke klub ini.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({
  title: 'Tambah Anggota Klub',
  layout: 'dashboard',
  middleware: ['auth']
})

const router = useRouter()
const { get, post } = useApi()
const { user } = useAuth()
const toast = useToast()

const isSubmitting = ref(false)
const form = reactive({
  full_name: '',
  nickname: '',
  email: '',
  password: '',
  phone: '',
  date_of_birth: '',
  gender: 'male',
  bow_type: 'recurve',
  athlete_code: '',
  city: '',
  address: '',
  photo_url: '',
  emergency_contact: '',
  emergency_phone: ''
})

const genderOptions = [
  { title: 'Putra', value: 'male' },
  { title: 'Putri', value: 'female' }
]

const bowOptions = [
  { title: 'Recurve', value: 'recurve' },
  { title: 'Compound', value: 'compound' },
  { title: 'Barebow', value: 'barebow' },
  { title: 'Traditional', value: 'traditional' }
]

const clubName = computed(() => user.value?.club_name || user.value?.organization_name || user.value?.full_name || '')
const clubInitial = computed(() => (clubName.value || 'K')[0])


const submit = async () => {
  if (!form.full_name) {
    toast.error('Nama lengkap wajib diisi')
    return
  }
  if (!form.email) {
    toast.error('Email wajib diisi')
    return
  }
  if (!form.password || form.password.length < 6) {
    toast.error('Password wajib diisi minimal 6 karakter')
    return
  }
  if (!clubName.value) {
    toast.error('Profil klub belum lengkap')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      full_name: form.full_name,
      nickname: form.nickname || undefined,
      email: form.email,
      password: form.password,
      username: form.email.split('@')[0], // Generate username from email
      phone: form.phone || undefined,
      date_of_birth: form.date_of_birth || undefined,
      gender: form.gender === 'male' ? 'male' : 'female',
      bow_type: form.bow_type,
      athlete_code: form.athlete_code || undefined,
      city: form.city || undefined,
      address: form.address || undefined,
      photo_url: form.photo_url || undefined,
      emergency_contact: form.emergency_contact || undefined,
      emergency_phone: form.emergency_phone || undefined
    }

    await post('/archers', payload)
    toast.success('Anggota berhasil dibuat')
    router.push('/dashboard/members')
  } catch (error) {
    toast.error(error.response?.data?.error || 'Gagal membuat anggota')
  } finally {
    isSubmitting.value = false
  }
}
</script>

