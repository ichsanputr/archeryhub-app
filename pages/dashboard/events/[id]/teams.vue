<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div class="space-y-1">
                    <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Manajemen Tim Resmi</h1>
                    <p class="text-gray-500 text-sm">Review dan sinkronisasi tim untuk babak eliminasi {{ eventName }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Category Selection -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 class="text-base font-bold text-navy mb-4">Pilih Kategori Lomba</h2>

            <div v-if="loadingCategories" class="flex gap-4 overflow-x-auto pb-2">
                <div v-for="i in 4" :key="i"
                    class="flex-shrink-0 w-72 p-5 rounded-xl border border-gray-100 animate-pulse">
                    <div class="flex items-start gap-3">
                        <div class="size-12 bg-gray-100 rounded-xl"></div>
                        <div class="flex-1">
                            <div class="h-5 bg-gray-100 rounded mb-2"></div>
                            <div class="h-4 bg-gray-50 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-400">
                <Icon icon="ph:folder-notch-open" class="text-4xl mx-auto mb-2" />
                <p>Kategori tidak ditemukan</p>
            </div>

            <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <button v-for="category in categories" :key="category.id" @click="selectCategory(category)" :class="[
                    'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative',
                    selectedCategory?.id === category.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                ]">
                    <div class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-colors"
                        :class="selectedCategory?.id === category.id ? 'bg-primary' : 'bg-transparent'"></div>
                    <div class="flex items-start gap-3 pl-2">
                        <div
                            class="size-12 bg-gradient-to-br from-navy/90 to-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Icon icon="ph:users-three" class="text-xl text-primary" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-bold transition-colors leading-tight mb-1 line-clamp-2">
                                {{ getCategoryName(category) }}
                            </p>
                            <div class="flex flex-wrap items-center gap-2">
                                <span
                                    class="px-2 py-0.5 bg-primary/50 rounded-md text-[10px] font-black  tracking-tighter">
                                    {{ category.event_type_name }}
                                </span>
                                <div class="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                    <Icon icon="ph:user-bold" />
                                    <span>{{ category.participant_count || 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Main Content: Official Teams List -->
        <div class="space-y-6">
            <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 class="text-lg font-bold text-navy leading-tight">Daftar Tim Resmi</h2>
                        <p class="text-sm text-gray-500 mt-1">Tim yang telah disinkronkan dari hasil kualifikasi</p>
                    </div>
                </div>

                <div v-if="loadingTeams" class="space-y-4">
                    <div v-for="i in 3" :key="i" class="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>
                </div>

                <div v-else-if="officialTeams.length === 0"
                    class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div
                        class="size-20 bg-white shadow-sm rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <Icon icon="ph:users-four" class="text-4xl text-gray-200" />
                    </div>
                    <h3 class="text-xl font-bold text-navy mb-2">Belum ada tim resmi</h3>
                    <p class="text-gray-400 max-w-sm mx-auto text-sm">
                        Klik tombol <strong>Update Data Team</strong> di pojok kanan atas untuk memproses data
                        kualifikasi terbaru.
                    </p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="team in officialTeams" :key="team.uuid"
                        class="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-sm hover:shadow-navy/5 transition-all group border-b-4 border-b-gray-100 hover:border-b-primary relative">
                        <!-- Rank Badge -->
                        <div
                            class="absolute -top-3 -right-3 size-10 bg-navy text-primary rounded-xl flex items-center justify-center font-black text-lg shadow-sm border-4 border-white group-hover:bg-primary group-hover:text-navy transition-colors">
                            {{ team.team_rank || '-' }}
                        </div>

                        <div class="flex items-start justify-between mb-6">
                            <div class="flex items-center gap-4">
                                <div
                                    class="size-14 bg-navy/5 rounded-2xl flex items-center justify-center text-navy group-hover:bg-primary group-hover:scale-110 transition-all">
                                    <Icon icon="ph:users-four-bold" class="text-3xl" />
                                </div>
                                <div>
                                    <h3
                                        class="font-black text-navy text-lg group-hover:text-primary transition-colors line-clamp-1">
                                        {{ team.team_name }}</h3>
                                    <p class="text-xs font-bold text-gray-400  tracking-widest">
                                        {{ team.country_code || 'KLUB' }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Members list -->
                        <div class="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <p
                                class="text-[10px] font-black text-gray-400  tracking-widest mb-2 flex items-center gap-2">
                                <Icon icon="ph:identification-card-bold" />
                                Anggota Tim & Skor
                            </p>
                            <div v-if="team.members && team.members.length > 0">
                                <div v-for="(member, index) in team.members" :key="member.id || index"
                                    class="flex items-center justify-between group/member py-1">
                                    <span
                                        class="text-sm font-bold text-navy truncate flex-1 pr-2 group-hover/member:text-primary transition-colors">
                                        {{ member.full_name || '-' }}
                                    </span>
                                    <span
                                        class="px-2 py-0.5 bg-white border border-gray-100 rounded-md text-[11px] font-black text-navy shadow-sm">
                                        {{ member.total_score || 0 }}
                                    </span>
                                </div>
                            </div>
                            <div v-else class="text-sm text-gray-400 italic">Tidak ada anggota</div>
                        </div>

                        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div class="flex flex-col">
                                <span class="text-[10px] font-black text-gray-400  tracking-widest">Total
                                    Skor</span>
                                <span class="text-xl font-black text-navy">{{ team.total_score }}</span>
                            </div>
                            <div class="flex flex-col items-end">
                                <span class="text-[10px] font-black text-gray-400  tracking-widest">Total
                                    X</span>
                                <div class="flex items-center gap-1 text-navy font-black">
                                    <Icon icon="ph:crosshair-bold" class="text-primary" />
                                    {{ team.total_x_count }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()
const eventId = route.params.id
const { get, post } = useApi()
const toast = useToast()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Manajemen Tim - Dashboard'
})

// State Management
const eventName = ref('Loading...')
const categories = ref([])
const selectedCategory = ref(null)
const officialTeams = ref([])

// Loading States
const loadingCategories = ref(false)
const loadingTeams = ref(false)
const generatingTeams = ref(false)

// Methods
const fetchEventName = async () => {
    try {
        const response = await get(`/events/${eventId}`)
        eventName.value = response?.event?.name || response?.name || 'Event'
    } catch (error) {
        console.error('Failed to fetch event:', error)
    }
}

const fetchCategories = async () => {
    loadingCategories.value = true
    try {
        const response = await get(`/events/${eventId}/categories`)
        const data = response?.events || response?.categories || []
        // Filter out individual categories for Team management
        const teamCategories = data.filter(cat =>
            cat.event_type_name?.toLowerCase() !== 'individual'
        )
        categories.value = teamCategories

        if (teamCategories.length > 0) {
            // Restore from url or select first
            const catId = route.query.category || teamCategories[0].id
            const found = teamCategories.find(c => c.id === catId) || teamCategories[0]
            selectCategory(found)
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    } finally {
        loadingCategories.value = false
    }
}

const selectCategory = async (category) => {
    selectedCategory.value = category
    await syncAndFetchTeams(category.id)
}

const syncAndFetchTeams = async (categoryId) => {
    loadingTeams.value = true
    generatingTeams.value = true
    try {
        // First sync to generate latest teams
        await post(`/teams/event/${eventId}/sync`, {
            category_id: categoryId
        })

        // Then fetch the teams
        const response = await get(`/teams/event/${eventId}`, {
            params: { category_id: categoryId }
        })
        officialTeams.value = response?.teams || []
    } catch (error) {
        console.error('Failed to sync/fetch teams:', error)
        officialTeams.value = []
    } finally {
        loadingTeams.value = false
        generatingTeams.value = false
    }
}


const getCategoryName = (category) => {
    if (!category) return ''
    return [
        category.division_name,
        category.category_name,
        category.gender_division_name
    ].filter(Boolean).join(' ')
}

// Watchers and lifecycle
onMounted(() => {
    fetchEventName()
    fetchCategories()
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
</style>
