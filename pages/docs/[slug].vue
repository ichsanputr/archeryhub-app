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
                class="hidden lg:flex flex-col w-56 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] overflow-y-auto pl-4 scrollbar-styled self-start">
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
                slug: 'peran-pengguna', title: 'Peran Pengguna di Platform', excerpt: 'Panduan lengkap peran akun, hak akses, dan alur kerja tiap tipe pengguna di Archeryhub.id.', icon: 'ph:users-three-bold', category: 'platform', readTime: '8 menit',
                toc: [
                        { id: 'tipe-akun', level: 2, text: 'Tipe Akun di Archeryhub.id' },
                        { id: 'pemanah', level: 2, text: 'Peran Pemanah' },
                        { id: 'klub', level: 2, text: 'Peran Klub' },
                        { id: 'organisasi', level: 2, text: 'Peran Organisasi' },
                        { id: 'penjual', level: 2, text: 'Peran Penjual' },
                        { id: 'perbandingan', level: 2, text: 'Perbandingan Hak Akses' },
                        { id: 'pilih-peran', level: 2, text: 'Bagaimana Memilih Peran yang Tepat?' },
                ],
                content: `
                    <h2 id="tipe-akun">Tipe Akun di Archeryhub.id</h2>
                    <p>Archeryhub.id dirancang untuk melayani satu ekosistem panahan yang lengkap. Karena kebutuhan pengguna berbeda-beda, sistem menyediakan empat tipe akun utama: <strong>Pemanah</strong>, <strong>Klub</strong>, <strong>Organisasi</strong>, dan <strong>Penjual</strong>. Masing-masing peran memiliki dashboard, menu, serta kewenangan yang disesuaikan dengan tugasnya.</p>
                    <p>Memilih tipe akun yang tepat sejak awal akan membuat alur kerja Anda lebih efisien, mulai dari pendaftaran event, manajemen anggota, penyelenggaraan turnamen, hingga penjualan produk panahan.</p>

                    <h2 id="pemanah">Peran Pemanah</h2>
                    <p>Akun <strong>Pemanah</strong> ditujukan untuk atlet individu, baik pemula maupun kompetitor aktif. Fokus utama akun ini adalah perkembangan profil atlet dan partisipasi event.</p>
                    <p><strong>Fitur utama untuk Pemanah:</strong></p>
                    <ul>
                        <li>Membuat profil atlet publik (nama, domisili, jenis busur, bio singkat).</li>
                        <li>Mendaftar event/turnamen dan memantau status pendaftaran.</li>
                        <li>Melihat hasil kualifikasi, ranking, dan bracket eliminasi event yang diikuti.</li>
                        <li>Menerima undangan klub atau mengajukan permohonan bergabung ke klub.</li>
                        <li>Mengelola riwayat partisipasi dan prestasi dari event yang tercatat.</li>
                    </ul>
                    <p><strong>Cocok untuk:</strong> atlet individu, pelajar yang mulai ikut lomba, pemanah komunitas, dan peserta event terbuka.</p>

                    <h2 id="klub">Peran Klub</h2>
                    <p>Akun <strong>Klub</strong> ditujukan untuk pengurus klub panahan yang ingin mengelola anggota dan aktivitas klub secara terstruktur. Pada peran ini, Anda memiliki halaman profil klub publik dan dashboard manajemen internal.</p>
                    <p><strong>Fitur utama untuk Klub:</strong></p>
                    <ul>
                        <li>Mengelola profil klub: logo, deskripsi, jadwal latihan, lokasi, dan kontak.</li>
                        <li>Mengundang pemanah menjadi anggota klub atau meninjau permohonan gabung.</li>
                        <li>Mengelola status keanggotaan (pending, aktif, ditolak) sesuai kebutuhan administrasi.</li>
                        <li>Menyusun formulir pendaftaran anggota dari dashboard <strong>Form Pendaftaran</strong>.</li>
                        <li>Memonitor anggota aktif untuk kebutuhan pembinaan dan pendaftaran event kolektif.</li>
                    </ul>
                    <p><strong>Cocok untuk:</strong> komunitas panahan lokal, sekolah panahan, atau klub yang sedang menata data anggota secara digital.</p>

                    <h2 id="organisasi">Peran Organisasi</h2>
                    <p>Akun <strong>Organisasi</strong> ditujukan untuk penyelenggara event, asosiasi, atau panitia turnamen. Ini adalah peran dengan fokus tertinggi pada operasional kompetisi dan manajemen pertandingan.</p>
                    <p><strong>Fitur utama untuk Organisasi:</strong></p>
                    <ul>
                        <li>Membuat dan mempublikasikan event lengkap dengan kategori dan jadwal.</li>
                        <li>Mengelola peserta, verifikasi pendaftaran, dan kontrol status pembayaran.</li>
                        <li>Membentuk sesi kualifikasi, assignment target, serta alur scoring.</li>
                        <li>Mengelola scorekeeper untuk input skor lapangan secara real-time.</li>
                        <li>Menampilkan hasil pertandingan (kualifikasi/eliminasi) secara publik.</li>
                    </ul>
                    <p><strong>Catatan:</strong> beberapa fitur lanjutan organisasi membutuhkan paket berlangganan aktif sesuai ketentuan platform.</p>
                    <p><strong>Cocok untuk:</strong> panitia kejuaraan, pengurus daerah/cabang, EO olahraga panahan, dan lembaga pembina kompetisi.</p>

                    <h2 id="penjual">Peran Penjual</h2>
                    <p>Akun <strong>Penjual</strong> ditujukan untuk toko atau individu yang menjual perlengkapan panahan. Peran ini dipisahkan agar manajemen produk dan transaksi dapat berjalan fokus tanpa bercampur dengan fitur kompetisi.</p>
                    <p><strong>Fitur utama untuk Penjual:</strong></p>
                    <ul>
                        <li>Membuat etalase produk panahan (busur, anak panah, aksesori, apparel).</li>
                        <li>Mengelola stok, harga, variasi produk, dan media foto produk.</li>
                        <li>Memproses order dan memantau status transaksi dari dashboard penjual.</li>
                        <li>Membangun reputasi toko melalui kelengkapan informasi dan konsistensi layanan.</li>
                    </ul>
                    <p><strong>Cocok untuk:</strong> pemilik toko panahan, reseller perlengkapan, distributor lokal, dan merchant komunitas.</p>

                    <h2 id="perbandingan">Perbandingan Hak Akses</h2>
                    <div class="not-prose overflow-x-auto my-4">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr class="bg-navy text-left">
                                    <th class="text-primary font-bold px-4 py-3 rounded-tl-xl">Fitur</th>
                                    <th class="text-white font-bold px-4 py-3">Pemanah</th>
                                    <th class="text-white font-bold px-4 py-3">Klub</th>
                                    <th class="text-white font-bold px-4 py-3">Organisasi</th>
                                    <th class="text-white font-bold px-4 py-3 rounded-tr-xl">Penjual</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Profil Publik</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td></tr>
                                <tr class="bg-gray-50"><td class="px-4 py-3 text-gray-700 font-medium">Daftar Event</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-400">Tidak</td></tr>
                                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Kelola Anggota Klub</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-400">Tidak</td></tr>
                                <tr class="bg-gray-50"><td class="px-4 py-3 text-gray-700 font-medium">Buat Event</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-green-600 font-bold">Ya (sesuai paket)</td><td class="px-4 py-3 text-gray-400">Tidak</td></tr>
                                <tr class="bg-white"><td class="px-4 py-3 text-gray-700 font-medium">Kelola Scoring</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td><td class="px-4 py-3 text-gray-400">Tidak</td></tr>
                                <tr class="bg-gray-50"><td class="px-4 py-3 text-gray-700 font-medium">Jual Produk</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-gray-400">Tidak</td><td class="px-4 py-3 text-green-600 font-bold">Ya</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 id="pilih-peran">Bagaimana Memilih Peran yang Tepat?</h2>
                    <p>Gunakan panduan cepat berikut:</p>
                    <ul>
                        <li>Jika Anda ingin <strong>ikut lomba sebagai atlet</strong>, pilih <strong>Pemanah</strong>.</li>
                        <li>Jika Anda mengurus <strong>komunitas/klub dan anggota</strong>, pilih <strong>Klub</strong>.</li>
                        <li>Jika Anda menjadi <strong>panitia/penyelenggara turnamen</strong>, pilih <strong>Organisasi</strong>.</li>
                        <li>Jika fokus Anda <strong>menjual peralatan panahan</strong>, pilih <strong>Penjual</strong>.</li>
                    </ul>
                    <p>Apabila kebutuhan Anda berkembang, Anda bisa membuat akun lain dengan tipe berbeda menggunakan email terpisah agar struktur operasional tetap rapi dan tidak mencampur fungsi bisnis.</p>
                `
        },
        {
                slug: 'manajemen-profil', title: 'Manajemen Profil & Pengaturan', excerpt: 'Panduan lengkap mengelola profil, media, keamanan akun, dan visibilitas halaman publik sesuai alur aplikasi Archeryhub.id.', icon: 'ph:gear-six-bold', category: 'platform', readTime: '9 menit',
                toc: [
                        { id: 'gambaran-umum', level: 2, text: 'Gambaran Umum Manajemen Profil' },
                        { id: 'alur-per-role', level: 2, text: 'Alur Halaman Berdasarkan Role' },
                        { id: 'data-profil', level: 2, text: 'Kelola Data Profil Utama' },
                        { id: 'media-profil', level: 2, text: 'Avatar, Logo, dan Banner' },
                        { id: 'keamanan', level: 2, text: 'Keamanan Akun (Password & Login)' },
                        { id: 'email-otp', level: 2, text: 'Ubah Email dengan Verifikasi OTP' },
                        { id: 'theme-settings', level: 2, text: 'Tema Dashboard & User Settings' },
                        { id: 'visibilitas', level: 2, text: 'Visibilitas Halaman Publik' },
                        { id: 'praktik-baik', level: 2, text: 'Praktik Baik & Troubleshooting' },
                ],
                content: `
                    <h2 id="gambaran-umum">Gambaran Umum Manajemen Profil</h2>
                    <p>Di Archeryhub.id, manajemen profil tidak hanya tentang mengganti nama dan foto. Sistem memisahkan antara <strong>profil publik</strong> (yang dilihat pengunjung), <strong>keamanan akun</strong> (password, email, metode login), dan <strong>preferensi dashboard</strong> (tema/pengaturan tampilan).</p>
                    <p>Secara teknis, fitur ini menggunakan kombinasi endpoint seperti <code>/user/profile</code>, <code>/user/password</code>, <code>/user/request-email-change</code>, <code>/user/verify-email-change</code>, serta endpoint role-specific seperti <code>/clubs/me</code> dan <code>/organizations/me</code>.</p>

                    <h2 id="alur-per-role">Alur Halaman Berdasarkan Role</h2>
                    <p>Alur edit profil pada aplikasi saat ini berbeda tergantung tipe akun:</p>
                    <ul>
                        <li><strong>Pemanah:</strong> fokus pada <code>/dashboard/archer/profile</code> untuk data atlet, bio, prestasi, gear, dan media sosial.</li>
                        <li><strong>Klub:</strong> fokus pada <code>/dashboard/club/profile</code> untuk identitas klub, fasilitas, jadwal latihan, sosial media, dan pengaturan visibilitas publik.</li>
                        <li><strong>Organisasi:</strong> fokus pada <code>/dashboard/organization/profile</code> untuk identitas organisasi, visi-misi, sejarah, FAQ, kontak, dan visibilitas halaman.</li>
                        <li><strong>Seller:</strong> pengaturan keamanan akun tersedia di settings, sementara data profil toko mengikuti endpoint seller/profile sesuai implementasi backend.</li>
                    </ul>
                    <p>Untuk keamanan akun (email, password, login method), halaman settings lintas role memakai pola yang konsisten.</p>

                    <h2 id="data-profil">Kelola Data Profil Utama</h2>
                    <p>Pembaruan data inti dilakukan lewat endpoint sesuai konteks role:</p>
                    <ul>
                        <li><code>PUT /user/profile</code> untuk update profil pengguna umum (termasuk archer) seperti <code>full_name</code>, <code>username</code>, <code>phone</code>, <code>city</code>, <code>school</code>, <code>bow_type</code>, <code>bio</code>, hingga data sosial tertentu.</li>
                        <li><code>PUT /clubs/me</code> untuk update profil klub: nama, slug, deskripsi, lokasi, kontak, fasilitas, jadwal, social media, dan konfigurasi halaman.</li>
                        <li><code>PUT /organizations/me</code> untuk update profil organisasi: nama/slg, deskripsi, alamat, website, social media, visi, misi, sejarah, dan FAQ.</li>
                    </ul>
                    <p>Penting: beberapa role memiliki field berbeda di database (contoh, klub/organisasi memakai <code>name</code>, seller memakai <code>store_name</code>, archer memakai <code>full_name</code>).</p>

                    <h2 id="media-profil">Avatar, Logo, dan Banner</h2>
                    <p>Upload media profil biasanya melalui Media Library di dashboard, lalu URL media dikirim saat simpan profil.</p>
                    <ul>
                        <li>Frontend mengirim nilai <code>avatar_url</code>, <code>logo_url</code>, atau <code>banner_url</code> sesuai role.</li>
                        <li>Backend menormalisasi path dengan menyimpan <strong>nama file</strong> (menggunakan ekstraksi filename), bukan URL penuh.</li>
                        <li>Saat ditampilkan lagi, URL media dimasking/generate ulang oleh backend agar konsisten dengan domain API aktif.</li>
                    </ul>
                    <p>Karena itu, saat berpindah environment (local/prod), URL yang tampil dapat mengikuti konfigurasi API environment tersebut.</p>

                    <h2 id="keamanan">Keamanan Akun (Password & Login)</h2>
                    <p>Di halaman settings (tab Keamanan), pengguna dapat:</p>
                    <ul>
                        <li>Melihat status apakah akun sudah punya password atau masih Google-only.</li>
                        <li>Setel/ganti password melalui <code>PUT /user/password</code>.</li>
                        <li>Menghubungkan akun Google jika belum terhubung.</li>
                    </ul>
                    <p>Validasi minimum password di backend adalah 6 karakter. Setelah berhasil, status <code>has_password</code> akan aktif.</p>

                    <h2 id="email-otp">Ubah Email dengan Verifikasi OTP</h2>
                    <p>Perubahan email memakai alur OTP dua tahap agar aman:</p>
                    <ol>
                        <li>Kirim permintaan ke <code>POST /user/request-email-change</code> dengan email baru.</li>
                        <li>Sistem mengecek email baru tidak bentrok dengan akun di tabel user lain (archers, organizations, clubs, sellers).</li>
                        <li>Backend membuat OTP, menyimpan ke tabel OTP email dengan masa berlaku (expired), lalu kirim ke email baru.</li>
                        <li>Verifikasi OTP lewat <code>POST /user/verify-email-change</code> untuk finalisasi pergantian email.</li>
                    </ol>
                    <p>Jika OTP salah/expired, perubahan tidak diproses dan email akun tetap aman di nilai sebelumnya.</p>

                    <h2 id="theme-settings">Tema Dashboard & User Settings</h2>
                    <p>Backend menyediakan endpoint <code>GET/PUT /user/settings</code> untuk menyimpan <code>dashboard_theme</code> per user di tabel <code>user_settings</code>.</p>
                    <p>Di sisi frontend, beberapa halaman settings sudah menampilkan UI pemilihan tema. Pada implementasi tertentu, penyimpanan bisa melalui composable tema atau masih bertahap menuju endpoint user settings. Prinsipnya, tema dashboard diperlakukan sebagai preferensi personal user.</p>

                    <h2 id="visibilitas">Visibilitas Halaman Publik</h2>
                    <p>Untuk akun Klub dan Organisasi, visibilitas section publik dikelola lewat <code>page_settings</code> (JSON) yang menentukan blok mana yang tampil di halaman publik.</p>
                    <ul>
                        <li><strong>Klub:</strong> dapat mengatur section identitas, kontak/sosmed, fasilitas, jadwal, dan konfigurasi tambahan seperti <code>registration_config</code>.</li>
                        <li><strong>Organisasi:</strong> dapat mengatur section identitas, kontak, about (visi/misi/sejarah), dan FAQ.</li>
                    </ul>
                    <p>Model ini memberi fleksibilitas: data tetap tersimpan, tetapi tampil/sembunyi bisa diatur tanpa menghapus konten.</p>

                    <h2 id="praktik-baik">Praktik Baik & Troubleshooting</h2>
                    <ul>
                        <li>Isi slug dengan konsisten karena slug dipakai untuk URL publik.</li>
                        <li>Gunakan gambar profil/banner yang jelas dan proporsional agar halaman publik terlihat profesional.</li>
                        <li>Simpan perubahan bertahap per section agar mudah melacak jika ada input yang tidak valid.</li>
                        <li>Jika data tampak tidak berubah, cek response API dan pastikan Anda mengedit halaman sesuai role akun.</li>
                        <li>Jika email tidak berubah, cek kembali OTP dan masa berlakunya.</li>
                    </ul>
                    <p>Dengan alur ini, profil Anda tidak hanya rapi di dashboard, tetapi juga siap dipublikasikan dan dipakai untuk kebutuhan event, kolaborasi klub, serta identitas resmi di ekosistem Archeryhub.id.</p>
                `
        },
        {
                slug: 'dashboard-pemanah', title: 'Dashboard Pemanah', excerpt: 'Panduan fitur utama dashboard pemanah: profil, riwayat event, prestasi, dan pengaturan akun.', icon: 'ph:user-circle-bold', category: 'platform', readTime: '7 menit',
                toc: [
                        { id: 'ringkasan', level: 2, text: 'Ringkasan Dashboard Pemanah' },
                        { id: 'profil-pemanah', level: 2, text: 'Profil Pemanah' },
                        { id: 'prestasi-dan-gear', level: 2, text: 'Prestasi dan Gear' },
                        { id: 'riwayat-event', level: 2, text: 'Riwayat Event' },
                        { id: 'pengaturan-akun', level: 2, text: 'Pengaturan Akun' },
                ],
                content: `
                    <h2 id="ringkasan">Ringkasan Dashboard Pemanah</h2>
                    <p>Dashboard pemanah dirancang sebagai pusat kendali atlet individu. Di sini Anda dapat mengelola profil publik, mengatur data pribadi untuk kebutuhan pendaftaran event, dan memperbarui informasi performa.</p>
                    <h2 id="profil-pemanah">Profil Pemanah</h2>
                    <p>Pada modul profil, Anda dapat memperbarui data seperti nama lengkap, username, tanggal lahir, gender, kota, sekolah, tipe busur, alamat, avatar, dan banner profil. Data ini disimpan melalui endpoint <code>PUT /user/profile</code>.</p>
                    <h2 id="prestasi-dan-gear">Prestasi dan Gear</h2>
                    <p>Dashboard juga menyediakan area untuk bio, daftar prestasi, dan perlengkapan panahan. Daftar prestasi bisa ditulis sebagai list dan dapat di-highlight agar tampil menonjol di profil publik.</p>
                    <h2 id="riwayat-event">Riwayat Event</h2>
                    <p>Riwayat event pemanah ditampilkan dari data partisipasi event Anda. Ini memudahkan evaluasi performa serta validasi rekam jejak saat mendaftar kompetisi berikutnya.</p>
                    <h2 id="pengaturan-akun">Pengaturan Akun</h2>
                    <p>Untuk keamanan akun, gunakan halaman settings untuk mengganti password, verifikasi perubahan email melalui OTP, dan melihat status metode login (Google/email-password).</p>
                `
        },
        {
                slug: 'fitur-klub', title: 'Fitur untuk Akun Klub', excerpt: 'Dokumentasi lengkap fitur akun klub: profil, anggota, pendaftaran klub, dan visibilitas halaman publik.', icon: 'ph:users-three-bold', category: 'platform', readTime: '8 menit',
                toc: [
                        { id: 'gambaran-klub', level: 2, text: 'Gambaran Akun Klub' },
                        { id: 'profil-klub', level: 2, text: 'Profil Klub dan Branding' },
                        { id: 'manajemen-anggota', level: 2, text: 'Manajemen Anggota Klub' },
                        { id: 'form-pendaftaran-klub', level: 2, text: 'Form Pendaftaran Anggota' },
                        { id: 'halaman-publik-klub', level: 2, text: 'Halaman Publik Klub' },
                ],
                content: `
                    <h2 id="gambaran-klub">Gambaran Akun Klub</h2>
                    <p>Akun klub ditujukan untuk pengurus komunitas/pelatihan panahan yang ingin mengelola identitas klub dan keanggotaan secara digital.</p>
                    <h2 id="profil-klub">Profil Klub dan Branding</h2>
                    <p>Di dashboard klub, Anda dapat mengelola nama klub, slug URL, deskripsi, logo, banner, kota/provinsi, fasilitas, jadwal latihan, dan media sosial. Penyimpanan profil dilakukan lewat <code>PUT /clubs/me</code>.</p>
                    <h2 id="manajemen-anggota">Manajemen Anggota Klub</h2>
                    <p>Fitur klub mencakup penerimaan/penolakan permohonan anggota, undangan pemanah, catatan anggota, serta status member aktif/pending sesuai kebijakan klub.</p>
                    <h2 id="form-pendaftaran-klub">Form Pendaftaran Anggota</h2>
                    <p>Klub dapat membuat formulir pendaftaran dinamis dari dashboard Form Pendaftaran. Form ini dipublikasikan untuk pendaftaran publik melalui halaman <code>/clubs/:slug/daftar</code>.</p>
                    <h2 id="halaman-publik-klub">Halaman Publik Klub</h2>
                    <p>Halaman publik klub menampilkan identitas, info kontak, jadwal/fasilitas, serta data anggota sesuai pengaturan <code>page_settings</code>. Anda dapat menyalakan/mematikan section tanpa menghapus datanya.</p>
                `
        },
        {
                slug: 'modul-news', title: 'Modul News & Publikasi', excerpt: 'Cara kerja modul berita: membuat, mengelola, dan menampilkan publikasi untuk komunitas panahan.', icon: 'ph:newspaper-clipping-bold', category: 'platform', readTime: '6 menit',
                toc: [
                        { id: 'fungsi-news', level: 2, text: 'Fungsi Modul News' },
                        { id: 'jenis-konten', level: 2, text: 'Jenis Konten yang Cocok' },
                        { id: 'alur-publikasi', level: 2, text: 'Alur Publikasi Konten' },
                        { id: 'tips-news', level: 2, text: 'Tips Konten yang Efektif' },
                ],
                content: `
                    <h2 id="fungsi-news">Fungsi Modul News</h2>
                    <p>Modul News digunakan untuk menyampaikan informasi resmi kepada komunitas: pengumuman event, update hasil, prestasi atlet, agenda latihan, hingga edukasi panahan.</p>
                    <h2 id="jenis-konten">Jenis Konten yang Cocok</h2>
                    <ul>
                        <li>Pengumuman pembukaan pendaftaran event.</li>
                        <li>Rangkuman hasil pertandingan dan dokumentasi.</li>
                        <li>Prestasi atlet/klub/organisasi.</li>
                        <li>Informasi jadwal latihan atau agenda komunitas.</li>
                    </ul>
                    <h2 id="alur-publikasi">Alur Publikasi Konten</h2>
                    <p>Siapkan judul yang jelas, isi ringkas, gambar pendukung, lalu publish dari dashboard role Anda. Konten yang sudah publish akan muncul di halaman berita publik dan dapat diakses pengunjung.</p>
                    <h2 id="tips-news">Tips Konten yang Efektif</h2>
                    <ul>
                        <li>Gunakan judul spesifik (siapa, kapan, di mana).</li>
                        <li>Tambahkan gambar berkualitas agar engagement lebih tinggi.</li>
                        <li>Tulis call-to-action bila ingin pembaca lanjut ke halaman event.</li>
                    </ul>
                `
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
                slug: 'paket-berlangganan', title: 'Paket Berlangganan Archeryhub.id', excerpt: 'Perbandingan paket Gratis, Starter, dan Pro lengkap dengan use case tiap tipe akun.', icon: 'ph:crown-bold', category: 'subscription', readTime: '7 menit',
                toc: [{ id: 'paket-gratis', level: 2, text: 'Paket Gratis' }, { id: 'paket-starter', level: 2, text: 'Paket Starter' }, { id: 'paket-pro', level: 2, text: 'Paket Pro' }, { id: 'siapa-pakai-apa', level: 2, text: 'Rekomendasi Paket per Role' }, { id: 'faq-langganan', level: 2, text: 'FAQ Langganan' }],
                content: `
                    <h2 id="paket-gratis">Paket Gratis</h2>
                    <p>Paket Gratis cocok untuk eksplorasi awal platform. Anda bisa membuat profil publik dan menggunakan fitur dasar tanpa biaya.</p>
                    <ul><li>Profil publik aktif</li><li>Akses informasi event</li><li>Partisipasi dasar sesuai role</li></ul>
                    <h2 id="paket-starter">Paket Starter</h2>
                    <p>Starter cocok untuk klub/organisasi yang mulai menata operasional secara digital, termasuk pengelolaan event dasar dan data anggota dalam skala menengah.</p>
                    <ul><li>Manajemen operasional inti</li><li>Dukungan fitur event lebih lengkap</li><li>Akses awal modul scoring</li></ul>
                    <h2 id="paket-pro">Paket Pro</h2>
                    <p>Pro ditujukan untuk kebutuhan kompetisi yang lebih intensif: event besar, volume peserta tinggi, workflow scorekeeper, dan laporan yang lebih lengkap.</p>
                    <ul><li>Fitur lanjutan event dan scoring</li><li>Kapasitas lebih besar</li><li>Prioritas dukungan teknis</li></ul>
                    <h2 id="siapa-pakai-apa">Rekomendasi Paket per Role</h2>
                    <ul>
                        <li><strong>Klub kecil:</strong> mulai dari Starter saat anggota mulai bertambah.</li>
                        <li><strong>Organisasi penyelenggara rutin:</strong> Pro untuk stabilitas operasional event.</li>
                        <li><strong>Akun baru:</strong> gunakan Gratis untuk evaluasi kebutuhan terlebih dahulu.</li>
                    </ul>
                    <h2 id="faq-langganan">FAQ Langganan</h2>
                    <p><strong>Jika paket habis?</strong> Fitur premium akan dibatasi sesuai kebijakan, namun data utama tetap tersimpan.</p>
                    <p><strong>Bisa upgrade kapan saja?</strong> Ya, upgrade dapat dilakukan kapan saja mengikuti mekanisme billing yang berlaku.</p>
                `
        },
        {
                slug: 'membuat-event', title: 'Membuat dan Mempublish Event', excerpt: 'Panduan lengkap merancang event dari draft, konfigurasi kategori, hingga rilis publik.', icon: 'ph:plus-square-bold', category: 'event', readTime: '9 menit',
                toc: [
                        { id: 'persyaratan', level: 2, text: 'Persyaratan' },
                        { id: 'siapkan-data', level: 2, text: 'Data yang Perlu Disiapkan' },
                        { id: 'langkah-membuat', level: 2, text: 'Langkah Membuat Event' },
                        { id: 'publish', level: 2, text: 'Mempublish Event' },
                        { id: 'checklist-pra-rilis', level: 2, text: 'Checklist Pra-Rilis' },
                ],
                content: `
                    <h2 id="persyaratan">Persyaratan</h2>
                    <p>Untuk membuat event, akun Anda harus bertipe <strong>Organisasi</strong> dan memiliki paket berlangganan aktif sesuai kebutuhan modul event yang akan digunakan.</p>
                    <h2 id="siapkan-data">Data yang Perlu Disiapkan</h2>
                    <ul>
                        <li>Nama event dan identitas penyelenggara.</li>
                        <li>Tanggal pelaksanaan, lokasi, dan PIC.</li>
                        <li>Kategori/divisi lomba yang dibuka.</li>
                        <li>Kuota peserta per kategori.</li>
                        <li>Skema pembayaran (gratis/berbayar) dan tenggat pendaftaran.</li>
                    </ul>
                    <h2 id="langkah-membuat">Langkah Membuat Event</h2>
                    <ol>
                        <li>Masuk ke <strong>Dashboard Organisasi -> Event -> Buat Event</strong>.</li>
                        <li>Isi informasi dasar event dan unggah banner.</li>
                        <li>Tambahkan kategori lomba, kuota, dan parameter teknis.</li>
                        <li>Konfigurasikan pendaftaran, biaya, serta jadwal penting.</li>
                        <li>Simpan sebagai draft, lalu review data bersama tim panitia.</li>
                    </ol>
                    <h2 id="publish">Mempublish Event</h2>
                    <p>Setelah validasi selesai, klik <strong>Publish</strong> agar event tampil di halaman publik. Selama periode pendaftaran masih berjalan, Anda tetap bisa melakukan koreksi konten non-kritis.</p>
                    <h2 id="checklist-pra-rilis">Checklist Pra-Rilis</h2>
                    <ul>
                        <li>Pastikan semua kategori memiliki kuota dan jadwal.</li>
                        <li>Periksa harga pendaftaran dan status pembayaran.</li>
                        <li>Cek ulang deskripsi event agar tidak menimbulkan interpretasi ganda.</li>
                        <li>Pastikan tim operasional sudah siap memantau pendaftaran masuk.</li>
                    </ul>
                `
        },
        {
                slug: 'sistem-scoring-kualifikasi', title: 'Sistem Scoring Kualifikasi', excerpt: 'Panduan operasional scoring kualifikasi dari setup sesi hingga validasi leaderboard.', icon: 'ph:chart-bar-bold', category: 'scoring', readTime: '7 menit',
                toc: [
                        { id: 'sesi-kualifikasi', level: 2, text: 'Sesi Kualifikasi' },
                        { id: 'penempatan-bantalan', level: 2, text: 'Penempatan Bantalan' },
                        { id: 'input-skor', level: 2, text: 'Input Skor' },
                        { id: 'validasi-skor', level: 2, text: 'Validasi Skor' },
                        { id: 'leaderboard', level: 2, text: 'Leaderboard' },
                ],
                content: `
                    <h2 id="sesi-kualifikasi">Sesi Kualifikasi</h2>
                    <p>Panitia dapat membuat satu atau lebih sesi kualifikasi dalam satu event. Tiap sesi dapat memiliki konfigurasi jumlah end dan jumlah anak panah per end yang berbeda.</p>
                    <h2 id="penempatan-bantalan">Penempatan Bantalan</h2>
                    <p>Penempatan peserta ke bantalan dapat dilakukan manual atau memakai <strong>Auto-Assign</strong> untuk distribusi yang lebih merata.</p>
                    <h2 id="input-skor">Input Skor</h2>
                    <p>Skor diinput melalui mobile scoring atau dashboard web. Nilai per panah (termasuk X/M jika digunakan) dihitung otomatis menjadi total, hit, dan indikator tie-break.</p>
                    <h2 id="validasi-skor">Validasi Skor</h2>
                    <ul>
                        <li>Pastikan jumlah panah terisi sesuai konfigurasi end.</li>
                        <li>Verifikasi tidak ada nilai ganda/terlewat sebelum submit.</li>
                        <li>Lakukan koreksi hanya oleh petugas berwenang agar jejak audit tetap konsisten.</li>
                    </ul>
                    <h2 id="leaderboard">Leaderboard</h2>
                    <p>Leaderboard diperbarui otomatis secara real-time. Urutan ranking mengikuti aturan skor total, lalu indikator tie-break sesuai format kompetisi.</p>
                `
        },
    {
        slug: 'sistem-eliminasi', title: 'Sistem Pertandingan Eliminasi', excerpt: 'Bracket eliminasi, mekanisme tie, dan additional end pada mode scoring pertandingan.', icon: 'ph:git-branch-bold', category: 'scoring', readTime: '8 menit',
        toc: [{ id: 'bracket', level: 2, text: 'Membuat Bracket' }, { id: 'generate-otomatis', level: 2, text: 'Generate Otomatis' }, { id: 'skor-set', level: 2, text: 'Sistem Skor Set' }, { id: 'tie-mechanism', level: 2, text: 'Mekanisme Tie (Seri)' }, { id: 'additional-end', level: 2, text: 'Additional End di Dashboard' }],
        content: `
          <h2 id="bracket">Membuat Bracket</h2>
          <p>Setelah kualifikasi selesai, panitia membuat bracket eliminasi per kategori/divisi. Penempatan peserta dapat dilakukan manual atau otomatis berdasarkan ranking.</p>
          <h2 id="generate-otomatis">Generate Otomatis</h2>
          <p>Mode generate otomatis menyusun seeding dari hasil kualifikasi. Sistem umumnya mendukung format 32/16/8/4 besar sesuai jumlah peserta lolos.</p>
          <h2 id="skor-set">Sistem Skor Set</h2>
          <p>Untuk recurve eliminasi, set system digunakan: pemenang set mendapat 2 poin, seri 1-1, kalah 0. Pemenang match ditentukan saat mencapai ambang poin set (umumnya 6).</p>
          <h2 id="tie-mechanism">Mekanisme Tie (Seri)</h2>
          <p>Jika skor match berakhir seri pada ambang akhir, pertandingan masuk ke mekanisme tie-break. Pada praktik lapangan, tie-break bisa berupa shoot-off / additional end sesuai konfigurasi dan regulasi event.</p>
          <p>Prinsip pentingnya: sistem harus mencatat hasil tie-break secara eksplisit agar winner bracket tidak ambigu dan histori scoring tetap audit-friendly.</p>
          <h2 id="additional-end">Additional End di Dashboard</h2>
          <p>Mode scoring eliminasi di dashboard mendukung skenario additional end. Contoh URL operasional:</p>
          <p><code>/dashboard/organization/events/seleksi-popda-kabsleman-2026-7247378c/elimination/BR-20260305-c26d543c?round=1&mode=scoring</code></p>
          <p>Pada kondisi tie, operator dapat menambah end penentu (additional end) dari layar scoring match tersebut, lalu menyimpan hasilnya agar bracket otomatis ter-update ke pemenang yang valid.</p>
        `
    },
        {
                slug: 'mobile-app-scoring', title: 'Scoring via Aplikasi Mobile', excerpt: 'Panduan lengkap wasit memakai mobile scoring dari login hingga sinkronisasi data.', icon: 'ph:device-mobile-bold', category: 'scoring', readTime: '6 menit',
                toc: [
                        { id: 'login-mobile', level: 2, text: 'Login Scorekeeper' },
                        { id: 'scan-qr', level: 2, text: 'Scan QR Assignment' },
                        { id: 'input-skor-mobile', level: 2, text: 'Input Skor' },
                        { id: 'sinkronisasi', level: 2, text: 'Sinkronisasi dan Troubleshooting' },
                ],
                content: `
                    <h2 id="login-mobile">Login Scorekeeper</h2>
                    <p>Akun scorekeeper dibuat oleh panitia dari dashboard. Gunakan kredensial resmi agar setiap input skor tercatat atas nama petugas yang tepat.</p>
                    <h2 id="scan-qr">Scan QR Assignment</h2>
                    <p>Setiap bantalan memiliki QR assignment. Scan QR untuk membuka match/target yang benar dan menghindari salah input ke peserta lain.</p>
                    <h2 id="input-skor-mobile">Input Skor</h2>
                    <p>Input nilai panah per end sesuai urutan tembakan. Setelah diverifikasi bersama petugas lapangan, simpan end agar data langsung ter-update di sistem pusat.</p>
                    <h2 id="sinkronisasi">Sinkronisasi dan Troubleshooting</h2>
                    <ul>
                        <li>Jika jaringan tidak stabil, pastikan data benar-benar tersimpan sebelum pindah end.</li>
                        <li>Lakukan refresh assignment bila QR tidak sesuai match aktif.</li>
                        <li>Laporkan mismatch data ke operator dashboard untuk koreksi terpusat.</li>
                    </ul>
                `
        },
        {
                slug: 'pendaftaran-peserta', title: 'Pendaftaran Peserta ke Event', excerpt: 'Panduan detail pendaftaran individu/klub, validasi data, dan alur pembayaran.', icon: 'ph:clipboard-text-bold', category: 'event', readTime: '7 menit',
                toc: [
                        { id: 'daftar-individu', level: 2, text: 'Daftar Individu' },
                        { id: 'daftar-klub', level: 2, text: 'Daftar via Klub' },
                        { id: 'validasi-pendaftaran', level: 2, text: 'Validasi Data Pendaftaran' },
                        { id: 'status-pembayaran', level: 2, text: 'Status Pembayaran' },
                ],
                content: `
                    <h2 id="daftar-individu">Daftar Individu</h2>
                    <p>Pemanah memilih event, menentukan kategori, lalu mengisi formulir pendaftaran sesuai syarat yang ditetapkan panitia.</p>
                    <h2 id="daftar-klub">Daftar via Klub</h2>
                    <p>Admin klub dapat mendaftarkan beberapa anggota sekaligus. Model ini cocok untuk keberangkatan rombongan agar administrasi lebih cepat.</p>
                    <h2 id="validasi-pendaftaran">Validasi Data Pendaftaran</h2>
                    <ul>
                        <li>Pastikan kategori sesuai usia/jenis busur peserta.</li>
                        <li>Cek data identitas dan kontak peserta sebelum submit.</li>
                        <li>Pastikan dokumen pendukung (jika diminta panitia) telah lengkap.</li>
                    </ul>
                    <h2 id="status-pembayaran">Status Pembayaran</h2>
                    <p>Untuk event berbayar, pendaftaran dianggap final setelah pembayaran terverifikasi. Simpan nomor invoice agar mudah ditelusuri saat ada kendala.</p>
                `
        },
        {
                slug: 'manajemen-peserta', title: 'Manajemen Peserta dan Bantalan', excerpt: 'Panduan operasional menata peserta, memantau status, dan mengatur bantalan kualifikasi.', icon: 'ph:table-bold', category: 'event', readTime: '7 menit',
                toc: [
                        { id: 'lihat-peserta', level: 2, text: 'Melihat Daftar Peserta' },
                        { id: 'atur-bantalan', level: 2, text: 'Atur Penempatan Bantalan' },
                        { id: 'strategi-penempatan', level: 2, text: 'Strategi Penempatan' },
                ],
                content: `
                    <h2 id="lihat-peserta">Melihat Daftar Peserta</h2>
                    <p>Dashboard event menampilkan daftar peserta per kategori beserta status registrasi/pembayaran. Gunakan filter untuk memudahkan monitoring.</p>
                    <h2 id="atur-bantalan">Atur Penempatan Bantalan</h2>
                    <p>Panitia dapat mengatur target assignment secara manual atau otomatis. Setelah final, lakukan lock internal agar tidak terjadi perubahan mendadak saat sesi berjalan.</p>
                    <h2 id="strategi-penempatan">Strategi Penempatan</h2>
                    <ul>
                        <li>Hindari penumpukan peserta dari klub yang sama pada satu bantalan jika regulasi mengharuskan pemerataan.</li>
                        <li>Pastikan jadwal sesi sesuai kapasitas lapangan dan jumlah petugas.</li>
                        <li>Lakukan re-check sebelum scoring dimulai.</li>
                    </ul>
                `
        },
        {
                slug: 'pengelolaan-klub', title: 'Pengelolaan Anggota Klub', excerpt: 'Alur undang anggota, review permohonan, dan tata kelola member klub secara berkelanjutan.', icon: 'ph:users-bold', category: 'event', readTime: '6 menit',
                toc: [
                        { id: 'undang-anggota', level: 2, text: 'Undang Anggota' },
                        { id: 'terima-permohonan', level: 2, text: 'Terima Permohonan' },
                        { id: 'praktik-baik-klub', level: 2, text: 'Praktik Baik Manajemen Klub' },
                ],
                content: `
                    <h2 id="undang-anggota">Undang Anggota</h2>
                    <p>Admin klub dapat mengundang pemanah melalui dashboard. Notifikasi akan dikirim agar pemanah bisa menerima undangan dengan cepat.</p>
                    <h2 id="terima-permohonan">Terima Permohonan</h2>
                    <p>Permohonan gabung dari halaman publik klub masuk ke antrean review. Admin dapat menerima/menolak berdasarkan kriteria klub.</p>
                    <h2 id="praktik-baik-klub">Praktik Baik Manajemen Klub</h2>
                    <ul>
                        <li>Buat standar data anggota minimum (nama, kontak, kategori busur).</li>
                        <li>Tinjau anggota tidak aktif secara berkala.</li>
                        <li>Gunakan form pendaftaran klub untuk menyamakan kualitas data member baru.</li>
                    </ul>
                `
        },
    { slug: 'cara-berlangganan', title: 'Cara Berlangganan dan Pembayaran', excerpt: 'Alur detail pemilihan paket, pembayaran, verifikasi status, dan tindak lanjut saat pembayaran pending.', icon: 'ph:credit-card-bold', category: 'subscription', readTime: '6 menit', toc: [{ id: 'pilih-paket', level: 2, text: 'Pilih Paket' }, { id: 'checkout', level: 2, text: 'Checkout dan Invoice' }, { id: 'metode-bayar', level: 2, text: 'Metode Pembayaran' }, { id: 'status-langganan', level: 2, text: 'Cek Status Langganan' }], content: `<h2 id="pilih-paket">Pilih Paket</h2><p>Buka <a href="/subscription" class="text-primary font-semibold">halaman berlangganan</a> dan pilih paket yang sesuai kebutuhan operasional Anda.</p><h2 id="checkout">Checkout dan Invoice</h2><p>Setelah memilih paket, sistem membuat invoice pembayaran. Simpan referensi invoice agar mudah ditelusuri jika ada kendala verifikasi.</p><h2 id="metode-bayar">Metode Pembayaran</h2><p>Metode yang umum tersedia: transfer bank, e-wallet, dan QRIS melalui payment gateway terintegrasi.</p><h2 id="status-langganan">Cek Status Langganan</h2><p>Status langganan dapat dipantau dari dashboard subscription. Jika status masih pending, lakukan refresh dan cek invoice detail sebelum melakukan pembayaran ulang.</p>` },
    { slug: 'fitur-premium', title: 'Fitur Eksklusif Paket Premium', excerpt: 'Rincian fitur premium untuk klub/organisasi serta dampaknya pada workflow event dan scoring.', icon: 'ph:star-bold', category: 'subscription', readTime: '6 menit', toc: [{ id: 'fitur-list', level: 2, text: 'Daftar Fitur Premium' }, { id: 'dampak-operasional', level: 2, text: 'Dampak Operasional' }], content: `<h2 id="fitur-list">Daftar Fitur Premium</h2><ul><li>Publikasi event lebih fleksibel</li><li>Manajemen anggota dan undangan yang lebih lengkap</li><li>Akses workflow scoring/eliminasi lanjutan</li><li>Manajemen scorekeeper</li><li>Laporan operasional yang lebih komprehensif</li></ul><h2 id="dampak-operasional">Dampak Operasional</h2><p>Dengan premium, proses event jadi lebih stabil untuk volume peserta besar, karena modul manajemen dan scoring dapat dijalankan end-to-end dalam satu platform.</p>` },
    { slug: 'addon-langganan', title: 'Add-on dan Perluasan Paket', excerpt: 'Panduan kapan perlu add-on, contoh kasus penggunaan, dan strategi upgrade bertahap.', icon: 'ph:plus-circle-bold', category: 'subscription', readTime: '5 menit', toc: [{ id: 'apa-itu-addon', level: 2, text: 'Apa itu Add-on?' }, { id: 'kapan-dibutuhkan', level: 2, text: 'Kapan Add-on Dibutuhkan?' }, { id: 'strategi-upgrade', level: 2, text: 'Strategi Upgrade Bertahap' }], content: `<h2 id="apa-itu-addon">Apa itu Add-on?</h2><p>Add-on adalah perluasan kapasitas atau fitur tambahan di atas paket utama.</p><h2 id="kapan-dibutuhkan">Kapan Add-on Dibutuhkan?</h2><ul><li>Saat jumlah peserta/event melampaui beban normal paket.</li><li>Saat butuh fitur khusus untuk periode kompetisi tertentu.</li><li>Saat organisasi ingin scale-up tanpa pindah paket permanen.</li></ul><h2 id="strategi-upgrade">Strategi Upgrade Bertahap</h2><p>Mulai dari paket inti, monitor pemakaian, lalu aktifkan add-on saat mendekati batas operasional untuk menjaga efisiensi biaya.</p>` },
        {
                slug: 'scorekeeper', title: 'Manajemen Scorekeeper', excerpt: 'Panduan mengelola akun scorekeeper: pembuatan akun, assignment, dan kontrol akses.', icon: 'ph:identification-badge-bold', category: 'scoring', readTime: '5 menit',
                toc: [
                        { id: 'buat-scorekeeper', level: 2, text: 'Membuat Akun Scorekeeper' },
                        { id: 'assignment-scorekeeper', level: 2, text: 'Assignment ke Lapangan/Sesi' },
                        { id: 'kontrol-akses', level: 2, text: 'Kontrol Akses dan Keamanan' },
                ],
                content: `
                    <h2 id="buat-scorekeeper">Membuat Akun Scorekeeper</h2>
                    <p>Panitia membuat akun scorekeeper dari dashboard organisasi. Gunakan identitas yang jelas agar setiap input skor mudah ditelusuri.</p>
                    <h2 id="assignment-scorekeeper">Assignment ke Lapangan/Sesi</h2>
                    <p>Setelah akun aktif, tetapkan scorekeeper ke sesi/target tertentu. Assignment yang rapi membantu mengurangi tumpang tindih tanggung jawab di lapangan.</p>
                    <h2 id="kontrol-akses">Kontrol Akses dan Keamanan</h2>
                    <ul>
                        <li>Batasi akun scorekeeper hanya untuk input skor.</li>
                        <li>Ganti kredensial jika terjadi rotasi petugas.</li>
                        <li>Audit aktivitas secara berkala untuk menjaga integritas hasil pertandingan.</li>
                    </ul>
                `
        },
    { slug: 'kategori-lomba', title: 'Kategori dan Divisi Lomba', excerpt: 'Divisi usia, jenis kelamin, dan jenis busur dalam kompetisi.', icon: 'ph:list-numbers-bold', category: 'archery', readTime: '5 menit', toc: [{ id: 'divisi-busur', level: 2, text: 'Divisi Busur' }, { id: 'divisi-usia', level: 2, text: 'Kelompok Usia' }], content: `<h2 id="divisi-busur">Divisi Busur</h2><p>Kompetisi panahan umumnya dibagi berdasarkan jenis busur: Recurve, Compound, Barebow, dan Tradisional. Setiap divisi bertanding secara terpisah dan memiliki jarak tembak yang berbeda.</p><h2 id="divisi-usia">Kelompok Usia</h2><p>Perlombaan umumnya terbagi atas kelompok usia: U-12, U-15, U-18, Junior (U-21), Open/Senior, dan Master (40+). Pengelompokan ini disesuaikan dengan regulasi World Archery dan PERPANI.</p>` },
    { slug: 'jarak-dan-target', title: 'Jarak Tembak dan Format Target', excerpt: 'Standar jarak tembak dan ukuran target panahan.', icon: 'ph:ruler-bold', category: 'archery', readTime: '4 menit', toc: [{ id: 'jarak-outdoor', level: 2, text: 'Outdoor' }, { id: 'jarak-indoor', level: 2, text: 'Indoor' }], content: `<h2 id="jarak-outdoor">Outdoor (FITA/WA)</h2><p>Standar internasional untuk outdoor: <strong>70 meter</strong> untuk Recurve senior, <strong>50 meter</strong> untuk Compound, dan bervariasi untuk kelompok usia lebih muda. Target berukuran 122cm digunakan untuk 70m.</p><h2 id="jarak-indoor">Indoor</h2><p>Standar indoor: <strong>18 meter</strong> dengan target 40cm atau 60cm. Format indoor biasanya menggunakan sistema 3-spot atau 1-spot target face.</p>` },
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
