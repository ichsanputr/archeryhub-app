<template>
  <div class="flex flex-col gap-1.5 w-full relative" v-click-outside="closePanel">
    <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- trigger -->
    <div class="relative group" @click="togglePanel">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-colors"
        :class="isOpen ? 'text-primary' : 'text-gray-400'">
        <Icon icon="ph:clock" class="text-[18px]" />
      </div>

      <div class="w-full h-11 pl-11 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium transition-all
        flex items-center cursor-pointer hover:border-black/40 select-none"
        :class="[
          isOpen ? 'border-primary bg-white ring-4 ring-primary/10' : '',
          error ? 'border-red-500 ring-4 ring-red-100' : '',
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
          displayValue ? 'text-navy' : 'text-gray-400'
        ]">
        <span class="whitespace-nowrap truncate w-full">{{ displayValue || placeholder || 'Select time' }}</span>
      </div>

      <!-- clear -->
      <button v-if="modelValue && clearable" type="button"
        class="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-400 transition-colors z-10"
        @click.stop="clearTime">
        <Icon icon="ph:x-circle" class="text-base" />
      </button>

      <!-- caret -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-300"
        :class="isOpen ? 'rotate-180 text-primary' : ''">
        <Icon icon="ph:caret-down" class="text-sm" />
      </div>
    </div>

    <!-- panel -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-2 opacity-0 scale-95">

      <div v-if="isOpen"
        class="absolute left-0 top-full z-[9999] mt-2 bg-white border border-gray-100 rounded-2xl overflow-hidden"
        style="box-shadow: 0 20px 60px -10px rgba(15,23,42,0.15); width: 240px">

        <!-- time display strip -->
        <div class="bg-navy px-4 py-3 flex items-center justify-center gap-1">
          <span class="text-3xl font-black text-white tabular-nums tracking-tight">{{ pad(selectedHour) }}</span>
          <span class="text-3xl font-black text-primary">:</span>
          <span class="text-3xl font-black text-white tabular-nums tracking-tight">{{ pad(selectedMinute) }}</span>
          <span v-if="use12h" class="ml-2 text-base font-black text-primary">{{ ampm }}</span>
        </div>

        <!-- scroll columns -->
        <div class="flex divide-x divide-gray-100">
          <!-- hours -->
          <div class="flex-1 flex flex-col items-center">
            <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest py-2">
              {{ use12h ? 'Hour' : 'HH' }}
            </div>
            <div class="relative h-48 overflow-hidden w-full">
              <!-- selection highlight -->
              <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 bg-primary/10 border-y border-primary/20 pointer-events-none z-10" />
              <div ref="hourCol" class="h-full overflow-y-auto scroll-smooth no-scrollbar snap-y snap-mandatory"
                @scroll.passive="onHourScroll">
                <div class="h-[calc(50%-18px)]" />
                <button v-for="h in hourList" :key="h" type="button"
                  @click.stop="selectHour(h)"
                  class="w-full h-9 flex items-center justify-center text-sm font-bold snap-center transition-all"
                  :class="h === selectedHour ? 'text-navy font-black scale-110' : 'text-gray-400 hover:text-navy'">
                  {{ pad(h) }}
                </button>
                <div class="h-[calc(50%-18px)]" />
              </div>
            </div>
          </div>

          <!-- minutes -->
          <div class="flex-1 flex flex-col items-center">
            <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest py-2">MM</div>
            <div class="relative h-48 overflow-hidden w-full">
              <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-9 bg-primary/10 border-y border-primary/20 pointer-events-none z-10" />
              <div ref="minCol" class="h-full overflow-y-auto scroll-smooth no-scrollbar snap-y snap-mandatory"
                @scroll.passive="onMinScroll">
                <div class="h-[calc(50%-18px)]" />
                <button v-for="m in minuteList" :key="m" type="button"
                  @click.stop="selectMinute(m)"
                  class="w-full h-9 flex items-center justify-center text-sm font-bold snap-center transition-all"
                  :class="m === selectedMinute ? 'text-navy font-black scale-110' : 'text-gray-400 hover:text-navy'">
                  {{ pad(m) }}
                </button>
                <div class="h-[calc(50%-18px)]" />
              </div>
            </div>
          </div>

          <!-- AM / PM toggle -->
          <div v-if="use12h" class="w-16 flex flex-col items-center pt-2 gap-0">
            <div class="text-[9px] font-black text-gray-400 uppercase tracking-widest py-2">AM/PM</div>
            <div class="flex flex-col gap-1.5 mt-2 w-full px-2">
              <button type="button" @click.stop="ampm = 'AM'"
                class="py-2 rounded-xl text-xs font-black transition-all"
                :class="ampm === 'AM' ? 'bg-primary text-navy' : 'text-gray-400 hover:bg-primary/10'">
                AM
              </button>
              <button type="button" @click.stop="ampm = 'PM'"
                class="py-2 rounded-xl text-xs font-black transition-all"
                :class="ampm === 'PM' ? 'bg-primary text-navy' : 'text-gray-400 hover:bg-primary/10'">
                PM
              </button>
            </div>
          </div>
        </div>

        <!-- step selector -->
        <div class="px-3 py-2 border-t border-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-1">
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-wider">step</span>
            <div class="flex gap-1 ml-1">
              <button v-for="s in [1,5,10,15,30]" :key="s" type="button"
                @click.stop="minuteStep = s"
                class="px-1.5 py-0.5 rounded text-[10px] font-black transition-all"
                :class="minuteStep === s ? 'bg-primary text-navy' : 'text-gray-400 hover:bg-primary/10'">
                {{ s }}m
              </button>
            </div>
          </div>
          <button type="button" @click.stop="confirmTime"
            class="text-xs font-black text-white bg-primary px-3 py-1 rounded-lg hover:bg-primary/90 transition-all">
            Done
          </button>
        </div>
      </div>
    </transition>

    <p v-if="error" class="text-red-500 text-xs font-bold ml-1">{{ error }}</p>
    <p v-else-if="hint" class="text-gray-400 text-xs ml-1">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: String, // 'HH:MM' (24h) or 'HH:MM AM/PM'
  label: String,
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  clearable: { type: Boolean, default: true },
  error: String,
  hint: String,
  use12h: { type: Boolean, default: false },
  step: { type: Number, default: 1 }, // default minute step
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const hourCol = ref(null)
const minCol = ref(null)

const minuteStep = ref(props.step)
const selectedHour = ref(0)
const selectedMinute = ref(0)
const ampm = ref('AM')

const hourList = computed(() => {
  if (props.use12h) return Array.from({ length: 12 }, (_, i) => i + 1)
  return Array.from({ length: 24 }, (_, i) => i)
})

const minuteList = computed(() => {
  const list = []
  for (let m = 0; m < 60; m += minuteStep.value) list.push(m)
  return list
})

// parse incoming modelValue
watch(() => props.modelValue, (val) => {
  if (!val) return
  const parts = val.split(':')
  if (parts.length < 2) return
  let h = parseInt(parts[0]) || 0
  let m = parseInt(parts[1]) || 0
  if (props.use12h) {
    ampm.value = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
  }
  selectedHour.value = h
  selectedMinute.value = m
}, { immediate: true })

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  return props.modelValue
})

function pad(n) { return String(n).padStart(2, '0') }

function selectHour(h) {
  selectedHour.value = h
  scrollTo(hourCol.value, hourList.value.indexOf(h))
  emitValue()
}

function selectMinute(m) {
  selectedMinute.value = m
  const idx = minuteList.value.indexOf(m)
  scrollTo(minCol.value, idx)
  emitValue()
}

// snap scroll → update selected value
let hourScrollTimer, minScrollTimer
function onHourScroll(e) {
  clearTimeout(hourScrollTimer)
  hourScrollTimer = setTimeout(() => {
    const itemH = 36
    const idx = Math.round(e.target.scrollTop / itemH)
    selectedHour.value = hourList.value[Math.min(idx, hourList.value.length - 1)] ?? 0
    emitValue()
  }, 80)
}

function onMinScroll(e) {
  clearTimeout(minScrollTimer)
  minScrollTimer = setTimeout(() => {
    const itemH = 36
    const idx = Math.round(e.target.scrollTop / itemH)
    selectedMinute.value = minuteList.value[Math.min(idx, minuteList.value.length - 1)] ?? 0
    emitValue()
  }, 80)
}

function scrollTo(el, idx) {
  if (!el) return
  el.scrollTo({ top: idx * 36, behavior: 'smooth' })
}

function emitValue() {
  let h = selectedHour.value
  if (props.use12h) {
    if (ampm.value === 'PM' && h !== 12) h += 12
    if (ampm.value === 'AM' && h === 12) h = 0
  }
  emit('update:modelValue', `${pad(h)}:${pad(selectedMinute.value)}`)
}

function confirmTime() {
  emitValue()
  isOpen.value = false
}

function clearTime() {
  emit('update:modelValue', '')
  isOpen.value = false
}

function togglePanel() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      scrollTo(hourCol.value, hourList.value.indexOf(selectedHour.value))
      scrollTo(minCol.value, minuteList.value.indexOf(
        minuteList.value.reduce((prev, curr) =>
          Math.abs(curr - selectedMinute.value) < Math.abs(prev - selectedMinute.value) ? curr : prev, 0)
      ))
    })
  }
}

function closePanel() { isOpen.value = false }

// watch ampm change → re-emit
watch(ampm, () => emitValue())

// v-click-outside
const vClickOutside = {
  mounted(el, binding) {
    el._co = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('mousedown', el._co)
  },
  unmounted(el) { document.removeEventListener('mousedown', el._co) }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
