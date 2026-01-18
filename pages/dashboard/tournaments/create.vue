<template>
  <div class="max-w-5xl mx-auto space-y-10 py-10">
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-black text-navy uppercase tracking-tight">Create New Event</h1>
      <p class="text-text-secondary font-medium">Standardize your archery tournament management in minutes.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Left Sidebar: Progress Stepper -->
      <div class="lg:col-span-3 space-y-8">
        <div class="flex flex-col gap-6">
          <div v-for="(step, idx) in steps" :key="idx" class="flex items-center gap-4 group cursor-pointer"
            @click="currentStep = idx + 1">
            <div
              class="size-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 border-2"
              :class="currentStep === idx + 1 ? 'bg-navy border-navy text-primary shadow-lg shadow-navy/20' : (currentStep > idx + 1 ? 'bg-primary border-primary text-navy' : 'bg-white border-gray-100 text-gray-300')">
              <span v-if="currentStep > idx + 1" class="material-symbols-outlined text-[18px]">check</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] font-black uppercase tracking-widest transition-colors"
                :class="currentStep === idx + 1 ? 'text-navy' : 'text-gray-400'">{{ step.label }}</span>
              <span v-if="currentStep === idx + 1" class="text-[9px] font-bold text-primary-hover uppercase">In
                Progress</span>
            </div>
          </div>
        </div>

        <div class="p-5 bg-navy rounded-2xl text-white space-y-4 shadow-xl">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary">tips_and_updates</span>
            <span class="text-xs font-black uppercase tracking-tight">Did you know?</span>
          </div>
          <p class="text-[10px] text-gray-400 leading-relaxed">You can always pause the creation and resume later from
            your draft list.</p>
        </div>
      </div>

      <!-- Right Side: Form Content -->
      <div
        class="lg:col-span-9 bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
        <!-- Form Step Content -->
        <div class="flex-1 p-8 md:p-12 overflow-y-auto no-scrollbar">
          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1" class="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-6">
              <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-hover">
                <span class="material-symbols-outlined">event_note</span>
              </div>
              <div>
                <h3 class="text-xl font-black uppercase tracking-tight">Event Identity</h3>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">General information about
                  your tournament</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-8">
              <div class="flex flex-col gap-2.5">
                <label class="text-[10px] font-black text-navy uppercase tracking-widest flex justify-between">
                  Tournament Name
                  <span class="text-red-500">* Required</span>
                </label>
                <input v-model="formData.name" type="text" placeholder="e.g. 2024 National Indoor Archery Championship"
                  class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-300">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="flex flex-col gap-2.5">
                  <label class="text-[10px] font-black text-navy uppercase tracking-widest">Start Date</label>
                  <input v-model="formData.startDate" type="date"
                    class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all">
                </div>
                <div class="flex flex-col gap-2.5">
                  <label class="text-[10px] font-black text-navy uppercase tracking-widest">End Date</label>
                  <input v-model="formData.endDate" type="date"
                    class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all">
                </div>
              </div>

              <div class="flex flex-col gap-2.5">
                <label class="text-[10px] font-black text-navy uppercase tracking-widest">Location & Venue</label>
                <div class="relative">
                  <span
                    class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">location_on</span>
                  <input v-model="formData.location" type="text" placeholder="Venue name and full address"
                    class="bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300 w-full">
                </div>
              </div>

              <div class="flex flex-col gap-2.5">
                <label class="text-[10px] font-black text-navy uppercase tracking-widest">Tournament Description</label>
                <textarea v-model="formData.description" rows="4"
                  placeholder="Tell participants about the format, rules, and any special requirements..."
                  class="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300 resize-none"></textarea>
              </div>
            </div>
          </div>

          <!-- Step 2: Divisions -->
          <div v-if="currentStep === 2" class="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-6">
              <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-hover">
                <span class="material-symbols-outlined">settings_input_component</span>
              </div>
              <div>
                <h3 class="text-xl font-black uppercase tracking-tight">Divisions & Categories</h3>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Specify which classes will
                  be contested</p>
              </div>
            </div>

            <div class="space-y-8">
              <div class="flex flex-col gap-4">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bow Divisions</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button v-for="div in allDivisions" :key="div.id" @click="toggleDivision(div.id)"
                    class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 bg-white group"
                    :class="formData.divisions.includes(div.id) ? 'border-navy bg-navy shadow-xl shadow-navy/10 text-primary' : 'border-gray-100 text-gray-400 hover:border-primary/50'">
                    <span class="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">{{
                      div.icon }}</span>
                    <span class="text-[10px] font-black uppercase tracking-widest">{{ div.name }}</span>
                  </button>
                </div>
              </div>

              <div class="flex flex-col gap-6">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age & Distance Classes
                </p>
                <div class="flex flex-wrap gap-3">
                  <button v-for="cat in allCategories" :key="cat" @click="toggleCategory(cat)"
                    class="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all"
                    :class="formData.categories.includes(cat) ? 'bg-primary text-navy border-primary shadow-lg shadow-primary/10' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'">
                    {{ cat }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Fees -->
          <div v-if="currentStep === 3" class="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-6">
              <div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-hover">
                <span class="material-symbols-outlined">payments</span>
              </div>
              <div>
                <h3 class="text-xl font-black uppercase tracking-tight">Registration Fees</h3>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Set tournament costs for
                  participants</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="flex flex-col gap-2.5">
                <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Individual Fee
                  (IDR)</label>
                <div class="relative">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">Rp</span>
                  <input v-model="formData.pricePerCategory" type="number"
                    class="bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all">
                </div>
              </div>
              <div class="flex flex-col gap-2.5 opacity-50 pointer-events-none transition-opacity"
                :class="{ 'opacity-100 pointer-events-auto': formData.hasTeam }">
                <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Team Fee (IDR)</label>
                <div class="relative">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">Rp</span>
                  <input v-model="formData.priceTeam" type="number"
                    class="bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-navy focus:ring-4 focus:ring-primary/20 outline-none transition-all">
                </div>
              </div>
            </div>

            <div class="p-8 rounded-3xl bg-navy text-white space-y-4 shadow-xl">
              <div class="flex items-center justify-between">
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-black uppercase tracking-tight">Enable Team Competition</span>
                  <span class="text-[10px] text-gray-400">Allow clubs or teams to register for team events</span>
                </div>
                <button @click="formData.hasTeam = !formData.hasTeam"
                  class="w-14 h-7 rounded-full relative transition-all duration-500 ease-in-out border border-white/10"
                  :class="formData.hasTeam ? 'bg-primary' : 'bg-gray-800'">
                  <div class="absolute top-1 w-5 h-5 bg-navy rounded-full transition-all duration-500 shadow-sm"
                    :class="formData.hasTeam ? 'right-1 scale-110' : 'left-1'"></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 4: Summary -->
          <div v-if="currentStep === 4" class="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div class="flex items-center gap-4 text-navy border-b border-gray-50 pb-6">
              <div class="size-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <span class="material-symbols-outlined">verified</span>
              </div>
              <div>
                <h3 class="text-xl font-black uppercase tracking-tight">Review & Launch</h3>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Check everything before
                  going public</p>
              </div>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
              <div class="space-y-1">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tournament Name</p>
                <p class="text-lg font-black text-navy uppercase leading-tight">{{ formData.name || 'Untitled Event' }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Registration Fee</p>
                <p class="text-lg font-black text-navy">Rp{{ formData.pricePerCategory.toLocaleString() }} <span
                    class="text-[10px] text-gray-400">/ Archer</span></p>
              </div>
              <div class="space-y-1">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dates</p>
                <p class="text-sm font-bold text-navy">{{ formData.startDate || '-' }} to {{ formData.endDate || '-' }}
                </p>
              </div>
              <div class="space-y-1">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Venue</p>
                <p class="text-sm font-bold text-navy">{{ formData.location || 'Location Not Set' }}</p>
              </div>
              <div
                class="md:col-span-2 pt-4 flex gap-3 items-start p-4 bg-primary/20 rounded-xl border border-primary/30">
                <span class="material-symbols-outlined text-navy">security</span>
                <p class="text-[11px] font-bold text-navy leading-relaxed">By publishing this event, you agree to our
                  Tournament Organizer Terms of Service. You can modify these details anytime from the dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Controls -->
        <div class="px-8 md:px-12 py-8 bg-white border-t border-gray-100 flex items-center justify-between">
          <button v-if="currentStep > 1" @click="currentStep--"
            class="px-8 py-3 rounded-xl text-gray-400 hover:text-navy font-black text-[10px] uppercase tracking-widest transition-all">Previous</button>
          <div v-else></div>

          <button @click="nextStep"
            class="px-10 py-4 rounded-2xl bg-primary text-navy font-black text-[10px] uppercase tracking-widest hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center gap-3">
            {{ currentStep === 4 ? 'Launch Tournament' : 'Continue' }}
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
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
  { label: 'Basic Info' },
  { label: 'Divisions' },
  { label: 'Fees & Reg' },
  { label: 'Launch' }
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
    alert('Tournament Published Successfully!')
    navigateTo('/dashboard/tournaments')
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
