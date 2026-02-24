<template>
  <div class="min-h-screen flex flex-col">
    <!-- Hero Section -->
    <div class="bg-navy pt-32 pb-20 relative overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="/hero-homepage.jpeg" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
        </div>
      </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div>
          <div class="flex items-center gap-2 text-primary text-sm font-bold  tracking-wider mb-3">
            <Icon icon="ph:gavel" class="text-lg" />
            Legal
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Syarat dan Ketentuan
          </h1>
          <p class="text-slate-300 text-lg leading-relaxed">
            Harap baca Syarat dan Ketentuan ini dengan teliti sebelum menggunakan platform kami.
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
        <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p class="mb-6 leading-relaxed">
            Harap baca Syarat dan Ketentuan ("Syarat", "Syarat dan Ketentuan") ini dengan teliti sebelum menggunakan
            situs web Archery Hub (the "Layanan") yang dioperasikan oleh Archery Hub Indonesia ("kami", "kita",
            atau "milik kami").
          </p>
          <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">1. Penerimaan Syarat</h3>
          <p class="mb-4">
            Dengan mengakses atau menggunakan Layanan, Anda setuju untuk terikat oleh Syarat ini. Jika Anda tidak setuju
            dengan bagian mana pun dari syarat tersebut, maka Anda tidak boleh mengakses Layanan.
          </p>
          <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">2. Direktori Klub & Verifikasi</h3>
          <p class="mb-4">
            Archery Hub menyediakan direktori klub panahan di Indonesia. Meskipun kami berusaha untuk
            memverifikasi klub, kami tidak dapat menjamin keakuratan lengkap
            semua detail klub, termasuk jadwal latihan dan biaya.
          </p>
          <ol class="list-decimal pl-6 space-y-2 mb-6 marker:text-navy marker:font-bold">
            <li><strong>Informasi Klub:</strong> Informasi tentang klub disediakan untuk tujuan informasi.</li>
            <li><strong>Ulasan Anggota:</strong> Pengguna bertanggung jawab atas konten ulasan mereka. Kami berhak
              menghapus ulasan yang melanggar pedoman komunitas kami.</li>
            <li><strong>Perselisihan:</strong> Perselisihan apa pun antara pengguna dan klub yang ditemukan melalui
              platform kami harus diselesaikan langsung antara para pihak. Archery Hub tidak bertanggung jawab atas
              operasi klub.</li>
          </ol>
          <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">3. Penghentian</h3>
          <p class="mb-4">
            Kami dapat menghentikan atau menangguhkan akses ke Layanan kami secara segera, tanpa pemberitahuan
            sebelumnya atau
            tanggung jawab, untuk alasan apa pun, termasuk tanpa batasan jika Anda melanggar Syarat.
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
  title: 'Syarat dan Ketentuan - Archeryhub.id'
})
</script>
