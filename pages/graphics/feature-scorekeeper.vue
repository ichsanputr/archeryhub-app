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

    // ── Master 17.5-Second Loop (Scorekeeper Field Operations) ──
    const TOTAL_DURATION = 17.5
    let startTime = null

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

        // 1. Stage Background
        ctx.fillStyle = '#ECEBE6'
        ctx.fillRect(0, 0, 1080, 1080)

        const bgGlow = ctx.createRadialGradient(540, 540, 60, 540, 540, 500)
        bgGlow.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
        bgGlow.addColorStop(1, 'rgba(236, 235, 230, 0)')
        ctx.fillStyle = bgGlow
        ctx.fillRect(0, 0, 1080, 1080)

        ctx.fillStyle = 'rgba(148, 163, 184, 0.22)'
        for (let gx = 36; gx < 1080; gx += 36) {
            for (let gy = 36; gy < 1080; gy += 36) {
                ctx.beginPath()
                ctx.arc(gx, gy, 0.85, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        // 2. Timeline States & Camera Zoom
        let camZoom = 1.00
        let camPanY = 0
        let sceneIndex = 0
        let isArrowInputDone = false
        let isSynced = false
        let isLocked = false

        let cursorVisible = false
        let cursorX = 540, cursorY = 700
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        // Scene 1: Target Lane & Athlete Select (0.0s - 4.4s)
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

                if (loopT >= 2.4 && loopT <= 2.9) {
                    cursorPressed = true
                    tapRipple = (loopT - 2.4) / 0.5
                    tapX = 540; tapY = targetBtnY
                }
            }
        }
        // Scene 2: Ergonomic Arrow Keypad Input (4.4s - 8.8s)
        else if (loopT < 8.8) {
            sceneIndex = 1
            const t2 = loopT - 4.4

            if (t2 < 1.2) {
                const zt = easeInOutCubic(t2 / 1.2)
                camZoom = 1.38 + (1.42 - 1.38) * zt
                camPanY = -70 + (-60 - (-70)) * zt
            } else {
                camZoom = 1.42
                camPanY = -60
            }

            const targetBtnY = 645
            if (t2 >= 0.6) {
                cursorVisible = true
                // Simulate rapid keypad tapping (X, 10, 10, 9, 9, 8)
                if (t2 < 1.0) {
                    cursorX = 420; cursorY = 530 // Tapping X
                    cursorPressed = true
                } else if (t2 < 1.4) {
                    cursorX = 500; cursorY = 530 // Tapping 10
                    cursorPressed = true
                } else if (t2 < 1.8) {
                    cursorX = 500; cursorY = 530 // Tapping 10
                    cursorPressed = true
                } else if (t2 < 2.2) {
                    cursorX = 580; cursorY = 530 // Tapping 9
                    cursorPressed = true
                } else if (t2 < 2.8) {
                    const mt = easeInOutCubic((t2 - 2.2) / 0.6)
                    cursorX = 580 + (540 - 580) * mt
                    cursorY = 530 + (targetBtnY - 530) * mt
                    cursorPressed = false
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                    isArrowInputDone = true
                    if (t2 >= 2.8 && t2 <= 3.3) {
                        cursorPressed = true
                        tapRipple = (t2 - 2.8) / 0.5
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // Scene 3: Real-Time Leaderboard Cloud Sync (8.8s - 13.2s)
        else if (loopT < 13.2) {
            sceneIndex = 2
            isArrowInputDone = true
            isSynced = true
            const t3 = loopT - 8.8

            if (t3 < 1.2) {
                const zt = easeInOutCubic(t3 / 1.2)
                camZoom = 1.42 + (1.35 - 1.42) * zt
                camPanY = -60 + (-50 - (-60)) * zt
            } else {
                camZoom = 1.35
                camPanY = -50
            }

            const targetBtnY = 645
            if (t3 >= 0.8) {
                cursorVisible = true
                if (t3 < 2.2) {
                    const mt = easeInOutCubic((t3 - 0.8) / 1.4)
                    cursorX = 540
                    cursorY = 720 + (targetBtnY - 720) * mt
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (t3 >= 2.2 && t3 <= 2.7) {
                    cursorPressed = true
                    tapRipple = (t3 - 2.2) / 0.5
                    tapX = 540; tapY = targetBtnY
                }
            }
        }
        // Scene 4: Digital Sign-off & Audit Lock (13.2s - 17.5s)
        else {
            sceneIndex = 3
            isArrowInputDone = true
            isSynced = true
            const t4 = loopT - 13.2

            if (t4 < 1.2) {
                const zt = easeInOutCubic(t4 / 1.2)
                camZoom = 1.35 + (1.40 - 1.35) * zt
                camPanY = -50 + (-65 - (-50)) * zt
            } else if (t4 > 3.2) {
                const ot = easeInOutCubic((t4 - 3.2) / 1.1)
                camZoom = 1.40 + (1.00 - 1.40) * ot
                camPanY = -65 * (1 - ot)
            } else {
                camZoom = 1.40
                camPanY = -65
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
                    isLocked = true
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

        drawRoundedRect(PHONE_X, PHONE_Y, PHONE_W, PHONE_H, PHONE_R, '#181A1D', '#334155', 2.5)

        // Screen Clip Region
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

        // Canvas Background
        ctx.fillStyle = '#F8FAFC'
        ctx.fillRect(SCREEN_X, SCREEN_Y, SCREEN_W, SCREEN_H)

        // Status Bar
        ctx.fillStyle = '#0F172A'
        ctx.font = '600 13px Inter, -apple-system, sans-serif'
        ctx.fillText('9:41', SCREEN_X + 24, SCREEN_Y + 28)

        ctx.fillStyle = '#0F172A'
        ctx.fillRect(SCREEN_X + SCREEN_W - 48, SCREEN_Y + 18, 18, 9)
        drawRoundedRect(SCREEN_X + SCREEN_W - 50, SCREEN_Y + 16, 22, 13, 3, null, '#0F172A', 1.5)
        ctx.fillRect(SCREEN_X + SCREEN_W - 27, SCREEN_Y + 20, 2, 5)

        drawRoundedRect(SCREEN_X + (SCREEN_W - 108) / 2, SCREEN_Y + 11, 108, 24, 12, '#000000')

        // ── Direct Content Space (NO PERSISTENT TOP APP HEADER) ──
        const CONTENT_X = SCREEN_X + 16
        const CONTENT_Y = SCREEN_Y + 52
        const CONTENT_W = SCREEN_W - 32

        // ========================================================
        // SCENE 1: TARGET LANE & ATHLETE SELECTION (0.0s - 4.4s)
        // ========================================================
        if (sceneIndex === 0) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Session 1: Qualification 70m', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Scorekeeper Terminal', CONTENT_X, CONTENT_Y + 38)

            // Target Lane Card
            const laneCardY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, laneCardY, CONTENT_W, 72, 16, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 16px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Target 12 (Lane Roster)', CONTENT_X + 16, laneCardY + 28)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('Recurve Men Open 70m · 4 Athletes', CONTENT_X + 16, laneCardY + 48)

            drawRoundedRect(CONTENT_X + CONTENT_W - 92, laneCardY + 20, 78, 26, 8, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10.5px Inter, sans-serif'
            ctx.fillText('Lane Active', CONTENT_X + CONTENT_W - 84, laneCardY + 37)

            // 4 Athletes in Lane 12
            const athletesY = laneCardY + 84
            const archers = [
                { pos: '12A', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club', score: '98 pts', selected: true },
                { pos: '12B', name: 'Riau Ega Agatha', club: 'Eagle Archery Club', score: '96 pts', selected: false },
                { pos: '12C', name: 'Bagas Prastyo', club: 'Focus Archery Club', score: '94 pts', selected: false },
                { pos: '12D', name: 'Hendra Wijaya', club: 'Alpha Archery Club', score: '92 pts', selected: false }
            ]

            archers.forEach((a, aIdx) => {
                const aY = athletesY + aIdx * 64
                drawRoundedRect(
                    CONTENT_X, 
                    aY, 
                    CONTENT_W, 
                    56, 
                    14, 
                    a.selected ? 'rgba(217, 255, 0, 0.28)' : '#FFFFFF', 
                    a.selected ? '#0F172A' : '#E2E8F0', 
                    a.selected ? 1.5 : 1
                )

                // Position Tag
                drawRoundedRect(CONTENT_X + 12, aY + 12, 32, 32, 8, a.selected ? '#0F172A' : '#F1F5F9')
                ctx.fillStyle = a.selected ? '#D9FF00' : '#0F172A'
                ctx.font = '800 12px Inter, sans-serif'
                ctx.fillText(a.pos, CONTENT_X + 17, aY + 32)

                // Name & Club
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px Inter, sans-serif'
                ctx.fillText(a.name, CONTENT_X + 52, aY + 24)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 10.5px Inter, sans-serif'
                ctx.fillText(a.club, CONTENT_X + 52, aY + 40)

                // Score
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
                ctx.fillText(a.score, CONTENT_X + CONTENT_W - 64, aY + 32)
            })

            // Bottom CTA Button: Enter Scoresheet
            const btnY = athletesY + 4 * 64 + 10
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Enter Scoresheet (Target 12A)', CONTENT_X + 64, btnY + 32)
        }

        // ========================================================
        // SCENE 2: ERGONOMIC KEYPAD INPUT (4.4s - 8.8s)
        // ========================================================
        else if (sceneIndex === 1) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Scoresheet Style Scoring', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('End 1 Arrow Entry', CONTENT_X, CONTENT_Y + 38)

            // Current Athlete Mini Header
            const athleteMiniY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, athleteMiniY, CONTENT_W, 46, 12, '#0F172A')
            
            drawRoundedRect(CONTENT_X + 10, athleteMiniY + 8, 28, 28, 6, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 11px Inter, sans-serif'
            ctx.fillText('12A', CONTENT_X + 14, athleteMiniY + 26)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Arif Dwi Pangestu (Fast Archery)', CONTENT_X + 46, athleteMiniY + 28)

            // Scoresheet Table for End 1
            const sheetY = athleteMiniY + 56
            drawRoundedRect(CONTENT_X, sheetY, CONTENT_W, 142, 16, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px Inter, sans-serif'
            ctx.fillText('END 1 ARROWS (6 ARROWS)', CONTENT_X + 16, sheetY + 22)

            // 6 Arrow Cells
            const arrows = isArrowInputDone ? ['X', '10', '10', '9', '9', '8'] : ['X', '10', '10', '9', '·', '·']
            const arrowW = (CONTENT_W - 48) / 6
            arrows.forEach((arr, arrIdx) => {
                const aX = CONTENT_X + 16 + arrIdx * (arrowW + 3)
                const aY = sheetY + 36
                const isTen = arr === 'X' || arr === '10'
                drawRoundedRect(aX, aY, arrowW, 40, 8, isTen ? '#D9FF00' : (arr === '·' ? '#F8FAFC' : '#F1F5F9'), isTen ? '#0F172A' : '#E2E8F0', 1)
                
                ctx.fillStyle = '#0F172A'
                ctx.font = '800 15px Space Grotesk, Inter, sans-serif'
                ctx.fillText(arr, aX + (arrowW - ctx.measureText(arr).width) / 2, aY + 26)
            })

            // Subtotal & 10s Summary
            drawRoundedRect(CONTENT_X + 14, sheetY + 88, CONTENT_W - 28, 42, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('End 1 Subtotal:', CONTENT_X + 24, sheetY + 114)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 16px Space Grotesk, Inter, sans-serif'
            ctx.fillText(isArrowInputDone ? '56 Pts (3 Tens · 1X)' : '39 Pts (in progress)', CONTENT_X + CONTENT_W - 170, sheetY + 114)

            // Ergonomic Keypad Grid (2 Rows x 4 Keys)
            const padY = sheetY + 154
            drawRoundedRect(CONTENT_X, padY, CONTENT_W, 126, 16, '#0F172A')

            const keysRow1 = ['X', '10', '9', '8']
            const keysRow2 = ['7', '6', '5', 'M']
            const keyW = (CONTENT_W - 40) / 4

            keysRow1.forEach((k, kIdx) => {
                const kX = CONTENT_X + 14 + kIdx * (keyW + 4)
                const isGold = k === 'X' || k === '10'
                drawRoundedRect(kX, padY + 14, keyW, 44, 10, isGold ? '#D9FF00' : '#1E293B')
                ctx.fillStyle = isGold ? '#0F172A' : '#FFFFFF'
                ctx.font = '800 16px Space Grotesk, Inter, sans-serif'
                ctx.fillText(k, kX + (keyW - ctx.measureText(k).width) / 2, padY + 42)
            })

            keysRow2.forEach((k, kIdx) => {
                const kX = CONTENT_X + 14 + kIdx * (keyW + 4)
                drawRoundedRect(kX, padY + 68, keyW, 44, 10, '#1E293B')
                ctx.fillStyle = '#FFFFFF'
                ctx.font = '800 16px Space Grotesk, Inter, sans-serif'
                ctx.fillText(k, kX + (keyW - ctx.measureText(k).width) / 2, padY + 96)
            })

            // Bottom CTA Button: Save End & Next
            const btnY = padY + 138
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText(isArrowInputDone ? 'End 1 Confirmed · Save & Next' : 'Enter 6 Arrows', CONTENT_X + 66, btnY + 32)
        }

        // ========================================================
        // SCENE 3: REAL-TIME LEADERBOARD CLOUD SYNC (8.8s - 13.2s)
        // ========================================================
        else if (sceneIndex === 2) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Live Cloud Synchronization', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Running Total & Audit', CONTENT_X, CONTENT_Y + 38)

            // Running Grand Total Card
            const totalCardY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, totalCardY, CONTENT_W, 168, 16, '#FFFFFF', '#E2E8F0', 1.5)

            // Sync Status Pill Header
            drawRoundedRect(CONTENT_X + 14, totalCardY + 14, CONTENT_W - 28, 36, 8, 'rgba(217, 255, 0, 0.28)', '#0F172A', 1)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11px Inter, sans-serif'
            ctx.fillText('● Synced to Live Leaderboard', CONTENT_X + 24, totalCardY + 36)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px Inter, sans-serif'
            ctx.fillText('Rank #1 in Recurve Men', CONTENT_X + CONTENT_W - 146, totalCardY + 36)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 28px Space Grotesk, Inter, sans-serif'
            ctx.fillText('338', CONTENT_X + 18, totalCardY + 104)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('Half 1 Qualification (6 Ends Completed)', CONTENT_X + 82, totalCardY + 92)
            ctx.fillText('36 Arrows · 19 Tens · 9 Xs', CONTENT_X + 82, totalCardY + 110)

            // 6-End Breakdown Pill Row
            const endRowY = totalCardY + 128
            const endScores = ['E1: 56', 'E2: 57', 'E3: 55', 'E4: 58', 'E5: 56', 'E6: 56']
            const eW = (CONTENT_W - 48) / 6
            endScores.forEach((e, eIdx) => {
                const eX = CONTENT_X + 14 + eIdx * (eW + 4)
                drawRoundedRect(eX, endRowY, eW, 26, 6, '#F8FAFC', '#E2E8F0', 1)
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 9px Inter, sans-serif'
                ctx.fillText(e, eX + 4, endRowY + 17)
            })

            // Live Comparison Card (Top 3 in Lane)
            const compCardY = totalCardY + 180
            drawRoundedRect(CONTENT_X, compCardY, CONTENT_W, 140, 16, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px Inter, sans-serif'
            ctx.fillText('LANE 12 STANDINGS RECAP', CONTENT_X + 16, compCardY + 22)

            const laneStandings = [
                { pos: '12A', name: 'Arif Dwi Pangestu', score: '338 Pts', rank: '#1' },
                { pos: '12B', name: 'Riau Ega Agatha', score: '334 Pts', rank: '#2' },
                { pos: '12C', name: 'Bagas Prastyo', score: '328 Pts', rank: '#3' }
            ]

            laneStandings.forEach((ls, lsIdx) => {
                const lsY = compCardY + 36 + lsIdx * 32
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11.5px Inter, sans-serif'
                ctx.fillText(`${ls.pos} · ${ls.name}`, CONTENT_X + 16, lsY + 18)

                ctx.font = '800 12.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText(ls.score, CONTENT_X + CONTENT_W - 80, lsY + 18)
            })

            // Bottom CTA Button: Review and Lock
            const btnY = compCardY + 152
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Review and Sign Scorecard', CONTENT_X + 78, btnY + 32)
        }

        // ========================================================
        // SCENE 4: DIGITAL SIGN-OFF & AUDIT LOCK (13.2s - 17.5s)
        // ========================================================
        else {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Official Referee Verification', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Digital Sign-off & Lock', CONTENT_X, CONTENT_Y + 38)

            // Audit Modal Card
            const modalY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, modalY, CONTENT_W, 310, 16, '#FFFFFF', '#E2E8F0', 1.5)

            // Top Header
            drawRoundedRect(CONTENT_X + 14, modalY + 14, CONTENT_W - 28, 48, 10, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10.5px Inter, sans-serif'
            ctx.fillText('OFFICIAL SCORECARD AUDIT', CONTENT_X + 24, modalY + 32)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Total 72 Arrows: 682 Pts (Rank 1)', CONTENT_X + 24, modalY + 50)

            // Athlete & Judge Signatures Box
            const sigBoxY = modalY + 72
            drawRoundedRect(CONTENT_X + 14, sigBoxY, CONTENT_W - 28, 120, 12, '#F8FAFC', '#E2E8F0', 1)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px Inter, sans-serif'
            ctx.fillText('ATHLETE DIGITAL SIGNATURE', CONTENT_X + 24, sigBoxY + 20)

            // Signature Stroke Path
            ctx.save()
            ctx.strokeStyle = '#0F172A'
            ctx.lineWidth = 2.5
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(CONTENT_X + 30, sigBoxY + 50)
            ctx.bezierCurveTo(CONTENT_X + 60, sigBoxY + 35, CONTENT_X + 80, sigBoxY + 65, CONTENT_X + 110, sigBoxY + 45)
            ctx.bezierCurveTo(CONTENT_X + 130, sigBoxY + 30, CONTENT_X + 150, sigBoxY + 60, CONTENT_X + 180, sigBoxY + 48)
            ctx.stroke()
            ctx.restore()

            ctx.fillStyle = '#0F172A'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Signed: Arif Dwi Pangestu (12A)', CONTENT_X + 24, sigBoxY + 80)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Field Referee: Judge #3 (WA Certified)', CONTENT_X + 24, sigBoxY + 98)

            // Locked Status Banner
            const lockStatusY = modalY + 202
            if (isLocked) {
                drawRoundedRect(CONTENT_X + 14, lockStatusY, CONTENT_W - 28, 44, 10, 'rgba(217, 255, 0, 0.3)', '#0F172A', 1.5)
                ctx.fillStyle = '#0F172A'
                ctx.font = '800 12.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('✓ Scorecard Verified and Locked', CONTENT_X + 48, lockStatusY + 27)
            } else {
                drawRoundedRect(CONTENT_X + 14, lockStatusY, CONTENT_W - 28, 44, 10, '#F1F5F9')
                ctx.fillStyle = '#64748B'
                ctx.font = '600 11px Inter, sans-serif'
                ctx.fillText('Awaiting Official Referee Sign-off', CONTENT_X + 44, lockStatusY + 27)
            }

            // Bottom CTA Button: Confirm & Lock
            const btnY = modalY + 326
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            if (isLocked) {
                ctx.fillText('Scorecard Verified & Locked', CONTENT_X + 72, btnY + 32)
            } else {
                ctx.fillText('Confirm and Lock Scorecard', CONTENT_X + 72, btnY + 32)
            }
        }

        // ── FLOATING BOTTOM DOCK ──
        const DOCK_Y = SCREEN_Y + SCREEN_H - 58
        const DOCK_W = SCREEN_W - 32
        const DOCK_X = SCREEN_X + 16
        drawRoundedRect(DOCK_X, DOCK_Y, DOCK_W, 44, 22, '#0F172A', '#334155', 1)

        const dockItems = [
            { label: 'Roster', active: sceneIndex === 0 },
            { label: 'Keypad', active: sceneIndex === 1 },
            { label: 'Live Sync', active: sceneIndex === 2 },
            { label: 'Sign-off', active: sceneIndex === 3 }
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

        ctx.restore() // Restore Camera Transform

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
