<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-5">
      <div class="size-12 rounded-2xl bg-navy flex items-center justify-center shrink-0 shadow-lg">
        <Icon icon="ph:credit-card-bold" class="text-primary text-2xl" />
      </div>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-navy tracking-tight leading-none">
          {{ t('organizer_settings_page.tab_payment') }}
        </h1>
        <div class="text-[10px] text-gray-400 font-bold mt-1 tracking-wider">
          {{ t('organizer_settings_page.payment_subtitle') }}
        </div>
      </div>
    </div>

    <!-- Main Payment Configuration Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
      <h3 class="text-xl font-black text-navy mb-2 flex items-center justify-between">
        {{ t('organizer_settings_page.payment_title') }}
        <Icon v-if="savingPayment" icon="ph:circle-notch" class="animate-spin text-primary" />
      </h3>
      <div class="text-gray-500 text-sm mb-6">{{ t('organizer_settings_page.payment_subtitle') }}</div>

      <!-- Currency Configuration -->
      <div class="mb-8 p-6 border border-gray-100 rounded-2xl">
        <h4 class="text-sm font-black text-navy tracking-widest mb-2 flex items-center gap-2">
          <Icon icon="ph:currency-circle-dollar-bold" class="text-primary text-lg" />
          {{ t('organizer_settings_page.org_currency_title') }}
        </h4>
        <div class="text-xs text-gray-500 mb-4">
          {{ t('organizer_settings_page.org_currency_desc') }}
        </div>
        <div class="max-w-xs">
          <BaseSelect v-model="selectedCurrency" :items="currencies"
            item-title="title" item-value="value" :placeholder="t('organizer_settings_page.currency_placeholder')" />
        </div>
      </div>

      <!-- Payment Methods List -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-bold text-gray-700">{{ t('organizer_settings_page.payment_methods_list') }}</label>
          <BaseButton variant="outline" size="xs" @click="addPaymentMethodField">
            <Icon icon="ph:plus-bold" class="mr-1" /> {{ t('organizer_settings_page.add_method') }}
          </BaseButton>
        </div>
        <div v-if="!paymentMethods || paymentMethods.length === 0"
          class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div class="text-xs text-gray-400">{{ t('organizer_settings_page.empty_methods') }}</div>
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
                  <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">{{ t('organizer_settings_page.bank_provider_label') }}</label>
                  <BaseSelect v-model="method.bank_name" :items="paymentMethodOptions"
                    item-title="title" item-value="value" :placeholder="t('organizer_settings_page.select_bank_placeholder')"
                    @update:model-value="(val) => updatePaymentType(index, val)" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">{{ t('organizer_settings_page.account_number_label') }}</label>
                  <input v-model="method.account_number" type="text" placeholder="8000xxxxxxx"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
              </div>
              <div v-if="method.bank_name === 'Custom'" class="grid grid-cols-1 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">{{ t('organizer_settings_page.custom_provider_label') }}</label>
                  <input v-model="method.custom_name" type="text" :placeholder="t('organizer_settings_page.custom_provider_placeholder')"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">{{ t('organizer_settings_page.account_name_label') }}</label>
                  <input v-model="method.account_name" type="text" :placeholder="t('organizer_settings_page.account_name_placeholder')"
                    class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
                <div class="space-y-1 text-right pt-4 flex flex-col justify-center">
                  <span class="text-[10px] font-black text-gray-400 tracking-widest mb-1">{{ t('organizer_settings_page.method_type_label') }}</span>
                  <span class="px-3 py-1 bg-navy text-primary rounded-full text-[10px] font-black w-fit ml-auto capitalize shadow-sm">
                    {{ method.type === 'bank' ? t('organizer_settings_page.type_bank') : method.type === 'qris' ? t('organizer_settings_page.type_qris') : method.type === 'ewallet' ? t('organizer_settings_page.type_ewallet') : method.type === 'international' ? t('organizer_settings_page.type_international') : t('organizer_settings_page.type_custom') }}
                  </span>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] font-black text-gray-400 tracking-widest pl-1">{{ t('organizer_settings_page.instructions_label') }}</label>
                <input v-model="method.instructions" type="text" :placeholder="t('organizer_settings_page.instructions_placeholder')"
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

    <!-- Actions Footer -->
    <div class="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
      <BaseButton variant="outline" size="md" @click="resetForm" :loading="isResetting">
        {{ t('organizer_settings_page.btn_cancel') }}
      </BaseButton>
      <BaseButton variant="gold" size="md" icon="ph:floppy-disk" @click="savePaymentSettings" :loading="savingPayment">
        {{ t('organizer_settings_page.btn_save') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import BaseSelect from '~/components/common/BaseSelect.vue'

const { t } = useI18n()

definePageMeta({
  title: 'Metode Pembayaran',
  layout: 'dashboard'
})

useHead({
  title: () => t('organizer_settings_page.tab_payment') + ' - Archeris Dashboard'
})

const { organizerProfile } = useAuth()
const { get, put } = useApi()
const toast = useToast()

const paymentMethodOptions = computed(() => [
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
  { title: t('organizer_settings_page.swift_transfer'), value: 'International Transfer', icon: 'ph:bank-bold', type: 'bank' },
  { title: t('organizer_settings_page.credit_card'), value: 'Credit Card', icon: 'ph:credit-card-bold', type: 'international' },
  
  // Custom / Other
  { title: t('organizer_settings_page.custom_title'), value: 'Custom', icon: 'ph:dots-three-circle-bold', type: 'custom' },
])

const getPaymentMethodIcon = (bankName) => {
  const method = paymentMethodOptions.value.find(m => m.value === bankName)
  return method ? method.icon : 'ph:credit-card-bold'
}

const getPaymentMethodImage = (bankName) => {
  const method = paymentMethodOptions.value.find(m => m.value === bankName)
  return method ? method.image : null
}

const updatePaymentType = (index, bankName) => {
  const method = paymentMethodOptions.value.find(m => m.value === bankName)
  if (method && paymentMethods.value[index]) {
    paymentMethods.value[index].type = method.type
  }
}

const paymentMethods = ref([])
const savingPayment = ref(false)
const isResetting = ref(false)
const selectedCurrency = ref('IDR')

const currencies = ref([
  { title: 'IDR - Rupiah Indonesia', value: 'IDR', icon: 'circle-flags:id' },
  { title: 'MYR - Ringgit Malaysia', value: 'MYR', icon: 'circle-flags:my' },
  { title: 'SGD - Dolar Singapura', value: 'SGD', icon: 'circle-flags:sg' },
  { title: 'THB - Baht Thailand', value: 'THB', icon: 'circle-flags:th' },
  { title: 'PHP - Peso Filipina', value: 'PHP', icon: 'circle-flags:ph' },
  { title: 'VND - Dong Vietnam', value: 'VND', icon: 'circle-flags:vn' },
  { title: 'AUD - Dolar Australia', value: 'AUD', icon: 'circle-flags:au' },
  { title: 'JPY - Yen Jepang', value: 'JPY', icon: 'circle-flags:jp' },
  { title: 'KRW - Won Korea Selatan', value: 'KRW', icon: 'circle-flags:kr' },
  { title: 'GBP - Pound Sterling', value: 'GBP', icon: 'circle-flags:gb' },
  { title: 'USD - Dolar Amerika Serikat', value: 'USD', icon: 'circle-flags:us' }
])

const countryToCurrency = {
  'Indonesia': 'IDR',
  'Malaysia': 'MYR',
  'Singapore': 'SGD',
  'Thailand': 'THB',
  'Philippines': 'PHP',
  'Vietnam': 'VND',
  'Australia': 'AUD',
  'Japan': 'JPY',
  'South Korea': 'KRW',
  'United Kingdom': 'GBP',
  'United States': 'USD'
}

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
    console.log('[PaymentMethods] Loading organizer settings...')
    const response = await get('/organizers/me')
    const org = response?.data || response
    
    if (org) {
      console.log('[PaymentMethods] Organizer profile loaded:', org)
      // 1. Load Currency from page_settings
      const rawPageSettings = org.page_settings
      if (rawPageSettings) {
        try {
          const parsed = typeof rawPageSettings === 'string' ? JSON.parse(rawPageSettings) : rawPageSettings
          selectedCurrency.value = parsed.currency || countryToCurrency[org.country] || 'IDR'
          console.log('[PaymentMethods] Currency set to:', selectedCurrency.value)
        } catch (e) {
          console.error('[PaymentMethods] Failed to parse page settings', e)
          selectedCurrency.value = countryToCurrency[org.country] || 'IDR'
        }
      } else {
        selectedCurrency.value = countryToCurrency[org.country] || 'IDR'
        console.log('[PaymentMethods] No page settings found, default currency:', selectedCurrency.value)
      }

      // 2. Load Payment Methods from organization_payment_methods table
      try {
        console.log('[PaymentMethods] Fetching payment methods...')
        const bankResponse = await get('/organizers/payment-methods')
        console.log('[PaymentMethods] Raw payment methods response:', bankResponse)
        const accounts = bankResponse?.data || bankResponse
        if (Array.isArray(accounts)) {
          paymentMethods.value = accounts.map(m => ({
            uuid: m.id || m.uuid || Math.random().toString(36).substring(2, 15),
            bank_name: m.bank_name || '',
            custom_name: m.custom_name || '',
            account_number: m.account_number || '',
            account_name: m.account_name || '',
            type: m.type || 'bank',
            instructions: m.instructions || ''
          }))
          console.log('[PaymentMethods] Mapped payment methods:', paymentMethods.value)
        } else {
          console.warn('[PaymentMethods] Payment methods response is not an array:', accounts)
          paymentMethods.value = []
        }
      } catch (bankErr) {
        console.error('[PaymentMethods] Failed to load payment methods:', bankErr)
        paymentMethods.value = []
      }
    } else {
      console.warn('[PaymentMethods] No organizer details returned from API.')
    }
  } catch (error) {
    console.error('[PaymentMethods] Failed to load organizer settings:', error)
  }
}

const savePaymentSettings = async () => {
  savingPayment.value = true
  try {
    // 1. Save Currency in page_settings
    const response = await get('/organizers/me')
    const org = response?.data || response
    
    let currentSettings = {}
    if (org && org.page_settings) {
      try {
        currentSettings = typeof org.page_settings === 'string' ? JSON.parse(org.page_settings) : org.page_settings
      } catch (e) {
        console.error(e)
      }
    }
    
    // Remove legacy payment_methods field from page_settings
    delete currentSettings.payment_methods
    currentSettings.currency = selectedCurrency.value
    
    await put('/organizers/me', {
      page_settings: JSON.stringify(currentSettings)
    })
    
    // 2. Sync payment methods to the separate table organization_payment_methods
    const payload = paymentMethods.value.map((m, idx) => ({
      id: m.uuid,
      bank_name: m.bank_name,
      custom_name: m.custom_name || null,
      account_number: m.account_number,
      account_name: m.account_name,
      type: m.type || 'bank',
      instructions: m.instructions || null,
      is_primary: idx === 0
    }))

    await put('/organizers/payment-methods', payload)
    
    toast.success(t('organizer_settings_page.payment_save_success'))
  } catch (error) {
    console.error('Failed to save payment settings:', error)
    toast.error(t('organizer_settings_page.payment_save_error'))
  } finally {
    savingPayment.value = false
  }
}

const resetForm = async () => {
  isResetting.value = true
  try {
    await loadOrgSettings()
    toast.info(t('organizer_settings_page.reset_info'))
  } finally {
    isResetting.value = false
  }
}

onMounted(() => {
  loadOrgSettings()
})
</script>
