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
            ctx.scale(0.92, 0.92)
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
        ctx.lineWidth = 1.8
        ctx.lineJoin = 'round'
        ctx.stroke()
        ctx.restore()
    }

    // Helper: Click Ripple Effect
    function drawRipple(x, y, progress) {
        if (progress <= 0 || progress >= 1) return
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, progress * 34, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(217, 255, 0, ${0.45 * (1 - progress)})`
        ctx.fill()
        ctx.strokeStyle = `rgba(15, 23, 42, ${0.4 * (1 - progress)})`
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
    }

    // ── Master 17.5-Second Loop (Calm Pacing & HD Crisp Typography) ──
    const TOTAL_DURATION = 17.5
    let startTime = null

    // Exact Phone Geometry matching Feature 01
    const PHONE_W = 370
    const PHONE_H = 750
    const PHONE_R = 44
    const PHONE_X = (1080 - PHONE_W) / 2 // 355
    const PHONE_Y = (1080 - PHONE_H) / 2 // 165

    renderFrameFunc = (timestamp) => {
        if (!startTime) startTime = timestamp
        const effectiveTime = isPaused.value ? (pausedAt - totalPausedDuration) : (timestamp - totalPausedDuration)
        const elapsed = ((effectiveTime - startTime) / 1000) % TOTAL_DURATION
        const loopT = elapsed

        // 1. Stage Background (Warm Architectural Neutral)
        ctx.fillStyle = '#ECEBE6'
        ctx.fillRect(0, 0, 1080, 1080)

        // Subtle ambient radial glow
        const bgGlow = ctx.createRadialGradient(540, 540, 60, 540, 540, 500)
        bgGlow.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
        bgGlow.addColorStop(1, 'rgba(236, 235, 230, 0)')
        ctx.fillStyle = bgGlow
        ctx.fillRect(0, 0, 1080, 1080)

        // Architectural fine dot grid
        ctx.fillStyle = 'rgba(148, 163, 184, 0.22)'
        for (let gx = 36; gx < 1080; gx += 36) {
            for (let gy = 36; gy < 1080; gy += 36) {
                ctx.beginPath()
                ctx.arc(gx, gy, 0.85, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        // 2. Timeline States & Camera Calculations
        let camZoom = 1.00
        let camPanY = 0
        let sceneIndex = 0
        let isAllocated = false
        let isSeeded = false
        let isWinnerRevealed = false
        let isIssued = false

        let cursorVisible = false
        let cursorX = 540, cursorY = 700
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        // Scene 1: Target Butt Allocation (0.0s - 4.4s)
        if (loopT < 4.4) {
            sceneIndex = 0
            if (loopT < 1.4) {
                const zt = easeInOutCubic(loopT / 1.4)
                camZoom = 1.00 + 0.38 * zt
                camPanY = -70 * zt
            } else {
                camZoom = 1.38
                camPanY = -70
            }

            const targetBtnY = 645
            if (loopT >= 1.2) {
                cursorVisible = true
                if (loopT < 2.4) {
                    const mt = easeInOutCubic((loopT - 1.2) / 1.2)
                    cursorX = 540
                    cursorY = 730 + (targetBtnY - 730) * mt
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (loopT >= 2.4) {
                    isAllocated = true
                    if (loopT >= 2.4 && loopT <= 2.9) {
                        cursorPressed = true
                        tapRipple = (loopT - 2.4) / 0.5
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // Scene 2: Live Standings & Team Calculation (4.4s - 8.8s)
        else if (loopT < 8.8) {
            sceneIndex = 1
            isAllocated = true
            const t2 = loopT - 4.4

            if (t2 < 1.2) {
                const zt = easeInOutCubic(t2 / 1.2)
                camZoom = 1.38 + (1.32 - 1.38) * zt
                camPanY = -70 + (-60 - (-70)) * zt
            } else {
                camZoom = 1.32
                camPanY = -60
            }

            const targetBtnY = 645
            if (t2 >= 0.8) {
                cursorVisible = true
                if (t2 < 2.2) {
                    const mt = easeInOutCubic((t2 - 0.8) / 1.4)
                    cursorX = 540
                    cursorY = 720 + (targetBtnY - 720) * mt
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (t2 >= 2.2) {
                    isSeeded = true
                    if (t2 >= 2.2 && t2 <= 2.7) {
                        cursorPressed = true
                        tapRipple = (t2 - 2.2) / 0.5
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // Scene 3: World Archery Matchplay Brackets (8.8s - 13.2s)
        else if (loopT < 13.2) {
            sceneIndex = 2
            isAllocated = true
            isSeeded = true
            const t3 = loopT - 8.8

            if (t3 < 1.2) {
                const zt = easeInOutCubic(t3 / 1.2)
                camZoom = 1.32 + (1.42 - 1.32) * zt
                camPanY = -60 + (-80 - (-60)) * zt
            } else {
                camZoom = 1.42
                camPanY = -80
            }

            const targetBtnY = 645
            if (t3 >= 0.8) {
                cursorVisible = true
                if (t3 < 2.2) {
                    const mt = easeInOutCubic((t3 - 0.8) / 1.4)
                    cursorX = 540
                    cursorY = 730 + (targetBtnY - 730) * mt
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (t3 >= 2.2) {
                    isWinnerRevealed = true
                    if (t3 >= 2.2 && t3 <= 2.7) {
                        cursorPressed = true
                        tapRipple = (t3 - 2.2) / 0.5
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // Scene 4: Digital Certificates Issuance (13.2s - 17.5s)
        else {
            sceneIndex = 3
            isAllocated = true
            isSeeded = true
            isWinnerRevealed = true
            const t4 = loopT - 13.2

            if (t4 < 1.2) {
                const zt = easeInOutCubic(t4 / 1.2)
                camZoom = 1.42 + (1.38 - 1.42) * zt
                camPanY = -80 + (-70 - (-80)) * zt
            } else if (t4 > 3.2) {
                const ot = easeInOutCubic((t4 - 3.2) / 1.1)
                camZoom = 1.38 + (1.00 - 1.38) * ot
                camPanY = -70 * (1 - ot)
            } else {
                camZoom = 1.38
                camPanY = -70
            }

            const targetBtnY = 645
            if (t4 >= 0.6) {
                cursorVisible = true
                if (t4 < 1.8) {
                    const mt = easeInOutCubic((t4 - 0.6) / 1.2)
                    cursorX = 540
                    cursorY = 720 + (targetBtnY - 720) * mt
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (t4 >= 1.8) {
                    isIssued = true
                    if (t4 >= 1.8 && t4 <= 2.3) {
                        cursorPressed = true
                        tapRipple = (t4 - 1.8) / 0.5
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }

        // 3. Apply Camera Zoom Transform
        ctx.save()
        ctx.translate(540, 540 + camPanY)
        ctx.scale(camZoom, camZoom)
        ctx.translate(-540, -540)

        // 4. Phone Shadow & Chassis
        ctx.save()
        ctx.shadowColor = 'rgba(15, 23, 42, 0.26)'
        ctx.shadowBlur = 48
        ctx.shadowOffsetY = 24
        drawRoundedRect(PHONE_X, PHONE_Y, PHONE_W, PHONE_H, PHONE_R, '#181A1D')
        ctx.restore()

        // Outer Bezel
        drawRoundedRect(PHONE_X, PHONE_Y, PHONE_W, PHONE_H, PHONE_R, '#181A1D', '#334155', 2.5)

        // Screen Clip Region (Inset 10px)
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

        // Screen Canvas Background
        ctx.fillStyle = '#F8FAFC'
        ctx.fillRect(SCREEN_X, SCREEN_Y, SCREEN_W, SCREEN_H)

        // Status Bar (9:41, Dynamic Island, Battery)
        ctx.fillStyle = '#0F172A'
        ctx.font = '600 13px Inter, -apple-system, sans-serif'
        ctx.fillText('9:41', SCREEN_X + 24, SCREEN_Y + 28)

        // Battery & Signal
        ctx.fillStyle = '#0F172A'
        ctx.fillRect(SCREEN_X + SCREEN_W - 48, SCREEN_Y + 18, 18, 9)
        drawRoundedRect(SCREEN_X + SCREEN_W - 50, SCREEN_Y + 16, 22, 13, 3, null, '#0F172A', 1.5)
        ctx.fillRect(SCREEN_X + SCREEN_W - 27, SCREEN_Y + 20, 2, 5)

        // Dynamic Island
        drawRoundedRect(SCREEN_X + (SCREEN_W - 108) / 2, SCREEN_Y + 11, 108, 24, 12, '#000000')

        // ── Direct Content Space (NO PERSISTENT APP HEADER - Pure Clean Flow) ──
        const CONTENT_X = SCREEN_X + 16
        const CONTENT_Y = SCREEN_Y + 52
        const CONTENT_W = SCREEN_W - 32

        // ========================================================
        // SCENE 1: TARGET BUTT ALLOCATION (0.0s - 4.4s)
        // ========================================================
        if (sceneIndex === 0) {
            // Page Heading
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Target Management', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Target Butt Allocation', CONTENT_X, CONTENT_Y + 38)

            // Division Hero Card
            const heroY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, heroY, CONTENT_W, 70, 16, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Recurve Men Open 70m', CONTENT_X + 16, heroY + 28)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11.5px Inter, sans-serif'
            ctx.fillText('40 Targets · 160 Archers (4 / Target)', CONTENT_X + 16, heroY + 48)

            // Round Badge
            drawRoundedRect(CONTENT_X + CONTENT_W - 76, heroY + 20, 62, 26, 8, '#F1F5F9')
            ctx.fillStyle = '#334155'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Round 1', CONTENT_X + CONTENT_W - 68, heroY + 37)

            // Target Matrix Bento Rows (Target 01, Target 02, Target 03)
            const matrixY = heroY + 82
            const targets = [
                {
                    lane: 'Target 01',
                    archers: isAllocated 
                        ? ['A: Arif Dwi (Fast AC)', 'B: Riau Ega (Eagle AC)', 'C: Bagas P. (Focus)', 'D: Hendra W. (Alpha)'] 
                        : ['A: Unassigned', 'B: Unassigned', 'C: Unassigned', 'D: Unassigned']
                },
                {
                    lane: 'Target 02',
                    archers: isAllocated 
                        ? ['A: Diananda C. (Fast AC)', 'B: Rezza O. (Focus)', 'C: Linda S. (Eagle)', 'D: Nurul H. (Prime)'] 
                        : ['A: Unassigned', 'B: Unassigned', 'C: Unassigned', 'D: Unassigned']
                },
                {
                    lane: 'Target 03',
                    archers: isAllocated 
                        ? ['A: Fathur R. (Alpha)', 'B: Kenzo A. (Fast AC)', 'C: Dimas W. (Focus)', 'D: Gilang P. (Prime)'] 
                        : ['A: Unassigned', 'B: Unassigned', 'C: Unassigned', 'D: Unassigned']
                }
            ]

            targets.forEach((t, tIdx) => {
                const tY = matrixY + tIdx * 102
                drawRoundedRect(CONTENT_X, tY, CONTENT_W, 92, 14, '#FFFFFF', '#E2E8F0', 1.5)

                // Lane Name
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
                ctx.fillText(t.lane, CONTENT_X + 14, tY + 22)

                // Status Badge
                const pillW = isAllocated ? 74 : 84
                drawRoundedRect(
                    CONTENT_X + CONTENT_W - pillW - 12, 
                    tY + 8, 
                    pillW, 
                    22, 
                    7, 
                    isAllocated ? 'rgba(217, 255, 0, 0.3)' : '#F1F5F9',
                    isAllocated ? '#0F172A' : null,
                    1
                )
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 10px Inter, sans-serif'
                ctx.fillText(isAllocated ? '● Assigned' : '○ Pending', CONTENT_X + CONTENT_W - pillW - 4, tY + 23)

                // 4 Archer Position Pills in 2x2 grid
                t.archers.forEach((arch, aIdx) => {
                    const col = aIdx % 2
                    const row = Math.floor(aIdx / 2)
                    const aW = (CONTENT_W - 36) / 2
                    const aX = CONTENT_X + 12 + col * (aW + 12)
                    const aY = tY + 36 + row * 24

                    drawRoundedRect(aX, aY, aW, 20, 6, isAllocated ? '#F8FAFC' : '#FAFAFA', '#E2E8F0', 1)
                    ctx.fillStyle = isAllocated ? '#0F172A' : '#94A3B8'
                    ctx.font = isAllocated ? '600 9.5px Inter, sans-serif' : '500 9.5px Inter, sans-serif'
                    ctx.fillText(arch, aX + 6, aY + 14)
                })
            })

            // Bottom CTA Button: Auto Allocate Targets
            const btnY = matrixY + 3 * 102 + 14
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            if (isAllocated) {
                ctx.fillText('160 Archers Allocated (40 Targets)', CONTENT_X + 44, btnY + 32)
            } else {
                ctx.fillText('Auto Allocate Targets', CONTENT_X + 90, btnY + 32)
            }
        }

        // ========================================================
        // SCENE 2: LIVE STANDINGS & TEAM CALCULATION (4.4s - 8.8s)
        // ========================================================
        else if (sceneIndex === 1) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Live Qualification Scoring', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Individual & Team Standings', CONTENT_X, CONTENT_Y + 38)

            // Individual Leaderboard Card
            const rankCardY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, rankCardY, CONTENT_W, 186, 16, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12.5px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Individual Leaderboard (72 Arrows)', CONTENT_X + 16, rankCardY + 24)

            const archersData = [
                { rank: '1', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club', score: '682', detail: '38X · 42 Tens', isVolt: true },
                { rank: '2', name: 'Riau Ega Agatha', club: 'Eagle Archery Club', score: '678', detail: '34X · 40 Tens', isVolt: false },
                { rank: '3', name: 'Diananda Choirunisa', club: 'Fast Archery Club', score: '671', detail: '29X · 37 Tens', isVolt: false },
            ]

            archersData.forEach((a, idx) => {
                const rowY = rankCardY + 38 + idx * 46
                
                // Rank Badge
                drawRoundedRect(CONTENT_X + 14, rowY + 4, 24, 24, 7, a.isVolt ? '#D9FF00' : '#F1F5F9')
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 12px Inter, sans-serif'
                ctx.fillText(a.rank, CONTENT_X + 22, rowY + 21)

                // Archer Info
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px Inter, sans-serif'
                ctx.fillText(a.name, CONTENT_X + 46, rowY + 18)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 10.5px Inter, sans-serif'
                ctx.fillText(a.club, CONTENT_X + 46, rowY + 32)

                // Score & Tens
                ctx.fillStyle = '#0F172A'
                ctx.font = '800 15px Space Grotesk, Inter, sans-serif'
                ctx.fillText(a.score, CONTENT_X + CONTENT_W - 74, rowY + 18)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9.5px Inter, sans-serif'
                ctx.fillText(a.detail, CONTENT_X + CONTENT_W - 78, rowY + 32)

                if (idx < archersData.length - 1) {
                    ctx.fillStyle = '#F1F5F9'
                    ctx.fillRect(CONTENT_X + 16, rowY + 42, CONTENT_W - 32, 1)
                }
            })

            // Team Aggregation Card
            const teamCardY = rankCardY + 198
            drawRoundedRect(CONTENT_X, teamCardY, CONTENT_W, 140, 16, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px Inter, sans-serif'
            ctx.fillText('Automated Team Aggregation', CONTENT_X + 16, teamCardY + 22)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Fast Archery Club (Men Team)', CONTENT_X + 16, teamCardY + 42)

            // Formula Box
            drawRoundedRect(CONTENT_X + 14, teamCardY + 54, CONTENT_W - 28, 42, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Top 3 Archers Auto-Sum: 682 + 678 + 671', CONTENT_X + 22, teamCardY + 71)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Team Total: 2,031 Pts · Seed #1', CONTENT_X + 22, teamCardY + 87)

            // Status Pill
            drawRoundedRect(CONTENT_X + 16, teamCardY + 104, 148, 24, 6, 'rgba(217, 255, 0, 0.3)', '#0F172A', 1)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10.5px Inter, sans-serif'
            ctx.fillText('✓ Qualified for Team Finals', CONTENT_X + 24, teamCardY + 120)

            // Action Button: Export Elimination Seeding
            const btnY = teamCardY + 154
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            if (isSeeded) {
                ctx.fillText('Seeding Generated (Top 16)', CONTENT_X + 66, btnY + 32)
            } else {
                ctx.fillText('Generate Elimination Seeding', CONTENT_X + 58, btnY + 32)
            }
        }

        // ========================================================
        // SCENE 3: WORLD ARCHERY MATCHPLAY BRACKETS (8.8s - 13.2s)
        // ========================================================
        else if (sceneIndex === 2) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Matchplay Engine', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('World Archery Brackets', CONTENT_X, CONTENT_Y + 38)

            // Bracket Card
            const bracketCardY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, bracketCardY, CONTENT_W, 314, 16, '#FFFFFF', '#E2E8F0', 1.5)

            // Round Switcher
            drawRoundedRect(CONTENT_X + 16, bracketCardY + 16, 120, 26, 8, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Gold Medal Match', CONTENT_X + 24, bracketCardY + 33)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('World Archery Set System', CONTENT_X + 148, bracketCardY + 33)

            // Match Box (Arif vs Riau)
            const matchBoxY = bracketCardY + 52
            drawRoundedRect(CONTENT_X + 14, matchBoxY, CONTENT_W - 28, 164, 14, '#F8FAFC', '#E2E8F0', 1.5)

            // Athlete 1: Arif Dwi
            drawRoundedRect(
                CONTENT_X + 22, 
                matchBoxY + 12, 
                CONTENT_W - 44, 
                44, 
                10, 
                isWinnerRevealed ? 'rgba(217, 255, 0, 0.28)' : '#FFFFFF', 
                isWinnerRevealed ? '#0F172A' : '#E2E8F0', 
                1.5
            )

            drawRoundedRect(CONTENT_X + 30, matchBoxY + 22, 24, 24, 6, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11px Inter, sans-serif'
            ctx.fillText('1', CONTENT_X + 39, matchBoxY + 38)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px Inter, sans-serif'
            ctx.fillText('Arif Dwi Pangestu', CONTENT_X + 62, matchBoxY + 38)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('6', CONTENT_X + CONTENT_W - 68, matchBoxY + 40)

            // Athlete 2: Riau Ega
            drawRoundedRect(CONTENT_X + 22, matchBoxY + 62, CONTENT_W - 44, 44, 10, '#FFFFFF', '#E2E8F0', 1.5)

            drawRoundedRect(CONTENT_X + 30, matchBoxY + 72, 24, 24, 6, '#64748B')
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 11px Inter, sans-serif'
            ctx.fillText('2', CONTENT_X + 39, matchBoxY + 88)

            ctx.fillStyle = '#0F172A'
            ctx.font = '600 13px Inter, sans-serif'
            ctx.fillText('Riau Ega Agatha', CONTENT_X + 62, matchBoxY + 88)

            ctx.fillStyle = '#64748B'
            ctx.font = '700 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('3', CONTENT_X + CONTENT_W - 68, matchBoxY + 90)

            // Set Points Breakdown Grid
            const setGridY = matchBoxY + 114
            const setCols = [
                { title: 'Set 1 (2pts)', score: '29 - 28' },
                { title: 'Set 2 (1pt)', score: '30 - 30' },
                { title: 'Set 3 (2pts)', score: '29 - 27' },
                { title: 'Set 4 (1pt)', score: '28 - 28' },
            ]
            const setColW = (CONTENT_W - 62) / 4
            setCols.forEach((col, cIdx) => {
                const cX = CONTENT_X + 22 + cIdx * (setColW + 6)
                drawRoundedRect(cX, setGridY, setColW, 38, 6, '#FFFFFF', '#E2E8F0', 1)
                ctx.fillStyle = '#64748B'
                ctx.font = '500 8.5px Inter, sans-serif'
                ctx.fillText(col.title, cX + 6, setGridY + 14)

                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11px Space Grotesk, Inter, sans-serif'
                ctx.fillText(col.score, cX + 6, setGridY + 30)
            })

            // Champion Banner (Revealed after submit)
            if (isWinnerRevealed) {
                drawRoundedRect(CONTENT_X + 14, bracketCardY + 226, CONTENT_W - 28, 74, 12, '#0F172A')
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 11px Inter, sans-serif'
                ctx.fillText('Gold Medal Champion', CONTENT_X + 26, bracketCardY + 248)

                ctx.fillStyle = '#FFFFFF'
                ctx.font = '700 14.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Arif Dwi Pangestu', CONTENT_X + 26, bracketCardY + 268)

                ctx.fillStyle = '#D9FF00'
                ctx.font = '600 11px Inter, sans-serif'
                ctx.fillText('Set Score 6 - 3', CONTENT_X + CONTENT_W - 106, bracketCardY + 268)

                ctx.fillStyle = '#94A3B8'
                ctx.font = '500 10px Inter, sans-serif'
                ctx.fillText('Fast Archery Club · Recurve Men Open 70m', CONTENT_X + 26, bracketCardY + 286)
            } else {
                drawRoundedRect(CONTENT_X + 14, bracketCardY + 226, CONTENT_W - 28, 74, 12, '#F1F5F9')
                ctx.fillStyle = '#64748B'
                ctx.font = '600 11.5px Inter, sans-serif'
                ctx.fillText('Final Set in Progress (Set 4: 28-28)', CONTENT_X + 26, bracketCardY + 256)

                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Ready for Official Score Lock', CONTENT_X + 26, bracketCardY + 278)
            }

            // CTA Button: Submit Final Match Result
            const btnY = bracketCardY + 332
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            if (isWinnerRevealed) {
                ctx.fillText('Match Verified and Official', CONTENT_X + 74, btnY + 32)
            } else {
                ctx.fillText('Submit Final Match Result', CONTENT_X + 70, btnY + 32)
            }
        }

        // ========================================================
        // SCENE 4: DIGITAL E-CERTIFICATES (13.2s - 17.5s)
        // ========================================================
        else {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Awards and Recognition', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Verified E-Certificates', CONTENT_X, CONTENT_Y + 38)

            // Certificate Preview Card
            const certCardY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, certCardY, CONTENT_W, 296, 16, '#FFFFFF', '#E2E8F0', 1.5)

            // Inner Gold / Dark Certificate Frame
            const certInnerY = certCardY + 14
            drawRoundedRect(CONTENT_X + 14, certInnerY, CONTENT_W - 28, 268, 12, '#0F172A', '#D9FF00', 1.5)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 9.5px Inter, sans-serif'
            ctx.fillText('Official Digital Certificate', CONTENT_X + 28, certInnerY + 30)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 17px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Certificate of Excellence', CONTENT_X + 28, certInnerY + 56)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 10.5px Inter, sans-serif'
            ctx.fillText('This is proudly presented to:', CONTENT_X + 28, certInnerY + 80)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Arif Dwi Pangestu', CONTENT_X + 28, certInnerY + 106)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '600 12.5px Inter, sans-serif'
            ctx.fillText('1st Place · Gold Medal Champion', CONTENT_X + 28, certInnerY + 128)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Recurve Men Open 70m · Archeris National Open', CONTENT_X + 28, certInnerY + 146)

            // QR Badge
            const qrCardY = certInnerY + 166
            drawRoundedRect(CONTENT_X + 26, qrCardY, CONTENT_W - 52, 78, 8, '#1E293B', '#334155', 1)

            const qrX = CONTENT_X + 36
            const qrY = qrCardY + 11
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

            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11px Inter, sans-serif'
            ctx.fillText('Verified by Archeris', qrX + 68, qrY + 20)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px Inter, sans-serif'
            ctx.fillText('UUID: cert-88401-2026', qrX + 68, qrY + 36)
            ctx.fillText('Direct WhatsApp & Email Delivery', qrX + 68, qrY + 50)

            // Bottom CTA Button: Batch Issue All Certificates
            const btnY = certCardY + 314
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            if (isIssued) {
                ctx.fillText('160 Certificates Issued and Sent', CONTENT_X + 54, btnY + 32)
            } else {
                ctx.fillText('Issue All Certificates (160 Archers)', CONTENT_X + 44, btnY + 32)
            }
        }

        // ── FLOATING BOTTOM DOCK ──
        const DOCK_Y = SCREEN_Y + SCREEN_H - 58
        const DOCK_W = SCREEN_W - 32
        const DOCK_X = SCREEN_X + 16
        drawRoundedRect(DOCK_X, DOCK_Y, DOCK_W, 44, 22, '#0F172A', '#334155', 1)

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
                drawRoundedRect(iX, DOCK_Y + 5, dockItemW, 34, 17, '#D9FF00')
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11px Space Grotesk, Inter, sans-serif'
                ctx.fillText(item.label, iX + (dockItemW - ctx.measureText(item.label).width) / 2, DOCK_Y + 26)
            } else {
                ctx.fillStyle = '#94A3B8'
                ctx.font = '500 10.5px Inter, sans-serif'
                ctx.fillText(item.label, iX + (dockItemW - ctx.measureText(item.label).width) / 2, DOCK_Y + 26)
            }
        })

        // Home Indicator
        drawRoundedRect(SCREEN_X + (SCREEN_W - 120) / 2, SCREEN_Y + SCREEN_H - 8, 120, 4, 2, '#0F172A')

        ctx.restore() // Restore screen clip

        // 5. Draw Ripple & Mouse Cursor
        if (tapRipple > 0 && tapRipple <= 1) {
            drawRipple(tapX, tapY, tapRipple)
        }
        if (cursorVisible) {
            drawMouseCursor(cursorX, cursorY, cursorPressed)
        }

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
