<template>
  <div class="space-y-8">
    <!-- Enhanced Header Section -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4 sm:gap-5">
          <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
            <Icon icon="ph:storefront-bold" class="text-primary text-2xl sm:text-3xl" />
          </div>
          <div>
            <h1 class="text-xl sm:text-3xl font-black tracking-tight leading-tight">{{ t('seller_store.title', 'Profil Toko') }}</h1>
            <div class="text-slate-300 text-xs sm:text-sm font-medium mt-1">{{ t('seller_store.subtitle', 'Kelola informasi publik, branding, dan kontak toko Anda') }}</div>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <BaseButton variant="outline" size="sm" icon="ph:eye-bold" @click="viewStore"
            class="h-11 px-6 font-black tracking-widest text-xs !rounded-xl border-white/20 text-white hover:bg-white/10 transition-all">
            {{ t('seller_store.preview_button', 'Pratinjau Toko') }}
          </BaseButton>
          <BaseButton variant="primary" :loading="loading" @click="handleUpdate" icon="ph:floppy-disk-bold"
            class="h-11 px-6 shadow-lg shadow-primary/20 font-black tracking-widest text-xs !rounded-xl">
            {{ loading ? t('seller_store.saving', 'Menyimpan...') : t('seller_store.save_button', 'Simpan Perubahan') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex gap-1 bg-gray-100/80 rounded-2xl p-1.5 overflow-x-auto no-scrollbar shadow-sm">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="activeTab === tab.id ? 'bg-white shadow text-navy' : 'text-gray-500 hover:text-navy hover:bg-white/50'"
        class="flex items-center justify-center gap-2 flex-1 min-w-[140px] px-5 py-2.5 rounded-xl text-sm font-black transition-all">
        <Icon :icon="tab.icon" class="text-lg" />
        {{ tab.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <div v-if="activeTab === 'basic'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <!-- Visual Branding Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2 capitalize">
              <Icon icon="ph:image-bold" class="text-primary text-xl" />
              {{ t('seller_store.visual_identity', 'Identitas Visual') }}
            </h3>

            <div class="space-y-6">
              <!-- Banner Selection -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-[10px] font-black text-navy/30 capitalize tracking-widest">{{ t('seller_store.banner_label', 'Banner Toko') }}
                    </div>
                  </div>
                  <BaseButton @click="openMedia('banner')" variant="outline" size="xs" icon="ph:pencil-simple"
                    class="h-8 px-4 font-black text-[9px] tracking-widest !rounded-lg">
                    {{ t('seller_store.banner_change', 'Ubah Banner') }}
                  </BaseButton>
                </div>
                <div
                  class="relative aspect-[21/9] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group transition-all hover:border-primary/30">
                  <img v-if="form.banner" :src="useImageOrDefault(form.banner)" class="w-full h-full object-cover" />
                  <div v-else class="text-center">
                    <Icon icon="ph:image-square-bold" class="text-3xl text-gray-200 mx-auto mb-2" />
                    <div class="text-[9px] font-black text-gray-300 tracking-tighter">{{ t('seller_store.banner_format_hint', 'Format: JPG, PNG, WEBP (Maks 5MB)') }}</div>
                  </div>
                </div>
              </div>

              <!-- Logo Selection -->
              <div class="space-y-4 pt-4 border-t border-gray-50">
                <div class="text-[10px] font-black text-navy/30 capitalize tracking-widest">{{ t('seller_store.logo_label', 'Logo Toko') }}</div>
                <div class="flex items-center gap-6">
                  <div
                    class="size-24 rounded-2xl bg-gray-50 border-4 border-white shadow-md overflow-hidden shrink-0 relative group flex items-center justify-center">
                    <img v-if="form.logo" :src="useImageOrDefault(form.logo)" class="w-full h-full object-cover" />
                    <Icon v-else icon="ph:storefront-bold" class="text-3xl text-gray-200" />
                    <div
                      class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      @click="openMedia('logo')">
                      <Icon icon="ph:camera-bold" class="text-white text-2xl" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <h5 class="text-xs font-black text-navy capitalize">{{ t('seller_store.logo_title', 'Logo & Avatar Toko') }}</h5>
                    <div class="text-[10px] text-gray-500 max-w-[160px]">{{ t('seller_store.logo_hint', 'Rasio 1:1 direkomendasikan') }}</div>
                    <BaseButton variant="outline" size="xs" icon="ph:pencil-simple" @click="openMedia('logo')">
                      {{ t('seller_store.logo_change', 'Ubah Logo') }}
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Store Information Section -->
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2 capitalize">
              <Icon icon="ph:user-circle" class="text-navy text-xl" />
              {{ t('seller_store.store_info', 'Informasi Toko') }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <BaseInput v-model="form.name" :label="t('seller_store.name_label', 'Nama Toko')" :placeholder="t('seller_store.name_placeholder', 'Masukkan nama toko Anda')" required />
              </div>
              <div class="md:col-span-2">
                <BaseInput v-model="form.username" :label="t('seller_store.username_label', 'Username / Slug Toko')" :placeholder="t('seller_store.username_placeholder', 'namatoko')" required
                  prefix="archeris.id/s/" />
              </div>
              <div class="md:col-span-2">
                <BaseTextarea v-model="form.description" :label="t('seller_store.description_label', 'Deskripsi Toko')"
                  :placeholder="t('seller_store.description_placeholder', 'Jelaskan toko Anda, produk unggulan, atau layanan')" rows="4" />
              </div>
            </div>
          </div>
        </div>

        <!-- Contact & Social Section -->
        <div v-if="activeTab === 'contact'"
          class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2 capitalize">
            <Icon icon="ph:share-network-bold" class="text-primary text-xl" />
            {{ t('seller_store.contact_social', 'Kontak & Informasi Tambahan') }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput v-model="form.email" :label="t('seller_store.email_label', 'Email Toko')" :placeholder="t('seller_store.email_placeholder', 'email@toko.com')"
              icon="ph:envelope-simple-bold" />
            <BaseInput v-model="form.phone" :label="t('seller_store.phone_label', 'Nomor WhatsApp Toko')" :placeholder="t('seller_store.phone_placeholder', '081234567890')"
              icon="ph:whatsapp-logo-bold" />
          </div>
        </div>
        <!-- Tab 3: Rekening & Pembayaran Manual -->
        <div v-if="activeTab === 'payment'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2 capitalize">
                <Icon icon="ph:bank-bold" class="text-primary text-xl" />
                Rekening & Pembayaran Manual
              </h3>
              <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">Manual Transfer</span>
            </div>

            <div class="text-xs text-gray-500 leading-relaxed">
              {{ t("seller_store_settings.manual_payment_desc") }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput v-model="form.bank_name" :label="t('seller_store_settings.bank_name_label')" :placeholder="t('seller_store_settings.bank_name_placeholder')"
                icon="ph:bank-bold" />
              <BaseInput v-model="form.bank_account_number" :label="t('seller_store_settings.bank_account_number_label')" :placeholder="t('seller_store_settings.bank_account_number_placeholder')"
                icon="ph:credit-card-bold" />
              <div class="md:col-span-2">
                <BaseInput v-model="form.bank_account_holder" :label="t('seller_store_settings.bank_account_holder_label')" :placeholder="t('seller_store_settings.bank_account_holder_placeholder')"
                  icon="ph:user-bold" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-black text-slate-400 tracking-widest mb-2 capitalize">{{ t("seller_store_settings.payment_instructions_label") }}</label>
                <textarea v-model="form.payment_instructions" rows="3"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none text-sm"
                  :placeholder="t('seller_store_settings.payment_instructions_placeholder')"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Sidebar -->
      <div class="space-y-6">
        <!-- Store Card Preview -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
          <div class="relative h-24 bg-navy overflow-hidden">
            <img v-if="form.banner" :src="useImageOrDefault(form.banner)" class="w-full h-full object-cover opacity-80" />
            <div v-else class="absolute inset-0 bg-gradient-to-r from-navy via-navy to-navy/90" style="background-image: var(--motif-pattern); opacity: 0.2;"></div>
            <div class="absolute inset-x-0 top-0 h-1 bg-primary"></div>
          </div>

          <div class="flex flex-col items-center text-center px-6 pb-6 -mt-12 relative z-10">
            <div
              class="w-24 h-24 rounded-2xl bg-white border-4 border-white p-1 mb-3 overflow-hidden shadow-lg relative flex items-center justify-center shrink-0">
              <img v-if="form.logo" :src="useImageOrDefault(form.logo)" class="w-full h-full object-cover rounded-xl" />
              <Icon v-else icon="ph:storefront-bold" class="text-primary text-4xl" />
            </div>

            <h4 class="font-black text-navy text-lg leading-tight capitalize">{{ form.name || t('seller_store.preview_title', 'Nama Toko Anda') }}</h4>
            <div class="flex items-center justify-center gap-1.5 mt-1">
              <span class="text-gray-400 text-xs font-bold tracking-tighter">@{{ form.username || 'username' }}</span>
              <Icon icon="ph:seal-check-fill" class="text-primary text-sm" />
            </div>

            <div v-if="form.bank_name && form.bank_account_number" class="mt-3 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-left w-full">
              <div class="text-[9px] font-black text-blue-800 tracking-wider flex items-center gap-1">
                <Icon icon="ph:bank-bold" /> {{ form.bank_name }}
              </div>
              <div class="text-xs font-mono font-black text-navy">{{ form.bank_account_number }}</div>
              <div class="text-[10px] text-gray-500 truncate">a.n. {{ form.bank_account_holder }}</div>
            </div>

            <div v-if="form.description" class="mt-3 px-2">
              <div class="text-xs text-gray-500 italic line-clamp-3">"{{ form.description }}"</div>
            </div>

            <div class="w-full h-px bg-gray-50 my-5"></div>

            <div class="grid grid-cols-2 w-full gap-4">
              <div class="text-center">
                <div class="text-[10px] font-black text-gray-400 tracking-widest capitalize">{{ t('seller_store.preview_products', 'Produk') }}</div>
                <div class="text-navy font-black">-</div>
              </div>
              <div class="text-center border-l border-gray-50">
                <div class="text-[10px] font-black text-gray-400 tracking-widest capitalize">{{ t('seller_store.preview_rating', 'Rating Toko') }}</div>
                <div class="flex items-center justify-center gap-1">
                  <div class="text-navy font-black">5.0</div>
                  <Icon icon="ph:star-fill" class="text-amber-400 text-[10px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Helpful Tips -->
        <div class="bg-navy rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <Icon icon="ph:lightbulb" class="absolute -right-4 -bottom-4 text-8xl text-white/5 rotate-12" />
          <h4 class="font-black text-white mb-3 flex items-center gap-2 capitalize text-xs tracking-widest">{{ t('seller_store.tips_title', 'Tips Toko Sukses') }}</h4>
          <ul class="text-[10px] space-y-3 text-gray-300 font-bold capitalize tracking-wide">
            <li class="flex gap-2">
              <Icon icon="ph:check-circle-fill" class="text-primary shrink-0 text-base" />
              {{ t('seller_store.tips_banner', 'Gunakan logo dan banner beresolusi tinggi untuk menarik perhatian pembeli.') }}
            </li>
            <li class="flex gap-2">
              <Icon icon="ph:check-circle-fill" class="text-primary shrink-0 text-base" />
              {{ t('seller_store.tips_description', 'Tuliskan deskripsi toko yang jelas dan cantumkan nomor WhatsApp yang aktif.') }}
            </li>
            <li class="flex gap-2">
              <Icon icon="ph:check-circle-fill" class="text-primary shrink-0 text-base" />
              {{ t("seller_store_settings.bank_reminder_desc") }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Media Library Modal -->
    <MediaLibrary v-model:show="media.show" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { Icon } from '@iconify/vue'
import { onMounted, reactive, ref, computed } from 'vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({ layout: 'dashboard' })


useHead({ title: computed(() => `${t('seller_store.title', 'Profil Toko')} - Dashboard Seller`) })

const api = useApi()
const toast = useToast()

const activeTab = ref('basic')
const tabs = computed(() => [
  { id: 'basic', label: t('seller_store.tab_basic', 'Informasi Dasar'), icon: 'ph:storefront-bold' },
  { id: 'contact', label: t('seller_store.tab_contact', 'Kontak & Medsos'), icon: 'ph:phone-bold' },
  { id: 'payment', label: 'Rekening & Pembayaran', icon: 'ph:bank-bold' }
])

const loading = ref(false)
const media = reactive({
  show: false,
  target: '' // 'logo' or 'banner'
})

const form = reactive({
  name: '',
  username: '',
  description: '',
  logo: '',
  banner: '',
  email: '',
  phone: '',
  bank_name: '',
  bank_account_number: '',
  bank_account_holder: '',
  payment_instructions: ''
})

const fetchStoreData = async () => {
  try {
    const res = await api.get('/sellers/profile')
    const data = res?.data || res
    if (data) {
      form.name = data.name || data.store_name || ''
      form.username = data.username || data.store_slug || data.slug || ''
      form.description = data.description || data.store_description || ''
      form.logo = data.logo || data.avatar_url || data.logo_url || ''
      form.banner = data.banner || data.banner_url || ''
      form.email = data.email || ''
      form.phone = data.phone || ''
      form.bank_name = data.bank_name || ''
      form.bank_account_number = data.bank_account_number || ''
      form.bank_account_holder = data.bank_account_holder || ''
      form.payment_instructions = data.payment_instructions || ''
    }
  } catch (error) {
    console.error('Failed to fetch store profile:', error)
  }
}

const openMedia = (target) => {
  media.target = target
  media.show = true
}

const handleMediaSelect = (selected) => {
  const mediaUrl = typeof selected === 'object' && selected !== null ? (selected.url || selected.path || '') : (selected || '')
  if (media.target === 'logo') form.logo = mediaUrl
  if (media.target === 'banner') form.banner = mediaUrl
  media.show = false
}

const handleUpdate = async () => {
  loading.value = true
  try {
    const payload = {
      name: form.name,
      store_name: form.name,
      username: form.username,
      store_slug: form.username,
      slug: form.username,
      description: form.description,
      store_description: form.description,
      logo: form.logo,
      avatar_url: form.logo,
      logo_url: form.logo,
      banner: form.banner,
      banner_url: form.banner,
      email: form.email,
      phone: form.phone,
      bank_name: form.bank_name,
      bank_account_number: form.bank_account_number,
      bank_account_holder: form.bank_account_holder,
      payment_instructions: form.payment_instructions
    }
    await api.put('/sellers/profile', payload)
    toast.success(t('seller_store.success_message', 'Profil toko berhasil diperbarui'))
  } catch (error) {
    toast.error(error?.response?.data?.error || t('seller_store.error_message', 'Gagal memperbarui profil toko'))
  } finally {
    loading.value = false
  }
}

const viewStore = () => {
  if (form.username) {
    window.open(`/s/${form.username}`, '_blank')
  } else {
    toast.warning(t('seller_store.warning_username', 'Username toko belum diatur'))
  }
}

onMounted(() => {
  fetchStoreData()
})
</script>
