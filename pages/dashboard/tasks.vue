<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div
            class="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0 opacity-20"
                style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
                        <Icon icon="ph:check-square-offset" class="text-primary text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-black tracking-tight mb-1">Task Project</h1>
                        <p class="text-slate-300 text-sm font-medium">Simple list for developer task management.</p>
                    </div>
                </div>
                <BaseButton @click="openCreateModal" variant="primary" icon="ph:plus-bold"
                    class="px-6 shadow-xl shadow-primary/20">
                    Tambah Task
                </BaseButton>
            </div>
        </div>

        <!-- Task List (Simple List) -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div v-if="loading" class="p-12 text-center">
                <Icon icon="ph:circle-notch" class="text-4xl text-primary animate-spin mx-auto mb-4" />
                <p class="text-gray-400 font-medium">Memuat data...</p>
            </div>

            <div v-else-if="tasks.length === 0" class="p-20 text-center">
                <div class="size-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon icon="ph:clipboard-text" class="text-4xl text-gray-300" />
                </div>
                <h3 class="text-xl font-black text-navy mb-2">Belum ada task</h3>
                <p class="text-gray-400 text-sm mb-8">Mulailah dengan menambahkan tugas pengembangan pertama Anda.</p>
                <BaseButton @click="openCreateModal" variant="navy" outline class="px-8">Buat Task Sekarang</BaseButton>
            </div>

            <div v-else class="divide-y divide-gray-50">
                <div v-for="task in tasks" :key="task.uuid"
                    class="p-6 hover:bg-gray-50/50 transition-all flex items-start gap-6 group cursor-pointer"
                    @click="editTask(task)">
                    <div
                        class="size-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon icon="ph:check-circle"
                            class="text-navy/20 group-hover:text-primary transition-colors text-xl" />
                    </div>

                    <div class="flex-1 min-w-0">
                        <h4
                            class="font-bold text-navy text-base mb-1 leading-tight group-hover:text-primary transition-colors">
                            {{ task.title }}</h4>
                        <p v-if="task.description"
                            class="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">{{ task.description
                            }}</p>
                    </div>

                    <div class="flex items-center gap-4 shrink-0">
                        <div class="flex -space-x-2">
                            <div class="size-8 rounded-full border-2 border-white bg-gray-50 overflow-hidden shadow-sm">
                                <img src="https://api.dicebear.com/7.x/initials/svg?seed=IF"
                                    class="w-full h-full object-cover">
                            </div>
                        </div>
                        <button
                            class="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                            @click.stop="confirmDeleteTask(task.uuid)">
                            <Icon icon="ph:trash" class="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Simplified Task Modal -->
        <ClientOnly>
            <Teleport to="body">
                <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                    <div v-if="showModal"
                        class="fixed inset-0 !z-[2147483647] flex items-center justify-center p-4 bg-navy/90 backdrop-blur-lg"
                        @click.self="showModal = false">
                        <div
                            class="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative">
                            <div class="p-8 border-b border-gray-100 flex items-center justify-between">
                                <h3 class="text-2xl font-black text-navy">{{ isEditing ? 'Edit Task' : 'Tambah Task' }}
                                </h3>
                                <button @click="showModal = false"
                                    class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                    <Icon icon="ph:x" class="text-2xl text-gray-400" />
                                </button>
                            </div>

                            <form @submit.prevent="saveTask" class="p-8 space-y-6">
                                <div>
                                    <label
                                        class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Apa
                                        yang akan dikerjakan?</label>
                                    <input v-model="form.title" type="text" required
                                        class="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/40 text-base font-bold text-navy placeholder:text-gray-300"
                                        placeholder="Contoh: Fix bug di halaman peserta...">
                                </div>

                                <div>
                                    <label
                                        class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Detail
                                        Tambahan (Opsional)</label>
                                    <textarea v-model="form.description" rows="4"
                                        class="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/40 text-base font-medium text-navy resize-none placeholder:text-gray-300"
                                        placeholder="Jelaskan detail apa yang perlu dilakukan..."></textarea>
                                </div>

                                <div class="flex gap-4 pt-4">
                                    <button type="button" @click="showModal = false"
                                        class="flex-1 h-14 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-gray-200 transition-all">
                                        Batal
                                    </button>
                                    <button type="submit" :disabled="submitting"
                                        class="flex-[2] h-14 bg-primary text-navy rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary-hover transition-all disabled:opacity-50">
                                        {{ submitting ? 'Menyimpan...' : (isEditing ? 'Perbarui Task' : 'Simpan Task')
                                        }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </ClientOnly>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'

const { get, post, put, delete: del } = useApi()
const toast = useToast()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Task Project - Dashboard'
})

const tasks = ref([])
const loading = ref(true)
const submitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const currentTaskUuid = ref(null)

const form = ref({
    title: '',
    description: ''
})

const fetchTasks = async () => {
    loading.value = true
    try {
        const response = await get('/tasks')
        tasks.value = response.tasks || []
    } catch (error) {
        console.error('Failed to fetch tasks:', error)
    } finally {
        loading.value = false
    }
}

const openCreateModal = () => {
    isEditing.value = false
    form.value = {
        title: '',
        description: ''
    }
    showModal.value = true
}

const editTask = (task) => {
    isEditing.value = true
    currentTaskUuid.value = task.uuid
    form.value = {
        title: task.title,
        description: task.description
    }
    showModal.value = true
}

const saveTask = async () => {
    if (!form.value.title.trim()) return

    submitting.value = true
    try {
        if (isEditing.value) {
            await put(`/tasks/${currentTaskUuid.value}`, form.value)
            toast.success('Task diperbarui')
        } else {
            await post('/tasks', form.value)
            toast.success('Task ditambahkan')
        }
        showModal.value = false
        await fetchTasks()
    } catch (error) {
        console.error('Failed to save task:', error)
        toast.error('Gagal menyimpan task')
    } finally {
        submitting.value = false
    }
}

const confirmDeleteTask = async (uuid) => {
    if (!confirm('Hapus task ini?')) return
    try {
        await del(`/tasks/${uuid}`)
        toast.success('Task dihapus')
        await fetchTasks()
    } catch (error) {
        toast.error('Gagal menghapus task')
    }
}

onMounted(fetchTasks)
</script>
