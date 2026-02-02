<template>
  <div class="space-y-8">
    <!-- Club Dashboard View -->
    <template v-if="userRole === 'club'">
      <!-- Club Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-navy tracking-tight">{{ user?.full_name || 'Panel Kontrol Klub' }}</h1>
          <p class="text-gray-500 mt-1 font-medium">Monitoring performa dan manajemen anggota klub Anda secara
            real-time.</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/dashboard/members">
            <BaseButton variant="primary" size="sm" icon="ph:user-plus">
              Tambah Anggota
            </BaseButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Club Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="stat in clubStats" :key="stat.label"
          class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div class="flex justify-between items-start mb-4">
            <div
              class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
              <Icon :icon="stat.icon" class="text-2xl" />
            </div>
            <span class="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div>
            <p class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{{ stat.label }}</p>
            <p class="text-navy text-3xl font-black tracking-tight">{{ stat.value }}</p>
            <p class="text-gray-500 text-xs mt-2 font-medium">{{ stat.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Main Info for Club -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Upcoming Tournaments -->
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div class="p-5 border-b border-gray-50 flex items-center justify-between">
            <h3 class="font-black text-navy flex items-center gap-2">
              <Icon icon="ph:calendar-star-bold" class="text-primary" />
              Event Mendatang
            </h3>
            <BaseButton variant="ghost" size="xs">Lihat Semua</BaseButton>
          </div>
          <div class="p-5 space-y-4 flex-1">
            <div v-for="event in upcomingClubTournaments" :key="event.id"
              class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-all cursor-pointer group">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-lg bg-white border border-gray-100 flex flex-col items-center justify-center shrink-0">
                  <span class="text-[10px] font-black text-primary uppercase">{{ event.date.split(' ')[1] }}</span>
                  <span class="text-lg font-black text-navy leading-none">{{ event.date.split(' ')[0] }}</span>
                </div>
                <div>
                  <h4 class="font-bold text-navy group-hover:text-primary transition-colors">{{ event.name }}</h4>
                  <p class="text-xs text-gray-500">{{ event.status }}</p>
                </div>
              </div>
              <Icon icon="ph:arrow-right-bold"
                class="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </div>

            <div v-if="!upcomingClubTournaments.length" class="text-center py-10">
              <Icon icon="ph:calendar-blank" class="text-4xl text-gray-200 mx-auto mb-2" />
              <p class="text-gray-400 text-sm">Belum ada turnamen terdaftar</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions & New Members -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 class="font-black text-navy mb-4 text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:lightning-bold" class="text-primary" />
              Aksi Cepat
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <NuxtLink to="/dashboard/members"
                class="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                <Icon icon="ph:user-list" class="text-2xl text-primary" />
                <span class="text-[9px] font-black text-navy uppercase text-center">Data Anggota</span>
              </NuxtLink>
              <NuxtLink to="/dashboard/news"
                class="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all group">
                <Icon icon="ph:newspaper-clipping" class="text-2xl text-primary" />
                <span class="text-[9px] font-black text-navy uppercase text-center">Buat Berita</span>
              </NuxtLink>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 class="font-black text-navy mb-4 text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:user-plus-bold" class="text-primary" />
              Anggota Terbaru
            </h3>
            <div class="space-y-4">
              <div v-for="(member, index) in recentMembers" :key="index" class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs shrink-0">
                  {{ member.name.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-navy truncate">{{ member.name }}</p>
                  <p class="text-[10px] text-gray-400 uppercase tracking-tighter">{{ member.joinDate }}</p>
                </div>
                <span :class="member.status === 'Active' ? 'text-green-500 bg-green-50' : 'text-amber-500 bg-amber-50'"
                  class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase">{{ member.status }}</span>
              </div>
            </div>
            <NuxtLink to="/dashboard/members"
              class="block w-full text-center mt-5 text-xs font-bold text-gray-400 hover:text-primary transition-colors">
              Lihat Semua Anggota
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <!-- Seller Dashboard View -->
    <template v-else-if="userRole === 'seller'">
      <!-- Seller Header -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-navy tracking-tight">Ringkasan Toko</h1>
          <p class="text-gray-500 mt-1 font-medium">Selamat datang di dashboard penjual Anda, <span
              class="text-navy font-bold">{{ user?.store_name || user?.full_name }}</span></p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/dashboard/products">
            <BaseButton variant="primary" size="sm" icon="ph:plus-circle">
              Tambah Produk
            </BaseButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Seller Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="stat in renderedSellerStats" :key="stat.label"
          class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group overflow-hidden relative">
          <div
            class="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-primary/5 transition-colors duration-500">
          </div>

          <div class="flex justify-between items-start mb-4 relative z-10">
            <div
              class="p-3 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-navy transition-all duration-300">
              <Icon :icon="stat.icon" class="text-2xl" />
            </div>
          </div>

          <div class="relative z-10">
            <p class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{{ stat.label }}</p>
            <p class="text-navy text-3xl font-black tracking-tight tabular-nums">{{ stat.value }}</p>
            <p class="text-gray-400 text-xs mt-2 font-medium">{{ stat.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Main Content for Seller -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Orders & Performance Chart -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Recent Orders -->
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div class="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 class="font-black text-navy flex items-center gap-2">
                <Icon icon="ph:shopping-cart-bold" class="text-primary" />
                Pesanan Terbaru
              </h3>
              <NuxtLink to="/dashboard/orders">
                <BaseButton variant="ghost" size="xs">Lihat Semua</BaseButton>
              </NuxtLink>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/50">
                    <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Pesanan</th>
                    <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                    <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="order in sellerRecentOrders" :key="order.uuid"
                    class="hover:bg-gray-50/50 transition-colors group">
                    <td class="px-6 py-4">
                      <span class="font-bold text-navy text-sm">{{ order.uuid.substring(0, 8).toUpperCase() }}</span>
                      <p class="text-[10px] text-gray-400 font-medium">{{ formatDate(order.created_at) }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <p class="font-black text-navy text-sm">Rp {{ formatPrice(order.total_amount) }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <span :class="getStatusBadgeClass(order.status)"
                        class="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ring-1 ring-inset">
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <button class="p-2 text-gray-400 hover:text-primary transition-colors">
                        <Icon icon="ph:eye-bold" class="text-xl" />
                      </button>
                    </td>
                  </tr>
                  <tr v-if="!sellerRecentOrders.length">
                    <td colspan="4" class="px-6 py-10 text-center text-gray-400 text-sm">Tidak ada pesanan terbaru</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sales Performance Chart (Chart.js) -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h3 class="text-xl font-black mb-1 text-navy">Performa Penjualan</h3>
                <p class="text-gray-400 text-xs font-medium">Statistik 7 hari terakhir</p>
              </div>
              <Icon icon="ph:chart-line-up-bold" class="text-4xl text-primary/20" />
            </div>

            <div class="h-64">
              <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
              <div v-else class="h-full flex items-center justify-center text-gray-400 italic">Memuat grafik...</div>
            </div>
          </div>
        </div>

        <!-- Side Panels -->
        <div class="space-y-8">
          <!-- Inventory Alerts -->
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 class="font-black text-navy mb-6 text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <Icon icon="ph:warning-circle-bold" class="text-amber-500" />
              Stok Menipis
            </h3>
            <div class="space-y-4">
              <div v-for="product in sellerStockAlerts" :key="product.id"
                class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div class="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  <img v-if="product.image_url" :src="product.image_url" class="w-full h-full object-cover">
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                    <Icon icon="ph:package" class="text-xl" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">{{
                    product.name }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase">Sisa
                      {{ product.stock }}</span>
                  </div>
                </div>
              </div>

              <div v-if="!sellerStockAlerts.length" class="text-center py-6">
                <Icon icon="ph:check-circle-bold" class="text-3xl text-green-200 mx-auto mb-2" />
                <p class="text-gray-400 text-xs">Stok semua produk aman</p>
              </div>
            </div>
            <NuxtLink to="/dashboard/products"
              class="block w-full text-center mt-6 text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors">
              Kelola Semua Produk
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <!-- Original Dashboard View (for Org/Admin/Other) -->
    <template v-else>
      <!-- Header Section -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-navy tracking-tight">Overview</h1>
          <p class="text-gray-500 mt-1 font-medium">Selamat datang kembali, <span class="text-navy font-bold">{{
            user?.full_name }}</span></p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/dashboard/events">
            <BaseButton variant="primary" size="sm" icon="ph:trophy">
              Kelola Event
            </BaseButton>
          </NuxtLink>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Total Archers -->
        <div
          class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Total Atlet</p>
              <p class="text-navy-dark text-3xl font-extrabold tracking-tight">124</p>
            </div>
            <div
              class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
              <Icon icon="ph:users" class="text-xl" />
            </div>
          </div>
          <div class="mt-auto">
            <p class="text-green-600 text-xs font-bold flex items-center gap-1">
              <Icon icon="ph:trend-up" class="text-[14px]" />
              +12 check-ins today
            </p>
          </div>
        </div>

        <!-- Active Targets -->
        <div
          class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Target Aktif</p>
              <p class="text-navy-dark text-3xl font-extrabold tracking-tight">32<span
                  class="text-lg text-gray-400 font-medium ml-1">/ 35</span></p>
            </div>
            <div
              class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
              <Icon icon="ph:target" class="text-xl" />
            </div>
          </div>
          <div class="mt-auto">
            <p class="text-text-secondary text-xs font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              All systems online
            </p>
          </div>
        </div>

        <!-- Completion -->
        <div
          class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Penyelesaian</p>
              <p class="text-navy-dark text-3xl font-extrabold tracking-tight">85%</p>
            </div>
            <div
              class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
              <Icon icon="ph:check-square-offset" class="text-xl" />
            </div>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
            <div class="bg-primary h-1.5 rounded-full" style="width: 85%"></div>
          </div>
        </div>

        <!-- Time Left -->
        <div
          class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Time Left</p>
              <p class="text-navy-dark text-3xl font-extrabold tracking-tight tabular-nums">45:20</p>
            </div>
            <div
              class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
              <Icon icon="ph:timer" class="text-xl" />
            </div>
          </div>
          <div class="mt-auto">
            <p class="text-text-secondary text-xs font-medium">Est. End: 14:30 PM</p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Event Recap (Organization overview – replaces Target Status) -->
        <div
          class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div class="p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">
              <Icon icon="ph:chart-line-up-bold" class="text-primary" />
              Rekap Event
            </h3>
            <NuxtLink to="/dashboard/events">
              <BaseButton variant="ghost" size="xs">Lihat Semua</BaseButton>
            </NuxtLink>
          </div>
          <div class="p-5 space-y-4 flex-1 overflow-y-auto">
            <div v-for="event in orgCompletedEvents" :key="event.id"
              class="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 transition-all cursor-pointer group"
              @click="router.push(`/dashboard/events/${event.id}/overview`)">
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <div
                  class="w-12 h-12 rounded-lg bg-white border border-gray-100 flex flex-col items-center justify-center shrink-0">
                  <span class="text-[10px] font-black text-primary uppercase">{{ event.dateLabel }}</span>
                  <span class="text-lg font-black text-navy leading-none">{{ event.dayLabel }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-navy group-hover:text-primary transition-colors truncate">{{ event.name }}
                  </h4>
                  <div class="flex items-center gap-4 mt-1">
                    <p class="text-xs text-gray-500">{{ event.statusLabel }}</p>
                    <div class="flex items-center gap-3 text-xs text-gray-500">
                      <span class="flex items-center gap-1">
                        <Icon icon="ph:users-bold" class="text-[10px]" />
                        {{ event.participantCount || 0 }} peserta
                      </span>
                      <span class="flex items-center gap-1">
                        <Icon icon="ph:trophy-bold" class="text-[10px]" />
                        {{ event.categoryCount || 0 }} kategori
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Icon icon="ph:arrow-right-bold"
                class="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0" />
            </div>
            <div v-if="!orgCompletedEvents.length" class="text-center py-10">
              <Icon icon="ph:chart-line-up" class="text-4xl text-gray-200 mx-auto mb-2" />
              <p class="text-gray-400 text-sm">Belum ada event yang selesai. Rekap akan muncul setelah event selesai.
              </p>
            </div>
          </div>
        </div>

        <!-- Leaderboard -->
        <div
          class="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Leaderboard</h3>
            <BaseButton variant="ghost" size="sm">
              View All
            </BaseButton>
          </div>
          <div class="flex-1 overflow-y-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                  <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Rk</th>
                  <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Archer</th>
                  <th class="px-6 py-3 text-right font-medium text-xs uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(archer, index) in leaderboard" :key="archer.id"
                  class="hover:bg-gray-50 transition-colors group">
                  <td class="px-6 py-3.5">
                    <div
                      :class="index === 0 ? 'bg-primary text-navy-dark font-extrabold shadow-sm' : 'text-gray-400 font-bold'"
                      class="w-6 h-6 rounded flex items-center justify-center text-xs">
                      {{ index + 1 }}
                    </div>
                  </td>
                  <td class="px-6 py-3.5">
                    <div class="text-navy-dark font-bold group-hover:text-primary-hover transition-colors">{{
                      archer.name
                    }}</div>
                    <div class="text-gray-400 text-xs">{{ archer.category }}</div>
                  </td>
                  <td
                    :class="index === 0 ? 'text-navy-dark font-bold text-base' : 'text-navy-dark font-semibold text-sm'"
                    class="px-6 py-3.5 text-right font-mono">{{ archer.score }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Dashboard - ArcheryHub'
})

const router = useRouter()
const api = useApi()
const toast = useToast()
const { user } = useAuth()
const userRole = computed(() => user.value?.role || user.value?.type || 'archer')

// Seller-specific reactive state
const sellerStatsRaw = ref(null)
const sellerRecentOrders = ref([])
const sellerStockAlerts = ref([])
const isLoadingSellerData = ref(false)
const isLoadingClubData = ref(false)
const clubStatsData = ref(null)
const clubRecentMembers = ref([])
const clubUpcomingTournaments = ref([])
const orgUpcomingEventsData = ref([])


// Chart state
const chartData = ref({ labels: [], datasets: [] })
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true, grid: { display: false } },
    x: { grid: { display: false } }
  }
}

// Redirect archer users to dashboard/events
onMounted(async () => {
  if (userRole.value === 'archer' || userRole.value === 'organization') {
    router.replace('/dashboard/events')
  }

  if (userRole.value === 'seller') {
    fetchSellerDashboardData()
  }

  if (userRole.value === 'club') {
    await fetchClubDashboardData()
  }

  // Org/Admin overview: load completed events for "Rekap Event" section
  if (userRole.value !== 'club' && userRole.value !== 'seller') {
    fetchOrgCompletedEvents()
  }
})

const fetchOrgCompletedEvents = async () => {
  try {
    const res = await api.get('/events')
    const list = res?.data ?? res ?? []
    const now = new Date().toISOString()
    // Filter completed events (status = 'completed' or end_date < now)
    const completed = (Array.isArray(list) ? list : [])
      .filter((e) => {
        const status = e.status?.toLowerCase()
        const endDate = e.end_date || e.end_at || e.date
        return status === 'completed' || (endDate && new Date(endDate) < new Date(now))
      })
      .sort((a, b) => {
        const dateA = a.end_date || a.end_at || a.date || ''
        const dateB = b.end_date || b.end_at || b.date || ''
        return dateB.localeCompare(dateA) // Most recent first
      })
      .slice(0, 5) // Limit to 5 most recent
    orgCompletedEventsData.value = completed
  } catch (error) {
    console.error('Failed to fetch org completed events:', error)
    orgCompletedEventsData.value = []
  }
}

const fetchClubDashboardData = async () => {
  isLoadingClubData.value = true
  try {
    const res = await api.get('/clubs/me/dashboard')
    if (res.data) {
      clubStatsData.value = res.data.stats
      clubRecentMembers.value = res.data.recentMembers || []
      clubUpcomingTournaments.value = res.data.upcomingTournaments || []
    }
  } catch (error) {
    console.error('Failed to fetch club dashboard data:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal memuat data dashboard klub'
    toast.error(errorMessage)
  } finally {
    isLoadingClubData.value = false
  }
}

const fetchSellerDashboardData = async () => {
  isLoadingSellerData.value = true
  try {
    const [statsRes, ordersRes, productsRes] = await Promise.all([
      api.get('/orders/stats'),
      api.get('/orders'),
      api.get('/products/my')
    ])

    sellerStatsRaw.value = statsRes.data
    sellerRecentOrders.value = (ordersRes.data || []).slice(0, 5)

    // Low stock alerts
    if (productsRes.data) {
      sellerStockAlerts.value = productsRes.data.filter(p => p.stock < 5)
    }

    // Process Chart Data
    prepareChartData(ordersRes.data || [])
  } catch (error) {
    console.error('Failed to fetch seller data:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal memuat data dashboard seller'
    toast.error(errorMessage)
  } finally {
    isLoadingSellerData.value = false
  }
}

const prepareChartData = (orders) => {
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const dailyTotals = last7Days.map(day => {
    return orders
      .filter(o => o.created_at.startsWith(day))
      .reduce((sum, o) => sum + parseFloat(o.total_amount), 0)
  })

  chartData.value = {
    labels: last7Days.map(d => new Date(d).toLocaleDateString('id-ID', { weekday: 'short' })),
    datasets: [{
      label: 'Penjualan (Rp)',
      backgroundColor: '#EAB308', // primary color
      borderRadius: 8,
      data: dailyTotals
    }]
  }
}

const renderedSellerStats = computed(() => [
  { label: 'Total Pendapatan', value: `Rp ${formatPrice(sellerStatsRaw.value?.total_revenue || 0)}`, icon: 'ph:money-bold', desc: 'Total akumulasi' },
  { label: 'Total Pesanan', value: sellerStatsRaw.value?.total_orders || 0, icon: 'ph:shopping-cart-bold', desc: 'Semua pesanan masuk' },
  { label: 'Produk Terjual', value: sellerStatsRaw.value?.products_sold || 0, icon: 'ph:package-bold', desc: 'Item terbayar' },
  { label: 'Rating Toko', value: sellerStatsRaw.value?.rating || '0.0', icon: 'ph:star-bold', desc: 'Nilai dari pembeli' },
])

const clubStats = computed(() => [
  { label: 'Total Anggota', value: clubStatsData.value?.totalMembers || '0', icon: 'ph:users-three', desc: 'Total terdaftar' },
  { label: 'Pemanah Aktif', value: clubStatsData.value?.activeArchers || '0', icon: 'ph:user-focus', desc: 'Status aktif' },
  { label: 'Event Mendatang', value: clubStatsData.value?.upcomingEvents || '0', icon: 'ph:calendar-star', desc: 'Turnamen nasional' },
  { label: 'Prestasi', value: clubStatsData.value?.totalAwards || '0', icon: 'ph:medal', desc: 'Total medali' },
])

const recentMembers = computed(() => clubRecentMembers.value)
const upcomingClubTournaments = computed(() => clubUpcomingTournaments.value)

const orgCompletedEvents = computed(() => {
  const list = orgCompletedEventsData.value || []
  return list.map((e) => {
    const endDate = e.end_date || e.end_at || e.date
    const d = endDate ? new Date(endDate) : new Date()
    const statusMap = { draft: 'Draft', published: 'Publik', registration: 'Pendaftaran', ongoing: 'Berlangsung', completed: 'Selesai' }
    return {
      id: e.id || e.uuid,
      name: e.name || e.title || 'Event',
      dateLabel: d.toLocaleDateString('id-ID', { month: 'short' }),
      dayLabel: String(d.getDate()),
      statusLabel: statusMap[e.status] || e.status || 'Selesai',
      participantCount: e.participant_count || 0,
      categoryCount: e.category_count || 0
    }
  })
})

const stats = [
  { label: 'Total Atlet', value: '124', icon: 'ph:users', trend: '+12 check-ins hari ini', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
  { label: 'Target Aktif', value: '32/35', icon: 'ph:target', trend: 'Semua sistem online', trendIcon: 'ph:check-circle', trendColor: 'text-text-secondary' },
  { label: 'Penyelesaian', value: '85%', icon: 'ph:check-square-offset', trend: '', trendIcon: '', trendColor: '' },
  { label: 'Time Left', value: '45:20', icon: 'ph:timer', trend: 'Est. End: 14:30 PM', trendIcon: 'ph:clock', trendColor: 'text-text-secondary' },
]

const leaderboard = [
  { id: 1, name: 'Sarah Jenkins', category: 'Recurve Open', score: 582 },
  { id: 2, name: 'Mike Ross', category: 'Compound', score: 579 },
  { id: 3, name: 'David Chen', category: 'Recurve Open', score: 575 },
  { id: 4, name: 'Jessica Wu', category: 'Compound', score: 572 },
  { id: 5, name: 'Tom Baker', category: 'Recurve Open', score: 568 },
]

const getStatusBadgeClass = (status) => {
  const statusLower = status?.toLowerCase()
  const classes = {
    'pending': 'text-amber-600 bg-amber-50 ring-amber-500/10',
    'processing': 'text-blue-600 bg-blue-50 ring-blue-500/10',
    'shipped': 'text-purple-600 bg-purple-50 ring-purple-500/10',
    'done': 'text-green-600 bg-green-50 ring-green-500/10',
    'cancelled': 'text-red-600 bg-red-50 ring-red-500/10',
  }
  return classes[statusLower] || 'text-gray-600 bg-gray-50 ring-gray-500/10'
}

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}
</script>
