<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
                <div
                    class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
                    <!-- Header -->
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 class="text-xl font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:images-square-bold" class="text-primary" />
                            Media Library
                        </h2>
                        <button type="button" @click="close"
                            class="text-gray-400 hover:text-navy p-1 rounded-lg hover:bg-gray-100 transition-colors">
                            <Icon icon="ph:x-bold" class="text-xl" />
                        </button>
                    </div>

                    <!-- Tabs -->
                    <div class="flex border-b border-gray-100 px-6">
                        <button @click="activeTab = 'browse'"
                            class="px-4 py-3 flex items-center text-sm font-semibold border-b-2 transition-colors"
                            :class="activeTab === 'browse' ? 'border-primary text-navy' : 'border-transparent text-gray-500 hover:text-navy'">
                            <Icon icon="ph:folder-open" class="mr-2" />
                            <span>Pilih dari Library</span>
                        </button>
                        <button @click="activeTab = 'upload'"
                            class="px-4 py-3 flex items-center text-sm font-semibold border-b-2 transition-colors"
                            :class="activeTab === 'upload' ? 'border-primary text-navy' : 'border-transparent text-gray-500 hover:text-navy'">
                            <Icon icon="ph:upload-simple" class="mr-2" />
                            <span>Upload Baru</span>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 overflow-y-auto p-6">
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
                                <button v-for="file in mediaFiles" :key="file.id" @click="selectMedia(file)"
                                    class="group relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg"
                                    :class="selectedMedia?.id === file.id ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-primary/50'">
                                    <img :src="file.url" :alt="file.filename" class="w-full h-full object-cover" />

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
                                        <div class="absolute bottom-0 left-0 right-0 p-3">
                                            <p class="text-white text-xs font-medium truncate">{{ file.filename }}</p>
                                        </div>
                                    </div>
                                </button>
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
                                <div v-else-if="uploadedPreview" class="relative">
                                    <img :src="uploadedPreview" alt="Uploaded preview"
                                        class="w-full max-h-48 object-contain rounded-lg mx-auto" />
                                    <div class="mt-4 flex items-center justify-center gap-2 text-green-600">
                                        <Icon icon="ph:check-circle-fill" class="text-xl" />
                                        <span class="text-sm font-medium">Upload berhasil!</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Error Message -->
                            <p v-if="uploadError" class="text-red-500 text-sm flex items-center gap-2 mt-3">
                                <Icon icon="ph:warning-circle" />
                                {{ uploadError }}
                            </p>

                            <!-- Upload Another Button -->
                            <button v-if="uploadedPreview" @click="resetUpload" type="button"
                                class="w-full mt-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                <Icon icon="ph:plus" class="mr-2" />
                                Upload Gambar Lain
                            </button>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <p v-if="selectedMedia" class="text-sm text-gray-600">
                            <span class="font-medium text-navy">{{ selectedMedia.filename }}</span>
                        </p>
                        <p v-else class="text-sm text-gray-400">Pilih gambar atau upload baru</p>

                        <div class="flex gap-3">
                            <button type="button" @click="close"
                                class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-white transition-colors">
                                Batal
                            </button>
                            <button type="button" @click="confirm" :disabled="!selectedMedia && !uploadedUrl"
                                class="px-6 py-2.5 bg-primary hover:bg-primary-hover text-navy rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Pilih Gambar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close', 'select'])

const config = useRuntimeConfig()
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
const uploadError = ref('')

// Computed for upload zone text
const uploadZoneText = computed(() => {
    return uploadCaption.value ? 'Drag & drop gambar atau klik untuk pilih' : 'Isi caption terlebih dahulu'
})

// Load media library
const loadMediaLibrary = async () => {
    isLoadingLibrary.value = true
    try {
        const response = await fetch(`${config.public.apiBaseUrl}/media`)
        if (response.ok) {
            const data = await response.json()
            mediaFiles.value = data.files || []
        }
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        uploadError.value = 'Format file tidak didukung'
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

        const response = await fetch(`${config.public.apiBaseUrl}/media/upload`, {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Upload gagal')
        }

        const data = await response.json()
        uploadedUrl.value = data.url
        uploadedPreview.value = data.url
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

// Reset upload state
const resetUpload = () => {
    uploadCaption.value = ''
    uploadedPreview.value = ''
    uploadedUrl.value = ''
    uploadError.value = ''
}

// Close modal
const close = () => {
    resetUpload()
    selectedMedia.value = null
    activeTab.value = 'browse'
    emit('close')
}

// Confirm selection
const confirm = () => {
    const result = selectedMedia.value
        ? { url: selectedMedia.value.url, caption: selectedMedia.value.filename }
        : { url: uploadedUrl.value, caption: uploadCaption.value }

    emit('select', result)
    close()
}

// Watch for modal open
watch(() => props.show, (newVal) => {
    if (newVal) {
        loadMediaLibrary()
    }
})
</script>
