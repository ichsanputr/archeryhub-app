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
        if (renderFrameFunc) renderFrameFunc(pausedAt)
    } else {
        if (pausedAt > 0) totalPausedDuration += performance.now() - pausedAt
        if (renderFrameFunc) animationFrameId = requestAnimationFrame(renderFrameFunc)
    }
}

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2

onMounted(async () => {
    handleResize()
    window.addEventListener('resize', handleResize)

    if (document.fonts) {
        try { await document.fonts.ready } catch (e) {}
    }

    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')

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
        if (fill) { ctx.fillStyle = fill; ctx.fill() }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke() }
    }

    // World Archery 10-ring concentric target face
    function drawTargetFace(cx, cy, r) {
        const rings = [
            { r: r, color: '#FFFFFF', stroke: '#CBD5E1' },
            { r: r * 0.8, color: '#0F172A', stroke: null },
            { r: r * 0.6, color: '#0284C7', stroke: null },
            { r: r * 0.4, color: '#EF4444', stroke: null },
            { r: r * 0.2, color: '#FACC15', stroke: '#CA8A04' }
        ]
        rings.forEach(ring => {
            ctx.beginPath()
            ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
            ctx.fillStyle = ring.color
            ctx.fill()
            if (ring.stroke) {
                ctx.strokeStyle = ring.stroke
                ctx.lineWidth = 0.8
                ctx.stroke()
            }
        })
        ctx.beginPath()
        ctx.arc(cx, cy, r * 0.08, 0, Math.PI * 2)
        ctx.strokeStyle = '#CA8A04'
        ctx.lineWidth = 0.6
        ctx.stroke()
    }

    // High fidelity QR Matrix Generator for Scoresheet Scanner
    function drawDynamicQRCode(x, y, size, dotColor = '#0F172A') {
        const cols = 21
        const cellSize = size / cols
        ctx.save()

        drawRoundedRect(x, y, size, size, 8, '#FFFFFF', '#CBD5E1', 1)
        ctx.fillStyle = dotColor

        function drawFinder(fx, fy) {
            ctx.fillRect(x + fx * cellSize, y + fy * cellSize, 7 * cellSize, 7 * cellSize)
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(x + (fx + 1) * cellSize, y + (fy + 1) * cellSize, 5 * cellSize, 5 * cellSize)
            ctx.fillStyle = dotColor
            ctx.fillRect(x + (fx + 2) * cellSize, y + (fy + 2) * cellSize, 3 * cellSize, 3 * cellSize)
        }

        drawFinder(0, 0)
        drawFinder(cols - 7, 0)
        drawFinder(0, cols - 7)

        const pattern = [
            [0,0,0,0,0,0,0, 0,1,0,1,0,1, 0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0, 1,0,1,0,1,0, 0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0, 0,1,0,0,1,1, 0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0, 1,1,1,0,0,1, 0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0, 0,0,1,1,0,0, 0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0, 1,0,0,1,1,0, 0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0, 0,1,1,0,1,1, 0,0,0,0,0,0,0],

            [1,0,1,1,0,1,0, 1,0,1,0,1,0, 1,0,1,0,1,0,1],
            [0,1,0,0,1,0,1, 0,1,1,1,0,1, 0,1,0,0,1,1,0],
            [1,1,0,1,0,1,0, 1,0,0,1,0,0, 1,0,1,1,0,1,0],
            [0,0,1,0,1,0,1, 0,1,1,0,1,1, 0,1,0,1,0,0,1],
            [1,0,1,1,0,1,0, 1,1,0,1,0,1, 1,1,0,0,1,1,0],
            [0,1,0,1,1,0,1, 0,0,1,0,1,0, 0,0,1,1,0,1,1],
            [1,1,0,0,1,0,0, 1,0,1,1,0,1, 1,0,1,0,1,0,0],

            [0,0,0,0,0,0,0, 0,1,0,1,0,1, 0,1,1,0,1,0,1],
            [0,0,0,0,0,0,0, 1,0,1,0,1,0, 1,0,0,1,0,1,0],
            [0,0,0,0,0,0,0, 0,1,0,1,1,0, 0,1,1,0,1,1,1],
            [0,0,0,0,0,0,0, 1,1,0,0,0,1, 1,0,1,1,0,0,1],
            [0,0,0,0,0,0,0, 0,0,1,1,1,0, 0,1,0,1,1,0,0],
            [0,0,0,0,0,0,0, 1,0,1,0,0,1, 1,0,1,0,0,1,1],
            [0,0,0,0,0,0,0, 0,1,1,1,0,0, 0,1,0,1,1,0,1]
        ]

        for (let r = 0; r < cols; r++) {
            for (let c = 0; c < cols; c++) {
                if ((r < 7 && c < 7) || (r < 7 && c >= cols - 7) || (r >= cols - 7 && c < 7)) continue
                if (pattern[r] && pattern[r][c] === 1) {
                    ctx.fillRect(x + c * cellSize + 0.5, y + r * cellSize + 0.5, cellSize - 1, cellSize - 1)
                }
            }
        }

        const centerCX = x + size / 2
        const centerCY = y + size / 2
        drawRoundedRect(centerCX - 12, centerCY - 12, 24, 24, 6, '#0F172A')
        drawTargetFace(centerCX, centerCY, 6)
        ctx.restore()
    }

    function drawMouseCursor(x, y, isPressed = false) {
        ctx.save()
        ctx.translate(x, y)
        if (isPressed) ctx.scale(0.90, 0.90)
        ctx.shadowColor = 'rgba(15, 23, 42, 0.28)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetY = 4

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, 17)
        ctx.lineTo(4.4, 12.8)
        ctx.lineTo(8.2, 20.4)
        ctx.lineTo(11.2, 19)
        ctx.lineTo(7.4, 11.4)
        ctx.lineTo(13, 11.4)
        ctx.closePath()

        ctx.fillStyle = '#0F172A'
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1.8
        ctx.lineJoin = 'round'
        ctx.stroke()
        ctx.restore()
    }

    // ── Master 25.0-Second Seamless Loop (5 Sequential Scenes x 5.0s) ──
    const CYCLE_DURATION = 25.0
    let startTime = null

    function renderFrame(now) {
        if (!startTime) startTime = now
        const effectiveNow = isPaused.value ? (pausedAt - totalPausedDuration) : (now - totalPausedDuration)
        const elapsed = (effectiveNow / 1000) % CYCLE_DURATION

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

        // 2. Timeline States & Camera
        let sceneIndex = 0
        let camZoom = 1.00
        let camPanY = 0

        let loginCodeTyped = ''
        let isLoginAuthenticated = false
        let btnLoginScale = 1.0

        let isScanSelected = false
        let btnScanScale = 1.0

        let isQrVerified = false
        let scanLaserY = 0

        let isArcherSelected = false
        let selectedArcherIndex = 0

        let scoreSlot5Filled = false
        let scoreSlot6Filled = false
        let isScoreSubmitted = false
        let btnScoreSubmitScale = 1.0
        let activeKeypadKey = null

        let cursorVisible = false
        let cursorX = 0, cursorY = 0
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        const STEP_TIME = 5.0

        // ══════════════════════════════════════════════════════════
        // SCENE 1: SCOREKEEPER LOGIN & 5-CHAR ACCESS CODE (0.0s – 5.0s)
        // ══════════════════════════════════════════════════════════
        if (elapsed < STEP_TIME) {
            sceneIndex = 0
            if (elapsed < 1.4) {
                const zt = easeInOutCubic(elapsed / 1.4)
                camZoom = 1.00 + 0.44 * zt
                camPanY = -85 * zt
            } else {
                camZoom = 1.44
                camPanY = -85
            }

            // Typing animation of 5-character code: S-K-7-8-9
            if (elapsed >= 0.6 && elapsed < 1.0) loginCodeTyped = 'S'
            else if (elapsed >= 1.0 && elapsed < 1.4) loginCodeTyped = 'SK'
            else if (elapsed >= 1.4 && elapsed < 1.8) loginCodeTyped = 'SK7'
            else if (elapsed >= 1.8 && elapsed < 2.2) loginCodeTyped = 'SK78'
            else if (elapsed >= 2.2) loginCodeTyped = 'SK789'

            const btnLoginY = 820
            if (elapsed >= 2.4) {
                cursorVisible = true
                if (elapsed < 3.2) {
                    const mt = easeInOutCubic((elapsed - 2.4) / 0.8)
                    cursorX = 540
                    cursorY = 560 + (btnLoginY - 560) * mt
                } else {
                    cursorX = 540; cursorY = btnLoginY
                }

                if (elapsed >= 3.2) {
                    isLoginAuthenticated = true
                    if (elapsed >= 3.2 && elapsed <= 3.75) {
                        cursorPressed = true
                        btnLoginScale = 0.94
                        tapRipple = (elapsed - 3.2) / 0.55
                        tapX = 540; tapY = btnLoginY
                    }
                }
            }
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 2: SCOREKEEPER LANDING & ACTIONS (5.0s – 10.0s)
        // ══════════════════════════════════════════════════════════
        else if (elapsed < STEP_TIME * 2) {
            sceneIndex = 1
            loginCodeTyped = 'SK789'
            isLoginAuthenticated = true
            const step2Elapsed = elapsed - STEP_TIME

            if (step2Elapsed < 1.0) {
                const transT = easeInOutCubic(step2Elapsed / 1.0)
                camZoom = 1.44 + (1.36 - 1.44) * transT
                camPanY = -85 + (-45 - (-85)) * transT
            } else if (step2Elapsed < 2.6) {
                camZoom = 1.36; camPanY = -45
            } else if (step2Elapsed < 3.6) {
                const ct = easeInOutCubic((step2Elapsed - 2.6) / 1.0)
                camZoom = 1.36 + (1.44 - 1.36) * ct
                camPanY = -45 + (-85 - (-45)) * ct
            } else {
                camZoom = 1.44; camPanY = -85
            }

            const scanCardY = 620
            if (step2Elapsed >= 1.0) {
                cursorVisible = true
                if (step2Elapsed < 2.2) {
                    const mt = easeInOutCubic((step2Elapsed - 1.0) / 1.2)
                    cursorX = 540
                    cursorY = 460 + (scanCardY - 460) * mt
                } else {
                    cursorX = 540; cursorY = scanCardY
                }

                if (step2Elapsed >= 2.2) {
                    isScanSelected = true
                    if (step2Elapsed >= 2.2 && step2Elapsed <= 2.75) {
                        cursorPressed = true
                        btnScanScale = 0.94
                        tapRipple = (step2Elapsed - 2.2) / 0.55
                        tapX = 540; tapY = scanCardY
                    }
                }
            }
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 3: SCORESHEET QR SCANNER VIEWFINDER (10.0s – 15.0s)
        // ══════════════════════════════════════════════════════════
        else if (elapsed < STEP_TIME * 3) {
            sceneIndex = 2
            isScanSelected = true
            const step3Elapsed = elapsed - STEP_TIME * 2

            if (step3Elapsed < 1.0) {
                const transT = easeInOutCubic(step3Elapsed / 1.0)
                camZoom = 1.44 + (1.36 - 1.44) * transT
                camPanY = -85 + (-45 - (-85)) * transT
            } else if (step3Elapsed < 2.6) {
                camZoom = 1.36; camPanY = -45
            } else if (step3Elapsed < 3.6) {
                const ct = easeInOutCubic((step3Elapsed - 2.6) / 1.0)
                camZoom = 1.36 + (1.44 - 1.36) * ct
                camPanY = -45 + (-85 - (-45)) * ct
            } else {
                camZoom = 1.44; camPanY = -85
            }

            // Laser scanner up-down sweep
            scanLaserY = Math.sin(step3Elapsed * 3.5) * 0.5 + 0.5

            if (step3Elapsed >= 2.2) {
                isQrVerified = true
            }
            cursorVisible = false
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 4: TARGET 04 DETAILS & ARCHER ROSTER (15.0s – 20.0s)
        // ══════════════════════════════════════════════════════════
        else if (elapsed < STEP_TIME * 4) {
            sceneIndex = 3
            isQrVerified = true
            const step4Elapsed = elapsed - STEP_TIME * 3

            if (step4Elapsed < 1.0) {
                const transT = easeInOutCubic(step4Elapsed / 1.0)
                camZoom = 1.44 + (1.36 - 1.44) * transT
                camPanY = -85 + (-45 - (-85)) * transT
            } else if (step4Elapsed < 2.6) {
                camZoom = 1.36; camPanY = -45
            } else if (step4Elapsed < 3.6) {
                const ct = easeInOutCubic((step4Elapsed - 2.6) / 1.0)
                camZoom = 1.36 + (1.44 - 1.36) * ct
                camPanY = -45 + (-85 - (-45)) * ct
            } else {
                camZoom = 1.44; camPanY = -85
            }

            const archer1CardY = 540
            if (step4Elapsed >= 0.8) {
                cursorVisible = true
                if (step4Elapsed < 2.0) {
                    const mt = easeInOutCubic((step4Elapsed - 0.8) / 1.2)
                    cursorX = 540
                    cursorY = 400 + (archer1CardY - 400) * mt
                } else {
                    cursorX = 540; cursorY = archer1CardY
                }

                if (step4Elapsed >= 2.0) {
                    isArcherSelected = true
                    selectedArcherIndex = 0
                    if (step4Elapsed >= 2.0 && step4Elapsed <= 2.55) {
                        cursorPressed = true
                        tapRipple = (step4Elapsed - 2.0) / 0.55
                        tapX = 540; tapY = archer1CardY
                    }
                }
            }
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 5: WA KEYPAD & REAL-TIME SCORING (20.0s – 25.0s)
        // ══════════════════════════════════════════════════════════
        else {
            sceneIndex = 4
            isArcherSelected = true
            const step5Elapsed = elapsed - STEP_TIME * 4

            if (step5Elapsed < 1.0) {
                const transT = easeInOutCubic(step5Elapsed / 1.0)
                camZoom = 1.44 + (1.36 - 1.44) * transT
                camPanY = -85 + (-45 - (-85)) * transT
            } else if (step5Elapsed < 2.8) {
                camZoom = 1.36; camPanY = -45
            } else if (step5Elapsed < 4.2) {
                const ct = easeInOutCubic((step5Elapsed - 2.8) / 1.4)
                camZoom = 1.36 + (1.44 - 1.36) * ct
                camPanY = -45 + (-85 - (-45)) * ct
            } else {
                // Return to neutral overview for seamless loop
                const finT = easeInOutCubic((step5Elapsed - 4.2) / 0.8)
                camZoom = 1.44 - (1.44 - 1.00) * finT
                camPanY = -85 * (1 - finT)
            }

            // Interactive keypad inputs
            const key10X = 540, key10Y = 660
            const key9X = 610, key9Y = 660
            const btnSubmitY = 820

            if (step5Elapsed >= 0.5 && step5Elapsed < 1.4) {
                cursorVisible = true
                const kt1 = easeInOutCubic((step5Elapsed - 0.5) / 0.7)
                cursorX = 480 + (key10X - 480) * kt1
                cursorY = 560 + (key10Y - 560) * kt1
                if (step5Elapsed >= 1.2) {
                    scoreSlot5Filled = true
                    activeKeypadKey = '10'
                    cursorPressed = true
                }
            } else if (step5Elapsed >= 1.4 && step5Elapsed < 2.3) {
                cursorVisible = true
                scoreSlot5Filled = true
                const kt2 = easeInOutCubic((step5Elapsed - 1.4) / 0.7)
                cursorX = key10X + (key9X - key10X) * kt2
                cursorY = key10Y + (key9Y - key10Y) * kt2
                if (step5Elapsed >= 2.1) {
                    scoreSlot6Filled = true
                    activeKeypadKey = '9'
                    cursorPressed = true
                }
            } else if (step5Elapsed >= 2.3 && step5Elapsed < 4.0) {
                cursorVisible = true
                scoreSlot5Filled = true
                scoreSlot6Filled = true
                activeKeypadKey = null
                const bt = easeInOutCubic((step5Elapsed - 2.3) / 0.8)
                cursorX = key9X + (540 - key9X) * bt
                cursorY = key9Y + (btnSubmitY - key9Y) * bt
                if (step5Elapsed >= 3.1) {
                    isScoreSubmitted = true
                    if (step5Elapsed >= 3.1 && step5Elapsed <= 3.65) {
                        cursorPressed = true
                        btnScoreSubmitScale = 0.94
                        tapRipple = (step5Elapsed - 3.1) / 0.55
                        tapX = 540; tapY = btnSubmitY
                    }
                }
            } else {
                cursorVisible = false
            }
        }

        // 3. Camera Transform
        ctx.save()
        ctx.translate(540, 540 + camPanY)
        ctx.scale(camZoom, camZoom)
        ctx.translate(-540, -540)

        // 4. Smartphone Chassis
        const phoneW = 370
        const phoneH = 760
        const phoneX = 540 - phoneW / 2
        const phoneY = 540 - phoneH / 2

        ctx.save()
        ctx.shadowColor = 'rgba(15, 23, 42, 0.14)'
        ctx.shadowBlur = 42
        ctx.shadowOffsetY = 22
        drawRoundedRect(phoneX, phoneY, phoneW, phoneH, 48, '#181A1D')
        ctx.restore()

        drawRoundedRect(phoneX - 3, phoneY + 140, 3.5, 42, 1.5, '#8E95A2')
        drawRoundedRect(phoneX - 3, phoneY + 195, 3.5, 42, 1.5, '#8E95A2')
        drawRoundedRect(phoneX + phoneW - 0.5, phoneY + 170, 3.5, 58, 1.5, '#8E95A2')
        drawRoundedRect(phoneX, phoneY, phoneW, phoneH, 48, '#181A1D', '#2D3139', 2)

        // 5. Glass Viewport
        const screenW = 348
        const screenH = 738
        const screenX = 540 - screenW / 2
        const screenY = 540 - screenH / 2

        ctx.save()
        drawRoundedRect(screenX, screenY, screenW, screenH, 40)
        ctx.clip()

        ctx.fillStyle = '#F8FAFC'
        ctx.fillRect(screenX, screenY, screenW, screenH)

        // Top App Header
        const appHeadY = screenY + 46
        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Scorekeeper Official App', screenX + 20, appHeadY)

        let sceneHeaderTitle = 'Scorekeeper Access Code'
        if (sceneIndex === 1) sceneHeaderTitle = 'Field Scoring'
        else if (sceneIndex === 2) sceneHeaderTitle = 'Scoresheet Scanner'
        else if (sceneIndex === 3) sceneHeaderTitle = 'Target 04 Scoresheet'
        else if (sceneIndex === 4) sceneHeaderTitle = 'Target 04-A Scoring'

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(sceneHeaderTitle, screenX + 20, appHeadY + 22)

        const contentY = appHeadY + 32
        const contentH = screenH - 138

        ctx.save()
        ctx.beginPath()
        ctx.rect(screenX, contentY, screenW, contentH)
        ctx.clip()

        const scBtnW = screenW - 36
        const scBtnH = 46
        const scBtnX = 18
        const scBtnY = 502
        const scBtnCX = scBtnX + scBtnW / 2
        const scBtnCY = scBtnY + scBtnH / 2

        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 1: SCOREKEEPER LOGIN & 5-CHAR CODE GATE
        // ══════════════════════════════════════════════════════════
        if (sceneIndex === 0) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const lHeroW = screenW - 36
            const lHeroH = 480
            drawRoundedRect(18, 4, lHeroW, lHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Top Bar Icons
            drawRoundedRect(30, 16, 36, 36, 10, '#F8FAFC', '#E2E8F0', 1)
            ctx.strokeStyle = '#0F172A'
            ctx.lineWidth = 1.8
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(50, 34)
            ctx.lineTo(44, 34)
            ctx.lineTo(48, 30)
            ctx.moveTo(44, 34)
            ctx.lineTo(48, 38)
            ctx.stroke()

            drawRoundedRect(18 + lHeroW - 74, 16, 62, 32, 8, '#F1F5F9', '#E2E8F0', 1)
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '700 10px "NovaText", sans-serif'
            ctx.fillText('ID · EN', 18 + lHeroW - 43, 36)

            // Hero Dark Icon Box with Target
            const iconY = 64
            drawRoundedRect(30, iconY, 48, 48, 14, '#0F172A')
            drawTargetFace(54, iconY + 24, 12)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 19px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scorekeeper Access Code', 30, iconY + 76)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Enter the 5-character personal code provided by tournament organizers to enable scoring mode.', 30, iconY + 96, lHeroW - 24)

            // 5 Alphanumeric OTP Code Boxes
            const otpY = iconY + 144
            const otpBoxW = 46
            const otpBoxH = 54
            const otpGap = 8
            const otpStartX = 30

            const codeChars = loginCodeTyped.split('')
            for (let i = 0; i < 5; i++) {
                const ox = otpStartX + i * (otpBoxW + otpGap)
                const char = codeChars[i] || ''
                const isBoxActive = i === codeChars.length

                drawRoundedRect(ox, otpY, otpBoxW, otpBoxH, 10, '#F8FAFC', isBoxActive ? '#0F172A' : (char ? '#059669' : '#CBD5E1'), isBoxActive || char ? 2 : 1)

                if (char) {
                    ctx.textAlign = 'center'
                    ctx.fillStyle = '#0F172A'
                    ctx.font = '800 22px "Bricolage Grotesque", "NovaText", sans-serif'
                    ctx.fillText(char, ox + otpBoxW / 2, otpY + 36)
                } else if (isBoxActive) {
                    ctx.fillStyle = '#0F172A'
                    ctx.fillRect(ox + otpBoxW / 2 - 1, otpY + 16, 2, 22)
                }
            }

            // Info Notice Card
            const noticeY = otpY + 72
            drawRoundedRect(30, noticeY, lHeroW - 24, 60, 10, '#F8FAFC', '#E2E8F0', 1)
            ctx.beginPath()
            ctx.arc(46, noticeY + 30, 8, 0, Math.PI * 2)
            ctx.fillStyle = '#64748B'
            ctx.fill()
            ctx.fillStyle = '#FFFFFF'
            ctx.textAlign = 'center'
            ctx.font = '700 10px "NovaText", sans-serif'
            ctx.fillText('i', 46, noticeY + 34)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#475569'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Valid for Official Judges and Scorekeepers assigned to National Archery Championship 2026.', 62, noticeY + 26, lHeroW - 60)

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnLoginScale, btnLoginScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isLoginAuthenticated ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isLoginAuthenticated ? 'Access Granted · Authenticating...' : 'Enter Scoring Mode', scBtnCX, scBtnY + 28)
            ctx.restore()

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 2: SCOREKEEPER LANDING & ACTION DASHBOARD
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 1) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const dHeroW = screenW - 36
            const dHeroH = 480
            drawRoundedRect(18, 4, dHeroW, dHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Top Bar: Exit button
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", sans-serif'
            ctx.fillText('Active Session: Zone A Range', 30, 26)

            drawRoundedRect(18 + dHeroW - 74, 12, 62, 26, 6, '#FEF2F2', '#FECACA', 1)
            ctx.fillStyle = '#DC2626'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "NovaText", sans-serif'
            ctx.fillText('Exit Mode', 18 + dHeroW - 43, 29)

            // Hero Profile Card (Navy)
            const profY = 46
            drawRoundedRect(30, profY, dHeroW - 24, 110, 14, '#0F172A')

            // Avatar box (Neon Lime)
            drawRoundedRect(44, profY + 16, 44, 44, 12, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '800 16px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('SK', 66, profY + 44)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Budi Santoso', 98, profY + 34)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 10px "NovaText", sans-serif'
            ctx.fillText('scorekeeper@archeryhub.id', 98, profY + 50)

            drawRoundedRect(30 + dHeroW - 110, profY + 22, 74, 20, 10, 'rgba(217, 255, 0, 0.15)', '#D9FF00', 1)
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '700 9px "NovaText", sans-serif'
            ctx.fillText('Scorekeeper', 30 + dHeroW - 73, profY + 35)

            // Status bar inside hero
            drawRoundedRect(44, profY + 68, dHeroW - 52, 28, 6, 'rgba(255, 255, 255, 0.08)')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 9.5px "NovaText", sans-serif'
            ctx.fillText('Ready to record qualification & matchplay scores.', 54, profY + 86)

            // Section: Scoring Actions
            const actY = profY + 126
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scoring Actions', 30, actY)

            // Primary Action: Scan Target Barcode (Neon Lime)
            const scanBtnY = actY + 12
            drawRoundedRect(30, scanBtnY, dHeroW - 24, 78, 14, '#D9FF00', isScanSelected ? '#0F172A' : null, isScanSelected ? 2 : 0)

            drawRoundedRect(44, scanBtnY + 16, 46, 46, 12, '#0F172A')
            ctx.strokeStyle = '#D9FF00'
            ctx.lineWidth = 1.8
            ctx.strokeRect(54, scanBtnY + 26, 26, 26)
            ctx.fillStyle = '#D9FF00'
            ctx.fillRect(60, scanBtnY + 32, 14, 14)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 13.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scan Target Barcode', 100, scanBtnY + 38)

            ctx.fillStyle = '#334155'
            ctx.font = '500 10px "NovaText", sans-serif'
            ctx.fillText('Scan QR code on target scoresheet', 100, scanBtnY + 54)

            // Secondary Action: Manual Target List
            const manBtnY = scanBtnY + 90
            drawRoundedRect(30, manBtnY, dHeroW - 24, 72, 14, '#F8FAFC', '#E2E8F0', 1.2)

            drawRoundedRect(44, manBtnY + 14, 44, 44, 12, '#FFFFFF', '#CBD5E1', 1)
            drawTargetFace(66, manBtnY + 36, 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Manual Target List', 100, manBtnY + 34)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px "NovaText", sans-serif'
            ctx.fillText('Select target lane number from list', 100, manBtnY + 50)

            // Assigned event info box
            const evInfoY = manBtnY + 84
            drawRoundedRect(30, evInfoY, dHeroW - 24, 48, 8, '#F1F5F9')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('National Archery Championship 2026', 44, evInfoY + 22)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('Session 1 (08:00 WIB) · 32 Active Target Lanes', 44, evInfoY + 38)

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 3: SCORESHEET QR SCANNER VIEWFINDER
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 2) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const sHeroW = screenW - 36
            const sHeroH = 480
            drawRoundedRect(18, 4, sHeroW, sHeroH, 14, '#0F172A')

            // Viewfinder Top Header
            ctx.textAlign = 'left'
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scoresheet QR Scanner', 30, 28)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('Align target scoresheet QR inside viewfinder', 30, 44)

            // Viewfinder Camera Box
            const vBoxX = 40
            const vBoxY = 64
            const vBoxSize = sHeroW - 44
            drawRoundedRect(vBoxX, vBoxY, vBoxSize, vBoxSize, 16, '#181A1D', '#334155', 1)

            // Center Dynamic QR Code Graphic
            const qrSize = 130
            const qrX = vBoxX + vBoxSize / 2 - qrSize / 2
            const qrY = vBoxY + vBoxSize / 2 - qrSize / 2
            drawDynamicQRCode(qrX, qrY, qrSize, '#0F172A')

            // Viewfinder Corner Brackets
            const cornerLen = 22
            ctx.strokeStyle = isQrVerified ? '#10B981' : '#D9FF00'
            ctx.lineWidth = 3.5
            ctx.lineCap = 'round'

            // Top Left
            ctx.beginPath()
            ctx.moveTo(vBoxX + 16, vBoxY + 16 + cornerLen)
            ctx.lineTo(vBoxX + 16, vBoxY + 16)
            ctx.lineTo(vBoxX + 16 + cornerLen, vBoxY + 16)
            ctx.stroke()

            // Top Right
            ctx.beginPath()
            ctx.moveTo(vBoxX + vBoxSize - 16 - cornerLen, vBoxY + 16)
            ctx.lineTo(vBoxX + vBoxSize - 16, vBoxY + 16)
            ctx.lineTo(vBoxX + vBoxSize - 16, vBoxY + 16 + cornerLen)
            ctx.stroke()

            // Bottom Left
            ctx.beginPath()
            ctx.moveTo(vBoxX + 16, vBoxY + vBoxSize - 16 - cornerLen)
            ctx.lineTo(vBoxX + 16, vBoxY + vBoxSize - 16)
            ctx.lineTo(vBoxX + 16 + cornerLen, vBoxY + vBoxSize - 16)
            ctx.stroke()

            // Bottom Right
            ctx.beginPath()
            ctx.moveTo(vBoxX + vBoxSize - 16 - cornerLen, vBoxY + vBoxSize - 16)
            ctx.lineTo(vBoxX + vBoxSize - 16, vBoxY + vBoxSize - 16)
            ctx.lineTo(vBoxX + vBoxSize - 16, vBoxY + vBoxSize - 16 - cornerLen)
            ctx.stroke()

            // Animated Laser Scanning Beam
            if (!isQrVerified) {
                const laserY = vBoxY + 20 + scanLaserY * (vBoxSize - 40)
                ctx.save()
                ctx.shadowColor = '#D9FF00'
                ctx.shadowBlur = 12
                ctx.strokeStyle = '#D9FF00'
                ctx.lineWidth = 2.5
                ctx.beginPath()
                ctx.moveTo(vBoxX + 18, laserY)
                ctx.lineTo(vBoxX + vBoxSize - 18, laserY)
                ctx.stroke()
                ctx.restore()
            }

            // Verification Card Overlay
            const resY = vBoxY + vBoxSize + 18
            if (isQrVerified) {
                drawRoundedRect(30, resY, sHeroW - 24, 76, 12, '#ECFDF5', '#10B981', 1.5)

                ctx.beginPath()
                ctx.arc(52, resY + 38, 14, 0, Math.PI * 2)
                ctx.fillStyle = '#10B981'
                ctx.fill()

                ctx.strokeStyle = '#FFFFFF'
                ctx.lineWidth = 2.2
                ctx.lineCap = 'round'
                ctx.beginPath()
                ctx.moveTo(46, resY + 38)
                ctx.lineTo(50, resY + 42)
                ctx.lineTo(58, resY + 34)
                ctx.stroke()

                ctx.textAlign = 'left'
                ctx.fillStyle = '#065F46'
                ctx.font = '800 13.5px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('Scoresheet Verified: Target 04', 74, resY + 32)

                ctx.fillStyle = '#047857'
                ctx.font = '600 10px "NovaText", sans-serif'
                ctx.fillText('Recurve Men Open 70m · 4 Athletes Ready', 74, resY + 48)
                ctx.fillText('Opening target scoring pad...', 74, resY + 62)
            } else {
                drawRoundedRect(30, resY, sHeroW - 24, 76, 12, 'rgba(255, 255, 255, 0.06)', '#334155', 1)
                ctx.textAlign = 'center'
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('Scanning for QR Code...', 30 + (sHeroW - 24) / 2, resY + 36)
                ctx.fillStyle = '#94A3B8'
                ctx.font = '500 9.5px "NovaText", sans-serif'
                ctx.fillText('Hold camera steady over the printed scoresheet header', 30 + (sHeroW - 24) / 2, resY + 52)
            }

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 4: TARGET 04 DETAILS & ARCHER ROSTER
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 3) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const tHeroW = screenW - 36
            const tHeroH = 480
            drawRoundedRect(18, 4, tHeroW, tHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Target Scoresheet Summary Box
            drawRoundedRect(30, 14, tHeroW - 24, 76, 12, '#0F172A')

            drawRoundedRect(42, 26, 52, 52, 10, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '800 20px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('04', 68, 58)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scoresheet Target 04', 104, 38)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('Recurve Men Open 70m · 6 Ends × 6 Arrows', 104, 54)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 9.5px "NovaText", sans-serif'
            ctx.fillText('National Archery Championship 2026', 104, 68)

            // Section: Athletes on Target
            const athSecY = 104
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Athletes on Target 04 (3)', 30, athSecY)

            const archers = [
                {
                    pos: '04-A',
                    name: 'Arif Dwi Pangestu',
                    club: 'Fast Archery Club',
                    end: 'End 3 / 6',
                    score: '118 pts',
                    isAct: selectedArcherIndex === 0
                },
                {
                    pos: '04-B',
                    name: 'Diananda Choirunisa',
                    club: 'Perpani Jatim',
                    end: 'End 3 / 6',
                    score: '116 pts',
                    isAct: false
                },
                {
                    pos: '04-C',
                    name: 'Riau Ega Agatha',
                    club: 'King Archery Club',
                    end: 'End 3 / 6',
                    score: '115 pts',
                    isAct: false
                }
            ]

            let ay = athSecY + 12
            archers.forEach((a) => {
                const ah = 68
                const isSelected = a.isAct && isArcherSelected
                drawRoundedRect(30, ay, tHeroW - 24, ah, 10, isSelected ? '#F8FAFC' : '#FFFFFF', isSelected ? '#0F172A' : '#E2E8F0', isSelected ? 2 : 1)

                // Pos Pill
                drawRoundedRect(42, ay + 14, 42, 40, 8, isSelected ? '#0F172A' : '#F1F5F9')
                ctx.fillStyle = isSelected ? '#D9FF00' : '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '800 12px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(a.pos, 63, ay + 38)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(a.name, 94, ay + 30)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9.5px "NovaText", sans-serif'
                ctx.fillText(a.club, 94, ay + 46)

                // Score stats pill
                drawRoundedRect(30 + tHeroW - 98, ay + 16, 64, 36, 6, '#F8FAFC', '#E2E8F0', 1)
                ctx.textAlign = 'center'
                ctx.fillStyle = '#059669'
                ctx.font = '800 12px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(a.score, 30 + tHeroW - 66, ay + 32)

                ctx.fillStyle = '#64748B'
                ctx.font = '600 8.5px "NovaText", sans-serif'
                ctx.fillText(a.end, 30 + tHeroW - 66, ay + 46)

                ay += ah + 10
            })

            // Notice: Tap athlete to score
            const nY = ay + 4
            drawRoundedRect(30, nY, tHeroW - 24, 42, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Tap Archer 04-A to Open Scorepad Keypad', 30 + (tHeroW - 24) / 2, nY + 26)

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 5: WA SCOREPAD KEYPAD & REAL-TIME INPUT
        // ══════════════════════════════════════════════════════════
        else {
            ctx.save()
            ctx.translate(screenX, contentY)

            const pHeroW = screenW - 36
            const pHeroH = 480
            drawRoundedRect(18, 4, pHeroW, pHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Header Archer Pill
            drawRoundedRect(30, 14, pHeroW - 24, 52, 10, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target 04-A: Arif Dwi Pangestu', 44, 34)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", sans-serif'
            ctx.fillText('Recurve Men 70m · Qualification Round · End 3 of 6', 44, 50)

            // 6 Arrow Score Slots Box
            const slotBoxY = 74
            drawRoundedRect(30, slotBoxY, pHeroW - 24, 76, 10, '#F8FAFC', '#E2E8F0', 1)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 9.5px "NovaText", sans-serif'
            ctx.fillText('End 3 Arrows (6):', 42, slotBoxY + 20)

            const arrowSlots = [
                { val: '10', color: '#FACC15', text: '#0F172A' },
                { val: 'X',  color: '#FACC15', text: '#0F172A' },
                { val: '9',  color: '#EF4444', text: '#FFFFFF' },
                { val: '10', color: '#FACC15', text: '#0F172A' },
                { val: scoreSlot5Filled ? '10' : '', color: scoreSlot5Filled ? '#FACC15' : '#FFFFFF', text: '#0F172A' },
                { val: scoreSlot6Filled ? '9' : '',  color: scoreSlot6Filled ? '#EF4444' : '#FFFFFF', text: '#FFFFFF' }
            ]

            const sWidth = 34
            const sGap = 6
            arrowSlots.forEach((slot, idx) => {
                const sx = 42 + idx * (sWidth + sGap)
                const sy = slotBoxY + 30
                const isCurrent = (idx === 4 && !scoreSlot5Filled) || (idx === 5 && scoreSlot5Filled && !scoreSlot6Filled)

                drawRoundedRect(sx, sy, sWidth, 34, 8, slot.val ? slot.color : '#FFFFFF', isCurrent ? '#0F172A' : '#CBD5E1', isCurrent ? 2 : 1)

                if (slot.val) {
                    ctx.textAlign = 'center'
                    ctx.fillStyle = slot.text
                    ctx.font = '800 14px "Bricolage Grotesque", "NovaText", sans-serif'
                    ctx.fillText(slot.val, sx + sWidth / 2, sy + 22)
                } else if (isCurrent) {
                    ctx.fillStyle = '#0F172A'
                    ctx.fillRect(sx + sWidth / 2 - 1, sy + 8, 2, 18)
                }
            })

            // Cumulative & End Subtotal Pill
            const endTotal = 10 + 10 + 9 + 10 + (scoreSlot5Filled ? 10 : 0) + (scoreSlot6Filled ? 9 : 0)
            const cumTotal = 118 + endTotal

            drawRoundedRect(30 + pHeroW - 90, slotBoxY + 12, 56, 22, 6, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(`${endTotal} / 60 pts`, 30 + pHeroW - 62, slotBoxY + 26)

            // World Archery Official Color Keypad Grid
            const keypadY = slotBoxY + 84
            const keyW = (pHeroW - 48) / 3
            const keyH = 40
            const keyGap = 6

            const keys = [
                { label: 'X',  fill: '#FACC15', text: '#0F172A', stroke: '#CA8A04' },
                { label: '10', fill: '#FACC15', text: '#0F172A', stroke: '#CA8A04' },
                { label: '9',  fill: '#EF4444', text: '#FFFFFF', stroke: null },
                { label: '8',  fill: '#EF4444', text: '#FFFFFF', stroke: null },
                { label: '7',  fill: '#0284C7', text: '#FFFFFF', stroke: null },
                { label: '6',  fill: '#0284C7', text: '#FFFFFF', stroke: null },
                { label: '5',  fill: '#1E293B', text: '#FFFFFF', stroke: null },
                { label: '4',  fill: '#1E293B', text: '#FFFFFF', stroke: null },
                { label: 'M',  fill: '#F1F5F9', text: '#64748B', stroke: '#CBD5E1' }
            ]

            keys.forEach((k, idx) => {
                const col = idx % 3
                const row = Math.floor(idx / 3)
                const kx = 30 + col * (keyW + keyGap)
                const ky = keypadY + row * (keyH + keyGap)

                const isPressed = activeKeypadKey === k.label
                drawRoundedRect(kx, ky, keyW, keyH, 8, k.fill, isPressed ? '#0F172A' : k.stroke, isPressed ? 2.5 : 1)

                ctx.textAlign = 'center'
                ctx.fillStyle = k.text
                ctx.font = '800 15px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(k.label, kx + keyW / 2, ky + 25)
            })

            // Total Score Summary Bar
            const sumBarY = keypadY + 3 * (keyH + keyGap) + 4
            drawRoundedRect(30, sumBarY, pHeroW - 24, 44, 8, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", sans-serif'
            ctx.fillText('Cumulative Qualification Score', 44, sumBarY + 16)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(`${cumTotal} / 180 pts  (11 10s · 5 Xs)`, 44, sumBarY + 34)

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnScoreSubmitScale, btnScoreSubmitScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isScoreSubmitted ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isScoreSubmitted ? 'Score Submitted & Synced to Cloud' : 'Submit End 3 Scores', scBtnCX, scBtnY + 28)
            ctx.restore()

            ctx.restore()
        }

        ctx.restore() // Content clip

        // Status bar & dynamic island
        ctx.fillStyle = '#0F172A'
        ctx.font = '600 12px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('9:41', screenX + 22, screenY + 28)
        drawRoundedRect(540 - 48, screenY + 14, 96, 22, 11, '#000000')

        ctx.beginPath()
        ctx.arc(screenX + screenW - 46, screenY + 24, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#0F172A'
        ctx.fill()
        drawRoundedRect(screenX + screenW - 36, screenY + 18, 18, 10, 3, null, '#0F172A', 1.5)
        ctx.fillRect(screenX + screenW - 34, screenY + 20, 10, 6)

        drawRoundedRect(540 - 55, screenY + screenH - 12, 110, 4, 2, '#CBD5E1')
        ctx.restore() // Glass clip

        // Ripple & Cursor
        if (tapRipple > 0 && tapRipple <= 1) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(tapX, tapY, tapRipple * 40, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(217, 255, 0, ${0.5 * (1 - tapRipple)})`
            ctx.fill()
            ctx.strokeStyle = `rgba(15, 23, 42, ${0.4 * (1 - tapRipple)})`
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.restore()
        }

        if (cursorVisible && cursorX > 0) drawMouseCursor(cursorX, cursorY, cursorPressed)
        ctx.restore() // Camera transform

        if (isPaused.value) {
            ctx.save()
            const pBadgeW = 200
            const pBadgeH = 32
            const pBadgeX = 540 - pBadgeW / 2
            const pBadgeY = 32
            drawRoundedRect(pBadgeX, pBadgeY, pBadgeW, pBadgeH, 16, 'rgba(15, 23, 42, 0.88)')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '600 11px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Paused · Double click to play', 540, pBadgeY + 20)
            ctx.restore()
        }

        if (!isPaused.value) animationFrameId = requestAnimationFrame(renderFrame)
    }

    renderFrameFunc = renderFrame
    animationFrameId = requestAnimationFrame(renderFrame)

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
    })
})
</script>

<style scoped>
.stage-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ECEBE6;
    overflow: hidden;
    user-select: none;
    font-family: 'NovaText', 'Plus Jakarta Sans', sans-serif;
}

.stage-canvas {
    width: 1080px;
    height: 1080px;
    transform-origin: center center;
    box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.12);
    background: #ECEBE6;
    display: block;
}
</style>
