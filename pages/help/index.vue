<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden py-16 md:py-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-homepage.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-3xl text-center md:text-left">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-sm font-bold uppercase tracking-widest mb-6">
                        <Icon icon="ph:lifebuoy-bold" class="text-lg" />
                        <span>Pusat Bantuan</span>
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        Bagaimana Kami Bisa <span class="text-primary">Membantu Anda?</span>
                    </h1>
                    <div class="relative max-w-xl mx-auto md:mx-0">
                        <Icon icon="ph:magnifying-glass-bold"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input type="text" placeholder="Cari panduan, tutorial, atau solusi..."
                            class="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:bg-white focus:text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Help Categories -->
        <section class="container mx-auto px-4 max-w-7xl py-16">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div v-for="cat in helpCategories" :key="cat.title"
                    class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-all group">
                    <div
                        class="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center mb-6 text-gray-400 group-hover:text-primary transition-colors">
                        <Icon :icon="cat.icon" class="text-3xl" />
                    </div>
                    <h3 class="text-xl font-bold text-navy mb-3">{{ cat.title }}</h3>
                    <p class="text-gray-500 text-sm leading-relaxed mb-6">{{ cat.description }}</p>
                    <NuxtLink :to="cat.link"
                        class="text-primary font-bold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
                        Pelajari Lebih Lanjut
                        <Icon icon="ph:arrow-right-bold" />
                    </NuxtLink>
                </div>
            </div>

            <!-- Popular Topics -->
            <div class="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div class="lg:col-span-8">
                    <h2 class="text-2xl font-black text-navy mb-8 flex items-center gap-3">
                        <span class="w-1 h-8 bg-primary rounded-full"></span>
                        Topik Populer
                    </h2>
                    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div v-for="topic in popularTopics" :key="topic.title"
                            class="p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <Icon :icon="topic.icon" class="text-xl text-gray-300 group-hover:text-primary" />
                                <span class="font-bold text-navy">{{ topic.title }}</span>
                            </div>
                            <Icon icon="ph:caret-right-bold" class="text-gray-300" />
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-4">
                    <div class="bg-navy rounded-3xl p-8 text-white relative overflow-hidden h-full">
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                        <h3 class="text-xl font-bold mb-6 relative z-10">Kontak Cepat</h3>
                        <div class="space-y-6 relative z-10">
                            <div class="flex gap-4">
                                <Icon icon="ph:envelope-simple-bold" class="text-2xl text-primary shrink-0" />
                                <div>
                                    <p class="text-xs text-white/50 mb-1">Email Dukungan</p>
                                    <p class="font-bold">support@archeryhub.id</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <Icon icon="ph:whatsapp-logo-bold" class="text-2xl text-primary shrink-0" />
                                <div>
                                    <p class="text-xs text-white/50 mb-1">WhatsApp Business</p>
                                    <p class="font-bold">+62 812-3456-7890</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({
    layout: 'landing'
})

const helpCategories = [
    {
        title: 'Akun & Profil',
        description: 'Kelola data diri, klub, dan pengaturan keamanan akun Anda.',
        icon: 'ph:user-circle-bold',
        link: '/help/account'
    },
    {
        title: 'Manajemen Event',
        description: 'Panduan lengkap mendaftarkan dan mengelola turnamen panahan.',
        icon: 'ph:calendar-plus-bold',
        link: '/help/events'
    },
    {
        title: 'Sistem Scoring',
        description: 'Cara menggunakan e-scoring untuk kualifikasi dan eliminasi.',
        icon: 'ph:target-bold',
        link: '/help/scoring'
    },
    {
        title: 'Pembayaran',
        description: 'Informasi metode pembayaran, biaya, dan penarikan dana.',
        icon: 'ph:credit-card-bold',
        link: '/help/payments'
    }
]

const popularTopics = [
    { title: 'Cara memverifikasi akun klub', icon: 'ph:seal-check-bold' },
    { title: 'Mengatur kategori umur di turnamen', icon: 'ph:users-bold' },
    { title: 'Cetak kartu skor dan pendaftaran', icon: 'ph:printer-bold' },
    { title: 'Menambahkan wasit ke dalam event', icon: 'ph:judge-bold' },
    { title: 'Mengaktifkan fitur live broadcast skor', icon: 'ph:broadcast-bold' }
]

useHead({
    title: 'Pusat Bantuan - Archeryhub.id'
})
</script>
