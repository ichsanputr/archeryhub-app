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
const isTransparent = computed(() => route.path === '/' || route.meta.transparent === true)

defineOptions({
  name: 'LandingLayout'
})
</script>
