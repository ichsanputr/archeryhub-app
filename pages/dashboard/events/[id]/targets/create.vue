<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Tambah Target Baru</h1>
                <p class="text-gray-500 font-medium mt-1">Buat target baru dalam konteks kategori dan fase tertentu.</p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" size="lg" @click="$router.back()">
                    Batal
                </BaseButton>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Form -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Context Selection -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6">Konteks Target</h2>
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Fase *</label>
                                <select v-model="form.phase" @change="onPhaseChange" required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                    <option value="">Pilih Fase</option>
                                    <option value="qualification">Kualifikasi</option>
                                    <option value="elimination">Eliminasi</option>
                                </select>
                                <p class="text-xs text-gray-400 mt-1">Pilih fase kompetisi untuk target ini</p>
                            </div>
                            <div v-if="form.phase === 'qualification'">
                                <label class="block text-sm font-bold text-gray-700 mb-2">Sesi *</label>
                                <select v-model="form.sessionId" @change="onSessionChange" required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                    <option value="">Pilih Sesi</option>
                                    <option value="1">Sesi 1</option>
                                    <option value="2">Sesi 2</option>
                                    <option value="3">Sesi 3</option>
                                    <option value="4">Sesi 4</option>
                                </select>
                                <p class="text-xs text-gray-400 mt-1">Pilih sesi kualifikasi</p>
                            </div>
                            <div v-if="form.phase === 'elimination'">
                                <label class="block text-sm font-bold text-gray-700 mb-2">Round *</label>
                                <select v-model="form.roundName" @change="onRoundChange" required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                    <option value="">Pilih Round</option>
                                    <option value="1/32">1/32</option>
                                    <option value="1/16">1/16</option>
                                    <option value="1/8">1/8</option>
                                    <option value="1/4">1/4 (Quarter-Final)</option>
                                    <option value="Semi-Final">Semi-Final</option>
                                    <option value="Final">Final</option>
                                </select>
                                <p class="text-xs text-gray-400 mt-1">Pilih round eliminasi</p>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Kategori *</label>
                                <select v-model="form.categoryId" @change="onCategoryChange" required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                    <option value="">Pilih Kategori</option>
                                    <option v-for="category in eventCategories" :key="category.id" :value="category.id">
                                        {{ formatCategoryName(category) }}
                                    </option>
                                </select>
                                <p class="text-xs text-gray-400 mt-1">Pilih kategori lomba untuk target ini</p>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                        <h3 class="text-lg font-bold text-navy mb-4">Aksi</h3>
                        <div class="space-y-3">
                            <BaseButton type="submit" variant="primary" size="lg" class="w-full" :loading="isSubmitting">
                                Simpan Target
                            </BaseButton>
                            <BaseButton type="button" variant="white" size="lg" class="w-full" @click="$router.back()">
                                Batal
                            </BaseButton>
                        </div>
                        <div class="mt-6 pt-6 border-t border-gray-100">
                            <h4 class="text-sm font-bold text-gray-700 mb-3">Tips</h4>
                            <ul class="space-y-2 text-xs text-gray-500">
                                <li class="flex items-start gap-2">
                                    <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Target harus dibuat dalam konteks fase dan kategori</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Setelah target dibuat, Anda dapat membuat multiple kartu target dan assign atlet ke posisi A, B, C, atau D</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { definePageMeta } from '#imports'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { get, post } = useApi()
const toast = useToast()

const isSubmitting = ref(false)
const eventId = route.params.id

const eventCategories = ref([])

const form = ref({
    phase: '',
    sessionId: '',
    categoryId: '',
    roundName: ''
})

const fetchEventCategories = async () => {
    try {
        const response = await get(`/events/${eventId}/categories`)
        if (response && response.events && Array.isArray(response.events)) {
            eventCategories.value = response.events.map(cat => ({
                id: cat.id,
                category_name: cat.category_name,
                division_name: cat.division_name,
                event_type_name: cat.event_type_name || '',
                gender_division_name: cat.gender_division_name || ''
            }))
        }
    } catch (error) {
        console.error('Failed to fetch event categories:', error)
    }
}

const onPhaseChange = () => {
    if (form.value.phase !== 'qualification') {
        form.value.sessionId = ''
    }
    if (form.value.phase !== 'elimination') {
        form.value.roundName = ''
    }
}

const onRoundChange = () => {
    // Round changed
}

const onCategoryChange = () => {
    // Category changed
}

const onSessionChange = () => {
    // Session changed, ready to create target
}

const formatCategoryName = (category) => {
    const parts = []
    if (category.division_name) parts.push(category.division_name)
    if (category.category_name) parts.push(category.category_name)
    if (category.event_type_name) parts.push(category.event_type_name)
    if (category.gender_division_name) parts.push(category.gender_division_name)
    return parts.join(' - ') || 'Kategori'
}

const handleSubmit = async () => {
    if (!form.value.phase) {
        toast.error('Harap pilih fase')
        return
    }
    
    if (!form.value.categoryId) {
        toast.error('Harap pilih kategori')
        return
    }
    
    if (form.value.phase === 'qualification' && !form.value.sessionId) {
        toast.error('Harap pilih sesi untuk fase kualifikasi')
        return
    }
    
    if (form.value.phase === 'elimination' && !form.value.roundName) {
        toast.error('Harap pilih round untuk fase eliminasi')
        return
    }

    isSubmitting.value = true
    try {
        // Get session UUID for qualification
        let sessionUUID = null
        if (form.value.phase === 'qualification') {
            // Find session UUID by session number and category
            try {
                const sessionsResponse = await get(`/qualification/sessions?category_id=${form.value.categoryId}`)
                if (sessionsResponse && sessionsResponse.sessions) {
                    const session = sessionsResponse.sessions.find(s => 
                        s.session_name === `Sesi ${form.value.sessionId}` || 
                        s.session_order === parseInt(form.value.sessionId)
                    )
                    if (session) {
                        sessionUUID = session.id
                    }
                }
            } catch (error) {
                console.warn('Failed to fetch sessions, will create new one:', error)
            }
            
            // Create session if it doesn't exist
            if (!sessionUUID) {
                try {
                    const createSessionResponse = await post('/qualification/sessions', {
                        event_category_id: form.value.categoryId,
                        session_name: `Sesi ${form.value.sessionId}`,
                        session_order: parseInt(form.value.sessionId)
                    })
                    if (createSessionResponse && createSessionResponse.id) {
                        sessionUUID = createSessionResponse.id
                    } else {
                        throw new Error('Failed to create session: No ID returned')
                    }
                } catch (error) {
                    console.error('Failed to create session:', error)
                    toast.error(error.response?.data?.error || 'Gagal membuat sesi')
                    return
                }
            }
            
            // Validate we have a valid UUID
            if (!sessionUUID || sessionUUID === form.value.sessionId) {
                toast.error('Gagal mendapatkan UUID sesi. Silakan coba lagi.')
                return
            }
        }

        // Create target via API
        const payload = {
            phase: form.value.phase,
            category_id: form.value.categoryId
        }

        if (form.value.phase === 'qualification') {
            payload.session_id = sessionUUID
        } else {
            payload.round_name = form.value.roundName
        }

        const response = await post('/targets', payload)
        
        if (response) {
            toast.success('Target berhasil dibuat')
            router.push(`/dashboard/events/${eventId}/targets`)
        }
    } catch (error) {
        console.error('Failed to create target:', error)
        toast.error(error.response?.data?.error || error.message || 'Gagal membuat target')
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    fetchEventCategories()
})
</script>
