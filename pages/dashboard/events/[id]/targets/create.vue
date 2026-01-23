<template>
    <div class="space-y-8 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard/events" class="hover:text-primary transition-colors">Events</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/overview`"
                        class="hover:text-primary transition-colors">Control Panel</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink :to="`/dashboard/events/${route.params.id}/targets`"
                        class="hover:text-primary transition-colors">Target</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Tambah Target</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Tambah Target Baru</h1>
                <p class="text-gray-500 font-medium mt-1">Buat target baru untuk event ini.</p>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Form -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Basic Information -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 class="text-xl font-bold text-navy mb-6">Informasi Target</h2>
                        <div class="space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Nomor Target *</label>
                                <input v-model.number="form.target_number" type="number" min="1" required
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Contoh: 1, 2, 3..." />
                                <p class="text-xs text-gray-400 mt-1">Nomor unik untuk target ini</p>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                <select v-model="form.status"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                    <option value="active">Aktif</option>
                                    <option value="maintenance">Sedang Perbaikan</option>
                                    <option value="inactive">Tidak Aktif</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Keterangan</label>
                                <textarea v-model="form.notes" rows="4"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="Tambahkan keterangan atau catatan untuk target ini (opsional)"></textarea>
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
                                    <span>Nomor target harus unik untuk event ini</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Target dapat diatur statusnya setelah dibuat</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Setiap target dapat menampung hingga 4 atlet</span>
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { post } = useApi()
const toast = useToast()

const isSubmitting = ref(false)
const eventId = route.params.id

const form = ref({
    target_number: null,
    status: 'active',
    notes: ''
})

const handleSubmit = async () => {
    if (!form.value.target_number || form.value.target_number < 1) {
        toast.error('Harap masukkan nomor target yang valid')
        return
    }

    isSubmitting.value = true
    try {
        // Note: This endpoint may need to be created in the API
        // For now, we'll use a placeholder endpoint structure
        const payload = {
            target_number: form.value.target_number,
            status: form.value.status,
            notes: form.value.notes || null
        }

        await post(`/events/${eventId}/targets`, payload)
        toast.success('Target berhasil ditambahkan')
        router.push(`/dashboard/events/${eventId}/targets`)
    } catch (error) {
        console.error('Failed to create target:', error)
        toast.error(error.response?.data?.error || 'Gagal menambahkan target')
    } finally {
        isSubmitting.value = false
    }
}
</script>
