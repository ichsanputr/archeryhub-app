<template>
  <div ref="clubSelectContainer" class="space-y-1.5 relative">
    <label v-if="label" class="text-sm font-bold text-navy block">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </label>
    
    <!-- Selector Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all flex items-center justify-between text-left text-navy shadow-2xs cursor-pointer">
      <span class="truncate pr-2" :class="!selectedClubName ? 'text-slate-400 font-normal' : 'text-navy font-bold'">
        {{ selectedClubName || placeholder }}
      </span>
      <Icon icon="ph:caret-down-bold" class="text-slate-400 shrink-0 transition-transform duration-200" :class="isClubDropdownOpen ? 'rotate-180 text-navy' : ''" />
    </button>

    <!-- Dropdown Panel -->
    <Teleport to="body">
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95">
        <div
          v-if="isClubDropdownOpen" 
          ref="dropdownEl"
          class="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-[999999]"
          :style="dropdownStyle">
          
          <!-- Search Header -->
          <div class="p-3 border-b border-slate-100 bg-slate-50/80">
            <div class="relative">
              <Icon icon="ph:magnifying-glass-bold" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                ref="searchInputEl"
                v-model="clubSearchQuery"
                type="text"
                :placeholder="isEn ? 'Search or type new club name...' : 'Cari atau ketik nama klub baru...'"
                class="w-full pl-9 pr-8 h-10 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all placeholder:text-slate-400 placeholder:font-normal"
                @keydown.enter.prevent="handleEnter" />
              <Icon v-if="loadingClubs" icon="ph:spinner-gap-bold" class="absolute right-3 top-1/2 -translate-y-1/2 text-navy animate-spin text-sm" />
            </div>
          </div>

          <!-- Clubs List -->
          <div class="p-2 overflow-y-auto max-h-[220px] space-y-1">
            <!-- Independent / No Club Option -->
            <button
              type="button"
              @click="selectIndependent"
              class="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer"
              :class="!modelValue && !newClubName ? 'bg-navy text-primary' : 'hover:bg-slate-100 text-slate-600'">
              <div class="flex items-center gap-2">
                <Icon icon="ph:user-bold" class="text-sm shrink-0" />
                <span>{{ isEn ? 'Independent / No Club' : 'Independen / Tanpa Klub' }}</span>
              </div>
              <Icon v-if="!modelValue && !newClubName" icon="ph:check-bold" class="text-primary text-sm shrink-0" />
            </button>

            <!-- Matching Clubs -->
            <button
              v-for="club in filteredClubs"
              :key="club.value"
              type="button"
              @click="selectClub(club)"
              class="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer"
              :class="modelValue === club.value ? 'bg-navy text-primary' : 'hover:bg-slate-100 text-navy'">
              <div class="flex items-center gap-2 min-w-0 pr-2">
                <Icon icon="ph:shield-bold" class="text-sm shrink-0 text-slate-400" :class="modelValue === club.value ? 'text-primary' : ''" />
                <span class="truncate">{{ club.title }}</span>
              </div>
              <Icon v-if="modelValue === club.value" icon="ph:check-bold" class="text-primary text-sm shrink-0" />
            </button>

            <!-- Custom / New Club Option if user typed something -->
            <button
              v-if="clubSearchQuery.trim() && !hasExactMatch"
              type="button"
              @click="selectCustomTypedClub(clubSearchQuery.trim())"
              class="w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-navy bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all flex items-center gap-2 cursor-pointer mt-1">
              <Icon icon="ph:plus-circle-bold" class="text-base text-navy shrink-0" />
              <span class="truncate">{{ isEn ? 'Use new club:' : 'Gunakan klub baru:' }} <span class="underline font-black">"{{ clubSearchQuery.trim() }}"</span></span>
            </button>

            <div v-if="filteredClubs.length === 0 && !clubSearchQuery.trim() && !loadingClubs" class="text-center py-4 text-xs text-slate-400 font-medium">
              {{ isEn ? 'No clubs found. Type to create new.' : 'Belum ada data klub. Ketik untuk mendaftarkan baru.' }}
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { onClickOutside } from '@vueuse/core'
import { useApi } from '~/composables/useApi'
import { useDropdownPosition } from '~/composables/useDropdownPosition'

const { locale } = useI18n()
const isEn = computed(() => locale.value === 'en')

const props = defineProps({
  modelValue: { type: String, default: '' },
  newClubName: { type: String, default: '' },
  newClubAcronym: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Pilih atau cari klub...' },
  required: { type: Boolean, default: false }
})

const emit = defineEmits([
  'update:modelValue',
  'update:newClubName',
  'update:newClubAcronym'
])

const { get, post } = useApi()

const clubs = ref([])
const isClubDropdownOpen = ref(false)
const clubSearchQuery = ref('')
const selectedClubName = ref('')
const loadingClubs = ref(false)

const clubSelectContainer = ref(null)
const dropdownEl = ref(null)
const searchInputEl = ref(null)

const { isFlippedTop, dropdownStyle } = useDropdownPosition(clubSelectContainer, isClubDropdownOpen, { panelHeight: 280, matchWidth: true })

onClickOutside(dropdownEl, (e) => {
  if (clubSelectContainer.value && clubSelectContainer.value.contains(e.target)) return
  isClubDropdownOpen.value = false
})

const toggleDropdown = () => {
  isClubDropdownOpen.value = !isClubDropdownOpen.value
  if (isClubDropdownOpen.value) {
    clubSearchQuery.value = ''
    nextTick(() => {
      searchInputEl.value?.focus()
    })
  }
}

const filteredClubs = computed(() => {
  const q = clubSearchQuery.value.trim().toLowerCase()
  if (!q) return clubs.value
  return clubs.value.filter(c => 
    (c.name && c.name.toLowerCase().includes(q)) || 
    (c.acronym && c.acronym.toLowerCase().includes(q)) ||
    (c.title && c.title.toLowerCase().includes(q))
  )
})

const hasExactMatch = computed(() => {
  const q = clubSearchQuery.value.trim().toLowerCase()
  if (!q) return false
  return clubs.value.some(c => (c.name && c.name.toLowerCase() === q) || (c.title && c.title.toLowerCase() === q))
})

const selectClub = (club) => {
  emit('update:modelValue', club.value)
  emit('update:newClubName', club.name)
  emit('update:newClubAcronym', club.acronym || '')
  selectedClubName.value = club.name
  isClubDropdownOpen.value = false
  clubSearchQuery.value = ''
}

const selectIndependent = () => {
  emit('update:modelValue', '')
  emit('update:newClubName', '')
  emit('update:newClubAcronym', '')
  selectedClubName.value = isEn.value ? 'Independent' : 'Independen'
  isClubDropdownOpen.value = false
  clubSearchQuery.value = ''
}

const selectCustomTypedClub = (name) => {
  const trimmed = name.trim()
  if (!trimmed) return
  emit('update:modelValue', '')
  emit('update:newClubName', trimmed)
  emit('update:newClubAcronym', '')
  selectedClubName.value = trimmed
  isClubDropdownOpen.value = false
  clubSearchQuery.value = ''
}

const handleEnter = () => {
  if (filteredClubs.value.length > 0) {
    selectClub(filteredClubs.value[0])
  } else if (clubSearchQuery.value.trim()) {
    selectCustomTypedClub(clubSearchQuery.value.trim())
  }
}

let debounceTimerClubs = null
const fetchClubs = async (search = '') => {
  loadingClubs.value = true
  try {
    const response = await get(`/clubs?limit=100&search=${encodeURIComponent(search)}`)
    clubs.value = (response?.data || []).map(c => ({
      title: c.name + (c.abbreviation ? ` (${c.abbreviation})` : ''),
      value: c.uuid || c.id,
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
  } finally {
    loadingClubs.value = false
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
    selectedClubName.value = newVal
  }
}, { immediate: true })

onMounted(async () => {
  await fetchClubs()
  
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

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
