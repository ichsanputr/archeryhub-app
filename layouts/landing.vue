<template>
  <div class="min-h-screen flex flex-col bg-background-light font-body text-navy overflow-x-hidden">
    <LayoutLandingHeader :transparent="isTransparent" />
    <main class="flex-grow" :class="{ 'pt-16': !isTransparent }">
      <slot />
    </main>
    <LayoutAppFooter />
    <BaseToast />
  </div>
</template>

<script setup>
const route = useRoute()

const isTransparent = computed(() => {
  // Homepage is always transparent header on top
  if (route.path === '/') return true
  // Other pages can opt-in via route meta
  return route.meta.transparent === true
})

defineOptions({
  name: 'LandingLayout'
})
</script>
