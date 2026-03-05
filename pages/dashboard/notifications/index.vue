<template>
    <div class="space-y-6 pb-20">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:bell-ringing-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Notifikasi</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Pemberitahuan, undangan, dan
                            informasi penting lainnya.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Invitations Section (acting as our first notification type) -->
        <div v-if="invitations.length > 0" class="space-y-4">
            <h3 class="text-lg font-black text-navy mb-4">Undangan Klub</h3>
            <div v-for="invite in invitations" :key="invite.uuid"
                class="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                <!-- Decoration -->
                <div
                    class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-200/20 blur-2xl pointer-events-none">
                </div>

                <div class="flex items-center gap-4 relative z-10">
                    <div
                        class="size-12 rounded-xl bg-white flex items-center justify-center border border-amber-100 shadow-sm shrink-0 overflow-hidden">
                        <img v-if="invite.club_logo" :src="invite.club_logo" class="size-full object-cover" />
                        <Icon v-else icon="ph:buildings-bold" class="text-amber-500 text-2xl" />
                    </div>
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span
                                class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black capitalize tracking-widest">Undangan</span>
                            <p class="text-xs text-gray-400 font-bold">{{ formatDate(invite.created_at) }}</p>
                        </div>
                        <h3 class="font-black text-navy text-sm sm:text-base leading-tight">{{ invite.club_name }}</h3>
                        <p class="text-amber-700 text-xs sm:text-sm mt-0.5 font-medium">
                            Mengajak Anda untuk bergabung sebagai <span class="font-bold underline">{{ invite.role ||
                                'Member' }}</span>.
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-2 relative z-10">
                    <BaseButton :disabled="isResponding === invite.uuid" variant="white" size="sm"
                        @click="respondInvitation(invite.uuid, 'reject')"
                        class="flex-1 sm:flex-none h-10 px-4 font-black text-[10px] uppercase tracking-wider border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors">
                        Tolak
                    </BaseButton>
                    <BaseButton :disabled="isResponding === invite.uuid" variant="primary" size="sm"
                        @click="respondInvitation(invite.uuid, 'accept')"
                        class="flex-1 sm:flex-none h-10 px-6 font-black text-[10px] uppercase tracking-wider shadow-lg shadow-primary/20">
                        <Icon v-if="isResponding === invite.uuid" icon="ph:spinner" class="animate-spin mr-2" />
                        Terima Undangan
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="invitations.length === 0 && !isLoading"
            class="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
            <div class="size-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                <Icon icon="ph:bell-slash-bold" class="text-4xl" />
            </div>
            <h3 class="text-xl font-black text-navy mb-2">Belum Ada Notifikasi</h3>
            <p class="text-slate-500 text-sm font-medium">Anda belum menerima notifikasi atau undangan apa pun saat ini.
            </p>
        </div>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
    title: 'Notifikasi',
    layout: 'dashboard'
})

useHead({
    title: 'Notifikasi - ArcheryHub Dashboard'
})

const { get, post } = useApi()
const toast = useToast()

const invitations = ref([])
const isResponding = ref(null)
const isLoading = ref(true)

const fetchInvitations = async () => {
    isLoading.value = true
    try {
        const response = await get('/clubs/my/invitations')
        invitations.value = response?.data || []
    } catch (error) {
        console.error('Failed to fetch invitations:', error)
    } finally {
        isLoading.value = false
    }
}

const respondInvitation = async (memberId, action) => {
    isResponding.value = memberId
    try {
        await post(`/clubs/invitations/${memberId}/respond`, { action })
        toast.success(action === 'accept' ? 'Berhasil bergabung dengan klub!' : 'Undangan ditolak')
        await fetchInvitations()
    } catch (error) {
        console.error('Failed to respond to invitation:', error)
        toast.error('Gagal memproses undangan')
    } finally {
        isResponding.value = null
    }
}

const formatDate = (val) => {
    if (!val) return 'Baru saja'
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(val))
}

onMounted(() => {
    fetchInvitations()
})
</script>
