<script setup>
const { user } = useAuth()

onMounted(async () => {
  const role = user.value?.role || user.value?.type || 'archer'

  if (role === 'archer') {
    await navigateTo('/dashboard/archers/profile')
  } else if (role === 'club') {
    await navigateTo('/dashboard/clubs/profile')
  } else if (role === 'organization') {
    await navigateTo('/dashboard/organizations/profile')
  } else if (role === 'seller') {
    await navigateTo('/dashboard/store')
  } else {
    // Default or admin
    await navigateTo('/dashboard/settings')
  }
})

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})
</script>

<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="flex flex-col items-center gap-4">
      <Icon icon="ph:spinner" class="text-4xl text-primary animate-spin" />
      <p class="text-gray-500 font-bold">Mengalihkan ke profil Anda...</p>
    </div>
  </div>
</template>
