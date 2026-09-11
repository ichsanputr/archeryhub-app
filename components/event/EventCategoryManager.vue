<template>
    <div class="space-y-6">
        <!-- Component Header -->
        <div class="bg-navy rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-navy/20">
            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 class="text-2xl font-black tracking-tight leading-tight">Konfigurasi Kategori</h2>
                    <p class="text-white/60 font-medium mt-1 text-sm">Pilih kombinasi divisi dan kelas umur untuk
                        membuka pendaftaran.</p>
                </div>
                <BaseButton variant="primary" icon="ph:check-circle-bold" :loading="isSubmitting"
                    @click="saveCategories" class="h-11 px-6 shadow-lg shadow-primary/20">
                    Simpan Konfigurasi
                </BaseButton>
            </div>
            <!-- Decorative element -->
            <div class="absolute -right-12 -bottom-12 h-64 w-64 bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <!-- Selection Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Bow Types / Divisions -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <label class="text-xs font-black text-gray-400  tracking-widest flex items-center gap-2">
                        <Icon icon="ph:bow-arrow-bold" class="text-primary text-sm" />
                        Tipe Busur / Divisi
                    </label>
                    <button @click="toggleAll(divisions, selectedDivisions)"
                        class="text-[10px] font-black text-primary-dark hover:underline  tracking-widest">
                        {{ selectedDivisions.length === divisions.length ? 'Deselect All' : 'Select All' }}
                    </button>
                </div>

                <div class="grid grid-cols-1 gap-2">
                    <div v-for="div in divisions" :key="div.uuid" @click="toggleSelection(div.uuid, selectedDivisions)"
                        :class="selectedDivisions.includes(div.uuid) ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-gray-50 bg-gray-50/30 hover:bg-gray-50'"
                        class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200">
                        <div :class="selectedDivisions.includes(div.uuid) ? 'bg-primary text-btn-text' : 'bg-white text-gray-300'"
                            class="h-6 w-6 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                            <Icon icon="ph:check-bold" v-if="selectedDivisions.includes(div.uuid)" class="text-sm" />
                        </div>
                        <div class="min-w-0">
                            <span class="text-sm font-bold block"
                                :class="selectedDivisions.includes(div.uuid) ? 'text-primary-dark' : 'text-gray-600'">{{
                                    div.name }}</span>
                            <span class="text-[10px] font-medium text-gray-400  tracking-wide">Ref: {{ div.code
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Age Groups -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 text-left">
                <div class="flex items-center justify-between">
                    <label class="text-xs font-black text-gray-400  tracking-widest flex items-center gap-2">
                        <Icon icon="ph:identification-card-bold" class="text-primary text-sm" />
                        Kelas Umur
                    </label>
                    <button @click="toggleAll(ageGroups, selectedAgeGroups)"
                        class="text-[10px] font-black text-primary-dark hover:underline  tracking-widest">
                        {{ selectedAgeGroups.length === ageGroups.length ? 'Deselect All' : 'Select All' }}
                    </button>
                </div>

                <div class="grid grid-cols-1 gap-2">
                    <div v-for="age in ageGroups" :key="age.uuid" @click="toggleSelection(age.uuid, selectedAgeGroups)"
                        :class="selectedAgeGroups.includes(age.uuid) ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'border-gray-50 bg-gray-50/30 hover:bg-gray-50'"
                        class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200">
                        <div :class="selectedAgeGroups.includes(age.uuid) ? 'bg-primary text-btn-text' : 'bg-white text-gray-300'"
                            class="h-6 w-6 rounded-lg flex items-center justify-center transition-colors shadow-sm">
                            <Icon icon="ph:check-bold" v-if="selectedAgeGroups.includes(age.uuid)" class="text-sm" />
                        </div>
                        <div class="min-w-0">
                            <span class="text-sm font-bold block"
                                :class="selectedAgeGroups.includes(age.uuid) ? 'text-primary-dark' : 'text-gray-600'">{{
                                    age.name }}</span>
                            <span class="text-[10px] font-medium text-gray-400  tracking-wide">{{ age.min_age
                                || 'Any' }} - {{ age.max_age || 'Any' }} Tahun</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Multiplier Info & Batch Settings -->
        <div
            class="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-5">
                <div
                    class="h-12 w-12 rounded-xl bg-navy text-primary flex items-center justify-center text-xl shrink-0">
                    <Icon icon="ph:calculator-bold" />
                </div>
                <div>
                    <p class="text-navy font-bold">Ringkasan Konfigurasi</p>
                    <p class="text-xs text-gray-500 font-medium mt-0.5">Total <span
                            class="text-primary-dark font-black">{{ selectedDivisions.length * selectedAgeGroups.length
                            }}</span> kategori akan ditambahkan.</p>
                </div>
            </div>

            <div class="flex items-center gap-4 w-full md:w-auto">
                <div class="flex-grow md:w-48">
                    <BaseInput v-model="maxParticipants" type="number" label="Max Peserta / Kategori"
                        placeholder="100" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const props = defineProps({
    eventId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['refresh'])
const { get, post } = useApi()
const toast = useToast()

const divisions = ref([])
const ageGroups = ref([])
const selectedDivisions = ref([])
const selectedAgeGroups = ref([])
const maxParticipants = ref(100)
const isSubmitting = ref(false)

const fetchData = async () => {
    try {
        const [divRes, ageRes] = await Promise.all([
            get('/bow-types'),
            get('/age-groups')
        ])
        divisions.value = divRes || []
        ageGroups.value = ageRes || []
    } catch (error) {
        console.error('Failed to fetch reference data:', error)
    }
}

onMounted(() => {
    fetchData()
})

const toggleSelection = (uuid, array) => {
    const index = array.indexOf(uuid)
    if (index > -1) {
        array.splice(index, 1)
    } else {
        array.push(uuid)
    }
}

const toggleAll = (sourceArray, targetArray) => {
    if (targetArray.length === sourceArray.length) {
        targetArray.splice(0, targetArray.length)
    } else {
        targetArray.splice(0, targetArray.length, ...sourceArray.map(i => i.uuid))
    }
}

const saveCategories = async () => {
    if (selectedDivisions.value.length === 0 || selectedAgeGroups.value.length === 0) {
        toast.error('Pilih setidaknya satu divisi dan satu kelas umur.')
        return
    }

    isSubmitting.value = true
    try {
        await post(`/events/${props.eventId}/categories`, {
            divisions: selectedDivisions.value,
            categories: selectedAgeGroups.value,
            max_participants: parseInt(maxParticipants.value)
        })

        toast.success('Kategori berhasil ditambahkan!')
        emit('refresh')

        // Reset selection after success
        selectedDivisions.value = []
        selectedAgeGroups.value = []
    } catch (error) {
        console.error('Failed to save categories:', error)
        toast.error('Gagal menyimpan konfigurasi kategori.')
    } finally {
        isSubmitting.value = false
    }
}
</script>
