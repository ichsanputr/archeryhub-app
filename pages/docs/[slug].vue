<template>
    <div class="min-h-screen bg-gray-50 docs-page">
        <!-- Breadcrumb bar (not sticky) -->
        <div class="bg-white border-b border-gray-100">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex items-center gap-2 h-11 text-xs text-gray-500 overflow-x-auto no-scrollbar">
                    <NuxtLink to="/" class="hover:text-navy transition-colors whitespace-nowrap">Beranda</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-gray-300 shrink-0" />
                    <NuxtLink to="/docs" class="hover:text-navy transition-colors whitespace-nowrap">Dokumentasi
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-gray-300 shrink-0" />
                    <span class="text-navy font-semibold whitespace-nowrap truncate">{{ currentDoc?.title }}</span>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 max-w-7xl pt-8 pb-20 flex flex-col lg:flex-row gap-0">
            <!-- Left Sidebar (Navigation) -->
            <aside
                class="flex flex-col w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-4 lg:scrollbar-styled self-start mb-8 lg:mb-0">
                <!-- Mobile Toggle Button -->
                <button @click="isMobileMenuOpen = !isMobileMenuOpen"
                    class="lg:hidden flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-3 mb-2 text-sm font-bold text-navy hover:bg-gray-50 transition-colors">
                    <span class="flex items-center gap-2">
                        <Icon icon="ph:list-dashes-bold" class="text-lg text-primary" />
                        Daftar Isi Dokumentasi
                    </span>
                    <Icon :icon="isMobileMenuOpen ? 'ph:caret-up-bold' : 'ph:caret-down-bold'"
                        class="text-gray-400 text-base" />
                </button>

                <!-- Sidebar content (collapsible on mobile, always visible on desktop) -->
                <div :class="isMobileMenuOpen ? 'block' : 'hidden lg:block'"
                    class="bg-gray-50 lg:bg-transparent -mx-4 px-4 py-4 lg:p-0 lg:mx-0 border-y border-gray-100 lg:border-0 rounded-none lg:rounded-none">
                    <!-- Search -->
                    <div class="relative mb-4">
                        <Icon icon="ph:magnifying-glass-bold"
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input v-model="sidebarSearch" type="text" placeholder="Cari..."
                            class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white" />
                    </div>

                    <!-- Nav sections -->
                    <div v-for="cat in sidebarCategories" :key="cat.id" class="mb-4">
                        <div class="flex items-center gap-2 px-2 py-1.5 mb-1">
                            <Icon :icon="cat.icon" class="text-sm text-gray-400" />
                            <span class="text-xs font-black text-gray-400 tracking-widest uppercase">{{ cat.label
                                }}</span>
                        </div>
                        <div class="space-y-0.5">
                            <NuxtLink v-for="doc in filteredSidebarDocs(cat.id)" :key="doc.slug"
                                :to="`/docs/${doc.slug}`"
                                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all relative group"
                                :class="currentSlug === doc.slug
                                    ? 'bg-navy text-primary font-bold'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-navy font-medium'">
                                <div v-if="currentSlug === doc.slug"
                                    class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full">
                                </div>
                                <span class="leading-snug" :class="currentSlug !== doc.slug ? 'pl-2' : ''">{{ doc.title
                                    }}</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main content -->
            <main class="flex-1 min-w-0 w-full lg:pl-8 lg:pr-6">
                <div v-if="currentDoc" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <!-- Doc header -->
                    <div class="bg-navy px-8 pt-10 pb-8 relative overflow-hidden">
                        <div class="absolute inset-0 opacity-10"
                            style="background-image: linear-gradient(to right, #b7fb23 1px, transparent 1px), linear-gradient(to bottom, #b7fb23 1px, transparent 1px); background-size: 40px 40px;">
                        </div>
                        <div class="relative z-10">
                            <div
                                class="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-xs font-bold mb-4">
                                <Icon :icon="currentDoc.icon" class="text-sm" />
                                {{ getCategoryLabel(currentDoc.category) }}
                            </div>
                            <h1 class="text-2xl md:text-3xl xl:text-4xl font-black text-white mb-3 leading-tight">{{
                                currentDoc.title }}</h1>
                            <p class="text-white/60 text-sm">{{ currentDoc.excerpt }}</p>
                            <div class="flex items-center gap-4 mt-4 text-white/40 text-xs">
                                <span class="flex items-center gap-1.5">
                                    <Icon icon="ph:clock-bold" class="text-sm" /> {{ currentDoc.readTime }} membaca
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <Icon icon="ph:calendar-blank-bold" class="text-sm" /> Diperbarui Maret 2025
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Doc body -->
                    <div class="px-6 md:px-10 py-8 doc-content" v-html="currentDoc.content"></div>

                    <!-- Navigation buttons -->
                    <div
                        class="px-6 md:px-10 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <NuxtLink v-if="prevDoc" :to="`/docs/${prevDoc.slug}`"
                            class="flex items-center gap-3 group p-4 rounded-2xl hover:bg-gray-50 border border-gray-100 transition-all w-full sm:max-w-xs justify-start">
                            <Icon icon="ph:arrow-left-bold"
                                class="text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                            <div class="text-left min-w-0">
                                <div class="text-xs text-gray-400 mb-0.5">Sebelumnya</div>
                                <div
                                    class="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">
                                    {{ prevDoc.title }}</div>
                            </div>
                        </NuxtLink>
                        <div v-else class="hidden sm:block"></div>
                        <NuxtLink v-if="nextDoc" :to="`/docs/${nextDoc.slug}`"
                            class="flex items-center gap-3 group p-4 rounded-2xl hover:bg-gray-50 border border-gray-100 transition-all w-full sm:max-w-xs justify-end text-right sm:ml-auto">
                            <div class="min-w-0">
                                <div class="text-xs text-gray-400 mb-0.5">Selanjutnya</div>
                                <div
                                    class="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">
                                    {{ nextDoc.title }}</div>
                            </div>
                            <Icon icon="ph:arrow-right-bold"
                                class="text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                        </NuxtLink>
                    </div>
                </div>

                <!-- Not found -->
                <div v-else class="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
                    <Icon icon="ph:file-x-bold" class="text-5xl text-gray-300 mb-4" />
                    <h2 class="text-xl font-black text-navy mb-2">Halaman tidak ditemukan</h2>
                    <p class="text-gray-500 mb-6 text-sm">Dokumentasi yang kamu cari mungkin telah dipindahkan atau
                        belum tersedia.</p>
                    <NuxtLink to="/docs"
                        class="inline-flex items-center gap-2 bg-navy text-primary font-bold px-6 py-2.5 rounded-xl hover:bg-navy/90 transition-all text-sm">
                        <Icon icon="ph:arrow-left-bold" />
                        Kembali ke Docs
                    </NuxtLink>
                </div>
            </main>

            <!-- Right sidebar: Table of contents -->
            <aside
                class="hidden xl:flex flex-col w-56 shrink-0 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pl-4 scrollbar-styled self-start">
                <div class="text-xs font-black text-gray-400 tracking-widest uppercase mb-3">Di halaman ini</div>
                <nav class="space-y-1">
                    <a v-for="heading in currentDoc?.toc || []" :key="heading.id" :href="`#${heading.id}`"
                        class="block text-sm py-1.5 transition-colors leading-snug" :class="[
                            heading.level === 2 ? 'text-gray-600 hover:text-primary font-medium pl-0' : 'text-gray-400 hover:text-primary pl-3 text-xs'
                        ]">
                        {{ heading.text }}
                    </a>
                </nav>

                <!-- Divider -->
                <div class="mt-6 pt-6 border-t border-gray-100">
                    <NuxtLink to="/docs"
                        class="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors font-medium mb-3">
                        <Icon icon="ph:arrow-left-bold" class="text-xs" /> Semua Dokumentasi
                    </NuxtLink>
                    <NuxtLink to="/contact"
                        class="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors font-medium">
                        <Icon icon="ph:chat-circle-dots-bold" class="text-sm" /> Hubungi Support
                    </NuxtLink>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'docs' })

const route = useRoute()
const currentSlug = computed(() => route.params.slug)
const sidebarSearch = ref('')
const isMobileMenuOpen = ref(false)

watch(currentSlug, () => {
    isMobileMenuOpen.value = false // Auto close on navigation in mobile
})

const categories = [
    { id: 'platform', label: 'Platform', icon: 'ph:rocket-bold' },
    { id: 'archery', label: 'Panahan', icon: 'ph:crosshair-bold' },
    { id: 'subscription', label: 'Berlangganan', icon: 'ph:crown-bold' },
    { id: 'event', label: 'Event & Turnamen', icon: 'ph:trophy-bold' },
    { id: 'scoring', label: 'Scoring', icon: 'ph:target-bold' },
]

const sidebarCategories = categories

const getCategoryLabel = (id) => categories.find(c => c.id === id)?.label || id

const docs = [
    {
        slug: 'apa-itu-archeryhub', title: 'Apa itu Archeryhub.id?', excerpt: 'Pengenalan menyeluruh tentang platform manajemen panahan terpadu pertama di Indonesia.', icon: 'ph:info-bold', category: 'platform', readTime: '3 menit',
        toc: [
            { id: 'tentang', level: 2, text: 'Tentang Archeryhub.id' },
            { id: 'misi', level: 2, text: 'Misi Platform' },
            { id: 'fitur-utama', level: 2, text: 'Fitur Utama' },
            { id: 'untuk-siapa', level: 2, text: 'Untuk Siapa?' },
        ],
        content: `
          <h2 id="tentang">Tentang Archeryhub.id</h2>
          <p>Archeryhub.id adalah platform manajemen panahan terpadu pertama di Indonesia yang dirancang untuk mempermudah ekosistem olahraga panahan — mulai dari pengelolaan event, klub, pemanah, scoring, hingga marketplace peralatan.</p>
          <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-6 flex gap-4">
            <div class="text-primary text-2xl shrink-0">💡</div>
            <div>
              <div class="font-bold text-navy text-sm mb-1">Satu Platform, Semua Kebutuhan</div>
              <div class="text-gray-600 text-sm">Dari pendaftaran event, input skor, hingga pembelian peralatan — Archeryhub.id adalah rumah digital bagi komunitas panahan Indonesia.</div>
            </div>
          </div>
          <h2 id="misi">Misi Platform</h2>
          <p>Kami hadir untuk mendigitalisasi seluruh proses operasional turnamen panahan yang selama ini masih banyak dilakukan secara manual dan tidak terkoordinasi. Visi kami adalah menciptakan ekosistem panahan yang terkoneksi, transparan, dan mudah diakses oleh semua lapisan komunitas.</p>
          <h2 id="fitur-utama">Fitur Utama</h2>
          <ul>
            <li><strong>Manajemen Event:</strong> Buat, publikasikan, dan kelola turnamen lengkap dengan kategori, jadwal, dan pembayaran online.</li>
            <li><strong>Sistem Scoring:</strong> Input skor kualifikasi dan eliminasi secara real-time melalui web maupun aplikasi mobile.</li>
            <li><strong>Manajemen Klub:</strong> Kelola anggota, kirim undangan, dan pantau keaktifan pemanah di klub Anda.</li>
            <li><strong>Marketplace:</strong> Jual dan beli peralatan panahan dari seller terpercaya di seluruh Indonesia.</li>
            <li><strong>Profil Pemanah:</strong> Setiap pemanah memiliki profil publik dengan riwayat event dan statistik.</li>
          </ul>
          <h2 id="untuk-siapa">Untuk Siapa?</h2>
          <p>Platform ini ditujukan untuk seluruh ekosistem panahan Indonesia:</p>
          <div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            <div class="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div class="font-bold text-navy text-sm mb-1">🏹 Pemanah / Atlet</div>
              <div class="text-gray-500 text-xs">Daftar event, lihat jadwal, pantau skor, dan lengkapi profil diri.</div>
            </div>
            <div class="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div class="font-bold text-navy text-sm mb-1">🏛️ Klub Panahan</div>
              <div class="text-gray-500 text-xs">Kelola anggota, kirim undangan bergabung, dan ikut serta dalam event.</div>
            </div>
            <div class="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div class="font-bold text-navy text-sm mb-1">🎖️ Organisasi / Panitia</div>
              <div class="text-gray-500 text-xs">Buat event, atur kategori, dan kelola scoring turnamen secara lengkap.</div>
            </div>
            <div class="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div class="font-bold text-navy text-sm mb-1">🛒 Penjual Peralatan</div>
              <div class="text-gray-500 text-xs">Pasarkan produk panahan ke komunitas yang tepat sasaran.</div>
            </div>
          </div>
        `
    },
    {
        slug: 'cara-daftar', title: 'Cara Mendaftar Akun', excerpt: 'Panduan langkah demi langkah untuk mendaftarkan akun baru di Archeryhub.id.', icon: 'ph:user-plus-bold', category: 'platform', readTime: '4 menit',
        toc: [
            { id: 'pilih-tipe', level: 2, text: 'Pilih Tipe Akun' },
            { id: 'daftar-email', level: 2, text: 'Daftar via Email' },
            { id: 'daftar-google', level: 2, text: 'Daftar via Google' },
            { id: 'verifikasi', level: 2, text: 'Verifikasi & Login' },
        ],
        content: `
          <h2 id="pilih-tipe">Pilih Tipe Akun</h2>
          <p>Archeryhub.id menyediakan empat tipe akun yang dapat dipilih saat pendaftaran: <strong>Pemanah</strong>, <strong>Klub</strong>, <strong>Organisasi</strong>, dan <strong>Penjual</strong>. Pilih tipe yang sesuai dengan kebutuhan Anda.</p>
          <h2 id="daftar-email">Daftar via Email</h2>
          <ol>
            <li>Kunjungi halaman <a href="/auth/register" class="text-primary font-semibold">Daftar</a>.</li>
            <li>Isi nama lengkap, alamat email, dan kata sandi yang kuat.</li>
            <li>Pilih tipe akun (Pemanah / Klub / Organisasi / Penjual).</li>
            <li>Klik tombol <strong>Daftar Sekarang</strong>.</li>
            <li>Periksa kotak masuk email Anda dan klik tautan verifikasi.</li>
          </ol>
          <h2 id="daftar-google">Daftar via Google</h2>
          <p>Anda juga bisa mendaftar dengan cepat menggunakan akun Google. Klik tombol <strong>Daftar dengan Google</strong> di halaman registrasi, dan pilih akun Google yang ingin digunakan. Platform akan secara otomatis mengisi nama dan email Anda.</p>
          <h2 id="verifikasi">Verifikasi & Login</h2>
          <p>Setelah verifikasi berhasil, Anda akan langsung diarahkan ke dashboard sesuai tipe akun yang dipilih. Lengkapi profil Anda agar informasi tampil dengan benar di halaman publik.</p>
        `
    },
    {
        slug: 'peran-pengguna', title: 'Peran Pengguna di Platform', excerpt: 'Penjelasan tentang tipe akun dan hak aksesnya.', icon: 'ph:users-three-bold', category: 'platform', readTime: '3 menit',
        toc: [{ id: 'tipe-akun', level: 2, text: 'Tipe Akun' }, { id: 'perbandingan', level: 2, text: 'Tabel Perbandingan' }],
        content: `
          <h2 id="tipe-akun">Tipe Akun</h2>
          <p>Setiap pengguna dapat memiliki salah satu dari empat peran utama di Archeryhub.id. Setiap peran memiliki dashboard, fitur, dan hak akses yang berbeda-beda.</p>
          <h2 id="perbandingan">Tabel Perbandingan</h2>
          <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
              <thead><tr class="bg-navy text-left"><th class="text-primary font-bold px-4 py-3 rounded-tl-xl">Fitur</th><th class="text-white font-bold px-4 py-3">Pemanah</th><th class="text-white font-bold px-4 py-3">Klub</th><th class="text-white font-bold px-4 py-3">Organisasi</th><th class="text-white font-bold px-4 py-3 rounded-tr-xl">Penjual</th></tr></thead>
              <tbody class="divide-y divide-gray-100">
                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Profil Publik</td><td class="px-4 py-3 text-green-600">✓</td><td class="px-4 py-3 text-green-600">✓</td><td class="px-4 py-3 text-green-600">✓</td><td class="px-4 py-3 text-green-600">✓</td></tr>
                <tr class="bg-gray-50"><td class="px-4 py-3 text-gray-700 font-medium">Daftar Event</td><td class="px-4 py-3 text-green-600">✓</td><td class="px-4 py-3 text-green-600">✓</td><td class="px-4 py-3 text-gray-300">–</td><td class="px-4 py-3 text-gray-300">–</td></tr>
                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Buat Event</td><td class="px-4 py-3 text-gray-300">–</td><td class="px-4 py-3 text-gray-300">–</td><td class="px-4 py-3 text-green-600">✓ (Premium)</td><td class="px-4 py-3 text-gray-300">–</td></tr>
                <tr class="bg-gray-50"><td class="px-4 py-3 text-gray-700 font-medium">Kelola Anggota</td><td class="px-4 py-3 text-gray-300">–</td><td class="px-4 py-3 text-green-600">✓ (Premium)</td><td class="px-4 py-3 text-gray-300">–</td><td class="px-4 py-3 text-gray-300">–</td></tr>
                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Jual Produk</td><td class="px-4 py-3 text-gray-300">–</td><td class="px-4 py-3 text-gray-300">–</td><td class="px-4 py-3 text-gray-300">–</td><td class="px-4 py-3 text-green-600">✓</td></tr>
              </tbody>
            </table>
          </div>
        `
    },
    {
        slug: 'manajemen-profil', title: 'Manajemen Profil & Pengaturan', excerpt: 'Cara memperbarui profil dan pengaturan akun.', icon: 'ph:gear-six-bold', category: 'platform', readTime: '3 menit',
        toc: [{ id: 'ubah-foto', level: 2, text: 'Ubah Foto Profil' }, { id: 'ubah-info', level: 2, text: 'Ubah Informasi' }, { id: 'keamanan', level: 2, text: 'Keamanan Akun' }],
        content: `<h2 id="ubah-foto">Ubah Foto Profil</h2><p>Masuk ke <strong>Dashboard &rarr; Pengaturan</strong>. Pada bagian profil, klik foto avatar Anda untuk mengunggah foto baru. Format yang didukung: JPG, PNG, maksimum 2MB.</p><h2 id="ubah-info">Ubah Informasi</h2><p>Di halaman pengaturan, Anda dapat mengubah nama tampilan, kota domisili, dan informasi publik lainnya. Klik <strong>Simpan Perubahan</strong> untuk menyimpan.</p><h2 id="keamanan">Keamanan Akun</h2><p>Untuk mengubah password, buka tab <strong>Keamanan</strong> di halaman pengaturan. Masukkan password lama, kemudian password baru yang diinginkan. Anda juga dapat meminta perubahan email melalui proses verifikasi OTP.</p>`
    },
    {
        slug: 'jenis-busur', title: 'Jenis-Jenis Busur Panahan', excerpt: 'Mengenal Recurve, Compound, Barebow, Tradisional, dan Longbow.', icon: 'ph:crosshair-bold', category: 'archery', readTime: '6 menit',
        toc: [
            { id: 'recurve', level: 2, text: 'Recurve' },
            { id: 'compound', level: 2, text: 'Compound' },
            { id: 'barebow', level: 2, text: 'Barebow' },
            { id: 'tradisional', level: 2, text: 'Tradisional & Longbow' },
            { id: 'perbandingan-busur', level: 2, text: 'Perbandingan Busur' },
        ],
        content: `
          <h2 id="recurve">Recurve</h2>
          <p>Busur <strong>Recurve</strong> adalah jenis busur yang paling umum digunakan dalam kompetisi internasional dan dipertandingkan di Olimpiade. Ujung limb busur ini melengkung menjauhi pemanah, sehingga menghasilkan lebih banyak tenaga.</p>
          <ul>
            <li>Diakui oleh World Archery untuk kompetisi internasional</li>
            <li>Dapat dilengkapi telescopic sight, stabilizer, dan clicker</li>
            <li>Cocok untuk pemula yang ingin berkompetisi serius</li>
          </ul>
          <h2 id="compound">Compound</h2>
          <p>Busur <strong>Compound</strong> menggunakan sistem katrol (pulley/cam) yang memungkinkan pemanah menahan beban draw lebih ringan di posisi full draw. Ini membuat busur compound sangat akurat untuk jarak jauh.</p>
          <ul>
            <li>Beban draw bisa mencapai 60-70 lbs namun terasa lebih ringan</li>
            <li>Biasa menggunakan peep sight dan release aid</li>
            <li>Kategori terpisah dari Recurve di sebagian besar kompetisi</li>
          </ul>
          <h2 id="barebow">Barebow</h2>
          <p>Busur <strong>Barebow</strong> (juga dikenal sebagai Recurve Barebow) adalah busur recurve tanpa tambahan aksesori seperti sight atau stabilizer. Pemanah harus mengandalkan insting dan pengalaman untuk membidik.</p>
          <h2 id="tradisional">Tradisional & Longbow</h2>
          <p>Busur <strong>Tradisional</strong> mencakup berbagai busur yang menggunakan desain sederhana tanpa katrol atau aksesori modern. <strong>Longbow</strong> adalah busur lurus panjang yang merupakan warisan sejarah dari Eropa abad pertengahan.</p>
          <h2 id="perbandingan-busur">Perbandingan Busur</h2>
          <div class="not-prose overflow-x-auto my-4">
            <table class="w-full text-sm border-collapse">
              <thead><tr class="bg-navy"><th class="text-primary font-bold px-4 py-3 text-left rounded-tl-xl">Jenis</th><th class="text-white font-bold px-4 py-3 text-left">Tingkat Kesulitan</th><th class="text-white font-bold px-4 py-3 text-left">Olimpiade</th><th class="text-white font-bold px-4 py-3 text-left rounded-tr-xl">Cocok Untuk</th></tr></thead>
              <tbody class="divide-y divide-gray-100">
                <tr class="bg-white"><td class="px-4 py-3 font-semibold text-navy">Recurve</td><td class="px-4 py-3 text-gray-600">Sedang</td><td class="px-4 py-3 text-green-600 font-bold">✓ Ya</td><td class="px-4 py-3 text-gray-600">Semua level</td></tr>
                <tr class="bg-gray-50"><td class="px-4 py-3 font-semibold text-navy">Compound</td><td class="px-4 py-3 text-gray-600">Sedang–Tinggi</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-600">Presisi tinggi</td></tr>
                <tr class="bg-white"><td class="px-4 py-3 font-semibold text-navy">Barebow</td><td class="px-4 py-3 text-gray-600">Tinggi</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-600">Kompetitor berpengalaman</td></tr>
                <tr class="bg-gray-50"><td class="px-4 py-3 font-semibold text-navy">Tradisional</td><td class="px-4 py-3 text-gray-600">Tinggi</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-600">Hobi, budaya</td></tr>
              </tbody>
            </table>
          </div>
        `
    },
    {
        slug: 'paket-berlangganan', title: 'Paket Berlangganan Archeryhub.id', excerpt: 'Perbandingan paket Gratis, Starter, dan Pro.', icon: 'ph:crown-bold', category: 'subscription', readTime: '5 menit',
        toc: [{ id: 'paket-gratis', level: 2, text: 'Paket Gratis' }, { id: 'paket-starter', level: 2, text: 'Paket Starter' }, { id: 'paket-pro', level: 2, text: 'Paket Pro' }, { id: 'faq-langganan', level: 2, text: 'FAQ Langganan' }],
        content: `
          <h2 id="paket-gratis">Paket Gratis</h2>
          <p>Cocok untuk pengguna yang baru bergabung dan ingin menjelajahi platform. Fitur dasar tersedia tanpa biaya apa pun:</p>
          <ul><li>Buat profil publik</li><li>Daftar ke event yang terbuka</li><li>Lihat berita dan informasi event</li><li>Posting berita sederhana</li></ul>
          <div class="not-prose bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 text-sm text-yellow-800">
            ⚠️ Fitur seperti membuat event, mengelola anggota, dan mengundang pemanah memerlukan paket berbayar.
          </div>
          <h2 id="paket-starter">Paket Starter</h2>
          <p>Ideal untuk klub kecil atau organisasi yang baru mulai memdigitalisasi manajemen mereka. Fitur utama:</p>
          <ul><li>Buat hingga 3 event per bulan</li><li>Kelola hingga 50 anggota klub</li><li>Akses sistem scoring kualifikasi</li><li>Ekspor data peserta ke CSV</li></ul>
          <h2 id="paket-pro">Paket Pro</h2>
          <p>Dirancang untuk organisasi besar, federasi, dan panitia turnamen skala nasional. Semua fitur Starter ditambah:</p>
          <ul><li>Event tidak terbatas</li><li>Anggota tak terbatas</li><li>Sistem bracket eliminasi lengkap</li><li>Manajemen scorekeeper</li><li>Laporan dan statistik lanjutan</li><li>Prioritas dukungan teknis</li></ul>
          <h2 id="faq-langganan">FAQ Langganan</h2>
          <p><strong>Bisakah saya upgrade di tengah periode?</strong> Ya, upgrade paket bisa dilakukan kapan saja dan perbedaan harga akan diperhitungkan secara proporsional.</p>
          <p><strong>Apa yang terjadi jika paket berakhir?</strong> Akun akan kembali ke mode Gratis. Data Anda tetap aman, namun akses ke fitur premium akan ditangguhkan.</p>
        `
    },
    {
        slug: 'membuat-event', title: 'Membuat dan Mempublish Event', excerpt: 'Panduan lengkap cara membuat dan mempublish event.', icon: 'ph:plus-square-bold', category: 'event', readTime: '7 menit',
        toc: [{ id: 'persyaratan', level: 2, text: 'Persyaratan' }, { id: 'langkah-membuat', level: 2, text: 'Langkah Membuat Event' }, { id: 'publish', level: 2, text: 'Mempublish Event' }],
        content: `<h2 id="persyaratan">Persyaratan</h2><p>Untuk membuat event, akun Anda harus bertipe <strong>Organisasi</strong> dan memiliki <strong>paket berlangganan aktif</strong> (minimal Starter).</p><h2 id="langkah-membuat">Langkah Membuat Event</h2><ol><li>Masuk ke <strong>Dashboard &rarr; Event &rarr; Buat Event Baru</strong>.</li><li>Isi informasi dasar: nama event, tanggal, lokasi, dan deskripsi.</li><li>Tambahkan kategori lomba (recurve putra/putri, compound, dll.).</li><li>Atur skema pembayaran: gratis atau berbayar dengan metode yang tersedia.</li><li>Unggah gambar banner event.</li><li>Atur jadwal pertandingan dan batas peserta per kategori.</li></ol><h2 id="publish">Mempublish Event</h2><p>Setelah semua informasi lengkap, klik tombol <strong>Publish Event</strong>. Event akan langsung tampil di halaman publik dan pemanah dapat mulai mendaftar. Anda dapat mengedit event kapan saja selama event belum ditutup pendaftarannya.</p>`
    },
    {
        slug: 'sistem-scoring-kualifikasi', title: 'Sistem Scoring Kualifikasi', excerpt: 'Cara kerja input skor dan penghitungan otomatis.', icon: 'ph:chart-bar-bold', category: 'scoring', readTime: '5 menit',
        toc: [{ id: 'sesi-kualifikasi', level: 2, text: 'Sesi Kualifikasi' }, { id: 'penempatan-bantalan', level: 2, text: 'Penempatan Bantalan' }, { id: 'input-skor', level: 2, text: 'Input Skor' }, { id: 'leaderboard', level: 2, text: 'Leaderboard' }],
        content: `<h2 id="sesi-kualifikasi">Sesi Kualifikasi</h2><p>Panitia dapat membuat satu atau lebih sesi kualifikasi dalam sebuah event. Setiap sesi dapat memiliki jadwal, jumlah end (ronde), dan jumlah anak panah per end yang berbeda-beda.</p><h2 id="penempatan-bantalan">Penempatan Bantalan</h2><p>Setelah peserta terdaftar, panitia dapat menentukan penempatan peserta ke setiap target (bantalan) secara manual atau menggunakan fitur <strong>Auto-Assign</strong> yang akan membagi peserta secara adil dan otomatis.</p><h2 id="input-skor">Input Skor</h2><p>Skor diinput oleh wasit melalui aplikasi mobile atau dashboard web. Setiap anak panah dicatat nilainya (1-10, X, M). Platform secara otomatis menghitung total skor, jumlah hit, dan jumlah X10.</p><h2 id="leaderboard">Leaderboard</h2><p>Hasil kualifikasi ditampilkan secara real-time di leaderboard publik yang dapat diakses siapa saja. Peringkat diurutkan berdasarkan total skor tertinggi, dengan X10 sebagai pemecah nilai seri.</p>`
    },
    {
        slug: 'sistem-eliminasi', title: 'Sistem Pertandingan Eliminasi', excerpt: 'Bracket eliminasi dan scoring set per set.', icon: 'ph:git-branch-bold', category: 'scoring', readTime: '6 menit',
        toc: [{ id: 'bracket', level: 2, text: 'Membuat Bracket' }, { id: 'generate-otomatis', level: 2, text: 'Generate Otomatis' }, { id: 'skor-set', level: 2, text: 'Sistem Skor Set' }],
        content: `<h2 id="bracket">Membuat Bracket</h2><p>Setelah sesi kualifikasi selesai, panitia dapat membuat bracket eliminasi untuk masing-masing divisi/kategori. Bracket dapat dibuat secara manual atau diisi otomatis berdasarkan peringkat kualifikasi.</p><h2 id="generate-otomatis">Generate Otomatis</h2><p>Fitur <strong>Generate Bracket Otomatis</strong> akan menyusun peserta ke dalam bagan pertandingan berdasarkan seeding (peringkat akhir kualifikasi). Sistem mendukung format bracket 32, 16, 8, atau 4 besar.</p><h2 id="skor-set">Sistem Skor Set</h2><p>Sistem eliminasi menggunakan <strong>Set System</strong> yang diakui World Archery. Setiap set dimenangkan oleh pemanah dengan total skor lebih tinggi, dan mendapatkan 2 poin set. Poin set 1-1 saat seri. Pertandingan berakhir saat salah satu pemanah mencapai 6 poin set (best of 5 set).</p>`
    },
    {
        slug: 'mobile-app-scoring', title: 'Scoring via Aplikasi Mobile', excerpt: 'Panduan wasit menggunakan aplikasi mobile untuk scoring.', icon: 'ph:device-mobile-bold', category: 'scoring', readTime: '4 menit',
        toc: [{ id: 'login-mobile', level: 2, text: 'Login Scorekeeper' }, { id: 'scan-qr', level: 2, text: 'Scan QR Assignment' }, { id: 'input-skor-mobile', level: 2, text: 'Input Skor' }],
        content: `<h2 id="login-mobile">Login Scorekeeper</h2><p>Akun scorekeeper dibuat oleh panitia organisasi melalui dashboard. Wasit dapat login ke aplikasi mobile menggunakan kredensial yang diberikan panitia.</p><h2 id="scan-qr">Scan QR Assignment</h2><p>Setiap bantalan/target memiliki kode QR. Wasit cukup memindai kode tersebut untuk langsung membuka kartu skor peserta yang berada di bantalan tersebut — tanpa perlu mencari manual.</p><h2 id="input-skor-mobile">Input Skor</h2><p>Tampilan kartu skor di aplikasi mobile dirancang untuk memudahkan input skor per anak panah. Wasit menekan angka nilai (1-10, X, M) dan skor otomatis terakumulasi. Setelah selesai, ketuk <strong>Simpan End</strong> untuk mengirim data.</p>`
    },
    { slug: 'pendaftaran-peserta', title: 'Pendaftaran Peserta ke Event', excerpt: 'Cara mendaftarkan diri ke event dan proses pembayaran.', icon: 'ph:clipboard-text-bold', category: 'event', readTime: '5 menit', toc: [{ id: 'daftar-individu', level: 2, text: 'Daftar Individu' }, { id: 'daftar-klub', level: 2, text: 'Daftar via Klub' }], content: `<h2 id="daftar-individu">Daftar Individu</h2><p>Buka halaman event yang ingin diikuti, pilih kategori yang sesuai, dan klik <strong>Daftar Sekarang</strong>. Isi formulir pendaftaran dan lanjutkan ke halaman pembayaran jika event berbayar.</p><h2 id="daftar-klub">Daftar via Klub</h2><p>Admin klub dapat mendaftarkan beberapa anggota sekaligus melalui fitur <strong>Pendaftaran Rombongan</strong> di dashboard klub. Pilih event, tentukan anggota yang akan didaftarkan, dan selesaikan proses pembayaran kolektif.</p>` },
    { slug: 'manajemen-peserta', title: 'Manajemen Peserta dan Bantalan', excerpt: 'Mengatur penempatan peserta ke bantalan kualifikasi.', icon: 'ph:table-bold', category: 'event', readTime: '6 menit', toc: [{ id: 'lihat-peserta', level: 2, text: 'Melihat Daftar Peserta' }, { id: 'atur-bantalan', level: 2, text: 'Atur Penempatan Bantalan' }], content: `<h2 id="lihat-peserta">Melihat Daftar Peserta</h2><p>Panitia dapat melihat seluruh peserta terdaftar di setiap kategori melalui dashboard event. Status pendaftaran (lunas/belum) juga ditampilkan di sini.</p><h2 id="atur-bantalan">Atur Penempatan Bantalan</h2><p>Masuk ke menu <strong>Sesi Kualifikasi</strong> pada event Anda. Klik <strong>Auto-Assign</strong> untuk penempatan otomatis atau atur secara manual dengan drag-and-drop nama peserta ke setiap nomor bantalan.</p>` },
    { slug: 'pengelolaan-klub', title: 'Pengelolaan Anggota Klub', excerpt: 'Undang, terima, dan kelola anggota di klub Anda.', icon: 'ph:users-bold', category: 'event', readTime: '5 menit', toc: [{ id: 'undang-anggota', level: 2, text: 'Undang Anggota' }, { id: 'terima-permohonan', level: 2, text: 'Terima Permohonan' }], content: `<h2 id="undang-anggota">Undang Anggota</h2><p>Admin klub dapat mengundang pemanah dengan memasukkan nama atau email mereka di menu <strong>Undang Anggota</strong> pada dashboard klub. Pemanah yang diundang akan menerima notifikasi dan dapat menerima atau menolak undangan.</p><h2 id="terima-permohonan">Terima Permohonan</h2><p>Pemanah yang menekan tombol "Gabung Klub" dari halaman profil publik klub Anda akan masuk ke antrian permohonan. Admin meninjau dan menerima/menolak permohonan dari dashboard <strong>Manajemen Anggota</strong>.</p>` },
    { slug: 'cara-berlangganan', title: 'Cara Berlangganan dan Pembayaran', excerpt: 'Panduan memilih paket dan metode pembayaran.', icon: 'ph:credit-card-bold', category: 'subscription', readTime: '4 menit', toc: [{ id: 'pilih-paket', level: 2, text: 'Pilih Paket' }, { id: 'metode-bayar', level: 2, text: 'Metode Pembayaran' }], content: `<h2 id="pilih-paket">Pilih Paket</h2><p>Kunjungi <a href="/subscription" class="text-primary font-semibold">halaman berlangganan</a> untuk melihat semua pilihan paket. Klik <strong>Pilih Paket</strong> pada tier yang diinginkan untuk memulai proses pembayaran.</p><h2 id="metode-bayar">Metode Pembayaran</h2><p>Archeryhub.id mendukung berbagai metode pembayaran melalui Tripay: Transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (GoPay, OVO, DANA), dan QRIS. Pembayaran diproses secara otomatis dan status akan terupdate dalam hitungan menit.</p>` },
    { slug: 'fitur-premium', title: 'Fitur Eksklusif Paket Premium', excerpt: 'Daftar fitur yang hanya tersedia untuk akun premium.', icon: 'ph:star-bold', category: 'subscription', readTime: '4 menit', toc: [{ id: 'fitur-list', level: 2, text: 'Daftar Fitur Premium' }], content: `<h2 id="fitur-list">Daftar Fitur Premium</h2><ul><li>Buat dan publikasikan event tanpa batas</li><li>Kelola anggota klub tanpa batas</li><li>Undang pemanah langsung via email</li><li>Akses sistem bracket eliminasi</li><li>Manajemen scorekeeper/wasit</li><li>Ekspor data peserta ke CSV/PDF</li><li>Laporan keuangan pendaftaran</li><li>Prioritas antrian dukungan teknis</li></ul>` },
    { slug: 'addon-langganan', title: 'Add-on dan Perluasan Paket', excerpt: 'Cara menambahkan kapasitas tambahan pada paket.', icon: 'ph:plus-circle-bold', category: 'subscription', readTime: '3 menit', toc: [{ id: 'apa-itu-addon', level: 2, text: 'Apa itu Add-on?' }], content: `<h2 id="apa-itu-addon">Apa itu Add-on?</h2><p>Add-on adalah perluasan kapasitas atau layanan tambahan yang dapat ditambahkan ke paket aktif Anda. Contoh: tambahan slot event, kapasitas anggota ekstra, atau akses fitur khusus untuk satu turnamen tertentu. Hubungi tim kami untuk informasi add-on yang tersedia.</p>` },
    { slug: 'scorekeeper', title: 'Manajemen Scorekeeper', excerpt: 'Cara menambah dan mengelola akun wasit/scorekeeper.', icon: 'ph:identification-badge-bold', category: 'scoring', readTime: '3 menit', toc: [{ id: 'buat-scorekeeper', level: 2, text: 'Membuat Akun Scorekeeper' }], content: `<h2 id="buat-scorekeeper">Membuat Akun Scorekeeper</h2><p>Panitia organisasi dengan paket premium dapat membuat akun scorekeeper melalui <strong>Dashboard &rarr; Scorekeeper &rarr; Tambah Baru</strong>. Isi nama dan credentials untuk wasit tersebut. Akun scorekeeper hanya memiliki akses untuk input skor, tanpa hak kelola event.</p>` },
    { slug: 'kategori-lomba', title: 'Kategori dan Divisi Lomba', excerpt: 'Divisi usia, jenis kelamin, dan jenis busur dalam kompetisi.', icon: 'ph:list-numbers-bold', category: 'archery', readTime: '5 menit', toc: [{ id: 'divisi-busur', level: 2, text: 'Divisi Busur' }, { id: 'divisi-usia', level: 2, text: 'Kelompok Usia' }], content: `<h2 id="divisi-busur">Divisi Busur</h2><p>Kompetisi panahan umumnya dibagi berdasarkan jenis busur: Recurve, Compound, Barebow, dan Tradisional. Setiap divisi bertanding secara terpisah dan memiliki jarak tembak yang berbeda.</p><h2 id="divisi-usia">Kelompok Usia</h2><p>Perlombaan umumnya terbagi atas kelompok usia: U-12, U-15, U-18, Junior (U-21), Open/Senior, dan Master (40+). Pengelompokan ini disesuaikan dengan regulasi World Archery dan PERPANI.</p>` },
    { slug: 'jarak-dan-target', title: 'Jarak Tembak dan Format Target', excerpt: 'Standar jarak tembak dan ukuran target panahan.', icon: 'ph:ruler-bold', category: 'archery', readTime: '4 menit', toc: [{ id: 'jarak-outdoor', level: 2, text: 'Outdoor' }, { id: 'jarak-indoor', level: 2, text: 'Indoor' }], content: `<h2 id="jarak-outdoor">Outdoor (FITA/WA)</h2><p>Standar internasional untuk outdoor: <strong>70 meter</strong> untuk Recurve senior, <strong>50 meter</strong> untuk Compound, dan bervariasi untuk kelompok usia lebih muda. Target berukuran 122cm digunakan untuk 70m.</p><h2 id="jarak-indoor">Indoor</h2><p>Standar indoor: <strong>18 meter</strong> dengan target 40cm atau 60cm. Format indoor biasanya menggunakan sistema 3-spot atau 1-spot target face.</p>` },
    { slug: 'istilah-panahan', title: 'Kamus Istilah Panahan', excerpt: 'Glosarium lengkap istilah teknis panahan dari A-Z.', icon: 'ph:book-bold', category: 'archery', readTime: '8 menit', toc: [{ id: 'istilah-a', level: 2, text: 'A–E' }, { id: 'istilah-f', level: 2, text: 'F–N' }, { id: 'istilah-o', level: 2, text: 'O–Z' }], content: `<h2 id="istilah-a">A–E</h2><ul><li><strong>Arrow (Anak Panah):</strong> Proyektil yang ditembakkan dari busur.</li><li><strong>Armguard:</strong> Pelindung lengan untuk mencegah lecetan saat melepas anak panah.</li><li><strong>Barebow:</strong> Gaya memanah tanpa aksesori like sight atau stabilizer.</li><li><strong>Clicker:</strong> Alat kecil yang dipasang di riser untuk membantu konsistensi draw length.</li><li><strong>Draw:</strong> Proses menarik tali busur ke posisi full draw.</li><li><strong>End:</strong> Satu ronde tembakan, biasanya 3 atau 6 anak panah.</li></ul><h2 id="istilah-f">F–N</h2><ul><li><strong>Fletching:</strong> Sirip di bagian belakang anak panah untuk stabilisasi terbang.</li><li><strong>Grip:</strong> Bagian pegangan busur.</li><li><strong>Limb:</strong> Bagian atas dan bawah busur yang melengkung dan menyimpan energi.</li><li><strong>Nock:</strong> Ujung belakang anak panah yang mengait ke tali busur.</li></ul><h2 id="istilah-o">O–Z</h2><ul><li><strong>Riser:</strong> Bagian tengah busur tempat grip dan aksesori terpasang.</li><li><strong>Sight:</strong> Alat bantu bidik yang dipasang di riser (tidak diperbolehkan di barebow).</li><li><strong>Stabilizer:</strong> Batang penstabil yang dipasang di riser untuk mengurangi getaran.</li><li><strong>X10:</strong> Nilai sempurna yang mengenai titik terkecil di pusat target, dicatat sebagai tiebreaker.</li></ul>` },
]

const currentDoc = computed(() => docs.find(d => d.slug === currentSlug.value))

const currentIndex = computed(() => docs.findIndex(d => d.slug === currentSlug.value))
const prevDoc = computed(() => currentIndex.value > 0 ? docs[currentIndex.value - 1] : null)
const nextDoc = computed(() => currentIndex.value < docs.length - 1 ? docs[currentIndex.value + 1] : null)

const filteredSidebarDocs = (categoryId) => {
    return docs.filter(d => {
        const matchCat = d.category === categoryId
        const matchSearch = sidebarSearch.value === '' ||
            d.title.toLowerCase().includes(sidebarSearch.value.toLowerCase())
        return matchCat && matchSearch
    })
}

useHead(computed(() => ({
    title: currentDoc.value ? `${currentDoc.value.title} - Dokumentasi Archeryhub.id` : 'Dokumentasi - Archeryhub.id',
    meta: [{ name: 'description', content: currentDoc.value?.excerpt || '' }]
})))
</script>

<style>
.doc-content h2 {
    font-size: 1.35rem;
    font-weight: 900;
    color: #0f172a;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f1f5f9;
    scroll-margin-top: 7rem;
}

.doc-content p {
    color: #4b5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.doc-content ul,
.doc-content ol {
    margin: 0.75rem 0 1.25rem 1.25rem;
    color: #4b5563;
    font-size: 0.95rem;
    line-height: 1.8;
}

.doc-content ul {
    list-style-type: disc;
    padding-left: 1rem;
}

.doc-content ol {
    list-style-type: decimal;
    padding-left: 1rem;
}

.doc-content li {
    margin-bottom: 0.4rem;
}

.doc-content strong {
    color: #0f172a;
    font-weight: 700;
}

.doc-content a {
    color: #b7fb23;
    text-decoration: underline;
}

.doc-content a:hover {
    opacity: 0.8;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-styled::-webkit-scrollbar {
    width: 4px;
}

.scrollbar-styled::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-styled::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>
