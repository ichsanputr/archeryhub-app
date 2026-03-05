<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-homepage.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>

            <div class="container mx-auto px-4 max-w-4xl relative z-10">
                <div class="max-w-3xl text-center md:text-left">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-sm font-bold tracking-widest mb-6">
                        <Icon icon="ph:question-bold" class="text-base sm:text-lg" />
                        <span>Support Center</span>
                    </div>
                    <h1
                        class="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        Pertanyaan <span class="text-primary">Sering Diajukan</span>
                    </h1>
                    <p class="text-white/90 text-sm md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                        Temukan jawaban cepat untuk pertanyaan umum mengenai pendaftaran, manajemen klub, dan sistem
                        scoring Archeryhub.id.
                    </p>
                </div>
            </div>
        </section>

        <!-- FAQ Content -->
        <section class="container mx-auto px-4 max-w-4xl py-16">
            <div class="space-y-4">
                <div v-for="(faq, index) in faqs" :key="index"
                    class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-sm transition-all">
                    <button @click="toggleFaq(index)"
                        class="w-full px-6 py-5 flex items-center justify-between text-left group">
                        <span class="font-bold text-navy group-hover:text-primary transition-colors">{{ faq.question
                        }}</span>
                        <Icon icon="ph:caret-down-bold"
                            :class="['text-gray-400 transition-transform duration-300', activeFaq === index ? 'rotate-180' : '']" />
                    </button>
                    <div v-show="activeFaq === index" class="px-6 pb-6 text-gray-500 text-sm leading-relaxed">
                        {{ faq.answer }}
                    </div>
                </div>
            </div>

            <!-- Still Need Help? -->
            <div class="mt-16 bg-white rounded-3xl p-8 md:p-12 text-center border border-gray-100 shadow-sm">
                <div
                    class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                    <Icon icon="ph:chat-circle-dots-bold" class="text-3xl" />
                </div>
                <h2 class="text-lg sm:text-2xl font-black text-navy mb-3">Masih Butuh Bantuan?</h2>
                <p class="text-gray-500 mb-8 max-w-md mx-auto">
                    Tim dukungan kami siap membantu Anda dengan kendala teknis atau pertanyaan lainnya.
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <NuxtLink to="/contact">
                        <BaseButton variant="primary" size="lg" icon="ph:envelope-simple-bold">
                            Hubungi Kami
                        </BaseButton>
                    </NuxtLink>
                    <NuxtLink to="/help">
                        <BaseButton variant="outline" size="lg" icon="ph:book-open-bold">
                            Pusat Bantuan
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </section>
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
        question: 'Bagaimana cara mendaftarkan klub di Archeryhub.id?',
        answer: 'Anda dapat mendaftarkan klub melalui halaman registrasi dengan memilih tipe akun "Klub". Setelah email terverifikasi, Anda dapat melengkapi profil klub dan mulai mengelola anggota.'
    },
    {
        question: 'Apakah sistem scoring bisa digunakan untuk turnamen offline?',
        answer: 'Tentu! Archeryhub.id dirancang untuk mempermudah scoring turnamen offline secara digital. Skor dapat diinput langsung oleh wasit atau peserta melalui aplikasi.'
    },
    {
        question: 'Bagaimana proses pembayaran pendaftaran event?',
        answer: 'Kami mendukung berbagai metode pembayaran otomatis seperti Transfer Bank, E-Wallet (Gopay, OVO), dan QRIS. Status pendaftaran akan terupdate otomatis setelah pembayaran berhasil.'
    },
    {
        question: 'Apakah data atlet dijamin keamanannya?',
        answer: 'Kami menerapkan standar keamanan data yang ketat dan enkripsi end-to-end untuk memastikan seluruh informasi pribadi atlet dan klub tersimpan dengan aman.'
    },
    {
        question: 'Bagaimana cara mengajukan bantuan teknis?',
        answer: 'Jika Anda mengalami kendala teknis, silakan hubungi tim support kami melalui halaman Kontak atau kirimkan email ke support@archeryhub.id.'
    }
]

useHead({
    title: 'FAQ - Pertanyaan Sering Diajukan - Archeryhub.id'
})
</script>
