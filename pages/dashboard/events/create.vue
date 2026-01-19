<template>
  <div class="space-y-8">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col gap-6">
      <nav class="flex flex-wrap gap-2 items-center">
        <NuxtLink to="/dashboard" class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">
          Dashboard</NuxtLink>
        <span class="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
        <NuxtLink to="/dashboard/tournaments"
          class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">Events</NuxtLink>
        <span class="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
        <span class="text-navy text-sm font-bold">Buat Baru</span>
      </nav>

      <div class="flex flex-wrap justify-between gap-6 items-end">
        <div class="flex flex-col gap-3">
          <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Buat Event Baru</h1>
          <p class="text-text-secondary text-sm md:text-base font-medium max-w-2xl">{{ stepDescriptions[currentStep - 1]
          }}</p>
        </div>
        <div class="flex flex-col gap-3 min-w-[240px]">
          <div class="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-navy">
            <span>{{ stepTitles[currentStep - 1] }}</span>
            <span>Langkah {{ currentStep }} dari {{ totalSteps }}</span>
          </div>
          <div class="rounded-full bg-gray-200 h-2 w-full overflow-hidden">
            <div class="h-full rounded-full bg-primary transition-all duration-300"
              :style="{ width: (currentStep / totalSteps * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-10">

        <!-- Step 1: Basic Info -->
        <div v-if="currentStep === 1" class="flex flex-col gap-8">
          <FormSection icon="badge" title="Identitas Event">
            <div class="grid grid-cols-1 gap-6">
              <FormInput v-model="form.name" label="Nama Event" placeholder="contoh: National Indoor Championship 2024"
                required />
              <FormInput v-model="form.venue" label="Lokasi Venue" placeholder="Masukkan nama venue atau alamat"
                icon="location_on" />
            </div>
          </FormSection>

          <FormSection icon="calendar_month" title="Jadwal">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput v-model="form.startDate" label="Tanggal & Waktu Mulai" type="datetime-local" required />
              <FormInput v-model="form.endDate" label="Tanggal & Waktu Selesai" type="datetime-local" required />
            </div>
          </FormSection>

          <FormSection icon="description" title="Detail Event">
            <div class="flex flex-col gap-2">
              <span class="text-navy text-sm font-semibold">Deskripsi</span>
              <TiptapEditor v-model="form.description" />
            </div>
          </FormSection>
        </div>

        <!-- Step 2: Categories -->
        <div v-if="currentStep === 2" class="flex flex-col gap-8">
          <FormSection icon="category" title="Divisi & Kategori">
            <p class="text-text-secondary text-sm mb-4">Pilih divisi dan kategori yang tersedia untuk event ini.</p>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label v-for="div in availableDivisions" :key="div.code"
                class="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all"
                :class="form.divisions.includes(div.code) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                <input type="checkbox" :value="div.code" v-model="form.divisions" class="hidden" />
                <span class="material-symbols-outlined text-2xl"
                  :class="form.divisions.includes(div.code) ? 'text-primary' : 'text-gray-400'">{{ div.icon }}</span>
                <span class="font-semibold text-navy">{{ div.name }}</span>
              </label>
            </div>
          </FormSection>

          <FormSection icon="groups" title="Kategori Umur">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label v-for="cat in availableCategories" :key="cat.code"
                class="flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all text-center"
                :class="form.categories.includes(cat.code) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                <input type="checkbox" :value="cat.code" v-model="form.categories" class="hidden" />
                <span class="font-semibold text-sm"
                  :class="form.categories.includes(cat.code) ? 'text-navy' : 'text-gray-600'">{{ cat.name }}</span>
              </label>
            </div>
          </FormSection>
        </div>

        <!-- Step 3: Settings -->
        <div v-if="currentStep === 3" class="flex flex-col gap-8">
          <FormSection icon="payments" title="Biaya Pendaftaran">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput v-model.number="form.entryFee" label="Biaya Pendaftaran (Rp)" type="number"
                placeholder="350000" />
              <FormInput v-model="form.registrationDeadline" label="Batas Pendaftaran" type="datetime-local" />
            </div>
          </FormSection>

          <FormSection icon="tune" title="Pengaturan Lainnya">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput v-model.number="form.maxParticipants" label="Maksimal Peserta" type="number"
                placeholder="100" />
              <div class="flex flex-col gap-2">
                <span class="text-navy text-sm font-semibold">Status Awal</span>
                <select v-model="form.status"
                  class="form-input w-full rounded-lg text-navy border border-gray-200 bg-gray-50 h-12 px-4">
                  <option value="draft">Draft (Belum Dipublikasi)</option>
                  <option value="published">Published (Langsung Aktif)</option>
                </select>
              </div>
            </div>
          </FormSection>
        </div>

        <!-- Step 4: Review & Payment -->
        <div v-if="currentStep === 4" class="flex flex-col gap-8">
          <FormSection icon="summarize" title="Ringkasan Event">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Nama Event</span>
                  <span class="font-semibold text-navy">{{ form.name || '-' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Lokasi</span>
                  <span class="font-semibold text-navy">{{ form.venue || '-' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Tanggal Mulai</span>
                  <span class="font-semibold text-navy">{{ formatDate(form.startDate) }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Biaya Pendaftaran</span>
                  <span class="font-semibold text-navy">Rp {{ form.entryFee?.toLocaleString('id-ID') || '0' }}</span>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Divisi</span>
                  <span class="font-semibold text-navy">{{ form.divisions.length }} dipilih</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Kategori Umur</span>
                  <span class="font-semibold text-navy">{{ form.categories.length }} dipilih</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Maks. Peserta</span>
                  <span class="font-semibold text-navy">{{ form.maxParticipants || 'Tidak Dibatasi' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Status</span>
                  <span class="font-semibold"
                    :class="form.status === 'published' ? 'text-green-600' : 'text-amber-600'">
                    {{ form.status === 'published' ? 'Published' : 'Draft' }}
                  </span>
                </div>
              </div>
            </div>
          </FormSection>

          <!-- Platform Fee Notice -->
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div class="flex gap-4">
              <span class="material-symbols-outlined text-amber-500 text-2xl shrink-0">info</span>
              <div>
                <h4 class="font-bold text-amber-800 mb-1">Biaya Platform</h4>
                <p class="text-amber-700 text-sm">Archeryhub mengenakan biaya platform sebesar <strong>Rp
                    50.000</strong> untuk setiap event yang dipublikasikan. Pembayaran dapat dilakukan setelah event
                  dibuat.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col-reverse md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100 mt-4">
          <button v-if="currentStep > 1" type="button" @click="prevStep"
            class="w-full md:w-auto h-12 px-6 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 hover:text-navy transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Kembali</span>
          </button>
          <NuxtLink v-else to="/dashboard/tournaments"
            class="w-full md:w-auto h-12 px-6 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 hover:text-navy transition-colors flex items-center justify-center">
            Batal
          </NuxtLink>

          <button v-if="currentStep < totalSteps" type="button" @click="nextStep"
            class="w-full md:w-auto h-12 px-8 rounded-lg bg-primary text-navy font-bold hover:bg-primary-hover shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
            <span>Selanjutnya: {{ stepTitles[currentStep] }}</span>
            <span class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
          <button v-else type="submit" :disabled="isSubmitting"
            class="w-full md:w-auto h-12 px-8 rounded-lg bg-navy-dark text-white font-bold hover:bg-navy-light shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <span v-if="isSubmitting" class="material-symbols-outlined animate-spin">sync</span>
            <span>{{ isSubmitting ? 'Memproses...' : 'Buat Event' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const { post } = useApi()

const currentStep = ref(1)
const totalSteps = 4
const isSubmitting = ref(false)

const stepTitles = ['Info Dasar', 'Divisi', 'Pengaturan', 'Review']
const stepDescriptions = [
  'Mulai dengan mengisi detail penting untuk kompetisi Anda.',
  'Pilih divisi busur dan kategori umur yang tersedia.',
  'Atur biaya pendaftaran dan batas peserta.',
  'Periksa kembali semua informasi sebelum menyimpan.'
]

const form = reactive({
  name: '',
  venue: '',
  startDate: '',
  endDate: '',
  description: '',
  divisions: [],
  categories: [],
  entryFee: 350000,
  registrationDeadline: '',
  maxParticipants: null,
  status: 'draft'
})

const availableDivisions = [
  { code: 'recurve', name: 'Recurve', icon: 'sports' },
  { code: 'compound', name: 'Compound', icon: 'gps_fixed' },
  { code: 'barebow', name: 'Barebow', icon: 'adjust' },
  { code: 'traditional', name: 'Traditional', icon: 'forest' },
  { code: 'longbow', name: 'Longbow', icon: 'straighten' },
]

const availableCategories = [
  { code: 'u12', name: 'U-12' },
  { code: 'u15', name: 'U-15' },
  { code: 'u18', name: 'U-18' },
  { code: 'u21', name: 'U-21' },
  { code: 'senior', name: 'Senior' },
  { code: 'master40', name: 'Master 40+' },
  { code: 'master50', name: 'Master 50+' },
  { code: 'master60', name: 'Master 60+' },
]

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      name: form.name,
      venue: form.venue,
      start_date: form.startDate,
      end_date: form.endDate,
      description: form.description,
      entry_fee: form.entryFee,
      max_participants: form.maxParticipants,
      status: form.status,
      divisions: form.divisions,
      categories: form.categories,
      registration_deadline: form.registrationDeadline
    }

    const result = await post('/tournaments', payload)
    if (result?.id) {
      router.push(`/dashboard/tournaments/${result.id}/checkout`)
    }
  } catch (error) {
    console.error('Failed to create tournament:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
