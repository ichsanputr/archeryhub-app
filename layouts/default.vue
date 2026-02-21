<template>
  <div>
    <slot />
    <BaseToast />
  </div>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'

const route = useRoute()

defineOptions({
  name: 'DefaultLayout'
})

// Initialize theme
const { initializeTheme } = useTheme()
onMounted(() => {
  initializeTheme()
})
</script>
