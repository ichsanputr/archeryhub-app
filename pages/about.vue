<template>
  <div class="relative overflow-hidden py-20">
    <!-- Background -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-orange-50"></div>
      <div class="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl">
      </div>
    </div>

    <Container>
      <div class="text-center max-w-4xl mx-auto">
        <!-- Title -->
        <h1 class="text-2xl sm:text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">
          <span class="text-gray-900">Tentang</span>
        </h1>

        <!-- Platform Description -->
        <div class="rounded-2xl border border-yellow-100 bg-white p-8 mb-12 text-left shadow-sm">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            Platform Kami
          </h2>
          <p class="text-lg leading-relaxed text-gray-600 mb-4">
            Archeryhub.id adalah platform manajemen turnamen komprehensif yang dirancang untuk membantu organisasi dan
            klub panahan mengelola kompetisi mereka dengan mudah. Kami percaya bahwa manajemen yang efisien dan
            keterlibatan langsung adalah kunci suksesnya sebuah acara olahraga.
          </p>
          <p class="text-lg leading-relaxed text-gray-600">
            Platform kami menawarkan solusi menyeluruh untuk turnamen panahan, termasuk pendaftaran,
            manajemen atlet, skor langsung, dan publikasi hasil resmi. Baik Anda menjalankan
            kompetisi klub kecil atau kejuaraan nasional, Archeryhub.id menyediakan
            alat yang sempurna untuk pengalaman profesional.
          </p>
        </div>

        <!-- Personal Description -->
        <div class="rounded-2xl border border-yellow-100 bg-white p-8 text-left shadow-sm">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            Tentang Pendiri
          </h2>
          <p class="text-lg leading-relaxed text-gray-600 mb-4">
            Halo! Saya Ichsan, pencipta dan pengembang di balik Archeryhub.id. Sebagai penggemar
            panahan dan insinyur perangkat lunak, saya melihat kebutuhan akan alat yang lebih modern
            dan mudah diakses untuk mengelola acara panahan dan melacak kemajuan atlet.
            Semangat inilah yang menginspirasi saya untuk membangun platform yang menyederhanakan logistik turnamen.
          </p>
          <p class="text-lg leading-relaxed text-gray-600 mb-4">
            Dengan pengalaman bertahun-tahun dalam pengembangan perangkat lunak dan manajemen olahraga,
            saya merancang Archeryhub.id agar intuitif bagi penyelenggara dan menarik bagi atlet.
            Setiap fitur dibangun dengan tujuan membuat kompetisi panahan menjadi lebih
            profesional, transparan, dan menarik bagi semua orang yang terlibat.
          </p>
          <p class="text-lg leading-relaxed text-gray-600">
            Tujuan saya adalah mendukung komunitas panahan dengan menyediakan teknologi kelas dunia
            yang tumbuh sesuai kebutuhan Anda. Archeryhub.id lebih dari sekadar
            sistem manajemen—ia adalah mitra dalam perjalanan turnamen Anda.
          </p>
        </div>

      </div>
    </Container>
  </div>
</template>

<script setup>
import Container from '~/components/Container.vue'

// Use landing layout
definePageMeta({
  layout: 'landing'
})

// Set page meta
const route = useRoute()
useHead({
  title: 'Tentang - Archeryhub.id Pengelola Turnamen',
  meta: [
    {
      name: 'description',
      content: 'Learn about Archeryhub.id, the comprehensive tournament management platform designed to help archery organizations and clubs manage their competitions with ease.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://archeryhub.id${route.path}`
    }
  ]
})
</script>
