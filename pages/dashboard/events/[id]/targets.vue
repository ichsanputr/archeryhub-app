<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <!-- Enhanced Header -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-20"
        style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
      </div>

      <!-- Decorative Background Elements -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <!-- Header Content -->
      <div class="relative p-6 sm:p-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex items-start gap-4">
            <!-- Icon Badge -->
            <div
              class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon icon="ph:target" class="text-primary text-2xl" />
            </div>

            <!-- Title Section -->
            <div class="flex-1">
              <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                Manajemen Target
              </h1>
              <p class="text-slate-300 text-sm max-w-2xl">
                Kelola target dan bantalan untuk event {{ eventName }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 flex-shrink-0">
            <BaseButton variant="white" icon="ph:download" class="h-11 px-5">
              <span class="hidden sm:inline">Ekspor Data</span>
              <span class="sm:hidden">Ekspor</span>
            </BaseButton>
            <BaseButton @click="showCreateDialog = true" variant="primary" icon="ph:plus-bold"
              class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
              <span class="hidden sm:inline">Tambah Target Baru</span>
              <span class="sm:hidden">Tambah</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Targets Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50/50 border-b border-gray-100">
            <tr class="text-[10px] font-black text-gray-400  tracking-widest">
              <th class="px-6 py-4">No Target</th>
              <th class="px-6 py-4">Nama Target</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="3" class="px-6 py-12">
                <div class="flex flex-col items-center justify-center gap-3">
                  <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                  <span class="text-sm text-gray-500 font-medium">Memuat target...</span>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="targets.length === 0">
              <td colspan="3" class="px-6 py-12">
                <div class="flex flex-col items-center justify-center gap-4">
                  <div class="size-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon icon="ph:target" class="text-4xl text-gray-400" />
                  </div>
                  <div class="text-center">
                    <p class="text-gray-700 font-semibold mb-1">Belum ada target yang dikonfigurasi</p>
                    <p class="text-sm text-gray-500">Klik "Tambah Target Baru" untuk membuat target pertama Anda</p>
                  </div>
                  <BaseButton @click="showCreateDialog = true" variant="primary" icon="ph:plus-bold" class="mt-2">
                    Tambah Target Baru
                  </BaseButton>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr v-else v-for="target in targets" :key="target.id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="size-10 rounded-lg bg-navy text-white flex items-center justify-center font-black text-sm">
                    {{ target.target_number }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-bold text-navy">{{ target.target_name }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button @click="editTarget(target)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group/btn">
                    <Icon icon="ph:pencil-simple" class="text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button @click="confirmDelete(target)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group/btn">
                    <Icon icon="ph:trash" class="text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      <!-- Pagination Footer -->
      <div v-if="targets.length > 0 || page > 1"
        class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span class="text-sm text-gray-500">
          Menampilkan {{ (page - 1) * limit + 1 }} - {{ Math.min(page * limit, total) }} dari {{ total }} target
        </span>
        <div class="flex items-center gap-2">
          <button @click="prevPage" :disabled="page === 1"
            class="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600">
            <Icon icon="ph:caret-left-bold" />
          </button>
          <span class="text-sm font-medium text-navy px-2">
            Halaman {{ page }} dari {{ totalPages }}
          </span>
          <button @click="nextPage" :disabled="page >= totalPages"
            class="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600">
            <Icon icon="ph:caret-right-bold" />
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showCreateDialog || showEditDialog"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          @click.self="closeDialog">
          <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <!-- Dialog Header -->
            <div class="sticky top-0 bg-white px-6 py-4 rounded-t-2xl border-b border-gray-200 z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="size-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:target" class="text-xl text-navy" />
                  </div>
                  <h3 class="text-xl font-black text-navy">
                    {{ showEditDialog ? 'Edit Target' : 'Tambah Target Baru' }}
                  </h3>
                </div>
                <button @click="closeDialog" class="text-gray-400 hover:text-navy transition-colors">
                  <Icon icon="ph:x" class="text-2xl" />
                </button>
              </div>
            </div>

            <!-- Dialog Body -->
            <form @submit.prevent="submitForm" class="p-6 space-y-5">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">Nama Target *</label>
                <input v-model="form.target_name" type="number" required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Contoh: 6" />
                <p class="text-xs text-gray-500 mt-1.5">Nomor urut bantalan target.</p>
              </div>

              <div v-if="showEditDialog">
                <label class="block text-sm font-bold text-gray-700 mb-2">Nomor Target *</label>
                <input v-model="form.target_number" type="text" required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="A" />
              </div>

              <div v-else>
                <BaseSelect v-model="form.target_count" label="Nomor Target" :items="targetCountOptions" required />
                <p class="text-xs text-gray-500 mt-1.5">Sistem akan membuat bantalan A, B, C, D sesuai pilihan Anda.</p>
              </div>

              <!-- Dialog Footer -->
              <div class="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" @click="closeDialog"
                  class="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                  Batal
                </button>
                <button type="submit" :disabled="submitting"
                  class="flex-1 px-4 py-3 bg-primary text-navy rounded-xl font-bold hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30">
                  {{ submitting ? 'Menyimpan...' : (showEditDialog ? 'Perbarui Target' : 'Buat Target') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Dialog -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showDeleteDialog"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          @click.self="showDeleteDialog = false">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div class="p-6">
              <div class="flex items-start gap-4 mb-4">
                <div class="size-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon icon="ph:warning" class="text-2xl text-red-600" />
                </div>
                <div>
                  <h3 class="text-xl font-black text-navy mb-2">Konfirmasi Hapus</h3>
                  <p class="text-gray-600">
                    Apakah Anda yakin ingin menghapus <strong class="text-navy">{{ targetToDelete?.target_name
                    }}</strong>?
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
              <div class="flex gap-3">
                <button type="button" @click="showDeleteDialog = false"
                  class="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                  Batal
                </button>
                <button @click="deleteTarget" :disabled="submitting"
                  class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50">
                  {{ submitting ? 'Menghapus...' : 'Hapus' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const route = useRoute()
const { get, post, put, delete: deleteApi } = useApi()
const toast = useToast()

const eventId = route.params.id
const eventName = ref('Loading...')

const targets = ref([])
const loading = ref(false)
const submitting = ref(false)

// Pagination state
const page = ref(1)
const limit = ref(10)
const total = ref(0) // Total items from API

const totalPages = computed(() => Math.ceil(total.value / limit.value))

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const targetToDelete = ref(null)

const form = ref({
  target_name: '',
  target_number: '',
  target_count: 1
})

const targetCountOptions = [
  { title: '1 Target', value: 1 },
  { title: '2 Target', value: 2 },
  { title: '3 Target', value: 3 },
  { title: '4 Target', value: 4 }
]

const currentTargetId = ref(null)

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Manajemen Target - Dashboard'
})

const breadcrumbItems = computed(() => [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Events', to: '/dashboard/events' },
  { label: eventName.value || 'Event', to: `/dashboard/events/${eventId}` }
])

const parseTargetNumbers = (value) => {
  return (value || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
}

const fetchTargets = async () => {
  loading.value = true
  try {
    const response = await get(`/events/${eventId}/targets`, {
      params: {
        page: page.value,
        limit: limit.value
      }
    })
    targets.value = response?.targets || []
    total.value = response?.total || 0
  } catch (error) {
    console.error('Failed to fetch targets:', error)
    toast.error('Failed to load targets')
  } finally {
    loading.value = false
  }
}

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    fetchTargets()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchTargets()
  }
}

const fetchEventInfo = async () => {
  try {
    const response = await get(`/events/${eventId}`)
    eventName.value = response?.event?.event_name || 'Event'
  } catch (error) {
    console.error('Failed to fetch event:', error)
  }
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (showEditDialog.value) {
      await put(`/events/${eventId}/targets/${currentTargetId.value}`, {
        target_number: form.value.target_number,
        target_name: form.value.target_name
      })
      toast.success('Target berhasil diperbarui')
    } else {
      const count = parseInt(form.value.target_count)
      const prefix = form.value.target_name
      const letters = ['A', 'B', 'C', 'D']
      const targetNumbers = []

      for (let i = 0; i < count; i++) {
        targetNumbers.push(`${prefix}${letters[i]}`)
      }

      await post(`/events/${eventId}/targets`, {
        target_name: form.value.target_name.toString(),
        target_numbers: targetNumbers
      })
      toast.success('Target berhasil dibuat')
    }
    closeDialog()
    await fetchTargets()
  } catch (error) {
    console.error('Failed to save target:', error)
    toast.error(error?.data?.error || 'Gagal menyimpan target')
  } finally {
    submitting.value = false
  }
}

const editTarget = (target) => {
  currentTargetId.value = target.id
  form.value = {
    target_number: target.target_number,
    target_name: target.target_name,
    target_count: 1
  }
  showEditDialog.value = true
}

const confirmDelete = (target) => {
  targetToDelete.value = target
  showDeleteDialog.value = true
}

const deleteTarget = async () => {
  submitting.value = true
  try {
    await deleteApi(`/events/${eventId}/targets/${targetToDelete.value.id}`)
    toast.success('Target berhasil dihapus')
    showDeleteDialog.value = false
    await fetchTargets()
  } catch (error) {
    console.error('Failed to delete target:', error)
    toast.error(error?.data?.error || 'Gagal menghapus target')
  } finally {
    submitting.value = false
  }
}

const closeDialog = () => {
  showCreateDialog.value = false
  showEditDialog.value = false
  currentTargetId.value = null
  form.value = {
    target_name: '',
    target_number: '',
    target_count: 1
  }
}

onMounted(() => {
  fetchTargets()
  fetchEventInfo()
})
</script>
