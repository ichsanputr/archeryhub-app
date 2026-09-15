<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()
const isExternalTournamentState = useState('isExternalTournamentPage', () => false)
const isWide = computed(() => {
  return isExternalTournamentState.value === true || 
         route.path.startsWith('/tournaments/external') ||
         (/^\/tournaments\/\d+/.test(route.path))
})
</script>
<template>
  <footer class="bg-navy relative overflow-hidden text-gray-200 border-t border-white/5">
    <!-- Decorative Blurred Circles -->
    <div class="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 z-0"></div>
    <div class="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30 z-0">
    </div>

    <div :class="isWide ? 'max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'" class="relative z-10">
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
              {{ $t('footer.about_desc') }}
            </p>

            <!-- Social Media Icons -->
            <div class="flex items-center gap-3 pt-2">
              <a href="https://www.instagram.com/archerisnet/" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary hover:text-navy border border-white/10 flex items-center justify-center text-gray-300 hover:scale-110 transition-all duration-200"
                aria-label="Instagram">
                <Icon icon="ph:instagram-logo-bold" class="text-xl" />
              </a>
              <a href="https://www.threads.com/@archerisnet" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary hover:text-navy border border-white/10 flex items-center justify-center text-gray-300 hover:scale-110 transition-all duration-200"
                aria-label="Threads">
                <Icon icon="ph:threads-logo-bold" class="text-xl" />
              </a>
              <a href="https://www.facebook.com/archerisnet/" target="_blank" rel="noopener noreferrer"
                class="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary hover:text-navy border border-white/10 flex items-center justify-center text-gray-300 hover:scale-110 transition-all duration-200"
                aria-label="Facebook">
                <Icon icon="ph:facebook-logo-bold" class="text-xl" />
              </a>
            </div>
          </div>
        </div>

        <!-- Links Group Parent -->
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-20">
          <!-- Column 2: Navigation -->
          <div class="flex flex-col gap-5">
            <h4 class="text-sm font-black  tracking-widest text-white border-b border-white/10 pb-2">
              {{ $t('footer.nav_title') }}
            </h4>
            <div class="flex flex-col gap-3">
              <NuxtLink to="/tournaments"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('nav.features') }}
              </NuxtLink>

              <NuxtLink to="/package"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('nav.pricing') }}
              </NuxtLink>
              <NuxtLink to="/archers"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('nav.archers') }}
              </NuxtLink>
              <NuxtLink to="/archeris-vs-ianseo"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('nav.archeris_vs_ianseo') }}
              </NuxtLink>
            </div>
          </div>

          <!-- Column 3: Company -->
          <div class="flex flex-col gap-5">
            <h4 class="text-xs font-black  tracking-widest text-white border-b border-white/10 pb-2">
              {{ $t('footer.comp_title') }}
            </h4>
            <div class="flex flex-col gap-3">
              <NuxtLink to="/about-us"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('footer.about_us') }}
              </NuxtLink>
              <NuxtLink to="/contact"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('footer.contact') }}
              </NuxtLink>
              <NuxtLink to="/privacy"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('footer.privacy') }}
              </NuxtLink>
              <NuxtLink to="/terms"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('footer.terms') }}
              </NuxtLink>
              <NuxtLink to="/disclaimer"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('footer.disclaimer') }}
              </NuxtLink>
            </div>
          </div>

          <!-- Column 4: Support -->
          <div class="flex flex-col gap-5">
            <h4 class="text-sm font-black  tracking-widest text-white border-b border-white/10 pb-2">
              {{ $t('footer.supp_title') }}
            </h4>
            <div class="flex flex-col gap-3">
              <NuxtLink to="/faq"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('footer.faq') }}
              </NuxtLink>
              <NuxtLink to="/docs"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                {{ $t('footer.docs') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-4 pb-2 border-t border-white/5">
        <p class="text-gray-500 font-medium text-center">
          &copy; {{ new Date().getFullYear() }} archeris.net. {{ $t('footer.rights') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
