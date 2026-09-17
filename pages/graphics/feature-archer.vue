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

    const bannerImage = new Image()
    bannerImage.src = '/hero-homepage.jpeg'
    let isBannerLoaded = false
    bannerImage.onload = () => { isBannerLoaded = true }

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

    // High fidelity vector icons
    function drawIconHome(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        const hs = size / 2

        // Roof
        ctx.beginPath()
        ctx.moveTo(cx - hs, cy + 2)
        ctx.lineTo(cx, cy - hs + 1)
        ctx.lineTo(cx + hs, cy + 2)
        ctx.stroke()

        // House body
        ctx.beginPath()
        ctx.moveTo(cx - hs + 2.5, cy + 1)
        ctx.lineTo(cx - hs + 2.5, cy + hs)
        ctx.lineTo(cx + hs - 2.5, cy + hs)
        ctx.lineTo(cx + hs - 2.5, cy + 1)
        ctx.stroke()

        // Door
        ctx.fillRect(cx - 2, cy + hs - 5, 4, 5)
        ctx.restore()
    }

    function drawIconTicket(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        const w = size
        const h = size * 0.7
        const x = cx - w / 2
        const y = cy - h / 2

        ctx.beginPath()
        ctx.moveTo(x + 3, y)
        ctx.lineTo(x + w - 3, y)
        ctx.arcTo(x + w, y, x + w, y + 3, 3)
        ctx.lineTo(x + w, y + h / 2 - 2.5)
        ctx.arc(x + w, y + h / 2, 2.5, -Math.PI / 2, Math.PI / 2, true)
        ctx.lineTo(x + w, y + h - 3)
        ctx.arcTo(x + w, y + h, x + w - 3, y + h, 3)
        ctx.lineTo(x + 3, y + h)
        ctx.arcTo(x, y + h, x, y + h - 3, 3)
        ctx.lineTo(x, y + h / 2 + 2.5)
        ctx.arc(x, y + h / 2, 2.5, Math.PI / 2, -Math.PI / 2, true)
        ctx.lineTo(x, y + 3)
        ctx.arcTo(x, y, x + 3, y, 3)
        ctx.stroke()

        // Inner dashed line
        ctx.setLineDash([2, 2])
        ctx.beginPath()
        ctx.moveTo(cx - 1, y + 2)
        ctx.lineTo(cx - 1, y + h - 2)
        ctx.stroke()
        ctx.restore()
    }

    function drawIconTrophy(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        const s = size / 2

        // Cup body
        ctx.beginPath()
        ctx.moveTo(cx - s + 3, cy - s + 2)
        ctx.lineTo(cx + s - 3, cy - s + 2)
        ctx.lineTo(cx + s - 3, cy)
        ctx.arc(cx, cy, s - 3, 0, Math.PI, false)
        ctx.lineTo(cx - s + 3, cy - s + 2)
        ctx.stroke()

        // Stem & base
        ctx.beginPath()
        ctx.moveTo(cx, cy + s - 3)
        ctx.lineTo(cx, cy + s + 1)
        ctx.moveTo(cx - s + 4, cy + s + 1)
        ctx.lineTo(cx - s + 4, cy + s + 1)
        ctx.stroke()

        // Handles
        ctx.beginPath()
        ctx.arc(cx - s + 2, cy - 2, 3, Math.PI * 0.6, Math.PI * 1.5, false)
        ctx.moveTo(cx + s - 2, cy - 2)
        ctx.arc(cx + s - 2, cy - 2, 3, -Math.PI * 0.5, Math.PI * 0.4, false)
        ctx.stroke()
        ctx.restore()
    }

    function drawIconCalendar(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        const w = size
        const h = size * 0.9
        const x = cx - w / 2
        const y = cy - h / 2

        // Outer box
        drawRoundedRect(x, y, w, h, 3, null, color, 1.4)

        // Top line
        ctx.beginPath()
        ctx.moveTo(x, y + 4)
        ctx.lineTo(x + w, y + 4)
        ctx.stroke()

        // Top binder rings
        ctx.fillStyle = color
        ctx.fillRect(x + 3, y - 2, 1.5, 3)
        ctx.fillRect(x + w - 4.5, y - 2, 1.5, 3)

        // Mini calendar dots
        ctx.fillRect(cx - 2.5, cy + 0.5, 1.5, 1.5)
        ctx.fillRect(cx + 1.5, cy + 0.5, 1.5, 1.5)
        ctx.fillRect(cx - 2.5, cy + 4, 1.5, 1.5)
        ctx.fillRect(cx + 1.5, cy + 4, 1.5, 1.5)
        ctx.restore()
    }

    function drawIconLocation(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = 1.4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Pin top
        ctx.beginPath()
        ctx.arc(cx, cy - 2, size * 0.35, Math.PI, 0, false)
        ctx.lineTo(cx, cy + size * 0.45)
        ctx.closePath()
        ctx.stroke()

        // Inner dot
        ctx.beginPath()
        ctx.arc(cx, cy - 2, 1.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }

    function drawIconUser(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Head
        ctx.beginPath()
        ctx.arc(cx, cy - size * 0.22, size * 0.24, 0, Math.PI * 2)
        ctx.stroke()

        // Shoulder
        ctx.beginPath()
        ctx.arc(cx, cy + size * 0.42, size * 0.42, Math.PI * 1.15, Math.PI * 1.85, false)
        ctx.stroke()
        ctx.restore()
    }

    function drawIconCheck(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(cx - size * 0.35, cy)
        ctx.lineTo(cx - size * 0.05, cy + size * 0.3)
        ctx.lineTo(cx + size * 0.38, cy - size * 0.3)
        ctx.stroke()
        ctx.restore()
    }

    function drawIconClock(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.lineWidth = 1.4
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(cx, cy, size / 2, 0, Math.PI * 2)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(cx, cy - size * 0.3)
        ctx.lineTo(cx, cy)
        ctx.lineTo(cx + size * 0.22, cy)
        ctx.stroke()
        ctx.restore()
    }

    // Dynamic QR Code Matrix
    function drawDynamicQRCode(x, y, size, dotColor = '#0F172A') {
        const cols = 21
        const cellSize = size / cols
        ctx.save()
        drawRoundedRect(x, y, size, size, 8, '#FFFFFF', '#E2E8F0', 1)
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
        const elapsed = ((effectiveNow - startTime) / 1000) % CYCLE_DURATION

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

        // 2. State & Timing Variables
        let sceneIndex = 0
        let camZoom = 1.00
        let camPanY = 0

        let isEventPicked = false
        let isDetailNavigated = false
        let btnDetailScale = 1.0
        let isCategorySelected = false
        let activeCategoryIndex = 0
        let btnCategoryScale = 1.0
        let isPaymentSettled = false
        let btnPayScale = 1.0
        let isPassSaved = false
        let btnPassScale = 1.0
        let bottomNavActive = 0

        let cursorVisible = false
        let cursorX = 0, cursorY = 0
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        const STEP_TIME = 5.0

        // ══════════════════════════════════════════════════════════
        // SCENE 1: EVENT DISCOVERY & SELECTION (0.0s – 5.0s)
        // ══════════════════════════════════════════════════════════
        if (elapsed < STEP_TIME) {
            sceneIndex = 0
            bottomNavActive = 0
            if (elapsed < 1.4) {
                const zt = easeInOutCubic(elapsed / 1.4)
                camZoom = 1.00 + 0.44 * zt
                camPanY = -85 * zt
            } else {
                camZoom = 1.44
                camPanY = -85
            }

            const card1Y = 419
            if (elapsed >= 0.8) {
                cursorVisible = true
                if (elapsed < 2.0) {
                    const mt = easeInOutCubic((elapsed - 0.8) / 1.2)
                    cursorX = 540
                    cursorY = 260 + (card1Y - 260) * mt
                } else if (elapsed < 2.6) {
                    cursorX = 540; cursorY = card1Y
                    cursorPressed = true
                    tapRipple = (elapsed - 2.0) / 0.6
                    tapX = 540; tapY = card1Y
                    isEventPicked = true
                } else {
                    isEventPicked = true
                    cursorX = 540; cursorY = card1Y
                }
            }
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 2: TOURNAMENT DETAIL PAGE (5.0s – 10.0s)
        // ══════════════════════════════════════════════════════════
        else if (elapsed < STEP_TIME * 2) {
            sceneIndex = 1
            isEventPicked = true
            bottomNavActive = 0
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

            const btnRegisterY = 774
            if (step2Elapsed >= 1.2) {
                cursorVisible = true
                if (step2Elapsed < 2.4) {
                    const mt = easeInOutCubic((step2Elapsed - 1.2) / 1.2)
                    cursorX = 540
                    cursorY = 480 + (btnRegisterY - 480) * mt
                } else {
                    cursorX = 540; cursorY = btnRegisterY
                }

                if (step2Elapsed >= 2.4) {
                    isDetailNavigated = true
                    if (step2Elapsed >= 2.4 && step2Elapsed <= 2.95) {
                        cursorPressed = true
                        btnDetailScale = 0.94
                        tapRipple = (step2Elapsed - 2.4) / 0.55
                        tapX = 540; tapY = btnRegisterY
                    }
                }
            }
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 3: CATEGORY & DISTANCE SELECTION (10.0s – 15.0s)
        // ══════════════════════════════════════════════════════════
        else if (elapsed < STEP_TIME * 3) {
            sceneIndex = 2
            isEventPicked = true
            isDetailNavigated = true
            bottomNavActive = 0
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

            const catCard1Y = 350
            const btnPayStepY = 774

            if (step3Elapsed >= 0.8) {
                cursorVisible = true
                if (step3Elapsed < 1.8) {
                    const mt = easeInOutCubic((step3Elapsed - 0.8) / 1.0)
                    cursorX = 540
                    cursorY = 240 + (catCard1Y - 240) * mt
                } else if (step3Elapsed < 2.3) {
                    cursorX = 540; cursorY = catCard1Y
                    cursorPressed = true
                    tapRipple = (step3Elapsed - 1.8) / 0.5
                    tapX = 540; tapY = catCard1Y
                    isCategorySelected = true
                    activeCategoryIndex = 0
                } else if (step3Elapsed < 3.3) {
                    isCategorySelected = true
                    const bt = easeInOutCubic((step3Elapsed - 2.3) / 1.0)
                    cursorX = 540
                    cursorY = catCard1Y + (btnPayStepY - catCard1Y) * bt
                } else {
                    isCategorySelected = true
                    cursorX = 540; cursorY = btnPayStepY
                    if (step3Elapsed >= 3.3 && step3Elapsed <= 3.85) {
                        cursorPressed = true
                        btnCategoryScale = 0.94
                        tapRipple = (step3Elapsed - 3.3) / 0.55
                        tapX = 540; tapY = btnPayStepY
                    }
                }
            }
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 4: QRIS PAYMENT & INSTANT SETTLEMENT (15.0s – 20.0s)
        // ══════════════════════════════════════════════════════════
        else if (elapsed < STEP_TIME * 4) {
            sceneIndex = 3
            isEventPicked = true
            isDetailNavigated = true
            isCategorySelected = true
            bottomNavActive = 0
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

            const btnConfirmPayY = 774
            if (step4Elapsed >= 1.0) {
                cursorVisible = true
                if (step4Elapsed < 2.2) {
                    const mt = easeInOutCubic((step4Elapsed - 1.0) / 1.2)
                    cursorX = 540
                    cursorY = 540 + (btnConfirmPayY - 540) * mt
                } else {
                    cursorX = 540; cursorY = btnConfirmPayY
                }

                if (step4Elapsed >= 2.2) {
                    isPaymentSettled = true
                    if (step4Elapsed >= 2.2 && step4Elapsed <= 2.75) {
                        cursorPressed = true
                        btnPayScale = 0.94
                        tapRipple = (step4Elapsed - 2.2) / 0.55
                        tapX = 540; tapY = btnConfirmPayY
                    }
                }
            }
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 5: TICKET DETAIL & RE-REGISTRATION QR (20.0s – 25.0s)
        // ══════════════════════════════════════════════════════════
        else {
            sceneIndex = 4
            isEventPicked = true
            isDetailNavigated = true
            isCategorySelected = true
            isPaymentSettled = true
            bottomNavActive = 1 // My Tickets tab active
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
                const finT = easeInOutCubic((step5Elapsed - 4.2) / 0.8)
                camZoom = 1.44 - (1.44 - 1.00) * finT
                camPanY = -85 * (1 - finT)
            }

            const btnSaveWalletY = 774
            if (step5Elapsed >= 1.0 && step5Elapsed < 4.0) {
                cursorVisible = true
                if (step5Elapsed < 2.2) {
                    const mt = easeInOutCubic((step5Elapsed - 1.0) / 1.2)
                    cursorX = 540
                    cursorY = 560 + (btnSaveWalletY - 560) * mt
                } else {
                    cursorX = 540; cursorY = btnSaveWalletY
                }

                if (step5Elapsed >= 2.2) {
                    isPassSaved = true
                    if (step5Elapsed >= 2.2 && step5Elapsed <= 2.75) {
                        cursorPressed = true
                        btnPassScale = 0.94
                        tapRipple = (step5Elapsed - 2.2) / 0.55
                        tapX = 540; tapY = btnSaveWalletY
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
        ctx.shadowColor = 'rgba(15, 23, 42, 0.35)'
        ctx.shadowBlur = 45
        ctx.shadowOffsetY = 24
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
        ctx.fillText('ArcheryHub Official App', screenX + 20, appHeadY)

        let sceneHeaderTitle = 'Discover Tournaments'
        if (sceneIndex === 1) sceneHeaderTitle = 'Tournament Details'
        else if (sceneIndex === 2) sceneHeaderTitle = 'Division Selection'
        else if (sceneIndex === 3) sceneHeaderTitle = 'Instant Checkout'
        else if (sceneIndex === 4) sceneHeaderTitle = 'Digital Athlete Pass'

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
        // RENDER SCENE 1: DISCOVER TOURNAMENTS (REVAMPED)
        // ══════════════════════════════════════════════════════════
        if (sceneIndex === 0) {
            ctx.save()
            ctx.translate(screenX, contentY)

            // Division Filter Chips
            const filters = ['All Divisions', 'Recurve', 'Compound', 'Barebow']
            let fx = 18
            filters.forEach((f, idx) => {
                const fw = idx === 0 ? 84 : (idx === 1 ? 64 : 70)
                const isAct = idx === 0
                drawRoundedRect(fx, 4, fw, 26, 7, isAct ? '#0F172A' : '#FFFFFF', isAct ? null : '#E2E8F0', 1)
                ctx.textAlign = 'center'
                ctx.fillStyle = isAct ? '#D9FF00' : '#64748B'
                ctx.font = '700 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(f, fx + fw / 2, 21)
                fx += fw + 6
            })

            // Card 1: Featured Tournament (National Archery 2026)
            const card1W = screenW - 36
            const card1H = 264
            const card1BoxY = 38

            const isCard1Hovered = isEventPicked
            drawRoundedRect(18, card1BoxY, card1W, card1H, 14, '#FFFFFF', isCard1Hovered ? '#D9FF00' : '#E2E8F0', isCard1Hovered ? 2.2 : 1.2)

            // Banner Image & Overlay
            const bannerH = 96
            ctx.save()
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(18, card1BoxY, card1W, bannerH, [14, 14, 0, 0])
            } else {
                ctx.rect(18, card1BoxY, card1W, bannerH)
            }
            ctx.clip()

            if (isBannerLoaded && bannerImage.complete) {
                ctx.drawImage(bannerImage, 18, card1BoxY, card1W, bannerH)
                const grad = ctx.createLinearGradient(18, card1BoxY, 18, card1BoxY + bannerH)
                grad.addColorStop(0, 'rgba(15, 23, 42, 0.25)')
                grad.addColorStop(1, 'rgba(15, 23, 42, 0.75)')
                ctx.fillStyle = grad
                ctx.fillRect(18, card1BoxY, card1W, bannerH)
            } else {
                ctx.fillStyle = '#0F172A'
                ctx.fillRect(18, card1BoxY, card1W, bannerH)
            }

            // Status Badges on Banner
            drawRoundedRect(28, card1BoxY + 12, 102, 22, 6, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '800 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Registration Open', 28 + 51, card1BoxY + 26)

            drawRoundedRect(18 + card1W - 92, card1BoxY + 12, 80, 22, 6, 'rgba(15, 23, 42, 0.85)', '#334155', 1)
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 9px "NovaText", sans-serif'
            ctx.fillText('World Archery', 18 + card1W - 52, card1BoxY + 26)
            ctx.restore()

            // Card Body Typography & Metadata
            const cBodyY = card1BoxY + bannerH + 14
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 13.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('National Archery Championship 2026', 30, cBodyY)

            // Metadata Row 1: Calendar Date
            drawIconCalendar(36, cBodyY + 18, 12, '#64748B')
            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('24 – 26 Oct 2026 · 3 Days Competition', 48, cBodyY + 22)

            // Metadata Row 2: Location Venue
            drawIconLocation(36, cBodyY + 36, 12, '#64748B')
            ctx.fillText('Senayan Archery Range · Jakarta, Indonesia', 48, cBodyY + 40)

            // Bottom Pricing & Quota Footer Bar inside Card
            const footY = cBodyY + 54
            drawRoundedRect(30, footY, card1W - 24, 44, 8, '#F8FAFC', '#E2E8F0', 1)

            ctx.fillStyle = '#059669'
            ctx.font = '800 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Starts from Rp 350.000', 42, footY + 22)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", sans-serif'
            ctx.fillText('Official WA Target Face & Lane', 42, footY + 36)

            drawRoundedRect(30 + card1W - 108, footY + 10, 74, 24, 6, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '700 9px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('42 Slots Left', 30 + card1W - 71, footY + 25)

            // Card 2: Upcoming Tournament (Jakarta Open)
            const card2BoxY = card1BoxY + card1H + 14
            const card2H = 126
            drawRoundedRect(18, card2BoxY, card1W, card2H, 14, '#FFFFFF', '#E2E8F0', 1.2)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Jakarta Open Grand Prix 2026', 30, card2BoxY + 24)

            drawIconCalendar(36, card2BoxY + 42, 12, '#64748B')
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('10 – 12 Nov 2026 · Rawamangun Field', 48, card2BoxY + 46)

            drawRoundedRect(30, card2BoxY + 62, card1W - 24, 42, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#059669'
            ctx.font = '800 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Rp 320.000', 42, card2BoxY + 84)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", sans-serif'
            ctx.fillText('All Age Categories (U-15 & Open)', 42, card2BoxY + 96)

            drawRoundedRect(30 + card1W - 108, card2BoxY + 70, 74, 24, 6, '#F1F5F9')
            ctx.fillStyle = '#334155'
            ctx.textAlign = 'center'
            ctx.font = '700 9px "NovaText", sans-serif'
            ctx.fillText('18 Slots Left', 30 + card1W - 71, card2BoxY + 85)

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 2: TOURNAMENT DETAIL PAGE
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 1) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const dHeroW = screenW - 36
            const dHeroH = 480
            drawRoundedRect(18, 4, dHeroW, dHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Tournament Banner
            const dBannerH = 100
            ctx.save()
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(18, 4, dHeroW, dBannerH, [14, 14, 0, 0])
            } else {
                ctx.rect(18, 4, dHeroW, dBannerH)
            }
            ctx.clip()

            if (isBannerLoaded && bannerImage.complete) {
                ctx.drawImage(bannerImage, 18, 4, dHeroW, dBannerH)
                ctx.fillStyle = 'rgba(15, 23, 42, 0.55)'
                ctx.fillRect(18, 4, dHeroW, dBannerH)
            } else {
                ctx.fillStyle = '#0F172A'
                ctx.fillRect(18, 4, dHeroW, dBannerH)
            }

            drawRoundedRect(28, 16, 92, 22, 6, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '800 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Verified Event', 28 + 46, 30)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '800 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('National Archery 2026', 28, 80)
            ctx.fillStyle = '#E2E8F0'
            ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Senayan Stadium · Jakarta, Indonesia', 28, 94)
            ctx.restore()

            const specY = dBannerH + 16
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Tournament Information', 30, specY)

            // Specs grid (2 columns)
            const specs = [
                { label: 'Dates', val: '24 – 26 Oct 2026' },
                { label: 'Sanction', val: 'World Archery & Perpani' },
                { label: 'Venue', val: 'Senayan Outdoor Field' },
                { label: 'Rounds', val: '72 Arrows + Matchplay' }
            ]

            specs.forEach((s, idx) => {
                const sx = idx % 2 === 0 ? 30 : 180
                const sy = specY + 10 + Math.floor(idx / 2) * 44
                drawRoundedRect(sx, sy, 130, 38, 8, '#F8FAFC', '#E2E8F0', 1)
                ctx.fillStyle = '#64748B'
                ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(s.label, sx + 8, sy + 14)
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 10px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(s.val, sx + 8, sy + 29)
            })

            // Registration Quota Progress
            const quotaY = specY + 106
            drawRoundedRect(30, quotaY, dHeroW - 24, 76, 10, '#0F172A')
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Participant Quota Tracker', 44, quotaY + 20)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('158 / 200 Registered', 44, quotaY + 40)

            ctx.fillStyle = '#FFFFFF'
            ctx.textAlign = 'right'
            ctx.font = '700 11.5px "NovaText", sans-serif'
            ctx.fillText('79% Filled', 30 + dHeroW - 38, quotaY + 40)

            ctx.textAlign = 'left'
            drawRoundedRect(44, quotaY + 50, dHeroW - 52, 8, 4, '#334155')
            drawRoundedRect(44, quotaY + 50, (dHeroW - 52) * 0.79, 8, 4, '#D9FF00')

            // Inclusions overview with vector check icons
            const incY = quotaY + 90
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Entry Inclusions:', 30, incY)

            const incItems = [
                'Official Lane Allocation & Target Face',
                'Live Digital Scorecard & Instant Ranking',
                'Verified E-Certificate with Judge Seal'
            ]
            incItems.forEach((item, idx) => {
                const iy = incY + 16 + idx * 20
                drawIconCheck(36, iy - 2, 10, '#059669')
                ctx.fillStyle = '#475569'
                ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(item, 48, iy)
            })

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnDetailScale, btnDetailScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isDetailNavigated ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isDetailNavigated ? 'Opening Category Selection' : 'Select Category & Register', scBtnCX, scBtnY + 28)
            ctx.restore()

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 3: CATEGORY & DISTANCE SELECTION
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 2) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const catHeroW = screenW - 36
            const catHeroH = 480
            drawRoundedRect(18, 4, catHeroW, catHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Select Competition Division', 30, 26)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Available Categories', 30, 46)

            const categories = [
                {
                    title: 'Recurve Men Open 70m',
                    price: 'Rp 350.000',
                    desc: '72 Arrows Qualification + Matchplay',
                    slots: '8 Slots Left',
                    isAct: activeCategoryIndex === 0
                },
                {
                    title: 'Compound Men Open 50m',
                    price: 'Rp 350.000',
                    desc: '72 Arrows 50m Target Face + Finals',
                    slots: '14 Slots Left',
                    isAct: false
                },
                {
                    title: 'Barebow Men Open 50m',
                    price: 'Rp 300.000',
                    desc: '72 Arrows 122cm Face WA Standard',
                    slots: '20 Slots Left',
                    isAct: false
                }
            ]

            let cy = 60
            categories.forEach((c) => {
                const ch = 82
                drawRoundedRect(30, cy, catHeroW - 24, ch, 10, c.isAct ? '#F8FAFC' : '#FFFFFF', c.isAct ? '#0F172A' : '#E2E8F0', c.isAct ? 2 : 1)

                // Custom Radio Indicator
                const radCX = 48
                const radCY = cy + ch / 2
                ctx.beginPath()
                ctx.arc(radCX, radCY, 9, 0, Math.PI * 2)
                ctx.fillStyle = c.isAct ? '#0F172A' : '#FFFFFF'
                ctx.fill()
                ctx.strokeStyle = c.isAct ? '#0F172A' : '#CBD5E1'
                ctx.lineWidth = 1.5
                ctx.stroke()

                if (c.isAct) {
                    ctx.beginPath()
                    ctx.arc(radCX, radCY, 4, 0, Math.PI * 2)
                    ctx.fillStyle = '#D9FF00'
                    ctx.fill()
                }

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '800 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(c.title, 66, cy + 26)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(c.desc, 66, cy + 44)

                ctx.fillStyle = '#059669'
                ctx.font = '800 12px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(c.price, 66, cy + 66)

                drawRoundedRect(30 + catHeroW - 108, cy + 48, 76, 22, 6, '#F1F5F9')
                ctx.fillStyle = '#334155'
                ctx.textAlign = 'center'
                ctx.font = '700 9px "NovaText", sans-serif'
                ctx.fillText(c.slots, 30 + catHeroW - 70, cy + 63)

                cy += ch + 12
            })

            // Summary box of chosen category
            const sumY = cy + 6
            drawRoundedRect(30, sumY, catHeroW - 24, 76, 10, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Selected Division Summary', 44, sumY + 20)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Recurve Men Open 70m · Rp 350.000', 44, sumY + 40)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('Official Target Lane, Live Score & E-Certificate Included', 44, sumY + 60)

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnCategoryScale, btnCategoryScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isCategorySelected ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isCategorySelected ? 'Proceeding to Payment' : 'Proceed to Payment Gateway', scBtnCX, scBtnY + 28)
            ctx.restore()

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 4: QRIS PAYMENT & INSTANT SETTLEMENT
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 3) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const qHeroW = screenW - 36
            const qHeroH = 480
            drawRoundedRect(18, 4, qHeroW, qHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Invoice Summary Header
            drawRoundedRect(30, 16, qHeroW - 24, 76, 10, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Total Amount to Pay (QRIS Settlement)', 44, 34)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 20px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Rp 352.500', 44, 58)

            ctx.fillStyle = '#CBD5E1'
            ctx.font = '500 9px "NovaText", sans-serif'
            ctx.fillText('Includes Registration (Rp 350.000) + Service Fee (Rp 2.500)', 44, 78)

            // QRIS Scan Card
            const qBoxY = 104
            drawRoundedRect(30, qBoxY, qHeroW - 24, 252, 12, '#F8FAFC', '#E2E8F0', 1)

            // QRIS Badge Header
            drawRoundedRect(42, qBoxY + 12, qHeroW - 48, 30, 6, '#FFFFFF', '#CBD5E1', 1)
            ctx.fillStyle = '#DC2626'
            ctx.font = '800 12px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('QRIS', 54, qBoxY + 32)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('National Standard QR Payment', 90, qBoxY + 31)

            // High Precision Dynamic QR Code
            const qrSize = 130
            const qrX = 30 + (qHeroW - 24) / 2 - qrSize / 2
            const qrY = qBoxY + 50
            drawDynamicQRCode(qrX, qrY, qrSize)

            ctx.textAlign = 'center'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Scan with GoPay · OVO · BCA · Mandiri · Dana', 30 + (qHeroW - 24) / 2, qBoxY + 196)

            // Countdown Pill with Clock Icon
            const timerBoxW = 120
            const timerBoxX = 30 + (qHeroW - 24) / 2 - timerBoxW / 2
            drawRoundedRect(timerBoxX, qBoxY + 208, timerBoxW, 22, 6, '#FEF2F2', '#FECACA', 1)
            drawIconClock(timerBoxX + 14, qBoxY + 219, 10, '#DC2626')
            ctx.fillStyle = '#DC2626'
            ctx.font = '700 9.5px "NovaText", sans-serif'
            ctx.fillText('Expires in 14:59', timerBoxX + 66, qBoxY + 223)

            // Payment Verification Alert Banner
            if (isPaymentSettled) {
                const sAlertY = 368
                drawRoundedRect(30, sAlertY, qHeroW - 24, 52, 10, '#ECFDF5', '#10B981', 1.5)

                ctx.beginPath()
                ctx.arc(52, sAlertY + 26, 12, 0, Math.PI * 2)
                ctx.fillStyle = '#10B981'
                ctx.fill()

                drawIconCheck(52, sAlertY + 26, 12, '#FFFFFF')

                ctx.textAlign = 'left'
                ctx.fillStyle = '#065F46'
                ctx.font = '800 12px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('Payment Verified & Settled', 72, sAlertY + 24)

                ctx.fillStyle = '#047857'
                ctx.font = '500 9.5px "NovaText", sans-serif'
                ctx.fillText('Official athlete pass generated with venue QR pass', 72, sAlertY + 40)
            }

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnPayScale, btnPayScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isPaymentSettled ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isPaymentSettled ? 'Payment Verified & Confirmed' : 'Confirm & Pay with QRIS', scBtnCX, scBtnY + 28)
            ctx.restore()

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 5: TICKET DETAIL & RE-REGISTRATION QR PASS
        // ══════════════════════════════════════════════════════════
        else {
            ctx.save()
            ctx.translate(screenX, contentY)

            const tHeroW = screenW - 36
            const tHeroH = 480
            drawRoundedRect(18, 4, tHeroW, tHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Pass Header Banner
            drawRoundedRect(30, 16, tHeroW - 24, 60, 10, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Official Athlete Pass & Gate Ticket', 44, 38)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('National Archery Championship 2026 · Senayan Stadium', 44, 56)

            // Athlete & Lane Info Box
            const aInfoY = 84
            drawRoundedRect(30, aInfoY, tHeroW - 24, 94, 10, '#F8FAFC', '#E2E8F0', 1)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 16px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Arif Dwi Pangestu', 44, aInfoY + 26)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Fast Archery Club · Recurve Men Open 70m', 44, aInfoY + 44)

            // Target Assignment & Session Badges
            drawRoundedRect(44, aInfoY + 54, 110, 28, 6, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 12px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target 01-A', 56, aInfoY + 72)

            drawRoundedRect(162, aInfoY + 54, 106, 28, 6, '#F1F5F9', '#CBD5E1', 1)
            ctx.fillStyle = '#334155'
            ctx.font = '700 9.5px "NovaText", sans-serif'
            ctx.fillText('Session 1 (08:00 WIB)', 170, aInfoY + 72)

            // Scannable Venue Gate QR Code Box
            const qrCardY = 188
            drawRoundedRect(30, qrCardY, tHeroW - 24, 182, 12, '#FFFFFF', '#E2E8F0', 1.2)

            const qrPassSize = 110
            const qrPassX = 30 + (tHeroW - 24) / 2 - qrPassSize / 2
            const qrPassY = qrCardY + 12
            drawDynamicQRCode(qrPassX, qrPassY, qrPassSize)

            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scan at Venue Re-registration Desk', 30 + (tHeroW - 24) / 2, qrCardY + 140)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Ticket ID: AH-2026-TKT-9921-ID · Gate Pass Ready', 30 + (tHeroW - 24) / 2, qrCardY + 158)

            // Apple Wallet / Check-in Indicator
            const wBadgeY = 380
            drawRoundedRect(30, wBadgeY, tHeroW - 24, 42, 8, isPassSaved ? '#ECFDF5' : '#F1F5F9', isPassSaved ? '#10B981' : '#E2E8F0', 1)
            ctx.fillStyle = isPassSaved ? '#065F46' : '#334155'
            ctx.font = '700 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isPassSaved ? 'Pass Synchronized with Apple Wallet & Offline PDF' : 'Digital Pass Synced to Athlete Profile', 30 + (tHeroW - 24) / 2, wBadgeY + 26)

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnPassScale, btnPassScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isPassSaved ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isPassSaved ? 'Pass Saved to Apple Wallet & PDF' : 'Save Pass to Apple Wallet & PDF', scBtnCX, scBtnY + 28)
            ctx.restore()

            ctx.restore()
        }

        ctx.restore() // Content clip

        // ══════════════════════════════════════════════════════════
        // AUTHENTIC FLUTTER MAINHUB BOTTOM NAVIGATION BAR
        // ══════════════════════════════════════════════════════════
        const bNavH = 64
        const bNavY = screenY + screenH - bNavH

        ctx.save()
        // Bottom bar container with top rounded corners
        drawRoundedRect(screenX, bNavY, screenW, bNavH + 20, 24, '#0F172A')

        // 4 Nav tabs layout: Left 2 tabs, Center FAB gap, Right 2 tabs
        // Tab 0: Home (Beranda)
        const tab0Active = bottomNavActive === 0
        const tab0CX = screenX + 42
        const tab0CY = bNavY + 24
        drawIconHome(tab0CX, tab0CY, 18, tab0Active ? '#D9FF00' : '#94A3B8')
        ctx.textAlign = 'center'
        ctx.fillStyle = tab0Active ? '#D9FF00' : '#94A3B8'
        ctx.font = tab0Active ? '800 9px "Bricolage Grotesque", "NovaText", sans-serif' : '500 8.5px "NovaText", sans-serif'
        ctx.fillText('Home', tab0CX, bNavY + 44)

        if (tab0Active) {
            ctx.beginPath()
            ctx.arc(tab0CX, bNavY + 52, 2, 0, Math.PI * 2)
            ctx.fillStyle = '#D9FF00'
            ctx.fill()
        }

        // Tab 1: My Tickets (Tiket Saya)
        const tab1Active = bottomNavActive === 1
        const tab1CX = screenX + 106
        const tab1CY = bNavY + 24
        drawIconTicket(tab1CX, tab1CY, 18, tab1Active ? '#D9FF00' : '#94A3B8')
        ctx.fillStyle = tab1Active ? '#D9FF00' : '#94A3B8'
        ctx.font = tab1Active ? '800 9px "Bricolage Grotesque", "NovaText", sans-serif' : '500 8.5px "NovaText", sans-serif'
        ctx.fillText('My Tickets', tab1CX, bNavY + 44)

        if (tab1Active) {
            ctx.beginPath()
            ctx.arc(tab1CX, bNavY + 52, 2, 0, Math.PI * 2)
            ctx.fillStyle = '#D9FF00'
            ctx.fill()
        }

        // Tab 2: My Tournaments
        const tab2CX = screenX + screenW - 106
        const tab2CY = bNavY + 24
        drawIconCalendar(tab2CX, tab2CY, 16, '#94A3B8')
        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 8.5px "NovaText", sans-serif'
        ctx.fillText('Tournaments', tab2CX, bNavY + 44)

        // Tab 3: Profile
        const tab3CX = screenX + screenW - 42
        const tab3CY = bNavY + 24
        drawIconUser(tab3CX, tab3CY, 18, '#94A3B8')
        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 8.5px "NovaText", sans-serif'
        ctx.fillText('Profile', tab3CX, bNavY + 44)

        // Center Elevated Floating Action Button (Events FAB)
        const fabCX = screenX + screenW / 2
        const fabCY = bNavY + 16
        const fabR = 24

        ctx.save()
        ctx.shadowColor = 'rgba(217, 255, 0, 0.45)'
        ctx.shadowBlur = 14
        ctx.shadowOffsetY = 2

        ctx.beginPath()
        ctx.arc(fabCX, fabCY, fabR, 0, Math.PI * 2)
        ctx.fillStyle = '#D9FF00'
        ctx.fill()
        ctx.restore()

        ctx.beginPath()
        ctx.arc(fabCX, fabCY, fabR, 0, Math.PI * 2)
        ctx.strokeStyle = '#0F172A'
        ctx.lineWidth = 3
        ctx.stroke()

        drawIconTrophy(fabCX, fabCY, 20, '#0F172A')

        ctx.restore() // Bottom bar clip

        // Top Status Bar & Dynamic Island
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

        drawRoundedRect(540 - 55, screenY + screenH - 10, 110, 4, 2, '#CBD5E1')
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
