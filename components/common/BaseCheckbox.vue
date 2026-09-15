<template>
  <div class="flex flex-col gap-1">
    <label
      class="relative flex items-center gap-3 cursor-pointer group select-none"
      :class="[
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        card ? 'p-3.5 rounded-xl border transition-all ' + (isChecked ? 'border-primary bg-primary/5 shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50') : ''
      ]"
    >
      <input
        type="checkbox"
        :checked="isChecked"
        :value="value"
        :disabled="disabled"
        :required="required"
        class="peer sr-only"
        @change="handleChange"
      />

      <div
        class="size-5 rounded-lg border-2 transition-all flex items-center justify-center shrink-0"
        :class="[
          isChecked
            ? 'bg-primary border-primary text-navy shadow-2xs'
            : 'bg-white border-slate-300 group-hover:border-primary/60',
          error ? 'border-red-500' : '',
          'peer-focus:ring-2 peer-focus:ring-primary/20 peer-focus-visible:outline-none'
        ]"
      >
        <Icon v-if="isChecked" icon="ph:check-bold" class="text-xs text-navy" />
      </div>

      <div class="flex-1 min-w-0">
        <span
          v-if="label || $slots.default"
          class="text-xs sm:text-sm font-medium text-slate-700 block leading-normal"
        >
          <slot>{{ label }}</slot>
        </span>
        <span
          v-if="sublabel || $slots.sublabel"
          class="text-[11px] text-slate-400 font-medium block mt-0.5"
        >
          <slot name="sublabel">{{ sublabel }}</slot>
        </span>
      </div>
    </label>

    <span v-if="error" class="text-red-500 text-xs font-bold ml-8">
      {{ error }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Boolean, Array, String, Number],
    default: false
  },
  value: {
    type: [String, Number, Boolean, Object],
    default: null
  },
  label: String,
  sublabel: String,
  error: String,
  disabled: Boolean,
  required: Boolean,
  card: Boolean
})

const emit = defineEmits(['update:modelValue', 'change'])

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  if (typeof props.modelValue === 'boolean') {
    return props.modelValue
  }
  return props.modelValue === props.value
})

const handleChange = (event) => {
  const checked = event.target.checked
  let newValue

  if (Array.isArray(props.modelValue)) {
    newValue = [...props.modelValue]
    if (checked) {
      if (!newValue.includes(props.value)) {
        newValue.push(props.value)
      }
    } else {
      const index = newValue.indexOf(props.value)
      if (index > -1) {
        newValue.splice(index, 1)
      }
    }
  } else {
    newValue = checked
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>
