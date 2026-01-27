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
                            <iframe width="100%" height="100%" style="border:0" loading="lazy" allowfullscreen
                                referrerpolicy="no-referrer-when-downgrade" :src="gmapsEmbedUrl">
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
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Banner -->
                        <div class="space-y-3">
                            <label class="text-sm font-bold text-gray-700 block">Banner Event</label>
                            <div v-if="form.banner_url"
                                class="relative rounded-2xl overflow-hidden border border-gray-200 aspect-video group">
                                <img :src="form.banner_url" :alt="form.name" class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button @click="openMediaLibrary('banner')"
                                        class="p-3 bg-white text-navy rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary transition-colors">
                                        <Icon icon="ph:pencil-simple" /> Ganti
                                    </button>
                                    <button @click="form.banner_url = ''"
                                        class="p-3 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-600 transition-colors">
                                        <Icon icon="ph:trash" /> Hapus
                                    </button>
                                </div>
                            </div>
                            <button v-else @click="openMediaLibrary('banner')"
                                class="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-primary">
                                <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                                    <Icon icon="ph:image-plus" class="text-2xl" />
                                </div>
                                <div class="text-center">
                                    <p class="text-sm font-bold">Pilih Banner</p>
                                    <p class="text-[10px]">Rasio 16:9, min. 1200x675px</p>
                                </div>
                            </button>
                        </div>

                        <!-- Thumbnail -->
                        <div class="space-y-3">
                            <label class="text-sm font-bold text-gray-700 block">Thumbnail Event</label>
                            <div v-if="form.logo_url"
                                class="relative rounded-2xl overflow-hidden border border-gray-200 aspect-square w-48 mx-auto group">
                                <img :src="form.logo_url" :alt="form.name" class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button @click="openMediaLibrary('logo')"
                                        class="p-2.5 bg-white text-navy rounded-lg font-bold text-xs flex items-center gap-1.5 hover:bg-primary transition-colors">
                                        <Icon icon="ph:pencil-simple" /> Ganti
                                    </button>
                                    <button @click="form.logo_url = ''"
                                        class="p-2.5 bg-red-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 hover:bg-red-600 transition-colors">
                                        <Icon icon="ph:trash" />
                                    </button>
                                </div>
                            </div>
                            <button v-else @click="openMediaLibrary('logo')"
                                class="w-48 aspect-square mx-auto rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-primary">
                                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                                    <Icon icon="ph:image-plus" class="text-xl" />
                                </div>
                                <div class="text-center px-4">
                                    <p class="text-sm font-bold">Pilih Thumbnail</p>
                                    <p class="text-[10px]">Rasio 1:1, min. 400x400px</p>
                                </div>
                            </button>
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
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <!-- Existing Images -->
                        <div v-for="(image, index) in form.event_images" :key="index"
                            class="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <img :src="image.url" :alt="image.caption || 'Event image'"
                                class="w-full h-full object-cover" />
                            <div
                                class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                <div class="flex justify-end">
                                    <button @click="removeImage(index)"
                                        class="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                                        <Icon icon="ph:trash" />
                                    </button>
                                </div>
                                <input v-model="image.caption" type="text"
                                    class="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-2 py-1 text-[10px] text-white placeholder:text-white/50 outline-none"
                                    placeholder="Tambah caption..." />
                            </div>
                        </div>

                        <!-- Add Button -->
                        <button @click="openMediaLibrary('gallery')"
                            class="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary">
                            <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                                <Icon icon="ph:plus-bold" class="text-xl" />
                            </div>
                            <p class="text-xs font-bold">Tambah Foto</p>
                        </button>
                    </div>
                    <p class="text-xs text-gray-400 italic">Klik '+' untuk menambahkan dokumentasi atau poster event ke
                        galeri.</p>
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
                    <!-- Multiple Fees -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <label class="text-sm font-bold text-gray-700">List Biaya Pendaftaran</label>
                            <BaseButton variant="outline" size="xs" @click="addFeeField">
                                <Icon icon="ph:plus-bold" class="mr-1" /> Tambah Biaya
                            </BaseButton>
                        </div>
                        <div v-if="form.fees.length === 0"
                            class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p class="text-xs text-gray-400">Belum ada biaya pendaftaran. Tambahkan untuk memudahkan
                                pendaftar.</p>
                        </div>
                        <div v-else class="space-y-3">
                            <div v-for="(fee, index) in form.fees" :key="index"
                                class="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div class="space-y-1">
                                        <input v-model="fee.name" type="text"
                                            placeholder="Nama Biaya (e.g. Early Bird Individual)"
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" />
                                    </div>
                                    <div class="space-y-1">
                                        <div class="relative">
                                            <span
                                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">IDR</span>
                                            <input v-model.number="fee.amount" type="number" placeholder="0"
                                                class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" />
                                        </div>
                                    </div>
                                    <div class="md:col-span-2">
                                        <input v-model="fee.description" type="text"
                                            placeholder="Deskripsi singkat (opsional)"
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-xs" />
                                    </div>
                                </div>
                                <button @click="removeFeeField(index)"
                                    class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                    <Icon icon="ph:trash" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
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

                    <!-- Total Prize and Guidebook -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Total Hadiah (IDR)</label>
                            <input v-model.number="form.total_prize" type="number"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Contoh: 10000000" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Buku Panduan Teknis (PDF)</label>
                            <div class="flex items-center gap-2">
                                <div class="flex-1 relative">
                                    <input type="text"
                                        :value="form.technical_guidebook_url ? 'Guidebook-Teknis.pdf' : ''" readonly
                                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm italic"
                                        placeholder="Belum ada file diupload" />
                                    <div v-if="uploadingGuidebook" class="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Icon icon="line-md:loading-twotone-loop" class="text-primary" />
                                    </div>
                                </div>
                                <input type="file" ref="guidebookInput" class="hidden" accept=".pdf"
                                    @change="handleGuidebookUpload" />
                                <BaseButton variant="outline" size="sm" @click="$refs.guidebookInput.click()"
                                    :disabled="uploadingGuidebook">
                                    {{ form.technical_guidebook_url ? 'Ganti File' : 'Upload' }}
                                </BaseButton>
                                <BaseButton v-if="form.technical_guidebook_url" variant="ghost" size="sm"
                                    class="text-red-500" @click="form.technical_guidebook_url = ''">
                                    <Icon icon="ph:trash" />
                                </BaseButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Jadwal Lomba (Schedule) -->
            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                        <Icon icon="ph:calendar-bold" class="text-primary text-xl" />
                        Jadwal Lomba
                    </h2>
                    <BaseButton variant="outline" size="sm" @click="addScheduleField">
                        <Icon icon="ph:plus-bold" class="mr-1" /> Tambah Sesi
                    </BaseButton>
                </div>
                <div class="p-6 space-y-4">
                    <div v-if="form.schedules.length === 0"
                        class="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Icon icon="ph:calendar-blank" class="text-4xl text-gray-300 mx-auto mb-3" />
                        <p class="text-sm text-gray-500 font-medium">Jadwal lomba belum diatur.</p>
                        <p class="text-xs text-gray-400 mt-1">Tambahkan sesi lomba untuk menginformasikan jadwal kepada
                            peserta.</p>
                    </div>
                    <div v-else class="space-y-4">
                        <div v-for="(session, index) in form.schedules" :key="index"
                            class="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative group">
                            <button @click="removeScheduleField(index)"
                                class="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Icon icon="ph:trash" />
                            </button>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div class="space-y-2 lg:col-span-2">
                                    <label class="text-xs font-bold text-gray-500">Judul Sesi</label>
                                    <input v-model="session.title" type="text"
                                        placeholder="Contoh: Kualifikasi Recurve Putra"
                                        class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-500">Hari Ke-</label>
                                    <input v-model.number="session.day_order" type="number"
                                        class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-500">Lokasi Sesi</label>
                                    <input v-model="session.location" type="text" placeholder="Contoh: Lapangan A"
                                        class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-500">Waktu Mulai</label>
                                    <input v-model="session.start_time" type="datetime-local"
                                        class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-500">Waktu Selesai</label>
                                    <input v-model="session.end_time" type="datetime-local"
                                        class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm" />
                                </div>
                                <div class="lg:col-span-4 space-y-2">
                                    <label class="text-xs font-bold text-gray-500">Keterangan (Opsional)</label>
                                    <textarea v-model="session.description" rows="2"
                                        placeholder="Detail tambahan sesi..."
                                        class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm resize-none"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Media Library Modal -->
        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const eventId = route.params.id

const { get, put, post } = useApi()
const saving = ref(false)

// Media Library State
const showMediaLibrary = ref(false)
const mediaTarget = ref('') // 'banner', 'logo', or 'gallery'

const openMediaLibrary = (target) => {
    mediaTarget.value = target
    showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
    if (mediaTarget.value === 'banner') {
        form.value.banner_url = media.url
    } else if (mediaTarget.value === 'logo') {
        form.value.logo_url = media.url
    } else if (mediaTarget.value === 'gallery') {
        form.value.event_images.push({
            url: media.url,
            caption: media.caption || '',
            alt_text: media.caption || '',
            display_order: form.value.event_images.length,
            is_primary: false
        })
    }
    showMediaLibrary.value = false
}

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
    fees: [],
    schedules: [],
    registration_deadline: '',
    max_participants: 200,
    total_prize: 0,
    technical_guidebook_url: ''
})

const addFeeField = () => {
    form.value.fees.push({
        name: '',
        amount: 0,
        description: ''
    })
}

const removeFeeField = (index) => {
    form.value.fees.splice(index, 1)
}

const addScheduleField = () => {
    form.value.schedules.push({
        title: '',
        day_order: (form.value.schedules.length > 0 ? Math.max(...form.value.schedules.map(s => s.day_order)) : 0) + 1,
        location: '',
        start_time: '',
        end_time: '',
        description: ''
    })
}

const removeScheduleField = (index) => {
    form.value.schedules.splice(index, 1)
}

const uploadingGuidebook = ref(false)
const guidebookInput = ref(null)

const handleGuidebookUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
        const toast = useToast()
        toast.error('Hanya file PDF yang diperbolehkan')
        return
    }

    uploadingGuidebook.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `Guidebook ${form.value.name}`)

        const response = await post('/media/upload', formData, {
            headers: {
                // Fetch will handle the boundary automatically for FormData
            }
        })

        form.value.technical_guidebook_url = response.url
        const toast = useToast()
        toast.success('Buku panduan berhasil diupload')
    } catch (err) {
        console.error('Upload failed:', err)
        const toast = useToast()
        toast.error('Gagal mengupload buku panduan')
    } finally {
        uploadingGuidebook.value = false
    }
}

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
                fees: data.fees || [],
                schedules: (data.schedules || []).map(s => ({
                    ...s,
                    start_time: formatToDatetimeLocal(s.start_time),
                    end_time: formatToDatetimeLocal(s.end_time)
                })),
                registration_deadline: formatToDatetimeLocal(data.registration_deadline),
                max_participants: data.max_participants || 200,
                total_prize: data.total_prize || 0,
                technical_guidebook_url: data.technical_guidebook_url || ''
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
            registration_deadline: formatFromDatetimeLocal(form.value.registration_deadline),
            max_participants: form.value.max_participants,
            total_prize: form.value.total_prize,
            technical_guidebook_url: form.value.technical_guidebook_url,
            fees: form.value.fees,
            schedules: form.value.schedules.map(s => ({
                ...s,
                start_time: formatFromDatetimeLocal(s.start_time),
                end_time: formatFromDatetimeLocal(s.end_time)
            }))
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
