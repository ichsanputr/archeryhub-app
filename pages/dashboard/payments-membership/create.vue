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
                            <span class="text-white">Baru</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-black leading-tight">Catat Pembayaran</h1>
                        <p class="text-white/60 text-sm mt-1">Rekam pembayaran baru dari anggota yang memiliki tagihan
                            aktif</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <BaseButton variant="white" @click="$router.push('/dashboard/payments-membership')">Batal
                    </BaseButton>
                    <BaseButton variant="primary" :loading="isSaving" @click="savePayment"
                        :disabled="!payForm.subscription_id || !payForm.amount">
                        <Icon icon="ph:check-bold" class="mr-2" />
                        Simpan Rekaman
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- ── Main Grid ────────────────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            <!-- List Section (4 cols) -->
            <div class="lg:col-span-4 flex flex-col gap-6">
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div class="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <h3 class="font-black text-navy text-xs uppercase tracking-widest flex items-center gap-2">
                            <Icon icon="ph:clock-countdown-bold" class="text-primary text-base" />
                            Tagihan Tertunda
                        </h3>
                        <span class="px-2 py-0.5 rounded-full bg-gray-100 text-primary text-[10px] font-black">
                            {{ unpaidSubs.length }}
                        </span>
                    </div>

                    <div class="p-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                        <div v-if="loadingUnpaid"
                            class="flex flex-col items-center justify-center py-20 gap-3 grayscale opacity-30">
                            <div class="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin">
                            </div>
                            <p class="text-[10px] font-bold uppercase tracking-widest text-navy">Memuat Data...</p>
                        </div>

                        <template v-else-if="unpaidSubs.length">
                            <div class="flex flex-col gap-2">
                                <button v-for="s in unpaidSubs" :key="s.uuid" @click="payForm.subscription_id = s.uuid"
                                    class="w-full text-left p-4 rounded-2xl border-2 group relative overflow-hidden"
                                    :class="payForm.subscription_id === s.uuid ? 'border-primary bg-gray-50 shadow-md shadow-primary/5' : 'border-gray-50 hover:border-gray-100 bg-white'">

                                    <div class="flex items-center gap-3 relative z-10">
                                        <div
                                            class="size-10 rounded-xl bg-navy/5 border border-navy/5 overflow-hidden shrink-0 flex items-center justify-center text-navy/20 group-hover:scale-105 transition-transform">
                                            <img v-if="s.avatar_url" :src="s.avatar_url" class="size-full object-cover">
                                            <Icon v-else icon="ph:user-bold" class="text-xl" />
                                        </div>
                                        <div class="min-w-0">
                                            <p
                                                class="font-black text-navy text-sm truncate group-hover:text-primary transition-colors">
                                                {{ s.archer_name }}</p>
                                            <p class="text-[10px] font-bold text-gray-400 truncate uppercase mt-0.5">{{
                                                s.package_name }}</p>
                                        </div>
                                    </div>

                                    <div
                                        class="mt-3 pt-3 border-t border-navy/5 flex items-center justify-between relative z-10">
                                        <div
                                            class="px-2 py-1 rounded-lg bg-gray-50 text-gray-500 text-[10px] font-black group-hover:bg-gray-200 group-hover:text-primary transition-colors">
                                            PENDING
                                        </div>
                                        <span class="text-sm font-black text-navy">{{ formatCurrency(s.amount) }}</span>
                                    </div>

                                    <!-- Active Glow -->
                                    <div v-if="payForm.subscription_id === s.uuid"
                                        class="absolute -right-4 -top-4 size-12 bg-gray-100 blur-xl rounded-full">
                                    </div>
                                </button>
                            </div>
                        </template>

                        <div v-else class="text-center py-20 px-6">
                            <div
                                class="size-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <Icon icon="ph:check-circle-bold" class="text-4xl" />
                            </div>
                            <h4 class="font-black text-navy text-sm">Semua Beres!</h4>
                            <p class="text-gray-400 text-xs mt-1 leading-relaxed">Tidak ada tagihan keanggotaan yang
                                perlu dicatat saat ini.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Section (8 cols) -->
            <div class="lg:col-span-8">
                <!-- Empty State -->
                <div v-if="!payForm.subscription_id"
                    class="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-20 flex flex-col items-center justify-center text-center gap-6 min-h-[500px]">
                    <div class="relative">
                        <div
                            class="size-24 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-primary/40 rotate-12">
                            <Icon icon="ph:mouse-left-click-bold" class="text-5xl" />
                        </div>
                        <div
                            class="absolute -bottom-2 -right-2 size-10 rounded-2xl bg-white shadow-xl border border-gray-50 flex items-center justify-center text-primary">
                            <Icon icon="ph:hand-pointing-bold" />
                        </div>
                    </div>
                    <div class="max-w-sm">
                        <h3 class="font-black text-navy text-2xl">Pilih Anggota</h3>
                        <p class="text-gray-400 text-sm mt-2 leading-relaxed font-medium">Klik pada salah satu kartu di
                            daftar
                            sebelah kiri untuk mulai mencatat riwayat pembayaran mereka secara detail.</p>
                    </div>
                </div>

                <!-- Form -->
                <div v-else
                    class="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-navy/5 overflow-hidden">
                    <div class="p-10 space-y-8">
                        <!-- Profile Header -->
                        <div
                            class="flex items-center gap-5 p-6 rounded-3xl bg-gray-50 border border-gray-100 relative overflow-hidden group">
                            <div class="absolute top-0 right-0 p-4 opacity-5">
                                <Icon icon="ph:receipt-bold" class="text-9xl text-navy" />
                            </div>
                            <div
                                class="size-16 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden shrink-0">
                                <img v-if="selectedUnpaidSub?.avatar_url" :src="selectedUnpaidSub.avatar_url"
                                    class="size-full object-cover">
                                <div v-else class="size-full flex items-center justify-center text-navy/10 text-3xl">
                                    <Icon icon="ph:user-bold" />
                                </div>
                            </div>
                            <div class="relative z-10">
                                <p class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                                    Pencatatan Untuk</p>
                                <h2 class="text-2xl font-black text-navy leading-none">{{ selectedUnpaidSub?.archer_name
                                }}</h2>
                                <p class="text-sm font-bold text-gray-400 mt-2 flex items-center gap-2">
                                    <Icon icon="ph:package-bold" class="text-primary" />
                                    {{ selectedUnpaidSub?.package_name }}
                                </p>
                            </div>
                        </div>

                        <!-- Form Input Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="space-y-2">
                                <label
                                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nominal
                                    Yang
                                    Dibayar</label>
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-navy/20 font-black group-focus-within:text-primary transition-colors">
                                        Rp</div>
                                    <input v-model.number="payForm.amount" type="number"
                                        class="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:outline-none focus:border-primary text-lg font-black text-navy transition-all" />
                                </div>
                                <p class="text-[10px] text-gray-400 italic font-medium mt-1">Sesuai tagihan: {{
                                    formatCurrency(selectedUnpaidSub?.amount || 0) }}</p>
                            </div>

                            <div class="space-y-2">
                                <label
                                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Tanggal
                                    Pembayaran</label>
                                <div class="relative group">
                                    <div
                                        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-navy/20 group-focus-within:text-primary transition-colors">
                                        <Icon icon="ph:calendar-bold" class="text-xl" />
                                    </div>
                                    <input v-model="payForm.paid_at" type="date"
                                        class="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:outline-none focus:border-primary text-sm font-black text-navy transition-all" />
                                </div>
                            </div>
                        </div>

                        <!-- Payment Method Selection -->
                        <div class="space-y-4">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Metode
                                Pembayaran</label>
                            <div class="grid grid-cols-3 gap-4">
                                <button v-for="m in paymentMethods" :key="m.value"
                                    @click="payForm.payment_method = m.value"
                                    class="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all relative overflow-hidden group"
                                    :class="payForm.payment_method === m.value ? 'border-primary bg-gray-50 shadow-md' : 'border-gray-50 hover:border-gray-100 bg-white'">
                                    <Icon :icon="m.icon" class="text-2xl"
                                        :class="payForm.payment_method === m.value ? 'text-primary' : 'text-gray-300 group-hover:text-navy/20'" />
                                    <span class="text-[10px] font-black uppercase tracking-widest"
                                        :class="payForm.payment_method === m.value ? 'text-primary' : 'text-gray-400'">{{
                                            m.label
                                        }}</span>

                                    <div v-if="payForm.payment_method === m.value" class="absolute top-1.5 right-1.5">
                                        <Icon icon="ph:check-circle-fill" class="text-primary text-base" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        <!-- Notes -->
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Catatan
                                Tambahan</label>
                            <textarea v-model="payForm.payment_note" rows="4"
                                class="w-full p-5 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:outline-none focus:border-primary text-sm font-medium text-navy transition-all resize-none"
                                placeholder="Tuliskan catatan seperti: 'Diterima oleh bendahara', 'Transfer via Mandiri', dsb..."></textarea>
                        </div>

                        <!-- Proof Upload (Transfer Only) -->
                        <div v-if="payForm.payment_method === 'transfer'" class="space-y-4">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Bukti
                                Transfer</label>

                            <div v-if="payForm.proof_url"
                                class="relative group rounded-3xl overflow-hidden border-2 border-gray-100 bg-gray-50 aspect-video shadow-lg">
                                <img :src="payForm.proof_url" class="size-full object-cover">
                                <div
                                    class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                                    <div class="flex gap-2">
                                        <button @click="payForm.proof_url = ''"
                                            class="size-12 rounded-2xl bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                                            <Icon icon="ph:trash-bold" class="text-xl" />
                                        </button>
                                        <button @click="showMediaLibrary = true"
                                            class="size-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                                            <Icon icon="ph:pencil-simple-bold" class="text-xl" />
                                        </button>
                                    </div>
                                    <p class="text-[10px] font-black text-white uppercase tracking-widest">Ubah Lampiran
                                    </p>
                                </div>
                            </div>

                            <button v-else @click="showMediaLibrary = true"
                                class="w-full py-16 rounded-[2rem] border-2 border-dashed border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all text-gray-400 hover:text-primary group">
                                <div
                                    class="size-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
                                    <Icon icon="ph:cloud-arrow-up-bold" />
                                </div>
                                <div class="text-center">
                                    <p class="font-black text-xs uppercase tracking-widest">Klik Untuk Upload</p>
                                    <p class="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-tighter">
                                        Mendukung Format
                                        JPG, PNG (Maks 2MB)</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Footer Saver (Sticky-like feel inside card) -->
                    <div class="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Icon icon="ph:shield-check-bold" class="text-green-500" />
                            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data akan
                                disimpan secara
                                permanen</span>
                        </div>
                        <BaseButton variant="primary" :loading="isSaving" @click="savePayment"
                            :disabled="!payForm.subscription_id || !payForm.amount">
                            Simpan Rekaman Pembayaran
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- ──────── COMPONENTS ──────── -->
        <Teleport to="body">
            <ClientOnly>
                <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
            </ClientOnly>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { formatCurrency } from '~/utils/formatter'
import { useToast } from '~/composables/useToast'
import MediaLibrary from '~/components/common/MediaLibrary.vue'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Catat Pembayaran - ArcheryHub'
})

const { get, post } = useApi()
const toast = useToast()
const router = useRouter()

const loadingUnpaid = ref(true)
const isSaving = ref(false)
const unpaidSubs = ref([])
const showMediaLibrary = ref(false)

const paymentMethods = [
    { label: 'Tunai / Cash', value: 'cash', icon: 'ph:money-bold' },
    { label: 'WhatsApp / Transfer', value: 'transfer', icon: 'ph:bank-bold' },
    { label: 'Lainnya', value: 'other', icon: 'ph:dots-three-circle-bold' }
]

const payForm = ref({
    subscription_id: '',
    amount: 0,
    payment_method: 'cash',
    payment_note: '',
    proof_url: '',
    paid_at: new Date().toISOString().split('T')[0]
})

const selectedUnpaidSub = computed(() => {
    return unpaidSubs.value.find(s => s.uuid === payForm.value.subscription_id)
})

watch(() => payForm.value.subscription_id, (id) => {
    if (id) {
        const sub = unpaidSubs.value.find(s => s.uuid === id)
        if (sub) {
            payForm.value.amount = sub.amount
        }
    }
})

const fetchUnpaid = async () => {
    loadingUnpaid.value = true
    try {
        const res = await get('/clubs/membership/subscribers/unpaid')
        unpaidSubs.value = res.data || []
    } catch (err) {
        console.error('Failed to fetch unpaid:', err)
        toast.error('Gagal mengambil daftar tagihan')
    } finally {
        loadingUnpaid.value = false
    }
}

const handleMediaSelect = (media) => {
    payForm.value.proof_url = media.url
}

const savePayment = async () => {
    if (!payForm.value.subscription_id || !payForm.value.amount) return
    isSaving.value = true
    try {
        await post(`/clubs/membership/subscriptions/${payForm.value.subscription_id}/pay`, {
            amount: payForm.value.amount,
            payment_method: payForm.value.payment_method,
            payment_note: payForm.value.payment_note,
            proof_url: payForm.value.proof_url,
            paid_at: payForm.value.paid_at
        })
        toast.success('Pembayaran berhasil dicatat')
        router.push('/dashboard/payments-membership')
    } catch (err) {
        console.error('Failed to save payment:', err)
        toast.error('Gagal menyimpan pembayaran')
    } finally {
        isSaving.value = false
    }
}

onMounted(() => {
    fetchUnpaid()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #f1f5f9;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #e2e8f0;
}
</style>
