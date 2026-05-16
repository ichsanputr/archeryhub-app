<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-5">
            <div class="size-12 rounded-2xl bg-navy flex items-center justify-center shrink-0 shadow-lg">
                <Icon icon="ph:gear-six-bold" class="text-primary text-2xl" />
            </div>
            <div>
                <h1 class="text-xl sm:text-2xl font-black text-navy tracking-tight leading-none capitalize">Pengaturan akun</h1>
                <div class="text-[10px] text-gray-400 font-bold mt-1 tracking-wide capitalize">Kelola kredensial dan keamanan akun Anda</div>
            </div>
        </div>

        <!-- Settings Nav Tabs -->
        <div class="flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto no-scrollbar">
            <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
                :class="activeTab === tab.value ? 'bg-white shadow-sm text-navy' : 'text-gray-500 hover:text-navy hover:bg-white/50'"
                class="flex items-center justify-center gap-2 flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-sm font-black transition-all">
                <Icon :icon="tab.icon" class="text-base" />
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <!-- Keamanan Tab Content -->
        <div v-if="activeTab === 'security'"
            class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">

            <div>
                <h3 class="text-xl font-bold text-navy mb-2">Keamanan & Login</h3>
                <div class="text-gray-500 text-sm mb-6">Kelola kredensial, email, dan metode login akun Anda</div>

                <!-- Email Change Section -->
                <div class="mb-8">
                    <h4 class="text-sm font-black text-navy tracking-widest mb-4 flex items-center gap-2">
                        <Icon icon="ph:envelope-simple-open-bold" class="text-primary" />
                        Ubah Alamat Email
                    </h4>

                    <div class="space-y-4 max-w-xl">
                        <div>
                            <label class="label-xs">Email Saat Ini</label>
                            <div
                                class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 font-medium">
                                <Icon icon="ph:envelope-bold" />
                                {{ userData?.email }}
                            </div>
                        </div>

                        <div v-if="!otpSent">
                            <label class="label-xs">Email Baru</label>
                            <div class="flex gap-2">
                                <div class="relative flex-1">
                                    <Icon icon="ph:at-bold"
                                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input v-model="emailForm.new_email" type="email"
                                        placeholder="email-baru@example.com"
                                        class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                                </div>
                                <BaseButton variant="primary" size="md" @click="requestOTP" :loading="isRequestingOTP"
                                    :disabled="!emailForm.new_email">
                                    Kirim OTP
                                </BaseButton>
                            </div>
                            <div class="text-[10px] text-gray-400 mt-2">Kami akan mengirimkan kode verifikasi ke email
                                baru Anda untuk
                                memastikan kepemilikan.</div>
                        </div>

                        <div v-else class="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                            <div class="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
                                <Icon icon="ph:info-bold" class="text-primary" />
                                <div class="text-xs text-primary-dark font-medium">Kode OTP telah dikirim ke <strong>{{
                                        emailForm.new_email }}</strong></div>
                            </div>

                            <div>
                                <label class="label-xs">Kode Verifikasi (6 Digit)</label>
                                <div class="flex gap-2">
                                    <div class="relative flex-1">
                                        <Icon icon="ph:key-bold"
                                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input v-model="emailForm.otp" type="text" maxlength="6" placeholder="000000"
                                            class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black tracking-[0.5em] focus:outline-none focus:border-primary transition-all" />
                                    </div>
                                    <BaseButton variant="gold" size="md" @click="verifyEmailChange"
                                        :loading="isVerifyingOTP" :disabled="emailForm.otp.length < 6">
                                        Verifikasi & Ubah
                                    </BaseButton>
                                </div>
                            </div>

                            <button @click="otpSent = false"
                                class="text-xs font-bold text-gray-400 hover:text-navy transition-colors">
                                Gunakan email lain
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Password Status -->
                <div class="p-4 rounded-xl border-2 mb-6"
                    :class="hasPassword ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'">
                    <div class="flex items-center gap-3">
                        <Icon :icon="hasPassword ? 'ph:check-circle-fill' : 'ph:warning-circle-fill'"
                            :class="hasPassword ? 'text-green-500' : 'text-amber-500'" class="text-2xl" />
                        <div>
                            <div class="font-bold" :class="hasPassword ? 'text-green-700' : 'text-amber-700'">
                                {{ passwordStatusLabel }}
                            </div>
                            <div class="text-sm" :class="hasPassword ? 'text-green-600' : 'text-amber-600'">
                                {{ passwordStatusDescription }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Connected Login Methods -->
                <div class="mb-8">
                    <h4 class="text-sm font-black text-navy  tracking-widest mb-4 flex items-center gap-2">
                        <Icon icon="ph:link-bold" class="text-primary" />
                        Metode Login Terhubung
                    </h4>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                    <Icon icon="flat-color-icons:google" class="text-xl" />
                                </div>
                                <div>
                                    <div class="font-bold text-navy">Google Login</div>
                                    <div class="text-xs text-gray-400">Hubungkan untuk login lebih cepat</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span v-if="userData?.google_id"
                                    class="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">Terhubung</span>
                                <template v-else>
                                    <span
                                        class="px-3 py-1 bg-gray-200 text-gray-500 text-xs font-bold rounded-full mr-2">Tidak
                                        Terhubung</span>
                                    <BaseButton variant="outline" size="sm" @click="linkGoogle">
                                        Hubungkan
                                    </BaseButton>
                                </template>
                            </div>
                        </div>
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                                    <Icon icon="ph:envelope-bold" class="text-xl text-gray-400" />
                                </div>
                                <div>
                                    <div class="font-bold text-navy">Email & Password</div>
                                    <div class="text-xs text-gray-400">Login manual dengan password</div>
                                </div>
                            </div>
                            <span
                                :class="hasPassword ? 'px-3 py-1 bg-green-100 text-green-600' : 'px-3 py-1 bg-gray-200 text-gray-500'"
                                class="text-xs font-bold rounded-full">
                                {{ hasPassword ? 'Aktif' : 'Belum Aktif' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Change Password Form -->
                <div class="pt-8 border-t border-gray-100">
                    <h4 class="text-sm font-black text-navy tracking-widest mb-6 flex items-center gap-2">
                        <Icon icon="ph:lock-key-bold" class="text-primary" />
                        {{ hasPassword ? 'Ganti Password' : 'Setel Password Akun' }}
                    </h4>

                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <BaseInput v-model="securityForm.new_password" label="Password Baru" type="password"
                                placeholder="••••••••" required />
                            <BaseInput v-model="securityForm.confirm_password" label="Konfirmasi Password Baru"
                                type="password" placeholder="••••••••" required />
                        </div>

                        <div class="pt-4 border-t border-gray-50">
                            <BaseButton variant="primary" size="md" icon="ph:lock-key" @click="changePassword"
                                :loading="isChangingPassword" :disabled="!securityForm.new_password">
                                {{ hasPassword ? 'Perbarui Password' : 'Setel Password' }}
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- TAB: Tema -->
        <div v-show="activeTab === 'theme'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h3 class="text-xl font-black text-navy mb-2 flex items-center justify-between">
                Tema Dashboard
                <Icon v-if="isSyncing" icon="ph:circle-notch" class="animate-spin text-primary" />
            </h3>
            <div class="text-gray-500 text-sm mb-6">Pilih palet warna yang sesuai dengan preferensi Anda</div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(theme, key) in themes" :key="key" role="button"
                    class="relative overflow-hidden rounded-2xl border-2 transition-all group" :class="currentTheme === key
                        ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                        : 'border-gray-100 hover:border-gray-300 bg-white'" @click="currentTheme = key">
                    <!-- Theme Preview Header -->
                    <div class="h-24 w-full flex" :style="{ backgroundColor: theme.sidebarBg }">
                        <div class="w-1/4 h-full border-r border-white/10 flex flex-col gap-2 p-3">
                            <div class="w-full h-2 rounded bg-white/20"></div>
                            <div class="w-2/3 h-2 rounded bg-white/10"></div>
                        </div>
                        <div class="w-3/4 h-full flex flex-col">
                            <div class="h-1/3 w-full bg-white flex items-center px-3">
                                <div class="w-12 h-2 rounded bg-gray-100"></div>
                            </div>
                            <div class="flex-1 p-3">
                                <div class="h-full w-full rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center"
                                    :style="{ color: theme.primary }">
                                    <Icon icon="ph:check-circle-fill" v-if="currentTheme === key" class="text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Theme Info -->
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="font-bold text-navy capitalize">{{ key }}</h4>
                            <div class="flex gap-1">
                                <div class="size-3 rounded-full" :style="{ backgroundColor: theme.primary }"></div>
                                <div class="size-3 rounded-full" :style="{ backgroundColor: theme.sidebarBg }"></div>
                            </div>
                        </div>
                        <div class="text-xs text-gray-400 capitalize">{{ key }} theme for professional look</div>
                    </div>

                    <!-- Selection Indicator -->
                    <div v-if="currentTheme === key"
                        class="absolute top-2 right-2 flex items-center justify-center bg-white rounded-full p-1 shadow-lg">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-xl" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Save Button (Optional depending on tab) -->
    <div v-if="activeTab === 'theme'" class="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
        <BaseButton variant="outline" size="md" @click="resetForm" :loading="isResetting">
            Batal
        </BaseButton>
        <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="saveSettings" :loading="isSavingGeneral">
            Simpan Perubahan
        </BaseButton>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useTheme } from '~/composables/useTheme'

definePageMeta({
    title: 'Pengaturan',
    layout: 'dashboard'
})

useHead({
    title: 'Pengaturan Akun - Archeris Dashboard'
})

const { login, user } = useAuth()
const { get, put } = useApi()
const toast = useToast()
const { currentTheme, themes, isSyncing } = useTheme()
const route = useRoute()

const tabs = [
    { label: 'Keamanan', value: 'security', icon: 'ph:shield-check' },
    { label: 'Tema', value: 'theme', icon: 'ph:palette' },
]

const activeTab = ref('security')
const isRequestingOTP = ref(false)
const isVerifyingOTP = ref(false)
const otpSent = ref(false)
const emailForm = ref({
    new_email: '',
    otp: ''
})
const isSavingAccount = ref(false)
const isSavingGeneral = ref(false)
const isChangingPassword = ref(false)
const isResetting = ref(false)
const userData = ref(null)

const securityForm = ref({
    current_password: '',
    new_password: '',
    confirm_password: ''
})

const hasPassword = computed(() => !!userData.value?.has_password)

const passwordStatusLabel = computed(() => {
    return hasPassword.value ? 'Password Telah Diatur' : 'Password Belum Diatur'
})

const passwordStatusDescription = computed(() => {
    return hasPassword.value
        ? 'Anda dapat login menggunakan kombinasi email dan password.'
        : 'Anda saat ini login menggunakan Google. Setel password untuk mengaktifkan login manual.'
})

const linkGoogle = () => {
    login(user.value?.role || 'archer', { is_linking: 'true' })
}

onMounted(async () => {
    if (route.query.error === 'email_mismatch') {
        toast.error('Gagal menghubungkan: Email Google tidak cocok dengan email akun saat ini.')
    }

    try {
        const response = await get('/user/profile')
        userData.value = response
    } catch (error) {
        console.error('Failed to load user data:', error)
        toast.error('Gagal memuat data pengguna')
    }
})

const resetForm = async () => {
    isResetting.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 600))
        toast.info('Formulir telah direset')
    } finally {
        isResetting.value = false
    }
}

const saveSettings = async () => {
    isSavingGeneral.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('Pengaturan umum berhasil disimpan')
    } catch (error) {
        toast.error('Gagal menyimpan pengaturan')
    } finally {
        isSavingGeneral.value = false
    }
}

const changePassword = async () => {
    if (securityForm.value.new_password !== securityForm.value.confirm_password) {
        toast.error('Konfirmasi password tidak cocok')
        return
    }

    if (securityForm.value.new_password.length < 6) {
        toast.error('Password minimal 6 karakter')
        return
    }

    isChangingPassword.value = true
    try {
        await put('/user/password', {
            new_password: securityForm.value.new_password
        })

        toast.success('Password berhasil diperbarui')

        securityForm.value = {
            current_password: '',
            new_password: '',
            confirm_password: ''
        }

        if (userData.value) {
            userData.value.has_password = true
        }
    } catch (error) {
        console.error('Failed to change password:', error)
        const errorMessage = error?.data?.error || 'Gagal memperbarui password'
        toast.error(errorMessage)
    } finally {
        isChangingPassword.value = false
    }
}

const requestOTP = async () => {
    if (!emailForm.value.new_email) return
    isRequestingOTP.value = true
    try {
        const { post } = useApi()
        await post('/user/request-email-change', {
            new_email: emailForm.value.new_email
        })
        otpSent.value = true
        toast.success('Kode OTP telah dikirim ke email baru Anda')
    } catch (error) {
        const errorMsg = error?.data?.error || 'Gagal mengirim OTP'
        toast.error(errorMsg)
    } finally {
        isRequestingOTP.value = false
    }
}

const verifyEmailChange = async () => {
    if (!emailForm.value.otp) return
    isVerifyingOTP.value = true
    try {
        const { post } = useApi()
        const response = await post('/user/verify-email-change', {
            new_email: emailForm.value.new_email,
            otp: emailForm.value.otp
        })

        toast.success(response.message)

        if (userData.value) userData.value.email = emailForm.value.new_email

        otpSent.value = false
        emailForm.value = { new_email: '', otp: '' }
    } catch (error) {
        const errorMsg = error?.data?.error || 'Gagal memverifikasi OTP'
        toast.error(errorMsg)
    } finally {
        isVerifyingOTP.value = false
    }
}
</script>
