<template>
  <div v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
    <div class="card max-w-lg w-full shadow-2xl border-primary/20 relative overflow-hidden">
      <!-- Decorative background -->
      <div class="absolute top-0 right-0 -mr-16 -mt-16 size-48 bg-primary/5 rounded-full blur-3xl"></div>

      <div class="relative">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-black text-white flex items-center gap-2">
            <Icon icon="ph:qr-code-bold" class="text-primary text-2xl" />
            Register Scoring Device
          </h2>
          <button @click="$emit('update:modelValue', false)" class="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors flex items-center justify-center shrink-0">
            <Icon icon="ph:x-bold" class="text-base" />
          </button>
        </div>

        <!-- Registration Form -->
        <div v-if="!registeredDevice" class="space-y-4">
          <div>
            <BaseSelect v-model="form.tournament_id" :options="tournamentOptions" label="Target Tournament" placeholder="Select a tournament" required class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-brand-gold text-xs font-bold mb-1.5 pl-1">Device Name</label>
              <input v-model="form.device_name" type="text"
                class="w-full h-11 px-4 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                placeholder="e.g. Tablet 01" />
            </div>
            <div>
              <BaseSelect v-model="form.device_type" :options="deviceTypeOptions" label="Device Type" class="w-full" />
            </div>
          </div>

          <div class="pt-4">
            <button @click="handleRegister" :disabled="loading || !form.tournament_id"
              class="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              <Icon v-if="loading" icon="ph:spinner-bold" class="animate-spin text-lg" />
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
              <Icon icon="ph:download-simple-bold" class="text-background-dark text-4xl" />
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
const tournamentOptions = computed(() => {
  return tournaments.value.map(t => ({ title: t.name, value: t.id }))
})

const deviceTypeOptions = [
  { title: 'Tablet', value: 'tablet' },
  { title: 'Smartphone', value: 'phone' },
  { title: 'Kiosk', value: 'kiosk' }
]
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
    const res = await get('/tournaments?status=published,ongoing')
    tournaments.value = res.tournaments || res.data || []
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
