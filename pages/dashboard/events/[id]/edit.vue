<template>
    <div class="space-y-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-24">
            <div class="flex flex-col items-center gap-4">
                <div class="h-12 w-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                <p class="text-navy font-bold">Memuat data event...</p>
            </div>
        </div>

        <template v-else>
            <!-- Breadcrumb & Header -->
            <div class="flex flex-col gap-6">
                <nav class="flex flex-wrap gap-2 items-center">
                    <NuxtLink to="/dashboard"
                        class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">
                        Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right" class="text-gray-300 text-sm" />
                    <NuxtLink to="/dashboard/events"
                        class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">Events
                    </NuxtLink>
                    <Icon icon="ph:caret-right" class="text-gray-300 text-sm" />
                    <span class="text-navy text-sm font-bold">Edit Event</span>
                </nav>

                <div class="flex flex-wrap justify-between gap-6 items-end">
                    <div class="flex flex-col gap-3">
                        <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Edit Event</h1>
                        <p class="text-text-secondary text-sm md:text-base font-medium max-w-2xl">Ubah informasi event
                            Anda.</p>
                    </div>
                </div>
            </div>

            <!-- Form Card -->
            <div class="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
                <form @submit.prevent="handleSubmit" class="flex flex-col gap-10">

                    <!-- Event Info -->
                    <div class="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <FormSection icon="ph:identification-card" title="Identitas Event">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="md:col-span-2">
                                    <BaseInput v-model="form.name" label="Nama Event"
                                        placeholder="contoh: National Indoor Championship 2024" required
                                        :error="errors.name" @blur="validate('name', form.name, [rules.required()])" />
                                </div>
                                <BaseInput v-model="form.venue" label="Lokasi Venue"
                                    placeholder="Masukkan nama venue atau alamat" icon="la:place-of-worship" />
                                <BaseSelect v-model="form.type" label="Disiplin" :items="disciplineItems" required
                                    :error="errors.type" @blur="validate('type', form.type, [rules.required()])" />

                                <div class="md:col-span-2">
                                    <BaseInput v-model="form.gmapsLink" label="Link Google Maps"
                                        placeholder="https://goo.gl/maps/..." icon="ph:map-pin"
                                        @blur="validateGmapsLink" />

                                    <!-- Gmaps Preview -->
                                    <div v-if="gmapsEmbedUrl"
                                        class="mt-2 rounded-xl overflow-hidden border border-gray-200 aspect-video w-full bg-gray-50">
                                        <iframe width="100%" height="100%" style="border:0" loading="lazy"
                                            allowfullscreen referrerpolicy="no-referrer-when-downgrade"
                                            :src="gmapsEmbedUrl">
                                        </iframe>
                                    </div>
                                    <p v-else-if="form.gmapsLink && !isValidGmaps"
                                        class="text-red-500 text-xs font-bold mt-1">
                                        Link Google Maps tidak valid. Pastikan link diawali dengan https://goo.gl/maps/
                                        atau
                                        https://www.google.com/maps/
                                    </p>
                                </div>
                            </div>
                        </FormSection>

                        <FormSection icon="ant-design:schedule-outlined" title="Jadwal & Biaya">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BaseInput v-model="form.startDate" label="Tanggal & Waktu Mulai" type="datetime-local"
                                    required :error="errors.startDate"
                                    @blur="validate('startDate', form.startDate, [rules.required()])" />
                                <BaseInput v-model="form.endDate" label="Tanggal & Waktu Selesai" type="datetime-local"
                                    required :error="errors.endDate"
                                    @blur="validate('endDate', form.endDate, [rules.required()])" />
                                <BaseInput v-model.number="form.entryFee" label="Biaya pendaftaran (Rp)" type="number"
                                    placeholder="350000" />
                                <BaseInput v-model="form.registrationDeadline" label="Batas pendaftaran"
                                    type="datetime-local" />
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
                                <BaseInput v-model.number="form.maxParticipants" label="Maksimal peserta" type="number"
                                    placeholder="100" />

                                <BaseSelect v-model="form.status" label="Status" :items="[
                                    { title: 'Draft (Belum dipublikasi)', value: 'draft' },
                                    { title: 'Published (Aktif)', value: 'published' },
                                    { title: 'Ongoing (Sedang Berlangsung)', value: 'ongoing' },
                                    { title: 'Completed (Selesai)', value: 'completed' }
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
                        <BaseButton type="submit" variant="primary" :loading="isSubmitting" loading-text="Menyimpan..."
                            class="px-10">
                            <Icon icon="ph:floppy-disk" class="mr-2" />
                            Simpan Perubahan
                        </BaseButton>
                    </div>
                </form>
            </div>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import TiptapEditor from '~/components/common/TiptapEditor.vue'
import FormSection from '~/components/common/FormSection.vue'
import { useFormValidation } from '~/composables/useFormValidation'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { get, put } = useApi()
const toast = useToast()

const eventId = route.params.id
const isLoading = ref(true)
const isSubmitting = ref(false)

const { errors, validate, validateForm, rules, clearErrors } = useFormValidation()

const form = reactive({
    name: '',
    venue: '',
    gmapsLink: '',
    startDate: '',
    endDate: '',
    description: '',
    type: '',
    entryFee: 0,
    registrationDeadline: '',
    maxParticipants: null,
    status: 'draft'
})

const disciplines = ref([])
const disciplineItems = computed(() => disciplines.value.map(d => ({ title: d.name, value: d.id })))

// Format ISO date to datetime-local format
const formatToDatetimeLocal = (isoStr) => {
    if (!isoStr) return ''
    const date = new Date(isoStr)
    return date.toISOString().slice(0, 16)
}

onMounted(async () => {
    try {
        // Fetch disciplines
        const discRes = await get('/disciplines')
        if (discRes?.disciplines) {
            disciplines.value = discRes.disciplines
        }

        // Fetch event data
        const eventRes = await get(`/events/${eventId}`)
        if (eventRes) {
            form.name = eventRes.name || ''
            form.venue = eventRes.venue || ''
            form.gmapsLink = eventRes.gmaps_link || ''
            form.startDate = formatToDatetimeLocal(eventRes.start_date)
            form.endDate = formatToDatetimeLocal(eventRes.end_date)
            form.description = eventRes.description || ''
            form.type = eventRes.discipline_id || ''
            form.entryFee = eventRes.entry_fee || 0
            form.registrationDeadline = formatToDatetimeLocal(eventRes.registration_deadline)
            form.maxParticipants = eventRes.max_participants
            form.status = eventRes.status || 'draft'
        }
    } catch (err) {
        console.error('Failed to fetch event data', err)
        toast.error('Gagal memuat data event')
    } finally {
        isLoading.value = false
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
        startDate: [rules.required()],
        endDate: [rules.required()],
        type: [rules.required()]
    })

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

const handleSubmit = async () => {
    if (!validateStep()) return

    isSubmitting.value = true
    try {
        const formatToISO = (dateStr) => {
            if (!dateStr) return null
            return new Date(dateStr).toISOString()
        }

        const payload = {
            name: form.name,
            venue: form.venue,
            gmaps_link: form.gmapsLink,
            start_date: formatToISO(form.startDate),
            end_date: formatToISO(form.endDate),
            description: form.description,
            entry_fee: form.entryFee,
            max_participants: form.maxParticipants,
            status: form.status,
            registration_deadline: formatToISO(form.registrationDeadline),
            discipline_id: form.type
        }

        await put(`/events/${eventId}`, payload)
        toast.success('Event berhasil diperbarui')
        router.push('/dashboard/events')
    } catch (error) {
        console.error('Failed to update event:', error)
        const errorDetail = error.response?._data?.details || error.message || 'Terjadi kesalahan sistem'
        toast.error(`Gagal memperbarui event: ${errorDetail}`)
    } finally {
        isSubmitting.value = false
    }
}
</script>
