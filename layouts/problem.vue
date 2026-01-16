<template>
  <div>
    <slot />
    <ToastNotifications />
  </div>
</template>

<script setup>
defineOptions({
  name: 'ProblemLayout'
})
</script>
