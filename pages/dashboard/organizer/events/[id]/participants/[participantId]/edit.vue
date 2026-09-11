<template>
  <div class="p-12 text-center">
    <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

useHead({
  title: 'Edit Peserta - Archeris Dashboard'
})

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const eventId = route.params.id
  const participantId = route.params.participantId
  router.replace(`/dashboard/events/${eventId}/participants/edit?archer_id=${participantId}`)
})
</script>
