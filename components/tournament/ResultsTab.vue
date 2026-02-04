<template>
    <div class="space-y-6">
        <!-- Manual Results / Files -->
        <div v-if="results && results.length > 0" class="space-y-10">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                <div v-for="(file, index) in results" :key="index"
                    class="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-500 flex flex-col h-full">

                    <!-- Preview Area -->
                    <div
                        class="relative aspect-[4/3] overflow-hidden bg-white border-b border-gray-50 flex items-center justify-center">
                        <!-- Image Preview -->
                        <template v-if="isImage(file.url)">
                            <img :src="file.url" :alt="file.name"
                                class="w-full h-full object-cover transition-transform duration-700" />
                        </template>
                        <!-- PDF/Doc Preview (Live) -->
                        <template v-else-if="getFileExt(file.url) === 'pdf'">
                            <div class="w-full h-full bg-white relative">
                                <iframe
                                    :src="'https://docs.google.com/viewer?url=' + encodeURIComponent(file.url) + '&embedded=true'"
                                    class="w-full h-full pointer-events-none border-none scale-[1.01]"
                                    loading="lazy"></iframe>
                                <!-- Fallback/Loading overlay if needed -->
                                <div
                                    class="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                                    <Icon :icon="getFileIcon(file.url)" class="text-4xl text-gray-100 opacity-20" />
                                </div>
                            </div>
                        </template>
                        <!-- Other Doc Placeholder -->
                        <template v-else>
                            <div
                                class="w-full h-full flex flex-col items-center justify-center p-8 bg-white transition-all duration-500">
                                <Icon :icon="getFileIcon(file.url)"
                                    class="text-6xl text-gray-200 group-hover:text-navy/20 transition-all duration-500" />
                                <span class="mt-4 text-[10px] font-bold  tracking-widest text-gray-400">
                                    {{ getFileExt(file.url) }} Document
                                </span>
                            </div>
                        </template>

                        <!-- Hover Overlay -->
                        <div
                            class="absolute inset-0 bg-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                            <a :href="file.url" target="_blank"
                                class="px-6 py-2 bg-white rounded-full text-navy text-xs font-bold shadow-sm border border-gray-100 hover:bg-navy hover:text-white transition-all">
                                Lihat Berkas
                            </a>
                        </div>
                    </div>

                    <!-- Info Area & Actions -->
                    <div class="p-5 flex flex-col gap-4">
                        <h4 class="font-bold text-navy text-sm line-clamp-2" :title="file.name">
                            {{ file.name || 'Dokumen Hasil' }}
                        </h4>
                        <div class="flex gap-3">
                            <a :href="file.url" target="_blank"
                                class="flex-1 py-3 bg-gray-50 hover:bg-navy hover:text-white text-navy font-black text-[11px] rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-transparent">
                                <Icon icon="ph:eye-bold" class="text-sm" />
                                Lihat
                            </a>
                            <BaseButton variant="primary" size="sm"
                                class="flex-1 !rounded-2xl !py-4 font-black text-[11px] h-auto"
                                :loading="downloadingIndex === index" @click="handleDownload(file, index)">
                                <Icon v-if="downloadingIndex !== index" icon="ph:download-simple-bold"
                                    class="text-sm mr-2" />
                                Unduh
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>

            <div class="h-px bg-gray-100 my-12"></div>
        </div>

        <!-- Category Selector (Only show if no manual results or explicitly requested) -->
        <div v-if="(!results || results.length === 0)"
            class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-navy">Pilih Kategori</h3>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-700">Kategori Lomba</label>
                <select v-model="selectedCategoryId"
                    class="px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                    <option value="">-- Pilih Kategori --</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.division_name }} - {{ category.category_name }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Qualification Results (Only show if category is selected and no manual results) -->
        <div v-if="(!results || results.length === 0) && selectedCategoryId && showQualification"
            class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold text-navy mb-6">Hasil Kualifikasi</h3>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-[10px] text-gray-400  font-black tracking-widest border-b border-gray-50">
                            <th class="px-4 py-3 text-left">Peringkat</th>
                            <th class="px-4 py-3 text-left">Atlet</th>
                            <th class="px-4 py-3 text-center">X+10</th>
                            <th class="px-4 py-3 text-center">10s</th>
                            <th class="px-4 py-3 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="(result, index) in qualificationResults" :key="result.id"
                            class="group hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-4">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                                    :class="index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'text-gray-400'">
                                    {{ index + 1 }}
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                        <span class="text-xs font-bold text-gray-400 ">
                                            {{ getInitials(result.full_name) }}
                                        </span>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-navy">{{ result.full_name }}</p>
                                        <p class="text-[10px] text-gray-400 font-medium">{{ result.club_name || '-' }}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4 text-center font-bold text-gray-500">{{ result.x10_count || 0 }}</td>
                            <td class="px-4 py-4 text-center font-bold text-gray-500">{{ result.ten_count || 0 }}</td>
                            <td class="px-4 py-4 text-center">
                                <span class="px-3 py-1 bg-navy text-white rounded-lg font-black text-sm">
                                    {{ result.total_score || 0 }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="(!results || results.length === 0) && !selectedCategoryId"
            class="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div class="h-24 w-24 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-6">
                <Icon icon="ph:trophy" class="text-5xl text-gray-300" />
            </div>
            <h3 class="text-2xl font-black text-navy mb-3">Pilih Kategori</h3>
            <p class="text-gray-500 leading-relaxed">
                Pilih kategori lomba di atas untuk melihat hasil kualifikasi dan bagan eliminasi.
            </p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted } from 'vue'
import BaseButton from '~/components/common/BaseButton.vue'

const config = useRuntimeConfig()

const props = defineProps({
    eventId: {
        type: String,
        required: true
    },
    results: {
        type: Array,
        default: () => []
    },
    categories: {
        type: Array,
        default: () => []
    },
    participants: {
        type: Array,
        default: () => []
    }
})

const downloadingIndex = ref(null)

const handleDownload = async (file, index) => {
    if (!file.url) return

    downloadingIndex.value = index
    try {
        const filename = file.url.split('/').pop()
        const downloadUrl = `${config.public.apiBaseUrl}/media/download/${filename}`

        // Fetch the file as a blob to show spinner during download
        const blob = await $fetch(downloadUrl, {
            responseType: 'blob'
        })

        // Create a temporary object URL for the blob
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        // Use the title or original filename, but ensure extension is preserved
        let downloadName = (file.name || filename).replace(/[/\\?%*:|"<>]/g, '-')
        const parts = filename.split('.')
        const ext = parts.length > 1 ? parts.pop() : ''

        if (ext && !downloadName.toLowerCase().endsWith(`.${ext.toLowerCase()}`)) {
            downloadName += `.${ext}`
        }
        link.setAttribute('download', downloadName)

        document.body.appendChild(link)
        link.click()

        // Cleanup
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Download failed:', error)
    } finally {
        downloadingIndex.value = null
    }
}

const getFileIcon = (url) => {
    if (!url) return 'ph:file-bold'
    const ext = url.split('.').pop().toLowerCase()
    if (['pdf'].includes(ext)) return 'ph:file-pdf-duotone'
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'ph:file-xls-duotone'
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'ph:file-image-duotone'
    return 'ph:file-bold'
}

const getFileType = (url) => {
    if (!url) return 'DOCUMENT'
    const ext = url.split('.').pop().toUpperCase()
    return ext || 'DOCUMENT'
}

const getImageUrl = (url) => useImageOrDefault(url)

const getFileExt = (url) => {
    if (!url) return ''
    return url.split('.').pop()?.toLowerCase() || ''
}

const isImage = (url) => {
    const ext = getFileExt(url)
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}

const selectedCategoryId = ref('')

const categories = computed(() => props.categories)

const qualificationResults = computed(() => {
    if (!selectedCategoryId.value) return []

    // Filter by category and sort by score (mock data for now as per original code)
    return props.participants
        .filter(p => p.category_id === selectedCategoryId.value)
        .map((p) => ({
            id: p.id,
            full_name: p.full_name,
            club_name: p.club_name,
            x10_count: Math.floor(Math.random() * 20),
            ten_count: Math.floor(Math.random() * 30),
            total_score: 600 + Math.floor(Math.random() * 100)
        }))
        .sort((a, b) => b.total_score - a.total_score)
})

const showQualification = computed(() => {
    return selectedCategoryId.value && qualificationResults.value.length > 0
})

const showElimination = computed(() => {
    return selectedCategoryId.value && qualificationResults.value.length > 0
})

const getInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(/\s+/)
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
</script>
