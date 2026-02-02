<template>
    <div class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden">
        <!-- Hero Section -->
        <div class="bg-navy relative overflow-hidden pb-12">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/95 to-background-light z-10"></div>
                <img alt="Archery Club Background"
                    class="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o" />
            </div>
            <div class="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-24">
                <div class="max-w-3xl">
                    <h1
                        class="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight mb-4 font-display">
                        Cari Klub Panahan Anda
                    </h1>
                    <p class="text-white/70 text-lg mb-8 leading-relaxed">
                        Terhubung dengan komunitas panahan terbaik di Indonesia. Mulai hobi baru atau gabung dengan tim
                        profesional hari ini.
                    </p>
                </div>
            </div>
            <!-- Search Bar Floating overlay -->
            <div class="relative z-30 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                <div class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div class="md:col-span-4">
                            <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Nama
                                Klub</label>
                            <BaseInput v-model="searchQuery" placeholder="Cari klub..." icon="ph:magnifying-glass" />
                        </div>
                        <div class="md:col-span-3">
                            <label
                                class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Provinsi</label>
                            <BaseSelect v-model="province" :options="provinces.map(p => ({ value: p, label: p }))"
                                placeholder="Semua Provinsi" />
                        </div>
                        <div class="md:col-span-3">
                            <label
                                class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Kota</label>
                            <BaseSelect v-model="city" :options="cities.map(c => ({ value: c, label: c }))"
                                placeholder="Semua Kota" />
                        </div>
                        <div class="md:col-span-2">
                            <label
                                class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">Level</label>
                            <BaseSelect v-model="level" :options="[
                                { value: 'Pro', label: 'Pro' },
                                { value: 'Community', label: 'Community' }
                            ]" placeholder="Semua Level" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar: Featured Clubs -->
                <aside class="w-full lg:w-80 flex-shrink-0 space-y-6 order-2 lg:order-1">
                    <div class="bg-navy rounded-2xl shadow-lg overflow-hidden relative">
                        <div class="p-6 relative z-10">
                            <h3 class="text-white font-bold text-lg mb-1 flex items-center gap-2 font-display">
                                <Icon icon="ph:sketch-logo" class="text-primary" />
                                Klub Pilihan
                            </h3>
                            <p class="text-white/40 text-xs mb-6">Klub populer bulan ini</p>
                            <div class="space-y-4">
                                <div v-for="featured in featuredClubs" :key="featured.name"
                                    class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer group">
                                    <div class="flex items-center gap-3 mb-3">
                                        <img :src="featured.logo" alt="Club Logo"
                                            class="w-10 h-10 rounded-full object-cover border-2 border-primary" />
                                        <div>
                                            <h4
                                                class="text-white font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                                                {{ featured.name }}</h4>
                                            <span class="text-white/40 text-xs">{{ featured.location }}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span
                                            :class="featured.level === 'Pro' ? 'bg-primary text-navy' : 'bg-white/20 text-white'"
                                            class="text-[10px] font-bold px-2 py-0.5 rounded">{{ featured.level
                                            }}</span>
                                        <span class="text-white/60 text-xs">{{ featured.members }} anggota</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Main Content: All Clubs Grid -->
                <div class="flex-1 order-1 lg:order-2">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <h2 class="text-2xl font-bold text-navy font-display">Semua Klub <span
                                class="text-text-sub font-normal text-lg ml-2">({{ filteredClubs.length }})</span></h2>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-text-sub">Urutkan:</span>
                            <div class="w-48">
                                <BaseSelect v-model="sortBy" :options="[
                                    { value: 'name', label: 'Nama A-Z' },
                                    { value: 'members', label: 'Anggota Terbanyak' }
                                ]" />
                            </div>
                        </div>
                    </div>

                    <div v-if="filteredClubs.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div v-for="club in filteredClubs" :key="club.id"
                            class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 flex flex-col relative group">
                            <div class="flex items-start gap-4 mb-4">
                                <div
                                    class="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                                    <img :src="club.logo" alt="Logo"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h3
                                        class="text-lg font-bold text-navy leading-tight mb-1 group-hover:text-primary transition-colors font-display">
                                        {{ club.name }}</h3>
                                    <div class="flex items-center gap-1 text-text-sub text-xs">
                                        <Icon icon="ph:map-pin" />
                                        <span>{{ club.city }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-2 mb-6 py-3 border-y border-gray-50">
                                <div class="text-center border-r border-gray-50">
                                    <span class="block font-bold text-navy">{{ club.members }}</span>
                                    <span class="text-[10px] text-text-sub uppercase tracking-wide">Anggota</span>
                                </div>
                                <div class="text-center">
                                    <span
                                        :class="club.level === 'Pro' ? 'bg-primary/10 text-navy' : 'bg-gray-100 text-text-sub'"
                                        class="px-2 py-0.5 rounded font-bold text-[11px]">{{ club.level }}</span>
                                    <span
                                        class="block text-[10px] text-text-sub uppercase tracking-wide mt-0.5">Level</span>
                                </div>
                            </div>
                            <BaseButton variant="primary" block size="md"
                                @click="$router.push(`/dashboard/clubs/${club.id}`)">
                                Lihat Profil
                            </BaseButton>
                        </div>
                    </div>
                    <div v-else class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-100">
                        <Icon icon="ph:users-four" class="text-6xl text-gray-200 mb-4 mx-auto" />
                        <p class="text-text-sub font-medium">Tidak ada klub yang sesuai dengan pencarian Anda.</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const searchQuery = ref('')
const province = ref('')
const city = ref('')
const level = ref('')
const sortBy = ref('name')

useHead({
    title: 'Cari Klub - ArcheryHub'
})

const provinces = ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Bali']
const cities = ['Jakarta Selatan', 'Bandung', 'Surabaya', 'Denpasar']

const clubs = [
    {
        id: 1,
        name: 'Senayan Archery',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        members: 128,
        level: 'Pro',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQStrrmLQN-DtqrTO5KWNF3EvwOXSw-raemHMh-lxMUVAtHiqxHNMqzQoV2l1ReELlRe_dVIAkp1P8Bc8ekRqbhOn-axS6izTQXKw3d70pq-CpZHWUZoS58mGL70U_Bk96ViNRcaOaGr5wIkPrtg8w46mzrAtHgWRH6VKAUalmkrFJ8qjDltkmd-nHJs4aUfrBBphZSnivwOkhoIjzG8dpjeCtp_UOZTOnovXJP7IAWJEeWqw7Uh7-mlLVkorgyeOsSRun6CmO_8I'
    },
    {
        id: 2,
        name: 'Bandung Archery Club',
        city: 'Bandung',
        province: 'Jawa Barat',
        members: 85,
        level: 'Community',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEyoMyPhTl7-9oRbs8Fqz1YZxEwczL3vvrIpNzNHGImIhte8_MRqCsmxPDpeo-GMFv4xD1UFE7CzQuZjLAaeTEFSwwGpLM5Fuuji1ri-DclVPd3XjaiZbP_HVCmNxUF4N4RvPt5eunD3D7XJwRXiE80p0b-XDjG79vpkghLPtwWffcqE__kLuIxrZg_xFXL5tPcnF3V-v_UjBTeSP3GZHOFSZ132JQ3wm91uitNtsctbagveyUjYxxYgEumBV7_uYhaBtTeHfBlCs'
    },
    {
        id: 3,
        name: 'Jogja Istimewa Archery',
        city: 'Yogyakarta',
        province: 'DIY',
        members: 210,
        level: 'Pro',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq8OlQbcxO7uY4gwKVt6JygaktR4FjGZfJwbWiOyDIXqXr0bCnQIn3f-5m63myglDTGxdrpDHrFX2wVGOC7C8INtL7td4RDrpYhrJi0qjxPG7jixXi-Cw0fJQfRMda9sgJhfzCsFLmMhX9mvC6_gNAo5OF_MDtU5ukfm3hvRqWuHC0pbxNqSd0uWfIxLjxHXmyDnRtFg9VIz-XC2tCuvSusJKEFLjs57_DO7_uOGurALxGKsxcgIJmc_0gHV72A6BGvhiStIpWr3o'
    }
]

const featuredClubs = computed(() => {
    return clubs.slice(0, 3).map(c => ({
        name: c.name,
        location: c.city,
        level: c.level,
        logo: c.logo,
        members: c.members
    }))
})

const filteredClubs = computed(() => {
    return clubs.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesProvince = !province.value || c.province === province.value
        const matchesCity = !city.value || c.city === city.value
        const matchesLevel = !level.value || c.level === level.value
        return matchesSearch && matchesProvince && matchesCity && matchesLevel
    }).sort((a, b) => {
        if (sortBy.value === 'name') return a.name.localeCompare(b.name)
        if (sortBy.value === 'members') return b.members - a.members
        return 0
    })
})
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}
</style>
