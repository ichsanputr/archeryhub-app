<template>
    <div
        class="min-h-screen bg-gradient-to-br from-navy-dark via-navy to-navy-light flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <!-- Header -->
            <div class="bg-primary p-6 text-center">
                <div class="flex items-center justify-center gap-3 mb-4">
                    <img v-if="user?.avatar_url" :src="user.avatar_url"
                        class="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                    <div v-else
                        class="w-16 h-16 rounded-full bg-navy-dark flex items-center justify-center text-2xl font-black text-primary">
                        {{ (user?.name || 'U')[0] }}
                    </div>
                </div>
                <h1 class="text-xl font-black text-navy-dark">Selamat Datang, {{ user?.name || 'User' }}!</h1>
                <p class="text-navy/70 text-sm font-medium">Lengkapi profil Anda untuk melanjutkan</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-navy text-sm font-bold mb-2">Email</label>
                        <input type="email" :value="user?.email" disabled
                            class="w-full h-12 px-4 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed" />
                        <p class="text-xs text-gray-400 mt-1">Email dari Google (tidak dapat diubah)</p>
                    </div>

                    <div>
                        <label class="block text-navy text-sm font-bold mb-2">Nomor Telepon <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.phone" type="tel" placeholder="+62 812 3456 7890"
                            class="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-200 text-navy focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>

                    <div>
                        <label class="block text-navy text-sm font-bold mb-2">Tipe Akun <span
                                class="text-red-500">*</span></label>
                        <div class="grid grid-cols-2 gap-3">
                            <label v-for="type in accountTypes" :key="type.value"
                                class="flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all"
                                :class="form.accountType === type.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                                <input type="radio" :value="type.value" v-model="form.accountType" class="hidden" />
                                <span class="material-symbols-outlined text-2xl"
                                    :class="form.accountType === type.value ? 'text-primary' : 'text-gray-400'">{{
                                    type.icon }}</span>
                                <div>
                                    <span class="font-semibold text-navy text-sm block">{{ type.label }}</span>
                                    <span class="text-xs text-gray-400">{{ type.desc }}</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div v-if="form.accountType === 'organization'">
                        <label class="block text-navy text-sm font-bold mb-2">Nama Organisasi <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.organizationName" type="text" placeholder="Nama klub atau organisasi Anda"
                            class="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-200 text-navy focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                </div>

                <button type="submit" :disabled="isSubmitting"
                    class="w-full h-12 rounded-lg bg-navy-dark text-white font-bold hover:bg-navy-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    <span v-if="isSubmitting" class="material-symbols-outlined animate-spin">sync</span>
                    <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan & Lanjutkan' }}</span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'blank'
})

const router = useRouter()
const { user, fetchUser } = useAuth()
const { post } = useApi()

const isSubmitting = ref(false)
const form = reactive({
    phone: '',
    accountType: 'personal',
    organizationName: ''
})

const accountTypes = [
    { value: 'personal', label: 'Personal', icon: 'person', desc: 'Pemanah atau pelatih' },
    { value: 'organization', label: 'Organisasi', icon: 'groups', desc: 'Klub atau penyelenggara' }
]

const handleSubmit = async () => {
    if (!form.phone) {
        alert('Mohon isi nomor telepon')
        return
    }

    if (form.accountType === 'organization' && !form.organizationName) {
        alert('Mohon isi nama organisasi')
        return
    }

    isSubmitting.value = true
    try {
        await post('/user/complete-profile', {
            phone: form.phone,
            user_type: form.accountType,
            organization_name: form.organizationName || null
        })

        await fetchUser()
        router.push('/dashboard')
    } catch (error) {
        console.error('Failed to complete profile:', error)
        alert('Gagal menyimpan profil. Silakan coba lagi.')
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    if (!user.value) {
        router.push('/auth/login')
    }
})
</script>
