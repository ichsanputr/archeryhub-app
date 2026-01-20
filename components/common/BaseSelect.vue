<template>
    <div class="flex flex-col gap-1.5 w-full relative" v-click-outside="closeDropdown">
        <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative">
            <button type="button" @click="isOpen = !isOpen" :disabled="disabled" class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-navy text-sm font-medium transition-all
               flex items-center justify-between focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none
               disabled:opacity-50 disabled:cursor-not-allowed" :class="[
                error ? 'border-red-500 focus:border-red-500' : '',
                isOpen ? 'border-primary bg-white ring-4 ring-primary/10' : ''
            ]">
                <span :class="!selectedLabel ? 'text-gray-400' : 'text-navy'">
                    {{ selectedLabel || placeholder || 'Pilih opsi' }}
                </span>
                <Icon icon="ph:caret-down" class="text-gray-400 transition-transform duration-200"
                    :class="isOpen ? 'rotate-180 text-primary' : ''" />
            </button>

            <!-- Dropdown Menu -->
            <transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                <div v-if="isOpen"
                    class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl shadow-navy/5 max-h-60 overflow-y-auto">
                    <div v-if="items.length === 0" class="p-4 text-center text-gray-400 text-sm">
                        Tidak ada opsi
                    </div>
                    <div v-for="item in items" :key="getItemValue(item)" @click="selectItem(item)"
                        class="px-4 py-3 text-sm font-medium hover:bg-primary/10 hover:text-navy transition-colors cursor-pointer flex items-center justify-between group"
                        :class="getItemValue(item) === modelValue ? 'bg-primary/5 text-primary-dark' : 'text-gray-600'">
                        {{ getItemTitle(item) }}
                        <Icon v-if="getItemValue(item) === modelValue" icon="ph:check-bold"
                            class="text-[18px] text-primary transition-all" />
                    </div>
                </div>
            </transition>
        </div>

        <p v-if="error" class="text-red-500 text-[11px] font-bold ml-1">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    modelValue: [String, Number, Boolean, Object],
    items: {
        type: Array,
        default: () => []
    },
    label: String,
    placeholder: String,
    required: Boolean,
    disabled: Boolean,
    error: String,
    itemTitle: {
        type: String,
        default: 'title'
    },
    itemValue: {
        type: String,
        default: 'value'
    }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const getItemTitle = (item) => {
    if (typeof item === 'object') return item[props.itemTitle]
    return item
}

const getItemValue = (item) => {
    if (typeof item === 'object') return item[props.itemValue]
    return item
}

const selectedLabel = computed(() => {
    const selectedItem = props.items.find(item => getItemValue(item) === props.modelValue)
    return selectedItem ? getItemTitle(selectedItem) : null
})

const selectItem = (item) => {
    emit('update:modelValue', getItemValue(item))
    isOpen.value = false
}

const closeDropdown = () => {
    isOpen.value = false
}

// v-click-outside directive logic (minimal)
const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event)
            }
        }
        document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
    }
}
</script>

<style scoped>
/* Custom Scrollbar for Dropdown */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #E5E7EB;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #D1D5DB;
}
</style>
