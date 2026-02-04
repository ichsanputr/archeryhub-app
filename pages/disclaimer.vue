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
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="max-w-3xl">
                    <div class="flex items-center gap-2 text-primary text-sm font-bold  tracking-wider mb-3">
                        <Icon icon="ph:warning" class="text-lg" />
                        Legal
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        Penyangkalan
                    </h1>
                    <p class="text-slate-300 text-lg leading-relaxed max-w-2xl">
                        Pemberitahuan platform informasi dan penyangkalan profesional.
                    </p>
                    <p class="text-slate-400 text-sm mt-6">
                        Terakhir diperbarui: 24 Oktober 2024
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mb-20 relative z-20">
            <div
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
                    <p class="text-yellow-800 dark:text-yellow-200 font-medium italic">
                        "Panahan melibatkan penggunaan peralatan yang dapat berbahaya jika ditangani dengan salah.
                        Archery Hub
                        adalah platform informasi dan tidak bertanggung jawab atas cedera atau kecelakaan apa pun yang
                        terjadi di klub atau event yang terdaftar."
                    </p>
                </div>
                <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                    <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">1. Informasi Umum</h3>
                    <p class="mb-4">
                        Informasi yang disediakan oleh Archery Hub Indonesia di situs web ini hanya untuk tujuan
                        informasi umum. Semua informasi di Situs disediakan dengan itikad baik,
                        namun kami tidak membuat pernyataan atau jaminan apa pun, baik tersurat maupun tersirat,
                        mengenai
                        keakuratan, kecukupan, validitas, keandalan, ketersediaan atau kelengkapan informasi apa pun
                        di Situs.
                    </p>
                    <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">2. Penyangkalan Profesional</h3>
                    <p class="mb-4">
                        Situs tidak dapat dan tidak mengandung nasihat olahraga profesional. Informasi panahan
                        disediakan hanya untuk tujuan informasi dan pendidikan umum dan bukan merupakan
                        pengganti nasihat profesional. Oleh karena itu, sebelum mengambil tindakan berdasarkan
                        informasi tersebut, kami mendorong Anda untuk berkonsultasi dengan profesional yang tepat.
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
    title: 'Penyangkalan - Archeryhub.id'
})
</script>
