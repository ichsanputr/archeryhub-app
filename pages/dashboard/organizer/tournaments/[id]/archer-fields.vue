<script setup>
const route = useRoute()
const tournamentId = route.params.id || route.params.slug
navigateTo(`/dashboard/organizer/tournaments/${tournamentId}/registration-form`, { replace: true })
</script>

<template>
  <div class="p-8 text-center text-slate-400 text-xs">Mengalihkan ke Formulir Pendaftaran...</div>
</template>
