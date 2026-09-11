<template>
  <div class="p-12 text-center">
    <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

useHead({
  title: 'Paket & Harga - Archeris'
})

const router = useRouter()

onMounted(() => {
  router.replace('/package')
})
</script>
