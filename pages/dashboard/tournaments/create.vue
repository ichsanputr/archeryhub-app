<template>
  <div class="max-w-4xl mx-auto space-y-10 py-6">
    <!-- Progress Stepper -->
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-black text-navy uppercase italic tracking-tight">Buat Turnamen Baru</h1>
          <p class="text-text-sub font-medium mt-1">Lengkapi detail kompetisi untuk mulai menerima pendaftaran.</p>
        </div>
        <div class="text-right">
          <span class="text-[10px] font-black uppercase text-navy tracking-widest block">{{ steps[currentStep - 1].label
            }}</span>
          <span class="text-[9px] font-bold text-gray-400">Langkah {{ currentStep }} dari {{ steps.length }}</span>
        </div>
      </div>
      <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
        <div v-for="s in steps.length" :key="s" class="h-full flex-grow transition-all duration-500"
          :class="s <= currentStep ? 'bg-primary' : 'bg-gray-100'">
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Step 1: Informasi Dasar -->
      <div v-if="currentStep === 1" class="p-8 md:p-12 space-y-10">
        <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-4">
          <span class="material-symbols-outlined text-[24px] bg-primary/20 p-2 rounded-xl">badge</span>
          <h3 class="text-lg font-black uppercase italic tracking-tight">Identitas Event</h3>
        </div>

        <div class="grid grid-cols-1 gap-8">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Nama Turnamen</label>
            <input v-model="formData.name" type="text" placeholder="Contoh: Kejuaraan Panahan Nasional 2024"
              class="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-300">
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Lokasi & Venue</label>
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">location_on</span>
              <input v-model="formData.location" type="text" placeholder="Masukkan nama tempat atau alamat"
                class="bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-300 w-full">
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-4 pt-4">
            <span class="material-symbols-outlined text-[24px] bg-primary/20 p-2 rounded-xl">calendar_month</span>
            <h3 class="text-lg font-black uppercase italic tracking-tight">Jadwal Pelaksanaan</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Tanggal Mulai</label>
              <input v-model="formData.startDate" type="date"
                class="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Tanggal Selesai</label>
              <input v-model="formData.endDate" type="date"
                class="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-4 pt-4">
            <span class="material-symbols-outlined text-[24px] bg-primary/20 p-2 rounded-xl">description</span>
            <h3 class="text-lg font-black uppercase italic tracking-tight">Detail Tambahan</h3>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Deskripsi Turnamen</label>
            <textarea v-model="formData.description" rows="5"
              placeholder="Jelaskan format pertandingan, aturan, dan info lainnya..."
              class="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-300 resize-none"></textarea>
          </div>
        </div>
      </div>

      <!-- Step 2: Divisi & Kategori -->
      <div v-if="currentStep === 2" class="p-8 md:p-12 space-y-10">
        <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-4">
          <span
            class="material-symbols-outlined text-[24px] bg-primary/20 p-2 rounded-xl">settings_input_component</span>
          <h3 class="text-lg font-black uppercase italic tracking-tight">Divisi & Kategori</h3>
        </div>

        <div class="space-y-6">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pilih divisi yang akan
            dipertandingkan:</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button v-for="div in allDivisions" :key="div.id" @click="toggleDivision(div.id)"
              class="flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-3"
              :class="formData.divisions.includes(div.id) ? 'border-primary bg-primary/5 text-navy shadow-lg' : 'border-gray-50 bg-gray-50/30 text-gray-400 hover:border-gray-100'">
              <span class="material-symbols-outlined text-3xl">{{ div.icon }}</span>
              <span class="text-[10px] font-black uppercase tracking-widest">{{ div.name }}</span>
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kategori Umur & Jarak:</p>
          <div class="flex flex-wrap gap-3">
            <button v-for="cat in allCategories" :key="cat" @click="toggleCategory(cat)"
              class="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all"
              :class="formData.categories.includes(cat) ? 'bg-navy text-primary border-navy shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'">
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Biaya -->
      <div v-if="currentStep === 3" class="p-8 md:p-12 space-y-10">
        <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-4">
          <span class="material-symbols-outlined text-[24px] bg-primary/20 p-2 rounded-xl">payments</span>
          <h3 class="text-lg font-black uppercase italic tracking-tight">Biaya Pendaftaran</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Biaya Per Kategori
              (IDR)</label>
            <input v-model="formData.pricePerCategory" type="number" placeholder="Contoh: 150000"
              class="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
          </div>
          <div v-if="formData.hasTeam" class="flex flex-col gap-2">
            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Biaya Beregu (IDR)</label>
            <input v-model="formData.priceTeam" type="number" placeholder="Contoh: 300000"
              class="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
          </div>
        </div>

        <div class="p-8 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-xs font-black text-navy uppercase tracking-widest">Sediakan Pendaftaran Beregu</span>
              <span class="text-[10px] font-bold text-gray-400">Aktifkan opsi untuk pendaftaran tim/klub</span>
            </div>
            <button @click="formData.hasTeam = !formData.hasTeam"
              class="w-12 h-6 rounded-full relative transition-all duration-300"
              :class="formData.hasTeam ? 'bg-primary' : 'bg-gray-200'">
              <div class="absolute top-1 w-4 h-4 bg-navy rounded-full transition-all duration-300"
                :class="formData.hasTeam ? 'right-1' : 'left-1'"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Pre-launch Summary -->
      <div v-if="currentStep === 4" class="p-8 md:p-12 space-y-10">
        <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-4">
          <span class="material-symbols-outlined text-[24px] bg-primary/20 p-2 rounded-xl">verified</span>
          <h3 class="text-lg font-black uppercase italic tracking-tight">Review & Publikasi</h3>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-1">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nama Event</p>
              <p class="text-lg font-black text-navy uppercase tracking-tight italic">{{ formData.name || 'Belum diisi'
                }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Venue</p>
              <p class="text-sm font-bold text-navy">{{ formData.location || 'Belum diisi' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Jadwal</p>
              <p class="text-sm font-bold text-navy">{{ formData.startDate }} - {{ formData.endDate }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Biaya</p>
              <p class="text-sm font-bold text-navy">Rp{{ formData.pricePerCategory.toLocaleString() }} / Kategori</p>
            </div>
          </div>

          <div class="p-6 bg-primary/10 rounded-2xl border border-primary/20 flex gap-4">
            <span class="material-symbols-outlined text-navy">info</span>
            <p class="text-[11px] font-bold text-navy leading-relaxed">Pastikan semua data sudah benar. Setelah
              dipublikasikan, Anda masih dapat mengubah detail melalui panel kontrol manajemen event.</p>
          </div>
        </div>
      </div>

      <!-- Footer Controls -->
      <div
        class="px-8 md:px-12 py-8 bg-gray-50/50 border-t border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <button v-if="currentStep > 1" @click="currentStep--"
          class="w-full md:w-auto px-10 py-4 rounded-2xl border border-gray-200 bg-white text-navy font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">Kembali</button>
        <div v-else></div>

        <button @click="nextStep"
          class="w-full md:w-auto px-12 py-4 rounded-2xl bg-primary text-navy font-black text-xs uppercase tracking-widest hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group">
          <span>{{ currentStep === 4 ? 'Publikasikan Event' : steps[currentStep].label }}</span>
          <span
            class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const currentStep = ref(1)
const steps = [
  { label: 'Informasi Dasar' },
  { label: 'Divisi & Kategori' },
  { label: 'Biaya & Pendaftaran' },
  { label: 'Selesaikan' }
]

const formData = reactive({
  name: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  divisions: ['recurve'],
  categories: ['U-12', 'Umum'],
  pricePerCategory: 150000,
  priceTeam: 300000,
  hasTeam: false
})

const allDivisions = [
  { id: 'recurve', name: 'Recurve', icon: 'adjust' },
  { id: 'compound', name: 'Compound', icon: 'gps_fixed' },
  { id: 'barebow', name: 'Barebow', icon: 'radio_button_unchecked' },
  { id: 'standard', name: 'Standard Bow', icon: 'architecture' },
]

const allCategories = ['U-12', 'U-15', 'U-21', 'Umum', 'Master', '70m Public', '50m Public', '30m Kids']

const toggleDivision = (id) => {
  const index = formData.divisions.indexOf(id)
  if (index === -1) formData.divisions.push(id)
  else formData.divisions.splice(index, 1)
}

const toggleCategory = (cat) => {
  const index = formData.categories.indexOf(cat)
  if (index === -1) formData.categories.push(cat)
  else formData.categories.splice(index, 1)
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  } else {
    alert('Event dipublikasikan!')
    navigateTo('/tournaments')
  }
}
</script>

<style scoped>
.text-navy {
  color: #0f172a;
}

.text-text-sub {
  color: #4b5563;
}

.bg-navy {
  background-color: #0f172a;
}
</style>
