<template>
    <ClientOnly>
        <Teleport to="body">
            <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div ref="backdrop" @click="handleClose" class="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm">
                </div>

                <!-- Dialog Card -->
                <div ref="dialog"
                    class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-hidden border border-gray-100">
                    <!-- Decorative Border Top -->
                    <div class="bg-primary h-1.5 w-full shrink-0"></div>

                    <!-- Header -->
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                        <h2 class="text-xl font-black text-navy-dark tracking-tight flex items-center gap-2">
                            <Icon icon="ph:images-square-bold" class="text-primary" />
                            Media Library
                        </h2>
                        <button type="button" @click="handleClose"
                            class="text-gray-400 hover:text-navy-dark p-1 rounded-lg hover:bg-gray-100 transition-colors">
                            <Icon icon="ph:x-bold" class="text-xl" />
                        </button>
                    </div>

                    <!-- Tabs -->
                    <div class="flex border-b border-gray-100 px-6 bg-white shrink-0">
                        <button @click="activeTab = 'browse'"
                            class="px-4 py-3 flex items-center text-sm font-bold border-b-2 transition-colors"
                            :class="activeTab === 'browse' ? 'border-primary text-navy-dark' : 'border-transparent text-text-secondary hover:text-navy-dark'">
                            <Icon icon="ph:folder-open" class="mr-2" />
                            <span>Pilih dari Library</span>
                        </button>
                        <button @click="activeTab = 'upload'"
                            class="px-4 py-3 flex items-center text-sm font-bold border-b-2 transition-colors"
                            :class="activeTab === 'upload' ? 'border-primary text-navy-dark' : 'border-transparent text-text-secondary hover:text-navy-dark'">
                            <Icon icon="ph:upload-simple" class="mr-2" />
                            <span>Upload Baru</span>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 overflow-y-auto p-6 bg-white min-h-[300px]">
                        <!-- Browse Tab -->
                        <div v-if="activeTab === 'browse'">
                            <!-- Loading State -->
                            <div v-if="isLoadingLibrary" class="flex flex-col items-center justify-center py-16">
                                <Icon icon="ph:spinner" class="text-4xl text-primary animate-spin mb-4" />
                                <p class="text-gray-500 text-sm">Memuat media library...</p>
                            </div>

                            <!-- Empty State -->
                            <div v-else-if="mediaFiles.length === 0"
                                class="flex flex-col items-center justify-center py-16">
                                <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <Icon icon="ph:image-broken" class="text-3xl text-gray-400" />
                                </div>
                                <p class="text-gray-600 font-medium">Belum ada media</p>
                                <p class="text-gray-400 text-sm mt-1">Upload gambar pertama Anda</p>
                                <button @click="activeTab = 'upload'"
                                    class="mt-4 px-4 py-2 bg-primary text-navy font-bold text-sm rounded-lg hover:bg-primary-hover transition-colors">
                                    Upload Sekarang
                                </button>
                            </div>

                            <!-- Media Grid -->
                            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <div v-for="file in mediaFiles" :key="file.id" @click="selectMedia(file)" role="button"
                                    tabindex="0" @keydown.enter="selectMedia(file)"
                                    @keydown.space.prevent="selectMedia(file)"
                                    class="group relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    :class="selectedMedia?.id === file.id ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-primary/50'">
                                    <img v-if="file.mime_type?.startsWith('image/')" :src="file.url"
                                        :alt="file.filename" class="w-full h-full object-cover" />
                                    <div v-else
                                        class="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                                        <Icon :icon="getFileIcon(file.mime_type)" class="text-4xl text-gray-400 mb-2" />
                                        <span
                                            class="px-2 text-[10px] text-gray-500 font-medium truncate w-full text-center">{{
                                                getFileExt(file.url) }}</span>
                                    </div>

                                    <!-- Selected Indicator -->
                                    <div v-if="selectedMedia?.id === file.id"
                                        class="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                        <div
                                            class="w-10 h-10 rounded-full bg-primary text-navy flex items-center justify-center">
                                            <Icon icon="ph:check-bold" class="text-xl" />
                                        </div>
                                    </div>

                                    <!-- Hover Overlay -->
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div
                                            class="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                                            <p class="text-white text-[10px] font-medium truncate flex-1 mr-2">{{
                                                file.filename }}</p>
                                            <button @click.stop="deleteMedia(file)"
                                                class="w-7 h-7 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors">
                                                <Icon icon="ph:trash" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Upload Tab -->
                        <div v-if="activeTab === 'upload'" class="max-w-md mx-auto">
                            <!-- Caption Input (Required) -->
                            <div class="mb-4">
                                <label class="text-navy text-sm font-bold mb-1.5 block">
                                    Caption <span class="text-red-500">*</span>
                                </label>
                                <input v-model="uploadCaption" type="text"
                                    placeholder="Contoh: Banner Turnamen Jakarta 2026"
                                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                <p class="text-xs text-gray-400 mt-1">Caption akan digunakan sebagai nama file</p>
                            </div>

                            <!-- Upload Zone -->
                            <div @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
                                @drop.prevent="handleFileDrop" :class="[
                                    'border-2 border-dashed rounded-xl p-8 text-center transition-all',
                                    !uploadCaption ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                                    isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                                ]" @click="uploadCaption && $refs.fileInput.click()">
                                <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/gif,image/webp"
                                    class="hidden" @change="handleFileSelect" :disabled="!uploadCaption" />

                                <div v-if="!isUploading && !uploadedPreview">
                                    <Icon icon="ph:cloud-arrow-up" class="text-5xl text-gray-400 mx-auto mb-4" />
                                    <p class="text-gray-600 font-medium">{{ uploadZoneText }}</p>
                                    <p class="text-xs text-gray-400 mt-2">JPG, PNG, GIF, WebP (max 10MB)</p>
                                </div>

                                <!-- Uploading State -->
                                <div v-else-if="isUploading" class="py-8">
                                    <Icon icon="ph:spinner" class="text-5xl text-primary animate-spin mx-auto mb-4" />
                                    <p class="text-gray-600 font-medium">Mengupload...</p>
                                    <p class="text-xs text-gray-400 mt-1">Mohon tunggu sebentar</p>
                                </div>

                                <!-- Upload Success Preview -->
                                <div v-else-if="uploadedPreview" class="relative group/preview">
                                    <img v-if="uploadedMimeType?.startsWith('image/')" :src="uploadedPreview"
                                        alt="Uploaded preview"
                                        class="w-full max-h-48 object-contain rounded-lg mx-auto" />
                                    <div v-else
                                        class="w-full h-32 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                                        <Icon :icon="getFileIcon(uploadedMimeType)"
                                            class="text-5xl text-gray-400 mb-2" />
                                        <p class="text-xs text-gray-500 font-medium px-4 truncate w-full text-center">{{
                                            uploadCaption }}</p>
                                    </div>

                                    <div class="mt-4 flex items-center justify-center gap-2 text-green-600">
                                        <Icon icon="ph:check-circle-fill" class="text-xl" />
                                        <span class="text-sm font-medium">Upload berhasil!</span>
                                    </div>

                                    <!-- Remove/Cancel Button -->
                                    <button @click.stop="resetUpload"
                                        class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                                        <Icon icon="ph:x-bold" />
                                    </button>
                                </div>
                            </div>

                            <!-- Error Message -->
                            <p v-if="uploadError" class="text-red-500 text-sm flex items-center gap-2 mt-3">
                                <Icon icon="ph:warning-circle" />
                                {{ uploadError }}
                            </p>


                        </div>
                    </div>

                    <!-- Footer -->
                    <div
                        class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
                        <p v-if="selectedMedia" class="text-sm font-medium text-text-secondary">
                            <span class="text-navy-dark">{{ selectedMedia.filename }}</span>
                        </p>
                        <p v-else class="text-sm font-medium text-gray-400">Pilih gambar atau upload baru</p>

                        <div class="flex gap-3">
                            <button type="button" @click="handleClose"
                                class="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-text-secondary hover:bg-white hover:border-gray-300 transition-all">
                                Batal
                            </button>
                            <button type="button" @click="handleConfirmSelection"
                                :disabled="!selectedMedia && !uploadedUrl"
                                class="px-7 py-2.5 bg-navy-dark hover:bg-navy-light text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-navy-dark/10 disabled:opacity-50 disabled:cursor-not-allowed">
                                Pilih Gambar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </ClientOnly>
</template>

<script setup>
import { gsap } from 'gsap'
import { Icon } from '@iconify/vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close', 'select'])

const { get, upload, delete: del } = useApi()

const backdrop = ref(null)
const dialog = ref(null)
const activeTab = ref('browse')
const isLoadingLibrary = ref(false)
const mediaFiles = ref([])
const selectedMedia = ref(null)

// Upload state
const isDragging = ref(false)
const isUploading = ref(false)
const uploadCaption = ref('')
const uploadedPreview = ref('')
const uploadedUrl = ref('')
const uploadedMimeType = ref('')
const uploadError = ref('')

// File Icon Handling
const getFileIcon = (mimeType) => {
    if (!mimeType) return 'ph:file-bold'
    if (mimeType.startsWith('image/')) return 'ph:image-bold'
    if (mimeType === 'application/pdf') return 'ph:file-pdf-bold'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'ph:file-xls-bold'
    if (mimeType.includes('word') || mimeType.includes('document')) return 'ph:file-doc-bold'
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'ph:file-zip-bold'
    return 'ph:file-bold'
}

const getFileExt = (url) => {
    if (!url) return ''
    const parts = url.split('.')
    return parts.length > 1 ? parts.pop().toUpperCase() : ''
}

// Computed for upload zone text
const uploadZoneText = computed(() => {
    return uploadCaption.value ? 'Drag & drop gambar atau klik untuk pilih' : 'Isi caption terlebih dahulu'
})

// Load media library
const loadMediaLibrary = async () => {
    isLoadingLibrary.value = true
    try {
        const response = await get('/media')
        mediaFiles.value = response?.files || []
    } catch (error) {
        console.error('Failed to load media library:', error)
    } finally {
        isLoadingLibrary.value = false
    }
}

// Select media from library
const selectMedia = (file) => {
    selectedMedia.value = file
    uploadedUrl.value = ''
    uploadedPreview.value = ''
}

// Handle file selection
const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (file) await uploadFile(file)
}

// Handle file drop
const handleFileDrop = async (event) => {
    if (!uploadCaption.value) return
    isDragging.value = false
    const file = event.dataTransfer.files?.[0]
    if (file) await uploadFile(file)
}

// Upload file
const uploadFile = async (file) => {
    if (!uploadCaption.value.trim()) {
        uploadError.value = 'Caption wajib diisi'
        return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
        uploadError.value = 'Format file tidak didukung. Gunakan: JPEG, PNG, GIF, WebP, atau PDF.'
        return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
        uploadError.value = 'Ukuran file terlalu besar (max 10MB)'
        return
    }

    uploadError.value = ''
    isUploading.value = true

    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', uploadCaption.value.trim())

        const response = await upload('/media/upload', formData)

        uploadedUrl.value = response.url
        uploadedPreview.value = response.url
        uploadedMimeType.value = response.mime_type
        selectedMedia.value = null

        // Refresh library
        await loadMediaLibrary()
    } catch (error) {
        console.error('Upload failed:', error)
        uploadError.value = error.message || 'Gagal mengupload file'
    } finally {
        isUploading.value = false
    }
}

// Delete media
const deleteMedia = async (file) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus media "${file.filename}"?`)) return

    try {
        await del(`/media/${file.id}`)
        if (selectedMedia.value?.id === file.id) {
            selectedMedia.value = null
        }
        await loadMediaLibrary()
    } catch (error) {
        console.error('Failed to delete media:', error)
        alert('Gagal menghapus media')
    }
}

// Reset upload state
const resetUpload = () => {
    uploadCaption.value = ''
    uploadedPreview.value = ''
    uploadedUrl.value = ''
    uploadedMimeType.value = ''
    uploadError.value = ''
}

// Handle Close with animation
const handleClose = () => {
    if (!backdrop.value || !dialog.value) {
        close()
        return
    }

    const tl = gsap.timeline({
        onComplete: () => close()
    })

    tl.to(dialog.value, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in'
    })
    tl.to(backdrop.value, {
        opacity: 0,
        duration: 0.2
    }, '<')
}

// Close modal (state reset)
const close = () => {
    resetUpload()
    selectedMedia.value = null
    activeTab.value = 'browse'
    emit('close')
}

// Confirm selection
const handleConfirmSelection = () => {
    const result = selectedMedia.value
        ? { url: selectedMedia.value.url, caption: selectedMedia.value.filename }
        : { url: uploadedUrl.value, caption: uploadCaption.value }

    emit('select', result)
    handleClose()
}

// Watch for modal open
watch(() => props.show, (newVal) => {
    if (newVal) {
        loadMediaLibrary()
        nextTick(() => {
            if (!backdrop.value || !dialog.value) return

            gsap.fromTo(backdrop.value,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            )
            gsap.fromTo(dialog.value,
                { opacity: 0, scale: 0.9, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
            )
        })
    }
})
</script>
