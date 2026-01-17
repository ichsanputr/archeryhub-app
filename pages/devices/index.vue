<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-white">Device Management</h1>
        <p class="text-brand-gold mt-1">Monitor and pair tablets for live scoring</p>
      </div>
      <button @click="showModal = true" class="btn-primary flex items-center gap-2">
        <span class="material-symbols-outlined">add_circle</span>
        Add New Device
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="card p-4 flex items-center gap-4">
        <div :class="stat.colorClass" class="size-12 rounded-lg flex items-center justify-center bg-opacity-10">
          <span class="material-symbols-outlined">{{ stat.icon }}</span>
        </div>
        <div>
          <p class="text-[10px] uppercase text-brand-gold font-bold tracking-wider">{{ stat.label }}</p>
          <p class="text-white text-xl font-bold">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Device List -->
    <div class="card p-0 overflow-hidden shadow-xl border-white/5">
      <div v-if="loading" class="py-20 flex flex-col items-center justify-center gap-4">
        <div class="loading-spinner"></div>
        <p class="text-brand-gold/60">Fetching device statuses...</p>
      </div>

      <div v-else-if="devices.length === 0" class="py-20 text-center flex flex-col items-center gap-4">
        <span class="material-symbols-outlined text-6xl text-brand-gold/10">tablet_mac</span>
        <div>
          <h3 class="text-lg font-bold text-white">No devices registered</h3>
          <p class="text-brand-gold/60 text-sm">Register your first scoring tablet to begin</p>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-surface-highlight/50 text-left border-b border-white/5">
              <th class="px-6 py-4 text-[10px] uppercase text-brand-gold font-black tracking-widest">Device</th>
              <th class="px-6 py-4 text-[10px] uppercase text-brand-gold font-black tracking-widest">Type</th>
              <th class="px-6 py-4 text-[10px] uppercase text-brand-gold font-black tracking-widest">Assignment</th>
              <th class="px-6 py-4 text-[10px] uppercase text-brand-gold font-black tracking-widest">Status</th>
              <th class="px-6 py-4 text-[10px] uppercase text-brand-gold font-black tracking-widest">Last Sync</th>
              <th class="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="device in devices" :key="device.id" class="hover:bg-white/[0.02] transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="size-10 rounded-lg bg-surface-highlight flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-primary">{{ getDeviceIcon(device.device_type) }}</span>
                  </div>
                  <div>
                    <p class="text-white font-bold text-sm">{{ device.device_name || 'Unnamed Device' }}</p>
                    <p class="text-brand-gold text-[10px] font-mono tracking-tighter uppercase opacity-50">{{
                      device.device_code }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-white/60 text-xs font-medium uppercase tracking-wide">{{ device.device_type }}</span>
              </td>
              <td class="px-6 py-4">
                <div v-if="device.target_assignment" class="flex flex-col">
                  <span class="text-white text-xs font-bold">{{ device.target_assignment }}</span>
                  <span class="text-brand-gold text-[10px]">Session {{ device.session }}</span>
                </div>
                <span v-else class="text-brand-gold/30 italic text-xs">Unassigned</span>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(device.status)"
                  class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                  {{ device.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-[10px] text-brand-gold font-medium">
                {{ formatLastSync(device.last_sync) }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    class="p-2 rounded hover:bg-surface-highlight text-gray-400 hover:text-white transition-colors">
                    <span class="material-symbols-outlined text-[20px]">settings</span>
                  </button>
                  <button class="p-2 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Registration Modal -->
    <DeviceRegistrationModal v-model="showModal" @registered="fetchDevices" />
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Device Management',
  layout: 'default',
  middleware: 'auth'
})

const { get } = useApi()
const devices = ref([])
const loading = ref(false)
const showModal = ref(false)

const stats = computed(() => [
  { label: 'Active Devices', value: devices.value.filter(d => d.status === 'active').length, icon: 'tablet_mac', colorClass: 'bg-green-500 text-green-500' },
  { label: 'Paired Sessions', value: new Set(devices.value.map(d => d.session)).size, icon: 'hub', colorClass: 'bg-primary text-primary' },
  { label: 'Out of Sync', value: 0, icon: 'sync_problem', colorClass: 'bg-orange-500 text-orange-500' },
])

const fetchDevices = async () => {
  loading.value = true
  try {
    // For now get across all tournaments or implement specific selector
    const res = await get('/tournaments')
    const allDevices = []

    if (res && res.tournaments) {
      for (const t of res.tournaments) {
        try {
          const dRes = await get(`/tournaments/${t.id}/devices`)
          if (dRes && dRes.devices) {
            allDevices.push(...dRes.devices)
          }
        } catch (e) { /* ignore individual failures */ }
      }
    }
    devices.value = allDevices
  } catch (e) {
    console.error('Failed to fetch devices', e)
  } finally {
    loading.value = false
  }
}

const getDeviceIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'tablet': return 'tablet_mac'
    case 'phone': return 'smartphone'
    case 'kiosk': return 'desktop_windows'
    default: return 'devices'
  }
}

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-green-500/10 text-green-500'
    case 'inactive': return 'bg-gray-500/10 text-gray-500'
    case 'disconnected': return 'bg-red-500/10 text-red-500'
    default: return 'bg-brand-gold/10 text-brand-gold'
  }
}

const formatLastSync = (timestamp) => {
  if (!timestamp) return 'Never synced'
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(fetchDevices)
</script>
