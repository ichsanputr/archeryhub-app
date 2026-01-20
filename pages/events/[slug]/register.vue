<template>
    <div class="min-h-screen bg-background-light font-body text-navy pb-20">
        <!-- Header -->
        <div class="bg-navy relative overflow-hidden py-8">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-navy/90 z-10"></div>
                <img :alt="tournament.name" class="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    :src="tournament.image" />
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav class="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <NuxtLink to="/events" class="hover:text-white transition-colors">Tournaments</NuxtLink>
                    <span class="material-symbols-outlined text-base">chevron_right</span>
                    <NuxtLink :to="`/events/${slug}`" class="hover:text-white transition-colors">{{ tournament.name
                    }}</NuxtLink>
                    <span class="material-symbols-outlined text-base">chevron_right</span>
                    <span class="text-primary font-medium">Registrasi</span>
                </nav>
                <h1 class="text-white text-3xl font-black tracking-tight">Formulir Pendaftaran</h1>
            </div>
        </div>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 -mt-4 relative z-30">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                <!-- Form Column -->
                <div class="lg:col-span-2 space-y-6">
                    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                                <span
                                    class="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-primary text-xs">1</span>
                                Data Atlet
                            </h2>
                        </div>

                        <form @submit.prevent="handleSubmit" class="p-6 md:p-8 space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="text-sm font-bold text-gray-700">Nama Lengkap (Sesuai KTP/SIA)</label>
                                    <input v-model="form.athleteName" type="text" required
                                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Masukkan nama lengkap">
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-bold text-gray-700">Email</label>
                                    <input v-model="form.athleteEmail" type="email" required
                                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="email@example.com">
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-bold text-gray-700">Nomor WhatsApp</label>
                                    <input v-model="form.athletePhone" type="tel" required
                                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="0812xxxx">
                                </div>
                                <div class="space-y-2">
                                    <label class="text-sm font-bold text-gray-700">Klub / Pengkab / Provinsi</label>
                                    <input v-model="form.clubName" type="text"
                                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Nama klub">
                                </div>
                            </div>

                            <div class="pt-6 border-t border-gray-100">
                                <h2 class="text-lg font-bold text-navy flex items-center gap-2 mb-6">
                                    <span
                                        class="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-primary text-xs">2</span>
                                    Kategori Pertandingan
                                </h2>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class="text-sm font-bold text-gray-700">Divisi</label>
                                        <select v-model="form.division" required
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white appearance-none">
                                            <option value="" disabled>Pilih Divisi</option>
                                            <option v-for="div in divisions" :key="div.id" :value="div.name">{{ div.name
                                            }}</option>
                                        </select>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-sm font-bold text-gray-700">Kategori</label>
                                        <select v-model="form.category" required
                                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white appearance-none">
                                            <option value="" disabled>Pilih Kategori</option>
                                            <option v-for="cat in filteredCategories" :key="cat" :value="cat">{{ cat }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-sm font-bold text-gray-700">Jenis Busur</label>
                                        <div class="grid grid-cols-2 gap-3">
                                            <label v-for="bow in bowTypes" :key="bow.id"
                                                class="relative flex items-center p-3 border rounded-xl cursor-pointer hover:border-primary transition-all"
                                                :class="form.bowType === bow.id ? 'border-primary bg-primary/5' : 'border-gray-200'">
                                                <input v-model="form.bowType" type="radio" :value="bow.id"
                                                    class="sr-only">
                                                <span class="text-sm font-bold"
                                                    :class="form.bowType === bow.id ? 'text-navy' : 'text-gray-500'">{{
                                                        bow.name }}</span>
                                                <span v-if="form.bowType === bow.id"
                                                    class="absolute top-2 right-2 text-primary">
                                                    <span class="material-symbols-outlined text-sm">check_circle</span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-8">
                                <button type="submit" :disabled="loading"
                                    class="w-full py-4 bg-primary hover:bg-primary-hover text-navy font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span v-if="loading" class="animate-spin material-symbols-outlined">sync</span>
                                    <span v-else class="material-symbols-outlined">how_to_reg</span>
                                    Lanjutkan ke Pembayaran
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                <!-- Summary Sidebar -->
                <aside class="space-y-6">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <h3 class="text-lg font-bold text-navy mb-4">Ringkasan Biaya</h3>
                        <div class="space-y-4 mb-6">
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-gray-500">Biaya Pertandingan</span>
                                <span class="font-bold text-navy">IDR 350.000</span>
                            </div>
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-gray-500">Biaya Admin Platform</span>
                                <span class="font-bold text-navy">IDR 5.000</span>
                            </div>
                            <div class="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span class="text-base font-bold text-navy">Total Bayar</span>
                                <span class="text-xl font-black text-primary">IDR 355.000</span>
                            </div>
                        </div>

                        <div class="p-4 bg-gray-50 rounded-xl space-y-3">
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-green-500 text-lg">verified_user</span>
                                <div>
                                    <p class="text-xs font-bold text-navy">Pembayaran Aman</p>
                                    <p class="text-[10px] text-gray-500">Proses pembayaran dienkripsi SSL 256-bit.</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-blue-500 text-lg">info</span>
                                <div>
                                    <p class="text-xs font-bold text-navy">Konfirmasi Instan</p>
                                    <p class="text-[10px] text-gray-500">Status otomatis terupdate setelah pembayaran.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'landing'
})

const route = useRoute()

const router = useRouter()
const slug = route.params.slug
const payment = usePayment()
const auth = useAuth()

const loading = ref(false)

const form = ref({
    athleteName: auth.user.value?.full_name || '',
    athleteEmail: auth.user.value?.email || '',
    athletePhone: '',
    clubName: '',
    division: '',
    category: '',
    bowType: 'recurve'
})

const tournament = {
    name: 'Indonesian Open Championship 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o'
}

const divisions = [
    { id: 1, name: 'Recurve', categories: ["U-12", "U-15", "Umum", "Master"] },
    { id: 2, name: 'Compound', categories: ["Umum", "Master"] },
    { id: 3, name: 'Barebow', categories: ["Umum", "Master"] }
]

const bowTypes = [
    { id: 'recurve', name: 'Recurve' },
    { id: 'compound', name: 'Compound' },
    { id: 'barebow', name: 'Barebow' },
    { id: 'traditional', name: 'Traditional' }
]

const filteredCategories = computed(() => {
    const selectedDiv = divisions.find(d => d.name === form.value.division)
    return selectedDiv ? selectedDiv.categories : []
})

const handleSubmit = async () => {
    if (!auth.isAuthenticated.value) {
        router.push(`/auth/login?redirect=${route.fullPath}`)
        return
    }

    loading.value = true
    try {
        const res = await payment.registerTournament('indonesian-open-2024', {
            athlete_name: form.value.athleteName,
            athlete_email: form.value.athleteEmail,
            athlete_phone: form.value.athletePhone,
            club_name: form.value.clubName,
            division: form.value.division,
            category: form.value.category,
            bow_type: form.value.bowType
        })

        // Redirect to payment page
        router.push(`/events/${slug}/payment?reg=${res.id}`)
    } catch (error) {
        alert('Gagal melakukan pendaftaran. Silakan coba lagi.')
    } finally {
        loading.value = false
    }
}

useSeoMeta({
    title: 'Registrasi Turnamen - Archeryhub.id',
    description: 'Daftar turnamen panahan Indonesian Open 2024'
})
</script>
