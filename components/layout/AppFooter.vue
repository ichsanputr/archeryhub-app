<script setup>
// import removed: getPlatformContent not used in footer
// removed: otherLanguages computed is no longer needed
</script>
<template>
  <footer class="bg-navy relative overflow-hidden text-gray-200 border-t border-white/5">
    <!-- Decorative Blurred Circles -->
    <div class="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 z-0"></div>
    <div class="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30 z-0">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Main Footer Content -->
      <div class="flex flex-col lg:flex-row justify-between gap-12 py-12 sm:py-16">
        <!-- Column 1: Brand & About -->
        <div class="flex flex-col gap-6 max-w-md">
          <div class="flex flex-col items-start gap-4">
            <div class="flex items-center gap-3">
              <NuxtLink to="/" class="inline-block flex-none">
                <img src="/logo.png" alt="archeris.net Logo" class="h-10 sm:h-12 w-auto" />
              </NuxtLink>
              <div class="text-2xl font-black tracking-tight text-white font-display">
                Archeris<span class="text-logo-id">.net</span>
              </div>
            </div>
            <p class="text-gray-400 leading-relaxed text-sm sm:text-base">
              Platform infrastruktur digital terintegrasi untuk skor real-time dan turnamen panahan profesional yang lebih efisien. Archeris hadir untuk menghubungkan dan memberdayakan seluruh penggiat panahan di Indonesia, mulai dari atlet pemula hingga penyelenggara event tingkat nasional.
            </p>
          </div>
        </div>

        <!-- Links Group Parent -->
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-20">
          <!-- Column 2: Navigation -->
          <div class="flex flex-col gap-5">
            <h4 class="text-xs font-black  tracking-widest text-white border-b border-white/10 pb-2">
              Navigasi
            </h4>
            <div class="flex flex-col gap-3">
              <NuxtLink to="/events"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Turnamen
              </NuxtLink>

              <NuxtLink to="/news"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Berita
              </NuxtLink>
              <NuxtLink to="/products"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Marketplace
              </NuxtLink>
              <NuxtLink to="/subscription"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Subscription
              </NuxtLink>
            </div>
          </div>

          <!-- Column 3: About -->
          <div class="flex flex-col gap-5">
            <h4 class="text-xs font-black  tracking-widest text-white border-b border-white/10 pb-2">
              Perusahaan
            </h4>
            <div class="flex flex-col gap-3">
              <NuxtLink to="/about-us"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Tentang Kami
              </NuxtLink>
              <NuxtLink to="/contact"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Kontak
              </NuxtLink>
              <NuxtLink to="/privacy"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Kebijakan Privasi
              </NuxtLink>
              <NuxtLink to="/terms"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Syarat & Ketentuan
              </NuxtLink>
              <NuxtLink to="/disclaimer"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Disclaimer
              </NuxtLink>
            </div>
          </div>

          <!-- Column 4: Support -->
          <div class="flex flex-col gap-5">
            <h4 class="text-xs font-black  tracking-widest text-white border-b border-white/10 pb-2">
              Dukungan
            </h4>
            <div class="flex flex-col gap-3">
              <NuxtLink to="/faq"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                FAQ
              </NuxtLink>
              <NuxtLink to="/docs"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Dokumentasi
              </NuxtLink>
              <NuxtLink to="/blog"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Blog
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="py-8 border-t border-white/5">
        <p class="text-xs text-gray-500 font-medium text-center sm:text-left">
          &copy; {{ new Date().getFullYear() }} archeris.net. Hak cipta dilindungi undang-undang.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>


