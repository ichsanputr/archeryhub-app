<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 font-body antialiased selection:bg-primary/30 selection:text-primary">
    <!-- Top Header Bar -->
    <header class="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 sm:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <NuxtLink to="/tournaments/27311" class="size-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer">
          <Icon icon="ph:arrow-left-bold" class="text-base" />
        </NuxtLink>
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
              2.5D Isometric Arena
            </span>
            <h1 class="text-base sm:text-lg font-black text-white font-display">
              Field of Play (FOP) 3D Stadium Visualizer
            </h1>
          </div>
          <div class="text-xs text-slate-400">
            Visualisasi Lapangan Panahan Isometrik 2.5D dengan Kedalaman Spasial, Tripod 3D, & Garis Tembak Realistis
          </div>
        </div>
      </div>

      <!-- Quick Actions Toolbar -->
      <div class="flex items-center gap-2">
        <button
          @click="resetCamera"
          class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Icon icon="ph:arrows-counter-clockwise-bold" class="text-xs" />
          <span>Reset View</span>
        </button>

        <button
          @click="triggerArrowSalvo"
          class="px-3.5 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/10"
        >
          <Icon icon="ph:play-bold" class="text-xs" />
          <span>Simulate Salvo</span>
        </button>

        <button
          @click="exportCanvasImage"
          class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Icon icon="ph:download-simple-bold" class="text-xs" />
          <span>Export PNG</span>
        </button>
      </div>
    </header>

    <!-- Sub-Navbar: Tournament & Session Selector -->
    <div class="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Tournament Selector -->
        <div class="flex items-center gap-2">
          <span class="text-slate-400 font-semibold">Tournament:</span>
          <select 
            v-model="selectedTournamentId"
            class="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:border-primary text-xs cursor-pointer"
          >
            <option value="27311">Riau Open Archery Competition 2026 (32 Targets)</option>
            <option value="29375">Liga Panahan Kendal 2026 (28 Targets)</option>
            <option value="28570">USM National Championship (32 Targets)</option>
          </select>
        </div>

        <!-- Day Selector -->
        <div class="flex items-center gap-2">
          <span class="text-slate-400 font-semibold">Day:</span>
          <div class="flex items-center gap-1 bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            <button
              v-for="(day, dIdx) in currentTournamentData.days"
              :key="day.date"
              @click="selectedDayIndex = dIdx"
              :class="[
                'px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer',
                selectedDayIndex === dIdx ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              ]"
            >
              {{ day.label }}
            </button>
          </div>
        </div>

        <!-- Session Selector -->
        <div class="flex items-center gap-2">
          <span class="text-slate-400 font-semibold">Session:</span>
          <select
            v-model="selectedSessionIndex"
            class="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 font-bold focus:outline-none focus:border-primary text-xs cursor-pointer"
          >
            <option v-for="(session, sIdx) in currentDay.sessions" :key="sIdx" :value="sIdx">
              {{ session.time }} — {{ session.title }} ({{ session.matchType }})
            </option>
          </select>
        </div>
      </div>

      <!-- Quick Session Meta Info -->
      <div class="flex items-center gap-3 text-[11px] text-slate-400">
        <div class="flex items-center gap-1.5">
          <Icon icon="ph:clock-bold" class="text-primary" />
          <span class="font-mono text-slate-200">{{ currentSession.time }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <Icon icon="ph:crosshair-bold" class="text-primary" />
          <span class="text-slate-200 font-bold">{{ currentSession.targetCount }} Target Butts</span>
        </div>
        <div class="flex items-center gap-1.5">
          <Icon icon="ph:arrows-out-line-horizontal-bold" class="text-primary" />
          <span class="text-slate-200">{{ currentSession.format }}</span>
        </div>
      </div>
    </div>

    <!-- Main Workspace -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <!-- Canvas 3D Stadium Container -->
      <div class="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <!-- Canvas Element -->
        <canvas
          ref="canvasRef"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseLeave"
          @wheel="handleWheel"
          @click="handleCanvasClick"
          class="w-full h-[620px] cursor-grab active:cursor-grabbing block select-none"
        ></canvas>

        <!-- Floating Target Inspector Popover (when a target is clicked) -->
        <div
          v-if="selectedTargetInfo"
          class="absolute bottom-5 left-5 max-w-sm bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-xs space-y-3 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div class="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div class="flex items-center gap-2.5">
              <span class="size-7 rounded-xl bg-primary text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-primary/20">
                #{{ selectedTargetInfo.targetNumber }}
              </span>
              <div>
                <div class="font-bold text-white text-sm">Target Butt {{ selectedTargetInfo.targetNumber }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ selectedTargetInfo.distance }} Range Distance</div>
              </div>
            </div>
            <button @click="selectedTargetInfo = null" class="size-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
              <Icon icon="ph:x-bold" class="text-xs" />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div class="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
              <div class="text-slate-400 text-[10px]">Division</div>
              <div class="font-bold text-white truncate mt-0.5">{{ selectedTargetInfo.divisionName }}</div>
              <div class="text-[10px] text-primary font-mono font-bold">{{ selectedTargetInfo.divisionCode }}</div>
            </div>
            <div class="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
              <div class="text-slate-400 text-[10px]">Phase & Match</div>
              <div class="font-bold text-amber-400 mt-0.5">{{ selectedTargetInfo.phase }}</div>
              <div class="text-[10px] text-slate-400">{{ currentSession.format }}</div>
            </div>
          </div>

          <div class="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-slate-400">Target Face:</span>
              <span class="font-bold text-slate-200">{{ selectedTargetInfo.targetFace }}</span>
            </div>
            <div class="flex items-center justify-between text-[10px] border-t border-slate-800/80 pt-1.5">
              <span class="text-slate-400">Flight Slots:</span>
              <div class="flex items-center gap-1 font-mono">
                <span class="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 font-bold border border-sky-800/60">A: Archer 1</span>
                <span class="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 font-bold border border-amber-800/60">B: Archer 2</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Top-Left Status Bar -->
        <div class="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-3 z-10 pointer-events-none shadow-lg">
          <div class="flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-mono font-bold text-white">{{ currentSession.targetCount }} Lanes Ready</span>
          </div>
          <span class="text-slate-600">|</span>
          <div class="flex items-center gap-1.5">
            <Icon icon="ph:cursor-click-bold" class="text-primary text-xs" />
            <span>Click Butt to Inspect</span>
          </div>
          <span class="text-slate-600">|</span>
          <div class="flex items-center gap-1.5">
            <Icon icon="ph:mouse-scroll-bold" class="text-primary text-xs" />
            <span>Pan & Zoom</span>
          </div>
        </div>

        <!-- Floating Top-Right Environmental Gauge -->
        <div class="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-3 z-10 shadow-lg">
          <div class="flex items-center gap-1.5">
            <Icon icon="ph:wind-bold" class="text-cyan-400 text-xs" />
            <span class="font-mono text-cyan-200 font-bold">1.2 m/s ↗</span>
          </div>
          <span class="text-slate-600">|</span>
          <div class="flex items-center gap-1.5">
            <Icon icon="ph:sun-dim-bold" class="text-amber-400 text-xs" />
            <span class="text-slate-200">29°C Clear</span>
          </div>
        </div>
      </div>

      <!-- Contested Divisions Summary Cards -->
      <div class="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="size-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <Icon icon="ph:squares-four-bold" class="text-base" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-white font-display">
                Divisi & Alokasi Bantalan Target Sesi Ini
              </h3>
              <div class="text-xs text-slate-400">
                Klik kartu divisi untuk memusatkan kamera ke bantalan target yang bersangkutan
              </div>
            </div>
          </div>
          <span class="text-xs text-slate-400 font-mono bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60">
            {{ currentSession.blocks.length }} Kategori Aktif
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          <div
            v-for="(block, bIdx) in currentSession.blocks"
            :key="bIdx"
            @click="focusOnTarget(block.targetStart)"
            class="bg-slate-950/70 hover:bg-slate-800/60 p-4 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-2.5 group cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 font-mono font-black text-xs">
                Target {{ block.targetStart }} - {{ block.targetEnd }}
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs font-mono">
                {{ block.distance }}
              </span>
            </div>

            <div>
              <div class="font-bold text-white text-xs group-hover:text-primary transition-colors line-clamp-1">
                {{ block.divisionName }}
              </div>
              <div class="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                <span>{{ block.divisionCode }}</span>
                <span>•</span>
                <span>{{ block.phase }}</span>
              </div>
            </div>

            <div class="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span class="truncate">{{ block.targetFace }}</span>
              <span class="text-primary font-bold">{{ block.targetCount }} Butts</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

definePageMeta({
  title: 'Field of Play (FOP) 3D Stadium Visualizer',
  description: 'Revamped 2.5D Isometric Stadium Arena Field of Play Visualizer'
})

// ─────────────────────────────────────────────────────────────
// STATE & TOURNAMENTS
// ─────────────────────────────────────────────────────────────
const selectedTournamentId = ref('27311')
const selectedDayIndex = ref(0)
const selectedSessionIndex = ref(0)
const selectedTargetInfo = ref(null)

// ─────────────────────────────────────────────────────────────
// MOCK DATA STRUCTURED FROM REAL IANSEO FOP PDFS (27311, 29375, 28570)
// ─────────────────────────────────────────────────────────────
const fopTournamentStore = {
  '27311': {
    name: 'Riau Open Archery Competition 2026',
    organizer: 'Pengprov Perpani Riau',
    days: [
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
            targetFaceMain: 'Complete 122cm & Reduced 80cm',
            blocks: [
              { targetStart: 1, targetEnd: 4, targetCount: 4, distance: '5m', divisionCode: 'BU10M', divisionName: 'Barebow U10 Men', phase: '1/4 Final', targetFace: 'Complete 122cm (1-10 +X)', themeColor: '#10b981' },
              { targetStart: 5, targetEnd: 8, targetCount: 4, distance: '5m', divisionCode: 'BU10W', divisionName: 'Barebow U10 Women', phase: '1/4 Final', targetFace: 'Complete 122cm (1-10 +X)', themeColor: '#ec4899' },
              { targetStart: 9, targetEnd: 12, targetCount: 4, distance: '10m', divisionCode: 'BU13M', divisionName: 'Barebow U13 Men', phase: '1/4 Final', targetFace: 'Complete 122cm (1-10 +X)', themeColor: '#14b8a6' },
              { targetStart: 13, targetEnd: 16, targetCount: 4, distance: '10m', divisionCode: 'BU13W', divisionName: 'Barebow U13 Women', phase: '1/4 Final', targetFace: 'Complete 122cm (1-10 +X)', themeColor: '#6366f1' },
              { targetStart: 17, targetEnd: 20, targetCount: 4, distance: '10m', divisionCode: 'NU10M', divisionName: 'Nasional U10 Men', phase: '1/4 Final', targetFace: 'Reduced 80cm (5-10 +X)', themeColor: '#f59e0b' },
              { targetStart: 21, targetEnd: 24, targetCount: 4, distance: '10m', divisionCode: 'NU10W', divisionName: 'Nasional U10 Women', phase: '1/4 Final', targetFace: 'Reduced 80cm (5-10 +X)', themeColor: '#84cc16' },
              { targetStart: 25, targetEnd: 28, targetCount: 4, distance: '20m', divisionCode: 'NU13M', divisionName: 'Nasional U13 Men', phase: '1/4 Final', targetFace: 'Reduced 80cm (5-10 +X)', themeColor: '#06b6d4' },
              { targetStart: 29, targetEnd: 32, targetCount: 4, distance: '20m', divisionCode: 'NU13W', divisionName: 'Nasional U13 Women', phase: '1/4 Final', targetFace: 'Reduced 80cm (5-10 +X)', themeColor: '#f43f5e' }
            ]
          },
          {
            time: '13:45 - 14:15',
            title: 'Babak Semifinal (1/2 Final)',
            matchType: 'Individual Semifinals',
            format: '5 ends of 3 arrows',
            targetCount: 32,
            targetFaceMain: 'Complete 122cm & Reduced 80cm',
            blocks: [
              { targetStart: 1, targetEnd: 2, targetCount: 2, distance: '5m', divisionCode: 'BU10M', divisionName: 'Barebow U10 Men', phase: '1/2 Semifinal', targetFace: 'Complete 122cm', themeColor: '#10b981' },
              { targetStart: 3, targetEnd: 4, targetCount: 2, distance: '5m', divisionCode: 'BU10W', divisionName: 'Barebow U10 Women', phase: '1/2 Semifinal', targetFace: 'Complete 122cm', themeColor: '#ec4899' },
              { targetStart: 5, targetEnd: 6, targetCount: 2, distance: '10m', divisionCode: 'BU13M', divisionName: 'Barebow U13 Men', phase: '1/2 Semifinal', targetFace: 'Complete 122cm', themeColor: '#14b8a6' },
              { targetStart: 7, targetEnd: 8, targetCount: 2, distance: '10m', divisionCode: 'BU13W', divisionName: 'Barebow U13 Women', phase: '1/2 Semifinal', targetFace: 'Complete 122cm', themeColor: '#6366f1' },
              { targetStart: 9, targetEnd: 10, targetCount: 2, distance: '10m', divisionCode: 'NU10M', divisionName: 'Nasional U10 Men', phase: '1/2 Semifinal', targetFace: 'Reduced 80cm', themeColor: '#f59e0b' },
              { targetStart: 11, targetEnd: 12, targetCount: 2, distance: '10m', divisionCode: 'NU10W', divisionName: 'Nasional U10 Women', phase: '1/2 Semifinal', targetFace: 'Reduced 80cm', themeColor: '#84cc16' },
              { targetStart: 13, targetEnd: 14, targetCount: 2, distance: '20m', divisionCode: 'NU13M', divisionName: 'Nasional U13 Men', phase: '1/2 Semifinal', targetFace: 'Reduced 80cm', themeColor: '#06b6d4' },
              { targetStart: 15, targetEnd: 16, targetCount: 2, distance: '20m', divisionCode: 'NU13W', divisionName: 'Nasional U13 Women', phase: '1/2 Semifinal', targetFace: 'Reduced 80cm', themeColor: '#f43f5e' },
              { targetStart: 17, targetEnd: 24, targetCount: 8, distance: '50m', divisionCode: 'CU15M', divisionName: 'Compound U15 Men', phase: '1/2 Semifinal', targetFace: 'Reduced 80cm 6-ring', themeColor: '#a855f7' },
              { targetStart: 25, targetEnd: 32, targetCount: 8, distance: '70m', divisionCode: 'RU15M', divisionName: 'Recurve U15 Men', phase: '1/2 Semifinal', targetFace: 'Complete 122cm', themeColor: '#3b82f6' }
            ]
          }
        ]
      }
    ]
  },
  '29375': {
    name: 'Liga Panahan Kendal 2026',
    organizer: 'Perpani Kendal',
    days: [
      {
        label: '10 May 2026, Sunday',
        date: '2026-05-10',
        sessions: [
          {
            time: '08:00 - 11:30',
            title: 'Sesi Kualifikasi Nasional & Barebow',
            matchType: 'Qualification Round',
            format: '2 rounds x 36 arrows (72 total)',
            targetCount: 28,
            targetFaceMain: 'Complete 122cm & Reduced 80cm',
            blocks: [
              { targetStart: 1, targetEnd: 6, targetCount: 6, distance: '10m', divisionCode: 'N-U12', divisionName: 'Nasional U-12', phase: 'Qualification', targetFace: 'Complete 122cm', themeColor: '#10b981' },
              { targetStart: 7, targetEnd: 12, targetCount: 6, distance: '15m', divisionCode: 'N-U15', divisionName: 'Nasional U-15', phase: 'Qualification', targetFace: 'Reduced 80cm', themeColor: '#f59e0b' },
              { targetStart: 13, targetEnd: 20, targetCount: 8, distance: '20m', divisionCode: 'N-UMUM', divisionName: 'Nasional Umum', phase: 'Qualification', targetFace: 'Reduced 80cm', themeColor: '#06b6d4' },
              { targetStart: 21, targetEnd: 28, targetCount: 8, distance: '50m', divisionCode: 'BB-UMUM', divisionName: 'Barebow Umum', phase: 'Qualification', targetFace: 'Complete 122cm', themeColor: '#a855f7' }
            ]
          }
        ]
      }
    ]
  },
  '28570': {
    name: 'USM National Championship 2026',
    organizer: 'Universitas Semarang Archery Club',
    days: [
      {
        label: '15 Jun 2026, Monday',
        date: '2026-06-15',
        sessions: [
          {
            time: '14:00 - 15:30',
            title: 'Medal Matches (Bronze & Gold Finals)',
            matchType: 'Final Matches',
            format: 'Set System (5 sets of 3 arrows)',
            targetCount: 16,
            targetFaceMain: 'Reduced 80cm & Triple 40cm',
            blocks: [
              { targetStart: 1, targetEnd: 2, targetCount: 2, distance: '70m', divisionCode: 'RM', divisionName: 'Recurve Men Finals', phase: 'Gold & Bronze', targetFace: 'Complete 122cm', themeColor: '#3b82f6' },
              { targetStart: 3, targetEnd: 4, targetCount: 2, distance: '70m', divisionCode: 'RW', divisionName: 'Recurve Women Finals', phase: 'Gold & Bronze', targetFace: 'Complete 122cm', themeColor: '#ec4899' },
              { targetStart: 5, targetEnd: 6, targetCount: 2, distance: '50m', divisionCode: 'CM', divisionName: 'Compound Men Finals', phase: 'Gold & Bronze', targetFace: 'Reduced 80cm 6-ring', themeColor: '#eab308' },
              { targetStart: 7, targetEnd: 8, targetCount: 2, distance: '50m', divisionCode: 'CW', divisionName: 'Compound Women Finals', phase: 'Gold & Bronze', targetFace: 'Reduced 80cm 6-ring', themeColor: '#f97316' },
              { targetStart: 9, targetEnd: 12, targetCount: 4, distance: '50m', divisionCode: 'BM', divisionName: 'Barebow Men Finals', phase: 'Gold & Bronze', targetFace: 'Complete 122cm', themeColor: '#10b981' },
              { targetStart: 13, targetEnd: 16, targetCount: 4, distance: '18m', divisionCode: 'IND-M', divisionName: 'Indoor Recurve Men', phase: 'Gold & Bronze', targetFace: 'Triple Face 40cm', themeColor: '#8b5cf6' }
            ]
          }
        ]
      }
    ]
  }
}

const currentTournamentData = computed(() => {
  return fopTournamentStore[selectedTournamentId.value] || fopTournamentStore['27311']
})

const currentDay = computed(() => {
  const days = currentTournamentData.value.days
  return days[selectedDayIndex.value] || days[0]
})

const currentSession = computed(() => {
  const sessions = currentDay.value.sessions
  return sessions[selectedSessionIndex.value] || sessions[0]
})

// ─────────────────────────────────────────────────────────────
// 2.5D ISOMETRIC CANVAS ENGINE
// ─────────────────────────────────────────────────────────────
const canvasRef = ref(null)
let ctx = null
let animationFrameId = null
let dpr = 1

// Camera State (Pan & Zoom)
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

watch([selectedTournamentId, selectedDayIndex, selectedSessionIndex], () => {
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
  const session = currentSession.value
  const targetCount = session.targetCount || 32
  const canvas = canvasRef.value
  if (!canvas) return
  
  const width = canvas.width / dpr
  const slotWidth = (width - 140) / targetCount
  const targetCenterX = 70 + (targetNum - 0.5) * slotWidth
  
  camera.zoom = 1.35
  camera.x = (width / 2) - (targetCenterX * camera.zoom)
  camera.y = 15
}

function triggerArrowSalvo() {
  const canvas = canvasRef.value
  if (!canvas) return
  const session = currentSession.value
  const targetCount = session.targetCount || 32
  const width = canvas.width / dpr
  const height = canvas.height / dpr
  const slotWidth = (width - 140) / targetCount
  
  arrows.value = []
  const shootY = height - 90

  for (let i = 1; i <= targetCount; i++) {
    const tx = 70 + (i - 0.5) * slotWidth
    const block = session.blocks.find(b => i >= b.targetStart && i <= b.targetEnd) || session.blocks[0]
    const distNum = parseInt(block.distance) || 10
    const targetY = shootY - 40 - Math.min(260, (distNum / 70) * 240)

    // Archer A Arrow
    arrows.value.push({
      startX: tx - 4,
      startY: shootY - 6,
      targetX: tx - 2 + (Math.random() * 4 - 2),
      targetY: targetY + (Math.random() * 4 - 2),
      progress: 0,
      speed: 0.02 + Math.random() * 0.012,
      arcHeight: 25 + (distNum / 70) * 45,
      color: '#38bdf8'
    })

    // Archer B Arrow
    arrows.value.push({
      startX: tx + 4,
      startY: shootY - 6,
      targetX: tx + 2 + (Math.random() * 4 - 2),
      targetY: targetY + (Math.random() * 4 - 2),
      progress: 0,
      speed: 0.02 + Math.random() * 0.012,
      arcHeight: 25 + (distNum / 70) * 45,
      color: '#facc15'
    })
  }
}

function exportCanvasImage() {
  const canvas = canvasRef.value
  if (!canvas) return
  const link = document.createElement('a')
  link.download = `FOP_3D_Arena_${selectedTournamentId.value}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// ─────────────────────────────────────────────────────────────
// RENDER LOOP
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

  // Clear canvas background
  ctx.fillStyle = '#060a12'
  ctx.fillRect(0, 0, width, height)

  // Apply Camera transform
  ctx.save()
  ctx.translate(camera.x, camera.y)
  ctx.scale(camera.zoom, camera.zoom)

  renderedTargetHitboxes = []

  // Render 2.5D Isometric Stadium Scene
  renderIsometricStadiumScene(width, height)

  // Render flying parabolic arrows
  renderParabolicArrows()

  ctx.restore() // End camera

  // Render static HUD / Tooltip
  renderHUDOverlays(width, height)

  ctx.restore() // End DPR scale
}

// ─────────────────────────────────────────────────────────────
// REVAMPED 2.5D ISOMETRIC ARENA ENGINE
// ─────────────────────────────────────────────────────────────
function renderIsometricStadiumScene(width, height) {
  const session = currentSession.value
  const targetCount = session.targetCount || 32
  const paddingX = 70
  const usableWidth = width - (paddingX * 2)
  const slotWidth = usableWidth / targetCount

  const fieldTopY = 114
  const shootY = height - 95
  const waitLineY = height - 45

  // 1. Lush Isometric Turf Gradient & Mowing Bands
  const fieldGrad = ctx.createLinearGradient(0, fieldTopY, 0, height)
  fieldGrad.addColorStop(0, '#06281e')
  fieldGrad.addColorStop(0.3, '#044230')
  fieldGrad.addColorStop(0.8, '#065f46')
  fieldGrad.addColorStop(1, '#043b2c')
  ctx.fillStyle = fieldGrad
  ctx.fillRect(0, fieldTopY, width, height - fieldTopY)

  // Alternating Mowing Stripes (Diamond/Angled turf pattern)
  const stripeW = 48
  for (let sx = -height; sx < width + height; sx += stripeW) {
    ctx.fillStyle = (Math.floor(sx / stripeW) % 2 === 0) ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.04)'
    ctx.beginPath()
    ctx.moveTo(sx, fieldTopY)
    ctx.lineTo(sx + 35, height)
    ctx.lineTo(sx + 35 + stripeW, height)
    ctx.lineTo(sx + stripeW, fieldTopY)
    ctx.closePath()
    ctx.fill()
  }

  // 2. Isometric Lane Divider Lines (Soft 3D guide rays)
  for (let i = 0; i <= targetCount; i++) {
    const laneX = paddingX + i * slotWidth
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.08)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(laneX, fieldTopY + 10)
    ctx.lineTo(laneX + (i - targetCount / 2) * 0.35, shootY)
    ctx.stroke()
  }

  // 3. Stenciled Isometric Distance Yardlines (10m, 20m, 30m, 50m, 70m)
  const distanceStencils = [5, 10, 20, 30, 50, 70]
  distanceStencils.forEach((m) => {
    const distY = shootY - 40 - Math.min(270, (m / 70) * 250)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.lineWidth = 1
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.moveTo(paddingX - 20, distY)
    ctx.lineTo(width - paddingX + 20, distY)
    ctx.stroke()
    ctx.setLineDash([])

    // Distance Yard Marker Badge on field sides
    ctx.fillStyle = 'rgba(250, 204, 21, 0.7)'
    ctx.font = 'bold 8px ui-monospace, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`${m}m`, paddingX - 26, distY + 3)
    ctx.textAlign = 'left'
    ctx.fillText(`${m}m`, width - paddingX + 26, distY + 3)
  })

  // 4. Modern Stadium Grandstand & LED Ribbon at Top
  ctx.fillStyle = 'rgba(11, 17, 32, 0.94)'
  ctx.beginPath()
  ctx.roundRect(paddingX - 10, 52, usableWidth + 20, 48, 12)
  ctx.fill()
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Stadium LED Screen Ribbon
  ctx.fillStyle = '#38bdf8'
  ctx.font = 'black 11px font-display, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('🏛️ CHAMPIONSHIP ARENA // 2.5D ISOMETRIC FIELD OF PLAY', paddingX + 12, 70)

  ctx.fillStyle = '#94a3b8'
  ctx.font = 'bold 9px monospace'
  ctx.fillText(`${currentTournamentData.value.name.toUpperCase()} • SESSION: ${session.time} • ${session.title.toUpperCase()}`, paddingX + 12, 85)

  // 5. Category Division Color Headers above targets
  let curX = paddingX
  session.blocks.forEach((block) => {
    const blockW = block.targetCount * slotWidth
    ctx.fillStyle = block.themeColor || '#10b981'
    ctx.globalAlpha = 0.25
    ctx.beginPath()
    ctx.roundRect(curX + 1, fieldTopY - 8, blockW - 2, 16, 4)
    ctx.fill()
    ctx.globalAlpha = 1.0

    ctx.strokeStyle = block.themeColor || '#10b981'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 8px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${block.divisionCode}`, curX + blockW / 2, fieldTopY + 3)

    curX += blockW
  })

  // 6. Waiting Line & Equipment Area
  ctx.fillStyle = 'rgba(2, 28, 22, 0.7)'
  ctx.fillRect(0, waitLineY, width, height - waitLineY)

  ctx.strokeStyle = '#facc15'
  ctx.lineWidth = 2
  ctx.setLineDash([8, 6])
  ctx.beginPath()
  ctx.moveTo(0, waitLineY)
  ctx.lineTo(width, waitLineY)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#fde047'
  ctx.font = 'bold 8px ui-monospace, monospace'
  ctx.textAlign = 'left'
  ctx.fillText('WAITING LINE (GARIS TUNGGU)', 20, waitLineY - 5)

  // 7. Shooting Line (Solid Luminous White with Lane Numbers)
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(20, shootY)
  ctx.lineTo(width - 20, shootY)
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 8px ui-monospace, monospace'
  ctx.textAlign = 'left'
  ctx.fillText('SHOOTING LINE (GARIS TEMBAK)', 20, shootY + 15)

  // 8. Render 3D Target Butts & Archers per lane
  for (let i = 1; i <= targetCount; i++) {
    const targetCenterX = paddingX + (i - 0.5) * slotWidth
    const block = session.blocks.find(b => i >= b.targetStart && i <= b.targetEnd) || session.blocks[0]
    const distNum = parseInt(block.distance) || 10
    const targetY = shootY - 40 - Math.min(260, (distNum / 70) * 240)
    const isHovered = hoveredTarget.value === i
    const buttR = isHovered ? 13 : 10

    // Hover Highlight Beam from shooting line to target
    if (isHovered) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)'
      ctx.beginPath()
      ctx.moveTo(targetCenterX - slotWidth * 0.45, shootY)
      ctx.lineTo(targetCenterX + slotWidth * 0.45, shootY)
      ctx.lineTo(targetCenterX + 12, targetY)
      ctx.lineTo(targetCenterX - 12, targetY)
      ctx.closePath()
      ctx.fill()
    }

    // A. 3D Cast Shadow on grass (Soft blurry ellipse)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
    ctx.beginPath()
    ctx.ellipse(targetCenterX + 7, targetY + 18, 13, 5, -0.15, 0, Math.PI * 2)
    ctx.fill()

    // B. Tripod Wooden Stand Legs (3D Wooden frame)
    ctx.strokeStyle = '#854d0e'
    ctx.lineWidth = 2.2
    ctx.beginPath()
    // Left front leg
    ctx.moveTo(targetCenterX - 8, targetY + 16)
    ctx.lineTo(targetCenterX, targetY)
    // Right front leg
    ctx.lineTo(targetCenterX + 8, targetY + 16)
    // Back support strut
    ctx.moveTo(targetCenterX, targetY)
    ctx.lineTo(targetCenterX + 5, targetY + 18)
    ctx.stroke()

    // C. 3D Target Foam Box (Extruded back thickness)
    ctx.fillStyle = '#1e293b'
    ctx.beginPath()
    ctx.ellipse(targetCenterX + 3, targetY - 2, buttR + 0.5, buttR + 0.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // D. Front Target Face (Official 10-Ring World Archery)
    drawWorldArcheryTargetFace(targetCenterX, targetY, buttR, isHovered)

    // E. 3D Target Number Plate mounted on top
    ctx.fillStyle = isHovered ? '#facc15' : '#0f172a'
    ctx.beginPath()
    ctx.roundRect(targetCenterX - 8, targetY - buttR - 13, 16, 11, 2.5)
    ctx.fill()
    ctx.strokeStyle = isHovered ? '#ffffff' : '#64748b'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = isHovered ? '#0f172a' : '#ffffff'
    ctx.font = 'black 8px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`${i}`, targetCenterX, targetY - buttR - 4)

    // F. Wind Ribbon Flutter on target top
    const flutter = Math.sin(Date.now() / 200 + i) * 3
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(targetCenterX + 8, targetY - buttR - 13)
    ctx.lineTo(targetCenterX + 13 + flutter, targetY - buttR - 16)
    ctx.stroke()

    // G. Distance Tag below butt
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 7px monospace'
    ctx.fillText(`${block.distance}`, targetCenterX, targetY + 26)

    // H. 3D Archers at Shooting Line (Slot A & Slot B)
    // Archer A (Blue)
    ctx.fillStyle = '#38bdf8'
    ctx.beginPath()
    ctx.arc(targetCenterX - 4, shootY - 4, 3, 0, Math.PI * 2)
    ctx.fill()

    // Archer B (Yellow)
    ctx.fillStyle = '#facc15'
    ctx.beginPath()
    ctx.arc(targetCenterX + 4, shootY - 4, 3, 0, Math.PI * 2)
    ctx.fill()

    // Store hitbox for click and hover interactions
    renderedTargetHitboxes.push({
      targetNumber: i,
      x: targetCenterX,
      y: targetY,
      radius: buttR + 8,
      divisionCode: block.divisionCode,
      divisionName: block.divisionName,
      distance: block.distance,
      phase: block.phase,
      targetFace: block.targetFace
    })
  }
}

// ─────────────────────────────────────────────────────────────
// WORLD ARCHERY TARGET FACE RENDERER HELPER
// ─────────────────────────────────────────────────────────────
function drawWorldArcheryTargetFace(cx, cy, radius, isHighlighted) {
  const rings = [
    { r: 1.0, color: '#f8fafc', stroke: '#cbd5e1' }, // White ring (1-2)
    { r: 0.8, color: '#1e293b', stroke: '#0f172a' }, // Black ring (3-4)
    { r: 0.6, color: '#0284c7', stroke: '#0369a1' }, // Blue ring (5-6)
    { r: 0.4, color: '#dc2626', stroke: '#b91c1c' }, // Red ring (7-8)
    { r: 0.2, color: '#facc15', stroke: '#eab308' }  // Gold 10 ring (9-10 + X)
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

  // Inner X ring
  ctx.fillStyle = '#92400e'
  ctx.beginPath()
  ctx.arc(cx, cy, radius * 0.06, 0, Math.PI * 2)
  ctx.fill()

  // Glowing halo on hover
  if (isHighlighted) {
    ctx.strokeStyle = '#facc15'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2)
    ctx.stroke()
  }
}

// ─────────────────────────────────────────────────────────────
// PARABOLIC ARROW TRAJECTORY SIMULATION
// ─────────────────────────────────────────────────────────────
function renderParabolicArrows() {
  if (arrows.value.length === 0) return

  for (let i = arrows.value.length - 1; i >= 0; i--) {
    const a = arrows.value[i]
    a.progress += a.speed

    // Parabolic arc interpolation (Height peaks at progress 0.5)
    const curX = a.startX + (a.targetX - a.startX) * a.progress
    const linearY = a.startY + (a.targetY - a.startY) * a.progress
    const arcOffset = Math.sin(a.progress * Math.PI) * a.arcHeight
    const curY = linearY - arcOffset

    // Arrow streak trail
    ctx.strokeStyle = a.color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(curX, curY)
    ctx.lineTo(curX, curY + 8)
    ctx.stroke()

    // Arrowhead tip
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(curX, curY, 2, 0, Math.PI * 2)
    ctx.fill()

    if (a.progress >= 1) {
      arrows.value.splice(i, 1)
    }
  }
}

// ─────────────────────────────────────────────────────────────
// SCREEN OVERLAYS & HOVER TOOLTIP
// ─────────────────────────────────────────────────────────────
function renderHUDOverlays(width, height) {
  if (hoveredTarget.value && mousePos.x && mousePos.y) {
    const hitbox = renderedTargetHitboxes.find(h => h.targetNumber === hoveredTarget.value)
    if (hitbox) {
      const tipX = Math.min(width - 170, mousePos.x + 15)
      const tipY = Math.max(50, mousePos.y - 50)

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'
      ctx.beginPath()
      ctx.roundRect(tipX, tipY, 160, 52, 8)
      ctx.fill()
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 1.2
      ctx.stroke()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'black 10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`Target Butt #${hitbox.targetNumber} (${hitbox.distance})`, tipX + 10, tipY + 18)

      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 9px sans-serif'
      ctx.fillText(`${hitbox.divisionCode} • ${hitbox.phase}`, tipX + 10, tipY + 32)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '8px sans-serif'
      ctx.fillText('Click to inspect full lane', tipX + 10, tipY + 44)
    }
  }
}

// ─────────────────────────────────────────────────────────────
// MOUSE & TOUCH EVENT HANDLERS
// ─────────────────────────────────────────────────────────────
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
      selectedTargetInfo.value = h
      return
    }
  }
}
</script>
