<template>
    <div class="min-h-screen bg-background-light text-navy">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24 flex items-center">
            <div class="absolute inset-0 z-0">
                <img src="/hero-event-detail.jpeg" alt="Subscription Hero"
                    class="w-full h-full object-cover object-center opacity-40" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-sm font-bold tracking-widest mb-6">
                        <Icon icon="ph:credit-card-bold" class="text-base sm:text-lg" />
                        <span>PAKET BERLANGGANAN</span>
                    </div>
                    <h1
                        class="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        Skalakan Manajemen Panahan Anda
                    </h1>
                    <p class="text-white/90 text-sm md:text-lg leading-relaxed max-w-2xl">
                        Opsi fleksibel untuk penyelenggara turnamen skala kecil sampai skala internasional.
                        <span class="text-primary font-bold">Dapatkan 3 bulan gratis</span> paket Standard untuk
                        pendaftaran organisasi baru.
                    </p>
                </div>
            </div>
        </section>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <!-- ─── EO Packages ─── -->
            <div class="space-y-16">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
                    <!-- Standar EO -->
                    <div
                        class="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col shadow-sm transition-all duration-500 hover:-translate-y-2 group">
                        <div class="mb-10">
                            <div
                                class="size-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-400 group-hover:bg-navy group-hover:text-white transition-colors duration-500">
                                <Icon icon="ph:lightning-bold" class="text-2xl" />
                            </div>
                            <h3 class="text-2xl font-black text-navy mb-2">Standar EO</h3>
                            <p class="text-gray-500 text-sm font-medium">Solusi digital lengkap untuk turnamen skala
                                kecil &amp;
                                menengah.</p>
                        </div>
                        <div class="mb-10">
                            <div class="flex items-baseline gap-1">
                                <span class="text-xl font-bold text-navy opacity-40">Rp</span>
                                <span class="text-5xl font-black text-navy tracking-tighter">29.999</span>
                                <span class="text-gray-400 font-bold tracking-wider text-xs">/BLN</span>
                            </div>
                        </div>
                        <ul class="space-y-4 mb-12 flex-1">
                            <li v-for="feat in eoBasicFeatures" :key="feat"
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

                    <!-- Elite EO -->
                    <div
                        class="bg-navy rounded-3xl p-8 flex flex-col shadow-sm relative overflow-hidden ring-4 ring-primary/20 transition-all duration-500 hover:-translate-y-2">
                        <div
                            class="absolute top-0 right-0 bg-primary text-navy px-6 py-2 text-[11px] font-black tracking-[0.2em] rounded-bl-2xl shadow-lg">
                            PROFESIONAL
                        </div>
                        <div class="mb-10 pt-4">
                            <div
                                class="size-14 bg-primary rounded-2xl flex items-center justify-center mb-6 text-navy shadow-lg shadow-primary/20">
                                <Icon icon="ph:crown-simple-fill" class="text-3xl" />
                            </div>
                            <h3 class="text-3xl font-black text-white mb-2">Elite EO</h3>
                            <p class="text-slate-400 text-sm font-medium">Fitur kustom dan prioritas untuk penyelenggara
                                turnamen
                                profesional.</p>
                        </div>
                        <div class="mb-10">
                            <div class="flex items-baseline gap-1">
                                <span class="text-xl font-bold text-white opacity-40">Rp</span>
                                <span class="text-5xl font-black text-white tracking-tighter">49.999</span>
                                <span class="text-slate-400 font-bold tracking-wider text-xs">/BLN</span>
                            </div>
                        </div>
                        <ul class="space-y-5 mb-14 flex-1">
                            <li v-for="feat in eoEliteFeatures" :key="feat"
                                class="flex items-start gap-4 text-sm font-medium text-white">
                                <Icon icon="ph:check-circle-fill" class="text-primary text-xl shrink-0" />
                                <span>{{ feat }}</span>
                            </li>
                        </ul>
                        <button
                            class="w-full py-4 px-6 rounded-2xl bg-primary text-navy font-black hover:scale-[1.03] active:scale-95 transition-all shadow-primary/20">
                            Aktifkan Elite EO
                        </button>
                    </div>
                </div>

                <!-- EO Comparison Table -->
                <div class="max-w-5xl mx-auto">
                    <h3 class="text-center text-[11px] font-black text-gray-400 tracking-widest mb-8">
                        Perbandingan Detail
                    </h3>
                    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div
                            class="grid grid-cols-3 bg-gray-50 px-6 py-4 text-xs font-black tracking-widest text-gray-400">
                            <div>Fitur</div>
                            <div class="text-center">Standar</div>
                            <div class="text-center">Elite</div>
                        </div>
                        <div v-for="(row, i) in eoComparisonData" :key="row.feature"
                            :class="['grid grid-cols-3 px-6 py-4 items-center', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50']">
                            <div class="flex items-center gap-3 text-sm font-bold text-navy">
                                <Icon :icon="row.icon" class="text-gray-400 text-base shrink-0" />
                                {{ row.feature }}
                            </div>
                            <div class="text-center">
                                <template v-if="typeof row.basic === 'boolean'">
                                    <Icon :icon="row.basic ? 'ph:check-circle-fill' : 'ph:x-circle-fill'"
                                        :class="row.basic ? 'text-green-500' : 'text-gray-300'"
                                        class="text-xl mx-auto" />
                                </template>
                                <span v-else class="text-sm font-bold text-navy">{{ row.basic }}</span>
                            </div>
                            <div class="text-center">
                                <template v-if="typeof row.elite === 'boolean'">
                                    <Icon :icon="row.elite ? 'ph:check-circle-fill' : 'ph:x-circle-fill'"
                                        :class="row.elite ? 'text-green-500' : 'text-gray-300'"
                                        class="text-xl mx-auto" />
                                </template>
                                <span v-else class="text-sm font-bold text-navy">{{ row.elite }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Subscription Promotion -->
            <section class="max-w-4xl mx-auto px-4 mb-24 mt-16">
                <SubscriptionPromo promo-badge="Promo Terbatas" promo-title="Mulai Turnamen Anda Gratis 3 Bulan!"
                    promo-desc="Daftarkan organisasi Anda sekarang dan nikmati akses penuh paket Standard tanpa biaya selama tiga bulan pertama."
                    savings="104.997" />
            </section>

            <!-- FAQ Section -->
            <div class="mt-24 md:mt-40 max-w-4xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h2 class="text-sm font-black text-primary tracking-[0.3em] mb-4">FAQ</h2>
                    <h4 class="font-black text-navy text-2xl sm:text-3xl md:text-5xl tracking-tight">Punya Pertanyaan?
                    </h4>
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
import { ref } from 'vue'
const activeFaq = ref(0)
const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index
}
import SubscriptionPromo from '~/components/dashboard/subscription/SubscriptionPromo.vue'

definePageMeta({
    layout: 'landing'
})



// ─── EO feature lists ─────────────────────────────────────────
const eoBasicFeatures = [
    'Maksimal 40 Peserta / Event',
    'Penyimpanan Media 1 GB',
    'Profil Organisasi Lengkap & Kustom',
    'Buat & Promosi Event',
    'Publikasi Berita',
    'Scoring Real-time',
    'E-Certificate Otomatis',
]

const eoEliteFeatures = [
    'Semua fitur Standar EO',
    'Peserta Tak Terbatas',
    'Penyimpanan Media 3 GB',
    'Dashboard Analitik Lanjutan',
    'Dukungan Prioritas',
    'Akses Awal Fitur Baru',
]



const eoComparisonData = [
    { feature: 'Maksimum Peserta', basic: '40 / Event', elite: 'Tak Terbatas', icon: 'ph:users-three-bold' },
    { feature: 'Penyimpanan Media', basic: '1 GB', elite: '3 GB', icon: 'ph:hard-drives-bold' },
    { feature: 'Buat Berita (News)', basic: true, elite: true, icon: 'ph:newspaper-bold' },
    { feature: 'Profil Organisasi', basic: 'Lengkap & Kustom', elite: 'Lengkap & Kustom', icon: 'ph:buildings-bold' },
    { feature: 'Promosi Event', basic: true, elite: true, icon: 'ph:megaphone-bold' },
    { feature: 'Analitik Lanjutan', basic: true, elite: true, icon: 'ph:chart-bar-bold' },
    { feature: 'Dukungan Prioritas', basic: true, elite: true, icon: 'ph:headset-bold' },
]

const faqs = [
    {
        question: 'Apakah paket bisa upgrade atau downgrade kapan saja?',
        answer: 'Tentu saja! Fleksibilitas adalah kunci. Anda bisa mengubah paket kapan pun. Upgrade akan dihitung prorata dari sisa hari bulan berjalan, sedangkan downgrade akan efektif di siklus tagihan berikutnya.'
    },
    {
        question: 'Apa yang terjadi setelah masa uji coba selesai?',
        answer: 'Data Anda tetap aman di server kami. Anda akan diminta memilih paket berbayar untuk tetap menggunakan fitur premium. Jika tidak memilih dalam 7 hari, akun akan otomatis kembali ke paket Gratis.'
    },
    {
        question: 'Bagaimana cara kerja skema bayar Paket EO?',
        answer: 'Paket EO menggunakan sistem langganan bulanan yang flat. Tidak ada lagi biaya per atlet, sehingga Anda bisa mengelola budget turnamen dengan lebih pasti dan efisien.'
    },
    {
        question: 'Berapa lama waktu implementasi untuk paket Elite?',
        answer: 'Untuk paket Elite, kami biasanya menyiapkan semua konfigurasi dalam waktu 3-5 hari kerja. Anda juga akan mendapatkan sesi training khusus untuk seluruh staf admin organisasi.'
    }
]

useSeoMeta({
    title: 'Paket Berlangganan - Archeris.net',
    description: 'Temukan solusi terbaik untuk penyelenggara turnamen (EO) panahan Anda. Paket fleksibel untuk segala jenis skala organisasi.'
})
</script>

<style scoped>
.cubic-bezier {
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
