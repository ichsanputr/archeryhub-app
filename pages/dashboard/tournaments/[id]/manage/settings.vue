<template>
  <div class="space-y-10">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight uppercase">Event Settings</h1>
        <p class="text-text-secondary mt-1 font-medium text-sm">Configure event details, registration rules, and
          competition format.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-6 py-2.5 bg-white border border-gray-200 text-gray-400 hover:text-navy font-bold text-sm rounded-xl transition-all">
          Discard Changes
        </button>
        <button
          class="px-6 py-2.5 bg-navy text-white hover:bg-navy-light font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">save</span>
          Publish Changes
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-3 space-y-2">
        <button v-for="section in sections" :key="section.id" @click="activeSection = section.id"
          class="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-left group"
          :class="activeSection === section.id ? 'bg-navy text-primary shadow-xl shadow-navy/20' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'">
          <span class="material-symbols-outlined transition-transform group-hover:scale-110">{{ section.icon }}</span>
          <div class="flex flex-col">
            <span class="font-black text-[10px] uppercase tracking-widest">{{ section.label }}</span>
            <span class="text-[9px] font-bold opacity-60 leading-tight mt-0.5">{{ section.desc }}</span>
          </div>
        </button>

        <div class="mt-8 p-6 bg-primary/10 rounded-3xl border border-primary/20 space-y-4">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-navy">verified</span>
            <span class="text-[10px] font-black text-navy uppercase tracking-tight">Verified Organizer</span>
          </div>
          <p class="text-[10px] text-navy/70 leading-relaxed font-medium">Your event is verified. Public registrations
            are active.</p>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-9 space-y-8">
        <!-- General Section -->
        <div v-if="activeSection === 'general'" class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div class="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            <div class="p-8 md:p-10 space-y-10">
              <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-6">
                <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-hover">
                  <span class="material-symbols-outlined">badge</span>
                </div>
                <div>
                  <h3 class="text-xl font-black uppercase tracking-tight">Basic information</h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">This info will be
                    visible to all participants</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex flex-col gap-2.5">
                  <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Tournament Name</label>
                  <input type="text" value="2024 State Indoor Championship"
                    class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all">
                </div>
                <div class="flex flex-col gap-2.5">
                  <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Organizer Name</label>
                  <input type="text" value="Archeryhub.id Official"
                    class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all">
                </div>
                <div class="flex flex-col gap-2.5">
                  <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Venue Location</label>
                  <input type="text" value="Jakarta Indoor Stadium"
                    class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all">
                </div>
                <div class="flex flex-col gap-2.5">
                  <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Event Type</label>
                  <select
                    class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
                    <option>Indoor Archery</option>
                    <option>Outdoor Archery</option>
                    <option>Target Archery</option>
                  </select>
                </div>
                <div class="md:col-span-2 flex flex-col gap-2.5">
                  <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Description</label>
                  <textarea rows="4"
                    class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all resize-none">Turnamen tahunan ke-5 yang diselenggarakan oleh Archeryhub.id untuk mencari bibit atlet muda berprestasi di tingkat nasional.</textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Other sections would go here -->
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const activeSection = ref('general')
const sections = [
  { id: 'general', label: 'General', icon: 'settings', desc: 'Basic tournament info' },
  { id: 'registration', label: 'Registration', icon: 'app_registration', desc: 'Fees and registration period' },
  { id: 'rules', label: 'Rules & Format', icon: 'gavel', desc: 'Scoring and classes' },
  { id: 'display', label: 'Branding', icon: 'palette', desc: 'Banner and theme' },
  { id: 'danger', label: 'Advanced', icon: 'warning', desc: 'Danger zone actions' },
]
</script>
