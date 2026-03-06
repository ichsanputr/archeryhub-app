<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="flex flex-col items-center gap-4">
      <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin" />
      <p class="text-gray-400 font-bold animate-pulse">Memuat dashboard...</p>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const router = useRouter()

onMounted(() => {
  router.replace('/dashboard/archer/events')
})
</script>
