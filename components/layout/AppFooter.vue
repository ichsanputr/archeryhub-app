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
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12 sm:py-16">
        <!-- Column 1: Brand & About -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="flex flex-col items-start gap-4">
            <div class="flex items-center gap-3">
              <a href="/" class="inline-block flex-none">
                <img src="/logo.png" alt="Archeryhub.id Logo" class="h-10 sm:h-12 w-auto" />
              </a>
              <div class="text-2xl font-black tracking-tight text-white font-display">
                Archeryhub<span class="text-logo-id">.id</span>
              </div>
            </div>
            <p class="text-gray-400 leading-relaxed max-w-md text-sm sm:text-base">
              The ultimate archery tournament management platform.
              Organize events, manage participant rankings, track live results,
              and enhance the competitive archery experience for everyone.
            </p>
          </div>
          <!-- Simple Socmed Links could go here -->
        </div>

        <!-- Links Group Parent -->
        <div class="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
          <!-- Column 2: Navigation -->
          <div class="flex flex-col gap-5">
            <h4 class="text-xs font-black uppercase tracking-widest text-primary">
              Navigation
            </h4>
            <div class="flex flex-col gap-3">
              <a href="/tournaments"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Tournaments
              </a>
              <a href="/dashboard/result"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Live Results
              </a>
            </div>
          </div>

          <!-- Column 3: About -->
          <div class="flex flex-col gap-5">
            <h4 class="text-xs font-black uppercase tracking-widest text-primary">
              Company
            </h4>
            <div class="flex flex-col gap-3">
              <a href="/about"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                About Us
              </a>
              <a href="/contact"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Contact
              </a>
              <a href="/privacy"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Privacy Policy
              </a>
              <a href="/terms"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Terms of Service
              </a>
            </div>
          </div>

          <!-- Column 4: Developer -->
          <div class="flex flex-col gap-5">
            <h4 class="text-xs font-black uppercase tracking-widest text-primary">
              Developer
            </h4>
            <div class="flex flex-col gap-3">
              <a href="/blog"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Blog
              </a>
              <a href="/career"
                class="text-sm font-medium text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-2 group">
                Career
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="py-8 border-t border-white/5">
        <p class="text-xs text-gray-500 font-medium text-center sm:text-left">
          &copy; {{ new Date().getFullYear() }} Archeryhub.id. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
