<template>
  <div class="space-y-8">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col gap-6">
      <nav class="flex flex-wrap gap-2 items-center">
        <NuxtLink to="/dashboard" class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">
          Dashboard</NuxtLink>
        <span class="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
        <NuxtLink to="/dashboard/tournaments"
          class="text-gray-500 hover:text-primary-hover text-sm font-medium transition-colors">Events</NuxtLink>
        <span class="material-symbols-outlined text-gray-300 text-sm">chevron_right</span>
        <span class="text-navy text-sm font-bold">Buat Baru</span>
      </nav>

      <div class="flex flex-wrap justify-between gap-6 items-end">
        <div class="flex flex-col gap-3">
          <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Buat Event Baru</h1>
          <p class="text-text-secondary text-sm md:text-base font-medium max-w-2xl">Mulai dengan mengisi detail penting
            untuk kompetisi Anda. Informasi ini akan ditampilkan kepada semua peserta.</p>
        </div>
        <div class="flex flex-col gap-3 min-w-[240px]">
          <div class="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-navy">
            <span>Info Dasar</span>
            <span>Langkah 1 dari 4</span>
          </div>
          <div class="rounded-full bg-gray-200 h-2 w-full overflow-hidden">
            <div class="h-full rounded-full bg-primary" style="width: 25%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm">
      <form class="flex flex-col gap-10">
        <!-- Event Identity Section -->
        <div class="flex flex-col gap-6">
          <div class="flex items-center gap-3 text-navy border-b border-gray-100 pb-3 mb-2">
            <div class="p-2 bg-primary/20 rounded-lg text-navy">
              <span class="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <h3 class="text-lg font-bold uppercase tracking-wide">Identitas Event</h3>
          </div>
          <div class="grid grid-cols-1 gap-6">
            <label class="flex flex-col gap-2">
              <span class="text-navy text-sm font-semibold">Nama Event</span>
              <input v-model="form.name"
                class="form-input w-full rounded-lg text-navy focus:outline-0 focus:ring-2 focus:ring-primary focus:border-primary border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-400 px-4 text-base transition-all shadow-sm"
                placeholder="contoh: National Indoor Championship 2024" type="text" />
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-navy text-sm font-semibold">Lokasi Venue</span>
              <div class="relative">
                <span
                  class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">location_on</span>
                <input v-model="form.venue"
                  class="form-input w-full rounded-lg text-navy focus:outline-0 focus:ring-2 focus:ring-primary focus:border-primary border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-400 pl-12 pr-12 text-base transition-all shadow-sm"
                  placeholder="Masukkan nama venue atau alamat" type="text" />
              </div>
            </label>
          </div>
        </div>

        <!-- Schedule Section -->
        <div class="flex flex-col gap-6 pt-2">
          <div class="flex items-center gap-3 text-navy border-b border-gray-100 pb-3 mb-2">
            <div class="p-2 bg-primary/20 rounded-lg text-navy">
              <span class="material-symbols-outlined text-[20px]">calendar_month</span>
            </div>
            <h3 class="text-lg font-bold uppercase tracking-wide">Jadwal</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="flex flex-col gap-2">
              <span class="text-navy text-sm font-semibold">Tanggal & Waktu Mulai</span>
              <input v-model="form.startDate"
                class="form-input w-full rounded-lg text-navy focus:outline-0 focus:ring-2 focus:ring-primary focus:border-primary border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-400 px-4 text-base transition-all shadow-sm"
                type="datetime-local" />
            </label>
            <label class="flex flex-col gap-2">
              <span class="text-navy text-sm font-semibold">Tanggal & Waktu Selesai</span>
              <input v-model="form.endDate"
                class="form-input w-full rounded-lg text-navy focus:outline-0 focus:ring-2 focus:ring-primary focus:border-primary border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-400 px-4 text-base transition-all shadow-sm"
                type="datetime-local" />
            </label>
          </div>
        </div>

        <!-- Event Details Section -->
        <div class="flex flex-col gap-6 pt-2">
          <div class="flex items-center gap-3 text-navy border-b border-gray-100 pb-3 mb-2">
            <div class="p-2 bg-primary/20 rounded-lg text-navy">
              <span class="material-symbols-outlined text-[20px]">description</span>
            </div>
            <h3 class="text-lg font-bold uppercase tracking-wide">Detail Event</h3>
          </div>
          <div class="grid grid-cols-1 gap-6">
            <label class="flex flex-col gap-2">
              <span class="text-navy text-sm font-semibold">Deskripsi</span>
              <textarea v-model="form.description"
                class="form-textarea w-full rounded-lg text-navy focus:outline-0 focus:ring-2 focus:ring-primary focus:border-primary border border-gray-200 bg-gray-50 min-h-[160px] placeholder:text-gray-400 p-4 text-base transition-all resize-y shadow-sm"
                placeholder="Jelaskan format event, peraturan, dan instruksi khusus untuk peserta..."></textarea>
              <div class="flex justify-end">
                <span class="text-xs text-gray-500 font-medium">Markdown didukung</span>
              </div>
            </label>
            <div class="flex flex-col gap-2">
              <span class="text-navy text-sm font-semibold">Banner Event</span>
              <div
                class="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer group">
                <div
                  class="size-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                  <span
                    class="material-symbols-outlined text-navy text-3xl group-hover:text-primary-hover">cloud_upload</span>
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-navy font-semibold">Klik untuk upload atau drag and drop</p>
                  <p class="text-gray-500 text-sm">SVG, PNG, JPG atau GIF (maks. 3MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-8 border-t border-gray-100 mt-4">
          <NuxtLink to="/dashboard/tournaments"
            class="w-full md:w-auto h-12 px-6 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 hover:text-navy transition-colors flex items-center justify-center">
            Batal
          </NuxtLink>
          <button type="button"
            class="w-full md:w-auto h-12 px-8 rounded-lg bg-primary text-navy font-bold hover:bg-primary-hover shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
            <span>Selanjutnya: Divisi</span>
            <span class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const form = reactive({
  name: '',
  venue: '',
  startDate: '',
  endDate: '',
  description: ''
})
</script>
