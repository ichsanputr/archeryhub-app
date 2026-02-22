<template>
    <div class="min-h-screen bg-background-light text-navy">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden h-[400px] md:h-[480px] flex items-center">
            <div class="absolute inset-0 z-0">
                <img src="/hero-event-detail.jpeg" alt="Subscription Hero"
                    class="w-full h-full object-cover object-center opacity-40" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div class="max-w-3xl" v-motion-fade-visible-once>
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-xs sm:text-sm font-bold tracking-widest mb-6 border border-white/10">
                        <Icon icon="ph:credit-card-bold" class="text-base sm:text-lg" />
                        PAKET BERLANGGANAN
                    </div>
                    <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                        Skalakan Manajemen Panahan Anda
                    </h1>
                    <p class="text-white/80 text-base md:text-xl leading-relaxed max-w-2xl font-medium">
                        Opsi fleksibel untuk klub akar rumput sampai penyelenggara turnamen skala internasional. Pilih
                        yang sesuai dengan ambisi Anda.
                    </p>
                </div>
            </div>
        </section>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <!-- Tab Switcher -->
            <div class="flex justify-center mb-16 md:mb-24">
                <div
                    class="bg-gray-100 p-1.5 rounded-2xl flex items-center relative w-full max-w-xs sm:max-w-sm shadow-inner group transition-all hover:bg-gray-200/70">
                    <!-- Sliding background indicator -->
                    <div class="absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
                        :style="{ transform: activeTab === 'club' ? 'translateX(0)' : 'translateX(100%)' }">
                    </div>

                    <button @click="activeTab = 'club'"
                        :class="['flex-1 py-3.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest transition-all relative z-10', activeTab === 'club' ? 'text-navy' : 'text-gray-400 hover:text-navy/70']">
                        Paket Klub
                    </button>
                    <button @click="activeTab = 'eo'"
                        :class="['flex-1 py-3.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest transition-all relative z-10', activeTab === 'eo' ? 'text-navy' : 'text-gray-400 hover:text-navy/70']">
                        Paket EO
                    </button>
                </div>
            </div>

            <!-- Club Packages -->
            <div v-show="activeTab === 'club'" class="space-y-12">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
                    <!-- Basic Support -->
                    <div class="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col shadow-sm transition-all duration-500 hover:-translate-y-2 group"
                        v-motion-fade-visible-once>
                        <div class="mb-10">
                            <div
                                class="size-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-400 group-hover:bg-navy group-hover:text-white transition-colors duration-500">
                                <Icon icon="ph:shield-check-bold" class="text-2xl" />
                            </div>
                            <h3 class="text-2xl font-black text-navy mb-2">Basic Support</h3>
                            <p class="text-gray-500 text-sm font-medium">Langkah awal mendukung ekosistem panahan
                                digital.</p>
                        </div>
                        <div class="mb-10">
                            <div class="flex items-baseline gap-1">
                                <span class="text-xl font-bold text-navy opacity-40">Rp</span>
                                <span class="text-5xl font-black text-navy tracking-tighter">34.900</span>
                                <span class="text-gray-400 font-bold tracking-wider uppercase text-xs">/BLN</span>
                            </div>
                        </div>
                        <ul class="space-y-4 mb-12 flex-1">
                            <li v-for="feat in basicFeatures" :key="feat"
                                class="flex items-start gap-3 text-sm font-medium text-navy">
                                <Icon icon="ph:check-circle-fill" class="mt-0.5 text-lg shrink-0 text-green-500" />
                                <span>{{ feat }}</span>
                            </li>
                        </ul>
                        <button
                            class="w-full py-4 px-6 rounded-2xl border-2 border-navy text-navy font-black hover:bg-navy hover:text-white transition-all duration-300">
                            Pilih Paket
                        </button>
                    </div>

                    <!-- Elite Member -->
                    <div class="bg-navy rounded-3xl p-8 flex flex-col shadow-sm relative overflow-hidden ring-4 ring-primary/20 transition-all duration-500 hover:-translate-y-2"
                        v-motion-fade-visible-once>
                        <div
                            class="absolute top-0 right-0 bg-primary text-navy px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em] rounded-bl-2xl shadow-lg">
                            REKOMENDASI
                        </div>
                        <div class="mb-10 pt-4">
                            <div
                                class="size-14 bg-primary rounded-2xl flex items-center justify-center mb-6 text-navy shadow-lg shadow-primary/20">
                                <Icon icon="ph:crown-simple-fill" class="text-3xl" />
                            </div>
                            <h3 class="text-3xl font-black text-white mb-2">Elite Member</h3>
                            <p class="text-slate-400 text-sm font-medium">Akses penuh dan keuntungan eksklusif untuk
                                pendukung utama.</p>
                        </div>
                        <div class="mb-10">
                            <div class="flex items-baseline gap-1">
                                <span class="text-xl font-bold text-white opacity-40">Rp</span>
                                <span class="text-5xl font-black text-white tracking-tighter">75.000</span>
                                <span class="text-slate-400 font-bold tracking-wider uppercase text-xs">/BLN</span>
                            </div>
                        </div>
                        <ul class="space-y-5 mb-14 flex-1">
                            <li v-for="feat in eliteFeatures" :key="feat"
                                class="flex items-start gap-4 text-sm font-medium text-white">
                                <Icon icon="ph:check-circle-fill" class="text-primary text-xl shrink-0" />
                                <span>{{ feat }}</span>
                            </li>
                        </ul>
                        <button
                            class="w-full py-4 px-6 rounded-2xl bg-primary text-navy font-black hover:scale-[1.03] active:scale-95 transition-all shadow-primary/20">
                            Aktifkan Elite
                        </button>
                    </div>
                </div>
            </div>

            <!-- EO Package -->
            <div v-show="activeTab === 'eo'" class="space-y-12" v-motion-fade-visible-once>
                <div class="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <div class="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                        <div class="flex-1 p-8 md:p-16">
                            <div
                                class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-navy rounded-full mb-8 border border-primary/20">
                                <Icon icon="ph:lightning-fill" class="text-sm" />
                                <span class="text-[10px] font-black uppercase tracking-widest">PAY-AS-YOU-GO
                                    MODEL</span>
                            </div>
                            <h3 class="text-4xl md:text-5xl font-black text-navy mb-6 tracking-tight">Efisien &
                                Transparan</h3>
                            <p class="text-gray-500 mb-12 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
                                Buat turnamen sekali pakai tanpa biaya bulanan. Bayar hanya berdasarkan jumlah atlet
                                yang benar-benar bertanding.
                            </p>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div class="bg-navy rounded-3xl p-8 text-white ">
                                    <p class="text-primary text-[10px] font-black uppercase tracking-widest mb-4">HARGA
                                        FLAT</p>
                                    <div class="text-5xl font-black flex items-baseline gap-2 mb-4 tracking-tighter">
                                        <span class="text-xl font-bold opacity-50">Rp</span>
                                        2<span class="text-2xl">.000</span>
                                    </div>
                                    <p class="text-sm text-slate-400 font-medium font-mono uppercase tracking-wider">PER
                                        ATLET TERDAFTAR</p>
                                </div>
                                <div class="space-y-6">
                                    <h4 class="text-xs font-black text-navy uppercase tracking-[0.2em] mb-4">Fitur EO
                                        Termasuk:</h4>
                                    <div v-for="feat in eoFeatures" :key="feat"
                                        class="flex items-center gap-4 text-sm font-bold text-navy">
                                        <div
                                            class="size-6 bg-green-50 rounded-full flex items-center justify-center text-green-500 shrink-0">
                                            <Icon icon="ph:check-bold" />
                                        </div>
                                        {{ feat }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- EO Calculator -->
                        <div class="lg:w-[440px] bg-slate-50 p-8 md:p-16 flex flex-col justify-center">
                            <div class="bg-white p-8 rounded-[2rem]  border border-gray-100 mb-10 relative">
                                <div
                                    class="absolute -top-3 left-8 bg-navy text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                    Simulasi Biaya
                                </div>
                                <label
                                    class="block text-[10px] font-black text-gray-400 uppercase mb-8 tracking-[0.2em] mt-2">
                                    JUMLAH ESTIMASI ATLET
                                </label>

                                <div class="relative mb-12">
                                    <input v-model="estimatedArchers"
                                        class="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary-hover transition-all"
                                        max="2000" min="50" step="10" type="range" />
                                    <!-- Dynamic bubble (simplified) -->
                                    <div
                                        class="mt-4 flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                        <span>50</span>
                                        <span class="text-navy bg-primary/10 px-3 py-1 rounded-lg">{{ estimatedArchers
                                            }} Atlet</span>
                                        <span>2000</span>
                                    </div>
                                </div>

                                <div class="space-y-4 pt-4 border-t border-gray-50">
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs font-medium text-gray-500">Total Investasi</span>
                                        <span class="text-3xl font-black text-navy tracking-tighter">{{
                                            formatCurrency(estimatedTotal) }}</span>
                                    </div>
                                </div>
                            </div>

                            <NuxtLink to="/dashboard/events/create"
                                class="w-full py-5 px-8 rounded-2xl bg-navy text-white font-black hover:bg-navy-light transition-all flex items-center justify-center gap-4 shadow-sm shadow-navy/20 group">
                                BUAT EVENT SEKARANG
                                <Icon icon="ph:arrow-right-bold"
                                    class="text-lg group-hover:translate-x-2 transition-transform" />
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ Section -->
            <div class="mt-24 md:mt-40 max-w-4xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">FAQ</h2>
                    <h4 class="font-black text-navy text-3xl md:text-5xl tracking-tight">Punya Pertanyaan?</h4>
                </div>

                <div class="space-y-4">
                    <div v-for="(faq, index) in faqs" :key="index"
                        class="bg-white rounded-3xl border border-gray-200/60 overflow-hidden hover:border-primary/30 transition-all duration-300">
                        <button @click="toggleFaq(index)"
                            class="w-full px-6 sm:px-10 py-6 md:py-8 flex items-center justify-between text-left group">
                            <span
                                class="text-lg font-black text-navy pr-4 group-hover:text-primary transition-colors">{{
                                    faq.question }}</span>
                            <div
                                :class="['size-8 rounded-xl flex items-center justify-center transition-all duration-500', activeFaq === index ? 'bg-navy text-white rotate-180' : 'bg-gray-50 text-gray-300 group-hover:bg-gray-100']">
                                <Icon icon="ph:caret-down-bold" class="text-xl" />
                            </div>
                        </button>
                        <transition enter-active-class="transition-all duration-500 ease-out"
                            enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[300px] opacity-100"
                            leave-active-class="transition-all duration-300 ease-in"
                            leave-from-class="max-h-[300px] opacity-100" leave-to-class="max-h-0 opacity-0">
                            <div v-show="activeFaq === index"
                                class="px-6 sm:px-10 pb-10 text-gray-500 text-base leading-relaxed font-medium">
                                {{ faq.answer }}
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

definePageMeta({
    layout: 'landing'
})

const activeTab = ref('club')
const estimatedArchers = ref(150)
const eoPricePerArcher = 2000

const estimatedTotal = computed(() => {
    return estimatedArchers.value * eoPricePerArcher
})

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value)
}

const activeFaq = ref(0)
const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index
}

const basicFeatures = [
    'Akses Konten Eksklusif',
    'Badge Pendukung Profil',
    'Update Berita Prioritas',
    'E-Certificate Pendukung'
]

const eliteFeatures = [
    'Semua fitur Basic Support',
    'Diskon Khusus Event Klub',
    'Grup Komunitas Prioritas',
    'Konsultasi Coach Bulanan',
    'Akses Awal Fitur Baru'
]

const eoFeatures = [
    'Landing page pendaftaran kustom',
    'Sistem manajemen bagan eliminasi',
    'Scoring langsung (Real-time)',
    'E-Certificate otomatis',
    'Integrasi Payment Gateway otomatis'
]

const faqs = [
    {
        question: 'Apakah paket bisa upgrade atau downgrade kapan saja?',
        answer: 'Tentu saja! Fleksibilitas adalah kunci. Anda bisa mengubah paket kapan pun. Upgrade akan dihitung prorata dari sisa hari bulan berjalan, sedangkan downgrade akan efektif di siklus tagihan berikutnya.'
    },
    {
        question: 'Apa yang terjadi setelah masa uji coba selesai?',
        answer: 'Data Anda tetap aman di server kami. Anda akan diminta memilih paket berbayar untuk tetap menggunakan fitur premium. Jika tidak memilih dalam 7 hari, akun akan otomatis kembali ke paket Rookie (Gratis).'
    },
    {
        question: 'Bagaimana cara kerja skema bayar Paket EO?',
        answer: 'Sederhana: Anda tidak membayar biaya bulanan. Setiap event memiliki biaya setup minimal, lalu kami menagih biaya per atlet yang benar-benar melakukan pendaftaran. Biaya dipotong langsung dari sistem pembayaran gateway atau dititipkan via tagihan.'
    },
    {
        question: 'Berapa lama waktu implementasi untuk paket Elite?',
        answer: 'Untuk paket Elite, kami biasanya menyiapkan semua whitelabeling dan integrasi API dalam waktu 3-5 hari kerja. Anda juga akan mendapatkan sesi training khusus untuk seluruh pelatih dan staf admin klub.'
    }
]

useSeoMeta({
    title: 'Paket Berlangganan - Archeryhub.id',
    description: 'Temukan solusi terbaik untuk klub dan EO panahan Anda. Paket fleksibel untuk segala jenis skala organisasi.'
})
</script>

<style scoped>
/* Custom transitions and utility improvements */
.shadow-3xl {
    box-shadow: 0 40px 100px -20px rgba(10, 25, 47, 0.4);
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border: 4px solid var(--primary);
    cursor: pointer;
    margin-top: -6px;
    transition: all 0.2s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(255, 230, 0, 0.1);
}

/* Custom easing for transitions */
.cubic-bezier {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
