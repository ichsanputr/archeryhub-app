<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center gap-3 text-navy border-b border-gray-100 pb-3">
            <div class="p-2 bg-primary/20 rounded-lg text-navy">
                <span class="material-symbols-outlined text-[20px]">{{ icon }}</span>
            </div>
            <h3 class="text-lg font-bold uppercase tracking-wide">{{ title }}</h3>
        </div>
        <slot />
    </div>
</template>

<script setup>
defineProps({
    icon: { type: String, required: true },
    title: { type: String, required: true }
})
</script>
