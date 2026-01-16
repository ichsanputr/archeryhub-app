<template>
  <div class="font-sans">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
    <ToastNotifications />
  </div>
</template>

<script setup>
defineOptions({
  name: 'LandingLayout'
})
</script>
