<template>
  <div class="space-y-8">
    <!-- Breadcrumb & Header -->
    <DashboardHeader
      :title="t('event_create.title')"
      :subtitle="t('event_create.subtitle')"
      icon="ph:calendar-plus-bold"
      back-to="/dashboard/organizer/events"
      :breadcrumbs="[
        { label: t('dashboard.sidebar.overview'), to: '/dashboard/organizer' },
        { label: t('dashboard.sidebar.event'), to: '/dashboard/organizer/events' },
        { label: t('event_create.breadcrumb_new') }
      ]"
    />

    <!-- Form Card -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-10">

        <!-- Single Step: Event Info -->
        <div class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
          <!-- Package / Quota Selector (Placed on Top) -->
          <FormSection icon="ph:package-bold" title="Pilihan Paket Kuota Event">
            <div class="space-y-4">
              <!-- Quota Balance Header Bar -->
              <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-xs font-black tracking-wider text-slate-500">Saldo Kuota Anda:</span>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-navy border border-slate-200 text-xs font-bold shadow-2xs">
                    <Icon icon="ph:gift-bold" class="text-sm text-primary" />
                    Free: {{ quotaBalance.quota_free ?? 20 }}/20 Kuota
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-navy border border-slate-200 text-xs font-bold shadow-2xs">
                    <Icon icon="ph:check-circle-bold" class="text-sm text-primary" />
                    Standard: {{ quotaBalance.quota_standard || 0 }} Kuota
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-navy border border-slate-200 text-xs font-bold shadow-2xs">
                    <Icon icon="ph:crown-bold" class="text-sm text-primary" />
                    Elite: {{ quotaBalance.quota_elite || 0 }} Kuota
                  </div>
                </div>

                <NuxtLink
                  to="/dashboard/organizer/package"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white hover:bg-navy-dark text-xs font-bold transition-all shadow-sm"
                >
                  <Icon icon="ph:plus-circle-bold" class="text-sm text-primary" />
                  Beli / Tambah Kuota
                </NuxtLink>
              </div>

              <!-- 3-Package Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Free Package Card -->
                <div
                  @click="(quotaBalance.quota_free ?? 20) > 0 ? form.quotaType = 'free' : null"
                  class="relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all select-none group"
                  :class="[
                    (quotaBalance.quota_free ?? 20) <= 0 ? 'border-slate-200 bg-slate-50/70 opacity-75 cursor-not-allowed' : 'cursor-pointer',
                    form.quotaType === 'free' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                  ]"
                >
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                      <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider bg-slate-100 text-slate-700">
                        Bonus Awal (20 Kuota)
                      </div>
                      <div
                        v-if="(quotaBalance.quota_free ?? 20) > 0"
                        class="size-5 rounded-full border-2 flex items-center justify-center transition-colors"
                        :class="form.quotaType === 'free' ? 'border-navy bg-navy text-primary' : 'border-slate-300 group-hover:border-slate-400'"
                      >
                        <Icon v-if="form.quotaType === 'free'" icon="ph:check-bold" class="text-xs" />
                      </div>
                      <span v-else class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        Kuota Habis
                      </span>
                    </div>

                    <h4 class="text-lg font-black text-navy mb-1">Free Tier</h4>
                    <div class="text-xs text-slate-500 font-medium mb-4">Event Latihan / Internal Klub</div>

                    <div class="space-y-2.5 text-xs font-medium text-slate-600 border-t border-slate-100 pt-3">
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:users-bold" class="text-slate-400 text-sm shrink-0" />
                        <span>Maks. <strong>50 Peserta</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:squares-four-bold" class="text-slate-400 text-sm shrink-0" />
                        <span><strong>Kategori Tanpa Batas</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:device-tablet-speaker-bold" class="text-slate-400 text-sm shrink-0" />
                        <span><strong>Scorekeeper Tanpa Batas</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:hard-drive-bold" class="text-slate-400 text-sm shrink-0" />
                        <span>100 MB Penyimpanan Media</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-100">
                    <div v-if="(quotaBalance.quota_free ?? 20) > 0" class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-400">Gunakan:</span>
                      <span class="text-xs font-black text-navy">1 Kuota (Sisa: {{ quotaBalance.quota_free ?? 20 }}/20)</span>
                    </div>
                    <div v-else class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-400">Sisa 0 Kuota Free</span>
                      <span class="text-xs font-bold text-slate-500">Pilih Standard/Elite</span>
                    </div>
                  </div>
                </div>

                <!-- Standard Package Card -->
                <div
                  @click="quotaBalance.quota_standard > 0 ? form.quotaType = 'standard' : null"
                  class="relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all select-none group"
                  :class="[
                    quotaBalance.quota_standard <= 0 ? 'border-slate-200 bg-slate-50/70 opacity-75 cursor-not-allowed' : 'cursor-pointer',
                    form.quotaType === 'standard' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                  ]"
                >
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                      <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider bg-slate-100 text-slate-700">
                        Event Komunitas
                      </div>
                      <div
                        v-if="quotaBalance.quota_standard > 0"
                        class="size-5 rounded-full border-2 flex items-center justify-center transition-colors"
                        :class="form.quotaType === 'standard' ? 'border-navy bg-navy text-primary' : 'border-slate-300 group-hover:border-slate-400'"
                      >
                        <Icon v-if="form.quotaType === 'standard'" icon="ph:check-bold" class="text-xs" />
                      </div>
                      <span v-else class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        Kuota Habis
                      </span>
                    </div>

                    <h4 class="text-lg font-black text-navy mb-1">Standard EO</h4>
                    <div class="text-xs text-slate-500 font-medium mb-4">Turnamen Daerah / Sirkuit</div>

                    <div class="space-y-2.5 text-xs font-medium text-slate-600 border-t border-slate-100 pt-3">
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:users-bold" class="text-slate-400 text-sm shrink-0" />
                        <span>Maks. <strong>200 Peserta</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:squares-four-bold" class="text-slate-400 text-sm shrink-0" />
                        <span><strong>Kategori Tanpa Batas</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:device-tablet-speaker-bold" class="text-slate-400 text-sm shrink-0" />
                        <span><strong>Scorekeeper Tanpa Batas</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:hard-drive-bold" class="text-slate-400 text-sm shrink-0" />
                        <span>500 MB Penyimpanan Media</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-100">
                    <div v-if="quotaBalance.quota_standard > 0" class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-400">Gunakan:</span>
                      <span class="text-xs font-black text-navy">1 Kuota (Sisa: {{ quotaBalance.quota_standard }})</span>
                    </div>
                    <div v-else class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-400">Sisa 0 Kuota</span>
                      <NuxtLink to="/dashboard/organizer/package" class="text-xs font-bold text-navy hover:underline flex items-center gap-0.5">
                        Beli Kuota <Icon icon="ph:arrow-right" class="text-[10px]" />
                      </NuxtLink>
                    </div>
                  </div>
                </div>

                <!-- Elite Package Card -->
                <div
                  @click="quotaBalance.quota_elite > 0 ? form.quotaType = 'elite' : null"
                  class="relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all select-none group"
                  :class="[
                    quotaBalance.quota_elite <= 0 ? 'border-slate-200 bg-slate-50/70 opacity-75 cursor-not-allowed' : 'cursor-pointer',
                    form.quotaType === 'elite' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                  ]"
                >
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                      <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider bg-slate-100 text-slate-700">
                        Kejurnas & Open
                      </div>
                      <div
                        v-if="quotaBalance.quota_elite > 0"
                        class="size-5 rounded-full border-2 flex items-center justify-center transition-colors"
                        :class="form.quotaType === 'elite' ? 'border-navy bg-navy text-primary' : 'border-slate-300 group-hover:border-slate-400'"
                      >
                        <Icon v-if="form.quotaType === 'elite'" icon="ph:check-bold" class="text-xs" />
                      </div>
                      <span v-else class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        Kuota Habis
                      </span>
                    </div>

                    <h4 class="text-lg font-black text-navy mb-1">Elite EO</h4>
                    <div class="text-xs text-slate-500 font-medium mb-4">Turnamen Skala Nasional / Internasional</div>

                    <div class="space-y-2.5 text-xs font-medium text-slate-600 border-t border-slate-100 pt-3">
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:users-bold" class="text-slate-400 text-sm shrink-0" />
                        <span><strong>Peserta Tanpa Batas</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:squares-four-bold" class="text-slate-400 text-sm shrink-0" />
                        <span><strong>Kategori Tanpa Batas</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:device-tablet-speaker-bold" class="text-slate-400 text-sm shrink-0" />
                        <span><strong>Scorekeeper Tanpa Batas</strong></span>
                      </div>
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:hard-drive-bold" class="text-slate-400 text-sm shrink-0" />
                        <span>5 GB Penyimpanan Media</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-slate-100">
                    <div v-if="quotaBalance.quota_elite > 0" class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-400">Gunakan:</span>
                      <span class="text-xs font-black text-navy">1 Kuota (Sisa: {{ quotaBalance.quota_elite }})</span>
                    </div>
                    <div v-else class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-400">Sisa 0 Kuota</span>
                      <NuxtLink to="/dashboard/organizer/package" class="text-xs font-bold text-navy hover:underline flex items-center gap-0.5">
                        Beli Kuota <Icon icon="ph:arrow-right" class="text-[10px]" />
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon="ph:identification-card" :title="t('event_create.section_identity')">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <BaseInput v-model="form.name" :label="t('event_create.field_name')"
                  :placeholder="t('event_create.field_name_placeholder')" required :error="errors.name"
                  @blur="validate('name', form.name, [rules.required()])" />
              </div>
              <div class="md:col-span-2">
                <BaseInput v-model="form.slug" :label="t('event_create.field_slug')"
                  :placeholder="t('event_create.field_slug_placeholder')" required :error="errors.slug"
                  @input="onSlugInput"
                  @blur="validate('slug', form.slug, [rules.required(), rules.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('event_create.slug_validation'))])" />
                <div class="text-xs text-gray-500 mt-1.5">
                  {{ t('event_create.slug_hint') }}
                </div>
              </div>
              <BaseInput v-model="form.venue" :label="t('event_create.field_venue')" :placeholder="t('event_create.field_venue_placeholder')"
                icon="la:place-of-worship" />
              <BaseSelect v-model="form.country" :label="t('event_create.field_country')" :items="countryItems" required :error="errors.country"
                @blur="validate('country', form.country, [rules.required()])" />
              <BaseSelect v-model="form.type" :label="t('event_create.field_location_type')" :items="disciplineItems" required :error="errors.type"
                @blur="validate('type', form.type, [rules.required()])" />

              <div class="md:col-span-2">
                <BaseInput v-model="form.gmapsLink" :label="t('event_create.field_gmaps')" :placeholder="t('event_create.field_gmaps_placeholder')"
                  icon="ph:map-pin" @blur="validateGmapsLink" />

                <!-- Gmaps Preview -->
                <div v-if="gmapsEmbedUrl"
                  class="mt-2 rounded-xl overflow-hidden border border-gray-200 aspect-video w-full bg-gray-50">
                  <iframe width="100%" height="100%" style="border:0" loading="lazy" allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade" :src="gmapsEmbedUrl">
                  </iframe>
                </div>
                <div v-else-if="form.gmapsLink && !isValidGmaps" class="text-red-500 text-xs font-bold mt-1">
                  {{ t('event_create.gmaps_invalid') }}
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon="ant-design:schedule-outlined" :title="t('event_create.section_schedule')">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
                  {{ t('event_create.field_start_date') }} <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <BaseDatePicker v-model="startDateDate" :placeholder="t('event_create.field_start_date')" :error="errors.startDate" />
                  <BaseTimePicker v-model="startDateTime" placeholder="08:00" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
                  {{ t('event_create.field_end_date') }} <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <BaseDatePicker v-model="endDateDate" :placeholder="t('event_create.field_end_date')" :error="errors.endDate" />
                  <BaseTimePicker v-model="endDateTime" placeholder="17:00" />
                </div>
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
                  {{ t('event_create.field_registration_deadline') }}
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <BaseDatePicker v-model="regDate" :placeholder="t('event_create.field_registration_deadline')" />
                  <BaseTimePicker v-model="regTime" placeholder="23:59" />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon="ph:article" :title="t('event_create.section_details')">
            <div class="flex flex-col gap-1.5">
              <label class="text-navy text-sm font-bold ml-1">{{ t('event_create.field_description') }}</label>
              <div class="min-h-[300px]">
                <TiptapEditor v-model="form.description" />
              </div>
            </div>
          </FormSection>

          <FormSection icon="ph:gear" :title="t('event_create.section_settings')">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BaseSelect v-model="form.status" :label="t('event_create.field_initial_status')" :items="[
                { title: t('event_create.status_draft'), value: 'draft' },
                { title: t('event_create.status_published'), value: 'published' }
              ]" />
            </div>
          </FormSection>
        </div>


        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-8 border-t border-gray-100 mt-4">
          <BaseButton to="/dashboard/organizer/events" variant="ghost" class="px-8 whitespace-nowrap">
            {{ t('event_create.button_cancel') }}
          </BaseButton>
          <BaseButton type="submit" variant="primary" :loading="isSubmitting" class="px-10 whitespace-nowrap">
            {{ t('event_create.button_create') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import TiptapEditor from '~/components/common/TiptapEditor.client.vue'
import FormSection from '~/components/common/FormSection.vue'
import { useFormValidation } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { useSubscription } from '~/composables/useSubscription'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useHead({
  title: computed(() => `${t('event_create.page_title')} - Archeris Dashboard`)
})

const router = useRouter()
const { get, post } = useApi()
const toast = useToast()
const { isSubscriptionActive } = useSubscription()

const isSubmitting = ref(false)

const { errors, validate, validateForm, rules, clearErrors } = useFormValidation()

const form = reactive({
  name: '',
  slug: '',
  venue: '',
  country: 'Indonesia',
  gmapsLink: '',
  startDate: '',
  endDate: '',
  description: '',
  type: '', // Discipline
  registrationDeadline: '',
  status: 'draft',
  quotaType: 'free'
})

const quotaBalance = ref({
  quota_free: 20,
  quota_standard: 0,
  quota_elite: 0,
  total_quota: 20
})

const startDateDate = ref('')
const startDateTime = ref('08:00')
const endDateDate = ref('')
const endDateTime = ref('17:00')
const regDate = ref('')
const regTime = ref('23:59')

watch([startDateDate, startDateTime], () => {
  form.startDate = startDateDate.value ? `${startDateDate.value}T${startDateTime.value || '00:00'}` : ''
})

watch([endDateDate, endDateTime], () => {
  form.endDate = endDateDate.value ? `${endDateDate.value}T${endDateTime.value || '00:00'}` : ''
})

watch([regDate, regTime], () => {
  form.registrationDeadline = regDate.value ? `${regDate.value}T${regTime.value || '00:00'}` : ''
})

const isSlugManuallyEdited = ref(false)

const slugify = (value) => {
  return (value || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

watch(() => form.name, (newName) => {
  if (!isSlugManuallyEdited.value) {
    form.slug = slugify(newName)
  }
})

const onSlugInput = () => {
  form.slug = slugify(form.slug)
  isSlugManuallyEdited.value = true
}

const disciplines = ref([])
const disciplineItems = computed(() => {
  const excluded = new Set(['3d', 'field'])
  return disciplines.value
    .filter((d) => {
      const name = (d?.name || '').toString().trim().toLowerCase()
      const code = (d?.code || '').toString().trim().toLowerCase()
      return !excluded.has(name) && !excluded.has(code)
    })
    .map((d) => ({ title: d.name, value: d.name }))
})

const countries = [
  'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Philippines', 
  'Vietnam', 'Myanmar', 'Cambodia', 'Laos', 'Brunei',
  'Australia', 'New Zealand', 'Japan', 'South Korea', 'China',
  'India', 'United States', 'United Kingdom', 'Germany', 'France',
  'Other'
].sort()

const countryItems = computed(() => countries.map(country => ({ title: country, value: country })))

onMounted(async () => {
  if (!isSubscriptionActive.value) {
    toast.error(t('premium.msg_create_event'))
    router.replace('/dashboard/organizer/events')
    return
  }
  try {
    const [resDisc, resQuota] = await Promise.all([
      get('/disciplines'),
      get('/organizers/me/quota').catch(() => null)
    ])
    if (resDisc?.disciplines) {
      disciplines.value = resDisc.disciplines
    }
    if (resQuota) {
      quotaBalance.value = {
        quota_free: resQuota.quota_free ?? 20,
        quota_standard: resQuota.quota_standard || 0,
        quota_elite: resQuota.quota_elite || 0,
        total_quota: resQuota.total_quota ?? 20
      }
      if ((quotaBalance.value.quota_free ?? 20) > 0) {
        form.quotaType = 'free'
      } else if (quotaBalance.value.quota_standard > 0) {
        form.quotaType = 'standard'
      } else if (quotaBalance.value.quota_elite > 0) {
        form.quotaType = 'elite'
      } else {
        form.quotaType = 'free'
      }
    }
  } catch (err) {
    console.error('Failed to fetch initial data', err)
  }
})

const isValidGmaps = ref(true)

const gmapsEmbedUrl = computed(() => {
  if (!form.gmapsLink || !isValidGmaps.value) return null

  try {
    const url = new URL(form.gmapsLink)
    if (url.hostname.includes('google.com') || url.hostname === 'goo.gl') {
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

const validateStep = () => {
  const isBasicValid = validateForm(form, {
    name: [rules.required()],
    slug: [rules.required(), rules.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('event_create.slug_validation'))],
    startDate: [rules.required()],
    endDate: [rules.required()],
    type: [rules.required()],
    country: [rules.required()]
  })

  // Additional validation: end date must be after start date
  if (form.startDate && form.endDate) {
    const startTime = new Date(form.startDate).getTime()
    const endTime = new Date(form.endDate).getTime()
    if (endTime <= startTime) {
      errors.endDate = t('event_create.end_date_validation')
      return false
    }
  }

  return isBasicValid
}

const handleSubmit = async () => {
  if (!validateStep()) return

  isSubmitting.value = true
  try {
    const formatToISO = (dateStr) => {
      if (!dateStr) return null
      return new Date(dateStr).toISOString()
    }

    const payload = {
      code: form.name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
      name: form.name,
      slug: form.slug,
      venue: form.venue,
      country: form.country,
      gmaps_link: form.gmapsLink,
      start_date: formatToISO(form.startDate),
      end_date: formatToISO(form.endDate),
      description: form.description,
      status: form.status,
      registration_deadline: formatToISO(form.registrationDeadline),
      location_type: form.type,
      quota_type: form.quotaType
    }

    const result = await post('/events', payload)

    if (result?.id || result?.uuid) {
      toast.success(t('event_create.success_message'))
      router.push('/dashboard/organizer/events')
    }
  } catch (error) {
    console.error('Failed to create tournament:', error)
    toast.error(getApiErrorMessage(error, t('event_create.error_message')))
  } finally {
    isSubmitting.value = false
  }
}
</script>
