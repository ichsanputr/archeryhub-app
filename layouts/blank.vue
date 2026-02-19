<template>
  <div :key="route.fullPath">
    <slot />
  </div>
</template>

<script setup>
const route = useRoute()
</script>