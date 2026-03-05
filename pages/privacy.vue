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
          <div class="flex items-center gap-2 text-primary text-[10px] sm:text-sm font-bold tracking-wider mb-3">
            <Icon icon="ph:shield-check" class="text-base sm:text-lg" />
            Legal
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Kebijakan Privasi
          </h1>
          <p class="text-slate-300 text-sm md:text-lg leading-relaxed">
            Di Archery Hub Indonesia, kami sangat menjaga privasi Anda.
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
          <p>
            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi
            informasi Anda ketika Anda mengunjungi
            situs web kami termasuk bentuk media lainnya, saluran media, situs web seluler, atau
            aplikasi seluler yang terkait atau terhubung dengannya.
          </p>
          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">1. Pengumpulan Informasi Anda
          </h3>
          <p>Kami dapat mengumpulkan informasi tentang Anda dengan berbagai cara. Informasi
            yang mungkin kami kumpulkan di Situs meliputi:</p>
          <ul class="list-disc pl-6 space-y-2 marker:text-primary">
            <li><strong>Data Pribadi:</strong> Informasi yang dapat diidentifikasi secara pribadi, seperti nama Anda,
              alamat pengiriman, alamat email, dan nomor telepon, serta informasi demografis.</li>
            <li><strong>Data Turunan:</strong> Informasi yang secara otomatis dikumpulkan server kami ketika
              Anda mengakses Situs, seperti alamat IP Anda, jenis browser, sistem operasi, waktu akses, dan halaman yang
              telah Anda lihat langsung sebelum dan setelah
              mengakses Situs.</li>
            <li><strong>Data Keuangan:</strong> Informasi keuangan, seperti data terkait metode pembayaran Anda
              (misalnya nomor kartu kredit yang valid, merek kartu, tanggal kedaluwarsa) yang
              mungkin kami kumpulkan ketika Anda membeli, memesan, mengembalikan, menukar, atau meminta informasi
              tentang
              layanan kami dari Situs.</li>
          </ul>
          <h3 class="text-lg md:text-xl font-black text-navy dark:text-white mt-8 mb-4">2. Penggunaan Informasi Anda
          </h3>
          <p>Memiliki informasi yang akurat tentang Anda memungkinkan kami memberikan Anda
            pengalaman yang lancar, efisien, dan disesuaikan. Secara khusus, kami dapat menggunakan informasi
            yang dikumpulkan tentang Anda melalui Situs untuk:</p>
          <ol class="list-decimal pl-6 space-y-2 marker:text-navy marker:font-bold">
            <li>Membuat dan mengelola akun Anda.</li>
            <li>Memproses langganan keanggotaan klub dan pendaftaran turnamen.</li>
            <li>Mengirim email kepada Anda mengenai akun atau pesanan Anda.</li>
            <li>Memungkinkan komunikasi antar pengguna.</li>
            <li>Memenuhi dan mengelola pembelian, pesanan, pembayaran, dan transaksi lainnya terkait
              Situs.</li>
          </ol>
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
  title: 'Kebijakan Privasi - Archeryhub.id'
})
</script>
