<template>
    <div class="md:col-span-2 lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
        <div
            class="relative overflow-hidden group bg-navy rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 flex-1 min-h-[240px] sm:min-h-[280px]">
            <div
                class="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50 z-0">
            </div>
            <div class="relative z-10">
                <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-navy mb-5">
                    <Icon icon="ph:user-plus-bold" class="text-xl" />
                </div>
                <h3 class="text-lg sm:text-2xl font-black text-white mb-2 font-display">Gabung Jadi Pemanah
                </h3>
                <div class="text-white/60 text-sm mb-6">Bikin profil prestasi dan ikut event seru
                    se-Indonesia.
                </div>
            </div>
            <div class="relative z-10">
                <NuxtLink to="/auth/register?type=archer"
                    class="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-6 py-3 rounded-xl transition-all">
                    Daftar Sekarang
                    <Icon icon="ph:arrow-right-bold" class="text-lg" />
                </NuxtLink>
            </div>
        </div>

        <div
            class="relative overflow-hidden group bg-white border border-border-subtle rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 flex-1 min-h-[240px] sm:min-h-[280px]">
            <div class="relative z-10">
                <div class="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white mb-5">
                    <Icon icon="ph:buildings-bold" class="text-xl" />
                </div>
                <h3 class="text-lg sm:text-2xl font-black text-navy mb-2 font-display">Penyelenggara</h3>
                <div class="text-text-sub text-sm mb-6">Kelola penyelenggara kamu, buat event sebanyaknya.</div>
            </div>
            <div class="relative z-10">
                <NuxtLink to="/auth/register?type=organizer"
                    class="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-bold px-6 py-3 rounded-xl transition-all">
                    Bikin Akun Penyelenggara
                    <Icon icon="ph:arrow-right-bold" class="text-lg" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
// No props or logic needed for now
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.border-border-subtle {
    border-color: #e5e7eb;
}
</style>
