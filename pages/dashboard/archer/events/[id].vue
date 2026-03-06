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
const route = useRoute()
const tId = route.params.id || '1'

const tabs = [
    { id: 'overview', name: 'Ringkasan', path: `/dashboard/events/${tId}` },
    { id: 'timeline', name: 'Jadwal Pertandingan', path: `/dashboard/events/${tId}/timeline` },
    { id: 'participants', name: 'Daftar Atlet', path: `/dashboard/events/${tId}/participants` },
    { id: 'results', name: 'Hasil Live', path: `/dashboard/events/${tId}/results` },
    { id: 'venue', name: 'Informasi Venue', path: `/dashboard/events/${tId}/venue` }
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
