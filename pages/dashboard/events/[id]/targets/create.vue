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
                                        {{ category.category_name }} - {{ category.division_name }}
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
                                    <span>Nomor target harus unik dalam sesi dan kategori yang sama</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Setelah target dibuat, atlet dapat diassign ke posisi A, B, C, atau D</span>
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

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { get } = useApi()
const toast = useToast()

const isSubmitting = ref(false)
const eventId = route.params.id

const eventCategories = ref([])

const form = ref({
    phase: '',
    sessionId: '',
    categoryId: '',
    roundName: '',
    target_number: null
})

const fetchEventCategories = async () => {
    try {
        const response = await get(`/events/${eventId}/categories`)
        if (response && response.events && Array.isArray(response.events)) {
            eventCategories.value = response.events.map(cat => ({
                id: cat.id,
                category_name: cat.category_name,
                division_name: cat.division_name
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
        // For qualification: target is created implicitly when assignments are made
        // For now, we'll just validate and redirect - actual target creation happens when assigning participants
        // In a real implementation, you might want to create a "target" record first
        
        if (form.value.phase === 'qualification') {
            // Check if target number already exists in this session
            // This would require an API endpoint to check
            toast.success('Target siap dibuat. Silakan assign atlet ke target ini dari halaman Target.')
        } else {
            // For elimination, targets are created differently
            toast.success('Target siap dibuat untuk fase eliminasi.')
        }
        
        router.push(`/dashboard/events/${eventId}/targets`)
    } catch (error) {
        console.error('Failed to create target:', error)
        toast.error(error.response?.data?.error || 'Gagal membuat target')
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    fetchEventCategories()
})
</script>
