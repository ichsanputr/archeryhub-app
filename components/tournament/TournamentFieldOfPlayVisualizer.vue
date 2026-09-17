<template>
  <div class="space-y-4 font-body">
    <!-- Top Bar: Session & Day Controls + Action Toolbar (Light Theme) -->
    <div class="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3 text-xs">
        <!-- Day Selector (if multiple days) -->
        <div v-if="formattedFopDays.length > 1" class="flex items-center gap-2">
          <span class="text-slate-500 font-semibold">Hari:</span>
          <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
            <button
              v-for="(day, dIdx) in formattedFopDays"
              :key="dIdx"
              @click="selectedDayIdx = dIdx"
              :class="[
                'px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer select-none',
                selectedDayIdx === dIdx ? 'bg-navy text-white shadow-xs' : 'text-slate-600 hover:text-navy hover:bg-slate-200/60'
              ]"
            >
              {{ day.label }}
            </button>
          </div>
        </div>

        <!-- Session Selector Dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-slate-500 font-semibold">Sesi:</span>
          <div class="relative">
            <select
              v-model.number="selectedSessionIdx"
              class="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-navy font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-navy text-xs cursor-pointer pr-8 appearance-none transition-all shadow-2xs"
            >
              <option v-for="(session, sIdx) in currentDaySessions" :key="sIdx" :value="sIdx">
                {{ session.time }} — {{ session.title }} ({{ session.targetCount }} Targets)
              </option>
            </select>
            <Icon icon="ph:caret-down-bold" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
          </div>
        </div>
      </div>

      <!-- Quick Canvas Actions -->
      <div class="flex items-center gap-1.5 self-end md:self-auto">
        <button
          @click="resetCamera"
          class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Reset Zoom & Pan"
        >
          <Icon icon="ph:arrows-counter-clockwise-bold" class="text-xs text-slate-500" />
          <span>Reset View</span>
        </button>
      </div>
    </div>

    <!-- ───────────────────────────────────────────────────────────── -->
    <!-- 2.5D ISOMETRIC STADIUM CANVAS CONTAINER (LIGHT THEME) -->
    <!-- ───────────────────────────────────────────────────────────── -->
    <div class="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-sm ring-1 ring-slate-900/5">
      <!-- Canvas Element -->
      <canvas
        ref="canvasRef"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @wheel="handleWheel"
        @click="handleCanvasClick"
        class="w-full h-[480px] sm:h-[580px] cursor-grab active:cursor-grabbing block select-none bg-slate-100"
      ></canvas>

      <!-- Floating Interactive Target Inspector Popover (Light Theme) -->
      <div
        v-if="selectedTargetInfo"
        class="absolute bottom-4 left-4 max-w-sm bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl text-xs space-y-3 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200 text-navy"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div class="flex items-center gap-2.5">
            <span class="size-7 rounded-xl bg-primary text-navy font-black flex items-center justify-center text-xs shadow-xs">
              #{{ selectedTargetInfo.targetNumber }}
            </span>
            <div>
              <div class="font-bold text-navy text-sm">Target Butt {{ selectedTargetInfo.targetNumber }}</div>
              <div class="text-[10px] text-slate-500 font-mono">{{ selectedTargetInfo.distance }} Range Distance</div>
            </div>
          </div>
          <button @click="selectedTargetInfo = null" class="size-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-navy flex items-center justify-center transition-colors cursor-pointer">
            <Icon icon="ph:x-bold" class="text-xs" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div class="text-slate-400 text-[10px] font-semibold">Division</div>
            <div class="font-bold text-navy truncate mt-0.5">{{ selectedTargetInfo.divisionName }}</div>
            <div class="text-[10px] text-emerald-700 font-mono font-bold">{{ selectedTargetInfo.divisionCode }}</div>
          </div>
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <div class="text-slate-400 text-[10px] font-semibold">Phase & Match</div>
            <div class="font-bold text-amber-700 mt-0.5">{{ selectedTargetInfo.phase }}</div>
            <div class="text-[10px] text-slate-500">{{ activeSession.format || 'Official Match' }}</div>
          </div>
        </div>

        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
          <div class="flex items-center justify-between text-[10px]">
            <span class="text-slate-500">Target Face:</span>
            <span class="font-bold text-navy">{{ selectedTargetInfo.targetFace }}</span>
          </div>
          <div class="flex items-center justify-between text-[10px] border-t border-slate-200/60 pt-1.5">
            <span class="text-slate-500">Flight Slots:</span>
            <div class="flex items-center gap-1 font-mono">
              <span class="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold border border-sky-200">A: Archer 1</span>
              <span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">B: Archer 2</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Top-Left Status Bar (Light Theme) -->
      <div class="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] sm:text-[11px] text-slate-700 flex items-center gap-2.5 z-10 pointer-events-none shadow-sm">
        <div class="flex items-center gap-1.5">
          <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-mono font-bold text-navy">{{ activeSession.targetCount }} Lanes</span>
        </div>
        <span class="text-slate-300">|</span>
        <div class="flex items-center gap-1">
          <Icon icon="ph:cursor-click-bold" class="text-navy text-xs" />
          <span>Click to Inspect</span>
        </div>
        <span class="hidden sm:inline text-slate-300">|</span>
        <div class="hidden sm:flex items-center gap-1">
          <Icon icon="ph:mouse-scroll-bold" class="text-navy text-xs" />
          <span>Pan & Zoom</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  tournament: {
    type: Object,
    default: () => ({})
  },
  tournamentData: {
    type: Object,
    default: () => ({})
  },
  fopData: {
    type: Array,
    default: () => []
  }
})

// ─────────────────────────────────────────────────────────────
// STATE & AUTHENTIC IANSEO PRESETS
// ─────────────────────────────────────────────────────────────
const selectedDayIdx = ref(0)
const selectedSessionIdx = ref(0)
const selectedTargetInfo = ref(null)

const defaultTargetFaceSpans = [
  { start: 1, end: 16, label: 'Complete (1 - 10 +X) 122 cm' },
  { start: 17, end: 32, label: 'Reduced (5 - 10 +X) 80 cm' }
]

const formattedFopDays = computed(() => {
  const tId = String(props.tournament?.id || props.tournament?.slug || '27311')
  
  const presets = {
    '27311': [
      {
        label: '24 Apr 2026, Friday',
        date: '2026-04-24',
        sessions: [
          {
            time: '13:15 - 13:45',
            title: 'Babak Perempat Final (1/4 Final)',
            matchType: 'Individual Elimination Matches',
            format: '5 ends of 3 arrows',
            targetCount: 32,
            targetFaceSpans: [
              { start: 1, end: 16, label: 'Complete (1 - 10 +X) 122 cm' },
              { start: 17, end: 32, label: 'Reduced (5 - 10 +X) 80 cm' }
            ],
            blocks: [
              { targetStart: 1, targetEnd: 4, targetCount: 4, distance: '5m', divisionCode: 'BU10M', divisionName: 'Barebow U10 Men', phase: '1/4 Final', targetFace: 'Complete 122cm (1-10 +X)', themeColor: '#16a34a' },
              { targetStart: 5, targetEnd: 8, targetCount: 4, distance: '5m', divisionCode: 'BU10W', divisionName: 'Barebow U10 Women', phase: '1/4 Final', targetFace: 'Complete 122cm (1-10 +X)', themeColor: '#db2777' },
              { targetStart: 9, targetEnd: 12, targetCount: 4, distance: '10m', divisionCode: 'BU13M', divisionName: 'Barebow U13 Men', phase: '1/4 Final', targetFace: 'Complete 122cm (1-10 +X)', themeColor: '#ca8a04' },
              { targetStart: 13, targetEnd: 16, targetCount: 4, distance: '10m', divisionCode: 'BU13W', divisionName: 'Barebow U13 Women', phase: '1/4 Final', targetFace: 'Complete 122cm (1-10 +X)', themeColor: '#4f46e5' },
              { targetStart: 17, targetEnd: 20, targetCount: 4, distance: '10m', divisionCode: 'NU10M', divisionName: 'Nasional U10 Men', phase: '1/4 Final', targetFace: 'Reduced 80cm (5-10 +X)', themeColor: '#ea580c' },
              { targetStart: 21, targetEnd: 24, targetCount: 4, distance: '10m', divisionCode: 'NU10W', divisionName: 'Nasional U10 Women', phase: '1/4 Final', targetFace: 'Reduced 80cm (5-10 +X)', themeColor: '#65a30d' },
              { targetStart: 25, targetEnd: 28, targetCount: 4, distance: '20m', divisionCode: 'NU13M', divisionName: 'Nasional U13 Men', phase: '1/4 Final', targetFace: 'Reduced 80cm (5-10 +X)', themeColor: '#0891b2' },
              { targetStart: 29, targetEnd: 32, targetCount: 4, distance: '20m', divisionCode: 'NU13W', divisionName: 'Nasional U13 Women', phase: '1/4 Final', targetFace: 'Reduced 80cm (5-10 +X)', themeColor: '#e11d48' }
            ]
          },
          {
            time: '13:45 - 14:15',
            title: 'Babak Semifinal (1/2 Final)',
            matchType: 'Individual Semifinals',
            format: '5 ends of 3 arrows',
            targetCount: 32,
            targetFaceSpans: [
              { start: 1, end: 16, label: 'Complete (1 - 10 +X) 122 cm' },
              { start: 17, end: 32, label: 'Reduced (5 - 10 +X) 80 cm' }
            ],
            blocks: [
              { targetStart: 1, targetEnd: 2, targetCount: 2, distance: '5m', divisionCode: 'BU10M', divisionName: 'Barebow U10 Men', phase: '1/2 Semifinal', targetFace: 'Complete 122cm', themeColor: '#16a34a' },
              { targetStart: 3, targetEnd: 4, targetCount: 2, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true },
              { targetStart: 5, targetEnd: 6, targetCount: 2, distance: '5m', divisionCode: 'BU10W', divisionName: 'Barebow U10 Women', phase: '1/2 Semifinal', targetFace: 'Complete 122cm', themeColor: '#db2777' },
              { targetStart: 7, targetEnd: 8, targetCount: 2, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true },
              { targetStart: 9, targetEnd: 10, targetCount: 2, distance: '10m', divisionCode: 'BU13M', divisionName: 'Barebow U13 Men', phase: '1/2 Semifinal', targetFace: 'Complete 122cm', themeColor: '#ca8a04' },
              { targetStart: 11, targetEnd: 12, targetCount: 2, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true },
              { targetStart: 13, targetEnd: 14, targetCount: 2, distance: '10m', divisionCode: 'BU13W', divisionName: 'Barebow U13 Women', phase: '1/2 Semifinal', targetFace: 'Complete 122cm', themeColor: '#4f46e5' },
              { targetStart: 15, targetEnd: 18, targetCount: 4, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true },
              { targetStart: 19, targetEnd: 20, targetCount: 2, distance: '10m', divisionCode: 'NU10M', divisionName: 'Nasional U10 Men', phase: '1/2 Semifinal', targetFace: 'Reduced 80cm', themeColor: '#ea580c' },
              { targetStart: 21, targetEnd: 22, targetCount: 2, distance: '10m', divisionCode: 'NU10W', divisionName: 'Nasional U10 Women', phase: '1/2 Semifinal', targetFace: 'Reduced 80cm', themeColor: '#65a30d' },
              { targetStart: 23, targetEnd: 26, targetCount: 4, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true },
              { targetStart: 27, targetEnd: 28, targetCount: 2, distance: '20m', divisionCode: 'NU13M', divisionName: 'Nasional U13 Men', phase: '1/2 Semifinal', targetFace: 'Reduced 80cm', themeColor: '#0891b2' },
              { targetStart: 29, targetEnd: 30, targetCount: 2, distance: '20m', divisionCode: 'NU13W', divisionName: 'Nasional U13 Women', phase: '1/2 Semifinal', targetFace: 'Reduced 80cm', themeColor: '#e11d48' },
              { targetStart: 31, targetEnd: 32, targetCount: 2, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true }
            ]
          },
          {
            time: '14:15 - 14:45',
            title: 'Babak Final & Perebutan Medali (Gold & Bronze)',
            matchType: 'Individual Medal Matches',
            format: '5 ends of 3 arrows',
            targetCount: 32,
            targetFaceSpans: [
              { start: 1, end: 16, label: 'Complete (1 - 10 +X) 122 cm' },
              { start: 17, end: 32, label: 'Reduced (5 - 10 +X) 80 cm' }
            ],
            blocks: [
              { targetStart: 1, targetEnd: 1, targetCount: 1, distance: '5m', divisionCode: 'BU10M', divisionName: 'Barebow U10 Men', phase: 'Gold Match', medal: 'Gold', targetFace: 'Complete 122cm', themeColor: '#16a34a' },
              { targetStart: 2, targetEnd: 2, targetCount: 1, distance: '5m', divisionCode: 'BU10M', divisionName: 'Barebow U10 Men', phase: 'Bronze Match', medal: 'Bronze', targetFace: 'Complete 122cm', themeColor: '#16a34a' },
              { targetStart: 3, targetEnd: 3, targetCount: 1, distance: '5m', divisionCode: 'BU10W', divisionName: 'Barebow U10 Women', phase: 'Gold Match', medal: 'Gold', targetFace: 'Complete 122cm', themeColor: '#db2777' },
              { targetStart: 4, targetEnd: 4, targetCount: 1, distance: '5m', divisionCode: 'BU10W', divisionName: 'Barebow U10 Women', phase: 'Bronze Match', medal: 'Bronze', targetFace: 'Complete 122cm', themeColor: '#db2777' },
              { targetStart: 5, targetEnd: 8, targetCount: 4, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true },
              { targetStart: 9, targetEnd: 9, targetCount: 1, distance: '10m', divisionCode: 'BU13M', divisionName: 'Barebow U13 Men', phase: 'Gold Match', medal: 'Gold', targetFace: 'Complete 122cm', themeColor: '#ca8a04' },
              { targetStart: 10, targetEnd: 10, targetCount: 1, distance: '10m', divisionCode: 'BU13M', divisionName: 'Barebow U13 Men', phase: 'Bronze Match', medal: 'Bronze', targetFace: 'Complete 122cm', themeColor: '#ca8a04' },
              { targetStart: 11, targetEnd: 11, targetCount: 1, distance: '10m', divisionCode: 'BU13W', divisionName: 'Barebow U13 Women', phase: 'Gold Match', medal: 'Gold', targetFace: 'Complete 122cm', themeColor: '#4f46e5' },
              { targetStart: 12, targetEnd: 12, targetCount: 1, distance: '10m', divisionCode: 'BU13W', divisionName: 'Barebow U13 Women', phase: 'Bronze Match', medal: 'Bronze', targetFace: 'Complete 122cm', themeColor: '#4f46e5' },
              { targetStart: 13, targetEnd: 18, targetCount: 6, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true },
              { targetStart: 19, targetEnd: 19, targetCount: 1, distance: '10m', divisionCode: 'NU10M', divisionName: 'Nasional U10 Men', phase: 'Gold Match', medal: 'Gold', targetFace: 'Reduced 80cm', themeColor: '#ea580c' },
              { targetStart: 20, targetEnd: 20, targetCount: 1, distance: '10m', divisionCode: 'NU10M', divisionName: 'Nasional U10 Men', phase: 'Bronze Match', medal: 'Bronze', targetFace: 'Reduced 80cm', themeColor: '#ea580c' },
              { targetStart: 21, targetEnd: 21, targetCount: 1, distance: '10m', divisionCode: 'NU10W', divisionName: 'Nasional U10 Women', phase: 'Gold Match', medal: 'Gold', targetFace: 'Reduced 80cm', themeColor: '#65a30d' },
              { targetStart: 22, targetEnd: 22, targetCount: 1, distance: '10m', divisionCode: 'NU10W', divisionName: 'Nasional U10 Women', phase: 'Bronze Match', medal: 'Bronze', targetFace: 'Reduced 80cm', themeColor: '#65a30d' },
              { targetStart: 23, targetEnd: 26, targetCount: 4, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true },
              { targetStart: 27, targetEnd: 27, targetCount: 1, distance: '20m', divisionCode: 'NU13M', divisionName: 'Nasional U13 Men', phase: 'Gold Match', medal: 'Gold', targetFace: 'Reduced 80cm', themeColor: '#0891b2' },
              { targetStart: 28, targetEnd: 28, targetCount: 1, distance: '20m', divisionCode: 'NU13M', divisionName: 'Nasional U13 Men', phase: 'Bronze Match', medal: 'Bronze', targetFace: 'Reduced 80cm', themeColor: '#0891b2' },
              { targetStart: 29, targetEnd: 29, targetCount: 1, distance: '20m', divisionCode: 'NU13W', divisionName: 'Nasional U13 Women', phase: 'Gold Match', medal: 'Gold', targetFace: 'Reduced 80cm', themeColor: '#e11d48' },
              { targetStart: 30, targetEnd: 30, targetCount: 1, distance: '20m', divisionCode: 'NU13W', divisionName: 'Nasional U13 Women', phase: 'Bronze Match', medal: 'Bronze', targetFace: 'Reduced 80cm', themeColor: '#e11d48' },
              { targetStart: 31, targetEnd: 32, targetCount: 2, distance: '', divisionCode: '', divisionName: 'Kosong (Unused)', phase: '', targetFace: '', isEmpty: true }
            ]
          }
        ]
      }
    ]
  }

  // 1. If live scraped FOP data is available, parse and format it
  if (Array.isArray(props.fopData) && props.fopData.length > 0) {
    return props.fopData.map((d, dIdx) => ({
      label: d.date_label || d.day_name || d.date || `Day ${dIdx + 1}`,
      date: d.date_label || d.date || '',
      sessions: (d.sessions || []).map((s, sIdx) => ({
        time: s.time_slot || s.time || '08:00 - 11:00',
        title: s.session_type || s.name || s.session_name || `Session ${sIdx + 1}`,
        matchType: s.session_type || s.type || 'Competition Round',
        format: s.notes || s.format || 'Official Match',
        targetCount: s.target_max ? (s.target_max - (s.target_min || 1) + 1) : 32,
        targetFaceSpans: [
          { start: s.target_min || 1, end: s.target_max || 32, label: s.target_face || 'Standard Target Face' }
        ],
        blocks: (s.allocations && s.allocations.length > 0)
          ? s.allocations.map(a => ({
              targetStart: a.target_from,
              targetEnd: a.target_to,
              targetCount: a.target_to - a.target_from + 1,
              distance: a.distance || a.dist || '',
              divisionCode: a.category || a.cat || '',
              divisionName: a.category || a.cat || 'Official Category',
              phase: a.phase || '',
              targetFace: s.target_face || '',
              themeColor: '#16a34a'
            }))
          : [
              {
                targetStart: s.target_min || 1,
                targetEnd: s.target_max || 32,
                targetCount: s.target_max ? (s.target_max - (s.target_min || 1) + 1) : 32,
                distance: s.distance || '50m',
                divisionCode: s.division || 'OPEN',
                divisionName: s.division_name || 'Open Division',
                phase: s.phase || 'Match Round',
                targetFace: s.target_face || 'Complete 122cm',
                themeColor: '#16a34a'
              }
            ]
      }))
    }))
  }

  // 2. Check for explicit tournament preset only if matched specifically
  const resolvedPreset = presets[tId] || presets[String(props.tournament?.slug)]
  if (resolvedPreset) {
    return resolvedPreset
  }

  return []
})

const currentDay = computed(() => {
  return formattedFopDays.value[selectedDayIdx.value] || formattedFopDays.value[0]
})

const currentDaySessions = computed(() => {
  return currentDay.value?.sessions || []
})

const activeSession = computed(() => {
  return currentDaySessions.value[selectedSessionIdx.value] || currentDaySessions.value[0] || {
    time: '13:15 - 13:45',
    title: 'Babak Perempat Final (1/4 Final)',
    matchType: 'Individual Matches',
    format: '5 ends of 3 arrows',
    targetCount: 32,
    blocks: []
  }
})

// Build flat array of 32 lane targets for matrix table & canvas
const sessionLanes = computed(() => {
  const session = activeSession.value
  const targetCount = session.targetCount || 32
  const lanes = []

  for (let i = 1; i <= targetCount; i++) {
    const block = session.blocks.find(b => i >= b.targetStart && i <= b.targetEnd) || {}
    lanes.push({
      targetNumber: i,
      distance: block.distance || '',
      divisionCode: block.divisionCode || '',
      divisionName: block.divisionName || '',
      phase: block.phase || '',
      medal: block.medal || null,
      isEmpty: !!block.isEmpty,
      targetFace: block.targetFace || '',
      themeColor: block.themeColor || '#16a34a'
    })
  }

  return lanes
})

// ─────────────────────────────────────────────────────────────
// CANVAS RENDERING ENGINE (2.5D ISOMETRIC ARENA - LIGHT THEME)
// ─────────────────────────────────────────────────────────────
const canvasRef = ref(null)
let ctx = null
let animationFrameId = null
let dpr = 1

const camera = {
  x: 0,
  y: 0,
  zoom: 1,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0
}

const hoveredTarget = ref(null)
const mousePos = { x: 0, y: 0 }
const arrows = ref([])
let renderedTargetHitboxes = []

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
  startRenderLoop()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})

watch([selectedDayIdx, selectedSessionIdx, () => props.tournament?.id], () => {
  selectedTargetInfo.value = null
  resetCamera()
})

function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d', { alpha: false })
  dpr = window.devicePixelRatio || 1
  handleResize()
  resetCamera()
}

function handleResize() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
}

function resetCamera() {
  camera.x = 0
  camera.y = 0
  camera.zoom = 1
}

function focusOnTarget(targetNum) {
  const session = activeSession.value
  const targetCount = session.targetCount || 32
  const canvas = canvasRef.value
  if (!canvas) return
  
  const width = canvas.width / dpr
  const height = canvas.height / dpr
  const paddingX = 70
  const slotWidth = (width - paddingX * 2) / targetCount
  const targetCenterX = paddingX + (targetNum - 0.5) * slotWidth
  
  const block = session.blocks.find(b => targetNum >= b.targetStart && targetNum <= b.targetEnd) || session.blocks[0] || {}
  const distNum = parseInt(block.distance) || 10
  const shootY = height - 95
  const targetCenterY = shootY - 40 - Math.min(270, (distNum / 70) * 250)
  
  camera.zoom = 1.65
  camera.x = (width / 2) - (targetCenterX * camera.zoom)
  camera.y = (height / 2) - (targetCenterY * camera.zoom)
}

function triggerArrowSalvo() {
  const canvas = canvasRef.value
  if (!canvas) return
  const session = activeSession.value
  const targetCount = session.targetCount || 32
  const width = canvas.width / dpr
  const height = canvas.height / dpr
  const paddingX = 70
  const slotWidth = (width - paddingX * 2) / targetCount
  
  arrows.value = []
  const shootY = height - 95

  for (let i = 1; i <= targetCount; i++) {
    const block = session.blocks.find(b => i >= b.targetStart && i <= b.targetEnd) || {}
    if (block.isEmpty) continue // Do not shoot at empty targets

    const tx = paddingX + (i - 0.5) * slotWidth
    const distNum = parseInt(block.distance) || 10
    const targetY = shootY - 40 - Math.min(270, (distNum / 70) * 250)

    arrows.value.push({
      startX: tx - 4,
      startY: shootY - 6,
      targetX: tx - 2 + (Math.random() * 4 - 2),
      targetY: targetY + (Math.random() * 4 - 2),
      progress: 0,
      speed: 0.02 + Math.random() * 0.012,
      arcHeight: 25 + (distNum / 70) * 45,
      color: '#0284c7'
    })

    arrows.value.push({
      startX: tx + 4,
      startY: shootY - 6,
      targetX: tx + 2 + (Math.random() * 4 - 2),
      targetY: targetY + (Math.random() * 4 - 2),
      progress: 0,
      speed: 0.02 + Math.random() * 0.012,
      arcHeight: 25 + (distNum / 70) * 45,
      color: '#d97706'
    })
  }
}

function exportCanvasImage() {
  const canvas = canvasRef.value
  if (!canvas) return
  const link = document.createElement('a')
  link.download = `Field_of_Play_${props.tournament?.name || 'Archery'}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// ─────────────────────────────────────────────────────────────
// RENDER LOOP & 2.5D ISOMETRIC STADIUM DRAW (LIGHT THEME)
// ─────────────────────────────────────────────────────────────
function startRenderLoop() {
  const render = () => {
    if (ctx && canvasRef.value) {
      renderScene()
    }
    animationFrameId = requestAnimationFrame(render)
  }
  animationFrameId = requestAnimationFrame(render)
}

function renderScene() {
  const canvas = canvasRef.value
  const width = canvas.width / dpr
  const height = canvas.height / dpr

  ctx.save()
  ctx.scale(dpr, dpr)

  // 1. Clean Daytime Sky Gradient Background (Screen Space)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.4)
  skyGrad.addColorStop(0, '#e0f2fe') // Sky light blue
  skyGrad.addColorStop(1, '#f1f5f9') // Slate 100
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, width, height)

  // 2. Camera Space Transformation
  ctx.save()
  ctx.translate(camera.x, camera.y)
  ctx.scale(camera.zoom, camera.zoom)

  renderedTargetHitboxes = []

  renderIsometricStadiumSceneLight(width, height)
  renderParabolicArrows()

  ctx.restore()

  // 3. Static HUD Overlays (Screen Space)
  renderHUDOverlaysLight(width, height)
  ctx.restore()
}

function renderIsometricStadiumSceneLight(width, height) {
  const session = activeSession.value
  const targetCount = session.targetCount || 32
  const paddingX = 70
  const usableWidth = width - (paddingX * 2)
  const slotWidth = usableWidth / targetCount

  const fieldTopY = 114
  const shootY = height - 95
  const waitLineY = height - 45
  const leftSideline = paddingX - 16
  const rightSideline = width - paddingX + 16

  // Expansive World Boundaries so zooming/panning never shows cut-offs
  const worldLeft = -2500
  const worldRight = width + 2500
  const worldWidth = worldRight - worldLeft
  const worldBottom = height + 2000

  // 1. Vast Sky Horizon in World Space
  const skyWorldGrad = ctx.createLinearGradient(0, -1200, 0, fieldTopY)
  skyWorldGrad.addColorStop(0, '#bae6fd')
  skyWorldGrad.addColorStop(1, '#e0f2fe')
  ctx.fillStyle = skyWorldGrad
  ctx.fillRect(worldLeft, -1200, worldWidth, 1200 + fieldTopY)

  // 2. Distant Arena Perimeter Wall / Stadium Backdrop
  ctx.fillStyle = '#cbd5e1'
  ctx.fillRect(worldLeft, fieldTopY - 14, worldWidth, 14)
  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(worldLeft, fieldTopY - 3, worldWidth, 3)

  // 3. Vibrant Lush Natural Turf Gradient (Expansive)
  const turfGrad = ctx.createLinearGradient(0, fieldTopY, 0, height)
  turfGrad.addColorStop(0, '#15803d') // Emerald 700
  turfGrad.addColorStop(0.4, '#16a34a') // Emerald 600
  turfGrad.addColorStop(0.85, '#22c55e') // Emerald 500
  turfGrad.addColorStop(1, '#166534') // Emerald 800
  ctx.fillStyle = turfGrad
  ctx.fillRect(worldLeft, fieldTopY, worldWidth, worldBottom - fieldTopY)

  // Mowing Stripes (Expansive)
  const stripeW = 48
  for (let sx = worldLeft; sx < worldRight; sx += stripeW) {
    ctx.fillStyle = (Math.floor(sx / stripeW) % 2 === 0) ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
    ctx.beginPath()
    ctx.moveTo(sx, fieldTopY)
    ctx.lineTo(sx + 35, worldBottom)
    ctx.lineTo(sx + 35 + stripeW, worldBottom)
    ctx.lineTo(sx + stripeW, fieldTopY)
    ctx.closePath()
    ctx.fill()
  }

  // 4. White Sideline Field Perimeter Boundaries
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(leftSideline, fieldTopY)
  ctx.lineTo(leftSideline, height + 100)
  ctx.moveTo(rightSideline, fieldTopY)
  ctx.lineTo(rightSideline, height + 100)
  ctx.moveTo(leftSideline, fieldTopY)
  ctx.lineTo(rightSideline, fieldTopY)
  ctx.stroke()

  // Corner Cones / Boundary Markers
  const corners = [
    [leftSideline, fieldTopY],
    [rightSideline, fieldTopY],
    [leftSideline, shootY],
    [rightSideline, shootY]
  ]
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#f97316' // Vibrant Orange Cone
    ctx.beginPath()
    ctx.arc(cx, cy, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.2
    ctx.stroke()
  })

  // 5. Isometric Lane Divider Guidelines
  for (let i = 0; i <= targetCount; i++) {
    const laneX = paddingX + i * slotWidth
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(laneX, fieldTopY + 10)
    ctx.lineTo(laneX + (i - targetCount / 2) * 0.35, shootY)
    ctx.stroke()
  }

  // 6. Stenciled Isometric Distance Yardlines (5m, 10m, 20m, 30m, 50m, 70m)
  const distanceStencils = [5, 10, 20, 30, 50, 70]
  distanceStencils.forEach((m) => {
    const distY = shootY - 40 - Math.min(270, (m / 70) * 250)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
    ctx.lineWidth = 1.2
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.moveTo(leftSideline, distY)
    ctx.lineTo(rightSideline, distY)
    ctx.stroke()
    ctx.setLineDash([])

    // Distance Badge on field borders (White pill with navy text)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(leftSideline - 28, distY - 7, 24, 14, 4)
    ctx.roundRect(rightSideline + 4, distY - 7, 24, 14, 4)
    ctx.fill()
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.15)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#0f172a'
    ctx.font = '700 8.5px "NovaText", -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${m}m`, leftSideline - 16, distY + 3)
    ctx.fillText(`${m}m`, rightSideline + 16, distY + 3)
  })

  // 7. Modern Light Grandstand Canopy & Banner at Top
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)'
  ctx.beginPath()
  ctx.roundRect(leftSideline, 50, rightSideline - leftSideline, 50, 12)
  ctx.fill()
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.fillStyle = '#0f172a'
  ctx.font = '800 11.5px "Bricolage Grotesque", -apple-system, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('🏛️ Field of Play Arena', leftSideline + 16, 68)

  ctx.fillStyle = '#64748b'
  ctx.font = '600 9px "NovaText", -apple-system, sans-serif'
  const tName = props.tournament?.name || 'Turnamen Panahan'
  ctx.fillText(`${tName} • Sesi: ${session.time} • ${session.title}`, leftSideline + 16, 84)

  // 8. Category Division Color Headers
  let curX = paddingX
  session.blocks.forEach((block) => {
    const blockW = block.targetCount * slotWidth
    if (!block.isEmpty) {
      ctx.fillStyle = block.themeColor || '#16a34a'
      ctx.beginPath()
      ctx.roundRect(curX + 1, fieldTopY - 8, blockW - 2, 16, 4)
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = '700 8.5px "Bricolage Grotesque", -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${block.divisionCode}`, curX + blockW / 2, fieldTopY + 3)
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.beginPath()
      ctx.roundRect(curX + 1, fieldTopY - 8, blockW - 2, 16, 4)
      ctx.fill()
    }

    curX += blockW
  })

  // 9. Waiting Line & Area (Extended seamless track)
  ctx.fillStyle = '#14532d'
  ctx.fillRect(worldLeft, waitLineY, worldWidth, worldBottom - waitLineY)

  ctx.strokeStyle = '#facc15'
  ctx.lineWidth = 2.5
  ctx.setLineDash([8, 6])
  ctx.beginPath()
  ctx.moveTo(worldLeft, waitLineY)
  ctx.lineTo(worldRight, waitLineY)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#fef08a'
  ctx.font = '700 8.5px "NovaText", -apple-system, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Garis Tunggu (Waiting Line)', leftSideline, waitLineY - 5)

  // 10. Shooting Line (Solid Luminous White)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3.5
  ctx.beginPath()
  ctx.moveTo(leftSideline - 20, shootY)
  ctx.lineTo(rightSideline + 20, shootY)
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 8.5px "NovaText", -apple-system, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Garis Tembak (Shooting Line)', leftSideline, shootY + 15)

  // 11. Target Face Span Indicator Brackets at Bottom
  const spans = session.targetFaceSpans || defaultTargetFaceSpans
  spans.forEach(span => {
    const spanStartX = paddingX + (span.start - 1) * slotWidth
    const spanEndX = paddingX + span.end * slotWidth
    const spanW = spanEndX - spanStartX
    const spanY = waitLineY + 22

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.beginPath()
    ctx.roundRect(spanStartX + 2, spanY, spanW - 4, 16, 4)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = '700 7.5px "NovaText", -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(span.label, spanStartX + spanW / 2, spanY + 11)
  })

  // 12. 3D Target Butts & Archers
  for (let i = 1; i <= targetCount; i++) {
    const targetCenterX = paddingX + (i - 0.5) * slotWidth
    const block = session.blocks.find(b => i >= b.targetStart && i <= b.targetEnd) || {}
    const isHovered = hoveredTarget.value === i
    const buttR = isHovered ? 13 : 10

    if (block.isEmpty) {
      // Draw subtle inactive/empty tripod stand
      const emptyY = shootY - 80
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.35)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(targetCenterX - 6, emptyY + 12)
      ctx.lineTo(targetCenterX, emptyY)
      ctx.lineTo(targetCenterX + 6, emptyY + 12)
      ctx.stroke()

      // Small faint empty circle
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(targetCenterX, emptyY - 2, 7, 0, Math.PI * 2)
      ctx.stroke()

      // Number plate
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
      ctx.beginPath()
      ctx.roundRect(targetCenterX - 7, emptyY - 20, 14, 10, 2)
      ctx.fill()
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = '#64748b'
      ctx.font = '700 7.5px "Bricolage Grotesque", -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${i}`, targetCenterX, emptyY - 12)

      renderedTargetHitboxes.push({
        targetNumber: i,
        x: targetCenterX,
        y: emptyY,
        radius: buttR + 4,
        divisionCode: 'KOSONG',
        divisionName: 'Bantalan Kosong (Tidak Ada Match)',
        distance: '-',
        phase: 'Kosong',
        targetFace: '-',
        isEmpty: true
      })
      continue
    }

    const distNum = parseInt(block.distance) || 10
    const targetY = shootY - 40 - Math.min(270, (distNum / 70) * 250)

    if (isHovered) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
      ctx.beginPath()
      ctx.moveTo(targetCenterX - slotWidth * 0.45, shootY)
      ctx.lineTo(targetCenterX + slotWidth * 0.45, shootY)
      ctx.lineTo(targetCenterX + 12, targetY)
      ctx.lineTo(targetCenterX - 12, targetY)
      ctx.closePath()
      ctx.fill()
    }

    // Shadow on Grass
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
    ctx.beginPath()
    ctx.ellipse(targetCenterX + 7, targetY + 18, 13, 5, -0.15, 0, Math.PI * 2)
    ctx.fill()

    // 3D Wooden Stand Legs
    ctx.strokeStyle = '#78350f'
    ctx.lineWidth = 2.2
    ctx.beginPath()
    ctx.moveTo(targetCenterX - 8, targetY + 16)
    ctx.lineTo(targetCenterX, targetY)
    ctx.lineTo(targetCenterX + 8, targetY + 16)
    ctx.moveTo(targetCenterX, targetY)
    ctx.lineTo(targetCenterX + 5, targetY + 18)
    ctx.stroke()

    // 3D Target Foam Box
    ctx.fillStyle = '#334155'
    ctx.beginPath()
    ctx.ellipse(targetCenterX + 3, targetY - 2, buttR + 0.5, buttR + 0.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Front Face (World Archery 10-Ring)
    drawWorldArcheryTargetFaceLight(targetCenterX, targetY, buttR, isHovered)

    // Number Plate (Light Theme: White card with navy number)
    ctx.fillStyle = isHovered ? '#fde047' : '#ffffff'
    ctx.beginPath()
    ctx.roundRect(targetCenterX - 8, targetY - buttR - 13, 16, 11, 2.5)
    ctx.fill()
    ctx.strokeStyle = isHovered ? '#0f172a' : '#94a3b8'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#0f172a'
    ctx.font = '800 8.5px "Bricolage Grotesque", -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${i}`, targetCenterX, targetY - buttR - 4)

    // Medal Badge (Gold / Bronze)
    if (block.medal === 'Gold') {
      ctx.fillStyle = '#facc15' // Gold
      ctx.beginPath()
      ctx.roundRect(targetCenterX - 11, targetY - buttR - 25, 22, 10, 3)
      ctx.fill()
      ctx.strokeStyle = '#ca8a04'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = '#0f172a'
      ctx.font = '900 6.5px "Bricolage Grotesque", -apple-system, sans-serif'
      ctx.fillText('GOLD', targetCenterX, targetY - buttR - 17)
    } else if (block.medal === 'Bronze') {
      ctx.fillStyle = '#c2410c' // Bronze
      ctx.beginPath()
      ctx.roundRect(targetCenterX - 13, targetY - buttR - 25, 26, 10, 3)
      ctx.fill()
      ctx.strokeStyle = '#7c2d12'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = '#ffffff'
      ctx.font = '900 6.5px "Bricolage Grotesque", -apple-system, sans-serif'
      ctx.fillText('BRONZE', targetCenterX, targetY - buttR - 17)
    }

    // Wind Ribbon
    const flutter = Math.sin(Date.now() / 200 + i) * 3
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(targetCenterX + 8, targetY - buttR - 13)
    ctx.lineTo(targetCenterX + 13 + flutter, targetY - buttR - 16)
    ctx.stroke()

    // Distance Label below target
    ctx.fillStyle = '#ffffff'
    ctx.font = '700 7.5px "NovaText", -apple-system, sans-serif'
    ctx.fillText(`${block.distance || '50m'}`, targetCenterX, targetY + 26)

    // Archer A & B at shooting line
    ctx.fillStyle = '#0284c7' // Blue
    ctx.beginPath()
    ctx.arc(targetCenterX - 4, shootY - 4, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#d97706' // Amber
    ctx.beginPath()
    ctx.arc(targetCenterX + 4, shootY - 4, 3, 0, Math.PI * 2)
    ctx.fill()

    renderedTargetHitboxes.push({
      targetNumber: i,
      x: targetCenterX,
      y: targetY,
      radius: buttR + 8,
      divisionCode: block.divisionCode || 'OPEN',
      divisionName: block.divisionName || 'Open Division',
      distance: block.distance || '50m',
      phase: block.phase || 'Match',
      medal: block.medal || null,
      targetFace: block.targetFace || 'Complete 122cm',
      isEmpty: false
    })
  }
}

function drawWorldArcheryTargetFaceLight(cx, cy, radius, isHighlighted) {
  const rings = [
    { r: 1.0, color: '#f8fafc', stroke: '#cbd5e1' },
    { r: 0.8, color: '#0f172a', stroke: '#020617' },
    { r: 0.6, color: '#0284c7', stroke: '#0369a1' },
    { r: 0.4, color: '#dc2626', stroke: '#b91c1c' },
    { r: 0.2, color: '#facc15', stroke: '#eab308' }
  ]

  rings.forEach((ring) => {
    ctx.fillStyle = ring.color
    ctx.beginPath()
    ctx.arc(cx, cy, radius * ring.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = ring.stroke
    ctx.lineWidth = 0.5
    ctx.stroke()
  })

  ctx.fillStyle = '#92400e'
  ctx.beginPath()
  ctx.arc(cx, cy, radius * 0.06, 0, Math.PI * 2)
  ctx.fill()

  if (isHighlighted) {
    ctx.strokeStyle = '#0284c7'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2)
    ctx.stroke()
  }
}

function renderParabolicArrows() {
  if (arrows.value.length === 0) return

  for (let i = arrows.value.length - 1; i >= 0; i--) {
    const a = arrows.value[i]
    a.progress += a.speed

    const curX = a.startX + (a.targetX - a.startX) * a.progress
    const linearY = a.startY + (a.targetY - a.startY) * a.progress
    const arcOffset = Math.sin(a.progress * Math.PI) * a.arcHeight
    const curY = linearY - arcOffset

    ctx.strokeStyle = a.color
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(curX, curY)
    ctx.lineTo(curX, curY + 8)
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(curX, curY, 2.5, 0, Math.PI * 2)
    ctx.fill()

    if (a.progress >= 1) {
      arrows.value.splice(i, 1)
    }
  }
}

function renderHUDOverlaysLight(width, height) {
  if (hoveredTarget.value && mousePos.x && mousePos.y) {
    const hitbox = renderedTargetHitboxes.find(h => h.targetNumber === hoveredTarget.value)
    if (hitbox) {
      const tipX = Math.min(width - 180, mousePos.x + 15)
      const tipY = Math.max(50, mousePos.y - 50)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'
      ctx.beginPath()
      ctx.roundRect(tipX, tipY, 175, 52, 8)
      ctx.fill()
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1.2
      ctx.stroke()

      ctx.fillStyle = '#0f172a'
      ctx.font = '800 11px "Bricolage Grotesque", -apple-system, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`Target Butt #${hitbox.targetNumber} ${hitbox.distance !== '-' ? '(' + hitbox.distance + ')' : ''}`, tipX + 10, tipY + 18)

      ctx.fillStyle = hitbox.isEmpty ? '#94a3b8' : '#0284c7'
      ctx.font = '600 9.5px "NovaText", -apple-system, sans-serif'
      ctx.fillText(`${hitbox.divisionCode} • ${hitbox.phase}`, tipX + 10, tipY + 32)

      ctx.fillStyle = '#64748b'
      ctx.font = '500 8.5px "NovaText", -apple-system, sans-serif'
      ctx.fillText(hitbox.isEmpty ? 'Bantalan tidak aktif sesi ini' : 'Click to inspect full lane', tipX + 10, tipY + 44)
    }
  }
}

function handleMouseDown(e) {
  camera.isDragging = true
  camera.dragStartX = e.clientX - camera.x
  camera.dragStartY = e.clientY - camera.y
}

function handleMouseMove(e) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mousePos.x = e.clientX - rect.left
  mousePos.y = e.clientY - rect.top

  if (camera.isDragging) {
    camera.x = e.clientX - camera.dragStartX
    camera.y = e.clientY - camera.dragStartY
    return
  }

  const worldX = (mousePos.x - camera.x) / camera.zoom
  const worldY = (mousePos.y - camera.y) / camera.zoom

  let foundHover = null
  for (const h of renderedTargetHitboxes) {
    const dx = worldX - h.x
    const dy = worldY - h.y
    if (Math.sqrt(dx * dx + dy * dy) <= h.radius) {
      foundHover = h.targetNumber
      break
    }
  }
  hoveredTarget.value = foundHover
}

function handleMouseUp() {
  camera.isDragging = false
}

function handleMouseLeave() {
  camera.isDragging = false
  hoveredTarget.value = null
}

function handleWheel(e) {
  e.preventDefault()
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88
  const newZoom = Math.max(0.6, Math.min(3.5, camera.zoom * zoomFactor))

  if (newZoom !== camera.zoom) {
    camera.x = mouseX - (mouseX - camera.x) * (newZoom / camera.zoom)
    camera.y = mouseY - (mouseY - camera.y) * (newZoom / camera.zoom)
    camera.zoom = newZoom
  }
}

function handleCanvasClick(e) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  const worldX = (clickX - camera.x) / camera.zoom
  const worldY = (clickY - camera.y) / camera.zoom

  for (const h of renderedTargetHitboxes) {
    const dx = worldX - h.x
    const dy = worldY - h.y
    if (Math.sqrt(dx * dx + dy * dy) <= h.radius) {
      if (!h.isEmpty) {
        selectedTargetInfo.value = h
      }
      return
    }
  }
}
</script>
