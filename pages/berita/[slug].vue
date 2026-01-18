<template>
    <div>
        <!-- Article Content -->
        <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <a href="/" class="hover:text-navy transition-colors">Beranda</a>
                <span class="material-symbols-outlined text-base">chevron_right</span>
                <a href="/berita" class="hover:text-navy transition-colors">Berita</a>
                <span class="material-symbols-outlined text-base">chevron_right</span>
                <span class="text-navy font-medium truncate max-w-xs">{{ article.title }}</span>
            </nav>

            <!-- Article Header -->
            <header class="mb-8">
                <div class="flex flex-wrap items-center gap-3 mb-4">
                    <span
                        class="px-3 py-1 rounded-full bg-primary/10 text-navy text-xs font-bold uppercase tracking-wider">
                        {{ article.category }}
                    </span>
                    <span class="text-gray-400 text-sm">{{ article.date }}</span>
                    <span class="text-gray-400">•</span>
                    <span class="text-gray-400 text-sm">{{ article.readTime }} min read</span>
                </div>
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-navy leading-tight tracking-tight mb-6">
                    {{ article.title }}
                </h1>
                <p class="text-xl text-gray-600 leading-relaxed">
                    {{ article.excerpt }}
                </p>
            </header>

            <!-- Featured Image -->
            <div class="relative rounded-2xl overflow-hidden mb-10 aspect-video">
                <img :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
                <div class="absolute bottom-4 left-4 right-4">
                    <p class="text-white/70 text-sm bg-navy/70 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-block">
                        {{ article.imageCaption }}
                    </p>
                </div>
            </div>

            <!-- Author Info -->
            <div class="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl mb-10 border border-gray-100">
                <img :src="article.author.avatar" :alt="article.author.name"
                    class="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                <div class="flex-1">
                    <p class="font-bold text-navy">{{ article.author.name }}</p>
                    <p class="text-sm text-gray-500">{{ article.author.role }}</p>
                </div>
                <div class="flex gap-2">
                    <button
                        class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-navy hover:border-navy transition-colors">
                        <span class="material-symbols-outlined text-lg">share</span>
                    </button>
                    <button
                        class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-navy hover:border-navy transition-colors">
                        <span class="material-symbols-outlined text-lg">bookmark</span>
                    </button>
                </div>
            </div>

            <!-- Article Body -->
            <article class="prose prose-lg max-w-none text-gray-700">
                <p>
                    Panahan Indonesia terus menunjukkan perkembangan yang signifikan dalam beberapa tahun terakhir.
                    Dengan meningkatnya jumlah turnamen yang diselenggarakan di berbagai daerah, olahraga ini semakin
                    mendapat tempat di hati masyarakat Indonesia.
                </p>

                <h2>Perkembangan Infrastruktur</h2>
                <p>
                    Salah satu faktor pendorong utama adalah peningkatan infrastruktur olahraga panahan di Indonesia.
                    Berbagai lapangan panahan baru telah dibangun di beberapa kota besar, memudahkan para atlet untuk
                    berlatih dengan fasilitas yang memadai.
                </p>
                <p>
                    Gelora Bung Karno, sebagai salah satu kompleks olahraga terbesar di Indonesia, kini memiliki
                    lapangan panahan berstandar internasional yang mampu menampung kompetisi skala besar.
                </p>

                <blockquote>
                    "Indonesia memiliki potensi besar untuk menjadi salah satu kekuatan panahan di Asia. Dengan dukungan
                    yang tepat, kita bisa melihat lebih banyak atlet Indonesia berprestasi di kancah internasional."
                    <cite>- Ketua Umum Perpani</cite>
                </blockquote>

                <h2>Program Pembinaan Atlet</h2>
                <p>
                    Perpani (Persatuan Panahan Indonesia) telah mengintensifkan program pembinaan atlet muda. Dengan
                    adanya scouting system yang lebih terstruktur, bakat-bakat baru dari seluruh penjuru Indonesia dapat
                    teridentifikasi lebih awal.
                </p>

                <ul>
                    <li>Program pelatihan nasional di bawah 18 tahun</li>
                    <li>Kerja sama dengan federasi panahan internasional</li>
                    <li>Pengadaan peralatan berstandar olimpiade</li>
                    <li>Peningkatan fasilitas latihan di daerah</li>
                </ul>

                <h2>Prestasi Internasional</h2>
                <p>
                    Atlet panahan Indonesia telah meraih berbagai prestasi di ajang internasional. Di SEA Games
                    terakhir, tim panahan Indonesia berhasil membawa pulang beberapa medali emas, menunjukkan potensi
                    besar olahraga ini di tanah air.
                </p>

                <figure>
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy5qIYUnhOAA9fRw-ezPUypzWUtCQTHv6EpNe6Q0bAAz6AFkDLOqgltBvPdIyyRsW4WqNcDFxXZlfgwFHWevvHH2yphLfwWEOEHT3GyFbvXsenr1qoxDPsSf-bmVfNqwG9_5cJoVMhgvCJ2FfEt6bQgicn5WlBrsP8axm39cBTN9E6cF7MQ9vKO5p0acgAZ1z3IYSXi-yQILL1HoOdT6ZobZEyg4qolUIumeiK6bVGuATW7dwLfqmaRIFiXL-l1PEPGa_sRD5Lc9E"
                        alt="Atlet panahan Indonesia beraksi" class="rounded-xl" />
                    <figcaption>Para atlet panahan Indonesia berlatih di GBK Archery Field menjelang kompetisi
                        internasional.</figcaption>
                </figure>

                <h2>Masa Depan Panahan Indonesia</h2>
                <p>
                    Dengan semua perkembangan positif ini, masa depan panahan Indonesia terlihat cerah. Dengan terus
                    meningkatkan kualitas pembinaan dan fasilitas, tidak mustahil Indonesia akan menjadi salah satu
                    kekuatan panahan di kancah Asia bahkan dunia.
                </p>
            </article>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                <span v-for="tag in article.tags" :key="tag"
                    class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer">
                    #{{ tag }}
                </span>
            </div>

            <!-- Related Articles -->
            <section class="mt-16">
                <h2 class="text-2xl font-bold text-navy mb-6">Artikel Terkait</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a v-for="related in relatedArticles" :key="related.slug" :href="`/berita/${related.slug}`"
                        class="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/30 transition-all">
                        <div class="relative aspect-video overflow-hidden">
                            <img :src="related.image" :alt="related.title"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div class="p-4">
                            <span class="text-xs font-bold text-primary uppercase tracking-wider">{{ related.category
                            }}</span>
                            <h3
                                class="text-navy font-bold mt-2 group-hover:text-primary-hover transition-colors line-clamp-2">
                                {{ related.title }}</h3>
                            <p class="text-gray-500 text-sm mt-2">{{ related.date }}</p>
                        </div>
                    </a>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug

// Use landing layout with header and footer
definePageMeta({
    layout: 'landing'
})

const articlesData = {
    'perkembangan-panahan-indonesia-2024': {
        title: 'Perkembangan Panahan Indonesia di Tahun 2024',
        excerpt: 'Indonesia terus menunjukkan kemajuan signifikan dalam olahraga panahan dengan berbagai turnamen nasional dan prestasi internasional.',
        category: 'Berita Nasional',
        date: '15 November 2024',
        readTime: 5,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o',
        imageCaption: 'Tim panahan Indonesia di GBK Archery Field',
        author: {
            name: 'Ahmad Rizki',
            role: 'Senior Sports Editor',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLm2bt_rocjJTBJyLy5egiG9qWTRu9j6JZGiQJiPm8b1G-HSoEuiHPFCrCPBc7qb81krUTSO68P9GueohN-_0IAPQUYSb-Jmd32xXgCNveXoWn0ACR6lV3AFfehy0pYgrdNBVXEyn4uZBaLcOM53xvrj6Nj8lqZdHdDm_sqOirc-36E7u9Qk0pblOTfHJH69INJpXI6D78iO58yfy0HygaJfL6aQRUXwsA6QzEsyDTsfEt6-q4b8f5rl3D59A-pT-X4fXlv7Fm3ng'
        },
        tags: ['panahan', 'indonesia', 'olahraga', 'perpani', 'turnamen']
    },
    'indonesian-open-2024-preview': {
        title: 'Preview Indonesian Open Championship 2024',
        excerpt: 'Turnamen tahunan terbesar di Indonesia akan digelar bulan November dengan partisipan dari berbagai negara.',
        category: 'Turnamen',
        date: '10 November 2024',
        readTime: 4,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0',
        imageCaption: 'GBK Archery Field siap menyambut Indonesian Open 2024',
        author: {
            name: 'Siti Nurhaliza',
            role: 'Sports Correspondent',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLm2bt_rocjJTBJyLy5egiG9qWTRu9j6JZGiQJiPm8b1G-HSoEuiHPFCrCPBc7qb81krUTSO68P9GueohN-_0IAPQUYSb-Jmd32xXgCNveXoWn0ACR6lV3AFfehy0pYgrdNBVXEyn4uZBaLcOM53xvrj6Nj8lqZdHdDm_sqOirc-36E7u9Qk0pblOTfHJH69INJpXI6D78iO58yfy0HygaJfL6aQRUXwsA6QzEsyDTsfEt6-q4b8f5rl3D59A-pT-X4fXlv7Fm3ng'
        },
        tags: ['indonesian-open', 'turnamen', 'jakarta', 'gbk']
    }
}

const article = computed(() => {
    return articlesData[slug] || articlesData['perkembangan-panahan-indonesia-2024']
})

const relatedArticles = [
    { slug: 'tips-memilih-busur-pemula', title: 'Tips Memilih Busur untuk Pemula', category: 'Tutorial', date: '12 Nov 2024', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaKz9i1Sy4TPWgHSZRQZdfbE9FAsY4xikvvu2rhp8s_A9V5Sy5lv8pftyxQXwQSSv1xbdCGZkIqVOv_3u8sisf-kuW8CCXnYrzldx8xKkp12tmxF1SztarFv2PQMwoYr5sv7cn1wpmzOMepJof7lZkvTkOqS_LS94B-kyA-HRdMFPaNXbC-I6OY9Rp2dTCI-86cqoGMepWYeLPECuEvPwH35G_RyrcW4OoeB-xFCH1noe3E3mLKFdU_ftNYNRJ-e35YW_UO7tjW3E' },
    { slug: 'profil-atlet-maria-putri', title: 'Profil Atlet: Maria Putri, Harapan Baru Panahan Indonesia', category: 'Profil', date: '8 Nov 2024', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEyoMyPhTl7-9oRbs8Fqz1YZxEwczL3vvrIpNzNHGImIhte8_MRqCsmxPDpeo-GMFv4xD1UFE7CzQuZjLAaeTEFSwwGpLM5Fuuji1ri-DclVPd3XjaiZbP_HVCmNxUF4N4RvPt5eunD3D7XJwRXiE80p0b-XDjG79vpkghLPtwWffcqE__kLuIxrZg_xFXL5tPcnF3V-v_UjBTeSP3GZHOFSZ132JQ3wm91uitNtsctbagveyUjYxxYgEumBV7_uYhaBtTeHfBlCs' },
    { slug: 'hasil-sea-games-2024', title: 'Hasil Lengkap Panahan SEA Games 2024', category: 'Hasil', date: '5 Nov 2024', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq8OlQbcxO7uY4gwKVt6JygaktR4FjGZfJwbWiOyDIXqXr0bCnQIn3f-5m63myglDTGxdrpDHrFX2wVGOC7C8INtL7td4RDrpYhrJi0qjxPG7jixXi-Cw0fJQfRMda9sgJhfzCsFLmMhX9mvC6_gNAo5OF_MDtU5ukfm3hvRqWuHC0pbxNqSd0uWfIxLjxHXmyDnRtFg9VIz-XC2tCuvSusJKEFLjs57_DO7_uOGurALxGKsxcgIJmc_0gHV72A6BGvhiStIpWr3o' },
]

useSeoMeta({
    title: () => `${article.value.title} - Archeryhub.id`,
    description: () => article.value.excerpt
})
</script>

<style scoped>
.prose blockquote {
    @apply border-l-4 border-primary bg-gray-50 pl-6 py-4 pr-4 rounded-r-xl italic text-gray-700;
}

.prose blockquote cite {
    @apply block text-sm text-gray-500 not-italic mt-2 font-medium;
}

.prose figure {
    @apply my-8;
}

.prose figcaption {
    @apply text-center text-sm text-gray-500 mt-3;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
