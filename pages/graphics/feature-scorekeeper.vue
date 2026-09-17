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

const clamp01 = (x) => Math.max(0, Math.min(1, x))
const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3)
const easeInOutCubic = (x) => {
    const t = clamp01(x)
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

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

    // Clean Material & Custom Vector Icons
    function drawIconBack(cx, cy) {
        ctx.strokeStyle = '#0F172A'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(cx + 4, cy - 6)
        ctx.lineTo(cx - 2, cy)
        ctx.lineTo(cx + 4, cy + 6)
        ctx.moveTo(cx - 2, cy)
        ctx.lineTo(cx + 8, cy)
        ctx.stroke()
    }

    function drawIconLock(cx, cy, color = '#DCFB4A') {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeRect(cx - 8, cy - 3, 16, 14)
        ctx.beginPath()
        ctx.arc(cx, cy - 3, 5, Math.PI, 0)
        ctx.stroke()
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(cx, cy + 3, 2, 0, Math.PI * 2)
        ctx.fill()
    }

    function drawIconScanner(cx, cy, color = '#DCFB4A') {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        const s = 9
        ctx.beginPath()
        ctx.moveTo(cx - s, cy - s + 4); ctx.lineTo(cx - s, cy - s); ctx.lineTo(cx - s + 4, cy - s)
        ctx.moveTo(cx + s - 4, cy - s); ctx.lineTo(cx + s, cy - s); ctx.lineTo(cx + s, cy - s + 4)
        ctx.moveTo(cx - s, cy + s - 4); ctx.lineTo(cx - s, cy + s); ctx.lineTo(cx - s + 4, cy + s)
        ctx.moveTo(cx + s - 4, cy + s); ctx.lineTo(cx + s, cy + s); ctx.lineTo(cx + s, cy + s - 4)
        ctx.stroke()
        ctx.fillStyle = color
        ctx.fillRect(cx - 4, cy - 4, 3, 3)
        ctx.fillRect(cx + 1, cy - 4, 3, 3)
        ctx.fillRect(cx - 4, cy + 1, 3, 3)
        ctx.fillRect(cx + 1, cy + 1, 3, 3)
    }

    function drawIconKeyboard(cx, cy, color = '#0F172A') {
        ctx.strokeStyle = color
        ctx.lineWidth = 1.8
        ctx.strokeRect(cx - 10, cy - 6, 20, 13)
        ctx.fillStyle = color
        ctx.fillRect(cx - 7, cy - 3, 2, 2)
        ctx.fillRect(cx - 3, cy - 3, 2, 2)
        ctx.fillRect(cx + 1, cy - 3, 2, 2)
        ctx.fillRect(cx + 5, cy - 3, 2, 2)
        ctx.fillRect(cx - 5, cy + 2, 10, 2)
    }

    function drawIconFlashlight(cx, cy, color = '#334155') {
        ctx.strokeStyle = color
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.strokeRect(cx - 3.5, cy - 2, 7, 9)
        ctx.beginPath()
        ctx.moveTo(cx - 5.5, cy - 7)
        ctx.lineTo(cx + 5.5, cy - 7)
        ctx.lineTo(cx + 3.5, cy - 2)
        ctx.lineTo(cx - 3.5, cy - 2)
        ctx.closePath()
        ctx.stroke()
    }

    function drawIconHistory(cx, cy, color = '#0F172A') {
        ctx.strokeStyle = color
        ctx.lineWidth = 1.8
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(cx, cy, 8, 0, Math.PI * 2)
        ctx.moveTo(cx, cy - 5)
        ctx.lineTo(cx, cy)
        ctx.lineTo(cx + 4, cy)
        ctx.stroke()
    }

    function drawIconUndo(cx, cy, color = '#0F172A') {
        ctx.strokeStyle = color
        ctx.lineWidth = 1.8
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(cx + 4, cy - 5)
        ctx.lineTo(cx - 2, cy - 5)
        ctx.lineTo(cx + 1, cy - 8)
        ctx.moveTo(cx - 2, cy - 5)
        ctx.lineTo(cx + 1, cy - 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(cx + 1, cy + 1, 5, -Math.PI / 2, Math.PI / 2)
        ctx.stroke()
    }

    function drawIconCheckCircle(cx, cy, r, color = '#10B981') {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1.8
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(cx - r * 0.45, cy)
        ctx.lineTo(cx - r * 0.1, cy + r * 0.35)
        ctx.lineTo(cx + r * 0.45, cy - r * 0.3)
        ctx.stroke()
    }

    function drawAthleteAvatar(cx, cy, r, initials, isDark = false) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fillStyle = isDark ? '#0F172A' : '#F1F5F9'
        ctx.fill()
        ctx.strokeStyle = isDark ? '#DCFB4A' : '#E2E8F0'
        ctx.lineWidth = 1.2
        ctx.stroke()

        ctx.textAlign = 'center'
        ctx.fillStyle = isDark ? '#DCFB4A' : '#0F172A'
        ctx.font = `800 ${r * 0.75}px "Bricolage Grotesque", sans-serif`
        ctx.fillText(initials, cx, cy + r * 0.3)
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
        const effectiveNow = window.__forcedTime != null ? window.__forcedTime : (isPaused.value ? (pausedAt - totalPausedDuration) : (now - totalPausedDuration))
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
        let btnArcherScale = 1.0

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
            if (elapsed >= 0.5 && elapsed < 0.9) loginCodeTyped = 'S'
            else if (elapsed >= 0.9 && elapsed < 1.3) loginCodeTyped = 'SK'
            else if (elapsed >= 1.3 && elapsed < 1.7) loginCodeTyped = 'SK7'
            else if (elapsed >= 1.7 && elapsed < 2.1) loginCodeTyped = 'SK78'
            else if (elapsed >= 2.1) loginCodeTyped = 'SK789'

            const btnLoginY = 861
            if (elapsed >= 2.3) {
                cursorVisible = true
                if (elapsed < 3.2) {
                    const mt = easeInOutCubic((elapsed - 2.3) / 0.9)
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

            const scanCardY = 466
            if (step2Elapsed >= 0.8) {
                cursorVisible = true
                if (step2Elapsed < 2.0) {
                    const mt = easeInOutCubic((step2Elapsed - 0.8) / 1.2)
                    cursorX = 540
                    cursorY = 280 + (scanCardY - 280) * mt
                } else {
                    cursorX = 540; cursorY = scanCardY
                }

                if (step2Elapsed >= 2.0) {
                    isScanSelected = true
                    if (step2Elapsed >= 2.0 && step2Elapsed <= 2.55) {
                        cursorPressed = true
                        btnScanScale = 0.94
                        tapRipple = (step2Elapsed - 2.0) / 0.55
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

            if (step3Elapsed >= 2.0) {
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

            const archer1CardY = 417
            if (step4Elapsed >= 0.8) {
                cursorVisible = true
                if (step4Elapsed < 2.0) {
                    const mt = easeInOutCubic((step4Elapsed - 0.8) / 1.2)
                    cursorX = 540
                    cursorY = 240 + (archer1CardY - 240) * mt
                } else {
                    cursorX = 540; cursorY = archer1CardY
                }

                if (step4Elapsed >= 2.0) {
                    isArcherSelected = true
                    selectedArcherIndex = 0
                    if (step4Elapsed >= 2.0 && step4Elapsed <= 2.55) {
                        cursorPressed = true
                        btnArcherScale = 0.94
                        tapRipple = (step4Elapsed - 2.0) / 0.55
                        tapX = 540; tapY = archer1CardY
                    }
                }
            }
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 5: WA SCOREPAD KEYPAD & REAL-TIME INPUT (20.0s – 25.0s)
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

            // Interactive keypad inputs (Keypad Row 0: X, 10, 9, 8)
            const key10X = 500, key10Y = 719
            const key9X = 581, key9Y = 719
            const btnSubmitX = 597, btnSubmitY = 870

            if (step5Elapsed >= 0.4 && step5Elapsed < 1.3) {
                cursorVisible = true
                if (step5Elapsed < 1.0) {
                    const kt1 = easeInOutCubic((step5Elapsed - 0.4) / 0.6)
                    cursorX = 450 + (key10X - 450) * kt1
                    cursorY = 600 + (key10Y - 600) * kt1
                } else {
                    cursorX = key10X; cursorY = key10Y
                    scoreSlot5Filled = true
                    activeKeypadKey = '10'
                    cursorPressed = true
                    tapRipple = (step5Elapsed - 1.0) / 0.4
                    tapX = key10X; tapY = key10Y
                }
            } else if (step5Elapsed >= 1.3 && step5Elapsed < 2.2) {
                cursorVisible = true
                scoreSlot5Filled = true
                if (step5Elapsed < 1.8) {
                    const kt2 = easeInOutCubic((step5Elapsed - 1.3) / 0.5)
                    cursorX = key10X + (key9X - key10X) * kt2
                    cursorY = key10Y + (key9Y - key10Y) * kt2
                } else {
                    cursorX = key9X; cursorY = key9Y
                    scoreSlot6Filled = true
                    activeKeypadKey = '9'
                    cursorPressed = true
                    tapRipple = (step5Elapsed - 1.8) / 0.4
                    tapX = key9X; tapY = key9Y
                }
            } else if (step5Elapsed >= 2.2 && step5Elapsed < 4.2) {
                cursorVisible = true
                scoreSlot5Filled = true
                scoreSlot6Filled = true
                activeKeypadKey = null
                if (step5Elapsed < 2.9) {
                    const bt = easeInOutCubic((step5Elapsed - 2.2) / 0.7)
                    cursorX = key9X + (btnSubmitX - key9X) * bt
                    cursorY = key9Y + (btnSubmitY - key9Y) * bt
                } else {
                    cursorX = btnSubmitX; cursorY = btnSubmitY
                    isScoreSubmitted = true
                    if (step5Elapsed >= 2.9 && step5Elapsed <= 3.6) {
                        cursorPressed = true
                        btnScoreSubmitScale = 0.94
                        tapRipple = (step5Elapsed - 2.9) / 0.55
                        tapX = btnSubmitX; tapY = btnSubmitY
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

        // Background color of the active Flutter screen
        ctx.fillStyle = '#F8FAFC'
        ctx.fillRect(screenX, screenY, screenW, screenH)

        // Standard Flutter AppBar Area
        const appBarY = screenY + 44
        const contentY = appBarY + 54

        // ══════════════════════════════════════════════════════════
        // SCENE 1: SCOREKEEPER LOGIN & 5-CHAR CODE GATE
        // ══════════════════════════════════════════════════════════
        if (sceneIndex === 0) {
            // Top Bar: Back button + Language Switcher
            drawRoundedRect(screenX + 18, appBarY + 4, 38, 38, 12, '#FFFFFF', '#E2E8F0', 1)
            drawIconBack(screenX + 37, appBarY + 23)

            drawRoundedRect(screenX + screenW - 74, appBarY + 8, 56, 30, 8, '#FFFFFF', '#E2E8F0', 1)
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '700 10.5px "NovaText", sans-serif'
            ctx.fillText('EN · ID', screenX + screenW - 46, appBarY + 27)

            // Hero Icon Box with Lock
            const heroIconY = contentY + 16
            drawRoundedRect(screenX + 20, heroIconY, 48, 48, 14, '#0F172A')
            drawIconLock(screenX + 44, heroIconY + 24, '#DCFB4A')

            // Headline
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 21px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scorekeeper', screenX + 20, heroIconY + 76)
            ctx.fillText('Access Code.', screenX + 20, heroIconY + 100)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Enter your 5-character personal access code (letters & numbers)', screenX + 20, heroIconY + 124)
            ctx.fillText('provided by the tournament committee for archery scoring.', screenX + 20, heroIconY + 140)

            // 5 Alphanumeric OTP Code Boxes
            const otpY = heroIconY + 164
            const otpBoxW = 46
            const otpBoxH = 54
            const otpGap = 8
            const otpStartX = screenX + 20

            const codeChars = loginCodeTyped.split('')
            for (let i = 0; i < 5; i++) {
                const ox = otpStartX + i * (otpBoxW + otpGap)
                const char = codeChars[i] || ''
                const isBoxActive = i === codeChars.length

                drawRoundedRect(ox, otpY, otpBoxW, otpBoxH, 12, '#FFFFFF', isBoxActive ? '#0F172A' : (char ? '#059669' : '#CBD5E1'), isBoxActive || char ? 2 : 1)

                if (char) {
                    ctx.textAlign = 'center'
                    ctx.fillStyle = '#0F172A'
                    ctx.font = '800 22px "Bricolage Grotesque", sans-serif'
                    ctx.fillText(char, ox + otpBoxW / 2, otpY + 36)
                } else if (isBoxActive) {
                    ctx.fillStyle = '#0F172A'
                    ctx.fillRect(ox + otpBoxW / 2 - 1, otpY + 16, 2, 22)
                }
            }

            // Help row
            const helpY = otpY + 74
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px "NovaText", sans-serif'
            ctx.fillText("Don't have an access code?", screenX + 20, helpY)

            ctx.textAlign = 'right'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11px "NovaText", sans-serif'
            ctx.fillText('Contact Event Desk', screenX + screenW - 20, helpY)

            // Notice Card
            const noticeY = helpY + 18
            drawRoundedRect(screenX + 18, noticeY, screenW - 36, 56, 12, '#F1F5F9', '#E2E8F0', 0.8)
            drawIconCheckCircle(screenX + 36, noticeY + 28, 9, '#64748B')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#475569'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('Judge credentials remain active throughout tournament sessions.', screenX + 54, noticeY + 24)
            ctx.fillText('Maintain confidentiality of participant scoring sheets.', screenX + 54, noticeY + 38)

            // Bottom CTA Button
            const btnLoginY = screenY + screenH - 74
            ctx.save()
            ctx.translate(540, btnLoginY + 26)
            ctx.scale(btnLoginScale, btnLoginScale)
            ctx.translate(-540, -(btnLoginY + 26))

            drawRoundedRect(screenX + 18, btnLoginY, screenW - 36, 52, 16, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isLoginAuthenticated ? '#DCFB4A' : '#FFFFFF'
            ctx.font = '700 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isLoginAuthenticated ? 'Verifying Access...' : 'Activate Scoring Mode', 540, btnLoginY + 32)
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 2: SCOREKEEPER LANDING & ACTION DASHBOARD
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 1) {
            // App Bar Header
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Field Scoring', screenX + 20, appBarY + 20)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px "NovaText", sans-serif'
            ctx.fillText('Scorekeeper Judge Mode', screenX + 20, appBarY + 36)

            // Exit Button
            drawRoundedRect(screenX + screenW - 84, appBarY + 12, 64, 28, 10, '#FEE2E2', 'rgba(239, 68, 68, 0.3)', 1)
            ctx.textAlign = 'center'
            ctx.fillStyle = '#EF4444'
            ctx.font = '700 10.5px "NovaText", sans-serif'
            ctx.fillText('Sign Out', screenX + screenW - 52, appBarY + 30)

            // Hero Profile Card (Navy)
            const profY = contentY + 4
            drawRoundedRect(screenX + 18, profY, screenW - 36, 120, 18, '#0F172A')

            // Avatar Box (Lime)
            drawRoundedRect(screenX + 32, profY + 16, 44, 44, 14, '#DCFB4A')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 16px "Bricolage Grotesque", sans-serif'
            ctx.fillText('BK', screenX + 54, profY + 44)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Budi Kurniawan', screenX + 88, profY + 34)

            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
            ctx.font = '500 10px "NovaText", sans-serif'
            ctx.fillText('scorekeeper@archeryhub.id', screenX + 88, profY + 48)

            // Role Tag
            drawRoundedRect(screenX + screenW - 108, profY + 18, 76, 22, 11, 'rgba(220, 251, 74, 0.18)', 'rgba(220, 251, 74, 0.5)', 1)
            ctx.textAlign = 'center'
            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 9.5px "NovaText", sans-serif'
            ctx.fillText('Scorekeeper', screenX + screenW - 70, profY + 32)

            // Ready Status Sub-strip
            drawRoundedRect(screenX + 30, profY + 72, screenW - 60, 34, 10, 'rgba(255, 255, 255, 0.08)')
            drawIconCheckCircle(screenX + 46, profY + 89, 7, '#DCFB4A')
            ctx.textAlign = 'left'
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('Ready to record qualification & elimination scores.', screenX + 60, profY + 93)

            // Section: Scoring Actions
            const secY = profY + 142
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scoring Actions', screenX + 20, secY)

            // 1. Primary Action: Scan Target QR Code (Solid Lime Card)
            const act1Y = secY + 12
            drawRoundedRect(screenX + 18, act1Y, screenW - 36, 78, 16, '#DCFB4A', isScanSelected ? '#0F172A' : null, isScanSelected ? 2 : 0)

            drawRoundedRect(screenX + 30, act1Y + 16, 46, 46, 12, '#0F172A')
            drawIconScanner(screenX + 53, act1Y + 39, '#DCFB4A')

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scan Target QR Code', screenX + 88, act1Y + 36)

            ctx.fillStyle = '#334155'
            ctx.font = '500 10px "NovaText", sans-serif'
            ctx.fillText('Scan QR code printed on target scoresheet', screenX + 88, act1Y + 52)

            // 2. Secondary Action: Manual Code Entry
            const act2Y = act1Y + 90
            drawRoundedRect(screenX + 18, act2Y, screenW - 36, 74, 16, '#FFFFFF', '#E2E8F0', 1)

            drawRoundedRect(screenX + 30, act2Y + 15, 44, 44, 12, '#F1F5F9')
            drawIconKeyboard(screenX + 52, act2Y + 37, '#0F172A')

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Manual Code Entry', screenX + 88, act2Y + 34)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px "NovaText", sans-serif'
            ctx.fillText('Enter target lane number or scoresheet ID', screenX + 88, act2Y + 50)

            // 3. Tertiary Action: Scoring History
            const act3Y = act2Y + 86
            drawRoundedRect(screenX + 18, act3Y, screenW - 36, 74, 16, '#FFFFFF', '#E2E8F0', 1)

            drawRoundedRect(screenX + 30, act3Y + 15, 44, 44, 12, '#F1F5F9')
            drawIconHistory(screenX + 52, act3Y + 37, '#0F172A')

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scoring History', screenX + 88, act3Y + 34)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px "NovaText", sans-serif'
            ctx.fillText('Review and verify recorded scoresheets', screenX + 88, act3Y + 50)
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 3: SCORESHEET QR SCANNER VIEWFINDER
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 2) {
            // Viewfinder App Bar (Light Theme)
            drawRoundedRect(screenX + 18, appBarY + 4, 38, 38, 12, '#FFFFFF', '#E2E8F0', 1)
            drawIconBack(screenX + 37, appBarY + 23)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 17px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scan Target QR Code', screenX + 68, appBarY + 20)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px "NovaText", sans-serif'
            ctx.fillText('Point camera at target scoresheet QR code', screenX + 68, appBarY + 36)

            // Guidance status pill
            const guideY = contentY + 2
            const guideW = 164
            const guideH = 26
            const guideX = screenX + (screenW - guideW) / 2
            drawRoundedRect(guideX, guideY, guideW, guideH, 13, isQrVerified ? '#ECFDF5' : '#F1F5F9', isQrVerified ? '#A7F3D0' : '#E2E8F0', 1)
            
            if (isQrVerified) {
                drawIconCheckCircle(guideX + 16, guideY + 13, 6, '#10B981')
                ctx.textAlign = 'left'
                ctx.fillStyle = '#065F46'
                ctx.font = '700 10px "NovaText", sans-serif'
                ctx.fillText('Target 04 QR Identified', guideX + 28, guideY + 17)
            } else {
                ctx.beginPath()
                ctx.arc(guideX + 16, guideY + 13, 3.5, 0, Math.PI * 2)
                ctx.fillStyle = '#10B981'
                ctx.fill()
                ctx.textAlign = 'left'
                ctx.fillStyle = '#334155'
                ctx.font = '700 10px "NovaText", sans-serif'
                ctx.fillText('Align scoresheet in frame', guideX + 26, guideY + 17)
            }

            // Central Camera Viewfinder Card
            const vCardW = 270
            const vCardH = 240
            const vCardX = screenX + (screenW - vCardW) / 2
            const vCardY = guideY + 36

            // White Viewfinder Container
            drawRoundedRect(vCardX, vCardY, vCardW, vCardH, 20, '#FFFFFF', '#E2E8F0', 1.2)

            // Inner Soft Preview Backdrop
            const innerMargin = 12
            const innerW = vCardW - innerMargin * 2
            const innerH = vCardH - innerMargin * 2
            drawRoundedRect(vCardX + innerMargin, vCardY + innerMargin, innerW, innerH, 16, '#F8FAFC', '#E2E8F0', 0.8)

            // Center Dynamic QR Code Graphic
            const qrSize = 136
            const qrX = vCardX + (vCardW - qrSize) / 2
            const qrY = vCardY + (vCardH - qrSize) / 2
            drawDynamicQRCode(qrX, qrY, qrSize, '#0F172A')

            // Viewfinder Corner Brackets
            const bracketPad = 10
            const bX = qrX - bracketPad
            const bY = qrY - bracketPad
            const bW = qrSize + bracketPad * 2
            const bH = qrSize + bracketPad * 2
            const cornerLen = 22

            ctx.strokeStyle = isQrVerified ? '#10B981' : '#0F172A'
            ctx.lineWidth = 3.5
            ctx.lineCap = 'round'

            // Top Left
            ctx.beginPath()
            ctx.moveTo(bX, bY + cornerLen); ctx.lineTo(bX, bY); ctx.lineTo(bX + cornerLen, bY)
            ctx.stroke()
            // Top Right
            ctx.beginPath()
            ctx.moveTo(bX + bW - cornerLen, bY); ctx.lineTo(bX + bW, bY); ctx.lineTo(bX + bW, bY + cornerLen)
            ctx.stroke()
            // Bottom Left
            ctx.beginPath()
            ctx.moveTo(bX, bY + bH - cornerLen); ctx.lineTo(bX, bY + bH); ctx.lineTo(bX + cornerLen, bY + bH)
            ctx.stroke()
            // Bottom Right
            ctx.beginPath()
            ctx.moveTo(bX + bW - cornerLen, bY + bH); ctx.lineTo(bX + bW, bY + bH); ctx.lineTo(bX + bW, bY + bH - cornerLen)
            ctx.stroke()

            // Animated Laser Scanning Beam (Emerald Glow)
            if (!isQrVerified) {
                const laserY = qrY + scanLaserY * qrSize
                ctx.save()
                ctx.shadowColor = 'rgba(16, 185, 129, 0.75)'
                ctx.shadowBlur = 10
                ctx.strokeStyle = '#10B981'
                ctx.lineWidth = 2.5
                ctx.beginPath()
                ctx.moveTo(bX + 4, laserY)
                ctx.lineTo(bX + bW - 4, laserY)
                ctx.stroke()
                ctx.restore()
            }

            // Quick Action Controls Row (Flashlight & Manual Entry)
            const actionY = vCardY + vCardH + 14
            const btnActionW = (screenW - 44) / 2

            // Flashlight button (Vector icon + text)
            const btn1X = screenX + 18
            drawRoundedRect(btn1X, actionY, btnActionW, 36, 12, '#FFFFFF', '#E2E8F0', 1)
            drawIconFlashlight(btn1X + 28, actionY + 18, '#334155')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#334155'
            ctx.font = '700 10.5px "NovaText", sans-serif'
            ctx.fillText('Torch Off', btn1X + 42, actionY + 22)

            // Manual Code button (Vector icon + text)
            const btn2X = screenX + 18 + btnActionW + 8
            drawRoundedRect(btn2X, actionY, btnActionW, 36, 12, '#FFFFFF', '#E2E8F0', 1)
            drawIconKeyboard(btn2X + 28, actionY + 18, '#334155')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#334155'
            ctx.font = '700 10.5px "NovaText", sans-serif'
            ctx.fillText('Manual Code', btn2X + 44, actionY + 22)

            // Bottom Status / Verification Card
            const statusCardY = actionY + 48
            if (isQrVerified) {
                drawRoundedRect(screenX + 18, statusCardY, screenW - 36, 84, 16, '#ECFDF5', '#10B981', 1.5)
                drawIconCheckCircle(screenX + 42, statusCardY + 36, 14, '#10B981')

                ctx.textAlign = 'left'
                ctx.fillStyle = '#065F46'
                ctx.font = '800 13.5px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('Scoresheet Verified: Target 04', screenX + 68, statusCardY + 28)

                ctx.fillStyle = '#047857'
                ctx.font = '600 10px "NovaText", sans-serif'
                ctx.fillText('Recurve Men Open 70m · 3 Registered Archers', screenX + 68, statusCardY + 44)

                // Animated progress load bar
                ctx.fillStyle = '#059669'
                ctx.font = '700 9.5px "NovaText", sans-serif'
                ctx.fillText('Opening target roster...', screenX + 68, statusCardY + 60)

                drawRoundedRect(screenX + 68, statusCardY + 66, screenW - 104, 4, 2, '#D1FAE5')
                drawRoundedRect(screenX + 68, statusCardY + 66, (screenW - 104) * 0.85, 4, 2, '#10B981')
            } else {
                drawRoundedRect(screenX + 18, statusCardY, screenW - 36, 74, 16, '#FFFFFF', '#E2E8F0', 1)
                
                // Pulsing Scan Radar Icon
                drawRoundedRect(screenX + 30, statusCardY + 16, 42, 42, 12, '#F1F5F9')
                drawIconScanner(screenX + 51, statusCardY + 37, '#0F172A')

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('Scanning Scoresheet...', screenX + 82, statusCardY + 32)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 10px "NovaText", sans-serif'
                ctx.fillText('Hold camera 20–30 cm from printout', screenX + 82, statusCardY + 48)
            }
        }
        // ══════════════════════════════════════════════════════════
        // ══════════════════════════════════════════════════════════
        // SCENE 4: TARGET 04 DETAILS & ARCHER ROSTER (ListScoreScreen)
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 3) {
            // App Bar Header
            drawRoundedRect(screenX + 18, appBarY + 4, 38, 38, 12, '#FFFFFF', '#E2E8F0', 1)
            drawIconBack(screenX + 37, appBarY + 23)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 17px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target 04 Scoresheet', screenX + 68, appBarY + 20)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px "NovaText", sans-serif'
            ctx.fillText('National Archery Championship 2026', screenX + 68, appBarY + 36)

            // Scoresheet Card (SkScoresheetCard)
            const scCardY = contentY + 4
            const scCardH = 80
            drawRoundedRect(screenX + 18, scCardY, screenW - 36, scCardH, 16, '#FFFFFF', '#E2E8F0', 1)

            // Left Target Pill Box (Navy)
            drawRoundedRect(screenX + 28, scCardY + 14, 46, 52, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 20px "Bricolage Grotesque", sans-serif'
            ctx.fillText('04', screenX + 51, scCardY + 46)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('National Archery Championship 2026', screenX + 84, scCardY + 27)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('Recurve Men Open · Session 1', screenX + 84, scCardY + 42)

            // Badges row
            const b1X = screenX + 84
            const b1W = 42
            drawRoundedRect(b1X, scCardY + 49, b1W, 20, 5, '#F1F5F9')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#334155'
            ctx.font = '700 8.5px "NovaText", sans-serif'
            ctx.fillText('70m', b1X + b1W / 2, scCardY + 62)

            const b2X = b1X + b1W + 6
            const b2W = 108
            drawRoundedRect(b2X, scCardY + 49, b2W, 20, 5, '#F1F5F9')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#334155'
            ctx.font = '700 8.5px "NovaText", sans-serif'
            ctx.fillText('6 Ends × 6 Arrows', b2X + b2W / 2, scCardY + 62)

            // Section Header
            const athSecY = scCardY + 98
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 14.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Archers (3)', screenX + 20, athSecY)

            ctx.textAlign = 'right'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px "NovaText", sans-serif'
            ctx.fillText('Select to score', screenX + screenW - 20, athSecY)

            const archers = [
                { pos: '4A', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club · Recurve', status: 'End 3/6 · 118 pts', score: '118 pts', isAct: true, init: 'AD' },
                { pos: '4B', name: 'Diananda Choirunisa', club: 'Focus Target Club · Recurve', status: 'End 3/6 · 116 pts', score: '116 pts', isAct: false, init: 'DC' },
                { pos: '4C', name: 'Riau Ega Agatha', club: 'Eagle Archery Club · Recurve', status: 'End 3/6 · 115 pts', score: '115 pts', isAct: false, init: 'RE' }
            ]

            let ay = athSecY + 14
            archers.forEach((a, idx) => {
                const ah = 64
                const isSelected = a.isAct && isArcherSelected
                drawRoundedRect(screenX + 18, ay, screenW - 36, ah, 16, '#FFFFFF', isSelected ? '#0F172A' : '#E2E8F0', isSelected ? 2 : 1)

                // Unified Athlete Target & Avatar Badge (44x44 Navy Box with Lime Target Position)
                const badgeX = screenX + 28
                const badgeY = ay + 10
                const badgeW = 44
                const badgeH = 44

                drawRoundedRect(badgeX, badgeY, badgeW, badgeH, 12, '#0F172A', isSelected ? '#DCFB4A' : '#334155', isSelected ? 1.8 : 1)

                ctx.textAlign = 'center'
                ctx.fillStyle = '#DCFB4A'
                ctx.font = '800 14px "Bricolage Grotesque", sans-serif'
                ctx.fillText(a.pos, badgeX + badgeW / 2, badgeY + 23)

                ctx.fillStyle = '#94A3B8'
                ctx.font = '700 8.5px "NovaText", sans-serif'
                ctx.fillText(a.init, badgeX + badgeW / 2, badgeY + 36)

                // Info: Athlete Name & Club with Spacious Layout
                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(a.name, screenX + 80, ay + 26)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9.5px "NovaText", sans-serif'
                ctx.fillText(a.club, screenX + 80, ay + 44)

                // Right Status Badge (Symmetric 10px right padding matching left badge)
                const stW = 60
                const stH = 34
                const stX = screenX + screenW - 28 - stW
                const stY = ay + (ah - stH) / 2

                drawRoundedRect(stX, stY, stW, stH, 8, '#FEF3C7', 'rgba(245, 158, 11, 0.35)', 1)
                ctx.textAlign = 'center'
                ctx.fillStyle = '#B45309'
                ctx.font = '800 11px "Bricolage Grotesque", sans-serif'
                ctx.fillText(a.score, stX + stW / 2, stY + 14)
                ctx.font = '600 8.5px "NovaText", sans-serif'
                ctx.fillText('End 3 / 6', stX + stW / 2, stY + 26)

                ay += ah + 12
            })

            // Docked Bottom Action Button
            const btnDockY = screenY + screenH - 74
            drawRoundedRect(screenX + 18, btnDockY, screenW - 36, 52, 16, '#DCFB4A')
            drawIconScanner(screenX + 44, btnDockY + 26, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Start Scoring', screenX + screenW / 2 + 8, btnDockY + 32)
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 5: WA SCOREPAD KEYPAD & REAL-TIME INPUT (ManualScoreEntryScreen)
        // ══════════════════════════════════════════════════════════
        else {
            // App Bar Header
            drawRoundedRect(screenX + 18, appBarY + 4, 38, 38, 12, '#FFFFFF', '#E2E8F0', 1)
            drawIconBack(screenX + 37, appBarY + 23)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 16px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scoring · Recurve Men', screenX + 68, appBarY + 20)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px "NovaText", sans-serif'
            ctx.fillText('National Archery Championship 2026', screenX + 68, appBarY + 36)

            // Athlete Tabs (SkAthleteTabs)
            const tabY = contentY + 2
            const tabW = (screenW - 44) / 3

            // Tab 1: 4A (Active - Navy)
            drawRoundedRect(screenX + 18, tabY, tabW, 46, 12, '#0F172A')
            drawRoundedRect(screenX + 24, tabY + 8, 26, 30, 6, '#DCFB4A')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 11px "Bricolage Grotesque", sans-serif'
            ctx.fillText('4A', screenX + 37, tabY + 26)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 10.5px "NovaText", sans-serif'
            ctx.fillText('Arif Dwi P.', screenX + 56, tabY + 21)
            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
            const currentTotal = 118 + 10 + 10 + 9 + 10 + (scoreSlot5Filled ? 10 : 0) + (scoreSlot6Filled ? 9 : 0)
            ctx.fillText(`${currentTotal} pts`, screenX + 56, tabY + 36)

            // Tab 2: 4B (Inactive)
            drawRoundedRect(screenX + 22 + tabW, tabY, tabW, 46, 12, '#FFFFFF', '#E2E8F0', 1)
            drawRoundedRect(screenX + 28 + tabW, tabY + 8, 26, 30, 6, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 11px "Bricolage Grotesque", sans-serif'
            ctx.fillText('4B', screenX + 41 + tabW, tabY + 26)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px "NovaText", sans-serif'
            ctx.fillText('Diananda', screenX + 58 + tabW, tabY + 21)
            ctx.fillStyle = '#64748B'
            ctx.font = '700 10px "Bricolage Grotesque", sans-serif'
            ctx.fillText('116 pts', screenX + 58 + tabW, tabY + 36)

            // Tab 3: 4C (Inactive)
            drawRoundedRect(screenX + 26 + tabW * 2, tabY, tabW, 46, 12, '#FFFFFF', '#E2E8F0', 1)
            drawRoundedRect(screenX + 32 + tabW * 2, tabY + 8, 26, 30, 6, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 11px "Bricolage Grotesque", sans-serif'
            ctx.fillText('4C', screenX + 45 + tabW * 2, tabY + 26)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px "NovaText", sans-serif'
            ctx.fillText('Riau Ega', screenX + 62 + tabW * 2, tabY + 21)
            ctx.fillStyle = '#64748B'
            ctx.font = '700 10px "Bricolage Grotesque", sans-serif'
            ctx.fillText('115 pts', screenX + 62 + tabW * 2, tabY + 36)

            // Segmented End Progress Bar (SkEndProgressBar)
            const segY = tabY + 54
            const segW = (screenW - 56) / 6
            for (let i = 0; i < 6; i++) {
                const sx = screenX + 18 + i * (segW + 4)
                let segCol = '#E2E8F0'
                if (i < 2) segCol = '#DCFB4A' // Completed E1, E2
                else if (i === 2) segCol = '#0F172A' // Active E3
                drawRoundedRect(sx, segY, segW, 4, 2, segCol)
            }

            // Score Table Simple Grid (SkScoreTableSimple)
            const tblY = segY + 12
            drawRoundedRect(screenX + 18, tblY, screenW - 36, 162, 16, '#FFFFFF', '#E2E8F0', 1)

            // Table Header
            drawRoundedRect(screenX + 18, tblY, screenW - 36, 28, 16, '#F8FAFC')
            ctx.fillStyle = '#64748B'
            ctx.font = '800 10px "NovaText", sans-serif'
            ctx.textAlign = 'left'
            ctx.fillText('END', screenX + 30, tblY + 18)
            ctx.textAlign = 'center'
            ctx.fillText('Arrows (1 → 6)', screenX + screenW / 2 - 2, tblY + 18)
            ctx.textAlign = 'right'
            ctx.fillText('Total', screenX + screenW - 30, tblY + 18)

            // Table Rows (E1, E2, E3 Active, E4)
            const rowsData = [
                { end: 'E1', arrows: ['10', 'X', '9', '10', '9', '10'], total: '58', isAct: false },
                { end: 'E2', arrows: ['X', '10', '9', '9', '10', '10'], total: '58', isAct: false },
                {
                    end: 'E3',
                    arrows: [
                        '10', 'X', '9', '10',
                        scoreSlot5Filled ? '10' : '',
                        scoreSlot6Filled ? '9' : ''
                    ],
                    total: `${10 + 10 + 9 + 10 + (scoreSlot5Filled ? 10 : 0) + (scoreSlot6Filled ? 9 : 0)}`,
                    isAct: true
                },
                { end: 'E4', arrows: ['', '', '', '', '', ''], total: '—', isAct: false }
            ]

            rowsData.forEach((rw, ridx) => {
                const ry = tblY + 30 + ridx * 32
                if (rw.isAct) {
                    drawRoundedRect(screenX + 20, ry, screenW - 40, 30, 8, 'rgba(220, 251, 74, 0.15)')
                }

                // End Badge
                drawRoundedRect(screenX + 24, ry + 3, 30, 24, 6, rw.isAct ? '#0F172A' : '#F1F5F9', rw.isAct ? null : '#CBD5E1', 1)
                ctx.fillStyle = rw.isAct ? '#DCFB4A' : '#475569'
                ctx.textAlign = 'center'
                ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
                ctx.fillText(rw.end, screenX + 39, ry + 19)

                // 6 Arrow Cells
                const cellStartX = screenX + 64
                const cellW = 28
                const cellGap = 5
                rw.arrows.forEach((arr, aidx) => {
                    const cx = cellStartX + aidx * (cellW + cellGap)
                    const isCellTarget = rw.isAct && ((aidx === 4 && !scoreSlot5Filled) || (aidx === 5 && scoreSlot5Filled && !scoreSlot6Filled))

                    let bg = '#FFFFFF'
                    let textCol = '#0F172A'
                    let borderCol = isCellTarget ? '#0F172A' : '#CBD5E1'

                    if (arr === 'X' || arr === '10' || arr === '9') {
                        bg = '#FACC15'
                        textCol = '#713F12'
                        borderCol = 'transparent'
                    } else if (arr === '8' || arr === '7') {
                        bg = '#EF4444'
                        textCol = '#FFFFFF'
                        borderCol = 'transparent'
                    }

                    drawRoundedRect(cx, ry + 3, cellW, 24, 6, bg, borderCol, isCellTarget ? 1.8 : 1)

                    if (arr) {
                        ctx.textAlign = 'center'
                        ctx.fillStyle = textCol
                        ctx.font = '800 12px "Bricolage Grotesque", sans-serif'
                        ctx.fillText(arr, cx + cellW / 2, ry + 19)
                    } else if (isCellTarget) {
                        ctx.fillStyle = '#0F172A'
                        ctx.fillRect(cx + cellW / 2 - 1, ry + 7, 2, 16)
                    }
                })

                // Row Total
                ctx.textAlign = 'right'
                ctx.fillStyle = rw.isAct ? '#0F172A' : (rw.total === '—' ? '#94A3B8' : '#0F172A')
                ctx.font = '800 13px "Bricolage Grotesque", sans-serif'
                ctx.fillText(rw.total, screenX + screenW - 28, ry + 20)
            })

            // Metrics Strip (3 Metric Cards)
            const metY = tblY + 170
            const metW = (screenW - 52) / 3

            // Metric 1: 10+X
            drawRoundedRect(screenX + 18, metY, metW, 44, 12, '#FFFFFF', '#E2E8F0', 1)
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 15px "Bricolage Grotesque", sans-serif'
            ctx.fillText('14', screenX + 18 + metW / 2, metY + 22)
            ctx.fillStyle = '#64748B'
            ctx.font = '700 8.5px "NovaText", sans-serif'
            ctx.fillText('10+X', screenX + 18 + metW / 2, metY + 36)

            // Metric 2: X
            drawRoundedRect(screenX + 24 + metW, metY, metW, 44, 12, '#FFFFFF', '#E2E8F0', 1)
            ctx.fillStyle = '#65A30D'
            ctx.font = '800 15px "Bricolage Grotesque", sans-serif'
            ctx.fillText('5', screenX + 24 + metW * 1.5, metY + 22)
            ctx.fillStyle = '#64748B'
            ctx.font = '700 8.5px "NovaText", sans-serif'
            ctx.fillText('X COUNT', screenX + 24 + metW * 1.5, metY + 36)

            // Metric 3: Miss
            drawRoundedRect(screenX + 30 + metW * 2, metY, metW, 44, 12, '#FFFFFF', '#E2E8F0', 1)
            ctx.fillStyle = '#EF4444'
            ctx.font = '800 15px "Bricolage Grotesque", sans-serif'
            ctx.fillText('0', screenX + 30 + metW * 2.5, metY + 22)
            ctx.fillStyle = '#64748B'
            ctx.font = '700 8.5px "NovaText", sans-serif'
            ctx.fillText('MISS', screenX + 30 + metW * 2.5, metY + 36)

            // Sticky Bottom Target Numpad (SkNumpad)
            const numpadY = screenY + screenH - 248
            drawRoundedRect(screenX, numpadY, screenW, 248, 24, '#FFFFFF', '#E2E8F0', 1)

            // Top Drag Handle
            drawRoundedRect(screenX + screenW / 2 - 18, numpadY + 6, 36, 4, 2, '#E2E8F0')

            // Quick Info Row
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '700 11.5px "NovaText", sans-serif'
            const arrowNum = scoreSlot5Filled ? (scoreSlot6Filled ? 6 : 6) : 5
            ctx.fillText(`End 3 · Arrow ${arrowNum} of 6`, screenX + 20, numpadY + 26)

            drawRoundedRect(screenX + 160, numpadY + 14, 52, 18, 6, '#0F172A')
            ctx.fillStyle = '#DCFB4A'
            ctx.textAlign = 'center'
            ctx.font = '800 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText(`Slot ${arrowNum}`, screenX + 186, numpadY + 26)

            ctx.textAlign = 'right'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11.5px "NovaText", sans-serif'
            ctx.fillText('Review →', screenX + screenW - 20, numpadY + 26)

            // 3x4 Clean Keypad Grid
            const keyStartY = numpadY + 38
            const keyW = (screenW - 56) / 4
            const keyH = 40
            const keyGap = 8

            const keyGrid = [
                [
                    { l: 'X', isNavy: true },
                    { l: '10', isNavy: true },
                    { l: '9', isNavy: false },
                    { l: '8', isNavy: false }
                ],
                [
                    { l: '7', isNavy: false },
                    { l: '6', isNavy: false },
                    { l: '5', isNavy: false },
                    { l: '4', isNavy: false }
                ],
                [
                    { l: '3', isNavy: false },
                    { l: '2', isNavy: false },
                    { l: '1', isNavy: false },
                    { l: 'M', isMiss: true }
                ]
            ]

            keyGrid.forEach((row, rowIdx) => {
                const ky = keyStartY + rowIdx * (keyH + keyGap)
                row.forEach((k, colIdx) => {
                    const kx = screenX + 16 + colIdx * (keyW + keyGap)
                    const isPressed = activeKeypadKey === k.l

                    let bg = '#FFFFFF'
                    let textCol = '#0F172A'
                    let borderCol = '#E2E8F0'

                    if (k.isNavy) {
                        bg = '#0F172A'
                        textCol = '#DCFB4A'
                        borderCol = null
                    } else if (k.isMiss) {
                        bg = '#FEF2F2'
                        textCol = '#EF4444'
                        borderCol = 'rgba(239, 68, 68, 0.3)'
                    }

                    drawRoundedRect(kx, ky, keyW, keyH, 10, bg, isPressed ? '#0F172A' : borderCol, isPressed ? 2.5 : 1)

                    ctx.textAlign = 'center'
                    ctx.fillStyle = textCol
                    ctx.font = '800 15px "Bricolage Grotesque", sans-serif'
                    ctx.fillText(k.l, kx + keyW / 2, ky + 25)
                })
            })

            // Action Buttons (Undo & Review End)
            const actBtnY = keyStartY + 3 * (keyH + keyGap) + 4
            const undoW = (screenW - 42) * 0.35
            const nextW = (screenW - 42) * 0.65

            // Undo Button (Outlined)
            drawRoundedRect(screenX + 16, actBtnY, undoW, 46, 14, '#FFFFFF', '#CBD5E1', 1.2)
            drawIconUndo(screenX + 36, actBtnY + 23, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Undo', screenX + 16 + undoW / 2 + 8, actBtnY + 28)

            // Next End Button (Solid Lime)
            ctx.save()
            ctx.translate(screenX + 24 + undoW + nextW / 2, actBtnY + 23)
            ctx.scale(btnScoreSubmitScale, btnScoreSubmitScale)
            ctx.translate(-(screenX + 24 + undoW + nextW / 2), -(actBtnY + 23))

            drawRoundedRect(screenX + 24 + undoW, actBtnY, nextW, 46, 14, '#DCFB4A')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(scoreSlot6Filled ? 'Review End 3 →' : 'Save End', screenX + 24 + undoW + nextW / 2, actBtnY + 28)
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

        // Ripple & Cursor
        if (tapRipple > 0 && tapRipple <= 1) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(tapX, tapY, tapRipple * 22, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(15, 23, 42, ${0.15 * (1 - tapRipple)})`
            ctx.fill()
            ctx.strokeStyle = `rgba(15, 23, 42, ${0.35 * (1 - tapRipple)})`
            ctx.lineWidth = 1.5
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
    window.__renderAtTime = (t) => {
        window.__forcedTime = t
        renderFrame(t)
    }
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
    background: #0B0F19;
    overflow: hidden;
    user-select: none;
    font-family: 'NovaText', 'Plus Jakarta Sans', sans-serif;
}

.stage-canvas {
    width: 1080px;
    height: 1080px;
    transform-origin: center center;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
    background: #ECEBE6;
    display: block;
    border-left: 3px solid #0F172A;
    border-right: 3px solid #0F172A;
    box-sizing: border-box;
}
</style>
