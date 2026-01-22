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
        <div class="space-y-6">
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
                                <input v-model="form.start_date" type="datetime-local"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Tanggal Selesai</label>
                                <input v-model="form.end_date" type="datetime-local"
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
                        <!-- Google Maps Embed Preview -->
                        <div v-if="gmapsEmbedUrl" class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Pratinjau Peta</label>
                            <div class="rounded-xl overflow-hidden border border-gray-200 aspect-video w-full bg-gray-50">
                                <iframe width="100%" height="100%" style="border:0" loading="lazy"
                                    allowfullscreen referrerpolicy="no-referrer-when-downgrade"
                                    :src="gmapsEmbedUrl">
                                </iframe>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Link Google Maps</label>
                            <input v-model="form.gmaps_link" type="url"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="https://maps.app.goo.gl/..." />
                            <p class="text-xs text-gray-400">Paste link Google Maps untuk menampilkan peta</p>
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
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">URL Banner</label>
                                <input v-model="form.banner_url" type="url"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="https://..." />
                                <p class="text-xs text-gray-400">Rasio 16:9, minimal 1200x675 piksel</p>
                                <div v-if="form.banner_url" class="rounded-xl overflow-hidden border border-gray-200 mt-2">
                                    <img :src="form.banner_url" :alt="form.name" class="w-full h-32 object-cover" />
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">URL Thumbnail</label>
                                <input v-model="form.logo_url" type="url"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="https://..." />
                                <p class="text-xs text-gray-400">Rasio 1:1, minimal 400x400 piksel</p>
                                <div v-if="form.logo_url" class="rounded-xl overflow-hidden border border-gray-200 mt-2">
                                    <img :src="form.logo_url" :alt="form.name" class="w-full h-32 object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Event Images Gallery -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:images" class="text-primary text-xl" />
                            Galeri Event
                        </h2>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="space-y-4">
                            <div v-for="(image, index) in form.event_images" :key="index" class="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div class="flex items-start gap-4">
                                    <div v-if="image.url" class="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                        <img :src="image.url" :alt="image.caption || 'Event image'" class="w-full h-full object-cover" />
                                    </div>
                                    <div v-else class="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 shrink-0 flex items-center justify-center">
                                        <Icon icon="ph:image" class="text-2xl text-gray-300" />
                                    </div>
                                    <div class="flex-1 space-y-3">
                                        <div class="space-y-2">
                                            <label class="text-xs font-bold text-gray-600">URL Gambar</label>
                                            <input v-model="image.url" type="url"
                                                class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                                placeholder="https://..." />
                                        </div>
                                        <div class="space-y-2">
                                            <label class="text-xs font-bold text-gray-600">Keterangan</label>
                                            <input v-model="image.caption" type="text"
                                                class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                                placeholder="Keterangan gambar (opsional)" />
                                        </div>
                                    </div>
                                    <button @click="removeImage(index)"
                                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                                        <Icon icon="ph:trash" class="text-lg" />
                                    </button>
                                </div>
                            </div>
                            
                            <button @click="addImageField"
                                class="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary">
                                <Icon icon="ph:plus" class="text-2xl" />
                                <span class="text-sm font-bold">Tambah Gambar ke Galeri</span>
                            </button>
                        </div>
                        <p class="text-xs text-gray-400">Upload gambar seperti poster, foto venue, atau dokumentasi event lainnya.</p>
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
    logo_url: '',
    event_images: [],
    registration_fee_individual: 0,
    registration_fee_team: 0,
    registration_deadline: '',
    max_participants: 200
})

// Convert datetime string to datetime-local format
const formatToDatetimeLocal = (dateStr) => {
    if (!dateStr) return ''
    try {
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
        return ''
    }
}

// Convert datetime-local format to ISO string for API
const formatFromDatetimeLocal = (datetimeLocal) => {
    if (!datetimeLocal) return null
    try {
        return new Date(datetimeLocal).toISOString()
    } catch {
        return null
    }
}

// Google Maps embed URL
const gmapsEmbedUrl = computed(() => {
    if (!form.value.gmaps_link) return null
    
    try {
        const url = new URL(form.value.gmaps_link)
        
        // Extract coordinates from URL if available
        const coordsMatch = form.value.gmaps_link.match(/[?&]q=([^&]+)/)
        if (coordsMatch) {
            const query = decodeURIComponent(coordsMatch[1])
            return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
        }
        
        // For maps.app.goo.gl or goo.gl links, try to extract place name
        if (url.hostname.includes('maps.app') || url.hostname === 'goo.gl' || url.hostname.includes('google.com')) {
            // Use venue name if available, otherwise use the full link
            const searchQuery = form.value.venue || form.value.gmaps_link
            return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
        }
    } catch (e) {
        // If URL parsing fails, use venue name or link as search query
        const searchQuery = form.value.venue || form.value.gmaps_link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    }
    
    return null
})

const addImageField = () => {
    form.value.event_images.push({
        url: '',
        caption: '',
        alt_text: '',
        display_order: form.value.event_images.length,
        is_primary: false
    })
}

const removeImage = (index) => {
    form.value.event_images.splice(index, 1)
}

const fetchEventData = async () => {
    try {
        const response = await get(`/events/${eventId}`)
        const data = response?.data || response
        
        if (data) {
            eventData.value = data
            
            // Fetch event images
            let eventImages = []
            try {
                const imagesRes = await get(`/events/${eventId}/images`)
                eventImages = imagesRes?.images || imagesRes?.data?.images || []
            } catch (err) {
                console.error('Failed to fetch event images:', err)
            }
            
            form.value = {
                name: data.name || data.title || '',
                description: data.description || '',
                start_date: formatToDatetimeLocal(data.start_date),
                end_date: formatToDatetimeLocal(data.end_date),
                venue: data.venue || data.location || '',
                address: data.address || '',
                gmaps_link: data.gmaps_link || data.gmap_link || '',
                banner_url: data.banner_url || data.image || '',
                logo_url: data.logo_url || '',
                event_images: eventImages.length > 0 ? eventImages.map(img => ({
                    url: img.url || '',
                    caption: img.caption || '',
                    alt_text: img.alt_text || '',
                    display_order: img.display_order || 0,
                    is_primary: img.is_primary || false
                })) : [],
                registration_fee_individual: data.registration_fee_individual || data.entry_fee || 0,
                registration_fee_team: data.registration_fee_team || 0,
                registration_deadline: formatToDatetimeLocal(data.registration_deadline),
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
        // Prepare data for API
        const payload = {
            name: form.value.name,
            description: form.value.description,
            start_date: formatFromDatetimeLocal(form.value.start_date),
            end_date: formatFromDatetimeLocal(form.value.end_date),
            venue: form.value.venue,
            address: form.value.address,
            gmaps_link: form.value.gmaps_link,
            banner_url: form.value.banner_url,
            logo_url: form.value.logo_url,
            entry_fee: form.value.registration_fee_individual,
            registration_deadline: formatFromDatetimeLocal(form.value.registration_deadline),
            max_participants: form.value.max_participants
        }
        
        await put(`/events/${eventId}`, payload)
        
        // Save event images separately
        if (form.value.event_images.length > 0) {
            try {
                await put(`/events/${eventId}/images`, {
                    images: form.value.event_images.filter(img => img.url)
                })
            } catch (err) {
                console.error('Failed to save event images:', err)
            }
        }
        
        // Show success notification
        const toast = useToast()
        toast.success('Event berhasil disimpan')
    } catch (error) {
        console.error('Failed to save:', error)
        const toast = useToast()
        toast.error('Gagal menyimpan event')
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
