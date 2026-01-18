<script setup>
// import removed: getPlatformContent not used in footer
// removed: otherLanguages computed is no longer needed
</script>
<template>
  <footer class="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 border-t border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 py-6 sm:py-8">
        <!-- Column 1: About -->
        <div class="text-left sm:col-span-2 lg:col-span-4">
          <div class="flex flex-col items-start gap-2 mb-4">
            <div class="flex items-center gap-2">
              <a href="/" class="inline-block flex-none">
                <img src="/logo-light.png" alt="Archeryhub.id Logo" class="h-12 sm:h-14 w-auto" />
              </a>
              <div class="text-2xl font-semibold">
                Archeryhub.id
              </div>
            </div>
            <div class="text-sm sm:text-base text-gray-400 leading-relaxed">The ultimate archery tournament management
              platform.
              Organize events, manage participant rankings, track live results,
              and enhance the competitive archery experience for everyone.</div>
          </div>
        </div>

        <!-- Column 2: Navigation -->
        <div class="text-left sm:col-span-1 lg:col-span-2">
          <h4 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
            Navigation
          </h4>
          <div class="flex flex-col gap-2 sm:gap-3">
            <div>
              <a href="/dashboard/tournaments"
                class="flex items-center text-sm sm:text-base text-gray-400 hover:text-yellow-400 transition-all duration-200 transform hover:translate-x-1">
                Tournaments
              </a>
            </div>
            <div>
              <a href="/dashboard/result"
                class="flex items-center text-sm sm:text-base text-gray-400 hover:text-yellow-400 transition-all duration-200 transform hover:translate-x-1">
                Live Results
              </a>
            </div>
          </div>
        </div>

        <!-- Column 4: About Links -->
        <div class="text-left sm:col-span-1 lg:col-span-2">
          <h4 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
            About
          </h4>
          <div class="flex flex-col gap-2 sm:gap-3">
            <div>
              <a href="/about"
                class="flex items-center text-sm sm:text-base text-gray-400 hover:text-yellow-400 transition-all duration-200 transform hover:translate-x-1">
                About Us
              </a>
            </div>
            <div>
              <a href="/contact"
                class="flex items-center text-sm sm:text-base text-gray-400 hover:text-yellow-400 transition-all duration-200 transform hover:translate-x-1">
                Contact
              </a>
            </div>
            <div>
              <a href="/privacy"
                class="flex items-center text-sm sm:text-base text-gray-400 hover:text-yellow-400 transition-all duration-200 transform hover:translate-x-1">
                Privacy Policy
              </a>
            </div>
            <div>
              <a href="/terms"
                class="flex items-center text-sm sm:text-base text-gray-400 hover:text-yellow-400 transition-all duration-200 transform hover:translate-x-1">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <!-- Column 5: Developer (right end on large screens) -->
        <div class="text-left sm:col-span-2 lg:col-span-2 lg:col-start-11">
          <h4 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
            Developer
          </h4>
          <div class="flex flex-col gap-2 sm:gap-3">
            <div>
              <a href="/blog"
                class="flex items-center text-sm sm:text-base text-gray-400 hover:text-yellow-400 transition-all duration-200 transform hover:translate-x-1">
                Blog
              </a>
            </div>
            <div>
              <a href="/career"
                class="flex items-center text-sm sm:text-base text-gray-400 hover:text-yellow-400 transition-all duration-200 transform hover:translate-x-1">
                Career
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
