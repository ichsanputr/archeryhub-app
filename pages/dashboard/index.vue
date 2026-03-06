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
const { user } = useAuth()
const router = useRouter()

onMounted(() => {
  const role = user.value?.role || user.value?.type || user.value?.user_type || 'archer'

  // Clean up role string to match folder names (singular)
  const roleMap = {
    'archer': 'archer',
    'club': 'club',
    'organization': 'organization',
    'seller': 'seller',
    'root': 'root',
    'admin': 'organization' // Admins default to organization view or their own root
  }

  const targetRole = roleMap[role] || 'archer'
  router.replace(`/dashboard/${targetRole}`)
})
</script>
