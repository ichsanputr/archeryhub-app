<template>
  <div class="min-h-screen flex flex-col bg-background-light font-body text-navy overflow-x-hidden">
    <LayoutLandingHeader :transparent="route.meta.headerTransparent !== false" />
    <main class="flex-grow relative">
      <ClientOnly>
        <LottieLoader :loading="isPageLoading" />
      </ClientOnly>
      <slot />
    </main>
    <LayoutAppFooter />
    <BaseToast />
  </div>
</template>

<script setup>
const route = useRoute()
const isPageLoading = useState('pageLoadingState', () => false)

defineOptions({
  name: 'LandingLayout'
})
</script>
