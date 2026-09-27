<script setup>
const route = useRoute()
const eventId = route.params.id || route.params.slug
await navigateTo(`/dashboard/organizer/tournaments/${eventId}/settings`, { replace: true, redirectCode: 301 })
</script>

<template>
  <div></div>
</template>
