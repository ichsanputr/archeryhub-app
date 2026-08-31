<template>
  <div class="flex flex-col gap-1.5 w-full relative" :class="{ 'z-[10000]': isOpen }" v-click-outside="closeDropdown">
    <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <!-- trigger -->
      <div @click="toggleDropdown"
        class="w-full min-h-[44px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium transition-all group cursor-pointer
          flex items-center gap-2 flex-wrap hover:border-black/50 outline-none"
        :class="[
          error ? 'border-red-500' : '',
          isOpen ? 'border-black bg-white ring-4 ring-black/5' : '',
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        ]">

        <!-- left icon -->
        <div v-if="icon && !multiple" class="text-gray-400 group-hover:text-navy transition-colors flex-shrink-0">
          <Icon :icon="icon" class="text-lg" />
        </div>

        <!-- multiple: chips row -->
        <template v-if="multiple">
          <!-- selected chips -->
          <transition-group
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="scale-90 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition duration-100 ease-in absolute"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-90 opacity-0">
            <span v-for="val in selectedValues" :key="val"
              class="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-navy text-white text-xs font-bold flex-shrink-0">
              <Icon v-if="getIconForValue(val)" :icon="getIconForValue(val)" class="text-primary text-xs" />
              {{ getLabelForValue(val) }}
              <button type="button" @click.stop="removeItem(val)"
                class="ml-0.5 w-4 h-4 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <Icon icon="ph:x" class="text-[10px]" />
              </button>
            </span>
          </transition-group>

          <!-- search input (always visible in multiple) -->
          <input ref="searchInput" v-model="searchQuery" type="text"
            class="flex-1 min-w-[80px] bg-transparent border-none outline-none text-navy text-sm placeholder:text-gray-400 h-9"
            :placeholder="selectedValues.length === 0 ? (placeholder || t('common.select_option')) : t('common.search')"
            @click.stop @keydown.esc="closeDropdown" @keydown.backspace="onBackspace" />

          <!-- counts badge when 3+ selected and closed -->
          <span v-if="!isOpen && selectedValues.length > 0"
            class="ml-auto flex-shrink-0 text-[10px] font-black text-gray-400">
            {{ selectedValues.length }} selected
          </span>
        </template>

        <!-- single mode -->
        <template v-else>
          <div v-if="isOpen && searchable" class="flex-1">
            <input ref="searchInput" v-model="searchQuery" type="text"
              class="w-full bg-transparent border-none outline-none text-navy placeholder:text-gray-400"
              :placeholder="selectedLabel || placeholder || t('common.search')"
              @click.stop @keydown.esc="closeDropdown" />
          </div>
          <div v-else class="flex-1 flex items-center gap-2 truncate"
            :class="!selectedLabel ? 'text-gray-400' : 'text-navy'">
            <Icon v-if="selectedItemIcon" :icon="selectedItemIcon" class="text-base flex-shrink-0" />
            <span class="truncate">{{ selectedLabel || placeholder || t('common.select_option') }}</span>
          </div>
        </template>

        <!-- right icons -->
        <div class="flex items-center gap-1 ml-auto flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
          <button v-if="hasClearableValue && clearable" type="button"
            class="text-gray-400 hover:text-red-500 transition-colors"
            @click.stop="clearSelection">
            <Icon icon="ph:x-circle" class="text-base" />
          </button>
          <Icon icon="ph:caret-down" class="text-gray-400 transition-transform duration-300"
            :class="isOpen ? 'rotate-180 text-navy' : ''" />
        </div>
      </div>

      <!-- dropdown -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0 scale-95"
        enter-to-class="translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100 scale-100"
        leave-to-class="translate-y-2 opacity-0 scale-95">

        <div v-if="isOpen"
          class="absolute left-0 right-0 top-full z-[10000] mt-2 bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          style="box-shadow: 0 20px 60px -10px rgba(15,23,42,0.25); max-height: 320px">

          <!-- multiple: search header (single has inline) -->
          <div v-if="multiple && searchable" class="px-3 pt-3 pb-2 border-b border-gray-50">
            <div class="flex items-center gap-2 px-3 h-9 rounded-xl bg-gray-50 border border-gray-100">
              <Icon icon="ph:magnifying-glass" class="text-gray-400 text-sm flex-shrink-0" />
              <input v-model="searchQuery" type="text"
                class="flex-1 bg-transparent border-none outline-none text-sm text-navy placeholder:text-gray-400"
                :placeholder="t('common.search')" @click.stop />
              <button v-if="searchQuery" type="button" @click.stop="searchQuery = ''"
                class="text-gray-300 hover:text-gray-500 transition-colors">
                <Icon icon="ph:x" class="text-xs" />
              </button>
            </div>
          </div>

          <!-- multiple: select-all / clear strip -->
          <div v-if="multiple && filteredItems.length > 0"
            class="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
            <button type="button" @click.stop="selectAll"
              class="text-xs font-black text-primary hover:underline transition-colors">
              {{ allSelected ? 'Deselect all' : 'Select all' }}
            </button>
            <span class="text-[10px] font-bold text-gray-400">
              {{ selectedValues.length }} / {{ allItems.length }}
            </span>
          </div>

          <!-- item list -->
          <div class="overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            <div v-if="filteredItems.length === 0" class="p-8 text-center">
              <Icon icon="ph:magnifying-glass-slash" class="text-3xl text-gray-200 mx-auto mb-2" />
              <p class="text-gray-400 text-xs font-medium">{{ t('common.no_results') }}</p>
            </div>

            <button v-for="item in filteredItems" :key="getItemValue(item)" type="button"
              @click="selectItem(item)"
              class="w-full px-3 py-2.5 text-sm flex items-center gap-3 rounded-xl transition-all duration-150 text-left group"
              :class="[
                isSelected(item)
                  ? 'bg-navy/5 text-navy'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-navy'
              ]">

              <!-- checkbox for multiple -->
              <div v-if="multiple"
                class="flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                :class="isSelected(item) ? 'bg-navy border-navy' : 'border-gray-300 group-hover:border-navy/40'">
                <Icon v-if="isSelected(item)" icon="ph:check-bold" class="text-white text-[10px]" />
              </div>

              <!-- item image or icon -->
              <div v-if="item.image" class="flex-shrink-0 w-7 h-7 rounded-lg overflow-hidden bg-white border border-gray-100 p-0.5">
                <img :src="item.image" class="w-full h-full object-contain" :alt="getItemTitle(item)" />
              </div>
              <div v-else-if="item.icon"
                class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                :class="isSelected(item) ? 'bg-navy/10 text-navy' : 'text-gray-400 group-hover:text-navy'">
                <Icon :icon="item.icon" class="text-base" />
              </div>

              <!-- label + description -->
              <div class="flex-1 min-w-0 truncate">
                <div class="font-bold truncate" :class="isSelected(item) ? 'text-navy' : 'text-gray-700'">
                  {{ getItemTitle(item) }}
                </div>
                <div v-if="item.description" class="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                  {{ item.description }}
                </div>
              </div>

              <!-- single: selected check -->
              <Icon v-if="!multiple && isSelected(item)" icon="ph:check-circle-fill"
                class="text-navy text-lg flex-shrink-0" />
            </button>
          </div>

          <!-- footer slot -->
          <div v-if="$slots.footer" class="p-2 border-t border-gray-50 bg-gray-50/50">
            <slot name="footer" />
          </div>

          <!-- multiple: confirm button -->
          <div v-if="multiple && selectedValues.length > 0"
            class="p-3 border-t border-gray-50 flex items-center justify-between">
            <span class="text-xs font-bold text-gray-500">
              {{ selectedValues.length }} item{{ selectedValues.length !== 1 ? 's' : '' }} selected
            </span>
            <button type="button" @click.stop="closeDropdown"
              class="text-xs font-black text-white bg-navy px-4 py-1.5 rounded-lg hover:bg-navy/90 transition-all">
              Done
            </button>
          </div>
        </div>
      </transition>
    </div>

    <p v-if="error" class="text-red-500 text-xs font-bold ml-1">{{ error }}</p>
    <p v-else-if="hint" class="text-gray-400 text-xs ml-1">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: [String, Number, Boolean, Object, Array],
  items: { type: Array, default: () => [] },
  options: { type: Array, default: null },
  label: String,
  placeholder: String,
  hint: String,
  required: Boolean,
  disabled: Boolean,
  searchable: { type: Boolean, default: true },
  multiple: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  icon: String,
  error: String,
  itemTitle: { type: String, default: 'title' },
  itemValue: { type: String, default: 'value' },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const allItems = computed(() => (Array.isArray(props.options) ? props.options : props.items) || [])

const getItemTitle = (item) => (typeof item === 'object' && item !== null ? (item[props.itemTitle] ?? item.label ?? item.name ?? item.title ?? '') : item)
const getItemValue = (item) => (typeof item === 'object' && item !== null ? (item[props.itemValue] ?? item.value ?? item.id ?? '') : item)

const getLabelForValue = (val) => {
  const item = allItems.value.find(i => getItemValue(i) === val)
  return item ? getItemTitle(item) : val
}

const getIconForValue = (val) => {
  const item = allItems.value.find(i => getItemValue(i) === val)
  return item?.icon || null
}

// ── computed ───────────────────────────────────────
const selectedValues = computed(() => {
  if (!props.multiple) return []
  return Array.isArray(props.modelValue) ? props.modelValue : []
})

const hasClearableValue = computed(() => {
  if (props.multiple) return selectedValues.value.length > 0
  return !!props.modelValue
})

const allSelected = computed(() => {
  if (!allItems.value.length) return false
  return allItems.value.every(i => selectedValues.value.includes(getItemValue(i)))
})

const filteredItems = computed(() => {
  if (!searchQuery.value) return allItems.value
  const q = searchQuery.value.toLowerCase()
  return allItems.value.filter(item => {
    const title = getItemTitle(item)?.toString().toLowerCase() || ''
    const desc = item.description?.toString().toLowerCase() || ''
    return title.includes(q) || desc.includes(q)
  })
})

const selectedLabel = computed(() => {
  if (props.multiple) return null
  const item = allItems.value.find(i => getItemValue(i) === props.modelValue)
  return item ? getItemTitle(item) : null
})

const selectedItemIcon = computed(() => {
  if (props.multiple) return null
  const item = allItems.value.find(i => getItemValue(i) === props.modelValue)
  return item?.icon || null
})

const isSelected = (item) => {
  const val = getItemValue(item)
  if (props.multiple) return selectedValues.value.includes(val)
  return props.modelValue === val
}

// ── actions ────────────────────────────────────────
const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
    nextTick(() => searchInput.value?.focus())
  }
}

const selectItem = (item) => {
  const val = getItemValue(item)
  if (props.multiple) {
    const curr = [...selectedValues.value]
    const idx = curr.indexOf(val)
    if (idx > -1) curr.splice(idx, 1)
    else curr.push(val)
    emit('update:modelValue', curr)
  } else {
    emit('update:modelValue', val)
    isOpen.value = false
    searchQuery.value = ''
  }
}

const removeItem = (val) => {
  const curr = selectedValues.value.filter(v => v !== val)
  emit('update:modelValue', curr)
}

const selectAll = () => {
  if (allSelected.value) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', props.items.map(getItemValue))
  }
}

const onBackspace = () => {
  if (searchQuery.value === '' && selectedValues.value.length > 0) {
    removeItem(selectedValues.value[selectedValues.value.length - 1])
  }
}

const clearSelection = () => {
  emit('update:modelValue', props.multiple ? [] : null)
  searchQuery.value = ''
}

const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
}

// v-click-outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._co = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('mousedown', el._co)
  },
  unmounted(el) { document.removeEventListener('mousedown', el._co) }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
