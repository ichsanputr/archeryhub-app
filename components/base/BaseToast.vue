<template>
  <div class="fixed top-4 right-4 sm:top-5 sm:right-5 !z-[99999999] flex flex-col gap-2.5 pointer-events-none w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[320px] sm:max-w-[400px]">
    <TransitionGroup
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform translate-y-[-8px] sm:translate-y-0 sm:translate-x-8 opacity-0"
      enter-to-class="transform translate-y-0 sm:translate-x-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 sm:translate-x-0 opacity-100"
      leave-to-class="transform translate-y-[-4px] sm:translate-y-0 sm:translate-x-8 opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto relative flex items-center gap-3 pl-3 pr-3.5 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-l-4 font-sans"
        :class="config[toast.type]?.borderClass || config.info.borderClass"
      >
        <!-- Icon Pill -->
        <div
          class="shrink-0 size-8 rounded-lg flex items-center justify-center"
          :class="config[toast.type]?.pillClass || config.info.pillClass"
        >
          <Icon :icon="config[toast.type]?.icon || config.info.icon" class="text-base" />
        </div>

        <!-- Message -->
        <div class="flex-grow min-w-0">
          <span class="text-[13px] font-semibold leading-snug break-words block">
            {{ toast.message }}
          </span>
          <button
            v-if="toast.action"
            @click="handleAction(toast)"
            class="mt-1 text-xs font-bold text-navy dark:text-primary hover:underline flex items-center gap-1"
          >
            {{ toast.action.label }}
          </button>
        </div>

        <!-- Close Button -->
        <button
          type="button"
          @click="removeToast(toast.id)"
          class="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close notification"
        >
          <Icon icon="ph:x-bold" class="text-xs" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

const handleAction = (toast) => {
  if (toast?.action?.onClick) {
    toast.action.onClick()
  }
  removeToast(toast.id)
}

const config = {
  success: {
    icon: 'ph:check-bold',
    borderClass: 'border-l-emerald-500',
    pillClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
  },
  error: {
    icon: 'ph:x-bold',
    borderClass: 'border-l-rose-500',
    pillClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
  },
  warning: {
    icon: 'ph:warning-bold',
    borderClass: 'border-l-amber-500',
    pillClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
  },
  info: {
    icon: 'ph:info-bold',
    borderClass: 'border-l-sky-500',
    pillClass: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400'
  }
}
</script>

