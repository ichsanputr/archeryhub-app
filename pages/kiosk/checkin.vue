<template>
  <div class="min-h-screen bg-background-dark flex flex-col -m-8">
    <!-- Header -->
    <header class="flex items-center justify-between border-b border-[#4a4321] px-6 py-4 bg-background-dark">
      <div class="flex items-center gap-4 text-white">
        <div class="size-8 flex items-center justify-center text-primary">
          <span class="material-symbols-outlined" style="font-size: 32px;">target</span>
        </div>
        <h2 class="text-white text-xl font-bold">Archery Hub</h2>
      </div>
      <div class="flex items-center gap-6">
        <div class="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-green-400 text-xs font-bold uppercase tracking-wider">System Online</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden p-6 lg:p-10">
      <div class="h-full w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left: Scanner -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <!-- Scanning Module -->
          <div class="flex-1 bg-card-dark rounded-2xl p-6 border border-[#4a4321] shadow-lg flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <h1 class="text-2xl font-bold text-white">Scan Pass</h1>
              <span class="material-symbols-outlined text-primary">qr_code_scanner</span>
            </div>
            <div class="relative flex-1 bg-black rounded-xl overflow-hidden min-h-[300px] border-2 border-dashed border-[#6a602f] flex flex-col items-center justify-center group cursor-pointer hover:border-primary transition-colors">
              <!-- Scanning Overlay -->
              <div class="relative z-10 w-64 h-64 border-2 border-primary/80 rounded-lg flex items-center justify-center shadow-[0_0_100px_rgba(249,208,6,0.15)]">
                <div class="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                <div class="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                <div class="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                <div class="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
                <div class="w-full h-[2px] bg-primary shadow-[0_0_10px_#f9d006] absolute top-1/2 animate-pulse opacity-50"></div>
                <span class="text-white font-medium bg-black/60 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Point at QR Code</span>
              </div>
            </div>
            <div class="mt-6 flex gap-4">
              <button class="flex-1 h-12 bg-surface-dark hover:bg-[#453f2a] text-white rounded-lg font-medium transition-colors border border-[#4a4321] flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">cameraswitch</span>
                Switch Camera
              </button>
            </div>
          </div>

          <!-- Manual Entry -->
          <div class="bg-card-dark rounded-2xl p-6 border border-[#4a4321] shadow-lg">
            <label class="block text-sm font-medium text-[#ccc28e] mb-2 uppercase tracking-wider">Manual Override</label>
            <div class="flex gap-0">
              <input 
                v-model="manualId"
                class="flex-1 bg-surface-dark border border-[#6a602f] text-white text-lg rounded-l-lg focus:ring-2 focus:ring-primary focus:border-transparent px-4 py-3 placeholder:text-white/20" 
                placeholder="Enter ID or Email" 
                type="text"
              />
              <button class="bg-primary hover:bg-primary/90 text-background-dark px-6 rounded-r-lg font-bold flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined">search</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Participant Details -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <!-- Active Participant Card -->
          <div class="bg-card-dark rounded-2xl border-l-8 border-primary overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
            <div class="absolute top-4 right-4 z-10">
              <span class="inline-flex items-center rounded-md bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400 ring-1 ring-inset ring-green-500/20 backdrop-blur-md">
                STATUS: PAID
              </span>
            </div>

            <!-- Image -->
            <div class="md:w-1/3 min-h-[240px] md:min-h-full bg-cover bg-center relative" style="background-image: url('https://via.placeholder.com/300x400');">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r"></div>
            </div>

            <!-- Details -->
            <div class="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
              <div>
                <div class="mb-1">
                  <h2 class="text-3xl font-black text-white tracking-tight">John Doe</h2>
                  <p class="text-[#ccc28e] font-medium">Archery Club of NY</p>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-6">
                  <div class="bg-surface-dark rounded-lg p-3 border border-[#4a4321]">
                    <p class="text-xs text-[#ccc28e] uppercase tracking-wider mb-1">Division</p>
                    <p class="text-white font-bold text-lg leading-tight">Recurve<br/><span class="text-sm font-normal text-gray-400">Senior Men</span></p>
                  </div>
                  <div class="bg-surface-dark rounded-lg p-3 border border-[#4a4321]">
                    <p class="text-xs text-[#ccc28e] uppercase tracking-wider mb-1">Assignment</p>
                    <p class="text-primary font-black text-3xl leading-none">12A</p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-3">
                <button class="w-full h-14 bg-primary hover:bg-[#e5bf05] text-background-dark text-lg font-bold uppercase tracking-wide rounded-lg shadow-lg transform active:scale-[0.99] transition-all flex items-center justify-center gap-3">
                  <span class="material-symbols-outlined">check_circle</span>
                  Confirm Check-In
                </button>
                <div class="flex gap-3">
                  <button class="flex-1 h-10 bg-transparent border border-[#6a602f] hover:bg-red-900/20 hover:border-red-500/50 hover:text-red-400 text-[#ccc28e] text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-sm">flag</span>
                    Report Issue
                  </button>
                  <button class="flex-1 h-10 bg-transparent border border-[#6a602f] hover:bg-surface-dark text-[#ccc28e] text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-sm">edit</span>
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="flex-1 bg-[#1e1b0d] rounded-2xl p-6 border border-[#4a4321/50]">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-bold text-lg">Recent Check-Ins</h3>
              <button class="text-xs text-primary font-medium hover:underline">View All Log</button>
            </div>
            <div class="space-y-3">
              <div 
                v-for="(activity, index) in recentActivities" 
                :key="index"
                class="flex items-center gap-4 p-3 rounded-lg bg-surface-dark/50 border border-transparent hover:border-[#4a4321] transition-colors"
              >
                <div class="size-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                  {{ activity.initials }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-white font-bold truncate">{{ activity.name }}</p>
                  <p class="text-xs text-[#ccc28e] truncate">{{ activity.category }} • {{ activity.time }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-white">{{ activity.target }}</p>
                  <span class="text-[10px] text-green-400 font-bold uppercase tracking-wider">Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  title: 'Kiosk Check-in',
  layout: 'default'
})

const manualId = ref('')

const recentActivities = ref([
  { name: 'Sarah Miller', initials: 'SM', category: 'Compound - Women', time: '09:42 AM', target: 'T-04B' },
  { name: 'Mike Chen', initials: 'MC', category: 'Recurve - Junior Men', time: '09:38 AM', target: 'T-08A' },
  { name: 'Jessica Alvaredo', initials: 'JA', category: 'Barebow - Women', time: '09:35 AM', target: 'T-14C' },
])
</script>
