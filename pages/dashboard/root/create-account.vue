<template>
    <div class="flex flex-col gap-8 max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <NuxtLink to="/dashboard/root"
                    class="size-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-navy hover:border-navy/20 hover:shadow-sm transition-all focus:ring-2 focus:ring-navy/5 outline-none">
                    <Icon icon="ph:caret-left-bold" class="text-xl" />
                </NuxtLink>
                <div>
                    <h1 class="text-2xl font-black text-navy tracking-tight">Buat Akun Baru</h1>
                    <div class="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 mt-0.5">
                        <span>Root Terminal</span>
                        <Icon icon="ph:caret-right-bold" class="text-[8px]" />
                        <span class="text-primary-dark font-black tracking-[0.2em]">Registrasi Manual</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Type Selector -->
        <div
            class="flex p-1.5 bg-gray-100/50 rounded-2xl border border-gray-100 items-center justify-center gap-1.5 backdrop-blur-sm">
            <button v-for="t in types" :key="t.id" @click="form.user_type = t.id; error = ''"
                class="flex-1 flex flex-col items-center gap-2 py-4 px-2 rounded-xl transition-all relative overflow-hidden group outline-none"
                :class="form.user_type === t.id ? 'bg-white shadow-sm shadow-gray-200/50 text-navy border border-gray-100' : 'text-gray-400 hover:text-gray-600 hover:bg-white/30'">
                <div v-if="form.user_type === t.id"
                    class="absolute inset-0 bg-primary/5 pointer-events-none animate-in fade-in duration-500"></div>
                <Icon :icon="t.icon" class="text-2xl transition-all duration-300 group-hover:scale-110"
                    :class="form.user_type === t.id ? 'text-primary' : ''" />
                <span class="text-[9px] font-black tracking-widest">{{ t.label }}</span>
            </button>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 sm:p-10 transition-all">
            <div class="mb-8 border-b border-gray-50 pb-6 flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-black text-navy">Informasi Akun</h3>
                    <div class="text-sm text-gray-400 mt-1">Lengkapi data untuk membuat akun <span
                            class="text-navy font-bold">{{ form.user_type }}</span> baru.</div>
                </div>
                <div class="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-2">
                    <Icon icon="ph:info-bold" class="text-navy" />
                    <span class="text-[10px] font-black tracking-widest text-navy">Mode Root</span>
                </div>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Grid Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black tracking-widest text-gray-500 ml-1">
                            {{ form.user_type === 'seller' ? 'Nama Toko' : 'Nama Lengkap' }}
                        </label>
                        <div class="relative group">
                            <Icon :icon="form.user_type === 'seller' ? 'ph:storefront' : 'ph:user'"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                            <input v-model="form.name" type="text"
                                :placeholder="form.user_type === 'seller' ? 'Contoh: Archery Shop Jakarta' : 'Contoh: Club Panahan Elite'"
                                class="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
                                required />
                        </div>
                    </div>

                    <!-- Unique Field for Organization -->
                    <div v-if="form.user_type === 'organization'"
                        class="space-y-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                        <label class="text-[10px] font-black tracking-widest text-gray-500 ml-1">Akronim</label>
                        <div class="relative group">
                            <Icon icon="ph:file-text"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                            <input v-model="form.acronym" type="text" placeholder="Contoh: PPLM / PERPANI"
                                class="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200" />
                        </div>
                    </div>

                    <!-- Phone Field (Hidden for Org if Acronym takes spot, but user type change might cause issues) -->
                    <!-- I'll keep Phone for everyone for simplicity and usefulness -->
                    <div v-if="form.user_type !== 'organization'" class="space-y-1.5">
                        <label class="text-[10px] font-black tracking-widest text-gray-500 ml-1">Nomor
                            Telepon</label>
                        <div class="relative group">
                            <Icon icon="ph:phone"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                            <input :value="form.phone" @input="form.phone = $event.target.value.replace(/\D/g, '')"
                                type="text" inputmode="numeric" placeholder="08xxxxxxxxxx"
                                class="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
                                :class="form.phone && form.phone.length < 8 ? 'border-red-400' : ''" />
                        </div>
                        <div v-if="form.phone && form.phone.length < 8" class="text-red-500 text-xs font-bold ml-1">
                            Nomor HP minimal 8 digit</div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black tracking-widest text-gray-500 ml-1">Email
                            Registrasi</label>
                        <div class="relative group">
                            <Icon icon="ph:envelope"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                            <input v-model="form.email" type="email" placeholder="email@contoh.com"
                                class="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
                                required />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black tracking-widest text-gray-500 ml-1">Password
                            Inisial</label>
                        <div class="relative group">
                            <Icon icon="ph:lock"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                            <input v-model="form.password" type="text" placeholder="Masukkan password kuat..."
                                class="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
                                required />
                        </div>
                    </div>
                </div>

                <!-- Custom / Extra Fields -->
                <div v-if="form.user_type !== 'seller'"
                    class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div v-if="form.user_type === 'organization'" class="space-y-1.5">
                        <label class="text-[10px] font-black tracking-widest text-gray-500 ml-1">Kota /
                            Domisili</label>
                        <div class="relative group">
                            <Icon icon="ph:map-pin"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                            <input v-model="form.city" type="text" placeholder="Contoh: Jakarta Selatan"
                                class="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-semibold focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200" />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black tracking-widest text-gray-500 ml-1">Masa Trial
                            (Hari)</label>
                        <div class="relative group">
                            <Icon icon="ph:calendar"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                            <input v-model.number="form.trial_days" type="number" min="1" max="365"
                                class="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-navy focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200" />
                        </div>
                        <div class="text-[10px] text-gray-400 ml-1 font-medium italic">Akun akan aktif otomatis dengan
                            paket trial.</div>
                    </div>
                </div>

                <!-- Footer Actions -->
                <div class="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-50">
                    <NuxtLink to="/dashboard/root"
                        class="flex-1 py-4 text-center border border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all tracking-widest">
                        Batalkan
                    </NuxtLink>
                    <button type="submit" :disabled="loading"
                        class="flex-1 py-4 bg-navy text-primary rounded-2xl text-sm font-black hover:bg-navy/90 transition-all shadow-sm shadow-navy/20 disabled:opacity-50 flex items-center justify-center gap-3 tracking-widest">
                        <Icon v-if="loading" icon="ph:spinner-bold" class="animate-spin text-lg" />
                        <Icon v-else icon="ph:check-circle-bold" class="text-lg" />
                        Simpan Akun
                    </button>
                </div>

                <!-- Error Box -->
                <div v-if="error"
                    class="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in shake-1 duration-300">
                    <div class="size-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <Icon icon="ph:warning-circle-fill" class="text-red-500" />
                    </div>
                    <span class="text-xs font-bold text-red-500 leading-relaxed">{{ error }}</span>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const router = useRouter()

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
useHead({ title: 'Buat Akun Baru — Root Terminal' })

const types = [
    { id: 'club', label: 'Club', icon: 'ph:buildings-bold' },
    { id: 'organization', label: 'Organisasi', icon: 'ph:building-office-bold' },
    { id: 'seller', label: 'Seller', icon: 'ph:storefront-bold' }
]

const loading = ref(false)
const error = ref('')
const form = ref({
    user_type: 'club',
    name: '',
    email: '',
    password: '',
    phone: '',
    acronym: '',
    city: '',
    trial_days: 90
})

const submitForm = async () => {
    error.value = ''
    loading.value = true
    try {
        await $fetch(`${apiBaseUrl}/root/dashboard/users`, {
            method: 'POST',
            body: form.value,
            credentials: 'include'
        })

        // Success: Back to list
        router.push('/dashboard/root?success=created')
    } catch (err) {
        error.value = err.data?.error || 'Gagal membuat akun baru. Pastikan email belum terdaftar.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.shake-1 {
    animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
