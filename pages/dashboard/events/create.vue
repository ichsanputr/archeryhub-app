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

          <!-- Payment Channel Selection -->
          <FormSection icon="payments" title="Pilih Metode Pembayaran Untuk Aktivasi">
            <p class="text-text-secondary text-sm mb-6">
              Archeryhub mengenakan biaya platform sebesar <strong>Rp 50.000</strong> untuk aktivasi event.
              Pilih metode pembayaran sekarang untuk aktivasi instan.
            </p>

            <div v-if="isLoadingChannels" class="flex items-center justify-center py-8">
              <span class="material-symbols-outlined animate-spin text-3xl text-primary">sync</span>
            </div>

            <div v-else class="space-y-6">
              <!-- VA Group -->
              <div v-if="channelGroups.va?.length">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Virtual Account</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button v-for="channel in channelGroups.va" :key="channel.code" type="button"
                    @click="selectedMethod = channel.code"
                    :class="selectedMethod === channel.code ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 hover:border-gray-200'"
                    class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2">
                    <img :src="channel.icon_url" :alt="channel.name" class="h-6 object-contain" />
                    <span class="text-[10px] font-bold text-navy text-center leading-tight">{{ channel.name }}</span>
                  </button>
                </div>
              </div>

              <!-- E-Wallet Group -->
              <div v-if="channelGroups.ewallet?.length">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">E-Wallet</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button v-for="channel in channelGroups.ewallet" :key="channel.code" type="button"
                    @click="selectedMethod = channel.code"
                    :class="selectedMethod === channel.code ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 hover:border-gray-200'"
                    class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2">
                    <img :src="channel.icon_url" :alt="channel.name" class="h-6 object-contain" />
                    <span class="text-[10px] font-bold text-navy text-center leading-tight">{{ channel.name }}</span>
                  </button>
                </div>
              </div>

              <!-- Store Group -->
              <div v-if="channelGroups.store?.length">
                <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Retail Store</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button v-for="channel in channelGroups.store" :key="channel.code" type="button"
                    @click="selectedMethod = channel.code"
                    :class="selectedMethod === channel.code ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 hover:border-gray-200'"
                    class="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2">
                    <img :src="channel.icon_url" :alt="channel.name" class="h-6 object-contain" />
                    <span class="text-[10px] font-bold text-navy text-center leading-tight">{{ channel.name }}</span>
                  </button>
                </div>
              </div>
            </div>
          </FormSection>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col-reverse md:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100 mt-4">
          <button v-if="currentStep > 1" type="button" @click="prevStep"
            class="w-full md:w-auto h-12 px-6 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 hover:text-navy transition-colors flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Kembali</span>
          </button>
          <NuxtLink v-else to="/dashboard/events"
            class="w-full md:w-auto h-12 px-6 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 hover:text-navy transition-colors flex items-center justify-center">
            Batal
          </NuxtLink>

          <button v-if="currentStep < totalSteps" type="button" @click="nextStep"
            class="w-full md:w-auto h-12 px-8 rounded-lg bg-primary text-navy font-bold hover:bg-primary-hover shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
            <span>Selanjutnya: {{ stepTitles[currentStep] }}</span>
            <span class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
          <button v-else type="submit" :disabled="isSubmitting || !selectedMethod"
            class="w-full md:w-auto h-12 px-8 rounded-lg bg-navy-dark text-white font-bold hover:bg-navy-light shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <span v-if="isSubmitting" class="material-symbols-outlined animate-spin">sync</span>
            <span>{{ isSubmitting ? 'Memproses...' : 'Buat Event & Bayar' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Payment Instructions Dialog -->
    <AppDialog v-model:show="showPaymentDialog" title="Instruksi Pembayaran" type="primary" icon="payments">
      <div class="space-y-6">
        <div class="text-center">
          <p class="text-sm text-gray-500 mb-1">Total yang harus dibayar</p>
          <p class="text-3xl font-black text-navy">Rp {{ paymentResult?.amount?.toLocaleString('id-ID') }}</p>
        </div>

        <div v-if="paymentResult?.pay_code" class="bg-gray-50 rounded-xl p-6 text-center border border-gray-100">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kode Pembayaran / Virtual Account
          </p>
          <div class="flex items-center justify-center gap-3">
            <span class="text-2xl font-black text-navy tracking-widest">{{ paymentResult.pay_code }}</span>
            <button @click="copyToClipboard(paymentResult.pay_code)" class="text-primary hover:text-primary-hover">
              <span class="material-symbols-outlined text-xl">content_copy</span>
            </button>
          </div>
        </div>

        <div v-if="paymentResult?.qr_url" class="flex flex-col items-center gap-4">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Scan QR Code</p>
          <img :src="paymentResult.qr_url" alt="QR Code" class="w-48 h-48 rounded-xl border-4 border-white shadow-sm" />
        </div>

        <div class="space-y-4">
          <div class="flex justify-between text-sm py-2 border-b border-gray-50">
            <span class="text-gray-500">Event</span>
            <span class="font-bold text-navy truncate ml-4">{{ form.name }}</span>
          </div>
          <div class="flex justify-between text-sm py-2 border-b border-gray-50">
            <span class="text-gray-500">Metode</span>
            <span class="font-bold text-navy">{{ paymentResult?.payment_name }}</span>
          </div>
          <div class="flex justify-between text-sm py-2">
            <span class="text-gray-500">Berakhir Dalam</span>
            <span class="font-bold text-amber-600">{{ formatExpiry(paymentResult?.expired_time) }}</span>
          </div>
        </div>

        <div class="pt-4">
          <button @click="finishCreation"
            class="w-full h-12 rounded-xl bg-navy text-white font-bold hover:bg-navy-light transition-all">
            Saya Sudah Bayar / Selesai
          </button>
        </div>
      </div>
    </AppDialog>
  </div>
</template>

<script setup>
import TiptapEditor from '~/components/common/TiptapEditor.vue'
import FormSection from '~/components/common/FormSection.vue'
import FormInput from '~/components/common/FormInput.vue'
import AppDialog from '~/components/common/AppDialog.vue'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const { get, post } = useApi()

const currentStep = ref(1)
const totalSteps = 4
const isSubmitting = ref(false)
const isLoadingChannels = ref(true)
const channels = ref([])
const selectedMethod = ref(null)
const showPaymentDialog = ref(false)
const paymentResult = ref(null)

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

const channelGroups = computed(() => {
  const groups = { va: [], ewallet: [], store: [] }
  channels.value.forEach(ch => {
    if (ch.group === 'Virtual Account') groups.va.push(ch)
    else if (ch.group === 'E-Wallet') groups.ewallet.push(ch)
    else if (ch.group === 'Convenience Store') groups.store.push(ch)
  })
  return groups
})

onMounted(async () => {
  try {
    const result = await get('/payment/channels')
    console.log('Payment channels loaded:', result)
    channels.value = result || []
  } catch (error) {
    console.error('Failed to load payment channels:', error)
  } finally {
    isLoadingChannels.value = false
  }
})

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

const formatExpiry = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp * 1000).toLocaleString('id-ID')
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
  // TODO: Add toast notification
}

const finishCreation = () => {
  router.push('/dashboard/events')
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      code: form.name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
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
      registration_deadline: form.registrationDeadline,
      type: 'Outdoor' // Default
    }

    const result = await post('/events', payload)

    if (result?.id) {
      // Create payment immediately
      const paymentResponse = await post('/payment/create', {
        event_id: result.id,
        method: selectedMethod.value,
        type: 'platform_fee'
      })

      if (paymentResponse) {
        paymentResult.value = paymentResponse
        showPaymentDialog.value = true
      } else {
        router.push('/dashboard/events')
      }
    }
  } catch (error) {
    console.error('Failed to create tournament:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
