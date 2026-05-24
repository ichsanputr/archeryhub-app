<template>
  <div class="space-y-8">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col gap-6">
      <nav class="flex flex-wrap gap-2 items-center">
        <NuxtLink to="/dashboard/organization"
          class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">
          {{ t('dashboard.sidebar.overview') }}</NuxtLink>
        <Icon icon="ph:caret-right" class="text-gray-300 text-sm" />
        <NuxtLink to="/dashboard/organization/events"
          class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">{{ t('dashboard.sidebar.event') }}</NuxtLink>
        <Icon icon="ph:caret-right" class="text-gray-300 text-sm" />
        <span class="text-navy text-sm font-bold">{{ t('event_create.breadcrumb_new') }}</span>
      </nav>

      <div class="flex flex-wrap justify-between gap-6 items-end">
        <div class="flex flex-col gap-3">
          <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">{{ t('event_create.title') }}</h1>
          <p class="text-text-secondary text-sm md:text-base font-medium max-w-2xl">{{ t('event_create.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-10">

        <!-- Single Step: Event Info -->
        <div class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
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
                <p class="text-xs text-gray-500 mt-1.5">
                  {{ t('event_create.slug_hint') }}
                </p>
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
                <p v-else-if="form.gmapsLink && !isValidGmaps" class="text-red-500 text-xs font-bold mt-1">
                  {{ t('event_create.gmaps_invalid') }}
                </p>
              </div>
            </div>
          </FormSection>

          <FormSection icon="ant-design:schedule-outlined" :title="t('event_create.section_schedule')">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.startDate" :label="t('event_create.field_start_date')" type="datetime-local" required
                :error="errors.startDate" @blur="validate('startDate', form.startDate, [rules.required()])" />
              <BaseInput v-model="form.endDate" :label="t('event_create.field_end_date')" type="datetime-local" required
                :error="errors.endDate" @blur="validate('endDate', form.endDate, [rules.required()])" />
              <BaseInput v-model="form.registrationDeadline" :label="t('event_create.field_registration_deadline')" type="datetime-local" />
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
          <BaseButton to="/dashboard/organization/events" variant="ghost" class="px-8 whitespace-nowrap">
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
  status: 'draft'
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
    toast.error('subscription expired. upgrade your plan to create event.')
    router.replace('/dashboard/organization/events')
    return
  }
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
      location_type: form.type
    }

    const result = await post('/events', payload)

    if (result?.id || result?.uuid) {
      toast.success(t('event_create.success_message'))
      router.push('/dashboard/organization/events')
    }
  } catch (error) {
    console.error('Failed to create tournament:', error)
    toast.error(getApiErrorMessage(error, t('event_create.error_message')))
  } finally {
    isSubmitting.value = false
  }
}
</script>
