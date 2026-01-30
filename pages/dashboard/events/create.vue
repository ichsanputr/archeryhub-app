<template>
  <div class="space-y-8">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col gap-6">
      <nav class="flex flex-wrap gap-2 items-center">
        <NuxtLink to="/dashboard" class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">
          Dashboard</NuxtLink>
        <Icon icon="ph:caret-right" class="text-gray-300 text-sm" />
        <NuxtLink to="/dashboard/events"
          class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">Events</NuxtLink>
        <Icon icon="ph:caret-right" class="text-gray-300 text-sm" />
        <span class="text-navy text-sm font-bold">Buat Baru</span>
      </nav>

      <div class="flex flex-wrap justify-between gap-6 items-end">
        <div class="flex flex-col gap-3">
          <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Buat event baru</h1>
          <p class="text-text-secondary text-sm md:text-base font-medium max-w-2xl">Lengkapi informasi dasar kompetisi
            panahan Anda.</p>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-10">

        <!-- Single Step: Event Info -->
        <div class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
          <FormSection icon="ph:identification-card" title="Identitas Event">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <BaseInput v-model="form.name" label="Nama Event"
                  placeholder="contoh: National Indoor Championship 2024" required :error="errors.name"
                  @blur="validate('name', form.name, [rules.required()])" />
              </div>
              <BaseInput v-model="form.venue" label="Lokasi Venue" placeholder="Masukkan nama venue atau alamat"
                icon="la:place-of-worship" />
              <BaseSelect v-model="form.type" label="Disiplin" :items="disciplineItems" required :error="errors.type"
                @blur="validate('type', form.type, [rules.required()])" />
              <BaseSelect v-model="form.city" label="Kota" :items="cityItems" required :error="errors.city"
                @blur="validate('city', form.city, [rules.required()])" />

              <div class="md:col-span-2">
                <BaseInput v-model="form.gmapsLink" label="Link Google Maps" placeholder="https://goo.gl/maps/..."
                  icon="ph:map-pin" @blur="validateGmapsLink" />

                <!-- Gmaps Preview -->
                <div v-if="gmapsEmbedUrl"
                  class="mt-2 rounded-xl overflow-hidden border border-gray-200 aspect-video w-full bg-gray-50">
                  <iframe width="100%" height="100%" style="border:0" loading="lazy" allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade" :src="gmapsEmbedUrl">
                  </iframe>
                </div>
                <p v-else-if="form.gmapsLink && !isValidGmaps" class="text-red-500 text-xs font-bold mt-1">
                  Link Google Maps tidak valid. Pastikan link diawali dengan https://goo.gl/maps/ atau
                  https://www.google.com/maps/
                </p>
              </div>
            </div>
          </FormSection>

          <FormSection icon="ant-design:schedule-outlined" title="Jadwal & Biaya">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.startDate" label="Tanggal & Waktu Mulai" type="datetime-local" required
                :error="errors.startDate" @blur="validate('startDate', form.startDate, [rules.required()])" />
              <BaseInput v-model="form.endDate" label="Tanggal & Waktu Selesai" type="datetime-local" required
                :error="errors.endDate" @blur="validate('endDate', form.endDate, [rules.required()])" />
              <BaseInput v-model.number="form.entryFee" label="Biaya pendaftaran (Rp)" type="number"
                placeholder="350000" />
              <BaseInput v-model="form.registrationDeadline" label="Batas pendaftaran" type="datetime-local" />
            </div>
          </FormSection>

          <!-- Event Images Section -->
          <FormSection icon="ph:images-bold" title="Gambar Event">
            <p class="text-text-secondary text-sm mb-4">Tambahkan gambar untuk event Anda. Gambar pertama akan menjadi
              thumbnail utama.</p>

            <div class="flex flex-wrap gap-4">
              <!-- Image Thumbnails -->
              <div v-for="(img, index) in form.images" :key="index"
                class="relative group w-32 h-32 rounded-xl overflow-hidden border-2 transition-all"
                :class="img.isPrimary ? 'border-primary shadow-lg shadow-primary/20' : 'border-gray-200'">
                <img :src="img.url" :alt="img.caption || 'Event image'" class="w-full h-full object-cover" />

                <!-- Overlay Actions -->
                <div
                  class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button type="button" @click="setPrimaryImage(index)"
                    class="text-white text-xs flex items-center gap-1 hover:text-primary transition-colors"
                    :class="{ 'text-primary': img.isPrimary }">
                    <Icon :icon="img.isPrimary ? 'ph:star-fill' : 'ph:star'" class="text-lg" />
                    {{ img.isPrimary ? 'Utama' : 'Set Utama' }}
                  </button>
                  <button type="button" @click="removeImage(index)"
                    class="text-white text-xs flex items-center gap-1 hover:text-red-400 transition-colors">
                    <Icon icon="ph:trash" class="text-lg" />
                    Hapus
                  </button>
                </div>

                <!-- Primary Badge -->
                <div v-if="img.isPrimary"
                  class="absolute top-1 left-1 bg-primary text-navy text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Utama
                </div>
              </div>

              <!-- Add Image Button -->
              <button type="button" @click="showImageModal = true"
                class="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary">
                <Icon icon="ph:plus-bold" class="text-2xl" />
                <span class="text-xs font-medium">Tambah</span>
              </button>
            </div>
          </FormSection>

          <!-- Payment Methods Section -->
          <FormSection icon="ph:credit-card" title="Metode Pembayaran">
            <p class="text-text-secondary text-sm mb-4">Tambahkan metode pembayaran yang tersedia untuk event ini.</p>

            <div class="space-y-4">
              <!-- Payment Method List -->
              <div v-for="(method, index) in form.paymentMethods" :key="index"
                class="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div class="flex items-start justify-between gap-4 mb-4">
                  <h4 class="text-sm font-bold text-navy">Metode {{ index + 1 }}</h4>
                  <button type="button" @click="removePaymentMethod(index)"
                    class="text-red-500 hover:text-red-700 transition-colors">
                    <Icon icon="ph:trash" class="text-lg" />
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <BaseInput v-model="method.payment_method" label="Nama Metode Pembayaran"
                      placeholder="contoh: Transfer Bank BCA" required />
                  </div>
                  <BaseInput v-model="method.account_name" label="Nama Pemilik Rekening"
                    placeholder="contoh: PT Archery Indonesia" />
                  <BaseInput v-model="method.account_number" label="Nomor Rekening/ID"
                    placeholder="contoh: 1234567890" />
                  <div class="md:col-span-2">
                    <BaseTextarea v-model="method.instructions" label="Instruksi Pembayaran (Opsional)"
                      placeholder="Tambahkan instruksi atau catatan khusus untuk metode pembayaran ini..." rows="3" />
                  </div>
                  <BaseInput v-model.number="method.display_order" label="Urutan Tampilan" type="number"
                    placeholder="0" />
                </div>
              </div>

              <!-- Add Payment Method Button -->
              <button type="button" @click="addPaymentMethod"
                class="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-gray-500 hover:text-primary font-medium">
                <Icon icon="ph:plus-circle" class="text-xl" />
                Tambah Metode Pembayaran
              </button>
            </div>
          </FormSection>

          <FormSection icon="ph:article" title="Detail Event">
            <div class="flex flex-col gap-1.5">
              <label class="text-navy text-sm font-bold ml-1">Deskripsi Lengkap</label>
              <div class="min-h-[300px]">
                <TiptapEditor v-model="form.description" />
              </div>
            </div>
          </FormSection>

          <FormSection icon="ph:gear" title="Pengaturan">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BaseSelect v-model="form.status" label="Status awal" :items="[
                { title: 'Draft (Belum dipublikasi)', value: 'draft' },
                { title: 'Published (Langsung aktif)', value: 'published' }
              ]" />
            </div>
          </FormSection>
        </div>


        <!-- Action Buttons -->
        <div
          class="flex flex-col-reverse md:flex-row items-center justify-end gap-3 pt-8 border-t border-gray-100 mt-4">
          <BaseButton to="/dashboard/events" variant="ghost" class="px-8">
            Batal
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSubmitting" loading-text="Memproses..." class="px-10">
            Buat event
          </BaseButton>
        </div>
      </form>
    </div>

    <!-- Media Library Modal -->
    <MediaLibrary :show="showImageModal" @close="showImageModal = false" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import TiptapEditor from '~/components/common/TiptapEditor.vue'
import FormSection from '~/components/common/FormSection.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import { useFormValidation } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const { get, post } = useApi()
const toast = useToast()

const isSubmitting = ref(false)

const { errors, validate, validateForm, rules, clearErrors } = useFormValidation()

const form = reactive({
  name: '',
  venue: '',
  gmapsLink: '',
  startDate: '',
  endDate: '',
  description: '',
  type: '', // Discipline
  city: '',
  divisions: [],
  categories: [],
  entryFee: 350000,
  registrationDeadline: '',
  status: 'draft',
  images: [],
  paymentMethods: []
})

const disciplines = ref([])
const disciplineItems = computed(() => disciplines.value.map(d => ({ title: d.name, value: d.id })))

const indonesianCities = [
  'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Makassar', 'Palembang',
  'Tangerang', 'Tangerang Selatan', 'Depok', 'Bekasi', 'Bogor', 'Yogyakarta',
  'Surakarta (Solo)', 'Denpasar', 'Malang', 'Bandar Lampung', 'Pontianak',
  'Banjarmasin', 'Samarinda', 'Balikpapan', 'Batam', 'Padang', 'Jambi',
  'Pekanbaru', 'Mataram', 'Kupang', 'Ambon', 'Jayapura', 'Manado'
].sort()

const cityItems = computed(() => indonesianCities.map(city => ({ title: city, value: city })))

onMounted(async () => {
  try {
    const res = await get('/disciplines')
    if (res?.disciplines) {
      disciplines.value = res.disciplines
    }
  } catch (err) {
    console.error('Failed to fetch disciplines', err)
  }
})

const isValidGmaps = ref(true)

const gmapsEmbedUrl = computed(() => {
  if (!form.gmapsLink || !isValidGmaps.value) return null

  // Basic heuristic to convert share links to search-based embed links
  // since we don't have an API key for the formal Embed API.
  // The 'output=embed' parameter works with search queries.
  try {
    const url = new URL(form.gmapsLink)
    if (url.hostname.includes('google.com') || url.hostname === 'goo.gl') {
      // If it's a short link or a complex link, we use the query if we can find it,
      // but the safest way without API is to use the venue name or the whole link
      // as a search parameter.
      return `https://maps.google.com/maps?q=${encodeURIComponent(form.gmapsLink)}&output=embed`
    }
  } catch (e) {
    return null
  }
  return null
})

const validateGmapsLink = () => {
  if (!form.gmapsLink) {
    isValidGmaps.value = true
    return
  }
  const regex = /^(https?:\/\/)?(www\.)?(google\.com\/maps|goo\.gl\/maps)\/.+$/
  isValidGmaps.value = regex.test(form.gmapsLink)
}

const showImageModal = ref(false)

// Handle media selection from MediaLibrary
const handleMediaSelect = ({ url, caption }) => {
  form.images.push({
    url,
    caption,
    isPrimary: form.images.length === 0
  })
}

const removeImage = (index) => {
  const wasPrimary = form.images[index].isPrimary
  form.images.splice(index, 1)
  if (wasPrimary && form.images.length > 0) {
    form.images[0].isPrimary = true
  }
}

const setPrimaryImage = (index) => {
  form.images.forEach((img, i) => {
    img.isPrimary = i === index
  })
}

// Payment Methods
const addPaymentMethod = () => {
  form.paymentMethods.push({
    payment_method: '',
    account_name: '',
    account_number: '',
    instructions: '',
    display_order: form.paymentMethods.length
  })
}

const removePaymentMethod = (index) => {
  form.paymentMethods.splice(index, 1)
  // Re-index display orders
  form.paymentMethods.forEach((method, i) => {
    if (!method.display_order) method.display_order = i
  })
}

const toggleValue = (arr, val) => {
  const index = arr.indexOf(val)
  if (index === -1) {
    arr.push(val)
  } else {
    arr.splice(index, 1)
  }
}

const validateStep = () => {
  const isBasicValid = validateForm(form, {
    name: [rules.required()],
    startDate: [rules.required()],
    endDate: [rules.required()],
    type: [rules.required()],
    city: [rules.required()]
  })

  // Additional validation: end date must be after start date
  if (form.startDate && form.endDate) {
    const startTime = new Date(form.startDate).getTime()
    const endTime = new Date(form.endDate).getTime()
    if (endTime <= startTime) {
      errors.endDate = 'Waktu selesai harus setelah waktu mulai'
      return false
    }
  }

  return isBasicValid
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}


const handleSubmit = async () => {
  if (!validateStep()) return

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
      city: form.city,
      gmaps_link: form.gmapsLink,
      start_date: formatToISO(form.startDate),
      end_date: formatToISO(form.endDate),
      description: form.description,
      entry_fee: form.entryFee,
      status: form.status,
      registration_deadline: formatToISO(form.registrationDeadline),
      type: form.type,
      images: form.images.map((img, i) => ({
        url: img.url,
        caption: img.caption,
        is_primary: img.isPrimary,
        display_order: i
      }))
    }

    const result = await post('/events', payload)

    if (result?.id || result?.uuid) {
      const eventId = result.id || result.uuid

      // Create payment methods if any
      if (form.paymentMethods.length > 0) {
        try {
          await Promise.all(
            form.paymentMethods
              .filter(m => m.payment_method) // Only create methods with names
              .map(method =>
                post(`/events/${eventId}/payment-methods`, {
                  payment_method: method.payment_method,
                  account_name: method.account_name || null,
                  account_number: method.account_number || null,
                  instructions: method.instructions || null,
                  display_order: method.display_order || 0
                })
              )
          )
        } catch (pmError) {
          console.error('Failed to create payment methods:', pmError)
          toast.warning('Event berhasil dibuat, namun ada masalah dengan metode pembayaran')
        }
      }

      toast.success('Event berhasil dibuat')
      router.push('/dashboard/events')
    }
  } catch (error) {
    console.error('Failed to create tournament:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.response?._data?.error || error?.message || 'Gagal membuat event'
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>
