<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero -->
        <section class="bg-navy overflow-hidden pt-16 pb-16 md:pt-20 md:pb-24 relative">
            <div class="absolute inset-0 z-0">
                <img src="/hero-homepage.jpeg" class="w-full h-full object-cover opacity-40" alt="" />
                <div class="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/75 to-navy/60"></div>
            </div>

            <div class="container mx-auto px-4 max-w-5xl relative z-10 text-center py-12">
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 backdrop-blur-sm rounded-full text-primary text-xs font-bold tracking-widest mb-6">
                    <Icon icon="ph:book-open-bold" class="text-base" />
                    <span>DOKUMENTASI RESMI</span>
                </div>
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                    Pusat <span class="text-primary">Dokumentasi</span><br />Archeryhub.id
                </h1>
                <p class="text-white/60 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
                    Panduan lengkap tentang platform, jenis busur panahan, sistem berlangganan, tata cara turnamen, dan
                    banyak lagi — semua tersedia di satu tempat.
                </p>
                <!-- Search -->
                <div class="max-w-lg mx-auto relative">
                    <Icon icon="ph:magnifying-glass-bold"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input v-model="searchQuery" type="text" placeholder="Cari dokumentasi..."
                        class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-sm" />
                </div>
            </div>
        </section>

        <!-- Category Tabs -->
        <div class="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
            <div class="container mx-auto px-4 max-w-6xl">
                <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-3">
                    <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
                        :class="activeCategory === cat.id
                            ? 'bg-navy text-primary shadow-sm'
                            : 'text-gray-500 hover:text-navy hover:bg-gray-100'">
                        <Icon :icon="cat.icon" class="text-base" />
                        {{ cat.label }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Content -->
        <section class="container mx-auto px-4 max-w-6xl py-10">
            <div v-for="cat in filteredCategories" :key="cat.id" class="mb-12">
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-9 h-9 rounded-xl bg-navy flex items-center justify-center text-primary shrink-0">
                        <Icon :icon="cat.icon" class="text-lg" />
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-navy">{{ cat.label }}</h2>
                        <p class="text-gray-400 text-xs">{{ cat.description }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <NuxtLink v-for="doc in filteredDocs(cat.id)" :key="doc.slug" :to="`/docs/${doc.slug}`"
                        class="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-primary/30 hover:shadow-md transition-all">
                        <div class="flex items-start gap-4">
                            <div
                                class="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-all shrink-0">
                                <Icon :icon="doc.icon" class="text-lg" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3
                                    class="font-bold text-navy text-sm group-hover:text-primary transition-colors mb-1 leading-snug">
                                    {{ doc.title }}</h3>
                                <p class="text-gray-400 text-xs leading-relaxed line-clamp-2">{{ doc.excerpt }}</p>
                            </div>
                        </div>
                        <div class="flex items-center mt-4 pt-3 border-t border-gray-50">
                            <span class="text-xs text-gray-300 flex items-center gap-1">
                                <Icon icon="ph:clock-bold" class="text-xs" /> {{ doc.readTime }}
                            </span>
                            <span
                                class="ml-auto flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Baca
                                <Icon icon="ph:arrow-right-bold" class="text-xs" />
                            </span>
                        </div>
                    </NuxtLink>
                </div>

                <!-- Empty per category -->
                <div v-if="filteredDocs(cat.id).length === 0" class="text-center py-8 text-gray-300 text-sm">
                    Tidak ada artikel yang cocok.
                </div>
            </div>

            <!-- Global empty state -->
            <div v-if="filteredCategories.length === 0" class="text-center py-24">
                <Icon icon="ph:file-search-bold" class="text-5xl text-gray-300 mb-4" />
                <p class="text-gray-400 font-medium">Tidak ada dokumentasi yang cocok dengan pencarian.</p>
            </div>
        </section>

        <!-- CTA -->
        <section class="bg-navy py-14 mt-4">
            <div class="container mx-auto px-4 max-w-4xl text-center">
                <h2 class="text-xl md:text-2xl font-black text-white mb-3">Tidak menemukan yang dicari?</h2>
                <p class="text-white/50 text-sm mb-7">Hubungi tim support kami dan kami akan bantu secepatnya.</p>
                <NuxtLink to="/contact">
                    <button
                        class="inline-flex items-center gap-2 bg-primary text-navy font-black px-7 py-3 rounded-xl hover:bg-primary/90 transition-all text-sm">
                        <Icon icon="ph:chat-circle-dots-bold" />
                        Hubungi Support
                    </button>
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'docs' })

useHead({
    title: 'Dokumentasi - Archeryhub.id',
    meta: [{ name: 'description', content: 'Dokumentasi resmi Archeryhub.id. Panduan lengkap tentang platform, jenis busur, sistem berlangganan, dan tata cara turnamen.' }]
})

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
    { id: 'all', label: 'Semua', icon: 'ph:squares-four-bold', description: '' },
    { id: 'platform', label: 'Platform', icon: 'ph:rocket-bold', description: 'Mengenal Archeryhub.id secara mendalam' },
    { id: 'archery', label: 'Panahan', icon: 'ph:crosshair-bold', description: 'Pengetahuan dasar dan teknis panahan' },
    { id: 'subscription', label: 'Berlangganan', icon: 'ph:crown-bold', description: 'Paket dan fitur berlangganan' },
    { id: 'event', label: 'Event & Turnamen', icon: 'ph:trophy-bold', description: 'Panduan pengelolaan event' },
    { id: 'scoring', label: 'Scoring', icon: 'ph:target-bold', description: 'Sistem penilaian dan scoring' },
]

const docs = [
    { slug: 'apa-itu-archeryhub', title: 'Apa itu Archeryhub.id?', excerpt: 'Pengenalan menyeluruh tentang platform manajemen panahan terpadu pertama di Indonesia.', icon: 'ph:info-bold', category: 'platform', readTime: '3 menit' },
    { slug: 'cara-daftar', title: 'Cara Mendaftar Akun', excerpt: 'Panduan langkah demi langkah untuk mendaftarkan akun baru, baik sebagai pemanah, klub, organisasi, maupun penjual.', icon: 'ph:user-plus-bold', category: 'platform', readTime: '4 menit' },
    { slug: 'peran-pengguna', title: 'Peran Pengguna di Platform', excerpt: 'Penjelasan tentang tipe akun: Pemanah, Klub, Organisasi, dan Penjual beserta hak aksesnya masing-masing.', icon: 'ph:users-three-bold', category: 'platform', readTime: '3 menit' },
    { slug: 'manajemen-profil', title: 'Manajemen Profil & Pengaturan', excerpt: 'Cara memperbarui foto profil, informasi pribadi, dan mengatur preferensi notifikasi akun.', icon: 'ph:gear-six-bold', category: 'platform', readTime: '3 menit' },
    { slug: 'jenis-busur', title: 'Jenis-Jenis Busur Panahan', excerpt: 'Mengenal Recurve, Compound, Barebow, Tradisional, dan Longbow beserta karakteristik dan penggunaannya.', icon: 'ph:crosshair-bold', category: 'archery', readTime: '6 menit' },
    { slug: 'kategori-lomba', title: 'Kategori dan Divisi Lomba', excerpt: 'Penjelasan lengkap tentang divisi usia, jenis kelamin, dan jenis busur pada perlombaan panahan resmi.', icon: 'ph:list-numbers-bold', category: 'archery', readTime: '5 menit' },
    { slug: 'jarak-dan-target', title: 'Jarak Tembak dan Format Target', excerpt: 'Standar jarak tembak panahan indoor/outdoor serta format target face sesuai standar WA.', icon: 'ph:ruler-bold', category: 'archery', readTime: '4 menit' },
    { slug: 'istilah-panahan', title: 'Kamus Istilah Panahan', excerpt: 'Daftar istilah teknis yang umum digunakan dalam dunia panahan dari A sampai Z.', icon: 'ph:book-bold', category: 'archery', readTime: '8 menit' },
    { slug: 'paket-berlangganan', title: 'Paket Berlangganan Archeryhub.id', excerpt: 'Perbandingan lengkap paket Gratis, Starter, dan Pro beserta fitur-fitur yang tersedia di setiap tier.', icon: 'ph:crown-bold', category: 'subscription', readTime: '5 menit' },
    { slug: 'cara-berlangganan', title: 'Cara Berlangganan dan Pembayaran', excerpt: 'Panduan memilih paket, metode pembayaran yang tersedia, dan cara memperbarui langganan.', icon: 'ph:credit-card-bold', category: 'subscription', readTime: '4 menit' },
    { slug: 'fitur-premium', title: 'Fitur Eksklusif Paket Premium', excerpt: 'Daftar lengkap fitur yang hanya tersedia untuk akun berlangganan aktif.', icon: 'ph:star-bold', category: 'subscription', readTime: '4 menit' },
    { slug: 'addon-langganan', title: 'Add-on dan Perluasan Paket', excerpt: 'Cara menambahkan kapasitas tambahan atau layanan addon lainnya pada paket yang sudah aktif.', icon: 'ph:plus-circle-bold', category: 'subscription', readTime: '3 menit' },
    { slug: 'membuat-event', title: 'Membuat dan Mempublish Event', excerpt: 'Panduan lengkap cara membuat event baru, mengatur kategori lomba, skema pembayaran, dan jadwal.', icon: 'ph:plus-square-bold', category: 'event', readTime: '7 menit' },
    { slug: 'pendaftaran-peserta', title: 'Pendaftaran Peserta ke Event', excerpt: 'Cara mendaftarkan diri sebagai individu maupun rombongan klub ke sebuah event.', icon: 'ph:clipboard-text-bold', category: 'event', readTime: '5 menit' },
    { slug: 'manajemen-peserta', title: 'Manajemen Peserta dan Bantalan', excerpt: 'Cara menerima, menolak, atau mengatur penempatan peserta ke target pada sesi kualifikasi.', icon: 'ph:table-bold', category: 'event', readTime: '6 menit' },
    { slug: 'pengelolaan-klub', title: 'Pengelolaan Anggota Klub', excerpt: 'Cara mengundang pemanah, menerima permohonan bergabung, dan mengatur keanggotaan di klub Anda.', icon: 'ph:users-bold', category: 'event', readTime: '5 menit' },
    { slug: 'sistem-scoring-kualifikasi', title: 'Sistem Scoring Kualifikasi', excerpt: 'Penjelasan cara kerja input skor kualifikasi, penghitungan total hit, X10, dan leaderboard otomatis.', icon: 'ph:chart-bar-bold', category: 'scoring', readTime: '5 menit' },
    { slug: 'sistem-eliminasi', title: 'Sistem Pertandingan Eliminasi', excerpt: 'Cara membuat bracket eliminasi, generate otomatis berdasarkan seeding kualifikasi, dan input skor set.', icon: 'ph:git-branch-bold', category: 'scoring', readTime: '6 menit' },
    { slug: 'mobile-app-scoring', title: 'Scoring via Aplikasi Mobile', excerpt: 'Panduan penggunaan aplikasi mobile Archeryhub.id untuk wasit dalam menginput skor.', icon: 'ph:device-mobile-bold', category: 'scoring', readTime: '4 menit' },
    { slug: 'scorekeeper', title: 'Manajemen Scorekeeper', excerpt: 'Cara menambahkan akun scorekeeper/wasit oleh organisasi dan hak akses yang dimilikinya.', icon: 'ph:identification-badge-bold', category: 'scoring', readTime: '3 menit' },
]

const filteredCategories = computed(() => {
    const cats = activeCategory.value === 'all' ? categories.filter(c => c.id !== 'all') : categories.filter(c => c.id === activeCategory.value)
    if (searchQuery.value === '') return cats
    return cats.filter(cat => filteredDocs(cat.id).length > 0)
})

const filteredDocs = (categoryId) => {
    return docs.filter(d => {
        const matchCat = d.category === categoryId
        const matchSearch = searchQuery.value === '' ||
            d.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            d.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
        return matchCat && matchSearch
    })
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
