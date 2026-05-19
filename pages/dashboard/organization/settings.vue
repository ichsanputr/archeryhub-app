<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-5">
      <div class="size-12 rounded-2xl bg-navy flex items-center justify-center shrink-0 shadow-lg">
        <Icon icon="ph:gear-six-bold" class="text-primary text-2xl" />
      </div>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-navy tracking-tight leading-none ">Pengaturan Akun</h1>
        <div class="text-[10px] text-gray-400 font-bold mt-1 tracking-wider ">Kelola kredensial dan keamanan akun Anda
        </div>
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
                  <Icon icon="ph:at-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input v-model="emailForm.new_email" type="email" placeholder="email-baru@example.com"
                    class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all" />
                </div>
                <BaseButton variant="primary" size="md" @click="requestOTP" :loading="isRequestingOTP"
                  :disabled="!emailForm.new_email">
                  Kirim OTP
                </BaseButton>
              </div>
              <div class="text-[10px] text-gray-400 mt-2">Kami akan mengirimkan kode verifikasi ke email baru Anda untuk
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
                    <Icon icon="ph:key-bold" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="emailForm.otp" type="text" maxlength="6" placeholder="000000"
                      class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-black tracking-[0.5em] focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <BaseButton variant="gold" size="md" @click="verifyEmailChange" :loading="isVerifyingOTP"
                    :disabled="emailForm.otp.length < 6">
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
                <div class="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
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
                  <span class="px-3 py-1 bg-gray-200 text-gray-500 text-xs font-bold rounded-full mr-2">Tidak
                    Terhubung</span>
                  <BaseButton variant="outline" size="sm" @click="linkGoogle">
                    Hubungkan
                  </BaseButton>
                </template>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
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
              <BaseInput v-model="securityForm.confirm_password" label="Konfirmasi Password Baru" type="password"
                placeholder="••••••••" required />
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
                <div
                  class="h-full w-full rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center"
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

    <!-- Tab: Metode Pembayaran -->
    <div v-show="activeTab === 'payment'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
      <h3 class="text-xl font-black text-navy mb-2 flex items-center justify-between">
        Metode Pembayaran Manual
        <Icon v-if="savingPayment" icon="ph:circle-notch" class="animate-spin text-primary" />
      </h3>
      <div class="text-gray-500 text-sm mb-6">Kelola informasi rekening/e-wallet untuk pembayaran transfer manual</div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-bold text-gray-700">Daftar Metode Pembayaran</label>
          <BaseButton variant="outline" size="xs" @click="addPaymentMethodField">
            <Icon icon="ph:plus-bold" class="mr-1" /> Tambah Metode
          </BaseButton>
        </div>
        <div v-if="!paymentMethods || paymentMethods.length === 0"
          class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p class="text-xs text-gray-400">Belum ada metode pembayaran. Tambahkan untuk informasi peserta.</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="(method, index) in paymentMethods" :key="index"
            class="flex flex-col sm:flex-row gap-4 items-start bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all shadow-sm group">
            <div
              class="shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform overflow-hidden p-2">
              <img v-if="getPaymentMethodImage(method.bank_name)"
                :src="getPaymentMethodImage(method.bank_name)"
                class="w-full h-full object-contain" :alt="method.bank_name" />
              <Icon v-else :icon="getPaymentMethodIcon(method.bank_name)"
                class="text-2xl sm:text-3xl text-navy" />
            </div>
            <div class="flex-grow space-y-4 w-full">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">Nama Bank / Provider</label>
                  <BaseSelect v-model="method.bank_name" :items="paymentMethodOptions"
                    item-title="title" item-value="value" placeholder="Pilih Bank/Provider"
                    @update:model-value="(val) => updatePaymentType(index, val)" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">Nomor Rekening / Akun</label>
                  <input v-model="method.account_number" type="text" placeholder="8000xxxxxxx"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
              </div>
              <div v-if="method.bank_name === 'Custom'" class="grid grid-cols-1 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">Nama Provider Kustom (Custom Provider Name)</label>
                  <input v-model="method.custom_name" type="text" placeholder="Contoh: Wise, Revolut, Stripe, dll."
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">Nama Pemilik Rekening</label>
                  <input v-model="method.account_name" type="text" placeholder="Contoh: Muhammad Ali"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
                <div class="space-y-1 text-right pt-4 flex flex-col justify-center">
                  <span class="text-[10px] font-black text-gray-400 tracking-widest mb-1">Tipe Metode</span>
                  <span class="px-3 py-1 bg-navy text-primary rounded-full text-[10px] font-black w-fit ml-auto capitalize shadow-sm">
                    {{ method.type === 'bank' ? 'Bank Transfer' : method.type === 'qris' ? 'QRIS' : method.type === 'ewallet' ? 'E-Wallet' : method.type === 'international' ? 'International' : 'Custom' }}
                  </span>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">Instruksi Tambahan (Opsional)</label>
                <input v-model="method.instructions" type="text" placeholder="Contoh: Lampirkan bukti transfer di form konfirmasi"
                  class="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-500 bg-white" />
              </div>
            </div>
            <button @click="removePaymentMethodField(index)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all self-center sm:mt-4">
              <Icon icon="ph:trash-bold" class="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Save Button (Optional depending on tab) -->
  <div v-if="activeTab === 'theme' || activeTab === 'payment'" class="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
    <BaseButton variant="outline" size="md" @click="resetForm" :loading="isResetting">
      Batal
    </BaseButton>
    <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="saveSettings" :loading="isSavingGeneral || savingPayment">
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
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useTheme } from '~/composables/useTheme'
import BaseSelect from '~/components/common/BaseSelect.vue'

definePageMeta({
  title: 'Pengaturan',
  layout: 'dashboard'
})

useHead({
  title: 'Pengaturan Akun - Archeris Dashboard'
})

const { login, user, organizationProfile } = useAuth()
const { get, put } = useApi()
const toast = useToast()
const { currentTheme, themes, isSyncing } = useTheme()
const route = useRoute()

const tabs = [
  { label: 'Keamanan', value: 'security', icon: 'ph:shield-check' },
  { label: 'Tema', value: 'theme', icon: 'ph:palette' },
  { label: 'Metode Pembayaran', value: 'payment', icon: 'ph:credit-card' },
]

const paymentMethodOptions = [
  // Indonesian Banks
  { title: 'BCA (Bank Central Asia)', value: 'BCA', image: '/payment-method/bca.png', type: 'bank' },
  { title: 'Mandiri', value: 'Mandiri', image: '/payment-method/mandiri.png', type: 'bank' },
  { title: 'BNI (Bank Negara Indonesia)', value: 'BNI', image: '/payment-method/bni.png', type: 'bank' },
  { title: 'BRI (Bank Rakyat Indonesia)', value: 'BRI', image: '/payment-method/bri.png', type: 'bank' },
  { title: 'BSI (Bank Syariah Indonesia)', value: 'BSI', image: '/payment-method/bsi.png', type: 'bank' },
  { title: 'Bank Danamon', value: 'Danamon', image: '/payment-method/danamon.png', type: 'bank' },
  // Indonesian E-Wallets
  { title: 'GoPay', value: 'GoPay', image: '/payment-method/gopay.png', type: 'ewallet' },
  { title: 'OVO', value: 'OVO', image: '/payment-method/ovo.png', type: 'ewallet' },
  { title: 'DANA', value: 'DANA', image: '/payment-method/dana.png', type: 'ewallet' },
  
  // International / Global Methods
  { title: 'PayPal', value: 'PayPal', icon: 'ph:paypal-logo-bold', type: 'international' },
  { title: 'Wise', value: 'Wise', icon: 'ph:globe-bold', type: 'international' },
  { title: 'Revolut', value: 'Revolut', icon: 'ph:credit-card-bold', type: 'international' },
  { title: 'Payoneer', value: 'Payoneer', icon: 'ph:credit-card-bold', type: 'international' },
  { title: 'Bank Transfer (International / SWIFT)', value: 'International Transfer', icon: 'ph:bank-bold', type: 'bank' },
  { title: 'Credit / Debit Card', value: 'Credit Card', icon: 'ph:credit-card-bold', type: 'international' },
  
  // Custom / Other
  { title: 'Lainnya / Custom', value: 'Custom', icon: 'ph:dots-three-circle-bold', type: 'custom' },
]

const getPaymentMethodIcon = (bankName) => {
  const method = paymentMethodOptions.find(m => m.value === bankName)
  return method ? method.icon : 'ph:credit-card-bold'
}

const getPaymentMethodImage = (bankName) => {
  const method = paymentMethodOptions.find(m => m.value === bankName)
  return method ? method.image : null
}

const updatePaymentType = (index, bankName) => {
  const method = paymentMethodOptions.find(m => m.value === bankName)
  if (method && paymentMethods.value[index]) {
    paymentMethods.value[index].type = method.type
  }
}

const paymentMethods = ref([])
const savingPayment = ref(false)

const addPaymentMethodField = () => {
  if (!paymentMethods.value) {
    paymentMethods.value = []
  }
  paymentMethods.value.push({
    uuid: Math.random().toString(36).substring(2, 15),
    bank_name: '',
    custom_name: '',
    account_number: '',
    account_name: '',
    type: 'bank',
    instructions: ''
  })
}

const removePaymentMethodField = (index) => {
  paymentMethods.value.splice(index, 1)
}

const loadOrgSettings = async () => {
  try {
    let org = organizationProfile.value
    if (!org) {
      const response = await get('/organizations/me')
      org = response?.data || response
    }
    if (org) {
      const rawPageSettings = org.page_settings
      if (rawPageSettings) {
        try {
          const parsed = typeof rawPageSettings === 'string' ? JSON.parse(rawPageSettings) : rawPageSettings
          if (parsed.payment_methods) {
            paymentMethods.value = parsed.payment_methods.map(m => ({
              uuid: m.uuid || Math.random().toString(36).substring(2, 15),
              bank_name: m.bank_name || '',
              custom_name: m.custom_name || '',
              account_number: m.account_number || '',
              account_name: m.account_name || '',
              type: m.type || 'bank',
              instructions: m.instructions || ''
            }))
          } else {
            paymentMethods.value = []
          }
        } catch (e) {
          console.error('Failed to parse page settings', e)
        }
      }
    }
  } catch (error) {
    console.error('Failed to load organization settings:', error)
  }
}

const savePaymentSettings = async () => {
  savingPayment.value = true
  try {
    const response = await get('/organizations/me')
    const org = response?.data || response
    
    let currentSettings = {}
    if (org && org.page_settings) {
      try {
        currentSettings = typeof org.page_settings === 'string' ? JSON.parse(org.page_settings) : org.page_settings
      } catch (e) {
        console.error(e)
      }
    }
    
    currentSettings.payment_methods = paymentMethods.value
    
    await put('/organizations/me', {
      page_settings: JSON.stringify(currentSettings)
    })
    
    toast.success('Metode pembayaran berhasil disimpan')
  } catch (error) {
    console.error('Failed to save payment settings:', error)
    toast.error('Gagal menyimpan metode pembayaran')
  } finally {
    savingPayment.value = false
  }
}

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

// Determine user type
const userType = computed(() => userData.value?.user_type || user.value?.role || user.value?.type || 'archer')
const userTypeLabel = computed(() => {
  const labels = { archer: 'Pemanah', organization: 'Organisasi', club: 'Klub', admin: 'Admin', seller: 'Seller' }
  return labels[userType.value] || 'Pengguna'
})
const userTypeIcon = computed(() => {
  const icons = { archer: 'ph:user', organization: 'ph:buildings', club: 'ph:users-three', admin: 'ph:shield-star', seller: 'ph:storefront' }
  return icons[userType.value] || 'ph:user'
})

const accountForm = ref({
  email: '',
  username: '',
  full_name: '',
  phone: '',
  date_of_birth: '',
  gender: '',
  city: '',
  address: '',
  school: '',
  bow_type: ''
})

const initialAccountForm = ref(null)

const linkGoogle = () => {
  login(user.value?.role || 'archer', { is_linking: 'true' })
}

onMounted(async () => {
  // Check for error in query params (e.g. from Google linking)
  if (route.query.error === 'email_mismatch') {
    toast.error('Gagal menghubungkan: Email Google tidak cocok dengan email akun saat ini.')
  }

  try {
    const response = await get('/user/profile')
    userData.value = response
    accountForm.value.email = response.email || ''
    accountForm.value.username = response.username || ''
    accountForm.value.full_name = response.full_name || ''
    accountForm.value.phone = response.phone || ''
    accountForm.value.date_of_birth = response.date_of_birth ? new Date(response.date_of_birth).toISOString().split('T')[0] : ''
    accountForm.value.gender = response.gender || ''
    accountForm.value.city = response.city || ''
    accountForm.value.address = response.address || ''
    accountForm.value.school = response.school || ''
    accountForm.value.bow_type = response.bow_type || ''

    // Store for reset
    initialAccountForm.value = JSON.parse(JSON.stringify(accountForm.value))
  } catch (error) {
    console.error('Failed to load user data:', error)
    toast.error('Gagal memuat data pengguna')
  }

  await loadOrgSettings()
})

const saveAccountInfo = async () => {
  isSavingAccount.value = true
  try {
    await put('/user/profile', {
      username: accountForm.value.username,
      full_name: accountForm.value.full_name,
      phone: accountForm.value.phone,
      date_of_birth: accountForm.value.date_of_birth,
      gender: accountForm.value.gender,
      city: accountForm.value.city,
      address: accountForm.value.address,
      school: accountForm.value.school,
      bow_type: accountForm.value.bow_type
    })
    toast.success('Informasi akun berhasil disimpan')

    // Update reset checkpoint
    initialAccountForm.value = JSON.parse(JSON.stringify(accountForm.value))

    // Update local user data if needed
    if (userData.value) {
      userData.value.username = accountForm.value.username
      userData.value.full_name = accountForm.value.full_name
    }
  } catch (error) {
    console.error('Failed to save account info:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal menyimpan informasi'
    toast.error(errorMessage)
  } finally {
    isSavingAccount.value = false
  }
}

const resetForm = async () => {
  if (activeTab.value === 'payment') {
    isResetting.value = true
    try {
      await loadOrgSettings()
      toast.info('Formulir telah direset ke data asli')
    } finally {
      isResetting.value = false
    }
    return
  }

  if (!initialAccountForm.value) return

  isResetting.value = true
  try {
    // Simulate minor delay for UX
    await new Promise(resolve => setTimeout(resolve, 600))
    accountForm.value = JSON.parse(JSON.stringify(initialAccountForm.value))
    toast.info('Formulir telah direset ke data asli')
  } finally {
    isResetting.value = false
  }
}

const saveSettings = async () => {
  if (activeTab.value === 'payment') {
    await savePaymentSettings()
    return
  }

  isSavingGeneral.value = true
  // This is for general settings like language, timezone, notifications
  try {
    // In the future, this should save to /user/settings
    // await put('/user/settings', settings.value)

    // For now, simulate API call
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

    // Reset form
    securityForm.value = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }

    // Update has_password status locally
    if (userData.value) {
      userData.value.has_password = true
    }
  } catch (error) {
    console.error('Failed to change password:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || 'Gagal memperbarui password'
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

    // Refresh user data to show new email
    if (userData.value) userData.value.email = emailForm.value.new_email

    // Reset form
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
