<template>
    <div class="flex items-center justify-center min-h-screen bg-navy/5">
        <div class="flex flex-col items-center gap-6 p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div class="relative">
                <Icon icon="ph:spinner-gap-bold" class="text-6xl text-primary animate-spin" />
                <div class="absolute inset-0 flex items-center justify-center">
                    <Icon icon="ph:trophy-bold" class="text-navy text-2xl" />
                </div>
            </div>
            <div class="text-center">
                <h2 class="text-2xl font-black text-navy mb-2">Mengalihkan Halaman...</h2>
                <p class="text-gray-400 font-bold max-w-xs animate-pulse">Menyesuaikan dengan dashboard baru Anda agar
                    lebih rapi.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const { user } = useAuth()
const route = useRoute()

onMounted(async () => {
    // Determine role and handle fallback
    const role = user.value?.role || user.value?.user_type || user.value?.type || 'archer'

    // Normalize role to path segment
    const roleMap = {
        'archer': 'archer',
        'club': 'club',
        'organization': 'organization',
        'seller': 'seller',
        'root': 'root',
        'admin': 'organization'
    }

    const targetRole = roleMap[role] || 'archer'
    const slug = route.params.slug
    const subPath = Array.isArray(slug) ? slug.join('/') : slug || ''

    // Construct new URL using the persona prefix
    const prefix = `/dashboard/${targetRole}/events`
    const targetUrl = subPath ? `${prefix}/${subPath}` : prefix

    await navigateTo(targetUrl, { replace: true })
})
</script>
