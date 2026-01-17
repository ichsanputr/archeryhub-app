<template>
  <div class="min-h-screen bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white flex">
    <!-- Sidebar Overlay (Mobile) -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
      @click="isSidebarOpen = false"></div>

    <!-- Sidebar -->
    <LayoutAppSidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-h-screen overflow-hidden">
      <!-- Header -->
      <LayoutAppHeader />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <slot />
      </main>
      <!-- Global Modals -->
      <DeviceRegistrationModal v-model="showDeviceModal" />
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'

// This layout includes the sidebar and header for authenticated users
const isSidebarOpen = useState('mobile-sidebar-open', () => false)
const showDeviceModal = useState('show-device-modal', () => false)

// Initialize theme
const { initializeTheme } = useTheme()
onMounted(() => {
  initializeTheme()
})
</script>
