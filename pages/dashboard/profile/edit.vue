<template>
    <div class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden flex flex-col relative">
        <!-- Navigation (Simple for Edit Mode) -->
        <nav class="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <NuxtLink to="/" class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-primary">
                            <Icon icon="ph:target-bold" class="text-xl" />
                        </div>
                        <span class="text-navy text-xl font-black tracking-tight font-display">Archeris.net</span>
                    </NuxtLink>
                </div>
                        <div class="flex items-center gap-4">
                            <BaseButton :to="`/dashboard/${userPersona}/profile`" variant="ghost" size="sm" icon="ph:arrow-left">
                                {{ t('profile.edit.back_to_profile', 'Kembali ke Profil') }}
                            </BaseButton>
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
                    <BaseButton type="button" variant="ghost" size="sm" icon="ph:camera-plus"
                        class="bg-black/30 !text-white hover:bg-black/50 backdrop-blur-md border border-white/20">
                        Ganti Sampul
                    </BaseButton>
                </div>
                <div class="absolute -bottom-16 left-0 w-full px-4 z-30">
                    <div class="max-w-4xl mx-auto flex items-end">
                        <div class="relative group cursor-pointer">
                            <div
                                class="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-800 relative">
                                <img :src="profileData.avatar" :alt="profileData.name"
                                    class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Icon icon="ph:camera" class="text-white text-3xl" />
                                </div>
                            </div>
                            <div
                                class="absolute bottom-1 right-1 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white">
                                <Icon icon="ph:pencil-simple-bold" class="text-navy text-lg" />
                            </div>
                        </div>
                        <div class="ml-6 mb-16 md:mb-4 pb-2">
                            <h1
                                class="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md font-display">
                                {{ t('profile.edit.title', 'Edit Profil') }}</h1>
                            <div class="text-white/60 text-xs md:text-sm font-medium drop-shadow-sm">{{ t('profile.edit.subtitle', 'Perbarui informasi pribadi dan preferensi Anda.') }}</div>
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
                            <Icon icon="ph:user" class="text-xl" />
                        </span>
                        <div>
                            <h2 class="text-lg font-bold text-navy font-display">{{ t('profile.edit.basic_info', 'Informasi Dasar') }}</h2>
                            <div class="text-sm text-text-sub">{{ t('profile.edit.basic_info_sub', 'Detail pribadi yang akan ditampilkan secara publik.') }}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BaseInput v-model="profileData.name" label="Nama Lengkap"
                            placeholder="Masukkan nama lengkap kamu" />
                        <BaseInput v-model="profileData.username" label="Username" placeholder="username"
                            icon="ph:at" />
                        <div class="col-span-1 md:col-span-2">
                            <BaseTextarea v-model="profileData.bio" label="Bio Singkat"
                                placeholder="Ceritakan sedikit tentang Anda..." :rows="3" :maxlength="250" />
                        </div>
                        <BaseSelect v-model="profileData.nationality" label="Kewarganegaraan" :options="[
                            { value: 'INA', label: 'Indonesia (INA)' },
                            { value: 'MAS', label: 'Malaysia (MAS)' },
                            { value: 'SGP', label: 'Singapore (SGP)' }
                        ]" />
                        <BaseInput v-model="profileData.club" label="Afiliasi Klub"
                            placeholder="Nama klub panahan kamu" />
                    </div>
                </section>

                <!-- Category & Discipline -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <span
                            class="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold">
                            <Icon icon="ph:identification-card" class="text-xl" />
                        </span>
                        <div>
                            <h2 class="text-lg font-bold text-navy font-display">{{ t('profile.edit.category_discipline', 'Kategori & Disiplin') }}</h2>
                            <div class="text-sm text-text-sub">{{ t('profile.edit.category_sub', 'Tentukan level kompetisi Anda.') }}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BaseSelect v-model="profileData.bowType" label="Jenis Busur Utama" :options="[
                                { value: 'recurve', label: 'Recurve' },
                                { value: 'compound', label: 'Compound' },
                                { value: 'barebow', label: 'Barebow' },
                                { value: 'standard', label: 'Standard Bow' }
                            ]" />
                            <BaseSelect v-model="profileData.ageCategory" :label="t('profile.age_category', 'Kategori Usia')" :options="[
                                { value: 'U12', label: 'Under 12 (U12)' },
                                { value: 'U15', label: 'Under 15 (U15)' },
                                { value: 'U18', label: 'Under 18 (U18)' },
                                { value: 'U21', label: 'Under 21 (U21)' },
                                { value: 'senior', label: 'Senior' }
                            ]" />
                        </div>
                    </div>
                </section>

                <!-- Equipment Setup -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <span
                            class="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold">
                            <Icon icon="ph:wrench" class="text-xl" />
                        </span>
                        <div>
                            <h2 class="text-lg font-bold text-navy font-display">{{ t('profile.edit.equipment_setup', 'Konfigurasi Alat') }}</h2>
                            <div class="text-sm text-text-sub">{{ t('profile.edit.equipment_sub', 'Catat perlengkapan yang Anda gunakan saat ini.') }}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BaseInput v-for="item in equipmentFields" :key="item.key"
                            v-model="profileData.equipment[item.key]" :label="item.label" :icon="item.icon"
                            placeholder="Merk / tipe alat" />
                    </div>
                </section>

                <!-- Privacy Settings -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div class="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                        <span
                            class="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold">
                            <Icon icon="ph:lock-bold" />
                        </span>
                        <div>
                            <h2 class="text-lg font-bold text-navy font-display">{{ t('profile.edit.privacy_settings', 'Pengaturan Privasi') }}</h2>
                            <div class="text-sm text-text-sub">{{ t('profile.edit.privacy_sub', 'Kontrol siapa yang dapat melihat profil Anda.') }}</div>
                        </div>
                    </div>
                    <div class="space-y-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-bold text-navy">{{ t('profile.edit.privacy_public', 'Profil Publik') }}</h3>
                                <div class="text-xs text-text-sub mt-1">{{ t('profile.edit.privacy_public_sub', 'Izinkan siapa saja melihat profil dan prestasi Anda.') }}</div>
                            </div>
                            <BaseCheckbox v-model="profileData.isPublic" />
                        </div>
                        <div class="border-t border-gray-50"></div>
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-bold text-navy">{{ t('profile.edit.privacy_stats', 'Tampilkan Statistik') }}</h3>
                                <div class="text-xs text-text-sub mt-1">{{ t('profile.edit.privacy_stats_sub', 'Tampilkan hasil turnamen dan peralatan Anda secara publik.') }}</div>
                            </div>
                            <BaseCheckbox v-model="profileData.showStats" />
                        </div>
                    </div>
                </section>
            </main>

            <!-- Sticky Save Bar -->
            <div
                class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 p-4 z-40 transition-transform duration-300">
                <div class="max-w-4xl mx-auto flex items-center justify-end gap-3">
                    <BaseButton :to="`/dashboard/${userPersona}/profile`" variant="ghost" size="md">
                        {{ t('profile.edit.cancel', 'Batal') }}
                    </BaseButton>
                    <BaseButton type="submit" variant="gold" size="lg" icon="ph:floppy-disk">
                        {{ t('profile.edit.save_changes', 'Simpan Perubahan') }}
                    </BaseButton>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()
const toast = useToast()

useHead({
    title: computed(() => t('profile.edit.head_title'), 'Edit Profil - Archeris Dashboard')
})

const profileData = ref({
    name: 'Arif Dwi Pangestu',
    username: 'arifpangestu',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0',
    bio: 'Professional archer specializing in Recurve. Training for the Olympics. Always aiming for gold.',
    nationality: 'INA',
    club: 'Senayan Archery Club',
    bowType: 'recurve',
    bowDrawWeight: '44 lbs',
    arrows: 'Easton X10',
    sight: 'Axcel Achieve XP'
})

const equipment = ref({
    riser: 'Hoyt Formula Xi',
    limbs: 'Hoyt Velos 44 lbs',
    arrows: 'Easton X10',
    sight: 'Axcel Achieve XP'
})

const isPublic = ref(true)
const showStats = ref(true)

const equipmentFields = [
    { key: 'riser', label: 'Riser', icon: 'ph:arrow-fat-line-right' },
    { key: 'limbs', label: 'Limbs', icon: 'ph:sketch-logo' },
    { key: 'arrows', label: 'Arrows', icon: 'ph:navigation-arrow' },
    { key: 'sight', label: 'Sight', icon: 'ph:eye' }
]

const saveChanges = () => {
    console.log('Saving profile...', profileData.value)
    // Logic to call API would go here
    toast.success('Perubahan berhasil disimpan!')
}
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}


.icon-filled {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
