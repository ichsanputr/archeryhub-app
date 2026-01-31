<template>
    <div class="space-y-8">
        <section class="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-navy/5 border border-gray-100 overflow-hidden relative">
            <!-- Decorative Background Element -->
            <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60"></div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                <div>
                    <h2 class="text-2xl md:text-3xl font-black text-navy flex items-center gap-4">
                        <div class="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
                            <Icon icon="iconoir:leaderboard" class="text-2xl text-navy" />
                        </div>
                        Hasil Lomba
                    </h2>
                    <p class="text-sm md:text-base text-gray-500 mt-2 font-medium max-w-xl leading-relaxed">
                        Unduh dokumen resmi hasil pertandingan dan pengumuman pemenang yang telah diterbitkan oleh panitia.
                    </p>
                </div>
            </div>

            <!-- Content Area -->
            <div v-if="isLoading && resultsData.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div v-for="i in 2" :key="i" class="bg-gray-50 rounded-[28px] p-6 border border-gray-100 animate-pulse">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-16 h-20 bg-gray-200 rounded-2xl"></div>
                        <div class="flex-1 space-y-3">
                            <div class="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                            <div class="h-3 bg-gray-200 rounded-md w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="resultsData && resultsData.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div v-for="(file, index) in resultsData" :key="index"
                    class="group bg-white rounded-[28px] p-6 border border-gray-100 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col justify-between">
                    
                    <div class="flex items-start gap-5 mb-8">
                        <!-- File Type Visual -->
                        <div class="w-16 h-20 rounded-2xl bg-navy/5 border border-navy/5 flex flex-col items-center justify-center shrink-0 group-hover:bg-navy transition-all duration-500">
                            <Icon :icon="getFileIcon(file.url)" class="text-3xl text-navy group-hover:text-white transition-colors duration-500" />
                            <span class="text-[9px] font-black uppercase mt-1 opacity-40 group-hover:opacity-100 group-hover:text-white">{{ getFileExt(file.url) }}</span>
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-2">
                                <span class="px-2 py-0.5 bg-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400 rounded-md">Official Document</span>
                                <span class="text-[10px] font-bold text-gray-400">{{ formatFileSize(file.size) }}</span>
                            </div>
                            <h3 class="font-black text-navy text-lg leading-tight group-hover:text-primary transition-colors mb-2 line-clamp-2"
                                :title="file.title || file.name || 'Dokumen Tanpa Judul'">
                                {{ file.title || file.name || 'Dokumen Tanpa Judul' }}
                            </h3>
                            <div class="flex items-center gap-2 text-[10px] font-medium text-gray-400 italic truncate">
                                <Icon icon="ph:file-arrow-down" />
                                <span>Save as: {{ file.name || 'document' }}.{{ getFileExt(file.url) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-3">
                        <a :href="file.url" target="_blank"
                            class="flex-1 py-3.5 bg-gray-50 hover:bg-navy hover:text-white text-navy font-black text-xs rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-transparent shadow-sm">
                            <Icon icon="ph:eye-bold" class="text-sm" />
                            Pratinjau
                        </a>
                        <a :href="file.url" :download="(file.name || 'hasil-lomba') + '.' + getFileExt(file.url)"
                            class="flex-1 py-3.5 bg-primary hover:bg-navy hover:text-white text-navy font-black text-xs rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-primary/20 shadow-sm shadow-primary/10">
                            <Icon icon="ph:download-simple-bold" class="text-sm" />
                            Download
                        </a>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20 relative z-10">
                <div class="w-32 h-32 mx-auto rounded-[40px] bg-gray-50 flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Icon icon="ph:files-bold" class="text-6xl text-gray-200" />
                </div>
                <h3 class="text-2xl font-black text-navy mb-3">Hasil Belum Dipublikasikan</h3>
                <p class="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                    Dokumen hasil pertandingan akan muncul di sini segera setelah diverifikasi oleh panitia lomba.
                </p>
                <button @click="fetchResults" class="mt-8 px-8 py-3 bg-navy text-white font-bold rounded-2xl hover:bg-navy/90 transition-all flex items-center gap-2 mx-auto shadow-lg shadow-navy/20">
                    <Icon icon="ph:arrows-clockwise-bold" />
                    Perbarui Halaman
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    eventId: {
        type: String,
        required: true
    },
    results: {
        type: Array,
        default: () => []
    }
})

const config = useRuntimeConfig()
const resultsData = ref([...props.results])
const isLoading = ref(false)

const fetchResults = async () => {
    if (!props.eventId) return
    isLoading.value = true
    try {
        const response = await $fetch(`${config.public.apiBaseUrl}/events/${props.eventId}`)
        const data = response?.data || response
        if (data && data.page_settings) {
            const pageSettings = typeof data.page_settings === 'string' ? JSON.parse(data.page_settings) : data.page_settings
            resultsData.value = pageSettings.results || []
        }
    } catch (error) {
        console.error('Failed to fetch results:', error)
    } finally {
        isLoading.value = false
    }
}

watch(() => props.results, (newVal) => {
    if (newVal && newVal.length > 0) {
        resultsData.value = newVal
    }
}, { immediate: true })

const getFileExt = (url) => {
    if (!url) return ''
    return url.split('.').pop()?.toLowerCase() || ''
}

const getFileIcon = (url) => {
    const ext = getFileExt(url)
    if (ext === 'pdf') return 'ph:file-pdf-duotone'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'ph:file-image-duotone'
    return 'ph:file-duotone'
}

const formatFileSize = (bytes) => {
    if (!bytes) return ''
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

onMounted(() => {
    if (resultsData.value.length === 0) {
        fetchResults()
    }
})
</script>
