<template>
  <div :key="route.path" class="min-h-screen flex flex-col bg-background-light font-body text-navy overflow-x-hidden">
    <LayoutLandingHeader :transparent="true" />
    <main class="flex-grow">
      <slot />
    </main>
    <LayoutAppFooter />
    <BaseToast />
  </div>
</template>

<script setup>
const route = useRoute()

defineOptions({
  name: 'LandingLayout'
})
</script>
