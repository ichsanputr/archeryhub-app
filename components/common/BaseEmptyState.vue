<template>
  <div
    class="text-center px-4 flex flex-col items-center justify-center"
    :class="[
      padding || defaultPadding,
      border ? 'border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl bg-slate-50/50 dark:bg-slate-900/30' : ''
    ]"
  >
    <!-- Icon Container -->
    <div
      class="bg-primary/15 border border-primary/25 text-navy flex items-center justify-center mx-auto shadow-2xs shrink-0"
      :class="[containerSizeClass, mbClass]"
    >
      <slot name="icon">
        <Icon :icon="icon" :class="[iconSizeClass, iconClass || 'text-navy']" />
      </slot>
    </div>

    <!-- Title -->
    <slot name="title">
      <h3 v-if="title" class="font-black text-navy dark:text-white" :class="titleSizeClass">
        {{ title }}
      </h3>
    </slot>

    <!-- Description -->
    <slot name="description">
      <p
        v-if="description"
        class="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed"
        :class="descSizeClass"
      >
        {{ description }}
      </p>
    </slot>

    <!-- Default Slot (Alternative for description/custom content) -->
    <div v-if="$slots.default" class="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed" :class="descSizeClass">
      <slot />
    </div>

    <!-- Optional Actions Slot -->
    <div v-if="$slots.actions" class="pt-4 flex flex-wrap items-center justify-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: 'ph:folder-open-bold'
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  iconClass: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: false
  }
})

const defaultPadding = computed(() => {
  if (props.size === 'sm') return 'py-8 sm:py-10'
  if (props.size === 'lg') return 'py-16 sm:py-20'
  return 'py-12 sm:py-16'
})

const containerSizeClass = computed(() => {
  if (props.size === 'sm') return 'size-11 sm:size-12 rounded-xl'
  if (props.size === 'lg') return 'size-16 sm:size-20 rounded-3xl'
  return 'size-14 sm:size-16 rounded-2xl'
})

const iconSizeClass = computed(() => {
  if (props.size === 'sm') return 'text-xl sm:text-2xl'
  if (props.size === 'lg') return 'text-3xl sm:text-4xl'
  return 'text-2xl sm:text-3xl'
})

const mbClass = computed(() => {
  if (props.size === 'sm') return 'mb-2.5'
  if (props.size === 'lg') return 'mb-4'
  return 'mb-3.5'
})

const titleSizeClass = computed(() => {
  if (props.size === 'sm') return 'text-xs sm:text-sm mb-1'
  if (props.size === 'lg') return 'text-base sm:text-lg mb-2'
  return 'text-sm sm:text-base mb-1.5'
})

const descSizeClass = computed(() => {
  if (props.size === 'sm') return 'text-xs'
  return 'text-xs sm:text-sm'
})
</script>
