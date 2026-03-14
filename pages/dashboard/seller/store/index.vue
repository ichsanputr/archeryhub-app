<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="flex items-center gap-5">
        <div class="size-12 rounded-2xl bg-navy flex items-center justify-center shrink-0 shadow-lg">
          <Icon icon="ph:storefront-bold" class="text-primary text-2xl" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-navy tracking-tight leading-none capitalize">Profil Toko</h1>
          <div class="text-[10px] text-gray-400 font-bold mt-1 tracking-wide capitalize">Atur data publik dan tampilan toko anda</div>
        </div>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="outline" size="sm" icon="ph:eye" @click="viewStore"
          class="h-11 px-6 font-black capitalize tracking-widest text-[10px] !rounded-xl">
          Pratinjau toko
        </BaseButton>
        <BaseButton variant="primary" :loading="loading" @click="handleUpdate" icon="ph:floppy-disk"
          class="h-11 px-6 shadow-lg shadow-primary/20 font-black capitalize tracking-widest text-[10px] !rounded-xl">
          {{ loading ? 'Menyimpan...' : 'Simpan perubahan' }}
        </BaseButton>
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
              Identitas visual
            </h3>
            
            <div class="space-y-6">
              <!-- Banner Selection -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-[10px] font-black text-navy/30 capitalize tracking-widest">Banner profil (hero)</div>
                  </div>
                  <BaseButton @click="openMedia('banner')" variant="outline" size="xs" icon="ph:pencil-simple"
                    class="h-8 px-4 font-black text-[9px] tracking-widest !rounded-lg">
                    Ganti Banner
                  </BaseButton>
                </div>
                <div class="relative aspect-[21/9] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group transition-all hover:border-primary/30">
                  <img v-if="form.banner" :src="form.banner" class="w-full h-full object-cover" />
                  <div v-else class="text-center">
                    <Icon icon="ph:image-square-bold" class="text-3xl text-gray-200 mx-auto mb-2" />
                    <div class="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Format 21:9 disarankan</div>
                  </div>
                </div>
              </div>

              <!-- Logo Selection -->
              <div class="space-y-4 pt-4 border-t border-gray-50">
                <div class="text-[10px] font-black text-navy/30 capitalize tracking-widest">Logo toko</div>
                <div class="flex items-center gap-6">
                  <div class="size-24 rounded-2xl bg-gray-50 border-4 border-white shadow-md overflow-hidden shrink-0 relative group flex items-center justify-center">
                    <img v-if="form.logo" :src="form.logo" class="w-full h-full object-cover" />
                    <Icon v-else icon="ph:storefront-bold" class="text-3xl text-gray-200" />
                    <div class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      @click="openMedia('logo')">
                      <Icon icon="ph:camera-bold" class="text-white text-2xl" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <h5 class="text-xs font-black text-navy capitalize">Store logo</h5>
                    <div class="text-[10px] text-gray-500 max-w-[160px]">Rasio 1:1 direkomendasikan. Format transparan (PNG) lebih baik.</div>
                    <BaseButton variant="outline" size="xs" icon="ph:pencil-simple" @click="openMedia('logo')">
                      Ganti Logo
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
              Data toko
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <BaseInput v-model="form.name" label="Nama Toko" placeholder="Nama brand atau toko anda" required />
              </div>
              <div class="md:col-span-2">
                <BaseInput v-model="form.username" label="Username / Link Toko" placeholder="toko-saya" required prefix="archeryhub.id/s/" />
              </div>
              <div class="md:col-span-2">
                <BaseTextarea v-model="form.description" label="Deskripsi Toko" placeholder="Ceritakan tentang toko anda..." rows="4" />
              </div>
            </div>
          </div>
        </div>

        <!-- Contact & Social Section -->
        <div v-if="activeTab === 'contact'" class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 class="text-sm font-black text-navy tracking-widest flex items-center gap-2 capitalize">
            <Icon icon="ph:share-network-bold" class="text-primary text-xl" />
            Kontak & sosial
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput v-model="form.email" label="Email Bisnis" placeholder="email@toko.com" icon="ph:envelope-simple-bold" />
            <BaseInput v-model="form.phone" label="Nomor WhatsApp" placeholder="0812xxxx" icon="ph:whatsapp-logo-bold" />
          </div>
        </div>
      </div>

      <!-- Preview Sidebar -->
      <div class="space-y-6">
        <!-- Store Card Preview -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden relative">
          <div class="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          <div class="flex flex-col items-center text-center mt-4">
            <div class="w-24 h-24 rounded-2xl bg-primary/10 border-4 border-white p-1 mb-4 overflow-hidden shadow-lg relative flex items-center justify-center">
              <img v-if="form.logo" :src="form.logo" class="w-full h-full object-cover rounded-xl" />
              <Icon v-else icon="ph:storefront-bold" class="text-primary text-4xl" />
            </div>
            
            <h4 class="font-black text-navy text-lg leading-tight capitalize">{{ form.name || 'Nama toko' }}</h4>
            <div class="flex items-center justify-center gap-1.5 mt-1">
              <span class="text-gray-400 text-xs font-bold tracking-tighter">@{{ form.username || 'username' }}</span>
              <Icon icon="ph:seal-check-fill" class="text-primary text-sm" />
            </div>

            <div v-if="form.description" class="mt-4 px-2">
              <div class="text-xs text-gray-500 italic line-clamp-3">"{{ form.description }}"</div>
            </div>

            <div class="w-full h-px bg-gray-50 my-6"></div>

            <div class="grid grid-cols-2 w-full gap-4">
              <div class="text-center">
                <div class="text-[10px] font-black text-gray-400 tracking-widest capitalize">Produk</div>
                <div class="text-navy font-black">-</div>
              </div>
              <div class="text-center border-l border-gray-50">
                <div class="text-[10px] font-black text-gray-400 tracking-widest capitalize">Rating</div>
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
          <h4 class="font-black text-white mb-3 flex items-center gap-2 capitalize text-xs tracking-widest">Tips optimasi</h4>
          <ul class="text-[10px] space-y-3 text-gray-300 font-bold capitalize tracking-wide">
            <li class="flex gap-2">
              <Icon icon="ph:check-circle-fill" class="text-primary shrink-0 text-base" />
              Gunakan banner resolusi tinggi (21:9) untuk kesan premium.
            </li>
            <li class="flex gap-2">
              <Icon icon="ph:check-circle-fill" class="text-primary shrink-0 text-base" />
              Lengkapi deskripsi toko untuk meningkatkan kepercayaan pembeli.
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
import { Icon } from '@iconify/vue'
import { onMounted, reactive, ref } from 'vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Pengaturan Toko - Dashboard Seller' })

const api = useApi()
const toast = useToast()

const activeTab = ref('basic')
const tabs = [
  { id: 'basic', label: 'Profil Dasar', icon: 'ph:storefront-bold' },
  { id: 'contact', label: 'Kontak & Sosial', icon: 'ph:phone-bold' }
]

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
  phone: ''
})

const fetchStoreData = async () => {
  try {
    const res = await api.get('/sellers/profile')
    const data = res?.data || res
    if (data) {
      form.name = data.name || ''
      form.username = data.username || ''
      form.description = data.description || ''
      form.logo = data.logo || ''
      form.banner = data.banner || ''
      form.email = data.email || ''
      form.phone = data.phone || ''
    }
  } catch (error) {
    console.error('Failed to fetch store profile:', error)
  }
}

const openMedia = (target) => {
  media.target = target
  media.show = true
}

const handleMediaSelect = (url) => {
  if (media.target === 'logo') form.logo = url
  if (media.target === 'banner') form.banner = url
  media.show = false
}

const handleUpdate = async () => {
  loading.value = true
  try {
    await api.put('/sellers/profile', form)
    toast.success('Pengaturan toko berhasil diperbarui')
  } catch (error) {
    toast.error(error?.response?.data?.error || 'Gagal memperbarui pengaturan')
  } finally {
    loading.value = false
  }
}

const viewStore = () => {
  if (form.username) {
    window.open(`/s/${form.username}`, '_blank')
  } else {
    toast.warning('Username toko belum diatur')
  }
}

onMounted(() => {
  fetchStoreData()
})
</script>