<template>
  <ClientOnly>
    <Transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <div
        v-if="isOffline || showReconnectedBanner"
        :class="[
          'fixed top-0 inset-x-0 z-[9999] px-4 py-2 text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-colors select-none backdrop-blur-md',
          isOffline
            ? 'bg-amber-500/95 text-navy border-b border-amber-600/30'
            : 'bg-emerald-600/95 text-white border-b border-emerald-700/30'
        ]"
      >
        <Icon
          :icon="isOffline ? 'ph:wifi-slash-bold' : 'ph:wifi-high-bold'"
          class="text-base shrink-0 animate-pulse"
        />
        <span v-if="isOffline">
          {{ t('network.offline_message', 'Koneksi internet terputus. Data Anda tetap tersimpan di perangkat.') }}
        </span>
        <span v-else>
          {{ t('network.reconnected_message', 'Koneksi internet kembali terhubung.') }}
        </span>
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const isOffline = ref(false)
const showReconnectedBanner = ref(false)
let reconnectTimer = null

const handleOnline = () => {
  if (isOffline.value) {
    isOffline.value = false
    showReconnectedBanner.value = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(() => {
      showReconnectedBanner.value = false
    }, 3500)
  }
}

const handleOffline = () => {
  isOffline.value = true
  showReconnectedBanner.value = false
  if (reconnectTimer) clearTimeout(reconnectTimer)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    isOffline.value = !navigator.onLine
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    if (reconnectTimer) clearTimeout(reconnectTimer)
  }
})
</script>
