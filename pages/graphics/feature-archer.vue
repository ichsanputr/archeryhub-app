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

    const mayarImage = new Image()
    mayarImage.src = '/mayar-logo.png'
    let isMayarLoaded = false
    mayarImage.onload = () => { isMayarLoaded = true }

    const paypalImage = new Image()
    paypalImage.src = '/paypal-logo.svg'
    let isPaypalLoaded = false
    paypalImage.onload = () => { isPaypalLoaded = true }

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

    // Vector icons matching Flutter Design System
    function drawIconHome(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        const hs = size / 2

        ctx.beginPath()
        ctx.moveTo(cx - hs, cy + 2)
        ctx.lineTo(cx, cy - hs + 1)
        ctx.lineTo(cx + hs, cy + 2)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(cx - hs + 2.5, cy + 1)
        ctx.lineTo(cx - hs + 2.5, cy + hs)
        ctx.lineTo(cx + hs - 2.5, cy + hs)
        ctx.lineTo(cx + hs - 2.5, cy + 1)
        ctx.stroke()

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
        ctx.lineWidth = 1.7
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        const s = size / 2

        ctx.beginPath()
        ctx.moveTo(cx - s + 3, cy - s + 2)
        ctx.lineTo(cx + s - 3, cy - s + 2)
        ctx.lineTo(cx + s - 3, cy)
        ctx.arc(cx, cy, s - 3, 0, Math.PI, false)
        ctx.lineTo(cx - s + 3, cy - s + 2)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(cx, cy + s - 3)
        ctx.lineTo(cx, cy + s + 1)
        ctx.moveTo(cx - s + 4, cy + s + 1)
        ctx.lineTo(cx + s - 4, cy + s + 1)
        ctx.stroke()

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
        ctx.lineWidth = 1.4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        const w = size
        const h = size * 0.9
        const x = cx - w / 2
        const y = cy - h / 2

        drawRoundedRect(x, y, w, h, 3, null, color, 1.4)

        ctx.beginPath()
        ctx.moveTo(x, y + 4)
        ctx.lineTo(x + w, y + 4)
        ctx.stroke()

        ctx.fillStyle = color
        ctx.fillRect(x + 3, y - 2, 1.5, 3)
        ctx.fillRect(x + w - 4.5, y - 2, 1.5, 3)

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

        ctx.beginPath()
        ctx.arc(cx, cy - 2, size * 0.35, Math.PI, 0, false)
        ctx.lineTo(cx, cy + size * 0.45)
        ctx.closePath()
        ctx.stroke()

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

        ctx.beginPath()
        ctx.arc(cx, cy - size * 0.22, size * 0.24, 0, Math.PI * 2)
        ctx.stroke()

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

    function drawIconBookmark(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        const hs = size / 2
        ctx.beginPath()
        ctx.moveTo(cx - hs, cy - hs)
        ctx.lineTo(cx + hs, cy - hs)
        ctx.lineTo(cx + hs, cy + hs)
        ctx.lineTo(cx, cy + hs * 0.4)
        ctx.lineTo(cx - hs, cy + hs)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
    }

    function drawIconSearch(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(cx - 2, cy - 2, size * 0.35, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cx + 2, cy + 2)
        ctx.lineTo(cx + size * 0.45, cy + size * 0.45)
        ctx.stroke()
        ctx.restore()
    }

    function drawIconBack(cx, cy, color = '#0F172A') {
        ctx.save()
        ctx.strokeStyle = color
        ctx.lineWidth = 1.8
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(cx + 4, cy - 6)
        ctx.lineTo(cx - 3, cy)
        ctx.lineTo(cx + 4, cy + 6)
        ctx.stroke()
        ctx.restore()
    }

    function drawIconDownload(cx, cy, size, color) {
        ctx.save()
        ctx.strokeStyle = color
        ctx.lineWidth = 1.8
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(cx, cy - size * 0.4)
        ctx.lineTo(cx, cy + size * 0.2)
        ctx.moveTo(cx - size * 0.25, cy)
        ctx.lineTo(cx, cy + size * 0.25)
        ctx.lineTo(cx + size * 0.25, cy)
        ctx.moveTo(cx - size * 0.4, cy + size * 0.45)
        ctx.lineTo(cx + size * 0.4, cy + size * 0.45)
        ctx.stroke()
        ctx.restore()
    }

    // Dynamic QR Code Matrix Generator
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

        ctx.restore()
    }

    // Official Mayar Branding Icon
    function drawLogoMayarIcon(x, y, w = 48, h = 34) {
        ctx.save()
        drawRoundedRect(x, y, w, h, 8, '#FFFFFF', '#E2E8F0', 0.8)
        if (isMayarLoaded && mayarImage.complete) {
            const padX = 8, padY = 4
            ctx.drawImage(mayarImage, x + padX, y + padY, w - padX * 2, h - padY * 2)
        } else {
            ctx.fillStyle = '#0055FF'
            ctx.font = '900 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('M', x + w / 2, y + h / 2)
        }
        ctx.restore()
    }

    // Official PayPal Branding Icon
    function drawLogoPayPalIcon(x, y, w = 54, h = 34) {
        ctx.save()
        drawRoundedRect(x, y, w, h, 8, '#FFFFFF', '#E2E8F0', 0.8)
        if (isPaypalLoaded && paypalImage.complete) {
            const padX = 6, padY = 5
            ctx.drawImage(paypalImage, x + padX, y + padY, w - padX * 2, h - padY * 2)
        } else {
            ctx.fillStyle = '#003087'
            ctx.font = '900 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('PayPal', x + w / 2, y + h / 2)
        }
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

        // 2. State & Timing Variables
        let sceneIndex = 0
        let camZoom = 1.00
        let camPanY = 0

        let isEventPicked = false
        let btnEventCardScale = 1.0
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

            const card1CenterY = 560
            if (elapsed >= 0.8) {
                cursorVisible = true
                if (elapsed < 2.0) {
                    const mt = easeInOutCubic((elapsed - 0.8) / 1.2)
                    cursorX = 540
                    cursorY = 260 + (card1CenterY - 260) * mt
                } else if (elapsed < 2.6) {
                    cursorX = 540; cursorY = card1CenterY
                    cursorPressed = true
                    btnEventCardScale = 0.96
                    tapRipple = (elapsed - 2.0) / 0.6
                    tapX = 540; tapY = card1CenterY
                    isEventPicked = true
                } else {
                    isEventPicked = true
                    cursorX = 540; cursorY = card1CenterY
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

            const btnRegisterY = 670
            if (step2Elapsed >= 1.0) {
                cursorVisible = true
                if (step2Elapsed < 2.2) {
                    const mt = easeInOutCubic((step2Elapsed - 1.0) / 1.2)
                    cursorX = 540
                    cursorY = 480 + (btnRegisterY - 480) * mt
                } else {
                    cursorX = 540; cursorY = btnRegisterY
                }

                if (step2Elapsed >= 2.2) {
                    isDetailNavigated = true
                    if (step2Elapsed >= 2.2 && step2Elapsed <= 2.75) {
                        cursorPressed = true
                        btnDetailScale = 0.94
                        tapRipple = (step2Elapsed - 2.2) / 0.55
                        tapX = 540; tapY = btnRegisterY
                    }
                }
            }
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 3: CATEGORY & DIVISION SELECTION (10.0s – 15.0s)
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

            const catCard1Y = 356
            const btnPayStepY = 656

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
        // SCENE 4: MAYAR QRIS PAYMENT & INSTANT SETTLEMENT (15.0s – 20.0s)
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

            const btnConfirmPayY = 604
            if (step4Elapsed >= 1.0) {
                cursorVisible = true
                if (step4Elapsed < 2.2) {
                    const mt = easeInOutCubic((step4Elapsed - 1.0) / 1.2)
                    cursorX = 540
                    cursorY = 500 + (btnConfirmPayY - 500) * mt
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

            const btnDownloadPdfY = 676
            if (step5Elapsed >= 1.0 && step5Elapsed < 4.0) {
                cursorVisible = true
                if (step5Elapsed < 2.2) {
                    const mt = easeInOutCubic((step5Elapsed - 1.0) / 1.2)
                    cursorX = 540
                    cursorY = 520 + (btnDownloadPdfY - 520) * mt
                } else {
                    cursorX = 540; cursorY = btnDownloadPdfY
                }

                if (step5Elapsed >= 2.2) {
                    isPassSaved = true
                    if (step5Elapsed >= 2.2 && step5Elapsed <= 2.75) {
                        cursorPressed = true
                        btnPassScale = 0.94
                        tapRipple = (step5Elapsed - 2.2) / 0.55
                        tapX = 540; tapY = btnDownloadPdfY
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

        // Top App Header Area
        const appHeadY = screenY + 46
        const contentY = appHeadY + 32
        const contentH = screenH - 146

        ctx.save()
        ctx.beginPath()
        ctx.rect(screenX, contentY, screenW, contentH)
        ctx.clip()

        const scBtnW = screenW - 36
        const scBtnH = 48
        const scBtnX = 18
        const scBtnY = 440
        const scBtnCX = scBtnX + scBtnW / 2
        const scBtnCY = scBtnY + scBtnH / 2

        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 1: DISCOVER TOURNAMENTS (TournamentsScreen.dart)
        // ══════════════════════════════════════════════════════════
        if (sceneIndex === 0) {
            ctx.save()
            ctx.translate(screenX, contentY)

            // Header Title & Search Action Row
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '700 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('DISCOVER', 18, 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Tournaments', 18, 30)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('12 tournaments available · All', 18, 44)

            // Search Icon Circle Button
            drawRoundedRect(screenW - 52, 12, 34, 34, 17, '#FFFFFF', '#E2E8F0', 0.8)
            drawIconSearch(screenW - 35, 29, 14, '#0F172A')

            // Status Filter Chips matching Flutter _statusFilters
            const filters = ['All', 'Upcoming', 'Ongoing', 'Completed']
            let fx = 18
            const chipY = 54
            filters.forEach((f, idx) => {
                const fw = idx === 0 ? 46 : (idx === 1 ? 76 : (idx === 2 ? 68 : 80))
                const isAct = idx === 0
                drawRoundedRect(fx, chipY, fw, 26, 8, isAct ? '#0F172A' : '#FFFFFF', isAct ? null : '#E2E8F0', 0.8)
                ctx.textAlign = 'center'
                ctx.fillStyle = isAct ? '#DCFB4A' : '#475569'
                ctx.font = isAct ? '800 10px "Bricolage Grotesque", "NovaText", sans-serif' : '600 9.5px "NovaText", sans-serif'
                ctx.fillText(f, fx + fw / 2, chipY + 17)
                fx += fw + 6
            })

            // Card 1: Featured Tournament (National Archery Championship 2026)
            const card1W = screenW - 36
            const card1H = 250
            const card1BoxY = 88

            ctx.save()
            ctx.translate(18 + card1W / 2, card1BoxY + card1H / 2)
            ctx.scale(btnEventCardScale, btnEventCardScale)
            ctx.translate(-(18 + card1W / 2), -(card1BoxY + card1H / 2))

            // Soft shadow & clean subtle border
            ctx.save()
            ctx.shadowColor = 'rgba(15, 23, 42, 0.05)'
            ctx.shadowBlur = 8
            ctx.shadowOffsetY = 2
            drawRoundedRect(18, card1BoxY, card1W, card1H, 16, '#FFFFFF', '#E2E8F0', 0.8)
            ctx.restore()

            // Banner Image & Price Badge
            const bannerH = 88
            ctx.save()
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(18, card1BoxY, card1W, bannerH, [16, 16, 0, 0])
            } else {
                ctx.rect(18, card1BoxY, card1W, bannerH)
            }
            ctx.clip()

            if (isBannerLoaded && bannerImage.complete) {
                ctx.drawImage(bannerImage, 18, card1BoxY, card1W, bannerH)
                const grad = ctx.createLinearGradient(18, card1BoxY, 18, card1BoxY + bannerH)
                grad.addColorStop(0, 'rgba(15, 23, 42, 0.15)')
                grad.addColorStop(1, 'rgba(15, 23, 42, 0.65)')
                ctx.fillStyle = grad
                ctx.fillRect(18, card1BoxY, card1W, bannerH)
            } else {
                ctx.fillStyle = '#0F172A'
                ctx.fillRect(18, card1BoxY, card1W, bannerH)
            }

            // Top-Right Price Tag Badge
            drawRoundedRect(18 + card1W - 84, card1BoxY + 10, 74, 22, 6, '#0F172A')
            ctx.fillStyle = '#FFFFFF'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Rp 350.000', 18 + card1W - 47, card1BoxY + 25)
            ctx.restore()

            // Card 1 Body
            const cBodyY = card1BoxY + bannerH + 8

            // Row 1: Status badge & Date
            drawRoundedRect(28, cBodyY, 78, 18, 5, '#ECFDF5', null)
            ctx.fillStyle = '#059669'
            ctx.textAlign = 'center'
            ctx.font = '800 8.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Upcoming · Open', 28 + 39, cBodyY + 12.5)

            ctx.textAlign = 'right'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('24 – 26 Oct 2026', 18 + card1W - 12, cBodyY + 12.5)

            // Row 2: Title
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('National Archery Championship 2026', 28, cBodyY + 34)

            // Row 3: Location
            drawIconLocation(34, cBodyY + 47, 10, '#64748B')
            ctx.fillStyle = '#475569'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Senayan Archery Range · Fast Archery Club', 44, cBodyY + 50)

            // Row 4: 2 Rows / 2 Cols Info Box (Slot & Categories)
            const infoBoxY = cBodyY + 58
            const infoBoxW = card1W - 20
            drawRoundedRect(28, infoBoxY, infoBoxW, 30, 7, '#F8FAFC', '#E2E8F0', 0.8)

            // Col 1: Slot
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 7.5px "NovaText", sans-serif'
            ctx.fillText('Slot', 38, infoBoxY + 11)
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('42 Slots Left', 38, infoBoxY + 23)

            // Divider
            ctx.strokeStyle = '#E2E8F0'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(28 + infoBoxW / 2, infoBoxY + 6)
            ctx.lineTo(28 + infoBoxW / 2, infoBoxY + 24)
            ctx.stroke()

            // Col 2: Categories
            ctx.fillStyle = '#64748B'
            ctx.font = '600 7.5px "NovaText", sans-serif'
            ctx.fillText('Category', 28 + infoBoxW / 2 + 10, infoBoxY + 11)
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('6 Categories', 28 + infoBoxW / 2 + 10, infoBoxY + 23)

            // Row 5: Register Button at bottom of card
            const cBtnY = card1BoxY + card1H - 36
            drawRoundedRect(28, cBtnY, infoBoxW, 28, 8, '#0F172A')
            ctx.fillStyle = '#DCFB4A'
            ctx.textAlign = 'center'
            ctx.font = '800 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Register →', 28 + infoBoxW / 2, cBtnY + 18)

            ctx.restore() // Card 1 transform

            // Card 2: Upcoming Tournament (Jakarta Open Grand Prix 2026)
            const card2BoxY = card1BoxY + card1H + 12
            const card2H = 250
            ctx.save()
            ctx.shadowColor = 'rgba(15, 23, 42, 0.05)'
            ctx.shadowBlur = 8
            ctx.shadowOffsetY = 2
            drawRoundedRect(18, card2BoxY, card1W, card2H, 16, '#FFFFFF', '#E2E8F0', 0.8)
            ctx.restore()

            // Banner Image for Card 2
            ctx.save()
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(18, card2BoxY, card1W, bannerH, [16, 16, 0, 0])
            } else {
                ctx.rect(18, card2BoxY, card1W, bannerH)
            }
            ctx.clip()

            if (isBannerLoaded && bannerImage.complete) {
                ctx.drawImage(bannerImage, 18, card2BoxY, card1W, bannerH)
                const grad2 = ctx.createLinearGradient(18, card2BoxY, 18, card2BoxY + bannerH)
                grad2.addColorStop(0, 'rgba(15, 23, 42, 0.15)')
                grad2.addColorStop(1, 'rgba(15, 23, 42, 0.65)')
                ctx.fillStyle = grad2
                ctx.fillRect(18, card2BoxY, card1W, bannerH)
            } else {
                ctx.fillStyle = '#0F172A'
                ctx.fillRect(18, card2BoxY, card1W, bannerH)
            }

            // Top-Right Price Tag Badge
            drawRoundedRect(18 + card1W - 84, card2BoxY + 10, 74, 22, 6, '#0F172A')
            ctx.fillStyle = '#FFFFFF'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Rp 320.000', 18 + card1W - 47, card2BoxY + 25)
            ctx.restore()

            // Card 2 Body
            const c2BodyY = card2BoxY + bannerH + 8
            drawRoundedRect(28, c2BodyY, 78, 18, 5, '#ECFDF5', null)
            ctx.fillStyle = '#059669'
            ctx.textAlign = 'center'
            ctx.font = '800 8.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Upcoming · Open', 28 + 39, c2BodyY + 12.5)

            ctx.textAlign = 'right'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('10 – 12 Nov 2026', 18 + card1W - 12, c2BodyY + 12.5)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Jakarta Open Grand Prix 2026', 28, c2BodyY + 34)

            drawIconLocation(34, c2BodyY + 47, 10, '#64748B')
            ctx.fillStyle = '#475569'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Rawamangun Field · Jakarta Regional', 44, c2BodyY + 50)

            const info2BoxY = c2BodyY + 58
            drawRoundedRect(28, info2BoxY, infoBoxW, 30, 7, '#F8FAFC', '#E2E8F0', 0.8)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 7.5px "NovaText", sans-serif'
            ctx.fillText('Slot', 38, info2BoxY + 11)
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('18 Slots Left', 38, info2BoxY + 23)

            ctx.strokeStyle = '#E2E8F0'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(28 + infoBoxW / 2, info2BoxY + 6)
            ctx.lineTo(28 + infoBoxW / 2, info2BoxY + 24)
            ctx.stroke()

            ctx.fillStyle = '#64748B'
            ctx.font = '600 7.5px "NovaText", sans-serif'
            ctx.fillText('Category', 28 + infoBoxW / 2 + 10, info2BoxY + 11)
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('4 Categories', 28 + infoBoxW / 2 + 10, info2BoxY + 23)

            const c2BtnY = card2BoxY + card2H - 36
            drawRoundedRect(28, c2BtnY, infoBoxW, 28, 8, '#0F172A')
            ctx.fillStyle = '#DCFB4A'
            ctx.textAlign = 'center'
            ctx.font = '800 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Register →', 28 + infoBoxW / 2, c2BtnY + 18)

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 2: TOURNAMENT DETAIL PAGE (TournamentDetailScreen.dart)
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 1) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const dHeroW = screenW - 36

            // Tournament Banner & Action Bar
            const dBannerH = 114
            ctx.save()
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(18, 0, dHeroW, dBannerH, 16)
            } else {
                ctx.rect(18, 0, dHeroW, dBannerH)
            }
            ctx.clip()

            if (isBannerLoaded && bannerImage.complete) {
                ctx.drawImage(bannerImage, 18, 0, dHeroW, dBannerH)
                const gradD = ctx.createLinearGradient(18, 0, 18, dBannerH)
                gradD.addColorStop(0, 'rgba(15, 23, 42, 0.25)')
                gradD.addColorStop(1, 'rgba(15, 23, 42, 0.85)')
                ctx.fillStyle = gradD
                ctx.fillRect(18, 0, dHeroW, dBannerH)
            } else {
                ctx.fillStyle = '#0F172A'
                ctx.fillRect(18, 0, dHeroW, dBannerH)
            }

            // Top Action icons on Banner
            drawRoundedRect(28, 12, 28, 28, 14, 'rgba(15, 23, 42, 0.65)')
            drawIconBack(42, 26, '#FFFFFF')

            drawRoundedRect(18 + dHeroW - 38, 12, 28, 28, 14, 'rgba(15, 23, 42, 0.65)')
            drawIconBookmark(18 + dHeroW - 24, 26, 12, '#DCFB4A')

            // Verified Badge
            drawRoundedRect(62, 14, 110, 22, 6, '#DCFB4A')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '800 9px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Official Championship', 62 + 55, 28)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '800 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('National Archery 2026', 28, 80)
            ctx.fillStyle = '#E2E8F0'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Senayan Stadium · Jakarta, Indonesia', 28, 96)
            ctx.restore()

            // Flutter Tab Bar (Overview, Athletes, Location, FAQ)
            const tabY = 126
            const tabs = [
                { name: 'Overview', w: 72 },
                { name: 'Athletes', w: 68 },
                { name: 'Location', w: 66 },
                { name: 'FAQ', w: 52 }
            ]
            let tx = 18
            tabs.forEach((t, idx) => {
                const isAct = idx === 0
                drawRoundedRect(tx, tabY, t.w, 26, 8, isAct ? '#DCFB4A' : '#FFFFFF', isAct ? null : '#E2E8F0', 0.8)
                ctx.textAlign = 'center'
                ctx.fillStyle = isAct ? '#0F172A' : '#64748B'
                ctx.font = isAct ? '800 9.5px "Bricolage Grotesque", "NovaText", sans-serif' : '600 9px "NovaText", sans-serif'
                ctx.fillText(t.name, tx + t.w / 2, tabY + 17)
                tx += t.w + 8
            })

            // 4-Card Tournament Information Grid (2x2 grid with generous 12px margins)
            const specY = 164
            const specs = [
                { label: 'Dates', val: '24 – 26 Oct 2026' },
                { label: 'Division', val: 'Recurve 70m' },
                { label: 'Venue', val: 'Senayan Stadium' },
                { label: 'Organizer', val: 'Fast Archery Club' }
            ]

            specs.forEach((s, idx) => {
                const sx = idx % 2 === 0 ? 18 : 18 + 152 + 8
                const sw = 152
                const sy = specY + Math.floor(idx / 2) * 50
                drawRoundedRect(sx, sy, sw, 44, 10, '#FFFFFF', '#E2E8F0', 0.8)
                ctx.textAlign = 'left'
                ctx.fillStyle = '#64748B'
                ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(s.label, sx + 12, sy + 16)
                ctx.fillStyle = '#0F172A'
                ctx.font = '800 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(s.val, sx + 12, sy + 32)
            })

            // Participant Quota Card (DsQuotaTracker)
            const quotaY = 268
            drawRoundedRect(18, quotaY, dHeroW, 74, 12, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Participant Quota', 30, quotaY + 20)

            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('158 / 200 Registered', 30, quotaY + 40)

            ctx.fillStyle = '#FFFFFF'
            ctx.textAlign = 'right'
            ctx.font = '700 11px "NovaText", sans-serif'
            ctx.fillText('79% Filled', 18 + dHeroW - 14, quotaY + 40)

            ctx.textAlign = 'left'
            drawRoundedRect(30, quotaY + 52, dHeroW - 24, 6, 3, '#334155')
            drawRoundedRect(30, quotaY + 52, (dHeroW - 24) * 0.79, 6, 3, '#DCFB4A')

            // Sanction & Scoring badge chip
            const badgeY = 354
            drawRoundedRect(18, badgeY, dHeroW, 34, 8, '#F8FAFC', '#E2E8F0', 0.8)
            ctx.textAlign = 'center'
            ctx.fillStyle = '#475569'
            ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Official PERPANI Sanction · Live Scorekeeper & Target Face Included', 18 + dHeroW / 2, badgeY + 21)

            // Bottom CTA Button: Choose Category -> (Snug 10px gap below badge)
            const s2BtnY = 398
            const s2BtnH = 46
            const s2BtnCY = s2BtnY + s2BtnH / 2
            ctx.save()
            ctx.translate(scBtnCX, s2BtnCY)
            ctx.scale(btnDetailScale, btnDetailScale)
            ctx.translate(-scBtnCX, -s2BtnCY)

            drawRoundedRect(scBtnX, s2BtnY, scBtnW, s2BtnH, 14, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isDetailNavigated ? '#DCFB4A' : '#FFFFFF'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isDetailNavigated ? 'Opening Category Selection...' : 'Choose Category →', scBtnCX, s2BtnY + 28)
            ctx.restore()

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 3: CATEGORY & DIVISION SELECTION (DsCategoryCard.dart)
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 2) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const catHeroW = screenW - 36

            // Booking Stepper Header (DsBookingStepper)
            const stepY = 0
            drawRoundedRect(18, stepY, catHeroW, 28, 8, '#FFFFFF', '#E2E8F0', 0.8)
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('1. Category', 55, stepY + 18)

            ctx.fillStyle = '#CBD5E1'
            ctx.fillText('→', 105, stepY + 18)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 9px "NovaText", sans-serif'
            ctx.fillText('2. Payment', 155, stepY + 18)

            ctx.fillStyle = '#CBD5E1'
            ctx.fillText('→', 205, stepY + 18)

            ctx.fillStyle = '#64748B'
            ctx.fillText('3. E-Ticket', 255, stepY + 18)

            // Section Header
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 13.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Select Competition Division (3)', 18, 48)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", sans-serif'
            ctx.fillText('Choose your competition division & bow type', 18, 62)

            // Category Cards matching DsCategoryCard.dart
            const categories = [
                {
                    title: 'Recurve Men Open - 70m',
                    price: 'Rp 350.000',
                    desc: '72 Arrows Qualification + Olympic Round',
                    slots: '8 Slots Left',
                    isAct: activeCategoryIndex === 0
                },
                {
                    title: 'Compound Men Open - 50m',
                    price: 'Rp 350.000',
                    desc: '72 Arrows 50m Standard Face',
                    slots: '14 Slots Left',
                    isAct: false
                },
                {
                    title: 'Barebow Men Open - 50m',
                    price: 'Rp 300.000',
                    desc: '72 Arrows 50m WA Standard',
                    slots: '20 Slots Left',
                    isAct: false
                }
            ]

            let cy = 72
            categories.forEach((c) => {
                const ch = 70
                drawRoundedRect(18, cy, catHeroW, ch, 12, '#FFFFFF', c.isAct ? '#0F172A' : '#E2E8F0', c.isAct ? 1.5 : 0.8)

                // Custom Radio Indicator
                const radCX = 36
                const radCY = cy + ch / 2
                ctx.beginPath()
                ctx.arc(radCX, radCY, 8, 0, Math.PI * 2)
                ctx.fillStyle = c.isAct ? '#0F172A' : '#FFFFFF'
                ctx.fill()
                ctx.strokeStyle = c.isAct ? '#0F172A' : '#CBD5E1'
                ctx.lineWidth = 1.5
                ctx.stroke()

                if (c.isAct) {
                    ctx.beginPath()
                    ctx.arc(radCX, radCY, 3.5, 0, Math.PI * 2)
                    ctx.fillStyle = '#DCFB4A'
                    ctx.fill()
                }

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '800 12px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(c.title, 52, cy + 20)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(c.desc, 52, cy + 36)

                ctx.fillStyle = '#059669'
                ctx.font = '800 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(c.price, 52, cy + 56)

                drawRoundedRect(18 + catHeroW - 78, cy + 40, 68, 20, 5, '#F1F5F9')
                ctx.fillStyle = '#334155'
                ctx.textAlign = 'center'
                ctx.font = '700 8.5px "NovaText", sans-serif'
                ctx.fillText(c.slots, 18 + catHeroW - 44, cy + 54)

                cy += ch + 8
            })

            // Summary box of chosen category
            const sumY = 308
            drawRoundedRect(18, sumY, catHeroW, 64, 12, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Selected Division', 30, sumY + 18)

            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Recurve Men Open 70m · Rp 350.000', 30, sumY + 36)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '500 9px "NovaText", sans-serif'
            ctx.fillText('Lane assignment, WA target face & live scorekeeper included', 30, sumY + 52)

            // Bottom CTA Button: Continue to Payment -> (Snug 12px gap below summary box)
            const s3BtnY = 384
            const s3BtnH = 46
            const s3BtnCY = s3BtnY + s3BtnH / 2
            ctx.save()
            ctx.translate(scBtnCX, s3BtnCY)
            ctx.scale(btnCategoryScale, btnCategoryScale)
            ctx.translate(-scBtnCX, -s3BtnCY)

            drawRoundedRect(scBtnX, s3BtnY, scBtnW, s3BtnH, 14, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isCategorySelected ? '#DCFB4A' : '#FFFFFF'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isCategorySelected ? 'Proceeding to Payment...' : 'Continue to Payment →', scBtnCX, s3BtnY + 28)
            ctx.restore()

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 4: PAYMENT METHOD (MAYAR & PAYPAL CHANNELS)
        // ══════════════════════════════════════════════════════════
        else if (sceneIndex === 3) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const qHeroW = screenW - 36

            // 1. Booking Stepper Header (DsBookingStepper)
            const stepY = 0
            drawRoundedRect(18, stepY, qHeroW, 26, 8, '#FFFFFF', '#E2E8F0', 0.8)
            ctx.textAlign = 'center'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 8.5px "NovaText", sans-serif'
            ctx.fillText('1. Category', 55, stepY + 17)

            ctx.fillStyle = '#CBD5E1'
            ctx.fillText('→', 105, stepY + 17)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 9px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('2. Payment', 155, stepY + 17)

            ctx.fillStyle = '#CBD5E1'
            ctx.fillText('→', 205, stepY + 17)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 8.5px "NovaText", sans-serif'
            ctx.fillText('3. E-Ticket', 255, stepY + 17)

            // 2. Invoice Summary Bar
            const sumBarY = 32
            drawRoundedRect(18, sumBarY, qHeroW, 44, 10, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Total Amount to Pay', 30, sumBarY + 17)

            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 16px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Rp 352.500', 30, sumBarY + 34)

            ctx.fillStyle = '#CBD5E1'
            ctx.textAlign = 'right'
            ctx.font = '500 8.5px "NovaText", sans-serif'
            ctx.fillText('Entry + Rp 2.500 Fee', 18 + qHeroW - 12, sumBarY + 27)

            // 3. Section Header: Online Payment Gateways (2)
            const secHeadY = 84
            drawRoundedRect(18, secHeadY, 20, 20, 5, 'rgba(15, 23, 42, 0.08)')
            ctx.fillStyle = '#0F172A'
            ctx.fillRect(23, secHeadY + 5, 10, 10)
            ctx.fillStyle = '#DCFB4A'
            ctx.fillRect(25, secHeadY + 7, 6, 6)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 12px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Online Payment Gateways (2)', 44, secHeadY + 15)

            // 4. CHANNEL 1: MAYAR PAYMENT GATEWAY (SELECTED)
            const mayarCardY = 108
            const mayarCardH = 144
            ctx.save()
            ctx.shadowColor = 'rgba(15, 23, 42, 0.06)'
            ctx.shadowBlur = 8
            ctx.shadowOffsetY = 2
            drawRoundedRect(18, mayarCardY, qHeroW, mayarCardH, 12, '#FFFFFF', '#0F172A', 1.5)
            ctx.restore()

            // Mayar Brand Icon (Loaded from /mayar-logo.png)
            drawLogoMayarIcon(28, mayarCardY + 10, 48, 30)

            // Mayar Channel Info
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Gateway Domestik (Mayar)', 84, mayarCardY + 20)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 8px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('QRIS, Virtual Account (BCA, Mandiri, BRI, BNI), E-Wallet', 84, mayarCardY + 34)

            // Radio Button Indicator (Active)
            const radio1CX = 18 + qHeroW - 16
            const radio1CY = mayarCardY + 22
            ctx.beginPath()
            ctx.arc(radio1CX, radio1CY, 8, 0, Math.PI * 2)
            ctx.fillStyle = '#0F172A'
            ctx.fill()
            ctx.beginPath()
            ctx.arc(radio1CX, radio1CY, 3.5, 0, Math.PI * 2)
            ctx.fillStyle = '#DCFB4A'
            ctx.fill()

            // Mayar Inner Instant QRIS Box (Clean, without webhook badge)
            const qrisBoxY = mayarCardY + 46
            drawRoundedRect(26, qrisBoxY, qHeroW - 16, 88, 8, '#F8FAFC', '#E2E8F0', 0.8)

            // Clean Dynamic QR Code (No center target face)
            drawDynamicQRCode(34, qrisBoxY + 10, 68)

            // QRIS details
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Instant QRIS Settlement', 114, qrisBoxY + 26)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 8.5px "NovaText", sans-serif'
            ctx.fillText('Scan with GoPay, OVO, Dana, BCA', 114, qrisBoxY + 42)

            // Timer badge
            drawRoundedRect(114, qrisBoxY + 54, 96, 18, 4, '#FEF2F2', '#FECACA', 0.8)
            drawIconClock(122, qrisBoxY + 63, 8, '#DC2626')
            ctx.fillStyle = '#DC2626'
            ctx.font = '700 8.5px "NovaText", sans-serif'
            ctx.fillText('Expires in 14:59', 134, qrisBoxY + 67)

            // 5. CHANNEL 2: PAYPAL INTERNATIONAL (USD)
            const paypalCardY = 260
            const paypalCardH = 56
            ctx.save()
            ctx.shadowColor = 'rgba(15, 23, 42, 0.04)'
            ctx.shadowBlur = 6
            ctx.shadowOffsetY = 1
            drawRoundedRect(18, paypalCardY, qHeroW, paypalCardH, 12, '#FFFFFF', '#E2E8F0', 0.8)
            ctx.restore()

            // PayPal Brand Icon (Loaded from /paypal-logo.svg)
            drawLogoPayPalIcon(28, paypalCardY + 11, 54, 34)

            // PayPal Channel Info (Simplified)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('PayPal International (USD)', 90, paypalCardY + 22)

            ctx.fillStyle = '#003087'
            ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('~$22.00 USD (Credit Card & PayPal)', 90, paypalCardY + 38)

            // Radio Button Indicator (Inactive)
            const radio2CX = 18 + qHeroW - 16
            const radio2CY = paypalCardY + 28
            ctx.beginPath()
            ctx.arc(radio2CX, radio2CY, 8, 0, Math.PI * 2)
            ctx.fillStyle = '#FFFFFF'
            ctx.fill()
            ctx.strokeStyle = '#CBD5E1'
            ctx.lineWidth = 1.5
            ctx.stroke()

            // 6. Bottom CTA Button: Confirm & Pay with Mayar (Snug 12px gap below PayPal card)
            const s4BtnY = 328
            const s4BtnH = 46
            const s4BtnCY = s4BtnY + s4BtnH / 2
            ctx.save()
            ctx.translate(scBtnCX, s4BtnCY)
            ctx.scale(btnPayScale, btnPayScale)
            ctx.translate(-scBtnCX, -s4BtnCY)

            drawRoundedRect(scBtnX, s4BtnY, scBtnW, s4BtnH, 14, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isPaymentSettled ? '#DCFB4A' : '#FFFFFF'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isPaymentSettled ? 'Payment Verified & Confirmed' : 'Confirm & Pay with Mayar →', scBtnCX, s4BtnY + 28)
            ctx.restore()

            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // RENDER SCENE 5: TICKET DETAIL & RE-REGISTRATION QR (TicketDetailScreen.dart)
        // ══════════════════════════════════════════════════════════
        else {
            sceneIndex = 4
            isEventPicked = true
            isDetailNavigated = true
            isCategorySelected = true
            isPaymentSettled = true
            bottomNavActive = 1 // My Tickets tab active
            const step5Elapsed = elapsed - STEP_TIME * 4

            ctx.save()
            ctx.translate(screenX, contentY)

            const tHeroW = screenW - 36

            // Pass Header Banner
            drawRoundedRect(18, 0, tHeroW, 54, 12, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Official Athlete Pass & Ticket', 30, 22)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('National Archery Championship 2026 · Senayan Stadium', 30, 38)

            // Athlete & Lane Info Box
            const aInfoY = 64
            drawRoundedRect(18, aInfoY, tHeroW, 82, 12, '#FFFFFF', '#E2E8F0', 1)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Arif Dwi Pangestu', 30, aInfoY + 22)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Fast Archery Club · Recurve Men Open 70m', 30, aInfoY + 38)

            // Target Assignment & Session Badges
            drawRoundedRect(30, aInfoY + 48, 100, 24, 6, '#0F172A')
            ctx.fillStyle = '#DCFB4A'
            ctx.font = '800 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target 04-A', 42, aInfoY + 64)

            drawRoundedRect(138, aInfoY + 48, 114, 24, 6, '#F1F5F9', '#CBD5E1', 1)
            ctx.fillStyle = '#334155'
            ctx.font = '700 9px "NovaText", sans-serif'
            ctx.fillText('Session 1 (08:00 WIB)', 146, aInfoY + 64)

            // Scannable Venue Gate QR Code Box (Clean QR code without center target face)
            const qrCardY = 156
            drawRoundedRect(18, qrCardY, tHeroW, 184, 14, '#FFFFFF', '#E2E8F0', 1)

            const qrPassSize = 112
            const qrPassX = 18 + tHeroW / 2 - qrPassSize / 2
            const qrPassY = qrCardY + 12
            drawDynamicQRCode(qrPassX, qrPassY, qrPassSize)

            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scan for Venue Re-Registration & Check-in', 18 + tHeroW / 2, qrCardY + 142)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Ticket ID: ARCH-8829104 · Venue Check-in Ready', 18 + tHeroW / 2, qrCardY + 160)

            // PDF Sync Indicator Card
            const wBadgeY = 352
            drawRoundedRect(18, wBadgeY, tHeroW, 40, 10, isPassSaved ? '#ECFDF5' : '#FFFFFF', isPassSaved ? '#10B981' : '#E2E8F0', 1)
            drawIconDownload(34, wBadgeY + 20, 12, isPassSaved ? '#065F46' : '#64748B')
            ctx.textAlign = 'left'
            ctx.fillStyle = isPassSaved ? '#065F46' : '#334155'
            ctx.font = '700 10px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isPassSaved ? 'Official PDF Ticket Downloaded & Synced to Profile' : 'Digital Pass Synced to Athlete Profile & Offline PDF', 50, wBadgeY + 25)

            // Bottom CTA Button: Download Official PDF Ticket (Snug 12px gap below PDF Sync card)
            const s5BtnY = 404
            const s5BtnH = 46
            const s5BtnCY = s5BtnY + s5BtnH / 2
            ctx.save()
            ctx.translate(scBtnCX, s5BtnCY)
            ctx.scale(btnPassScale, btnPassScale)
            ctx.translate(-scBtnCX, -s5BtnCY)

            drawRoundedRect(scBtnX, s5BtnY, scBtnW, s5BtnH, 14, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isPassSaved ? '#DCFB4A' : '#FFFFFF'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isPassSaved ? 'PDF Ticket Downloaded' : 'Download PDF Ticket', scBtnCX, s5BtnY + 28)
            ctx.restore()

            ctx.restore()
        }

        ctx.restore() // Content clip

        // ══════════════════════════════════════════════════════════
        // AUTHENTIC FLUTTER MAINHUB BOTTOM NAVIGATION BAR WITH CENTER FAB
        // ══════════════════════════════════════════════════════════
        const bNavH = 64
        const bNavY = screenY + screenH - bNavH

        ctx.save()
        // Bar chassis
        drawRoundedRect(screenX, bNavY, screenW, bNavH + 20, 24, '#0F172A')

        // 4 Nav tabs layout + Center Trophy FAB:
        // Left: Home (0), My Tickets (1)
        // Center: Tournaments FAB (2)
        // Right: My Events (3), Profile (4)

        // Tab 0: Home (Beranda)
        const tab0Active = bottomNavActive === 0
        const tab0CX = screenX + 44
        const tab0CY = bNavY + 24
        drawIconHome(tab0CX, tab0CY, 18, tab0Active ? '#DCFB4A' : '#94A3B8')
        ctx.textAlign = 'center'
        ctx.fillStyle = tab0Active ? '#DCFB4A' : '#94A3B8'
        ctx.font = tab0Active ? '800 9px "Bricolage Grotesque", "NovaText", sans-serif' : '500 8.5px "NovaText", sans-serif'
        ctx.fillText('Home', tab0CX, bNavY + 44)

        if (tab0Active) {
            ctx.beginPath()
            ctx.arc(tab0CX, bNavY + 52, 2, 0, Math.PI * 2)
            ctx.fillStyle = '#DCFB4A'
            ctx.fill()
        }

        // Tab 1: My Tickets (Tiket Saya)
        const tab1Active = bottomNavActive === 1
        const tab1CX = screenX + 115
        const tab1CY = bNavY + 24
        drawIconTicket(tab1CX, tab1CY, 18, tab1Active ? '#DCFB4A' : '#94A3B8')
        ctx.textAlign = 'center'
        ctx.fillStyle = tab1Active ? '#DCFB4A' : '#94A3B8'
        ctx.font = tab1Active ? '800 9px "Bricolage Grotesque", "NovaText", sans-serif' : '500 8.5px "NovaText", sans-serif'
        ctx.fillText('My Tickets', tab1CX, bNavY + 44)

        if (tab1Active) {
            ctx.beginPath()
            ctx.arc(tab1CX, bNavY + 52, 2, 0, Math.PI * 2)
            ctx.fillStyle = '#DCFB4A'
            ctx.fill()
        }

        // Center Docked FAB: Tournaments / Events (Yellow circle with navy trophy)
        const fabCX = 540
        const fabCY = bNavY + 12
        const fabRadius = 24

        ctx.save()
        ctx.shadowColor = 'rgba(220, 251, 74, 0.45)'
        ctx.shadowBlur = 12
        ctx.shadowOffsetY = 2
        ctx.beginPath()
        ctx.arc(fabCX, fabCY, fabRadius, 0, Math.PI * 2)
        ctx.fillStyle = '#DCFB4A'
        ctx.fill()
        ctx.restore()

        drawIconTrophy(fabCX, fabCY - 1, 20, '#0F172A')

        // Tab 3: My Events (Turnamen Saya)
        const tab3Active = bottomNavActive === 3
        const tab3CX = screenX + 233
        const tab3CY = bNavY + 24
        drawIconCalendar(tab3CX, tab3CY, 17, tab3Active ? '#DCFB4A' : '#94A3B8')
        ctx.textAlign = 'center'
        ctx.fillStyle = tab3Active ? '#DCFB4A' : '#94A3B8'
        ctx.font = tab3Active ? '800 9px "Bricolage Grotesque", "NovaText", sans-serif' : '500 8.5px "NovaText", sans-serif'
        ctx.fillText('My Events', tab3CX, bNavY + 44)

        // Tab 4: Profile (Profil)
        const tab4Active = bottomNavActive === 4
        const tab4CX = screenX + 304
        const tab4CY = bNavY + 24
        drawIconUser(tab4CX, tab4CY, 18, tab4Active ? '#DCFB4A' : '#94A3B8')
        ctx.textAlign = 'center'
        ctx.fillStyle = tab4Active ? '#DCFB4A' : '#94A3B8'
        ctx.font = tab4Active ? '800 9px "Bricolage Grotesque", "NovaText", sans-serif' : '500 8.5px "NovaText", sans-serif'
        ctx.fillText('Profile', tab4CX, bNavY + 44)

        ctx.restore() // Bottom bar

        // Top Status bar & dynamic island
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

        // Home Indicator Bar
        drawRoundedRect(540 - 55, screenY + screenH - 8, 110, 4, 2, '#CBD5E1')
        ctx.restore() // Glass clip

        // Ripple & Cursor (Inside Camera Transform)
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
