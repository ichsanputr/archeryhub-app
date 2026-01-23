<template>
  <div class="min-h-screen flex flex-col -m-8">
    <!-- Top Nav -->
    <header class="flex items-center justify-between border-b border-brand-border px-6 py-3 bg-background-dark">
      <div class="flex items-center gap-4">
        <div class="size-8 text-primary">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd"
              d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
              fill-rule="evenodd"></path>
          </svg>
        </div>
        <h2 class="text-white text-lg font-bold">Archeryhub.id <span
            class="text-brand-gold font-normal text-sm ml-2">Command Center</span></h2>
      </div>
      <div class="flex gap-4">
        <button class="btn-secondary">
          Queue Settings
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar: Queue -->
      <aside class="w-80 border-r border-brand-border flex flex-col bg-surface-dark">
        <div class="p-4 border-b border-brand-border">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-brand-gold">Queue ({{ queue.length }})</h3>
            <button class="text-brand-gold hover:text-white">
              <Icon icon="ph:funnel" class="text-[20px]" />
            </button>
          </div>
          <div class="relative">
            <Icon icon="ph:magnifying-glass" class="absolute left-3 top-2.5 text-gray-400 text-[18px]" />
            <input class="input w-full py-2 pl-9" placeholder="Search applicant..." />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          <div v-for="(item, index) in queue" :key="item.id" @click="selectedIndex = index"
            :class="selectedIndex === index ? 'bg-primary/10 border-l-4 border-primary' : 'border-l-4 border-transparent'"
            class="flex gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
            <div
              class="size-10 rounded-full bg-gray-600 shrink-0 flex items-center justify-center text-white font-bold">
              {{ item.initials }}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-bold text-white truncate">{{ item.name }}</span>
              <span class="text-xs text-brand-gold truncate">{{ item.category }} • ${{ item.amount }}</span>
              <div class="flex items-center gap-1 mt-1">
                <span class="size-2 rounded-full"
                  :class="item.status === 'pending' ? 'bg-primary animate-pulse' : 'bg-green-500'"></span>
                <span class="text-[10px] font-medium"
                  :class="item.status === 'pending' ? 'text-primary' : 'text-green-500'">
                  {{ item.statusLabel }}
                </span>
              </div>
            </div>
            <span class="text-xs text-brand-gold ml-auto">{{ item.time }}</span>
          </div>
        </div>
      </aside>

      <!-- Main: Verification Area -->
      <main class="flex-1 flex flex-col min-w-0">
        <!-- Context Header -->
        <div class="px-6 py-4 flex items-center justify-between border-b border-brand-border">
          <div>
            <h1 class="text-xl font-bold text-white">{{ currentApplication.tournamentName }}</h1>
            <p class="text-xs text-brand-gold mt-1">Registration Open • Verification Priority: High</p>
          </div>
          <div class="flex gap-3">
            <button class="btn-secondary text-xs">View Full Roster</button>
            <button class="btn-secondary text-xs">
              Skip to Next
              <Icon icon="ph:arrow-right" class="text-[16px]" />
            </button>
          </div>
        </div>

        <!-- Split View -->
        <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <!-- Left: Image Proof -->
          <div class="flex-1 flex flex-col bg-gray-900 relative overflow-hidden">
            <!-- Toolbar -->
            <div
              class="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2 py-1.5 bg-black/60 backdrop-blur-md rounded-full z-20 opacity-0 hover:opacity-100 transition-opacity">
              <button class="size-8 rounded-full flex items-center justify-center text-white hover:bg-white/20">
                <Icon icon="ph:minus" class="text-[20px]" />
              </button>
              <span class="text-xs font-medium text-white/80 w-12 text-center">100%</span>
              <button class="size-8 rounded-full flex items-center justify-center text-white hover:bg-white/20">
                <Icon icon="ph:plus" class="text-[20px]" />
              </button>
            </div>

            <!-- Image -->
            <div class="flex-1 flex items-center justify-center p-8 bg-[#151515]">
              <img :src="useImageOrDefault()" alt="Payment receipt"
                class="max-w-full max-h-full object-contain shadow-2xl rounded-sm" />
            </div>

            <!-- Metadata -->
            <div class="absolute bottom-4 left-4 flex gap-2">
              <div class="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-medium text-white/90">
                IMG_8823.PNG • 2.4 MB
              </div>
            </div>
          </div>

          <!-- Right: Verification Form -->
          <div class="flex-1 lg:max-w-[600px] flex flex-col bg-background-dark overflow-y-auto">
            <div class="p-6 space-y-8">
              <!-- Applicant Details -->
              <section>
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-brand-gold mb-4 border-b border-brand-border pb-2">
                  Applicant Details</h4>
                <div class="flex items-start gap-4">
                  <div class="size-16 rounded-lg bg-gray-600 shrink-0"></div>
                  <div class="grid grid-cols-2 gap-x-8 gap-y-4 flex-1">
                    <div>
                      <p class="text-xs text-gray-400">Full Name</p>
                      <p class="text-sm font-semibold text-white">{{ currentApplication.name }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400">Club / Team</p>
                      <p class="text-sm font-semibold text-white">{{ currentApplication.club }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400">Category</p>
                      <p class="text-sm font-semibold text-white">{{ currentApplication.category }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400">Membership ID</p>
                      <p class="text-sm font-mono text-white">{{ currentApplication.membershipId }}</p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Payment Reconciliation -->
              <section>
                <h4
                  class="text-xs font-bold uppercase tracking-wider text-brand-gold mb-4 border-b border-brand-border pb-2">
                  Payment Reconciliation</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-4 rounded-lg bg-surface-dark border border-brand-border">
                    <p class="text-xs text-gray-400 mb-1">Expected Amount</p>
                    <p class="text-2xl font-bold text-white font-mono">${{ currentApplication.expectedAmount }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-surface-dark border border-primary/40">
                    <label class="text-xs text-primary font-medium mb-1 block">Paid Amount</label>
                    <input v-model="currentApplication.paidAmount"
                      class="w-full bg-transparent border-none p-0 text-2xl font-bold text-white font-mono focus:ring-0"
                      type="text" />
                  </div>
                </div>

                <!-- Reference ID -->
                <div class="mt-4">
                  <label class="block text-xs font-medium text-gray-400 mb-1.5">Transaction Reference ID</label>
                  <input v-model="currentApplication.refId" class="input w-full font-mono" />
                </div>

                <!-- Notes -->
                <div class="mt-4">
                  <label class="block text-xs font-medium text-gray-400 mb-1.5">Admin Notes (Optional)</label>
                  <textarea v-model="currentApplication.notes"
                    class="w-full rounded-lg bg-surface-dark border border-brand-border text-white text-sm py-2 px-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows="2" placeholder="Add internal notes..."></textarea>
                </div>
              </section>
            </div>

            <!-- Action Footer -->
            <div class="mt-auto p-4 border-t border-brand-border bg-[#1f1b0e] flex gap-3 sticky bottom-0">
              <button
                class="flex-1 h-14 rounded-lg border border-red-900/30 bg-red-900/10 text-red-600 hover:bg-red-900/20 transition-colors font-bold">
                Reject
              </button>
              <button
                class="flex-1 h-14 rounded-lg border border-brand-border bg-surface-dark text-white hover:bg-surface-highlight transition-colors font-bold">
                Request Info
              </button>
              <button
                class="flex-[2] h-14 rounded-lg bg-primary text-background-dark hover:bg-yellow-400 shadow-lg shadow-primary/20 transition-all font-bold flex items-center justify-center gap-2">
                <Icon icon="ph:seal-check-fill" />
                Verify & Approve
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

definePageMeta({
  title: 'Registration Verification',
  layout: 'default'
})

const selectedIndex = ref(0)

const queue = ref([
  { id: 1, name: 'John Archer', initials: 'JA', category: 'Recurve Men', amount: '50.00', status: 'pending', statusLabel: 'Pending Review', time: '2m' },
  { id: 2, name: 'Sarah Bow', initials: 'SB', category: 'Compound Women', amount: '50.00', status: 'flagged', statusLabel: 'Flagged', time: '15m' },
  { id: 3, name: 'Mike Kennedy', initials: 'MK', category: 'Barebow Men', amount: '45.00', status: 'pending', statusLabel: 'Pending', time: '42m' },
])

const currentApplication = computed(() => ({
  name: queue.value[selectedIndex.value].name,
  club: 'Eagle Eye Academy',
  category: queue.value[selectedIndex.value].category,
  membershipId: 'MEM-88291',
  expectedAmount: queue.value[selectedIndex.value].amount,
  paidAmount: queue.value[selectedIndex.value].amount,
  refId: 'TRX-99823100',
  notes: '',
  tournamentName: 'National Outdoor Championship 2024'
}))
</script>
