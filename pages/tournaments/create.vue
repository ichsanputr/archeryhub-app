<template>
  <div class="min-h-screen pb-20">
    <!-- Breadcrumbs & Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div class="flex flex-wrap gap-2 mb-2">
          <NuxtLink to="/tournaments" class="text-brand-gold text-sm font-medium hover:text-primary">
            Tournaments
          </NuxtLink>
          <span class="text-gray-600 text-sm font-medium">/</span>
          <span class="text-white text-sm font-medium">Create New</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight">Create New Event</h1>
        <p class="text-brand-gold text-base mt-1">Start by providing the essential details for your competition.</p>
      </div>
      
      <!-- Progress -->
      <div class="flex flex-col gap-2 min-w-[240px]">
        <div class="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-brand-gold">
          <span>Basic Info</span>
          <span>Step 1 of 4</span>
        </div>
        <div class="rounded-full bg-brand-surface h-2 w-full overflow-hidden">
          <div class="h-full rounded-full bg-primary" style="width: 25%;"></div>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="card">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-8">
        <!-- Event Identity -->
        <div class="flex flex-col gap-6">
          <div class="flex items-center gap-2 text-primary border-b border-brand-border pb-2 mb-2">
            <span class="material-symbols-outlined">badge</span>
            <h3 class="text-lg font-bold uppercase tracking-wider">Event Identity</h3>
          </div>
          
          <div class="grid grid-cols-1 gap-6">
            <label class="flex flex-col gap-2">
              <span class="text-white text-base font-medium">Event Name</span>
              <input 
                v-model="form.name"
                class="input" 
                placeholder="e.g., National Indoor Championship 2024" 
                type="text"
                required
              />
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-white text-base font-medium">Venue Location</span>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold pointer-events-none">
                  location_on
                </span>
                <input 
                  v-model="form.venue"
                  class="input pl-12 pr-4" 
                  placeholder="Enter venue name or address" 
                  type="text"
                />
              </div>
            </label>
          </div>
        </div>

        <!-- Schedule -->
        <div class="flex flex-col gap-6 pt-4">
          <div class="flex items-center gap-2 text-primary border-b border-brand-border pb-2 mb-2">
            <span class="material-symbols-outlined">calendar_month</span>
            <h3 class="text-lg font-bold uppercase tracking-wider">Schedule</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="flex flex-col gap-2">
              <span class="text-white text-base font-medium">Start Date & Time</span>
              <input 
                v-model="form.startDate"
                class="input [color-scheme:dark]" 
                type="datetime-local"
                required
              />
            </label>

            <label class="flex flex-col gap-2">
              <span class="text-white text-base font-medium">End Date & Time</span>
              <input 
                v-model="form.endDate"
                class="input [color-scheme:dark]" 
                type="datetime-local"
                required
              />
            </label>
          </div>
        </div>

        <!-- Event Details -->
        <div class="flex flex-col gap-6 pt-4">
          <div class="flex items-center gap-2 text-primary border-b border-brand-border pb-2 mb-2">
            <span class="material-symbols-outlined">description</span>
            <h3 class="text-lg font-bold uppercase tracking-wider">Event Details</h3>
          </div>
          
          <div class="grid grid-cols-1 gap-6">
            <label class="flex flex-col gap-2">
              <span class="text-white text-base font-medium">Description</span>
              <textarea 
                v-model="form.description"
                class="w-full rounded-lg text-white bg-brand-surface border border-brand-border focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none min-h-[160px] p-4 resize-y"
                placeholder="Describe the event format, rules, and any special instructions for archers..."
              ></textarea>
              <div class="flex justify-end">
                <span class="text-xs text-brand-gold">Markdown supported</span>
              </div>
            </label>

            <div class="flex flex-col gap-2">
              <span class="text-white text-base font-medium">Event Banner</span>
              <div class="border-2 border-dashed border-brand-border rounded-xl bg-brand-surface/50 p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-brand-surface hover:border-primary/50 transition-all cursor-pointer group">
                <div class="size-16 rounded-full bg-brand-surface flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span class="material-symbols-outlined text-brand-gold text-3xl group-hover:text-primary">
                    cloud_upload
                  </span>
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-white font-medium">Click to upload or drag and drop</p>
                  <p class="text-brand-gold text-sm">SVG, PNG, JPG or GIF (max. 3MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col-reverse md:flex-row items-center justify-end gap-4 pt-8 border-t border-brand-border mt-4">
          <NuxtLink 
            to="/tournaments"
            class="w-full md:w-auto h-12 px-6 rounded-lg border border-brand-border text-brand-gold font-bold hover:bg-brand-surface hover:text-white transition-colors flex items-center justify-center"
          >
            Cancel
          </NuxtLink>
          <button 
            type="submit"
            class="w-full md:w-auto h-12 px-8 rounded-lg bg-primary text-brand-dark font-bold hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(249,209,6,0.3)] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Next: Categories</span>
            <span class="material-symbols-outlined transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  title: 'Create Tournament',
  layout: 'default'
})

const router = useRouter()

const form = ref({
  name: '',
  venue: '',
  startDate: '',
  endDate: '',
  description: ''
})

const handleSubmit = () => {
  console.log('Creating tournament:', form.value)
  // TODO: API call to create tournament
  // router.push(`/tournaments/${tournamentId}/setup`)
  alert('Tournament creation API not yet implemented')
}
</script>
