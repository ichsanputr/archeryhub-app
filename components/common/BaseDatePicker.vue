<template>
  <div class="flex flex-col gap-1.5 w-full relative" v-click-outside="closeCalendar">
    <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- trigger -->
    <div class="relative group" @click="toggleCalendar">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-colors"
        :class="isOpen ? 'text-primary' : 'text-gray-400'">
        <Icon icon="ph:calendar-blank" class="text-[18px]" />
      </div>

      <div class="w-full h-11 pl-11 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium transition-all
        flex items-center cursor-pointer hover:border-black/40 select-none"
        :class="[
          isOpen ? 'border-primary bg-white ring-4 ring-primary/10' : '',
          error ? 'border-red-500 ring-4 ring-red-100' : '',
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        ]">

        <!-- range display -->
        <template v-if="range">
          <span v-if="rangeStart && rangeEnd" class="flex items-center gap-2">
            <span class="font-black text-navy text-xs">{{ fmtShort(rangeStart) }}</span>
            <span class="text-gray-300 font-bold">→</span>
            <span class="font-black text-navy text-xs">{{ fmtShort(rangeEnd) }}</span>
          </span>
          <span v-else-if="rangeStart" class="flex items-center gap-2">
            <span class="font-black text-primary text-xs">{{ fmtShort(rangeStart) }}</span>
            <span class="text-gray-300 font-bold">→</span>
            <span class="text-gray-400 text-xs">{{ placeholder || 'End date' }}</span>
          </span>
          <span v-else class="text-gray-400">{{ placeholder || 'Select date range' }}</span>
        </template>

        <!-- single display -->
        <span v-else :class="displaySingle ? 'text-navy' : 'text-gray-400'">
          {{ displaySingle || placeholder || 'Select date' }}
        </span>
      </div>

      <!-- clear -->
      <button v-if="hasValue && clearable" type="button"
        class="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-400 transition-colors z-10"
        @click.stop="clearDate">
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
        class="absolute left-0 top-full z-[9999] mt-2 bg-white border border-gray-100 rounded-2xl overflow-hidden select-none"
        :class="range ? 'flex-nowrap' : ''"
        :style="range ? 'width:560px; box-shadow:0 20px 60px -10px rgba(15,23,42,0.15)' : 'width:288px; box-shadow:0 20px 60px -10px rgba(15,23,42,0.15)'">

        <!-- range: two panels side by side -->
        <div v-if="range" class="flex">
          <!-- left panel -->
          <div class="flex-1 p-3">
            <CalMonthNav
              :year="leftYear" :month="leftMonth"
              @prev="prevLeft" @next="nextLeft" />
            <CalGrid
              :year="leftYear" :month="leftMonth"
              :today-str="todayStr"
              :range-start="rangeStart" :range-end="rangeEnd"
              :hover-date="hoverDate" :picking-end="pickingEnd"
              @pick="onRangeDay" @hover="d => { if (pickingEnd) hoverDate = d }" @leave="hoverDate = ''" />
          </div>
          <div class="w-px bg-gray-100 self-stretch my-3" />
          <!-- right panel -->
          <div class="flex-1 p-3">
            <CalMonthNav
              :year="rightYear" :month="rightMonth"
              @prev="prevLeft" @next="nextLeft" />
            <CalGrid
              :year="rightYear" :month="rightMonth"
              :today-str="todayStr"
              :range-start="rangeStart" :range-end="rangeEnd"
              :hover-date="hoverDate" :picking-end="pickingEnd"
              @pick="onRangeDay" @hover="d => { if (pickingEnd) hoverDate = d }" @leave="hoverDate = ''" />
          </div>
        </div>

        <!-- single: one panel -->
        <div v-else class="p-3">
          <!-- year/month quick selector -->
          <div v-if="showYearMonth" class="p-1">
            <div class="flex items-center justify-between mb-2">
              <button type="button" @click.stop="yearPage--"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                <Icon icon="ph:caret-left" class="text-xs" />
              </button>
              <span class="text-xs font-black text-navy">{{ yearPageStart }} – {{ yearPageStart + 11 }}</span>
              <button type="button" @click.stop="yearPage++"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                <Icon icon="ph:caret-right" class="text-xs" />
              </button>
            </div>
            <div class="grid grid-cols-4 gap-1 mb-3">
              <button v-for="yr in yearPageYears" :key="yr" type="button" @click.stop="selectYear(yr)"
                class="py-1.5 rounded-lg text-xs font-bold transition-all"
                :class="yr === viewYear ? 'bg-primary text-navy font-black' : 'text-gray-600 hover:bg-primary/10'">
                {{ yr }}
              </button>
            </div>
            <div class="grid grid-cols-4 gap-1">
              <button v-for="(mn, idx) in MONTH_NAMES" :key="mn" type="button" @click.stop="selectMonth(idx)"
                class="py-1.5 rounded-lg text-xs font-bold transition-all"
                :class="idx === viewMonth ? 'bg-primary text-navy font-black' : 'text-gray-600 hover:bg-primary/10'">
                {{ mn.slice(0, 3) }}
              </button>
            </div>
          </div>

          <!-- normal day grid -->
          <template v-else>
            <CalMonthNav
              :year="viewYear" :month="viewMonth"
              :show-toggle="true"
              @prev="prevMonth" @next="nextMonth" @toggle="showYearMonth = true" />
            <CalGrid
              :year="viewYear" :month="viewMonth"
              :today-str="todayStr"
              :selected-single="modelValue"
              @pick="onSingleDay" />
          </template>
        </div>

        <!-- footer -->
        <div class="px-4 py-2.5 border-t border-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-3 flex-wrap">
            <button type="button" @click.stop="selectToday"
              class="text-xs font-black text-primary hover:underline">
              Today
            </button>
            <template v-if="range">
              <button type="button" @click.stop="setPreset(7)"
                class="text-xs font-bold text-gray-400 hover:text-primary transition-colors">
                Last 7d
              </button>
              <button type="button" @click.stop="setPreset(30)"
                class="text-xs font-bold text-gray-400 hover:text-primary transition-colors">
                Last 30d
              </button>
              <button type="button" @click.stop="setThisMonth"
                class="text-xs font-bold text-gray-400 hover:text-primary transition-colors">
                This month
              </button>
            </template>
          </div>
          <button v-if="hasValue" type="button" @click.stop="clearDate"
            class="text-xs font-bold text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
            <Icon icon="ph:x" class="text-xs" /> Clear
          </button>
        </div>

        <!-- range: picking-end hint -->
        <div v-if="range && pickingEnd"
          class="px-4 pb-3 -mt-1 text-[10px] font-bold text-primary flex items-center gap-1.5">
          <Icon icon="ph:arrow-right" class="text-xs" />
          Now click an end date
        </div>
      </div>
    </transition>

    <p v-if="error" class="text-red-500 text-xs font-bold ml-1">{{ error }}</p>
    <p v-else-if="hint" class="text-gray-400 text-xs ml-1">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineComponent, h } from 'vue'
import { Icon } from '@iconify/vue'

// ── constants ──────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December']
const DAY_HEADERS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// ── CalMonthNav sub-component (render fn) ─────────
const CalMonthNav = defineComponent({
  name: 'CalMonthNav',
  props: { year: Number, month: Number, showToggle: Boolean },
  emits: ['prev','next','toggle'],
  setup(props, { emit }) {
    return () => h('div', { class: 'flex items-center justify-between mb-3' }, [
      h('button', {
        type: 'button',
        onClick: (e) => { e.stopPropagation(); emit('prev') },
        class: 'w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all'
      }, [h(Icon, { icon: 'ph:caret-left', class: 'text-sm' })]),

      props.showToggle
        ? h('button', {
            type: 'button',
            onClick: (e) => { e.stopPropagation(); emit('toggle') },
            class: 'text-sm font-black text-navy hover:text-primary transition-colors px-2'
          }, `${MONTH_NAMES[props.month]} ${props.year}`)
        : h('span', { class: 'text-sm font-black text-navy' }, `${MONTH_NAMES[props.month]} ${props.year}`),

      h('button', {
        type: 'button',
        onClick: (e) => { e.stopPropagation(); emit('next') },
        class: 'w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all'
      }, [h(Icon, { icon: 'ph:caret-right', class: 'text-sm' })])
    ])
  }
})

// ── CalGrid sub-component (render fn) ─────────────
const CalGrid = defineComponent({
  name: 'CalGrid',
  props: {
    year: Number, month: Number,
    todayStr: String,
    selectedSingle: String,
    rangeStart: String, rangeEnd: String,
    hoverDate: String, pickingEnd: Boolean,
  },
  emits: ['pick','hover','leave'],
  setup(props, { emit }) {
    const cells = computed(() => {
      const firstDay = new Date(props.year, props.month, 1).getDay()
      const daysInMonth = new Date(props.year, props.month + 1, 0).getDate()
      const result = []
      for (let i = 0; i < firstDay; i++) result.push(null)
      for (let d = 1; d <= daysInMonth; d++) {
        const ds = toDateStr(new Date(props.year, props.month, d))
        const start = props.rangeStart || ''
        const effectiveEnd = props.pickingEnd
          ? (props.hoverDate || props.rangeEnd || '')
          : (props.rangeEnd || '')
        const lo = start && effectiveEnd ? (start < effectiveEnd ? start : effectiveEnd) : start
        const hi = start && effectiveEnd ? (start < effectiveEnd ? effectiveEnd : start) : start
        result.push({
          day: d, ds,
          isToday: ds === props.todayStr,
          isSelectedSingle: props.selectedSingle === ds,
          isRangeStart: start && ds === lo && lo !== hi,
          isRangeEnd: effectiveEnd && ds === hi && lo !== hi,
          isRangeSingle: start && effectiveEnd && lo === hi && ds === lo,
          inRange: lo && hi && ds > lo && ds < hi,
        })
      }
      return result
    })

    return () => {
      const headerRow = h('div', { class: 'grid grid-cols-7 mb-1' },
        DAY_HEADERS.map(d => h('div', {
          key: d, class: 'text-center text-[10px] font-black text-gray-400 uppercase py-1'
        }, d))
      )

      const dayGrid = h('div', { class: 'grid grid-cols-7' },
        cells.value.map((cell, i) => {
          if (!cell) return h('div', { key: `e${i}` })

          const cls = [
            'aspect-square flex items-center justify-center text-xs font-bold transition-all',
            cell.isSelectedSingle ? 'rounded-full bg-primary text-navy font-black scale-105' : '',
            cell.isRangeStart ? 'rounded-l-full bg-primary text-navy font-black' : '',
            cell.isRangeEnd ? 'rounded-r-full bg-primary text-navy font-black' : '',
            cell.isRangeSingle ? 'rounded-full bg-primary text-navy font-black' : '',
            cell.inRange ? 'bg-primary/15 text-navy rounded-none' : '',
            !cell.isSelectedSingle && !cell.isRangeStart && !cell.isRangeEnd && !cell.inRange && !cell.isRangeSingle
              ? 'rounded-full hover:bg-primary/10 hover:text-navy text-gray-700' : '',
            cell.isToday && !cell.isSelectedSingle && !cell.isRangeStart && !cell.isRangeEnd && !cell.inRange && !cell.isRangeSingle
              ? 'ring-1 ring-primary/40 text-primary' : '',
          ].filter(Boolean).join(' ')

          return h('button', {
            key: cell.ds, type: 'button',
            class: cls,
            onClick: (e) => { e.stopPropagation(); emit('pick', cell.ds) },
            onMouseenter: () => emit('hover', cell.ds),
            onMouseleave: () => emit('leave'),
          }, String(cell.day))
        })
      )

      return h('div', {}, [headerRow, dayGrid])
    }
  }
})

// ── main component props / emits ───────────────────
const props = defineProps({
  modelValue: [String, Object],
  label: String,
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  clearable: { type: Boolean, default: true },
  error: String,
  hint: String,
  range: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

// ── state ──────────────────────────────────────────
const isOpen = ref(false)
const showYearMonth = ref(false)

const today = new Date()
const todayStr = toDateStr(today)

// single mode
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())
const yearPage = ref(0)
const yearPageStart = computed(() => {
  const base = Math.floor(today.getFullYear() / 12) * 12
  return base + yearPage.value * 12
})
const yearPageYears = computed(() => Array.from({ length: 12 }, (_, i) => yearPageStart.value + i))

// range mode
const rangeStart = ref('')
const rangeEnd = ref('')
const pickingEnd = ref(false)
const hoverDate = ref('')

const leftYear = ref(today.getFullYear())
const leftMonth = ref(today.getMonth())
const rightYear = computed(() => leftMonth.value === 11 ? leftYear.value + 1 : leftYear.value)
const rightMonth = computed(() => leftMonth.value === 11 ? 0 : leftMonth.value + 1)

// ── sync incoming model ────────────────────────────
watch(() => props.modelValue, (val) => {
  if (props.range) {
    rangeStart.value = val?.start || ''
    rangeEnd.value = val?.end || ''
    if (val?.start) {
      const d = new Date(val.start + 'T00:00:00')
      if (!isNaN(d)) { leftYear.value = d.getFullYear(); leftMonth.value = d.getMonth() }
    }
  } else {
    if (val) {
      const d = new Date(val + 'T00:00:00')
      if (!isNaN(d)) { viewYear.value = d.getFullYear(); viewMonth.value = d.getMonth() }
    }
  }
}, { immediate: true })

// ── display ────────────────────────────────────────
function fmtShort(str) {
  if (!str) return ''
  const d = new Date(str + 'T00:00:00')
  return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const displaySingle = computed(() => {
  if (props.range || !props.modelValue) return ''
  return fmtShort(props.modelValue)
})

const hasValue = computed(() => {
  if (props.range) return !!(rangeStart.value || rangeEnd.value)
  return !!props.modelValue
})

// ── single navigation ──────────────────────────────
function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- } else viewMonth.value--
  showYearMonth.value = false
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ } else viewMonth.value++
  showYearMonth.value = false
}
function selectYear(yr) { viewYear.value = yr }
function selectMonth(idx) { viewMonth.value = idx; showYearMonth.value = false }

// ── range navigation ───────────────────────────────
function prevLeft() {
  if (leftMonth.value === 0) { leftMonth.value = 11; leftYear.value-- } else leftMonth.value--
}
function nextLeft() {
  if (leftMonth.value === 11) { leftMonth.value = 0; leftYear.value++ } else leftMonth.value++
}

// ── selection ──────────────────────────────────────
function onSingleDay(ds) {
  emit('update:modelValue', ds)
  isOpen.value = false
  showYearMonth.value = false
}

function onRangeDay(ds) {
  if (!pickingEnd.value) {
    rangeStart.value = ds
    rangeEnd.value = ''
    hoverDate.value = ''
    pickingEnd.value = true
  } else {
    let s = rangeStart.value, e = ds
    if (s > e) [s, e] = [e, s]
    rangeStart.value = s; rangeEnd.value = e
    hoverDate.value = ''; pickingEnd.value = false
    emit('update:modelValue', { start: s, end: e })
    isOpen.value = false
  }
}

function selectToday() {
  if (props.range) {
    rangeStart.value = todayStr; rangeEnd.value = todayStr
    emit('update:modelValue', { start: todayStr, end: todayStr })
  } else {
    viewYear.value = today.getFullYear(); viewMonth.value = today.getMonth()
    emit('update:modelValue', todayStr)
  }
  isOpen.value = false
}

function setPreset(days) {
  const end = new Date(); const start = new Date()
  start.setDate(start.getDate() - days + 1)
  const s = toDateStr(start), e = toDateStr(end)
  rangeStart.value = s; rangeEnd.value = e
  pickingEnd.value = false
  emit('update:modelValue', { start: s, end: e })
  isOpen.value = false
}

function setThisMonth() {
  const now = new Date()
  const s = toDateStr(new Date(now.getFullYear(), now.getMonth(), 1))
  const e = toDateStr(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  rangeStart.value = s; rangeEnd.value = e
  pickingEnd.value = false
  emit('update:modelValue', { start: s, end: e })
  isOpen.value = false
}

function clearDate() {
  rangeStart.value = ''; rangeEnd.value = ''
  pickingEnd.value = false; hoverDate.value = ''
  emit('update:modelValue', props.range ? { start: '', end: '' } : '')
  isOpen.value = false
}

function toggleCalendar() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (!isOpen.value) { showYearMonth.value = false; pickingEnd.value = false; hoverDate.value = '' }
}

function closeCalendar() {
  isOpen.value = false; showYearMonth.value = false; pickingEnd.value = false; hoverDate.value = ''
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
