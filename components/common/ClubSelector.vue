<template>
  <div ref="clubSelectContainer" class="space-y-1 relative">
    <label v-if="label" class="text-sm font-bold text-navy">{{ label }} <span v-if="required" class="text-red-500">*</span></label>
    
    <!-- Selector Button -->
    <button type="button" @click="isClubDropdownOpen = !isClubDropdownOpen"
        class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all flex items-center justify-between text-left text-navy">
        <span class="truncate pr-2">{{ selectedClubName || placeholder }}</span>
        <Icon icon="ph:caret-down-bold" class="text-gray-400 shrink-0" />
    </button>

    <!-- Dropdown Panel -->
    <div v-if="isClubDropdownOpen" 
        class="absolute left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-4 max-h-[320px] overflow-y-auto space-y-3 duration-150"
        :class="isFlippedTop ? 'bottom-full mb-1 origin-bottom animate-in fade-in slide-in-from-bottom-1' : 'top-full mt-1 origin-top animate-in fade-in slide-in-from-top-1'">
        
        <!-- Search / List Mode -->
        <div v-if="!isCreatingNewClub" class="space-y-3">
            <div class="relative">
                <Icon icon="ph:magnifying-glass-bold" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input v-model="clubSearchQuery" type="text" placeholder="Search clubs..."
                    class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-navy" />
            </div>

            <div class="space-y-1 max-h-[160px] overflow-y-auto no-scrollbar">
                <button v-for="club in filteredClubs" :key="club.value" type="button"
                    @click="selectClub(club)"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-primary/10 text-navy font-bold transition-all flex items-center justify-between">
                    <span class="truncate pr-2">{{ club.title }}</span>
                    <Icon v-if="modelValue === club.value" icon="ph:check-bold" class="text-primary text-sm shrink-0" />
                </button>
                <div v-if="filteredClubs.length === 0" class="text-center py-4 text-xs text-gray-400 font-bold">
                    No clubs found.
                </div>
            </div>

            <div class="border-t border-gray-100 pt-2 text-center">
                <button type="button" @click="isCreatingNewClub = true"
                    class="text-xs font-bold text-slate-600 hover:text-navy flex items-center gap-1 mx-auto justify-center py-1 transition-colors">
                    <Icon icon="ph:plus-bold" />
                    Club not found? Create a new one
                </button>
            </div>
        </div>

        <!-- Create New Club Mode -->
        <div v-else class="space-y-3">
            <div class="flex items-center justify-between pb-1 border-b border-gray-100">
                <span class="text-xs font-black text-navy">Create New Club</span>
                <button type="button" @click="cancelNewClub" class="text-gray-400 hover:text-navy text-xs flex items-center gap-0.5">
                    <Icon icon="ph:arrow-left-bold" /> Back
                </button>
            </div>

            <div class="space-y-2">
                <input v-model="newClubForm.name" type="text" placeholder="Club Name (e.g. Robin Hood Club)"
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-navy" />
                
                <input v-model="newClubForm.acronym" type="text" placeholder="Abbreviation (e.g. RHC)"
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-navy" />
            </div>

            <button type="button" @click="useNewClub" :disabled="!newClubForm.name"
                class="w-full py-2 rounded-xl bg-primary text-navy font-bold text-xs hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400 transition-all flex items-center justify-center gap-1">
                <Icon icon="ph:check-bold" /> Use This Club
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useApi } from '~/composables/useApi'
import { useDropdownPosition } from '~/composables/useDropdownPosition'

const props = defineProps({
  modelValue: { type: String, default: '' },
  newClubName: { type: String, default: '' },
  newClubAcronym: { type: String, default: '' },
  label: { type: String, default: 'Club' },
  placeholder: { type: String, default: 'Select Club...' },
  required: { type: Boolean, default: false }
})

const emit = defineEmits([
  'update:modelValue',
  'update:newClubName',
  'update:newClubAcronym'
])

const { get } = useApi()

const clubs = ref([])
const isClubDropdownOpen = ref(false)
const clubSearchQuery = ref('')
const selectedClubName = ref('')
const isCreatingNewClub = ref(false)
const newClubForm = ref({
    name: '',
    acronym: ''
})

const clubSelectContainer = ref(null)
const { isFlippedTop } = useDropdownPosition(clubSelectContainer, isClubDropdownOpen, { panelHeight: 320 })

onClickOutside(clubSelectContainer, () => {
    isClubDropdownOpen.value = false
})

const filteredClubs = computed(() => {
    return clubs.value
})

const selectClub = (club) => {
    emit('update:modelValue', club.value)
    emit('update:newClubName', '')
    emit('update:newClubAcronym', '')
    selectedClubName.value = club.name
    isClubDropdownOpen.value = false
    isCreatingNewClub.value = false
}

const useNewClub = () => {
    if (!newClubForm.value.name) return
    emit('update:modelValue', '')
    emit('update:newClubName', newClubForm.value.name)
    emit('update:newClubAcronym', newClubForm.value.acronym)
    selectedClubName.value = `New Club: ${newClubForm.value.name}`
    isClubDropdownOpen.value = false
    isCreatingNewClub.value = false
}

const cancelNewClub = () => {
    isCreatingNewClub.value = false
    newClubForm.value.name = ''
    newClubForm.value.acronym = ''
}

let debounceTimerClubs = null
const fetchClubs = async (search = '') => {
    try {
        const response = await get(`/clubs?limit=100&search=${encodeURIComponent(search)}`)
        clubs.value = (response?.data || []).map(c => ({
            title: c.name + (c.abbreviation ? ` (${c.abbreviation})` : ''),
            value: c.uuid,
            name: c.name,
            acronym: c.abbreviation || ''
        }))
        
        // If we have an initial modelValue (club UUID), update the selectedClubName text
        if (props.modelValue && clubs.value.length > 0 && !selectedClubName.value && !props.newClubName) {
            const currentClub = clubs.value.find(c => c.value === props.modelValue)
            if (currentClub) {
                selectedClubName.value = currentClub.name
            }
        }
    } catch (err) {
        console.error('Failed to fetch clubs:', err)
    }
}

// Watchers
watch(clubSearchQuery, (newVal) => {
    clearTimeout(debounceTimerClubs)
    debounceTimerClubs = setTimeout(() => {
        fetchClubs(newVal)
    }, 300)
})

// Sync initial values
watch(() => props.modelValue, (newVal) => {
    if (!newVal && !props.newClubName) {
        selectedClubName.value = ''
        return
    }
    if (newVal && clubs.value.length > 0) {
        const currentClub = clubs.value.find(c => c.value === newVal)
        if (currentClub) {
            selectedClubName.value = currentClub.name
        }
    }
}, { immediate: true })

watch(() => props.newClubName, (newVal) => {
    if (newVal) {
        selectedClubName.value = `New Club: ${newVal}`
        newClubForm.value.name = newVal
    }
}, { immediate: true })

watch(() => props.newClubAcronym, (newVal) => {
    if (newVal) {
        newClubForm.value.acronym = newVal
    }
}, { immediate: true })

onMounted(async () => {
    await fetchClubs()
    
    // Resolve initial club name from API if not found in first page
    if (props.modelValue && !selectedClubName.value && !props.newClubName) {
        try {
            const res = await get(`/clubs/${props.modelValue}`)
            if (res?.data) {
                selectedClubName.value = res.data.name
            }
        } catch (err) {
            console.error('Failed to fetch single club details:', err)
        }
    }
})
</script>
