<template>
    <div class="min-h-screen bg-background-light font-body text-navy antialiased flex flex-col">
        <!-- Main Content -->
        <main class="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                <!-- Left Content (NuxtPage for nested routes) -->
                <div class="lg:col-span-2">
                    <NuxtPage />
                </div>

                <!-- Shared Sidebar -->
                <aside class="space-y-8">
                    <div class="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-primary relative">
                        <h3 class="text-lg font-bold text-navy mb-4 font-display">Sisa Waktu Pendaftaran</h3>
                        <div class="flex gap-3 mb-6">
                            <div v-for="unit in ['Hari', 'Jam', 'Menit']" :key="unit"
                                class="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                                <span class="block text-2xl font-black text-navy">{{ Math.floor(Math.random() * 24)
                                    }}</span>
                                <span class="text-[10px] text-text-sub uppercase font-bold">{{ unit }}</span>
                            </div>
                        </div>
                        <div class="space-y-4 mb-6">
                            <div class="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                                <span class="text-text-sub">Biaya (Individu)</span>
                                <span class="font-bold text-navy">Rp 350.000</span>
                            </div>
                            <div class="flex justify-between items-center text-sm border-b border-gray-50 pb-3">
                                <span class="text-text-sub">Biaya (Beregu)</span>
                                <span class="font-bold text-navy">Rp 500.000</span>
                            </div>
                            <div class="flex justify-between items-center text-sm pb-1">
                                <span class="text-text-sub">Slot Tersedia</span>
                                <span class="font-bold text-primary">45 / 200 Tersisa</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: 77%"></div>
                            </div>
                        </div>
                        <BaseButton v-if="!isManagePage" :to="`/dashboard/events/${tId}/manage`" variant="primary"
                            class="w-full py-4 text-sm uppercase tracking-widest font-black">
                            Control Panel
                        </BaseButton>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-navy mb-4 font-display">Penyelenggara</h3>
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                                <img alt="Perpani" class="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLm2bt_rocjJTBJyLy5egiG9qWTRu9j6JZGiQJiPm8b1G-HSoEuiHPFCrCPBc7qb81krUTSO68P9GueohN-_0IAPQUYSb-Jmd32xXgCNveXoWn0ACR6lV3AFfehy0pYgrdNBVXEyn4uZBaLcOM53xvrj6Nj8lqZdHdDm_sqOirc-36E7u9Qk0pblOTfHJH69INJpXI6D78iO58yfy0HygaJfL6aQRUXwsA6QzEsyDTsfEt6-q4b8f5rl3D59A-pT-X4fXlv7Fm3ng" />
                            </div>
                            <div>
                                <h4 class="font-bold text-navy text-sm">Perpani DKI Jakarta</h4>
                                <p class="text-xs text-text-sub flex items-center gap-1">Penyelenggara Terverifikasi
                                    <span class="material-symbols-outlined text-[14px] text-blue-500">verified</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button
                                class="flex-1 py-2 border border-gray-100 rounded-lg text-sm font-bold text-navy hover:bg-gray-50 transition-colors">Kontak</button>
                            <button
                                class="flex-1 py-2 border border-gray-100 rounded-lg text-sm font-bold text-navy hover:bg-gray-50 transition-colors">Ikuti</button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    </div>
</template>

<script setup>
const route = useRoute()
const tId = route.params.id || '1'

const isManagePage = computed(() => {
    return route.path.endsWith('/manage')
})

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
