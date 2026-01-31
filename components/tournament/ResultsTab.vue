<template>
    <div class="space-y-6">
        <!-- Manual Results / Files -->
        <div v-if="results && results.length > 0" class="space-y-4">
            <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 class="text-xl font-black text-navy mb-2 flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                        <Icon icon="ph:file-pdf-bold" class="text-2xl text-navy" />
                    </div>
                    Hasil Perlombaan
                </h3>
                <p class="text-gray-600 text-sm font-medium mb-6">Download berkas hasil pertandingan resmi yang
                    diunggah oleh penyelenggara.</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a v-for="(file, fIdx) in results" :key="fIdx" :href="getImageUrl(file.url)" target="_blank"
                        class="flex items-center gap-4 p-5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-navy/5 hover:border-navy transition-all group">
                        <div
                            class="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-all">
                            <Icon :icon="getFileIcon(file.url)" class="text-2xl" />
                        </div>
                        <div class="flex-grow min-w-0">
                            <h4 class="text-navy font-bold truncate group-hover:text-navy transition-colors">{{
                                file.name || 'Berkas Hasil' }}</h4>
                            <p class="text-gray-500 text-[10px] font-black uppercase tracking-wider mt-0.5">{{
                                getFileType(file.url) }}</p>
                        </div>
                        <Icon icon="ph:download-simple-bold"
                            class="text-gray-400 group-hover:text-navy transition-colors" />
                    </a>
                </div>
            </div>
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
                        <tr
                            class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-50">
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
                                        <span class="text-xs font-bold text-gray-400 uppercase">
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
