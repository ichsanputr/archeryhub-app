<template>
  <div class="flex flex-col gap-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-2">
        <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Kategori Lomba</h1>
        <p class="text-text-secondary text-sm md:text-base font-medium max-w-2xl">
          Kelola daftar kategori lomba yang akan digunakan saat membuat event. Kombinasikan jenis busur dan kelompok
          umur.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton variant="white" icon="ph:arrows-clockwise" class="h-11" @click="fetchReferenceData">
          Muat Ulang
        </BaseButton>
        <BaseButton variant="primary" icon="ph:plus-bold" class="h-11 shadow-md shadow-primary/20"
          @click="openCreateDialog">
          Kategori Baru
        </BaseButton>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Reference Filters -->
      <div class="space-y-4">
        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="text-sm font-bold text-gray-400  tracking-[0.2em] mb-1">Referensi</h2>
          <div class="space-y-3">
            <div>
              <p class="text-xs font-bold text-gray-500 mb-1.5">Jenis Busur</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="bow in bowTypes" :key="bow.id" @click="activeBow = bow.id"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all" :class="activeBow === bow.id
                    ? 'bg-navy text-primary border-navy'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-navy hover:text-navy'">
                  {{ bow.name }}
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 mb-1.5">Kelompok Umur</p>
              <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto scrollbar-thin">
                <span v-for="age in ageGroups" :key="age.id"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-50 text-gray-600 border border-gray-100">
                  {{ age.name }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2">
          <h3 class="text-xs font-bold text-blue-900  tracking-[0.2em] flex items-center gap-1.5">
            <Icon icon="ph:info-bold" class="text-blue-500 text-base" />
            Tips
          </h3>
          <p class="text-xs text-blue-900/80 leading-relaxed">
            Kategori lomba akan muncul saat membuat event baru. Buat kombinasi yang rapi agar penyusunan kualifikasi
            dan eliminasi lebih mudah.
          </p>
        </section>
      </div>

      <!-- Right: Categories Table -->
      <div class="lg:col-span-2 space-y-4">
        <section class="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <div class="bg-gray-50 p-2 rounded-lg text-primary-hover">
                <Icon icon="ph:tag-bold" class="text-xl" />
              </div>
              <div>
                <h2 class="text-base font-bold text-navy">Daftar Kategori Lomba</h2>
                <p class="text-xs text-gray-500 font-medium">
                  {{ filteredCategories.length }} kategori aktif
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="relative">
                <span
                  class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                <input v-model="searchQuery" type="text" placeholder="Cari kategori..."
                  class="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-44" />
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="p-6 space-y-3">
            <div class="h-10 bg-gray-50 rounded-xl animate-pulse"></div>
            <div class="h-10 bg-gray-50 rounded-xl animate-pulse"></div>
            <div class="h-10 bg-gray-50 rounded-xl animate-pulse"></div>
          </div>

          <div v-else>
            <div v-if="!filteredCategories.length" class="p-8 text-center space-y-3">
              <div
                class="w-12 h-12 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                <Icon icon="ph:tag-bold" class="text-2xl text-gray-300" />
              </div>
              <h3 class="text-sm font-bold text-navy">Belum ada kategori lomba</h3>
              <p class="text-xs text-gray-500 max-w-sm mx-auto">
                Mulai dengan membuat kombinasi jenis busur dan kelompok umur. Kategori ini akan digunakan di semua
                event.
              </p>
              <BaseButton variant="primary" icon="ph:plus-bold" class="h-10 mt-1" @click="openCreateDialog">
                Kategori Pertama
              </BaseButton>
            </div>

            <div v-else class="divide-y divide-gray-50">
              <div v-for="cat in filteredCategories" :key="cat.id"
                class="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon icon="ph:target-bold" class="text-lg" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-navy truncate">
                      {{ cat.name }}
                    </p>
                    <p class="text-[11px] text-gray-500 font-medium flex items-center gap-2">
                      <span class=" tracking-[0.14em]">{{ cat.bow_name }}</span>
                      <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span class=" tracking-[0.14em]">{{ cat.age_name }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {{ cat.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                  </span>
                  <BaseButton variant="ghost" size="xs" icon="ph:pencil-simple-line" class="!px-2"
                    @click="editCategory(cat)">
                    Edit
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Create / Edit Dialog (simple inline modal) -->
    <div v-if="showForm" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 w-full max-w-md mx-4 p-6 space-y-5 relative">
        <button class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors" @click="closeForm">
          <Icon icon="ph:x-bold" class="text-lg" />
        </button>

        <div class="flex items-start gap-3">
          <div class="bg-primary/10 text-primary rounded-xl w-10 h-10 flex items-center justify-center shrink-0">
            <Icon icon="ph:tag-bold" class="text-xl" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-navy">
              {{ editingCategory ? 'Edit Kategori Lomba' : 'Kategori Lomba Baru' }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              Tentukan kombinasi jenis busur dan kelompok umur yang akan digunakan di event.
            </p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="saveCategory">
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-600  tracking-[0.18em]">Nama Kategori</label>
            <input v-model="form.name" type="text"
              class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              placeholder="Misalnya: Recurve Men 70m" required />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-600  tracking-[0.18em]">Jenis Busur</label>
              <select v-model="form.bow_type_id"
                class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                required>
                <option value="" disabled>Pilih jenis busur</option>
                <option v-for="bow in bowTypes" :key="bow.id" :value="bow.id">
                  {{ bow.name }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold text-gray-600  tracking-[0.18em]">Kelompok Umur</label>
              <select v-model="form.age_group_id"
                class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                required>
                <option value="" disabled>Pilih kelompok umur</option>
                <option v-for="age in ageGroups" :key="age.id" :value="age.id">
                  {{ age.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-600  tracking-[0.18em]">Status</label>
            <select v-model="form.status"
              class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm">
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <BaseButton type="button" variant="ghost" size="sm" @click="closeForm">
              Batal
            </BaseButton>
            <BaseButton type="submit" variant="primary" size="sm" :loading="isSaving">
              Simpan
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'dashboard'
})

const { get, post, put } = useApi()

const isLoading = ref(true)
const isSaving = ref(false)
const bowTypes = ref([])
const ageGroups = ref([])
const categories = ref([])

const activeBow = ref('')
const searchQuery = ref('')

const showForm = ref(false)
const editingCategory = ref(null)
const form = ref({
  id: '',
  name: '',
  bow_type_id: '',
  age_group_id: '',
  status: 'active'
})

const fetchReferenceData = async () => {
  isLoading.value = true
  try {
    const [bowRes, ageRes, catRes] = await Promise.all([
      get('/bow-types'),
      get('/age-groups'),
      get('/event-categories')
    ])

    bowTypes.value = bowRes?.bow_types || bowRes?.data?.bow_types || []
    ageGroups.value = ageRes?.age_groups || ageRes?.data?.age_groups || []
    categories.value = catRes?.categories || catRes?.data?.categories || []

    if (!activeBow.value && bowTypes.value.length) {
      activeBow.value = bowTypes.value[0].id
    }
  } catch (err) {
    console.error('Failed to fetch reference data', err)
  } finally {
    isLoading.value = false
  }
}

const filteredCategories = computed(() => {
  let list = categories.value

  if (activeBow.value) {
    list = list.filter(c => c.bow_type_id === activeBow.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.bow_name.toLowerCase().includes(q) ||
      c.age_name.toLowerCase().includes(q)
    )
  }

  return list
})

const openCreateDialog = () => {
  editingCategory.value = null
  form.value = {
    id: '',
    name: '',
    bow_type_id: activeBow.value || (bowTypes.value[0]?.id || ''),
    age_group_id: '',
    status: 'active'
  }
  showForm.value = true
}

const editCategory = (cat) => {
  editingCategory.value = cat
  form.value = {
    id: cat.id,
    name: cat.name,
    bow_type_id: cat.bow_type_id,
    age_group_id: cat.age_group_id,
    status: cat.status
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

const saveCategory = async () => {
  isSaving.value = true
  try {
    const payload = {
      name: form.value.name,
      bow_type_id: form.value.bow_type_id,
      age_group_id: form.value.age_group_id,
      status: form.value.status
    }

    if (editingCategory.value) {
      await put(`/event-categories/${form.value.id}`, payload)
    } else {
      await post('/event-categories', payload)
    }

    await fetchReferenceData()
    showForm.value = false
  } catch (err) {
    console.error('Failed to save category', err)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchReferenceData()
})

useHead({
  title: 'Kategori Lomba - ArcheryHub Dashboard'
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 999px;
}
</style>
