<template>
    <div class="flex items-center justify-center min-h-[60vh]">
        <div class="flex flex-col items-center gap-4">
            <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin" />
            <p class="text-gray-400 font-bold animate-pulse">Mengalihkan Halaman...</p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const router = useRouter()
const route = useRoute()

onMounted(() => {
    const slug = route.params.slug
    const subPath = Array.isArray(slug) ? slug.join('/') : ''
    const targetUrl = subPath ? `/dashboard/organization/${subPath}` : '/dashboard/organization'
    router.replace(targetUrl)
})
</script>
