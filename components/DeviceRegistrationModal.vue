<template>
  <div v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm">
    <div class="card max-w-lg w-full shadow-2xl border-primary/20 relative overflow-hidden">
      <!-- Decorative background -->
      <div class="absolute top-0 right-0 -mr-16 -mt-16 size-48 bg-primary/5 rounded-full blur-3xl"></div>

      <div class="relative">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-black text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">qr_code_scanner</span>
            Register Scoring Device
          </h2>
          <button @click="$emit('update:modelValue', false)" class="text-brand-gold hover:text-white transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Registration Form -->
        <div v-if="!registeredDevice" class="space-y-4">
          <div>
            <label class="block text-brand-gold text-xs font-bold  mb-1.5 pl-1">Target Tournament</label>
            <select v-model="form.tournament_id" class="input w-full">
              <option value="" disabled>Select a tournament</option>
              <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-brand-gold text-xs font-bold  mb-1.5 pl-1">Device Name</label>
              <input v-model="form.device_name" type="text" class="input w-full" placeholder="e.g. Tablet 01" />
            </div>
            <div>
              <label class="block text-brand-gold text-xs font-bold  mb-1.5 pl-1">Device Type</label>
              <select v-model="form.device_type" class="input w-full">
                <option value="tablet">Tablet</option>
                <option value="phone">Smartphone</option>
                <option value="kiosk">Kiosk</option>
              </select>
            </div>
          </div>

          <div class="pt-4">
            <button @click="handleRegister" :disabled="loading || !form.tournament_id"
              class="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>Generate QR Code</span>
            </button>
          </div>
        </div>

        <!-- Registered Result (QR Code) -->
        <div v-else class="flex flex-col items-center py-6 text-center">
          <div class="bg-white p-4 rounded-xl shadow-lg mb-6 group relative">
            <img :src="qrCodeUrl" alt="Device QR Code" class="size-48" />
            <div
              class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="material-symbols-outlined text-background-dark text-4xl">download_for_offline</span>
            </div>
          </div>

          <div class="space-y-2 mb-8">
            <p class="text-white font-bold text-lg">Scan this code on the scoring app</p>
            <p class="text-brand-gold text-sm max-w-xs mx-auto">This code will link this device to <span
                class="text-white">{{ form.device_name || 'this scoring station' }}</span></p>
          </div>

          <div class="grid grid-cols-2 gap-4 w-full px-8">
            <div class="bg-surface-highlight p-3 rounded-lg border border-white/5">
              <p class="text-[10px]  text-brand-gold font-bold mb-1">Device Code</p>
              <p class="text-white font-mono font-bold tracking-widest text-lg">{{ registeredDevice.device_code }}</p>
            </div>
            <div class="bg-surface-highlight p-3 rounded-lg border border-white/5">
              <p class="text-[10px]  text-brand-gold font-bold mb-1">PIN</p>
              <p class="text-primary font-mono font-bold tracking-widest text-lg">{{ registeredDevice.pin }}</p>
            </div>
          </div>

          <button @click="resetAndClose"
            class="mt-8 text-brand-gold text-sm font-bold hover:text-white transition-colors">
            Done, I've scanned it
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'registered'])
const { get, post } = useApi()

const loading = ref(false)
const tournaments = ref([])
const registeredDevice = ref(null)
const qrCodeUrl = ref('')

const form = ref({
  tournament_id: '',
  device_name: '',
  device_type: 'tablet',
  target_assignment: '',
  session: 1
})

const fetchTournaments = async () => {
  try {
    const res = await get('/events?status=published,ongoing')
    tournaments.value = res.tournaments || []
  } catch (e) {
    console.error('Failed to fetch tournaments', e)
  }
}

const handleRegister = async () => {
  loading.value = true
  try {
    const res = await post('/devices', form.value)
    if (res && res.id) {
      registeredDevice.value = res
      qrCodeUrl.value = `${useRuntimeConfig().public.apiBaseUrl}/devices/${res.id}/qrcode`
      emit('registered', res)
    }
  } catch (e) {
    console.error('Registration failed', e)
  } finally {
    loading.value = false
  }
}

const resetAndClose = () => {
  registeredDevice.value = null
  qrCodeUrl.value = ''
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    fetchTournaments()
  }
})
</script>
