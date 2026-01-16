<template>
  <div :class="['max-w-7xl mx-auto px-5', className]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
})
</script>
