<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Manajemen Target</h1>
          <p class="text-gray-500 text-sm">Kelola target dan bantalan untuk event {{ eventName }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 flex-shrink-0">
          <BaseButton variant="white" icon="ph:download" class="h-10 md:h-11 px-4 md:px-5">
            <span class="hidden sm:inline">Ekspor Data</span>
            <span class="sm:hidden">Ekspor</span>
          </BaseButton>
          <BaseButton @click="showCreateDialog = true" variant="primary" icon="ph:plus-bold"
            class="h-10 md:h-11 px-4 md:px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
            <span class="hidden sm:inline">Tambah Target Baru</span>
            <span class="sm:hidden">Tambah</span>
          </BaseButton>
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
                <input v-model="form.target_name" type="text" required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Contoh: 10" />
                <p class="text-xs text-gray-500 mt-1.5">Nama target digunakan bersama untuk beberapa nomor.</p>
              </div>

              <div v-if="showEditDialog">
                <label class="block text-sm font-bold text-gray-700 mb-2">Nomor Target *</label>
                <input v-model="form.target_number" type="text" required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="A" />
              </div>

              <div v-else>
                <label class="block text-sm font-bold text-gray-700 mb-2">Nomor Target (pisahkan dengan koma) *</label>
                <input v-model="form.target_numbers" type="text" required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="A, X, Z" />
                <p class="text-xs text-gray-500 mt-1.5">Sistem akan membuat satu baris untuk setiap nomor.</p>
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

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const targetToDelete = ref(null)

const form = ref({
  target_name: '',
  target_number: '',
  target_numbers: ''
})

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
    const response = await get(`/events/${eventId}/targets`)
    targets.value = response?.targets || []
  } catch (error) {
    console.error('Failed to fetch targets:', error)
    toast.error('Failed to load targets')
  } finally {
    loading.value = false
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
      const targetNumbers = parseTargetNumbers(form.value.target_numbers)
      await post(`/events/${eventId}/targets`, {
        target_name: form.value.target_name,
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
    target_numbers: ''
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
    target_numbers: ''
  }
}

onMounted(() => {
  fetchTargets()
  fetchEventInfo()
})
</script>
