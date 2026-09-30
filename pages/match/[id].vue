<script setup lang="ts">
const route = useRoute()
const { get } = useApi()
const matchId = computed(() => (route.params.id || '').toString())

definePageMeta({ layout: 'blank' })

useHead({
    title: 'Redirecting to Match Details... - Archeris'
})

onMounted(async () => {
    try {
        const res = await get(`/match/${matchId.value}`)
        const slug = res?.event?.slug || res?.event?.id || 'tournament'
        await navigateTo(`/tournaments/${slug}/match/${matchId.value}`, { replace: true })
    } catch {
        await navigateTo(`/tournaments`, { replace: true })
    }
})
</script>

<template>
    <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-4">
        <div class="flex items-center gap-2">
            <span class="size-3.5 rounded-full bg-primary animate-bounce" style="animation-delay: 0ms"></span>
            <span class="size-3.5 rounded-full bg-primary animate-bounce" style="animation-delay: 150ms"></span>
            <span class="size-3.5 rounded-full bg-primary animate-bounce" style="animation-delay: 300ms"></span>
        </div>
        <div class="text-slate-500 font-bold tracking-wider text-xs">
            Redirecting to Match Details...
        </div>
    </div>
</template>
