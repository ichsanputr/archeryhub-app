<template>
    <div class="min-h-screen bg-background-light text-navy">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden h-[360px] md:h-[420px] flex items-center">
            <div class="absolute inset-0 z-0">
                <img src="/hero-event-detail.jpeg" alt="Subscription Hero"
                    class="w-full h-full object-cover object-center" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 md:mt-16">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-xs sm:text-sm font-bold tracking-widest mb-6">
                        <Icon icon="ph:credit-card-bold" class="text-base sm:text-lg" />
                        Paket Berlangganan
                    </div>
                    <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
                        Skalakan manajemen panahan Anda
                    </h1>
                    <p class="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
                        Pilih paket yang sesuai untuk klub atau event Anda. Opsi fleksibel untuk klub akar rumput
                        sampai penyelenggara turnamen skala nasional.
                    </p>
                </div>
            </div>
        </section>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

            <div class="flex justify-center mb-12 md:mb-16">
                <div class="bg-slate-200/50 p-1.5 rounded-xl flex items-center relative">
                    <button class="px-5 sm:px-8 py-3 rounded-lg text-xs sm:text-sm font-bold bg-white text-navy shadow-sm">
                        Paket Klub
                    </button>
                    <button class="px-5 sm:px-8 py-3 rounded-lg text-xs sm:text-sm font-bold text-gray-500 hover:text-navy">
                        Paket Penyelenggara
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div class="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col shadow-sm">
                    <div class="mb-8">
                        <h3 class="text-xl font-bold text-navy mb-2">Rookie</h3>
                        <p class="text-gray-500 text-sm">Cocok untuk klub kecil yang baru memulai transformasi digital.
                        </p>
                    </div>
                    <div class="mb-8">
                        <div class="flex items-baseline gap-1">
                            <span class="text-4xl font-extrabold text-navy">Rp 0</span>
                            <span class="text-gray-500 font-medium">/bulan</span>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">Uji coba gratis 14 hari (fitur penuh)</p>
                    </div>
                    <ul class="space-y-4 mb-10 flex-1">
                        <li class="flex items-start gap-3 text-sm">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 mt-0.5" />
                            <span>Maksimal 15 anggota</span>
                        </li>
                        <li class="flex items-start gap-3 text-sm">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 mt-0.5" />
                            <span>Dashboard statistik dasar</span>
                        </li>
                        <li class="flex items-start gap-3 text-sm">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 mt-0.5" />
                            <span>Kartu skor digital</span>
                        </li>
                        <li class="flex items-start gap-3 text-sm text-gray-400">
                            <Icon icon="ph:x-circle" class="mt-0.5" />
                            <span>Branding kustom</span>
                        </li>
                    </ul>
                    <button
                        class="w-full py-3 px-4 rounded-xl border-2 border-navy text-navy font-bold hover:bg-slate-50 transition-colors">
                        Mulai Uji Coba
                    </button>
                </div>

                <div
                    class="bg-navy rounded-2xl p-6 md:p-8 flex flex-col shadow-xl relative overflow-hidden transform md:-translate-y-4">
                    <div
                        class="absolute top-0 right-0 bg-primary text-navy px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                        Paling Populer
                    </div>
                    <div class="mb-8">
                        <h3 class="text-xl font-bold text-white mb-2">Pro Club</h3>
                        <p class="text-slate-300 text-sm">Toolset lengkap untuk klub yang sedang bertumbuh dan kompetitif.
                        </p>
                    </div>
                    <div class="mb-8">
                        <div class="flex items-baseline gap-1">
                            <span class="text-4xl font-extrabold text-white">Rp 799rb</span>
                            <span class="text-slate-300 font-medium">/bulan</span>
                        </div>
                    </div>
                    <ul class="space-y-4 mb-10 flex-1">
                        <li class="flex items-start gap-3 text-sm text-white">
                            <Icon icon="ph:check-circle-fill" class="text-primary mt-0.5" />
                            <span>Anggota tanpa batas</span>
                        </li>
                        <li class="flex items-start gap-3 text-sm text-white">
                            <Icon icon="ph:check-circle-fill" class="text-primary mt-0.5" />
                            <span>Analitik performa lanjutan</span>
                        </li>
                        <li class="flex items-start gap-3 text-sm text-white">
                            <Icon icon="ph:check-circle-fill" class="text-primary mt-0.5" />
                            <span>Branding klub & logo kustom</span>
                        </li>
                        <li class="flex items-start gap-3 text-sm text-white">
                            <Icon icon="ph:check-circle-fill" class="text-primary mt-0.5" />
                            <span>Ekspor CSV dan PDF</span>
                        </li>
                    </ul>
                    <button class="w-full py-3 px-4 rounded-xl bg-primary text-navy font-black hover:bg-primary/90">
                        Pilih Pro
                    </button>
                </div>

                <div class="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col shadow-sm">
                    <div class="mb-8">
                        <h3 class="text-xl font-bold text-navy mb-2">Elite Club</h3>
                        <p class="text-gray-500 text-sm">Solusi premium untuk pusat pelatihan performa tinggi dan akademi.
                        </p>
                    </div>
                    <div class="mb-8">
                        <div class="flex items-baseline gap-1">
                            <span class="text-4xl font-extrabold text-navy">Rp 2,1jt</span>
                            <span class="text-gray-500 font-medium">/bulan</span>
                        </div>
                    </div>
                    <ul class="space-y-4 mb-10 flex-1">
                        <li class="flex items-start gap-3 text-sm">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 mt-0.5" />
                            <span class="font-semibold">Semua fitur Pro</span>
                        </li>
                        <li class="flex items-start gap-3 text-sm">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 mt-0.5" />
                            <span>Dukungan prioritas 24/7</span>
                        </li>
                        <li class="flex items-start gap-3 text-sm">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 mt-0.5" />
                            <span>Akses API penuh untuk website</span>
                        </li>
                        <li class="flex items-start gap-3 text-sm">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 mt-0.5" />
                            <span>Portal scoring white-label</span>
                        </li>
                    </ul>
                    <button
                        class="w-full py-3 px-4 rounded-xl border-2 border-navy text-navy font-bold hover:bg-slate-50 transition-colors">
                        Pilih Elite
                    </button>
                </div>
            </div>

            <div class="mt-16 md:mt-24 mb-12 flex items-center gap-4">
                <div class="h-px bg-gray-200 flex-1"></div>
                <span class="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-[0.25em] sm:tracking-[0.3em] text-center">
                    Untuk Penyelenggara Event
                </span>
                <div class="h-px bg-gray-200 flex-1"></div>
            </div>

            <div class="bg-white border-2 border-primary/30 rounded-3xl overflow-hidden shadow-sm">
                <div class="flex flex-col lg:flex-row">
                    <div class="flex-1 p-8 md:p-14">
                        <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-navy rounded-full mb-6">
                            <Icon icon="ph:lightning-fill" class="text-sm" />
                            <span class="text-[10px] font-bold uppercase tracking-wider">Paket Spesial Organizer</span>
                        </div>
                        <h3 class="text-3xl font-extrabold text-navy mb-4">Skema Bayar Sesuai Pemakaian</h3>
                        <p class="text-gray-500 mb-8 text-lg">
                            Buat turnamen sekali pakai tanpa biaya bulanan. Bayar hanya berdasarkan jumlah atlet yang benar-benar
                            bertanding.
                        </p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <div class="text-3xl font-black text-navy flex items-baseline gap-1">
                                    <span class="text-lg font-bold">Rp</span>
                                    15.000
                                    <span class="text-sm font-medium text-gray-500">/ Atlet</span>
                                </div>
                                <p class="text-xs text-gray-500 mt-2">Tagihan transparan per atlet, tanpa biaya tersembunyi.</p>
                            </div>
                            <div class="space-y-3">
                                <div class="flex items-center gap-2 text-sm font-medium">
                                    <Icon icon="ph:check-circle-fill" class="text-primary text-lg" />
                                    Kapasitas atlet fleksibel
                                </div>
                                <div class="flex items-center gap-2 text-sm font-medium">
                                    <Icon icon="ph:check-circle-fill" class="text-primary text-lg" />
                                    Dashboard scoring langsung
                                </div>
                                <div class="flex items-center gap-2 text-sm font-medium">
                                    <Icon icon="ph:check-circle-fill" class="text-primary text-lg" />
                                    Publikasi hasil instan
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="lg:w-[380px] bg-slate-50 p-6 md:p-10 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col justify-center">
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">
                                Estimasi Atlet
                            </label>
                            <input class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy mb-4"
                                max="1000" min="10" type="range" value="150" />
                            <div class="flex justify-between items-center bg-background-light p-4 rounded-xl">
                                <div>
                                    <span class="block text-xs font-bold text-gray-500">Estimasi Total</span>
                                    <span class="text-2xl font-black text-navy">Rp 2.250.000</span>
                                </div>
                                <span class="text-sm font-bold text-navy px-3 py-1 bg-white border border-gray-200 rounded-lg">
                                    150 Atlet
                                </span>
                            </div>
                        </div>
                        <button
                            class="w-full py-4 px-6 rounded-xl bg-navy text-white font-black hover:bg-navy-light transition-all flex items-center justify-center gap-3">
                            Buat Event Anda
                            <Icon icon="ph:arrow-right-bold" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-20 md:mt-24 max-w-4xl mx-auto">
                <h4 class="text-center font-bold text-navy text-2xl mb-10 md:mb-12">Pertanyaan yang Sering Diajukan</h4>
                <div class="space-y-4">
                    <div v-for="(faq, index) in faqs" :key="index"
                        class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-sm transition-all">
                        <button @click="toggleFaq(index)"
                            class="w-full px-5 sm:px-6 py-5 flex items-center justify-between text-left group">
                            <span class="font-bold text-navy pr-4 group-hover:text-primary transition-colors">{{ faq.question }}</span>
                            <Icon icon="ph:caret-down-bold"
                                :class="['text-gray-400 transition-transform duration-300 flex-shrink-0', activeFaq === index ? 'rotate-180' : '']" />
                        </button>
                        <div v-show="activeFaq === index" class="px-5 sm:px-6 pb-6 text-gray-500 text-sm leading-relaxed">
                            {{ faq.answer }}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

definePageMeta({
    layout: 'landing'
})

const activeFaq = ref(0)
const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index
}

const faqs = [
    {
        question: 'Apakah paket bisa upgrade atau downgrade kapan saja?',
        answer: 'Ya, Anda bisa mengubah paket kapan saja. Upgrade akan dihitung prorata, sedangkan downgrade berlaku pada siklus tagihan berikutnya.'
    },
    {
        question: 'Apa yang terjadi setelah masa uji coba selesai?',
        answer: 'Data Anda tetap aman. Anda akan diminta memilih paket berbayar untuk lanjut menggunakan fitur penuh, atau tetap di paket Rookie dengan batas fitur.'
    },
    {
        question: 'Apakah ada harga khusus untuk organisasi non-profit?',
        answer: 'Kami menyediakan harga khusus untuk federasi olahraga resmi dan organisasi pembinaan panahan. Hubungi tim kami untuk detailnya.'
    },
    {
        question: 'Bagaimana cara kerja skema bayar sesuai pemakaian?',
        answer: 'Anda membayar biaya awal setup, lalu biaya per atlet aktif saat pendaftaran event ditutup. Tidak ada komitmen jangka panjang.'
    }
]

useSeoMeta({
    title: 'Subscription - Archeryhub.id',
    description: 'Pilih paket berlangganan Archeryhub.id untuk klub dan penyelenggara event panahan.'
})
</script>
