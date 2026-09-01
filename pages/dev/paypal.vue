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
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
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
        <NuxtLink to="/events" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors border border-slate-700 flex items-center gap-1.5">
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

    <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
              <div class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Sandbox Payer / Merchant</div>
              <div class="font-mono text-slate-200 truncate font-semibold">sb-s4csl31953066@business.example.com</div>
            </div>
            <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 space-y-1">
              <div class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Client ID (Masked)</div>
              <div class="font-mono text-primary font-bold">{{ authStatus.client_id || 'AZMq...MyzK' }}</div>
            </div>
            <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 space-y-1">
              <div class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Base API URL</div>
              <div class="font-mono text-slate-300 truncate">https://api-m.sandbox.paypal.com</div>
            </div>
            <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 space-y-1">
              <div class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Exchange Rate (USD/IDR)</div>
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

        <!-- 3. Active Order & Capture Action Card -->
        <div v-if="activeOrder" class="bg-slate-800/80 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-primary"></div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm font-black text-white">
              <Icon icon="ph:credit-card-bold" class="text-primary text-lg" />
              <span>Active Order: <span class="font-mono text-primary">{{ activeOrder.order_id }}</span></span>
            </div>
            <span class="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-md"
              :class="activeOrder.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'">
              Status: {{ activeOrder.status }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 bg-slate-900 rounded-xl border border-slate-700/60">
              <div class="text-slate-400 text-[10px] uppercase font-bold">Total Amount</div>
              <div class="font-black text-white text-sm">{{ activeOrder.amount }} {{ activeOrder.currency }}</div>
            </div>
            <div class="p-3 bg-slate-900 rounded-xl border border-slate-700/60">
              <div class="text-slate-400 text-[10px] uppercase font-bold">Reference ID</div>
              <div class="font-mono text-slate-200 text-xs truncate">{{ activeOrder.reference_id }}</div>
            </div>
            <div class="p-3 bg-slate-900 rounded-xl border border-slate-700/60">
              <div class="text-slate-400 text-[10px] uppercase font-bold">Order ID</div>
              <div class="font-mono text-amber-400 text-xs truncate">{{ activeOrder.order_id }}</div>
            </div>
          </div>

          <!-- Approval Link CTA -->
          <div v-if="activeOrder.approve_url && activeOrder.status !== 'COMPLETED'" class="space-y-3 pt-1">
            <div class="text-xs text-slate-300">
              Step 1: Klik tombol di bawah untuk membuka halaman otorisasi pembayaran PayPal Sandbox:
            </div>
            <a :href="activeOrder.approve_url" target="_blank" rel="noopener noreferrer"
              class="w-full py-3 px-4 bg-[#0070ba] hover:bg-[#005ea6] text-white font-black text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer">
              <Icon icon="logos:paypal" class="text-lg" />
              <span>Otorisasi & Bayar di Sandbox PayPal (Buka Tab Baru)</span>
              <Icon icon="ph:arrow-square-out-bold" class="text-base" />
            </a>

            <div class="pt-2 border-t border-slate-700/80 space-y-2">
              <div class="text-xs text-slate-300">
                Step 2: Setelah menyetujui pembayaran di Sandbox PayPal, klik tombol di bawah untuk mengeksekusi penarikan dana (Capture):
              </div>
              <button type="button" @click="handleCaptureOrder(activeOrder.order_id)" :disabled="isCapturing"
                class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                <Icon :icon="isCapturing ? 'ph:spinner-gap-bold' : 'ph:check-circle-bold'" :class="isCapturing ? 'animate-spin' : ''" class="text-base" />
                <span>{{ isCapturing ? 'Capturing Payment...' : 'Capture Payment Server-Side' }}</span>
              </button>
            </div>
          </div>

          <!-- Capture Result -->
          <div v-if="captureResult" class="p-4 bg-emerald-950/60 border border-emerald-700/80 rounded-xl space-y-2 text-xs text-emerald-200">
            <div class="font-black text-sm text-emerald-400 flex items-center gap-1.5">
              <Icon icon="ph:check-bold" />
              Payment Successfully Captured!
            </div>
            <div v-if="captureResult.payer" class="space-y-1 text-slate-300">
              <div><strong>Payer Email:</strong> {{ captureResult.payer.email_address }}</div>
              <div><strong>Payer Name:</strong> {{ captureResult.payer.name?.given_name }} {{ captureResult.payer.name?.surname }}</div>
              <div><strong>Payer ID:</strong> {{ captureResult.payer.payer_id }}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column (5 cols): Live JSON Log Viewer -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm font-black text-white">
              <Icon icon="ph:terminal-window-bold" class="text-primary text-lg" />
              <span>Real-Time JSON Response Inspector</span>
            </div>
            <button v-if="latestLog" @click="copyLog" class="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              <Icon :icon="copiedLog ? 'ph:check-bold' : 'ph:copy-bold'" />
              <span>{{ copiedLog ? 'Copied' : 'Copy' }}</span>
            </button>
          </div>

          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[600px] leading-relaxed select-all">
            <pre>{{ formattedLog }}</pre>
          </div>
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

useHead({ title: 'PayPal Sandbox Testing Console - ArcheryHub' })

const route = useRoute()
const apiBaseUrl = useApiBaseUrl()

const isCheckingAuth = ref(false)
const isCreatingOrder = ref(false)
const isCapturing = ref(false)
const copiedLog = ref(false)

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
  description: 'ArcheryHub Championship 2026 Entry Ticket',
  reference_id: `DEV-PP-${Date.now().toString().slice(-6)}`
})

const activeOrder = ref(null)
const captureResult = ref(null)
const latestLog = ref({ message: 'Ready to test PayPal Sandbox API. Click Test OAuth Token or Create Order.' })

const formattedLog = computed(() => {
  return JSON.stringify(latestLog.value, null, 2)
})

const generateNewRef = () => {
  orderForm.value.reference_id = `DEV-PP-${Date.now().toString().slice(-6)}`
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
  captureResult.value = null
  try {
    const res = await $fetch(`${apiBaseUrl}/dev/paypal/create-order`, {
      method: 'POST',
      body: orderForm.value
    })
    activeOrder.value = {
      order_id: res.order_id,
      status: res.status,
      amount: res.amount,
      currency: res.currency,
      reference_id: res.reference_id,
      approve_url: res.approve_url
    }
    latestLog.value = res
  } catch (err) {
    latestLog.value = err?.data || { error: err.message }
    alert('Failed to create order: ' + (err?.data?.error || err.message))
  } finally {
    isCreatingOrder.value = false
  }
}

const handleCaptureOrder = async (orderId) => {
  isCapturing.value = true
  try {
    const res = await $fetch(`${apiBaseUrl}/dev/paypal/capture-order`, {
      method: 'POST',
      body: { order_id: orderId }
    })
    captureResult.value = res
    if (activeOrder.value) {
      activeOrder.value.status = res.status || 'COMPLETED'
    }
    latestLog.value = res
  } catch (err) {
    latestLog.value = err?.data || { error: err.message }
    alert('Failed to capture order: ' + (err?.data?.error || err.message))
  } finally {
    isCapturing.value = false
  }
}

const copyLog = async () => {
  try {
    await navigator.clipboard.writeText(formattedLog.value)
    copiedLog.value = true
    setTimeout(() => { copiedLog.value = false }, 2000)
  } catch {}
}

onMounted(() => {
  testOAuthConnection()

  // If redirected back from PayPal approval
  const token = route.query.token
  const ref = route.query.ref
  const status = route.query.status

  if (token && status === 'approved') {
    activeOrder.value = {
      order_id: token,
      status: 'APPROVED',
      amount: '15.00',
      currency: 'USD',
      reference_id: ref || 'DEV-PP-RETURN',
      approve_url: ''
    }
    latestLog.value = {
      message: 'Returned from PayPal with approval token!',
      token,
      ref,
      status
    }
  }
})
</script>
