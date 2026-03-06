<script setup>
const { user } = useAuth()

onMounted(async () => {
  const role = user.value?.role || user.value?.type || user.value?.user_type || 'archer'

  const roleMap = {
    'archer': '/dashboard/archer/profile',
    'club': '/dashboard/club/profile',
    'organization': '/dashboard/organization/profile',
    'seller': '/dashboard/seller/store',
    'root': '/dashboard/root',
    'admin': '/dashboard/organization/profile'
  }

  const target = roleMap[role] || '/dashboard/settings'
  await navigateTo(target, { replace: true })
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
