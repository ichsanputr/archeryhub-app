<template>
  <div class="min-h-screen flex flex-col bg-background-light font-body text-navy">
    <LayoutLandingHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>

<script setup>
defineOptions({
  name: 'LandingLayout'
})
</script>
