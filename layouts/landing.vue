<template>
  <div class="min-h-screen flex flex-col bg-background-light font-body text-navy overflow-x-hidden">
    <LayoutLandingHeader :transparent="route.meta.headerTransparent !== false" />
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
