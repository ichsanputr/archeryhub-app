<template>
    <div ref="rootRef" class="flex flex-col gap-1.5 w-full relative" :class="{ 'z-[100]': isOpen }"
        v-click-outside="closeDropdown">
        <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <div ref="triggerRef" class="relative">
            <!-- Searchable Select Trigger -->
            <div @click="toggleDropdown" class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-black text-sm font-medium transition-all group cursor-pointer
                flex items-center justify-between hover:border-black/50 focus-within:bg-white focus-within:border-black focus-within:ring-4 focus-within:ring-black/5 outline-none
                disabled:opacity-50 disabled:cursor-not-allowed" :class="[
                    error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-100' : '',
                    isOpen ? 'border-black bg-white ring-4 ring-black/5' : ''
                ]">

                <div class="flex-1 flex items-center overflow-hidden">
                    <div v-if="icon" class="mr-3 text-gray-400 group-hover:text-black transition-colors">
                        <Icon :icon="icon" class="text-lg" />
                    </div>

                    <div v-if="isOpen && searchable" class="w-full">
                        <input ref="searchInput" v-model="searchQuery" type="text"
                            class="w-full bg-transparent border-none outline-none text-navy p-0 placeholder:text-gray-400 h-full"
                            :placeholder="selectedLabel || placeholder || 'Cari...'" @click.stop
                            @keydown.esc="closeDropdown" />
                    </div>
                    <div v-else :class="!selectedLabel ? 'text-gray-400' : 'text-black'" class="truncate">
                        {{ selectedLabel || placeholder || 'Pilih opsi' }}
                    </div>
                </div>

                <div class="flex items-center gap-2 ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Icon
                        v-if="(multiple ? (Array.isArray(modelValue) && modelValue.length > 0) : modelValue) && clearable"
                        icon="ph:x-circle" class="text-gray-400 hover:text-red-500 transition-colors"
                        @click.stop="clearSelection" />
                    <Icon icon="ph:caret-down" class="text-gray-400 transition-transform duration-300"
                        :class="isOpen ? 'rotate-180 text-black' : ''" />
                </div>
            </div>

            <!-- Dropdown Menu (in-place when not teleporting) - single child per Transition -->
            <Transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="translate-y-2 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100 scale-100"
                leave-to-class="translate-y-2 opacity-0 scale-95">
                <div v-if="isOpen && !teleport" key="inplace"
                    class="absolute left-0 right-0 top-full z-[10002] mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-navy/10 flex flex-col overflow-hidden max-h-[300px]">
                    <div class="overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
                        <div v-if="filteredItems.length === 0" class="p-8 text-center">
                            <Icon icon="ph:magnifying-glass-slash" class="text-3xl text-gray-200 mx-auto mb-2" />
                            <p class="text-gray-400 text-xs font-medium">Tidak ada hasil ditemukan</p>
                        </div>
                        <button v-for="item in filteredItems" :key="getItemValue(item)" type="button"
                            @click="selectItem(item)"
                            class="w-full px-4 py-3 text-sm flex items-center justify-between rounded-xl transition-all duration-200 group text-left"
                            :class="[
                                isSelected(item)
                                    ? 'bg-black/5 text-black font-bold shadow-sm shadow-black/5'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                            ]">
                            <div class="flex items-center gap-3 overflow-hidden">
                                <div v-if="multiple"
                                    class="flex-shrink-0 w-5 h-5 rounded-sm border border-gray-200 flex items-center justify-center">
                                    <Icon v-if="isSelected(item)" icon="ph:check" class="text-xs text-black" />
                                </div>
                                <div v-if="item.image"
                                    class="flex-shrink-0 w-8 h-8 rounded-md overflow-hidden bg-white border border-gray-100 p-0.5">
                                    <img :src="item.image" class="w-full h-full object-contain"
                                        :alt="getItemTitle(item)" />
                                </div>
                                <div v-else-if="item.icon"
                                    class="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Icon :icon="item.icon" class="text-base" />
                                </div>
                                <div class="truncate">
                                    <div :class="isSelected(item) ? 'text-black' : 'text-navy'" class="font-bold">
                                        {{ getItemTitle(item) }}
                                    </div>
                                    <div v-if="item.description"
                                        class="text-[11px] text-gray-400 font-medium truncate mt-0.5 line-clamp-1">
                                        {{ item.description }}
                                    </div>
                                </div>
                            </div>
                            <Icon v-if="!multiple && isSelected(item)" icon="ph:check-circle-fill"
                                class="text-black text-lg flex-shrink-0" />
                        </button>
                    </div>
                    <div v-if="$slots.footer" class="p-2 border-t border-gray-50 bg-gray-50/50">
                        <slot name="footer" />
                    </div>
                </div>
            </Transition>

            <!-- Teleported dropdown (for use inside modals) - own Transition with single child -->
            <Teleport to="body">
                <Transition enter-active-class="transition duration-200 ease-out"
                    enter-from-class="translate-y-2 opacity-0 scale-95"
                    enter-to-class="translate-y-0 opacity-100 scale-100"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="translate-y-0 opacity-100 scale-100"
                    leave-to-class="translate-y-2 opacity-0 scale-95">
                    <div v-if="isOpen && teleport && dropdownStyle" key="teleported"
                        class="mt-0 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-navy/10 flex flex-col overflow-hidden max-h-[300px]"
                        :style="dropdownStyle">
                        <div class="overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
                            <div v-if="filteredItems.length === 0" class="p-8 text-center">
                                <Icon icon="ph:magnifying-glass-slash" class="text-3xl text-gray-200 mx-auto mb-2" />
                                <p class="text-gray-400 text-xs font-medium">Tidak ada hasil ditemukan</p>
                            </div>
                            <button v-for="item in filteredItems" :key="getItemValue(item)" type="button"
                                @click="selectItem(item)"
                                class="w-full px-4 py-3 text-sm flex items-center justify-between rounded-xl transition-all duration-200 group text-left"
                                :class="[
                                    isSelected(item)
                                        ? 'bg-black/5 text-black font-bold shadow-sm shadow-black/5'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                ]">
                                <div class="flex items-center gap-3 overflow-hidden">
                                    <div v-if="multiple"
                                        class="flex-shrink-0 w-5 h-5 rounded-sm border border-gray-200 flex items-center justify-center">
                                        <Icon v-if="isSelected(item)" icon="ph:check" class="text-xs text-black" />
                                    </div>
                                    <div v-if="item.image"
                                        class="flex-shrink-0 w-8 h-8 rounded-md overflow-hidden bg-white border border-gray-100 p-0.5">
                                        <img :src="item.image" class="w-full h-full object-contain"
                                            :alt="getItemTitle(item)" />
                                    </div>
                                    <div v-else-if="item.icon"
                                        class="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <Icon :icon="item.icon" class="text-base" />
                                    </div>
                                    <div class="truncate">
                                        <div :class="isSelected(item) ? 'text-black' : 'text-navy'" class="font-bold">
                                            {{ getItemTitle(item) }}
                                        </div>
                                        <div v-if="item.description"
                                            class="text-[11px] text-gray-400 font-medium truncate mt-0.5 line-clamp-1">
                                            {{ item.description }}
                                        </div>
                                    </div>
                                </div>
                                <Icon v-if="!multiple && isSelected(item)" icon="ph:check-circle-fill"
                                    class="text-black text-lg flex-shrink-0" />
                            </button>
                        </div>
                        <div v-if="$slots.footer" class="p-2 border-t border-gray-50 bg-gray-50/50">
                            <slot name="footer" />
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </div>

        <p v-if="error" class="text-red-500 text-[11px] font-bold ml-1 animate-in fade-in slide-in-from-top-1">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
    modelValue: [String, Number, Boolean, Object, Array],
    items: {
        type: Array,
        default: () => []
    },
    label: String,
    placeholder: String,
    required: Boolean,
    disabled: Boolean,
    searchable: {
        type: Boolean,
        default: true
    },
    multiple: {
        type: Boolean,
        default: false
    },
    clearable: {
        type: Boolean,
        default: false
    },
    icon: String,
    error: String,
    itemTitle: {
        type: String,
        default: 'title'
    },
    itemValue: {
        type: String,
        default: 'value'
    },
    /** When true, dropdown is teleported to body with high z-index (use inside modals/dialogs) */
    teleport: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const rootRef = ref(null)
const triggerRef = ref(null)
const dropdownStyle = ref(null)

function updateDropdownPosition() {
    if (!props.teleport || !triggerRef.value) return
    const rect = triggerRef.value.getBoundingClientRect()
    dropdownStyle.value = {
        position: 'fixed',
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 10002
    }
}

let scrollResizeCleanup = null
watch(isOpen, (open) => {
    if (open && props.teleport) {
        nextTick(updateDropdownPosition)
        const onScrollOrResize = () => nextTick(updateDropdownPosition)
        window.addEventListener('scroll', onScrollOrResize, true)
        window.addEventListener('resize', onScrollOrResize)
        scrollResizeCleanup = () => {
            window.removeEventListener('scroll', onScrollOrResize, true)
            window.removeEventListener('resize', onScrollOrResize)
            scrollResizeCleanup = null
        }
    } else {
        if (scrollResizeCleanup) {
            scrollResizeCleanup()
        }
        dropdownStyle.value = null
    }
})

const getItemTitle = (item) => {
    if (typeof item === 'object') return item[props.itemTitle]
    return item
}

const getItemValue = (item) => {
    if (typeof item === 'object') return item[props.itemValue]
    return item
}

const filteredItems = computed(() => {
    if (!searchQuery.value) return props.items
    const query = searchQuery.value.toLowerCase()
    return props.items.filter(item => {
        const title = getItemTitle(item)?.toString().toLowerCase() || ''
        const description = item.description?.toString().toLowerCase() || ''
        return title.includes(query) || description.includes(query)
    })
})

const selectedLabel = computed(() => {
    if (props.multiple) {
        if (!Array.isArray(props.modelValue) || props.modelValue.length === 0) return null
        const labels = props.items
            .filter(item => (Array.isArray(props.modelValue) && props.modelValue.includes(getItemValue(item))))
            .map(getItemTitle)
        return labels.length > 0 ? labels.join(', ') : null
    }
    const selectedItem = props.items.find(item => getItemValue(item) === props.modelValue)
    return selectedItem ? getItemTitle(selectedItem) : null
})

const isSelected = (item) => {
    const val = getItemValue(item)
    if (props.multiple) {
        return Array.isArray(props.modelValue) && props.modelValue.includes(val)
    }
    return props.modelValue === val
}

const toggleDropdown = () => {
    if (props.disabled) return
    isOpen.value = !isOpen.value
    if (isOpen.value && props.searchable) {
        searchQuery.value = ''
        nextTick(() => {
            searchInput.value?.focus()
        })
    }
}

const selectItem = (item) => {
    const val = getItemValue(item)
    if (props.multiple) {
        const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
        const idx = current.indexOf(val)
        if (idx > -1) current.splice(idx, 1)
        else current.push(val)
        emit('update:modelValue', current)
        // keep dropdown open for multiple selection
    } else {
        emit('update:modelValue', val)
        isOpen.value = false
    }
    searchQuery.value = ''
}

const clearSelection = () => {
    emit('update:modelValue', props.multiple ? [] : null)
    searchQuery.value = ''
}

const closeDropdown = () => {
    isOpen.value = false
    searchQuery.value = ''
}

// v-click-outside directive logic
const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event)
            }
        }
        document.addEventListener('mousedown', el.clickOutsideEvent)
    },
    unmounted(el) {
        document.removeEventListener('mousedown', el.clickOutsideEvent)
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>
