<template>
    <div class="min-h-screen bg-white font-body selection:bg-primary/20 overflow-x-hidden">
        <!-- Loading State -->
        <div v-if="pending || isLoading" class="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div class="w-12 h-12 border-4 border-navy/10 border-t-primary rounded-full animate-spin"></div>
            <p class="text-sm font-bold text-gray-400 animate-pulse tracking-widest">Memuat Bagan...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error || fetchError"
            class="p-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <div class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <Icon icon="ph:warning-circle-bold" class="text-4xl text-red-500" />
            </div>
            <h1 class="text-xl font-black text-navy mb-2">Bagan Tidak Ditemukan</h1>
            <p class="text-gray-500 max-w-xs mx-auto mb-2">{{ errorMsg || 'Bagan eliminasi belum tersedia.' }}</p>
            <BaseButton variant="navy" @click="() => reloadPage()">Coba Lagi</BaseButton>
        </div>

        <!-- Main Content -->
        <div v-else class="animate-in fade-in duration-700">
            <!-- Compact Category Filter (Horizontal Scroller) -->
            <div class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
                <div class="flex items-center gap-3 overflow-x-auto p-4 no-scrollbar scrollbar-hide">
                    <button v-for="cat in categories" :key="cat.uuid" @click="selectCategory(cat)" :class="[
                        'flex-shrink-0 px-4 py-2.5 rounded-full text-[11px] font-black tracking-wider transition-all duration-300 border-2',
                        selectedCategoryId === cat.uuid
                            ? 'bg-navy border-navy text-white shadow-md'
                            : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
                    ]">
                        {{ cat.category_name }}
                    </button>
                </div>
            </div>

            <!-- Bracket View -->
            <main class="p-0">
                <div v-if="bracketLoading" class="p-20 flex justify-center">
                    <div class="w-8 h-8 border-3 border-navy/10 border-t-primary rounded-full animate-spin"></div>
                </div>

                <div v-else-if="bracket" class="relative">
                    <PublicEliminationBracket :bracket="bracket" :rounds="sortedRounds" />
                </div>

                <div v-else class="p-20 text-center">
                    <div class="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon icon="ph:trophy-bold" class="text-3xl text-gray-200" />
                    </div>
                    <h3 class="text-sm font-black text-navy tracking-widest">Belum Ada Pertandingan</h3>
                    <p class="text-xs text-gray-400 mt-1">Bagan eliminasi untuk kategori ini belum dibuat.</p>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
/**
 * PURE BRACKET EMBED PAGE
 * Path: /embed/results/:slug
 */
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import PublicEliminationBracket from '~/components/elimination/PublicEliminationBracket.vue'

definePageMeta({
    layout: false
})

const route = useRoute()
const { get } = useApi()
const slug = route.params.slug
const apiBaseUrl = useApiBaseUrl()

const isLoading = ref(true)
const bracketLoading = ref(false)
const fetchError = ref(false)
const errorMsg = ref('')

const categories = ref([])
const selectedCategoryId = ref(null)
const bracket = ref(null)

// Initial fetch for event basic info
const { data: event, pending, error, refresh: reloadEvent } = await useAsyncData(
    `embed-event-${slug}`,
    () => $fetch(`${apiBaseUrl}/events/${slug}`)
)

const sortedRounds = computed(() => {
    if (!bracket.value?.matches) return {}
    const rounds = bracket.value.matches
    const sortedKeys = Object.keys(rounds).sort((a, b) => parseInt(a) - parseInt(b))
    const sorted = {}
    sortedKeys.forEach(key => {
        sorted[key] = rounds[key]
    })
    return sorted
})

const selectCategory = async (cat) => {
    selectedCategoryId.value = cat.uuid
    // Update URL query without reload
    const url = new URL(window.location)
    url.searchParams.set('category_id', cat.uuid)
    window.history.replaceState({}, '', url)

    await fetchBracketData(cat.uuid)
}

const fetchBracketData = async (catId) => {
    bracketLoading.value = true
    try {
        const response = await get(`/events/${slug}/results/elimination`, {
            params: { category_id: catId }
        })
        bracket.value = response?.bracket || null
    } catch (err) {
        console.error('Failed to fetch bracket:', err)
        bracket.value = null
    } finally {
        bracketLoading.value = false
    }
}

const reloadPage = () => {
    reloadEvent()
    init()
}

const init = async () => {
    isLoading.value = true
    try {
        // Fetch all categories for the filter
        const catResponse = await get(`/events/${slug}/categories`, { params: { limit: 100 } })
        const rawCats = catResponse?.events || []

        categories.value = rawCats.map(cat => ({
            uuid: cat.id,
            category_name: [
                cat.division_name,
                cat.category_name,
                cat.gender_division_name,
                cat.event_type_name !== 'Individual' ? `(${cat.event_type_name})` : ''
            ].filter(Boolean).join(' ')
        }))

        if (categories.value.length > 0) {
            // Check if category_id is in query, else take first
            const queryCatId = route.query.category_id
            const initialCat = categories.value.find(c => c.uuid === queryCatId) || categories.value[0]
            selectedCategoryId.value = initialCat.uuid
            await fetchBracketData(initialCat.uuid)
        } else {
            fetchError.value = true
            errorMsg.value = "Tidak ada kategori lomba ditemukan."
        }
    } catch (err) {
        fetchError.value = true
        errorMsg.value = "Gagal memuat daftar kategori."
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    init()
})

// SEO Meta
watchEffect(() => {
    if (event.value) {
        useSeoMeta({
            title: `Bagan Eliminasi | ${event.value.name}`,
            description: `Bagan eliminasi real-time untuk ${event.value.name}.`,
        })
    }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.animate-in {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
