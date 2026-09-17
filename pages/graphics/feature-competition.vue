<template>
    <div class="stage-wrapper" id="stageWrapper" @dblclick="togglePause">
        <canvas ref="canvasRef" width="1080" height="1080" class="stage-canvas" :style="{ transform: `scale(${scale})` }"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
    layout: false
})

const canvasRef = ref(null)
const scale = ref(1)

let animationFrameId = null
let isPaused = ref(false)
let pausedAt = 0
let totalPausedDuration = 0
let renderFrameFunc = null

const handleResize = () => {
    if (typeof window !== 'undefined') {
        const windowW = window.innerWidth
        const windowH = window.innerHeight
        scale.value = Math.min(windowW / 1080, windowH / 1080)
    }
}

const togglePause = () => {
    isPaused.value = !isPaused.value
    if (isPaused.value) {
        pausedAt = performance.now()
        if (renderFrameFunc) {
            renderFrameFunc(pausedAt)
        }
    } else {
        if (pausedAt > 0) {
            totalPausedDuration += performance.now() - pausedAt
        }
        if (renderFrameFunc) {
            animationFrameId = requestAnimationFrame(renderFrameFunc)
        }
    }
}

// ── Easing Utilities ──
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

onMounted(async () => {
    handleResize()
    window.addEventListener('resize', handleResize)

    if (document.fonts) {
        try {
            await document.fonts.ready
        } catch (e) {
            console.log('Font ready check', e)
        }
    }

    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Helper: Draw Rounded Rectangle
    function drawRoundedRect(x, y, w, h, r = 16, fill = null, stroke = null, lineWidth = 1) {
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, w, h, r)
        } else {
            ctx.moveTo(x + r, y)
            ctx.arcTo(x + w, y, x + w, y + h, r)
            ctx.arcTo(x + w, y + h, x, y + h, r)
            ctx.arcTo(x, y + h, x, y, r)
            ctx.arcTo(x, y + w, y, r)
            ctx.closePath()
        }
        if (fill) {
            ctx.fillStyle = fill
            ctx.fill()
        }
        if (stroke) {
            ctx.strokeStyle = stroke
            ctx.lineWidth = lineWidth
            ctx.stroke()
        }
    }

    // Helper: Standard OS Mouse Cursor Renderer
    function drawMouseCursor(x, y, isPressed = false) {
        ctx.save()
        ctx.translate(x, y)
        if (isPressed) {
            ctx.scale(0.90, 0.90)
        }
        ctx.shadowColor = 'rgba(15, 23, 42, 0.28)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetY = 4

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, 21)
        ctx.lineTo(5.5, 16.5)
        ctx.lineTo(10.5, 26)
        ctx.lineTo(14, 24.5)
        ctx.lineTo(9, 15)
        ctx.lineTo(16.5, 15)
        ctx.closePath()

        ctx.fillStyle = '#0F172A'
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1.75
        ctx.stroke()
        ctx.restore()
    }

    // Helper: Click Ripple Effect
    function drawRipple(x, y, progress) {
        if (progress <= 0 || progress >= 1) return
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, progress * 32, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(217, 255, 0, ${0.45 * (1 - progress)})`
        ctx.fill()
        ctx.strokeStyle = `rgba(15, 23, 42, ${0.4 * (1 - progress)})`
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
    }

    // ── Animation Loop ──
    const TOTAL_DURATION = 17.5 // seconds
    let startTime = null

    // Geometry constants
    const CANVAS_SIZE = 1080
    const PHONE_W = 390
    const PHONE_H = 800
    const PHONE_R = 48
    const PHONE_X = (CANVAS_SIZE - PHONE_W) / 2 // 345
    const PHONE_Y = (CANVAS_SIZE - PHONE_H) / 2 // 140

    renderFrameFunc = (timestamp) => {
        if (!startTime) startTime = timestamp
        const effectiveTime = isPaused.value ? pausedAt : timestamp
        const elapsed = ((effectiveTime - startTime - totalPausedDuration) / 1000) % TOTAL_DURATION
        const loopT = elapsed

        // Dynamic Camera Zoom System
        let camScale = 1.0
        let camOffsetX = 0
        let camOffsetY = 0

        // Camera scripting based on scenes:
        // Scene 1 (0.0s - 4.2s): Target Allocation (Zoom in on Auto Allocate at 2.2s - 3.8s)
        if (loopT >= 1.8 && loopT < 4.0) {
            const zProgress = loopT < 3.4 ? clamp((loopT - 1.8) / 0.8, 0, 1) : 1 - clamp((loopT - 3.4) / 0.6, 0, 1)
            const easeZ = easeInOutCubic(zProgress)
            camScale = 1.0 + easeZ * 0.45 // 1.45x
            camOffsetX = easeZ * -15
            camOffsetY = easeZ * -180
        }
        // Scene 2 (4.2s - 8.4s): Standings & Teams (Zoom in on Export Seeding at 6.0s - 8.0s)
        else if (loopT >= 5.8 && loopT < 8.2) {
            const zProgress = loopT < 7.6 ? clamp((loopT - 5.8) / 0.8, 0, 1) : 1 - clamp((loopT - 7.6) / 0.6, 0, 1)
            const easeZ = easeInOutCubic(zProgress)
            camScale = 1.0 + easeZ * 0.38 // 1.38x
            camOffsetX = easeZ * -10
            camOffsetY = easeZ * -170
        }
        // Scene 3 (8.4s - 12.8s): Matchplay Brackets (Zoom in on Gold Final Node at 10.2s - 12.4s)
        else if (loopT >= 10.0 && loopT < 12.6) {
            const zProgress = loopT < 12.0 ? clamp((loopT - 10.0) / 0.8, 0, 1) : 1 - clamp((loopT - 12.0) / 0.6, 0, 1)
            const easeZ = easeInOutCubic(zProgress)
            camScale = 1.0 + easeZ * 0.46 // 1.46x
            camOffsetX = easeZ * 0
            camOffsetY = easeZ * -130
        }
        // Scene 4 (12.8s - 16.5s): E-Certificates (Zoom in on Issue Certs at 14.0s - 16.0s)
        else if (loopT >= 13.8 && loopT < 16.2) {
            const zProgress = loopT < 15.6 ? clamp((loopT - 13.8) / 0.8, 0, 1) : 1 - clamp((loopT - 15.6) / 0.6, 0, 1)
            const easeZ = easeInOutCubic(zProgress)
            camScale = 1.0 + easeZ * 0.45 // 1.45x
            camOffsetX = easeZ * -5
            camOffsetY = easeZ * -180
        }

        // Apply camera zoom transform around canvas center
        ctx.save()
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

        // 1. Stage Background
        ctx.fillStyle = '#ECEBE6'
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

        // Subtle Stage Dot Grid
        ctx.fillStyle = 'rgba(15, 23, 42, 0.04)'
        const dotGap = 28
        for (let gx = 14; gx < CANVAS_SIZE; gx += dotGap) {
            for (let gy = 14; gy < CANVAS_SIZE; gy += dotGap) {
                ctx.beginPath()
                ctx.arc(gx, gy, 1.2, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        // 2. Camera Transform
        ctx.translate(CANVAS_SIZE / 2 + camOffsetX, CANVAS_SIZE / 2 + camOffsetY)
        ctx.scale(camScale, camScale)
        ctx.translate(-CANVAS_SIZE / 2, -CANVAS_SIZE / 2)

        // 3. Stage Shadows for Mobile Phone Chassis
        ctx.save()
        ctx.shadowColor = 'rgba(15, 23, 42, 0.22)'
        ctx.shadowBlur = 48
        ctx.shadowOffsetY = 24
        drawRoundedRect(PHONE_X, PHONE_Y, PHONE_W, PHONE_H, PHONE_R, '#181A1D')
        ctx.restore()

        // 4. Phone Outer Bezel & Metal Frame
        drawRoundedRect(PHONE_X, PHONE_Y, PHONE_W, PHONE_H, PHONE_R, '#181A1D', '#334155', 2.5)

        // Inner Screen Canvas (Clip region)
        const SCREEN_INSET = 10
        const SCREEN_X = PHONE_X + SCREEN_INSET
        const SCREEN_Y = PHONE_Y + SCREEN_INSET
        const SCREEN_W = PHONE_W - SCREEN_INSET * 2
        const SCREEN_H = PHONE_H - SCREEN_INSET * 2
        const SCREEN_R = PHONE_R - SCREEN_INSET

        ctx.save()
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(SCREEN_X, SCREEN_Y, SCREEN_W, SCREEN_H, SCREEN_R)
        } else {
            ctx.rect(SCREEN_X, SCREEN_Y, SCREEN_W, SCREEN_H)
        }
        ctx.clip()

        // Screen Background
        ctx.fillStyle = '#F8FAFC'
        ctx.fillRect(SCREEN_X, SCREEN_Y, SCREEN_W, SCREEN_H)

        // ── TOP APP BAR & STATUS BAR ──
        // Status Bar
        ctx.fillStyle = '#0F172A'
        ctx.font = '600 13px Inter, -apple-system, sans-serif'
        ctx.fillText('9:41', SCREEN_X + 24, SCREEN_Y + 28)

        // Status Icons (Signal & Battery)
        ctx.fillStyle = '#0F172A'
        ctx.fillRect(SCREEN_X + SCREEN_W - 48, SCREEN_Y + 18, 18, 9)
        drawRoundedRect(SCREEN_X + SCREEN_W - 50, SCREEN_Y + 16, 22, 13, 3, null, '#0F172A', 1.5)
        ctx.fillRect(SCREEN_X + SCREEN_W - 27, SCREEN_Y + 20, 2, 5)

        // Dynamic Island / Notch
        drawRoundedRect(SCREEN_X + (SCREEN_W - 108) / 2, SCREEN_Y + 11, 108, 24, 12, '#000000')

        // ── PERSISTENT APP HEADER (Operations Hub Title & Status Badge) ──
        const APP_HEADER_Y = SCREEN_Y + 48
        
        // Brand Subtitle & Title
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10.5px Inter, sans-serif'
        ctx.fillText('EO OPERATIONS ENGINE', SCREEN_X + 20, APP_HEADER_Y + 12)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 17px Space Grotesk, Inter, sans-serif'
        ctx.fillText('Archeris National Open', SCREEN_X + 20, APP_HEADER_Y + 32)

        // Live Status Badge on Top Right
        const statusBadgeW = 104
        const statusBadgeX = SCREEN_X + SCREEN_W - statusBadgeW - 20
        drawRoundedRect(statusBadgeX, APP_HEADER_Y + 14, statusBadgeW, 22, 11, '#0F172A')
        
        // Pulsing Volt Dot
        const pulse = 0.5 + 0.5 * Math.sin(loopT * 4)
        ctx.beginPath()
        ctx.arc(statusBadgeX + 11, APP_HEADER_Y + 25, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = '#D9FF00'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(statusBadgeX + 11, APP_HEADER_Y + 25, 3.5 + pulse * 2, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(217, 255, 0, ${0.6 * (1 - pulse)})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.fillStyle = '#FFFFFF'
        ctx.font = '600 10px Inter, sans-serif'
        ctx.fillText('Live Operations', statusBadgeX + 21, APP_HEADER_Y + 28)

        // Divider
        ctx.fillStyle = '#E2E8F0'
        ctx.fillRect(SCREEN_X + 20, APP_HEADER_Y + 44, SCREEN_W - 40, 1)

        // ── SCENE MANAGER & SCREEN RENDERING ──
        const CONTENT_Y = APP_HEADER_Y + 56
        const CONTENT_W = SCREEN_W - 40
        const CONTENT_X = SCREEN_X + 20

        // Determine active scene
        let sceneIndex = 0
        if (loopT < 4.2) {
            sceneIndex = 0
        } else if (loopT < 8.4) {
            sceneIndex = 1
        } else if (loopT < 12.8) {
            sceneIndex = 2
        } else {
            sceneIndex = 3
        }

        // ========================================================
        // SCENE 1: TARGET ALLOCATION MATRIX (0.0s - 4.2s)
        // ========================================================
        if (sceneIndex === 0) {
            // Module Title & Subtitle
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('01 · TARGET ALLOCATION', CONTENT_X, CONTENT_Y + 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Target Butt Matrix', CONTENT_X, CONTENT_Y + 32)

            // Info Card: Division & Capacity
            const infoCardY = CONTENT_Y + 44
            drawRoundedRect(CONTENT_X, infoCardY, CONTENT_W, 64, 14, '#FFFFFF', '#E2E8F0', 1.5)
            
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Recurve Men Open 70m', CONTENT_X + 14, infoCardY + 24)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('40 Targets · 160 Archers (4 / Target)', CONTENT_X + 14, infoCardY + 44)

            // Division Pill
            const divPillW = 68
            drawRoundedRect(CONTENT_X + CONTENT_W - divPillW - 12, infoCardY + 18, divPillW, 26, 8, '#F1F5F9')
            ctx.fillStyle = '#334155'
            ctx.font = '600 10.5px Inter, sans-serif'
            ctx.fillText('Round 1', CONTENT_X + CONTENT_W - divPillW - 1, infoCardY + 34)

            // Target Lane Matrix Cards (Target 01, 02, 03)
            const isAllocated = loopT >= 2.6
            const matrixY = infoCardY + 76
            const lanes = [
                {
                    num: 'Target 01',
                    archers: isAllocated 
                        ? ['A: Arif Dwi (Fast AC)', 'B: Riau Ega (Eagle AC)', 'C: Bagas P. (Focus)', 'D: Hendra W. (Alpha)'] 
                        : ['A: Unassigned', 'B: Unassigned', 'C: Unassigned', 'D: Unassigned']
                },
                {
                    num: 'Target 02',
                    archers: isAllocated 
                        ? ['A: Diananda C. (Fast AC)', 'B: Rezza O. (Focus AC)', 'C: Linda S. (Eagle)', 'D: Nurul H. (Prime)'] 
                        : ['A: Unassigned', 'B: Unassigned', 'C: Unassigned', 'D: Unassigned']
                },
                {
                    num: 'Target 03',
                    archers: isAllocated 
                        ? ['A: Fathur R. (Alpha AC)', 'B: Kenzo A. (Fast AC)', 'C: Dimas W. (Focus)', 'D: Gilang P. (Prime)'] 
                        : ['A: Unassigned', 'B: Unassigned', 'C: Unassigned', 'D: Unassigned']
                }
            ]

            lanes.forEach((lane, lIdx) => {
                const laneCardY = matrixY + lIdx * 104
                drawRoundedRect(CONTENT_X, laneCardY, CONTENT_W, 94, 14, '#FFFFFF', '#E2E8F0', 1.5)

                // Lane Header
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 12.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText(lane.num, CONTENT_X + 14, laneCardY + 20)

                // Allocation Status indicator
                const statusPillW = isAllocated ? 72 : 82
                drawRoundedRect(
                    CONTENT_X + CONTENT_W - statusPillW - 12, 
                    laneCardY + 8, 
                    statusPillW, 
                    20, 
                    6, 
                    isAllocated ? 'rgba(217, 255, 0, 0.25)' : '#F1F5F9',
                    isAllocated ? '#0F172A' : null,
                    1
                )
                ctx.fillStyle = '#0F172A'
                ctx.font = '600 9.5px Inter, sans-serif'
                ctx.fillText(isAllocated ? '● Assigned' : '○ Pending', CONTENT_X + CONTENT_W - statusPillW - 4, laneCardY + 22)

                // 4 Archer Position Pills (A, B, C, D) in 2x2 grid
                lane.archers.forEach((arch, aIdx) => {
                    const col = aIdx % 2
                    const row = Math.floor(aIdx / 2)
                    const pillW = (CONTENT_W - 36) / 2
                    const pillX = CONTENT_X + 12 + col * (pillW + 12)
                    const pillY = laneCardY + 36 + row * 24

                    drawRoundedRect(pillX, pillY, pillW, 20, 5, isAllocated ? '#F8FAFC' : '#FAFAFA', '#E2E8F0', 1)
                    ctx.fillStyle = isAllocated ? '#0F172A' : '#94A3B8'
                    ctx.font = isAllocated ? '600 9px Inter, sans-serif' : '500 9px Inter, sans-serif'
                    ctx.fillText(arch, pillX + 6, pillY + 13.5)
                })
            })

            // Bottom CTA Button: Auto Allocate Targets
            const btnY = matrixY + 3 * 104 + 16
            
            if (isAllocated) {
                drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 50, 16, '#0F172A')
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('160 Archers Allocated (40 Targets)', CONTENT_X + 48, btnY + 31)
            } else {
                drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 50, 16, '#0F172A')
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Auto Allocate Targets', CONTENT_X + 94, btnY + 31)
            }
        }

        // ========================================================
        // SCENE 2: LIVE LEADERBOARD & TEAM AGGREGATION (4.2s - 8.4s)
        // ========================================================
        else if (sceneIndex === 1) {
            // Module Header
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('02 · LIVE SCORING & TEAMS', CONTENT_X, CONTENT_Y + 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Qualification & Teams', CONTENT_X, CONTENT_Y + 32)

            // Individual Leaderboard Section
            const rankCardY = CONTENT_Y + 44
            drawRoundedRect(CONTENT_X, rankCardY, CONTENT_W, 178, 14, '#FFFFFF', '#E2E8F0', 1.5)

            // Header of Table
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Individual Standings (72 Arrows)', CONTENT_X + 14, rankCardY + 22)

            const archersData = [
                { rank: '1', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club', score: '682', detail: '38X · 42 Tens', isVolt: true },
                { rank: '2', name: 'Riau Ega Agatha', club: 'Eagle Archery Club', score: '678', detail: '34X · 40 Tens', isVolt: false },
                { rank: '3', name: 'Diananda Choirunisa', club: 'Fast Archery Club', score: '671', detail: '29X · 37 Tens', isVolt: false },
            ]

            archersData.forEach((a, idx) => {
                const rowY = rankCardY + 36 + idx * 44
                
                // Rank Pill
                drawRoundedRect(CONTENT_X + 12, rowY + 4, 22, 22, 6, a.isVolt ? '#D9FF00' : '#F1F5F9')
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11px Inter, sans-serif'
                ctx.fillText(a.rank, CONTENT_X + 20, rowY + 19)

                // Archer Name & Club
                ctx.fillStyle = '#0F172A'
                ctx.font = '600 12px Inter, sans-serif'
                ctx.fillText(a.name, CONTENT_X + 42, rowY + 16)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 10px Inter, sans-serif'
                ctx.fillText(a.club, CONTENT_X + 42, rowY + 29)

                // Score & Tens
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
                ctx.fillText(a.score, CONTENT_X + CONTENT_W - 68, rowY + 17)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9px Inter, sans-serif'
                ctx.fillText(a.detail, CONTENT_X + CONTENT_W - 74, rowY + 29)

                if (idx < archersData.length - 1) {
                    ctx.fillStyle = '#F1F5F9'
                    ctx.fillRect(CONTENT_X + 14, rowY + 38, CONTENT_W - 28, 1)
                }
            })

            // Team Auto-Calculation Bento Card
            const teamCardY = rankCardY + 192
            drawRoundedRect(CONTENT_X, teamCardY, CONTENT_W, 136, 14, '#FFFFFF', '#E2E8F0', 1.5)

            // Team Header
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px Inter, sans-serif'
            ctx.fillText('AUTOMATED TEAM AGGREGATION', CONTENT_X + 14, teamCardY + 20)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Fast Archery Club (Men Team)', CONTENT_X + 14, teamCardY + 40)

            // Team Calculation Formula Box
            drawRoundedRect(CONTENT_X + 12, teamCardY + 50, CONTENT_W - 24, 42, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Top 3 Archers Auto-Sum: 682 + 678 + 671', CONTENT_X + 20, teamCardY + 68)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Team Total: 2,031 Pts · Seed #1', CONTENT_X + 20, teamCardY + 83)

            // Team Status Pill
            const teamStatusW = 144
            drawRoundedRect(CONTENT_X + 14, teamCardY + 102, teamStatusW, 22, 6, 'rgba(217, 255, 0, 0.25)', '#0F172A', 1)
            ctx.fillStyle = '#0F172A'
            ctx.font = '600 10px Inter, sans-serif'
            ctx.fillText('✓ Qualified for Team Finals', CONTENT_X + 22, teamCardY + 116)

            // Action Button: Export Elimination Seeding
            const isSeeded = loopT >= 6.8
            const seedBtnY = teamCardY + 152
            drawRoundedRect(CONTENT_X, seedBtnY, CONTENT_W, 50, 16, '#0F172A')
            
            if (isSeeded) {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Seeding Generated (Top 16)', CONTENT_X + 70, seedBtnY + 31)
            } else {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Generate Elimination Seeding', CONTENT_X + 64, seedBtnY + 31)
            }
        }

        // ========================================================
        // SCENE 3: WORLD ARCHERY MATCHPLAY BRACKETS (8.4s - 12.8s)
        // ========================================================
        else if (sceneIndex === 2) {
            // Module Header
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('03 · MATCHPLAY ENGINE', CONTENT_X, CONTENT_Y + 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('World Archery Brackets', CONTENT_X, CONTENT_Y + 32)

            // Bracket Visualizer Card
            const bracketCardY = CONTENT_Y + 44
            drawRoundedRect(CONTENT_X, bracketCardY, CONTENT_W, 310, 14, '#FFFFFF', '#E2E8F0', 1.5)

            // Top Stage Switcher / Round Pill
            drawRoundedRect(CONTENT_X + 14, bracketCardY + 14, 114, 24, 7, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10.5px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Gold Medal Match', CONTENT_X + 22, bracketCardY + 29)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px Inter, sans-serif'
            ctx.fillText('World Archery Set System', CONTENT_X + 138, bracketCardY + 29)

            // Matchplay Visual Node Box (Arif vs Riau)
            const matchBoxY = bracketCardY + 48
            drawRoundedRect(CONTENT_X + 12, matchBoxY, CONTENT_W - 24, 160, 12, '#F8FAFC', '#E2E8F0', 1.5)

            // Athlete 1: Arif Dwi Pangestu
            const isWinnerRevealed = loopT >= 11.2
            drawRoundedRect(
                CONTENT_X + 20, 
                matchBoxY + 12, 
                CONTENT_W - 40, 
                42, 
                8, 
                isWinnerRevealed ? 'rgba(217, 255, 0, 0.25)' : '#FFFFFF', 
                isWinnerRevealed ? '#0F172A' : '#E2E8F0', 
                1.5
            )
            
            // Seed Badge
            drawRoundedRect(CONTENT_X + 28, matchBoxY + 22, 22, 22, 5, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10.5px Inter, sans-serif'
            ctx.fillText('1', CONTENT_X + 36, matchBoxY + 37)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12.5px Inter, sans-serif'
            ctx.fillText('Arif Dwi Pangestu', CONTENT_X + 56, matchBoxY + 36)

            // Set Score for Arif
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 16px Space Grotesk, Inter, sans-serif'
            ctx.fillText('6', CONTENT_X + CONTENT_W - 64, matchBoxY + 38)

            // Athlete 2: Riau Ega Agatha
            drawRoundedRect(CONTENT_X + 20, matchBoxY + 60, CONTENT_W - 40, 42, 8, '#FFFFFF', '#E2E8F0', 1.5)
            
            drawRoundedRect(CONTENT_X + 28, matchBoxY + 70, 22, 22, 5, '#64748B')
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 10.5px Inter, sans-serif'
            ctx.fillText('2', CONTENT_X + 36, matchBoxY + 85)

            ctx.fillStyle = '#0F172A'
            ctx.font = '600 12.5px Inter, sans-serif'
            ctx.fillText('Riau Ega Agatha', CONTENT_X + 56, matchBoxY + 84)

            // Set Score for Riau
            ctx.fillStyle = '#64748B'
            ctx.font = '700 16px Space Grotesk, Inter, sans-serif'
            ctx.fillText('3', CONTENT_X + CONTENT_W - 64, matchBoxY + 86)

            // Set Points Breakdown Grid (Set 1, Set 2, Set 3, Set 4)
            const setGridY = matchBoxY + 110
            const setCols = [
                { title: 'Set 1 (2pts)', score: '29 - 28' },
                { title: 'Set 2 (1pt)', score: '30 - 30' },
                { title: 'Set 3 (2pts)', score: '29 - 27' },
                { title: 'Set 4 (1pt)', score: '28 - 28' },
            ]
            const setColW = (CONTENT_W - 56) / 4
            setCols.forEach((col, cIdx) => {
                const cX = CONTENT_X + 20 + cIdx * (setColW + 6)
                drawRoundedRect(cX, setGridY, setColW, 38, 6, '#FFFFFF', '#E2E8F0', 1)
                ctx.fillStyle = '#64748B'
                ctx.font = '500 8.5px Inter, sans-serif'
                ctx.fillText(col.title, cX + 6, setGridY + 13)

                ctx.fillStyle = '#0F172A'
                ctx.font = '700 10.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText(col.score, cX + 6, setGridY + 29)
            })

            // Champion Banner (revealed after click)
            if (isWinnerRevealed) {
                drawRoundedRect(CONTENT_X + 12, bracketCardY + 220, CONTENT_W - 24, 74, 10, '#0F172A')
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 10.5px Inter, sans-serif'
                ctx.fillText('GOLD MEDAL CHAMPION', CONTENT_X + 24, bracketCardY + 242)

                ctx.fillStyle = '#FFFFFF'
                ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Arif Dwi Pangestu', CONTENT_X + 24, bracketCardY + 262)

                ctx.fillStyle = '#D9FF00'
                ctx.font = '600 11px Inter, sans-serif'
                ctx.fillText('Set Score 6 - 3', CONTENT_X + CONTENT_W - 100, bracketCardY + 262)

                ctx.fillStyle = '#94A3B8'
                ctx.font = '500 10px Inter, sans-serif'
                ctx.fillText('Fast Archery Club · Recurve Men Open 70m', CONTENT_X + 24, bracketCardY + 280)
            } else {
                drawRoundedRect(CONTENT_X + 12, bracketCardY + 220, CONTENT_W - 24, 74, 10, '#F1F5F9')
                ctx.fillStyle = '#64748B'
                ctx.font = '600 11px Inter, sans-serif'
                ctx.fillText('Final Set in Progress (Set 4: 28-28)', CONTENT_X + 24, bracketCardY + 252)

                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Ready for Official Score Lock', CONTENT_X + 24, bracketCardY + 274)
            }

            // CTA Button: Submit Final Match Result
            const matchBtnY = bracketCardY + 326
            drawRoundedRect(CONTENT_X, matchBtnY, CONTENT_W, 50, 16, '#0F172A')
            
            if (isWinnerRevealed) {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('✓ Match Verified & Official', CONTENT_X + 78, matchBtnY + 31)
            } else {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Submit Final Match Result', CONTENT_X + 76, matchBtnY + 31)
            }
        }

        // ========================================================
        // SCENE 4: AUTOMATED E-CERTIFICATES (12.8s - 17.5s)
        // ========================================================
        else {
            // Module Header
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('04 · AWARDS & RECOGNITION', CONTENT_X, CONTENT_Y + 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Digital E-Certificates', CONTENT_X, CONTENT_Y + 32)

            // Certificate Preview Card
            const certCardY = CONTENT_Y + 44
            drawRoundedRect(CONTENT_X, certCardY, CONTENT_W, 290, 14, '#FFFFFF', '#E2E8F0', 1.5)

            // Official Gold / Navy Certificate Inner Frame
            const certInnerY = certCardY + 14
            drawRoundedRect(CONTENT_X + 12, certInnerY, CONTENT_W - 24, 262, 10, '#0F172A', '#D9FF00', 1.5)

            // Certificate Top Heading
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 9px Inter, sans-serif'
            ctx.fillText('ARCHERIS OFFICIAL DIGITAL CERTIFICATE', CONTENT_X + 26, certInnerY + 28)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 16px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Certificate of Excellence', CONTENT_X + 26, certInnerY + 54)

            // Recipient & Award
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 10.5px Inter, sans-serif'
            ctx.fillText('This is proudly presented to:', CONTENT_X + 26, certInnerY + 78)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 17px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Arif Dwi Pangestu', CONTENT_X + 26, certInnerY + 104)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '600 12px Inter, sans-serif'
            ctx.fillText('1st Place · Gold Medal Champion', CONTENT_X + 26, certInnerY + 126)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Recurve Men Open 70m · Archeris National Open', CONTENT_X + 26, certInnerY + 144)

            // Certificate Footer / QR Verification Badge
            drawRoundedRect(CONTENT_X + 24, certInnerY + 164, CONTENT_W - 48, 76, 8, '#1E293B', '#334155', 1)
            
            // Mock QR Code
            const qrX = CONTENT_X + 34
            const qrY = certInnerY + 174
            drawRoundedRect(qrX, qrY, 56, 56, 4, '#FFFFFF')
            ctx.fillStyle = '#0F172A'
            ctx.fillRect(qrX + 6, qrY + 6, 16, 16)
            ctx.fillRect(qrX + 34, qrY + 6, 16, 16)
            ctx.fillRect(qrX + 6, qrY + 34, 16, 16)
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(qrX + 10, qrY + 10, 8, 8)
            ctx.fillRect(qrX + 38, qrY + 10, 8, 8)
            ctx.fillRect(qrX + 10, qrY + 38, 8, 8)
            ctx.fillStyle = '#0F172A'
            ctx.fillRect(qrX + 26, qrY + 26, 8, 8)

            // Security Details
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10.5px Inter, sans-serif'
            ctx.fillText('✓ Verified by Archeris', qrX + 68, qrY + 20)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px Inter, sans-serif'
            ctx.fillText('UUID: cert-88401-2026', qrX + 68, qrY + 36)
            ctx.fillText('Direct WhatsApp & Email Delivery', qrX + 68, qrY + 50)

            // CTA Button: Batch Issue All Certificates
            const isIssued = loopT >= 14.8
            const certBtnY = certCardY + 306
            drawRoundedRect(CONTENT_X, certBtnY, CONTENT_W, 50, 16, '#0F172A')
            
            if (isIssued) {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('160 Certificates Issued & Sent', CONTENT_X + 64, certBtnY + 31)
            } else {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Issue All Certificates (160 Archers)', CONTENT_X + 50, certBtnY + 31)
            }
        }

        // ── FLOATING BOTTOM NAVIGATION / OPERATIONS CONTROLLER ──
        const DOCK_Y = SCREEN_Y + SCREEN_H - 64
        const DOCK_W = SCREEN_W - 32
        const DOCK_X = SCREEN_X + 16
        drawRoundedRect(DOCK_X, DOCK_Y, DOCK_W, 48, 24, '#0F172A', '#334155', 1)

        const dockItems = [
            { label: 'Targets', active: sceneIndex === 0 },
            { label: 'Standings', active: sceneIndex === 1 },
            { label: 'Brackets', active: sceneIndex === 2 },
            { label: 'Certificates', active: sceneIndex === 3 }
        ]
        const dockItemW = (DOCK_W - 16) / 4
        dockItems.forEach((item, dIdx) => {
            const iX = DOCK_X + 8 + dIdx * dockItemW
            if (item.active) {
                drawRoundedRect(iX, DOCK_Y + 6, dockItemW, 36, 18, '#D9FF00')
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 10.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText(item.label, iX + (dockItemW - ctx.measureText(item.label).width) / 2, DOCK_Y + 28)
            } else {
                ctx.fillStyle = '#94A3B8'
                ctx.font = '500 10px Inter, sans-serif'
                ctx.fillText(item.label, iX + (dockItemW - ctx.measureText(item.label).width) / 2, DOCK_Y + 28)
            }
        })

        // Home Indicator Bar
        drawRoundedRect(SCREEN_X + (SCREEN_W - 120) / 2, SCREEN_Y + SCREEN_H - 10, 120, 4, 2, '#0F172A')

        ctx.restore() // Restore screen clip

        // ── 5. MOUSE CURSOR TRAJECTORY & ACTIONS ──
        let mouseX = 800
        let mouseY = 800
        let isPressed = false
        let rippleProgress = 0

        // Scene 1: Click "Auto Allocate Targets" at (PHONE_X + 195, CONTENT_Y + 412)
        if (loopT < 4.2) {
            const targetX = PHONE_X + 195
            const targetY = CONTENT_Y + 412
            if (loopT < 1.0) {
                const p = easeOutCubic(loopT / 1.0)
                mouseX = 780 - p * (780 - targetX)
                mouseY = 600 - p * (600 - targetY)
            } else if (loopT < 2.6) {
                mouseX = targetX
                mouseY = targetY
            } else if (loopT < 3.0) {
                mouseX = targetX
                mouseY = targetY
                isPressed = true
                rippleProgress = (loopT - 2.6) / 0.4
            } else {
                const p = easeInOutCubic((loopT - 3.0) / 1.2)
                mouseX = targetX + p * 30
                mouseY = targetY + p * 40
            }
        }
        // Scene 2: Click "Generate Elimination Seeding" at (PHONE_X + 195, CONTENT_Y + 415)
        else if (loopT < 8.4) {
            const targetX = PHONE_X + 195
            const targetY = CONTENT_Y + 415
            const tInScene = loopT - 4.2
            if (tInScene < 1.5) {
                const p = easeOutCubic(tInScene / 1.5)
                mouseX = (PHONE_X + 225) - p * 30
                mouseY = (CONTENT_Y + 452) - p * 37
            } else if (tInScene < 2.6) {
                mouseX = targetX
                mouseY = targetY
            } else if (tInScene < 3.0) {
                mouseX = targetX
                mouseY = targetY
                isPressed = true
                rippleProgress = (tInScene - 2.6) / 0.4
            } else {
                const p = easeInOutCubic((tInScene - 3.0) / 1.2)
                mouseX = targetX - p * 20
                mouseY = targetY + p * 30
            }
        }
        // Scene 3: Click "Submit Final Match Result" at (PHONE_X + 195, CONTENT_Y + 400)
        else if (loopT < 12.8) {
            const targetX = PHONE_X + 195
            const targetY = CONTENT_Y + 400
            const tInScene = loopT - 8.4
            if (tInScene < 1.5) {
                const p = easeOutCubic(tInScene / 1.5)
                mouseX = (PHONE_X + 175) + p * 20
                mouseY = (CONTENT_Y + 445) - p * 45
            } else if (tInScene < 2.8) {
                mouseX = targetX
                mouseY = targetY
            } else if (tInScene < 3.2) {
                mouseX = targetX
                mouseY = targetY
                isPressed = true
                rippleProgress = (tInScene - 2.8) / 0.4
            } else {
                const p = easeInOutCubic((tInScene - 3.2) / 1.2)
                mouseX = targetX + p * 15
                mouseY = targetY + p * 25
            }
        }
        // Scene 4: Click "Issue All Certificates" at (PHONE_X + 195, CONTENT_Y + 380)
        else {
            const targetX = PHONE_X + 195
            const targetY = CONTENT_Y + 380
            const tInScene = loopT - 12.8
            if (tInScene < 1.2) {
                const p = easeOutCubic(tInScene / 1.2)
                mouseX = (PHONE_X + 210) - p * 15
                mouseY = (CONTENT_Y + 425) - p * 45
            } else if (tInScene < 2.0) {
                mouseX = targetX
                mouseY = targetY
            } else if (tInScene < 2.4) {
                mouseX = targetX
                mouseY = targetY
                isPressed = true
                rippleProgress = (tInScene - 2.0) / 0.4
            } else {
                const p = easeInOutCubic((tInScene - 2.4) / 1.8)
                mouseX = targetX + p * 60
                mouseY = targetY + p * 90
            }
        }

        // Draw Click Ripple & Cursor
        if (rippleProgress > 0 && rippleProgress <= 1) {
            drawRipple(mouseX, mouseY, rippleProgress)
        }
        drawMouseCursor(mouseX, mouseY, isPressed)

        // Restore Camera Transform
        ctx.restore()

        if (!isPaused.value) {
            animationFrameId = requestAnimationFrame(renderFrameFunc)
        }
    }

    animationFrameId = requestAnimationFrame(renderFrameFunc)
})

onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
    }
})
</script>

<style scoped>
.stage-wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0B0F17;
    overflow: hidden;
    user-select: none;
}

.stage-canvas {
    width: 1080px;
    height: 1080px;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    transform-origin: center center;
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
}
</style>
