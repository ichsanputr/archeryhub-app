<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-8 space-y-6">
    <!-- Header Bar -->
    <header class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div class="space-y-1">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-[#003087] text-white flex items-center justify-center font-black text-xl shadow-xs">
            <Icon icon="logos:paypal" class="text-2xl" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              PayPal Sandbox Testing Console
              <span class="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Sandbox Mode
              </span>
            </h1>
            <div class="text-xs text-slate-400 font-medium">
              Standalone playground to test PayPal REST API v2 OAuth2 token, create orders, and capture payments.
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink to="/tournaments" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors border border-slate-700 flex items-center gap-1.5">
          <Icon icon="ph:arrow-left-bold" />
          <span>Back to App</span>
        </NuxtLink>
        <button @click="testOAuthConnection" :disabled="isCheckingAuth"
          class="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-navy text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer">
          <Icon :icon="isCheckingAuth ? 'ph:spinner-gap-bold' : 'ph:plugs-connected-bold'" :class="isCheckingAuth ? 'animate-spin' : ''" class="text-base" />
          <span>Test OAuth Token</span>
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Column (7 cols): Credentials Status & Order Creation Form -->
        <div class="lg:col-span-7 space-y-6">

          <!-- 1. OAuth2 Connection Status Card -->
          <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm font-black text-white">
                <Icon icon="ph:shield-check-bold" class="text-primary text-lg" />
                <span>Sandbox Environment & Credentials</span>
              </div>
              <span v-if="authStatus.tested"
                :class="authStatus.success ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'"
                class="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border">
                {{ authStatus.success ? 'OAuth Connected (200 OK)' : 'Auth Failed' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 space-y-1">
                <div class="text-slate-400 text-[10px] font-bold tracking-wider">Sandbox Payer / Merchant</div>
                <div class="font-mono text-slate-200 truncate font-semibold">sb-s4csl31953066@business.example.com</div>
              </div>
              <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 space-y-1">
                <div class="text-slate-400 text-[10px] font-bold tracking-wider">Client ID (Masked)</div>
                <div class="font-mono text-primary font-bold">{{ authStatus.client_id || 'AZMq...MyzK' }}</div>
              </div>
              <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 space-y-1">
                <div class="text-slate-400 text-[10px] font-bold tracking-wider">Base API URL</div>
                <div class="font-mono text-slate-300 truncate">https://api-m.sandbox.paypal.com</div>
              </div>
              <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 space-y-1">
                <div class="text-slate-400 text-[10px] font-bold tracking-wider">Exchange Rate (USD/IDR)</div>
                <div class="font-mono text-amber-400 font-black">1 USD = Rp {{ (authStatus.exchange_rate || 16000).toLocaleString('id-ID') }}</div>
              </div>
            </div>

            <div v-if="authStatus.error" class="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300">
              <strong>Error:</strong> {{ authStatus.error }}
            </div>
          </div>

          <!-- 2. Create PayPal Order Form Card -->
          <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-5 shadow-sm">
            <div class="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div class="flex items-center gap-2 text-sm font-black text-white">
                <Icon icon="ph:plus-circle-bold" class="text-primary text-lg" />
                <span>Create Test PayPal Transaction</span>
              </div>
              <span class="text-[11px] text-slate-400 font-mono">POST /v2/checkout/orders</span>
            </div>

            <!-- Quick Preset Amounts -->
            <div class="space-y-2">
              <label class="text-xs font-bold text-slate-300 block">Quick Amount Presets (USD)</label>
              <div class="flex flex-wrap gap-2">
                <button v-for="amt in ['1.00', '5.00', '15.00', '25.00', '50.00', '100.00']" :key="amt"
                  type="button"
                  @click="orderForm.amount = amt"
                  :class="orderForm.amount === amt ? 'bg-primary text-navy font-black border-primary' : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500 font-medium'"
                  class="px-3 py-1.5 rounded-xl text-xs border transition-all cursor-pointer">
                  ${{ amt }}
                </button>
              </div>
            </div>

            <!-- Amount & Currency Input -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-300 block">Amount Value</label>
                <div class="relative">
                  <input v-model="orderForm.amount" type="number" step="0.01" min="1"
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-primary"
                    placeholder="10.00" />
                  <span class="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">{{ orderForm.currency }}</span>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-300 block">Currency</label>
                <select v-model="orderForm.currency"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-primary">
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="SGD">SGD - Singapore Dollar (S$)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="AUD">AUD - Australian Dollar (A$)</option>
                </select>
              </div>
            </div>

            <!-- Description & Reference ID -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-300 block">Item / Event Name</label>
                <input v-model="orderForm.description" type="text"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-primary"
                  placeholder="Archery Tournament 2026 Registration" />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-300 block">Reference ID (Invoice/Ticket)</label>
                <div class="flex gap-2">
                  <input v-model="orderForm.reference_id" type="text"
                    class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-primary"
                    placeholder="DEV-PP-001" />
                  <button type="button" @click="generateNewRef" title="Generate New Ref"
                    class="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs transition-colors">
                    <Icon icon="ph:arrows-clockwise-bold" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Submit Create Order Button -->
            <button type="button" @click="handleCreateOrder" :disabled="isCreatingOrder"
              class="w-full py-3.5 px-5 bg-gradient-to-r from-amber-400 via-primary to-amber-500 hover:opacity-95 text-navy font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Icon :icon="isCreatingOrder ? 'ph:spinner-gap-bold' : 'ph:rocket-launch-bold'" :class="isCreatingOrder ? 'animate-spin' : ''" class="text-lg" />
              <span>{{ isCreatingOrder ? 'Creating Order on PayPal...' : 'Create PayPal Sandbox Order' }}</span>
            </button>
          </div>

        </div>

        <!-- Right Column (5 cols): Lookup Order & Real-Time JSON Log Viewer -->
        <div class="lg:col-span-5 space-y-6">

          <!-- Lookup Order by ID Card -->
          <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm font-black text-white">
                <Icon icon="ph:magnifying-glass-bold" class="text-primary text-lg" />
                <span>Lookup Order by ID</span>
              </div>
              <span class="text-[10px] text-slate-400 font-mono">GET /orders/:id</span>
            </div>

            <div class="flex gap-2">
              <input v-model="lookupOrderId" type="text"
                class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                placeholder="e.g. 4N536630VC205063A" />
              <button type="button" @click="fetchOrderDetails(lookupOrderId)" :disabled="isFetchingOrder || !lookupOrderId"
                class="px-4 py-2.5 bg-primary hover:bg-primary-hover text-navy font-black text-xs rounded-xl transition-colors shrink-0 disabled:opacity-50 cursor-pointer">
                <Icon :icon="isFetchingOrder ? 'ph:spinner-gap-bold' : 'ph:arrow-right-bold'" :class="isFetchingOrder ? 'animate-spin' : ''" />
              </button>
            </div>
          </div>

          <!-- Active Selected Order Action Card -->
          <div v-if="activeOrder" class="bg-slate-800/80 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-primary"></div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm font-black text-white truncate">
                <Icon icon="ph:credit-card-bold" class="text-primary text-lg shrink-0" />
                <span class="truncate">Order: <span class="font-mono text-primary">{{ activeOrder.order_id }}</span></span>
              </div>
              <span class="text-[11px] font-mono font-black px-2.5 py-1 rounded-md shrink-0"
                :class="getStatusBadgeClass(activeOrder.status)">
                {{ activeOrder.status }}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-700/60">
                <div class="text-slate-400 text-[10px] font-bold">Total Amount</div>
                <div class="font-black text-white text-sm">{{ activeOrder.amount }} {{ activeOrder.currency }}</div>
              </div>
              <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-700/60">
                <div class="text-slate-400 text-[10px] font-bold">Reference</div>
                <div class="font-mono text-slate-200 text-xs truncate">{{ activeOrder.reference_id }}</div>
              </div>
              <div class="p-2.5 bg-slate-900 rounded-xl border border-slate-700/60 col-span-2 sm:col-span-1">
                <div class="text-slate-400 text-[10px] font-bold">Payer</div>
                <div class="font-mono text-slate-300 text-[11px] truncate">{{ activeOrder.payer_email || 'Pending...' }}</div>
              </div>
            </div>

            <!-- Approval Link CTA -->
            <div v-if="activeOrder.status === 'CREATED' || activeOrder.status === 'PAYER_ACTION_REQUIRED'" class="space-y-2 pt-1">
              <a :href="activeOrder.approve_url || `https://www.sandbox.paypal.com/checkoutnow?token=${activeOrder.order_id}`" target="_blank" rel="noopener noreferrer"
                class="w-full py-3 px-4 bg-[#0070ba] hover:bg-[#005ea6] text-white font-black text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer">
                <Icon icon="logos:paypal" class="text-lg" />
                <span>Otorisasi & Bayar di Sandbox PayPal</span>
                <Icon icon="ph:arrow-square-out-bold" class="text-base" />
              </a>
            </div>

            <!-- Capture CTA -->
            <div v-if="activeOrder.status === 'APPROVED'" class="space-y-2 pt-1">
              <div class="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                <Icon icon="ph:check-circle-bold" />
                Pembeli telah menyetujui! Siap untuk capture dana:
              </div>
              <button type="button" @click="handleCaptureOrder(activeOrder.order_id)" :disabled="isCapturing"
                class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                <Icon :icon="isCapturing ? 'ph:spinner-gap-bold' : 'ph:check-circle-bold'" :class="isCapturing ? 'animate-spin' : ''" class="text-base" />
                <span>{{ isCapturing ? 'Capturing Payment...' : 'Capture Payment Server-Side' }}</span>
              </button>
            </div>

            <!-- Completed badge -->
            <div v-if="activeOrder.status === 'COMPLETED'" class="p-3 bg-emerald-950/60 border border-emerald-700/80 rounded-xl space-y-1 text-xs text-emerald-200">
              <div class="font-black text-emerald-400 flex items-center gap-1.5">
                <Icon icon="ph:check-bold" />
                Payment Successfully Captured & Completed!
              </div>
              <div v-if="activeOrder.payer_email" class="text-[11px] text-slate-300">
                Payer: <strong>{{ activeOrder.payer_email }}</strong>
              </div>
            </div>
          </div>

          <!-- Live JSON Inspector -->
          <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm font-black text-white">
                <Icon icon="ph:terminal-window-bold" class="text-primary text-lg" />
                <span>Live JSON Response Inspector</span>
              </div>
              <button v-if="latestLog" @click="copyLog" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
                <Icon :icon="copiedLog ? 'ph:check-bold' : 'ph:copy-bold'" />
                <span>{{ copiedLog ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>

            <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[380px] leading-relaxed select-all">
              <pre>{{ formattedLog }}</pre>
            </div>
          </div>

        </div>
      </div>

      <!-- 4. Interactive Transaction History Table List Card -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
          <div class="flex items-center gap-3">
            <div class="size-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <Icon icon="ph:list-dashes-bold" class="text-xl" />
            </div>
            <div>
              <h2 class="text-base font-black text-white tracking-tight">Daftar Transaksi PayPal Sandbox</h2>
              <div class="text-xs text-slate-400">Riwayat order yang telah dibuat untuk pengujian sandbox</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button @click="refreshAllOrders" :disabled="isRefreshingList"
              class="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer">
              <Icon :icon="isRefreshingList ? 'ph:spinner-gap-bold' : 'ph:arrows-clockwise-bold'" :class="isRefreshingList ? 'animate-spin' : ''" />
              <span>Refresh Status Semua</span>
            </button>
            <button @click="clearOrderHistory"
              class="px-3 py-1.5 rounded-xl bg-red-900/40 hover:bg-red-800/60 text-xs font-bold text-red-300 border border-red-800/60 transition-colors flex items-center gap-1 cursor-pointer">
              <Icon icon="ph:trash-bold" />
              <span>Bersihkan</span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-700/80 text-[11px] font-bold text-slate-400 tracking-wider">
                <th class="py-3 px-3">Order ID</th>
                <th class="py-3 px-3">Reference / Deskripsi</th>
                <th class="py-3 px-3">Nominal</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3">Payer Email</th>
                <th class="py-3 px-3">Waktu</th>
                <th class="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 font-medium">
              <tr v-if="orderList.length === 0">
                <td colspan="7" class="py-8 text-center text-slate-500">
                  Belum ada transaksi di riwayat pengujian. Silakan buat order baru di atas.
                </td>
              </tr>
              <tr v-for="item in orderList" :key="item.order_id"
                @click="selectOrder(item)"
                class="hover:bg-slate-700/40 transition-colors cursor-pointer"
                :class="activeOrder?.order_id === item.order_id ? 'bg-primary/10 border-l-2 border-primary' : ''">
                <td class="py-3 px-3 font-mono font-bold text-primary">{{ item.order_id }}</td>
                <td class="py-3 px-3">
                  <div class="font-mono text-slate-200 font-bold text-[11px]">{{ item.reference_id }}</div>
                  <div class="text-slate-400 text-[11px] truncate max-w-[200px]">{{ item.description }}</div>
                </td>
                <td class="py-3 px-3 font-black text-white whitespace-nowrap">{{ item.amount }} {{ item.currency }}</td>
                <td class="py-3 px-3">
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border whitespace-nowrap"
                    :class="getStatusBadgeClass(item.status)">
                    {{ item.status }}
                  </span>
                </td>
                <td class="py-3 px-3 font-mono text-[11px] text-slate-300 truncate max-w-[150px]">
                  {{ item.payer_email || '-' }}
                </td>
                <td class="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                  {{ formatDate(item.created_at) }}
                </td>
                <td class="py-3 px-3 text-right space-x-1.5 whitespace-nowrap" @click.stop>
                  <button v-if="item.status === 'CREATED'"
                    @click="openApproveUrl(item)"
                    class="px-2.5 py-1 rounded-lg bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-[10px] transition-colors">
                    Bayar
                  </button>
                  <button v-if="item.status === 'APPROVED'"
                    @click="handleCaptureOrder(item.order_id)"
                    class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors">
                    Capture
                  </button>
                  <button @click="fetchOrderDetails(item.order_id)"
                    class="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors" title="Refresh status order ini">
                    <Icon icon="ph:arrows-clockwise-bold" class="text-xs" />
                  </button>
                  <button @click="removeOrder(item.order_id)"
                    class="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 transition-colors" title="Hapus dari riwayat">
                    <Icon icon="ph:trash-bold" class="text-xs" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'

definePageMeta({
  layout: 'blank'
})

useHead({ title: 'PayPal Sandbox Testing Console - Archeris' })

const route = useRoute()
const apiBaseUrl = useApiBaseUrl()
const toast = useToast()

const isCheckingAuth = ref(false)
const isCreatingOrder = ref(false)
const isCapturing = ref(false)
const isFetchingOrder = ref(false)
const isRefreshingList = ref(false)
const copiedLog = ref(false)
const lookupOrderId = ref('4N536630VC205063A')

const authStatus = ref({
  tested: false,
  success: false,
  client_id: '',
  exchange_rate: 16000,
  error: ''
})

const orderForm = ref({
  amount: '15.00',
  currency: 'USD',
  description: 'Archeris Championship 2026 Entry Ticket',
  reference_id: `DEV-PP-${Date.now().toString().slice(-6)}`
})

const activeOrder = ref(null)
const latestLog = ref({ message: 'Ready to test PayPal Sandbox API. Click Test OAuth Token, Create Order, or select a transaction from the list below.' })
const orderList = ref([])

const formattedLog = computed(() => {
  return JSON.stringify(latestLog.value, null, 2)
})

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    case 'APPROVED':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'CREATED':
    case 'PAYER_ACTION_REQUIRED':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    case 'VOIDED':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    default:
      return 'bg-red-500/20 text-red-300 border-red-500/30'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return dateStr
  }
}

const generateNewRef = () => {
  orderForm.value.reference_id = `DEV-PP-${Date.now().toString().slice(-6)}`
}

const saveOrderListToStorage = () => {
  if (import.meta.client) {
    try {
      localStorage.setItem('paypal_dev_orders', JSON.stringify(orderList.value))
    } catch {}
  }
}

const loadOrderListFromStorage = () => {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem('paypal_dev_orders')
      if (saved) {
        orderList.value = JSON.parse(saved)
      }
    } catch {}
  }
}

const selectOrder = (item) => {
  activeOrder.value = { ...item }
  lookupOrderId.value = item.order_id
}

const openApproveUrl = (item) => {
  const url = item.approve_url || `https://www.sandbox.paypal.com/checkoutnow?token=${item.order_id}`
  window.open(url, '_blank')
}

const removeOrder = (orderId) => {
  orderList.value = orderList.value.filter(o => o.order_id !== orderId)
  saveOrderListToStorage()
  if (activeOrder.value?.order_id === orderId) {
    activeOrder.value = null
  }
}

const clearOrderHistory = () => {
  if (confirm('Hapus semua riwayat order pengujian dari browser ini?')) {
    orderList.value = []
    activeOrder.value = null
    saveOrderListToStorage()
  }
}

const testOAuthConnection = async () => {
  isCheckingAuth.value = true
  authStatus.value.error = ''
  try {
    const res = await $fetch(`${apiBaseUrl}/dev/paypal/check-token`)
    authStatus.value = {
      tested: true,
      success: true,
      client_id: res.client_id,
      exchange_rate: res.exchange_rate,
      error: ''
    }
    latestLog.value = res
  } catch (err) {
    authStatus.value = {
      tested: true,
      success: false,
      client_id: '',
      exchange_rate: 16000,
      error: err?.data?.error || err.message
    }
    latestLog.value = err?.data || { error: err.message }
  } finally {
    isCheckingAuth.value = false
  }
}

const handleCreateOrder = async () => {
  isCreatingOrder.value = true
  try {
    const res = await $fetch(`${apiBaseUrl}/dev/paypal/create-order`, {
      method: 'POST',
      body: orderForm.value
    })
    
    const newOrder = {
      order_id: res.order_id,
      status: res.status || 'CREATED',
      amount: res.amount,
      currency: res.currency,
      description: orderForm.value.description,
      reference_id: res.reference_id,
      approve_url: res.approve_url,
      payer_email: '',
      created_at: new Date().toISOString()
    }

    activeOrder.value = newOrder
    orderList.value = [newOrder, ...orderList.value.filter(o => o.order_id !== newOrder.order_id)]
    saveOrderListToStorage()

    latestLog.value = res
    generateNewRef()
  } catch (err) {
    latestLog.value = err?.data || { error: err.message }
    toast.error('Failed to create order: ' + (err?.data?.error || err.message))
  } finally {
    isCreatingOrder.value = false
  }
}

const fetchOrderDetails = async (orderId) => {
  if (!orderId) return
  isFetchingOrder.value = true
  try {
    const res = await $fetch(`${apiBaseUrl}/dev/paypal/order/${orderId}`)
    latestLog.value = res

    const orderData = res.data || {}
    const pu = (orderData.purchase_units && orderData.purchase_units[0]) || {}
    const amountVal = pu.amount ? pu.amount.value : ''
    const currencyVal = pu.amount ? pu.amount.currency_code : 'USD'
    const payerEmail = orderData.payer?.email_address || orderData.payment_source?.paypal?.email_address || ''
    
    let approveLink = ''
    if (orderData.links) {
      const approveObj = orderData.links.find(l => l.rel === 'approve' || l.rel === 'payer-action')
      if (approveObj) approveLink = approveObj.href
    }

    const updatedItem = {
      order_id: orderData.id || orderId,
      status: orderData.status || 'UNKNOWN',
      amount: amountVal || '5.00',
      currency: currencyVal,
      description: pu.description || 'PayPal Test Transaction',
      reference_id: pu.reference_id || pu.custom_id || 'DEV-PP',
      approve_url: approveLink,
      payer_email: payerEmail,
      created_at: orderData.create_time || new Date().toISOString()
    }

    activeOrder.value = updatedItem
    
    // Update in list
    const existingIdx = orderList.value.findIndex(o => o.order_id === updatedItem.order_id)
    if (existingIdx >= 0) {
      orderList.value[existingIdx] = updatedItem
    } else {
      orderList.value = [updatedItem, ...orderList.value]
    }
    saveOrderListToStorage()
  } catch (err) {
    latestLog.value = err?.data || { error: err.message }
    toast.error('Failed to fetch order: ' + (err?.data?.error || err.message))
  } finally {
    isFetchingOrder.value = false
  }
}

const handleCaptureOrder = async (orderId) => {
  isCapturing.value = true
  try {
    const res = await $fetch(`${apiBaseUrl}/dev/paypal/capture-order`, {
      method: 'POST',
      body: { order_id: orderId }
    })
    
    if (activeOrder.value && activeOrder.value.order_id === orderId) {
      activeOrder.value.status = res.status || 'COMPLETED'
      if (res.payer?.email_address) {
        activeOrder.value.payer_email = res.payer.email_address
      }
    }

    // Update in list
    const idx = orderList.value.findIndex(o => o.order_id === orderId)
    if (idx >= 0) {
      orderList.value[idx].status = res.status || 'COMPLETED'
      if (res.payer?.email_address) {
        orderList.value[idx].payer_email = res.payer.email_address
      }
      saveOrderListToStorage()
    }

    latestLog.value = res
  } catch (err) {
    latestLog.value = err?.data || { error: err.message }
    toast.error('Failed to capture order: ' + (err?.data?.error || err.message))
  } finally {
    isCapturing.value = false
  }
}

const refreshAllOrders = async () => {
  isRefreshingList.value = true
  for (const item of orderList.value) {
    try {
      const res = await $fetch(`${apiBaseUrl}/dev/paypal/order/${item.order_id}`)
      if (res.data) {
        item.status = res.data.status || item.status
        if (res.data.payer?.email_address) {
          item.payer_email = res.data.payer.email_address
        }
      }
    } catch {}
  }
  saveOrderListToStorage()
  isRefreshingList.value = false
}

const copyLog = async () => {
  try {
    await navigator.clipboard.writeText(formattedLog.value)
    copiedLog.value = true
    setTimeout(() => { copiedLog.value = false }, 2000)
  } catch {}
}

onMounted(() => {
  loadOrderListFromStorage()
  testOAuthConnection()

  // Always pre-load order 4N536630VC205063A if not in list
  fetchOrderDetails('4N536630VC205063A')

  // If redirected back from PayPal approval
  const token = route.query.token
  const ref = route.query.ref
  const status = route.query.status

  if (token && status === 'approved') {
    fetchOrderDetails(token)
  }
})
</script>
