<template>
    <div class="flex flex-col gap-8">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-black text-navy tracking-tight">Halaman Event</h1>
                <p class="text-gray-500 mt-1">Kelola informasi yang ditampilkan di halaman publik event.</p>
            </div>
            <div class="flex items-center gap-3">
                <BaseButton variant="outline" icon="ph:eye" :to="`/events/${eventData.slug}`" target="_blank">
                    Lihat Halaman
                </BaseButton>
                <BaseButton variant="primary" icon="ph:floppy-disk" @click="saveEventPage" :loading="saving">
                    Simpan Perubahan
                </BaseButton>
            </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: Form -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Basic Info -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:info" class="text-primary text-xl" />
                            Informasi Dasar
                        </h2>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Nama Event</label>
                            <input v-model="form.name" type="text"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Nama event Anda" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Deskripsi</label>
                            <textarea v-model="form.description" rows="4"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                placeholder="Deskripsikan event Anda..."></textarea>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Tanggal Mulai</label>
                                <input v-model="form.start_date" type="date"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Tanggal Selesai</label>
                                <input v-model="form.end_date" type="date"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Location -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:map-pin" class="text-primary text-xl" />
                            Lokasi
                        </h2>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Nama Venue</label>
                            <input v-model="form.venue" type="text"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Nama tempat penyelenggaraan" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Alamat Lengkap</label>
                            <textarea v-model="form.address" rows="2"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                placeholder="Alamat lengkap venue"></textarea>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Link Google Maps</label>
                            <input v-model="form.gmaps_link" type="url"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="https://maps.app.goo.gl/..." />
                        </div>
                    </div>
                </section>

                <!-- Media -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:image" class="text-primary text-xl" />
                            Media
                        </h2>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">URL Banner/Poster</label>
                            <input v-model="form.banner_url" type="url"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="https://..." />
                            <p class="text-xs text-gray-400">Rekomendasi rasio 16:9, minimal 1200x675 piksel</p>
                        </div>
                        <div v-if="form.banner_url" class="rounded-xl overflow-hidden border border-gray-200">
                            <img :src="form.banner_url" :alt="form.name" class="w-full h-48 object-cover" />
                        </div>
                    </div>
                </section>

                <!-- Registration -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:ticket" class="text-primary text-xl" />
                            Pendaftaran
                        </h2>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Biaya Pendaftaran Individu (IDR)</label>
                                <input v-model.number="form.registration_fee_individual" type="number"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="350000" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Biaya Pendaftaran Tim (IDR)</label>
                                <input v-model.number="form.registration_fee_team" type="number"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="500000" />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Batas Pendaftaran</label>
                                <input v-model="form.registration_deadline" type="date"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Kuota Peserta</label>
                                <input v-model.number="form.max_participants" type="number"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="200" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Right Column: Preview & Settings -->
            <aside class="space-y-6">
                <!-- Preview Card -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-lg font-bold text-navy">Preview Card</h2>
                    </div>
                    <div class="p-4">
                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="h-32 bg-gray-100 overflow-hidden">
                                <img v-if="form.banner_url" :src="form.banner_url" :alt="form.name" class="w-full h-full object-cover" />
                                <div v-else class="h-full flex items-center justify-center">
                                    <Icon icon="ph:image" class="text-3xl text-gray-300" />
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="font-bold text-navy text-sm mb-2">{{ form.name || 'Nama Event' }}</h3>
                                <div class="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                    <Icon icon="ph:calendar-blank" class="text-primary" />
                                    <span>{{ formatDate(form.start_date) || 'Tanggal' }}</span>
                                </div>
                                <div class="flex items-center gap-2 text-xs text-gray-500">
                                    <Icon icon="ph:map-pin" class="text-primary" />
                                    <span>{{ form.venue || 'Lokasi' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Quick Stats -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Status Event</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Status</span>
                            <span class="px-3 py-1 rounded-full text-xs font-bold"
                                :class="eventData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                                {{ eventData.status === 'published' ? 'Dipublikasi' : 'Draft' }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Slug URL</span>
                            <span class="text-sm font-mono text-navy">/events/{{ eventData.slug }}</span>
                        </div>
                    </div>
                </section>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const eventId = route.params.id

const { get, put } = useApi()
const saving = ref(false)

const eventData = ref({
    slug: eventId,
    status: 'draft'
})

const form = ref({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    venue: '',
    address: '',
    gmaps_link: '',
    banner_url: '',
    registration_fee_individual: 0,
    registration_fee_team: 0,
    registration_deadline: '',
    max_participants: 200
})

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
        return dateStr
    }
}

const fetchEventData = async () => {
    try {
        const data = await get(`/events/${eventId}`)
        if (data) {
            eventData.value = data
            form.value = {
                name: data.name || data.title || '',
                description: data.description || '',
                start_date: data.start_date || '',
                end_date: data.end_date || '',
                venue: data.venue || data.location || '',
                address: data.address || '',
                gmaps_link: data.gmaps_link || '',
                banner_url: data.banner_url || data.image || '',
                registration_fee_individual: data.registration_fee_individual || data.registration_fee || 0,
                registration_fee_team: data.registration_fee_team || 0,
                registration_deadline: data.registration_deadline || '',
                max_participants: data.max_participants || 200
            }
        }
    } catch (error) {
        console.error('Failed to fetch event:', error)
    }
}

const saveEventPage = async () => {
    saving.value = true
    try {
        await put(`/events/${eventId}/page`, form.value)
        // Show success notification
    } catch (error) {
        console.error('Failed to save:', error)
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    fetchEventData()
})

useSeoMeta({
    title: 'Halaman Event - Dashboard'
})
</script>
