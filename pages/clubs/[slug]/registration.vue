<template>
    <div class="min-h-screen bg-gray-50 pb-20">
        <!-- Hero Header (Mini) -->
        <section class="relative w-full bg-navy py-12 overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img v-if="club.bannerUrl" :src="club.bannerUrl" class="w-full h-full object-cover opacity-20" />
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent"></div>
            </div>
            <div class="max-w-3xl mx-auto px-4 relative z-10 text-center text-white">
                <NuxtLink :to="`/clubs/${slug}`"
                    class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-primary transition-colors mb-6">
                    <Icon icon="ph:arrow-left-bold" />
                    Kembali ke Profil
                </NuxtLink>
                <h1 class="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2">Pendaftaran Anggota</h1>
                <p class="text-white/60 font-medium">{{ club.name }}</p>
            </div>
        </section>

        <!-- Registration Form -->
        <main class="max-w-3xl mx-auto px-4 mt-[-2rem] relative z-20">
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div class="p-8 sm:p-12">
                    <form @submit.prevent="handleSubmit" class="space-y-8">
                        <!-- Dynamic Fields -->
                        <div v-for="(field, index) in registrationFields" :key="index" class="space-y-2">
                            <label class="block text-sm font-black text-navy uppercase tracking-wider">
                                {{ field.label }}
                                <span v-if="field.required" class="text-red-500">*</span>
                            </label>

                            <!-- Text / Email / Phone / Number -->
                            <BaseInput v-if="['text', 'email', 'tel', 'number', 'url'].includes(field.type)"
                                v-model="formData[field.name]" :type="field.type" :placeholder="field.placeholder"
                                :required="field.required" />

                            <!-- Textarea -->
                            <BaseTextarea v-else-if="field.type === 'textarea'" v-model="formData[field.name]"
                                :placeholder="field.placeholder" :required="field.required" />

                            <!-- Select -->
                            <BaseSelect v-else-if="field.type === 'select'" v-model="formData[field.name]"
                                :items="field.options" :placeholder="field.placeholder" :required="field.required" />

                            <!-- Checkbox / Multi-select (simplified for now) -->
                            <div v-else-if="field.type === 'checkbox'" class="flex items-center gap-2">
                                <BaseCheckbox v-model="formData[field.name]" :label="field.placeholder" />
                            </div>

                            <p v-if="field.help" class="text-xs text-gray-400 font-medium">{{ field.help }}</p>
                        </div>

                        <!-- Fallback if no fields -->
                        <div v-if="registrationFields.length === 0" class="text-center py-12">
                            <div class="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon icon="ph:info" class="text-3xl text-gray-300" />
                            </div>
                            <p class="text-gray-500 font-medium">Klub ini tidak memiliki formulir pendaftaran khusus.
                                Anda dapat langsung bergabung.</p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                            <BaseButton type="button" variant="outline" class="flex-1" @click="router.back()">
                                Batal
                            </BaseButton>
                            <BaseButton type="submit" variant="primary" class="flex-[2] shadow-xl shadow-primary/20"
                                :loading="isSubmitting" :disabled="registrationFields.length === 0 && !club.id">
                                Kirim Pendaftaran
                            </BaseButton>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Side Info -->
            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                            <Icon icon="ph:shield-check-fill" class="text-xl" />
                        </div>
                        <h4 class="font-black text-navy text-sm uppercase">Privasi Terjamin</h4>
                    </div>
                    <p class="text-xs text-navy/60 leading-relaxed font-medium">Data Anda hanya akan dibagikan kepada
                        pengurus klub untuk proses seleksi dan administrasi keanggotaan.</p>
                </div>
                <div class="bg-navy/5 border border-navy/10 rounded-2xl p-6">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="size-10 bg-navy/20 rounded-xl flex items-center justify-center text-navy">
                            <Icon icon="ph:clock-fill" class="text-xl" />
                        </div>
                        <h4 class="font-black text-navy text-sm uppercase">Proses Persetujuan</h4>
                    </div>
                    <p class="text-xs text-navy/60 leading-relaxed font-medium">Setelah dikirim, mohon tunggu pengurus
                        klub untuk meninjau pendaftaran Anda. Status akan diinfokan via dashboard.</p>
                </div>
            </div>
        </main>

        <AppDialog v-model:show="showSuccessDialog" title="Pendaftaran Terkirim!"
            message="Terima kasih! Pendaftaran Anda telah dikirim dan sedang menunggu persetujuan dari pengurus klub."
            confirm-text="Ke Dashboard" icon="ph:check-circle-fill" @confirm="router.push('/dashboard')" />
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'landing' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { isLoggedIn, user } = useAuth()
const toast = useToast()

const slug = route.params.slug
const isSubmitting = ref(false)
const showSuccessDialog = ref(false)
const formData = reactive({})

// Fetch club registration config
const { data: clubData } = await useAsyncData(`club-reg-${slug}`, () =>
    $fetch(`${config.public.apiBaseUrl}/clubs/${slug}`)
)

const club = computed(() => clubData.value || {})

const registrationFields = computed(() => {
    const configStr = club.value.registration_config
    if (!configStr) return []
    try {
        const parsed = JSON.parse(configStr)
        return Array.isArray(parsed.fields) ? parsed.fields : []
    } catch {
        return []
    }
})

// Initialize formData with default values
onMounted(() => {
    if (!isLoggedIn.value) {
        router.push(`/auth/login?redirect=${route.fullPath}`)
        return
    }

    registrationFields.value.forEach(field => {
        formData[field.name] = field.defaultValue || ''
        if (field.type === 'checkbox') formData[field.name] = !!field.defaultValue
    })
})

const handleSubmit = async () => {
    // Basic validation
    for (const field of registrationFields.value) {
        if (field.required && !formData[field.name]) {
            toast.error(`${field.label} wajib diisi`)
            return
        }
    }

    isSubmitting.value = true
    try {
        await $fetch(`${config.public.apiBaseUrl}/clubs/join/${club.value.id}`, {
            method: 'POST',
            body: {
                registration_data: formData
            },
            headers: {
                'Authorization': `Bearer ${useCookie('auth_token').value}`
            }
        })
        showSuccessDialog.value = true
    } catch (err) {
        toast.error(err.data?.error || 'Gagal mengirim pendaftaran')
    } finally {
        isSubmitting.value = false
    }
}

useHead({
    title: computed(() => `Pendaftaran ${club.value.name || 'Klub'} — Archeryhub.id`)
})
</script>
