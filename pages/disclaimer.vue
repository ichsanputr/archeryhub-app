<template>
    <div class="min-h-screen flex flex-col">
        <!-- Hero Section -->
        <div class="bg-navy pt-12 pb-16 relative overflow-hidden">
            <div class="absolute inset-0 z-0 opacity-10">
                <div class="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20">
                </div>
                <div
                    class="absolute left-0 bottom-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20">
                </div>
            </div>
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div>
                    <div class="flex items-center gap-2 text-primary text-sm font-bold tracking-wider mb-3">
                        <Icon icon="ph:warning-circle" class="text-lg" />
                        Legal
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        Disclaimer
                    </h1>
                    <p class="text-slate-300 text-lg leading-relaxed">
                        Informasi penting mengenai penggunaan layanan dan konten di Archery Hub Indonesia.
                    </p>
                    <p class="text-slate-400 text-sm mt-6">
                        Terakhir diperbarui: 18 Februari 2026
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mb-20 relative z-20">
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
                <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                    <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">1. Informasi Umum</h3>
                    <p class="mb-4">
                        Seluruh informasi yang disediakan di situs web Archery Hub Indonesia ("Situs") dipublikasikan
                        dengan itikad baik dan hanya untuk tujuan informasi umum. Archery Hub Indonesia tidak memberikan
                        jaminan apa pun tentang kelengkapan, keandalan, dan keakuratan informasi ini.
                    </p>
                    <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">2. Tanggung Jawab Pengguna</h3>
                    <p class="mb-4">
                        Tindakan apa pun yang Anda lakukan terhadap informasi yang Anda temukan di Situs ini adalah
                        tanggung jawab Anda sendiri. Archery Hub Indonesia tidak akan bertanggung jawab atas kerugian
                        dan/atau kerusakan sehubungan dengan penggunaan Situs kami.
                    </p>
                    <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">3. Tautan Eksternal</h3>
                    <p class="mb-4">
                        Dari Situs kami, Anda dapat mengunjungi situs web lain dengan mengikuti hyperlink ke situs
                        eksternal tersebut. Meskipun kami berusaha menyediakan tautan berkualitas ke situs web yang
                        bermanfaat dan etis, kami tidak memiliki kendali atas konten dan sifat situs-situs tersebut.
                        Tautan ke situs web lain tidak menyiratkan rekomendasi untuk semua konten yang ditemukan di
                        situs tersebut.
                    </p>
                    <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">4. Persetujuan</h3>
                    <p class="mb-4">
                        Dengan menggunakan Situs kami, Anda dengan ini menyetujui disclaimer kami dan menyetujui
                        ketentuan-ketentuannya.
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
definePageMeta({
    layout: 'landing'
})

useHead({
    title: 'Disclaimer - Archeryhub.id'
})
</script>
