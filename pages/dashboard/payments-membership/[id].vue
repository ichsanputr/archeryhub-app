<template>
    <div class="flex flex-col gap-6">
        <!-- ── Page Header ──────────────────────────────────────────────── -->
        <div class="relative overflow-hidden rounded-3xl bg-navy text-white border border-primary/20 shadow-sm">
            <div class="absolute inset-0"
                style="background-image:var(--motif-pattern);opacity:var(--motif-opacity,0.15)"></div>
            <div class="absolute -top-16 -right-16 size-56 rounded-full bg-primary/10 blur-3xl pointer-events-none">
            </div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-5">
                    <NuxtLink to="/dashboard/payments-membership"
                        class="size-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all backdrop-blur-md shrink-0">
                        <Icon icon="ph:arrow-left-bold" />
                    </NuxtLink>
                    <div>
                        <div
                            class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1">
                            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                            <Icon icon="ph:caret-right-bold" class="opacity-50" />
                            <NuxtLink to="/dashboard/payments-membership"
                                class="hover:text-primary transition-colors text-white/80">Pembayaran</NuxtLink>
                            <Icon icon="ph:caret-right-bold" class="opacity-50" />
                            <span class="text-white">Detail</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black leading-tight">Detail Pembayaran</h1>
                        <p class="text-white/60 text-sm mt-1">Informasi lengkap transaksi pembayaran membership</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Loading ─────────────────────────────────────────────────── -->
        <div v-if="isLoading"
            class="bg-white rounded-[2rem] border border-gray-100 p-20 flex flex-col items-center justify-center min-h-[500px]">
            <div class="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        </div>

        <!-- ── Main Content ────────────────────────────────────────────── -->
        <div v-else-if="payment" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-10">
            <!-- Summary Card -->
            <div class="lg:col-span-8 space-y-6">
                <div
                    class="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-sm shadow-navy/5 overflow-hidden">
                    <div class="p-6 sm:p-10 space-y-8 sm:space-y-10">
                        <!-- Profile/Package Info -->
                        <div
                            class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                            <div
                                class="size-16 sm:size-20 rounded-2xl sm:rounded-3xl bg-navy/5 border border-navy/5 overflow-hidden shrink-0 flex items-center justify-center text-navy/10 text-3xl sm:text-4xl">
                                <img v-if="payment.avatar_url" :src="payment.avatar_url" class="size-full object-cover">
                                <Icon v-else icon="ph:user-bold" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h1
                                    class="text-xl sm:text-3xl font-black text-navy leading-tight sm:leading-none truncate">
                                    {{ payment.archer_name }}</h1>
                                <div
                                    class="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-2 mt-3 sm:mt-4">
                                    <div
                                        class="flex items-center gap-2 px-2.5 py-1 rounded-lg sm:rounded-xl bg-gray-100 text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                        <Icon icon="ph:package-bold" />
                                        {{ payment.package_name || 'Membership' }}
                                    </div>
                                    <div
                                        class="flex items-center gap-2 text-gray-400 text-[11px] sm:text-xs font-bold whitespace-nowrap">
                                        <Icon icon="ph:envelope-simple-bold" />
                                        {{ payment.archer_email }}
                                    </div>
                                    <div
                                        class="flex items-center gap-2 text-gray-400 text-[11px] sm:text-xs font-bold whitespace-nowrap">
                                        <Icon icon="ph:hash-bold" />
                                        {{ payment.invoice_id }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Divider -->
                        <div class="h-px bg-gray-50"></div>

                        <!-- Details Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                            <div class="space-y-6 sm:space-y-8">
                                <div>
                                    <p
                                        class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 sm:mb-3">
                                        Nominal Transaksi</p>
                                    <p class="text-3xl sm:text-4xl font-black text-navy">{{
                                        formatCurrency(payment.amount) }}</p>
                                </div>

                                <div>
                                    <p
                                        class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 sm:mb-3">
                                        Metode Pembayaran</p>
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="size-9 sm:size-10 rounded-xl bg-gray-50 flex items-center justify-center text-navy border border-gray-100">
                                            <Icon :icon="getMethodIcon(payment.payment_method)"
                                                class="text-lg sm:text-xl" />
                                        </div>
                                        <span
                                            class="text-xs sm:text-sm font-black text-navy uppercase tracking-widest">{{
                                                payment.payment_method }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-6 sm:space-y-8">
                                <div>
                                    <p
                                        class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 sm:mb-3">
                                        Waktu Pembayaran</p>
                                    <div class="flex items-center gap-2 sm:gap-3 text-navy">
                                        <Icon icon="ph:calendar-bold"
                                            class="text-base sm:text-lg text-primary shrink-0" />
                                        <span class="text-xs sm:text-sm font-black whitespace-nowrap">{{
                                            formatDate(payment.paid_at) }}</span>
                                        <span class="size-1 rounded-full bg-gray-300 shrink-0"></span>
                                        <span class="text-xs sm:text-sm font-bold text-gray-400 whitespace-nowrap">{{
                                            formatTime(payment.paid_at)
                                        }}</span>
                                    </div>
                                </div>

                                <div>
                                    <p
                                        class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 sm:mb-3">
                                        Catatan / Referensi</p>
                                    <div
                                        class="p-4 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 text-xs sm:text-sm font-medium text-navy italic">
                                        {{ payment.payment_note || 'Tidak ada catatan tambahan untuk transaksi ini.' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div
                        class="px-6 sm:px-10 py-5 sm:py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="flex items-center gap-2 order-2 sm:order-1">
                            <Icon icon="ph:shield-check-bold" class="text-green-500" />
                            <span
                                class="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaksi
                                Telah
                                Diverifikasi</span>
                        </div>
                        <div class="flex w-full sm:w-auto gap-3 order-1 sm:order-2">
                            <BaseButton variant="white" icon="ph:printer-bold" block class="sm:w-auto h-10 text-xs">
                                Cetak Kwitansi</BaseButton>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Proof Image -->
            <div class="lg:col-span-4 space-y-6">
                <div
                    class="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
                    <h3 class="font-black text-navy text-xs uppercase tracking-widest flex items-center gap-2">
                        <Icon icon="ph:image-bold" class="text-primary text-base" />
                        Bukti Pembayaran
                    </h3>

                    <div v-if="payment.proof_url"
                        class="group relative rounded-3xl overflow-hidden border border-gray-100 aspect-[3/4] cursor-pointer"
                        @click="showProofFull = true">
                        <img :src="payment.proof_url" class="size-full object-cover">
                        <div
                            class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Icon icon="ph:magnifying-glass-plus-bold" class="text-white text-3xl" />
                        </div>
                    </div>
                    <div v-else
                        class="rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50 aspect-video flex flex-col items-center justify-center text-center p-6 gap-3">
                        <Icon icon="ph:image-slash-bold" class="text-3xl text-gray-200" />
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tidak Ada Lampiran</p>
                    </div>

                    <p class="text-[10px] text-gray-400 font-medium leading-relaxed italic text-center px-4"
                        v-if="payment.payment_method === 'cash'">
                        Pembayaran tunai biasanya tidak melampirkan bukti gambar.
                    </p>
                </div>
            </div>
        </div>

        <!-- ── Modals ──────────────────────────────────────────────────── -->
        <Teleport to="body">
            <ClientOnly>
                <BaseModal v-model="showProofFull" title="Bukti Pembayaran" max-width="max-w-xl">
                    <div class="p-2">
                        <img :src="payment?.proof_url" class="w-full rounded-2xl shadow-2xl" />
                    </div>
                </BaseModal>
            </ClientOnly>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { formatDate, formatTime, formatCurrency } from '~/utils/formatter'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Detail Pembayaran - ArcheryHub'
})

const route = useRoute()
const { get } = useApi()
const toast = useToast()

const payment = ref(null)
const isLoading = ref(true)
const showProofFull = ref(false)

const getMethodIcon = (m) => {
    if (m === 'cash') return 'ph:money-bold'
    if (m === 'transfer') return 'ph:bank-bold'
    return 'ph:dots-three-circle-bold'
}

const fetchDetail = async () => {
    isLoading.value = true
    try {
        const res = await get(`/clubs/membership/payments/${route.params.id}`)
        payment.value = res.data
    } catch (err) {
        console.error('Failed to fetch payment detail:', err)
        toast.error('Gagal memuat detail pembayaran')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchDetail()
})
</script>
