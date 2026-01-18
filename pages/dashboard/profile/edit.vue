<template>
    <div class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden flex flex-col relative">
        <!-- Navigation (Simple for Edit Mode) -->
        <nav class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined icon-filled text-xl">target</span>
                        </div>
                        <span class="text-navy text-xl font-bold tracking-tight font-display">Archeryhub.id</span>
                    </NuxtLink>
                </div>
                <div class="flex items-center gap-4">
                    <NuxtLink :to="`/profile/1`"
                        class="text-sm font-bold text-text-sub hover:text-navy transition-colors">
                        Kembali ke Profil
                    </NuxtLink>
                </div>
            </div>
        </nav>

        <form @submit.prevent="saveChanges">
            <!-- Header / Cover Section -->
            <div class="relative bg-navy h-48 md:h-64 group overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-navy/80 z-10 pointer-events-none">
                </div>
                <img alt="Cover Photo" class="w-full h-full object-cover object-center opacity-60 mix-blend-overlay"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o" />
                <div class="absolute top-6 right-6 z-20">
                    <button type="button"
                        class="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-white/20 transition-all">
                        <span class="material-symbols-outlined text-lg">add_a_photo</span>
                        Ganti Sampul
                    </button>
                </div>
                <div class="absolute -bottom-16 left-0 w-full px-4 z-30">
                    <div class="max-w-4xl mx-auto flex items-end">
                        <div class="relative group cursor-pointer">
                            <div
                                class="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-800 relative">
                                <img :src="profileData.avatar" :alt="profileData.name"
                                    class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span class="material-symbols-outlined text-white text-3xl">camera_alt</span>
                                </div>
                            </div>
                            <div
                                class="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <span class="material-symbols-outlined text-primary-light text-sm font-bold">edit</span>
                            </div>
                        </div>
                        <div class="ml-6 mb-16 md:mb-4 pb-2">
                            <h1
                                class="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md font-display">
                                Edit Profil</h1>
                            <p class="text-white/60 text-xs md:text-sm font-medium drop-shadow-sm">Perbarui informasi
                                pribadi dan preferensi Anda.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Form Content -->
            <main class="max-w-4xl mx-auto px-4 pt-24 pb-28 md:pt-20 md:pb-32 space-y-8">
                <!-- Basic Information -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <span
                            class="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold">
                            <span class="material-symbols-outlined">person</span>
                        </span>
                        <div>
                            <h2 class="text-lg font-bold text-navy font-display">Informasi Dasar</h2>
                            <p class="text-sm text-text-sub">Detail pribadi yang akan ditampilkan secara publik.</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="col-span-1">
                            <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Nama
                                Lengkap</label>
                            <input v-model="profileData.name"
                                class="w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary shadow-sm text-sm py-2.5"
                                type="text" />
                        </div>
                        <div class="col-span-1">
                            <label
                                class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Username</label>
                            <div class="flex">
                                <span
                                    class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-400 text-sm">@</span>
                                <input v-model="profileData.username"
                                    class="w-full rounded-r-lg border-gray-200 focus:border-primary focus:ring-primary shadow-sm text-sm py-2.5"
                                    type="text" />
                            </div>
                        </div>
                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Bio
                                Singkat</label>
                            <textarea v-model="profileData.bio"
                                class="w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary shadow-sm text-sm py-2.5"
                                rows="3" placeholder="Ceritakan sedikit tentang Anda..."></textarea>
                            <p class="mt-1 text-[10px] text-text-sub text-right">{{ profileData.bio.length }}/250
                                karakter</p>
                        </div>
                        <div class="col-span-1">
                            <label
                                class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Kewarganegaraan</label>
                            <select v-model="profileData.nationality"
                                class="w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary shadow-sm text-sm py-2.5 cursor-pointer">
                                <option value="INA">Indonesia (INA)</option>
                                <option value="MAS">Malaysia (MAS)</option>
                                <option value="SGP">Singapore (SGP)</option>
                            </select>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Afiliasi
                                Klub</label>
                            <input v-model="profileData.club"
                                class="w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary shadow-sm text-sm py-2.5"
                                type="text" />
                        </div>
                    </div>
                </section>

                <!-- Category & Discipline -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <span
                            class="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold">
                            <span class="material-symbols-outlined">badge</span>
                        </span>
                        <div>
                            <h2 class="text-lg font-bold text-navy font-display">Kategori & Disiplin</h2>
                            <p class="text-sm text-text-sub">Tentukan level kompetisi Anda.</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="col-span-1">
                            <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Jenis
                                Busur Utama</label>
                            <select v-model="profileData.bowType"
                                class="w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary shadow-sm text-sm py-2.5 cursor-pointer">
                                <option value="recurve">Recurve</option>
                                <option value="compound">Compound</option>
                                <option value="barebow">Barebow</option>
                                <option value="standard">Standard Bow</option>
                            </select>
                        </div>
                        <div class="col-span-1">
                            <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">Kategori
                                Usia</label>
                            <select v-model="profileData.ageCategory"
                                class="w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary shadow-sm text-sm py-2.5 cursor-pointer">
                                <option value="U12">Under 12 (U12)</option>
                                <option value="U15">Under 15 (U15)</option>
                                <option value="U18">Under 18 (U18)</option>
                                <option value="U21">Under 21 (U21)</option>
                                <option value="senior">Senior</option>
                            </select>
                        </div>
                    </div>
                </section>

                <!-- Equipment Setup -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <span
                            class="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold">
                            <span class="material-symbols-outlined">build</span>
                        </span>
                        <div>
                            <h2 class="text-lg font-bold text-navy font-display">Konfigurasi Alat</h2>
                            <p class="text-sm text-text-sub">Catat perlengkapan yang Anda gunakan saat ini.</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div v-for="item in equipmentFields" :key="item.key" class="col-span-1">
                            <label class="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">{{
                                item.label }}</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span class="material-symbols-outlined text-gray-400 text-lg">{{ item.icon }}</span>
                                </div>
                                <input v-model="profileData.equipment[item.key]"
                                    class="pl-10 w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary shadow-sm text-sm py-2.5"
                                    type="text" />
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Privacy Settings -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <span
                            class="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold">
                            <span class="material-symbols-outlined">lock</span>
                        </span>
                        <div>
                            <h2 class="text-lg font-bold text-navy font-display">Pengaturan Privasi</h2>
                            <p class="text-sm text-text-sub">Kontrol siapa yang dapat melihat profil Anda.</p>
                        </div>
                    </div>
                    <div class="space-y-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-bold text-navy">Profil Publik</h3>
                                <p class="text-xs text-text-sub mt-1">Izinkan siapa saja melihat profil dan prestasi
                                    Anda.</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input v-model="profileData.isPublic" type="checkbox" class="sr-only peer" />
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                                </div>
                            </label>
                        </div>
                        <div class="border-t border-gray-50"></div>
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-bold text-navy">Tampilkan Statistik</h3>
                                <p class="text-xs text-text-sub mt-1">Tampilkan hasil turnamen dan peralatan Anda secara
                                    publik.</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input v-model="profileData.showStats" type="checkbox" class="sr-only peer" />
                                <div
                                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                                </div>
                            </label>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Sticky Save Bar -->
            <div
                class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 p-4 z-40 transition-transform duration-300">
                <div class="max-w-4xl mx-auto flex items-center justify-end gap-3">
                    <NuxtLink :to="`/profile/1`"
                        class="px-6 py-2.5 rounded-lg text-sm font-bold text-text-sub hover:bg-gray-50 transition-colors">
                        Batal
                    </NuxtLink>
                    <button type="submit"
                        class="px-8 py-2.5 rounded-lg text-sm font-bold bg-primary hover:bg-primary-hover text-navy shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                        <span class="material-symbols-outlined text-lg icon-filled">save</span>
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
const profileData = ref({
    name: 'Arif Dwi Pangestu',
    username: 'arifpangestu',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0',
    bio: 'Professional archer specializing in Recurve. Training for the Olympics. Always aiming for gold.',
    nationality: 'INA',
    club: 'Senayan Archery Club',
    bowType: 'recurve',
    ageCategory: 'senior',
    equipment: {
        riser: 'Hoyt Formula Xi',
        limbs: 'Hoyt Velos',
        arrows: 'Easton X10',
        sight: 'Axcel Achieve XP'
    },
    isPublic: true,
    showStats: true
})

const equipmentFields = [
    { key: 'riser', label: 'Riser', icon: 'straighten' },
    { key: 'limbs', label: 'Limbs', icon: 'architecture' },
    { key: 'arrows', label: 'Arrows', icon: 'arrow_right_alt' },
    { key: 'sight', label: 'Sight', icon: 'visibility' }
]

const saveChanges = () => {
    console.log('Saving profile...', profileData.value)
    // Logic to call API would go here
    alert('Perubahan berhasil disimpan!')
}
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.icon-filled {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
