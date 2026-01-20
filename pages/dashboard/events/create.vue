<template>
  <div class="space-y-8">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col gap-6">
      <nav class="flex flex-wrap gap-2 items-center">
        <NuxtLink to="/dashboard" class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">
          Dashboard</NuxtLink>
        <span class="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
        <NuxtLink to="/dashboard/events"
          class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">Events</NuxtLink>
        <span class="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
        <span class="text-navy text-sm font-bold">Buat Baru</span>
      </nav>

      <div class="flex flex-wrap justify-between gap-6 items-end">
        <div class="flex flex-col gap-3">
          <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Buat event baru</h1>
          <p class="text-text-secondary text-sm md:text-base font-medium max-w-2xl">{{ stepDescriptions[currentStep - 1]
          }}</p>
        </div>
        <div class="flex flex-col gap-3 min-w-[240px]">
          <div class="flex justify-between items-center text-xs font-bold tracking-wider text-navy">
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
        <div v-if="currentStep === 1" class="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4">
          <FormSection icon="badge" title="Identitas Event">
            <div class="grid grid-cols-1 gap-6">
              <BaseInput v-model="form.name" label="Nama Event" placeholder="contoh: National Indoor Championship 2024"
                required :error="errors.name" @blur="validate('name', form.name, [rules.required()])" />
              <BaseInput v-model="form.venue" label="Lokasi Venue" placeholder="Masukkan nama venue atau alamat"
                icon="location_on" />
              <BaseInput v-model="form.gmapsLink" label="Link Google Maps" placeholder="https://goo.gl/maps/..."
                icon="ph:map-pin" />
            </div>
          </FormSection>

          <FormSection icon="calendar_month" title="Jadwal">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.startDate" label="Tanggal & Waktu Mulai" type="datetime-local" required
                :error="errors.startDate" @blur="validate('startDate', form.startDate, [rules.required()])" />
              <BaseInput v-model="form.endDate" label="Tanggal & Waktu Selesai" type="datetime-local" required
                :error="errors.endDate" @blur="validate('endDate', form.endDate, [rules.required()])" />
            </div>
          </FormSection>

          <FormSection icon="description" title="Detail Event">
            <div class="flex flex-col gap-1.5">
              <label class="text-navy text-sm font-bold ml-1">Deskripsi</label>
              <TiptapEditor v-model="form.description" />
            </div>
          </FormSection>
        </div>

        <!-- Step 2: Categories & Settings -->
        <div v-if="currentStep === 2" class="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4">
          <FormSection icon="category" title="Divisi dan kategori">
            <p class="text-text-secondary text-sm mb-6">Pilih divisi dan kategori yang tersedia untuk event ini.</p>

            <div class="flex flex-col gap-8">
              <div class="flex flex-col gap-3">
                <label class="text-navy text-sm font-bold ml-1">Divisi busur</label>
                <div class="flex flex-wrap gap-3">
                  <button v-for="div in availableDivisions" :key="div.code" type="button"
                    @click="toggleValue(form.divisions, div.code)"
                    class="h-14 px-6 rounded-xl border-2 flex items-center gap-3 font-bold transition-all text-sm"
                    :class="form.divisions.includes(div.code) ? 'bg-primary border-primary text-navy shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-400 hover:border-primary/50'">
                    <span class="material-symbols-outlined">{{ div.icon }}</span>
                    {{ div.name }}
                  </button>
                </div>
                <p v-if="errors.divisions" class="text-red-500 text-[11px] font-bold ml-1">{{ errors.divisions }}</p>
              </div>

              <div class="flex flex-col gap-3">
                <label class="text-navy text-sm font-bold ml-1">Kategori umur</label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="cat in availableCategories" :key="cat.code" type="button"
                    @click="toggleValue(form.categories, cat.code)"
                    class="h-10 px-4 rounded-lg border-2 flex items-center font-bold transition-all text-xs"
                    :class="form.categories.includes(cat.code) ? 'bg-primary border-primary text-navy' : 'bg-white border-gray-100 text-gray-400 hover:border-primary/50'">
                    {{ cat.name }}
                  </button>
                </div>
                <p v-if="errors.categories" class="text-red-500 text-[11px] font-bold ml-1">{{ errors.categories }}</p>
              </div>
            </div>
          </FormSection>

          <FormSection icon="payments" title="Biaya pendaftaran">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model.number="form.entryFee" label="Biaya pendaftaran (Rp)" type="number"
                placeholder="350000" />
              <BaseInput v-model="form.registrationDeadline" label="Batas pendaftaran" type="datetime-local" />
            </div>
          </FormSection>

          <FormSection icon="tune" title="Pengaturan lainnya">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BaseInput v-model.number="form.maxParticipants" label="Maksimal peserta" type="number"
                placeholder="100" />

              <BaseSelect v-model="form.status" label="Status awal" :items="[
                { title: 'Draft (Belum dipublikasi)', value: 'draft' },
                { title: 'Published (Langsung aktif)', value: 'published' }
              ]" />
            </div>
          </FormSection>
        </div>

        <!-- Step 3: Review -->
        <div v-if="currentStep === 3" class="flex flex-col gap-8">
          <FormSection icon="summarize" title="Ringkasan event">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Nama event</span>
                  <span class="font-semibold text-navy">{{ form.name || '-' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Lokasi</span>
                  <span class="font-semibold text-navy">{{ form.venue || '-' }}</span>
                </div>
                <div v-if="form.gmapsLink" class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Gmaps Link</span>
                  <span class="font-semibold text-primary truncate max-w-xs">{{ form.gmapsLink }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Tanggal mulai</span>
                  <span class="font-semibold text-navy">{{ formatDate(form.startDate) }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Biaya pendaftaran</span>
                  <span class="font-semibold text-navy">Rp {{ form.entryFee?.toLocaleString('id-ID') || '0' }}</span>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Divisi</span>
                  <span class="font-semibold text-navy">{{ form.divisions.length }} dipilih</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Kategori umur</span>
                  <span class="font-semibold text-navy">{{ form.categories.length }} dipilih</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-500">Maks. peserta</span>
                  <span class="font-semibold text-navy">{{ form.maxParticipants || 'Tidak dibatasi' }}</span>
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
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col-reverse md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100 mt-4">
          <BaseButton v-if="currentStep > 1" type="button" variant="outline" icon="arrow_back" @click="prevStep" block
            class="md:w-auto">
            Kembali
          </BaseButton>
          <BaseButton v-else to="/dashboard/events" variant="outline" block class="md:w-auto">
            Batal
          </BaseButton>

          <BaseButton v-if="currentStep < totalSteps" type="button" variant="gold" icon-right="arrow_forward"
            @click="nextStep" block class="md:w-auto">
            Selanjutnya: {{ stepTitles[currentStep] }}
          </BaseButton>
          <BaseButton v-else type="submit" variant="primary" :loading="isSubmitting" loading-text="Memproses..." block
            class="md:w-auto">
            Buat event
          </BaseButton>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup>
import TiptapEditor from '~/components/common/TiptapEditor.vue'
import FormSection from '~/components/common/FormSection.vue'
import { useFormValidation } from '~/composables/useFormValidation'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const { get, post } = useApi()

const currentStep = ref(1)
const totalSteps = 3
const isSubmitting = ref(false)

const { errors, validate, validateForm, rules, clearErrors } = useFormValidation()

const stepTitles = ['Info dasar', 'Divisi dan pengaturan', 'Review']
const stepDescriptions = [
  'Mulai dengan mengisi detail penting untuk kompetisi Anda.',
  'Pilih divisi, kategori, dan atur detail event.',
  'Periksa kembali semua informasi sebelum menyimpan.'
]

const form = reactive({
  name: '',
  venue: '',
  gmapsLink: '',
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


const toggleValue = (arr, val) => {
  const index = arr.indexOf(val)
  if (index === -1) {
    arr.push(val)
  } else {
    arr.splice(index, 1)
  }
}

const validateStep = (step) => {
  if (step === 1) {
    return validateForm(form, {
      name: [rules.required()],
      startDate: [rules.required()],
      endDate: [rules.required()]
    })
  } else if (step === 2) {
    let isValid = true
    if (form.divisions.length === 0) {
      errors.divisions = 'Pilih minimal satu divisi'
      isValid = false
    } else {
      errors.divisions = null
    }
    if (form.categories.length === 0) {
      errors.categories = 'Pilih minimal satu kategori'
      isValid = false
    } else {
      errors.categories = null
    }
    return isValid
  }
  return true
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
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
  if (!validateStep(currentStep.value)) return

  isSubmitting.value = true
  try {
    const formatToISO = (dateStr) => {
      if (!dateStr) return null
      // dateStr from datetime-local is YYYY-MM-DDTHH:mm
      // Append :00Z or convert via Date object
      return new Date(dateStr).toISOString()
    }

    const payload = {
      code: form.name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
      name: form.name,
      venue: form.venue,
      gmaps_link: form.gmapsLink,
      start_date: formatToISO(form.startDate),
      end_date: formatToISO(form.endDate),
      description: form.description,
      entry_fee: form.entryFee,
      max_participants: form.maxParticipants,
      status: form.status,
      divisions: form.divisions,
      categories: form.categories,
      registration_deadline: formatToISO(form.registrationDeadline),
      type: 'Outdoor' // Default
    }

    const result = await post('/events', payload)

    if (result?.id) {
      router.push('/dashboard/events')
    }
  } catch (error) {
    console.error('Failed to create tournament:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
