<template>
    <div class="min-h-screen bg-background-light font-body text-navy antialiased flex flex-col">
        <!-- Main Content -->
        <main class="flex-grow max-w-[1280px] mx-auto w-full">
            <div class="w-full">
                <!-- NuxtPage for nested routes -->
                <NuxtPage />
            </div>
        </main>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
const tId = route.params.id || '1'

const tabs = [
    { id: 'overview', name: t('dashboard_event_main.tabs.overview'), path: `/dashboard/events/${tId}` },
    { id: 'participants', name: t('dashboard_event_main.tabs.participants'), path: `/dashboard/events/${tId}/participants` }
]

const isTabActive = (tab) => {
    if (tab.id === 'overview' && route.path === `/dashboard/events/${tId}`) return true
    return route.path === tab.path
}
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
