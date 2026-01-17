<template>
  <div>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'

// Define component name to fix linter error
defineOptions({
  name: 'BlankLayout'
})

// Initialize theme
const { initializeTheme } = useTheme()
onMounted(() => {
  initializeTheme()
})
</script>
