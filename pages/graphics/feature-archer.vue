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

    // Preload hero banner for background/preview
    const bannerImage = new Image()
    bannerImage.src = '/hero-homepage.jpeg'
    let isBannerLoaded = false
    bannerImage.onload = () => {
        isBannerLoaded = true
    }

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
    const TOTAL_DURATION = 16.5 // seconds
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
        // Scene 1 (0.0s - 4.0s): Register Now button (Zoom 1.42x at 1.8s - 3.6s)
        if (loopT >= 1.6 && loopT < 3.8) {
            const zProgress = loopT < 3.2 ? clamp((loopT - 1.6) / 0.8, 0, 1) : 1 - clamp((loopT - 3.2) / 0.6, 0, 1)
            const easeZ = easeInOutCubic(zProgress)
            camScale = 1.0 + easeZ * 0.42
            camOffsetX = easeZ * -10
            camOffsetY = easeZ * -175
        }
        // Scene 2 (4.0s - 8.0s): QRIS Checkout (Zoom 1.45x at 5.6s - 7.6s)
        else if (loopT >= 5.4 && loopT < 7.8) {
            const zProgress = loopT < 7.2 ? clamp((loopT - 5.4) / 0.8, 0, 1) : 1 - clamp((loopT - 7.2) / 0.6, 0, 1)
            const easeZ = easeInOutCubic(zProgress)
            camScale = 1.0 + easeZ * 0.45
            camOffsetX = easeZ * 0
            camOffsetY = easeZ * -150
        }
        // Scene 3 (8.0s - 12.2s): Digital Pass & QR (Zoom 1.38x at 9.6s - 11.8s)
        else if (loopT >= 9.4 && loopT < 12.0) {
            const zProgress = loopT < 11.4 ? clamp((loopT - 9.4) / 0.8, 0, 1) : 1 - clamp((loopT - 11.4) / 0.6, 0, 1)
            const easeZ = easeInOutCubic(zProgress)
            camScale = 1.0 + easeZ * 0.38
            camOffsetX = easeZ * 0
            camOffsetY = easeZ * -110
        }
        // Scene 4 (12.2s - 16.5s): Download E-Cert (Zoom 1.44x at 13.6s - 15.6s)
        else if (loopT >= 13.4 && loopT < 15.8) {
            const zProgress = loopT < 15.2 ? clamp((loopT - 13.4) / 0.8, 0, 1) : 1 - clamp((loopT - 15.2) / 0.6, 0, 1)
            const easeZ = easeInOutCubic(zProgress)
            camScale = 1.0 + easeZ * 0.44
            camOffsetX = easeZ * -5
            camOffsetY = easeZ * -170
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

        // ── PERSISTENT APP HEADER (Archer Portal & Verified Badge) ──
        const APP_HEADER_Y = SCREEN_Y + 48
        
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10.5px Inter, sans-serif'
        ctx.fillText('ARCHER MOBILE APP', SCREEN_X + 20, APP_HEADER_Y + 12)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 17px Space Grotesk, Inter, sans-serif'
        ctx.fillText('Arif Dwi Pangestu', SCREEN_X + 20, APP_HEADER_Y + 32)

        // Archer Verified Pill on Top Right
        const statusBadgeW = 98
        const statusBadgeX = SCREEN_X + SCREEN_W - statusBadgeW - 20
        drawRoundedRect(statusBadgeX, APP_HEADER_Y + 14, statusBadgeW, 22, 11, '#0F172A')
        
        ctx.beginPath()
        ctx.arc(statusBadgeX + 11, APP_HEADER_Y + 25, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = '#D9FF00'
        ctx.fill()

        ctx.fillStyle = '#FFFFFF'
        ctx.font = '600 10px Inter, sans-serif'
        ctx.fillText('Verified Archer', statusBadgeX + 21, APP_HEADER_Y + 28)

        // Divider
        ctx.fillStyle = '#E2E8F0'
        ctx.fillRect(SCREEN_X + 20, APP_HEADER_Y + 44, SCREEN_W - 40, 1)

        // ── SCENE MANAGER & SCREEN RENDERING ──
        const CONTENT_Y = APP_HEADER_Y + 56
        const CONTENT_W = SCREEN_W - 40
        const CONTENT_X = SCREEN_X + 20

        // Determine active scene
        let sceneIndex = 0
        if (loopT < 4.0) {
            sceneIndex = 0
        } else if (loopT < 8.0) {
            sceneIndex = 1
        } else if (loopT < 12.2) {
            sceneIndex = 2
        } else {
            sceneIndex = 3
        }

        // ========================================================
        // SCENE 1: EVENT DISCOVERY & CATEGORY SELECTION (0.0s - 4.0s)
        // ========================================================
        if (sceneIndex === 0) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('01 · EVENT REGISTRATION', CONTENT_X, CONTENT_Y + 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Discover Tournaments', CONTENT_X, CONTENT_Y + 32)

            // Tournament Banner Card
            const eventCardY = CONTENT_Y + 44
            drawRoundedRect(CONTENT_X, eventCardY, CONTENT_W, 230, 16, '#FFFFFF', '#E2E8F0', 1.5)

            // Banner Image
            if (isBannerLoaded) {
                ctx.save()
                drawRoundedRect(CONTENT_X, eventCardY, CONTENT_W, 90, 16)
                ctx.clip()
                ctx.drawImage(bannerImage, CONTENT_X, eventCardY, CONTENT_W, 90)
                ctx.restore()
            } else {
                drawRoundedRect(CONTENT_X, eventCardY, CONTENT_W, 90, 16, '#0F172A')
            }

            // Floating Badges on Banner
            drawRoundedRect(CONTENT_X + 12, eventCardY + 12, 96, 22, 11, 'rgba(15, 23, 42, 0.85)')
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '600 9.5px Inter, sans-serif'
            ctx.fillText('National Series', CONTENT_X + 20, eventCardY + 26.5)

            drawRoundedRect(CONTENT_X + CONTENT_W - 88, eventCardY + 12, 76, 22, 11, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9.5px Inter, sans-serif'
            ctx.fillText('Open Entry', CONTENT_X + CONTENT_W - 77, eventCardY + 26.5)

            // Tournament Content
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Archeris National Open 2026', CONTENT_X + 14, eventCardY + 116)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px Inter, sans-serif'
            ctx.fillText('Senayan Archery Field, Jakarta · 24-26 Oct', CONTENT_X + 14, eventCardY + 134)

            // Bento Stat Pills
            const statCardW = (CONTENT_W - 36) / 2
            drawRoundedRect(CONTENT_X + 12, eventCardY + 148, statCardW, 40, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px Inter, sans-serif'
            ctx.fillText('Quota Remaining', CONTENT_X + 20, eventCardY + 163)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12px Space Grotesk, Inter, sans-serif'
            ctx.fillText('18 / 160 Slots Left', CONTENT_X + 20, eventCardY + 178)

            drawRoundedRect(CONTENT_X + 24 + statCardW, eventCardY + 148, statCardW, 40, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px Inter, sans-serif'
            ctx.fillText('Registration Fee', CONTENT_X + 32 + statCardW, eventCardY + 163)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Rp 150,000', CONTENT_X + 32 + statCardW, eventCardY + 178)

            // Division Selection Box
            const divBoxY = eventCardY + 242
            drawRoundedRect(CONTENT_X, divBoxY, CONTENT_W, 90, 14, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px Inter, sans-serif'
            ctx.fillText('SELECTED CATEGORY', CONTENT_X + 14, divBoxY + 20)

            // Selected Division Pill
            drawRoundedRect(CONTENT_X + 12, divBoxY + 28, CONTENT_W - 24, 46, 10, 'rgba(217, 255, 0, 0.25)', '#0F172A', 1.5)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12.5px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Recurve Men Open 70m', CONTENT_X + 24, divBoxY + 48)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Fast Archery Club Affiliation', CONTENT_X + 24, divBoxY + 63)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12px Inter, sans-serif'
            ctx.fillText('✓ Selected', CONTENT_X + CONTENT_W - 90, divBoxY + 54)

            // Bottom CTA: Register Now
            const btnY = divBoxY + 104
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 50, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Register for Tournament', CONTENT_X + 80, btnY + 31)
        }

        // ========================================================
        // SCENE 2: INSTANT QRIS PAYMENT CHECKOUT (4.0s - 8.0s)
        // ========================================================
        else if (sceneIndex === 1) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('02 · INSTANT CHECKOUT', CONTENT_X, CONTENT_Y + 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Payment Confirmation', CONTENT_X, CONTENT_Y + 32)

            // Order Summary Card
            const orderCardY = CONTENT_Y + 44
            drawRoundedRect(CONTENT_X, orderCardY, CONTENT_W, 110, 14, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Archeris National Open 2026', CONTENT_X + 14, orderCardY + 24)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px Inter, sans-serif'
            ctx.fillText('1x Recurve Men Open 70m Entry', CONTENT_X + 14, orderCardY + 42)

            ctx.fillStyle = '#F1F5F9'
            ctx.fillRect(CONTENT_X + 14, orderCardY + 54, CONTENT_W - 28, 1)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('Total Payment:', CONTENT_X + 14, orderCardY + 84)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 17px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Rp 150,000', CONTENT_X + CONTENT_W - 108, orderCardY + 86)

            // QRIS Payment Method Card
            const isPaid = loopT >= 6.4
            const qrisCardY = orderCardY + 122
            drawRoundedRect(CONTENT_X, qrisCardY, CONTENT_W, 200, 14, '#FFFFFF', '#E2E8F0', 1.5)

            // QRIS Header
            drawRoundedRect(CONTENT_X + 14, qrisCardY + 14, 60, 24, 6, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 10.5px Inter, sans-serif'
            ctx.fillText('QRIS', CONTENT_X + 28, qrisCardY + 30)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12.5px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Instant QRIS Payment', CONTENT_X + 82, qrisCardY + 30)

            // Mock QR Code Box
            const qrBoxY = qrisCardY + 48
            const qrX = CONTENT_X + (CONTENT_W - 90) / 2
            drawRoundedRect(qrX, qrBoxY, 90, 90, 8, '#F8FAFC', '#E2E8F0', 1)

            // QR Squares
            ctx.fillStyle = '#0F172A'
            ctx.fillRect(qrX + 10, qrBoxY + 10, 24, 24)
            ctx.fillRect(qrX + 56, qrBoxY + 10, 24, 24)
            ctx.fillRect(qrX + 10, qrBoxY + 56, 24, 24)
            ctx.fillStyle = '#F8FAFC'
            ctx.fillRect(qrX + 16, qrBoxY + 16, 12, 12)
            ctx.fillRect(qrX + 62, qrBoxY + 16, 12, 12)
            ctx.fillRect(qrX + 16, qrBoxY + 62, 12, 12)
            ctx.fillStyle = '#0F172A'
            ctx.fillRect(qrX + 40, qrBoxY + 40, 12, 12)

            // QR Status Text
            if (isPaid) {
                drawRoundedRect(CONTENT_X + 14, qrisCardY + 152, CONTENT_W - 28, 34, 8, 'rgba(217, 255, 0, 0.25)', '#0F172A', 1)
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11.5px Inter, sans-serif'
                ctx.fillText('✓ Payment Confirmed Instantly', CONTENT_X + 66, qrisCardY + 173)
            } else {
                ctx.fillStyle = '#64748B'
                ctx.font = '500 10.5px Inter, sans-serif'
                ctx.fillText('Scan with any Bank or E-Wallet App', CONTENT_X + 70, qrisCardY + 172)
            }

            // Bottom CTA: Pay Now / Success
            const payBtnY = qrisCardY + 214
            drawRoundedRect(CONTENT_X, payBtnY, CONTENT_W, 50, 16, '#0F172A')
            
            if (isPaid) {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Payment Successful · Pass Ready', CONTENT_X + 52, payBtnY + 31)
            } else {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Confirm Instant Payment', CONTENT_X + 80, payBtnY + 31)
            }
        }

        // ========================================================
        // SCENE 3: DIGITAL TICKET & ARCHER PASS (8.0s - 12.2s)
        // ========================================================
        else if (sceneIndex === 2) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('03 · DIGITAL EVENT PASS', CONTENT_X, CONTENT_Y + 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('My Tournament Pass', CONTENT_X, CONTENT_Y + 32)

            // Official Ticket Pass Bento Card
            const passCardY = CONTENT_Y + 44
            drawRoundedRect(CONTENT_X, passCardY, CONTENT_W, 360, 16, '#FFFFFF', '#E2E8F0', 1.5)

            // Top Header of Pass
            drawRoundedRect(CONTENT_X, passCardY, CONTENT_W, 64, 16, '#0F172A')
            // Bottom flat edge for header
            ctx.fillRect(CONTENT_X, passCardY + 30, CONTENT_W, 34)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10px Inter, sans-serif'
            ctx.fillText('OFFICIAL ATHLETE PASS', CONTENT_X + 16, passCardY + 24)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 15px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Archeris National Open 2026', CONTENT_X + 16, passCardY + 48)

            // Athlete Details Section
            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Archer Name', CONTENT_X + 16, passCardY + 86)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Arif Dwi Pangestu', CONTENT_X + 16, passCardY + 104)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Category & Club', CONTENT_X + 16, passCardY + 126)
            ctx.fillStyle = '#0F172A'
            ctx.font = '600 12px Inter, sans-serif'
            ctx.fillText('Recurve Men Open 70m · Fast Archery', CONTENT_X + 16, passCardY + 144)

            // Highlight Target Allocation Badge
            drawRoundedRect(CONTENT_X + 14, passCardY + 160, CONTENT_W - 28, 54, 10, 'rgba(217, 255, 0, 0.25)', '#0F172A', 1.5)
            ctx.fillStyle = '#64748B'
            ctx.font = '600 9.5px Inter, sans-serif'
            ctx.fillText('ASSIGNED TARGET LANE', CONTENT_X + 24, passCardY + 180)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 16px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Target 04A · Morning Wave', CONTENT_X + 24, passCardY + 202)

            // Check-in QR Code Box
            const checkInBoxY = passCardY + 226
            drawRoundedRect(CONTENT_X + 14, checkInBoxY, CONTENT_W - 28, 76, 8, '#F8FAFC', '#E2E8F0', 1)

            // QR
            const tQrX = CONTENT_X + 24
            const tQrY = checkInBoxY + 10
            drawRoundedRect(tQrX, tQrY, 56, 56, 4, '#0F172A')
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(tQrX + 6, tQrY + 6, 16, 16)
            ctx.fillRect(tQrX + 34, tQrY + 6, 16, 16)
            ctx.fillRect(tQrX + 6, tQrY + 34, 16, 16)
            ctx.fillStyle = '#0F172A'
            ctx.fillRect(tQrX + 10, tQrY + 10, 8, 8)
            ctx.fillRect(tQrX + 38, tQrY + 10, 8, 8)
            ctx.fillRect(tQrX + 10, tQrY + 38, 8, 8)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11px Inter, sans-serif'
            ctx.fillText('Gate Check-in QR', tQrX + 68, tQrY + 22)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px Inter, sans-serif'
            ctx.fillText('Pass ID: ARC-88401', tQrX + 68, tQrY + 38)
            ctx.fillText('Valid for Field Entry', tQrX + 68, tQrY + 52)

            // Status Pill
            drawRoundedRect(CONTENT_X + 14, passCardY + 314, CONTENT_W - 28, 34, 8, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 12px Space Grotesk, Inter, sans-serif'
            ctx.fillText('✓ Ready for Official Check-in', CONTENT_X + 80, passCardY + 335)
        }

        // ========================================================
        // SCENE 4: LIVE SCORECARD & E-CERTIFICATE (12.2s - 16.5s)
        // ========================================================
        else {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('04 · SCORECARD & AWARDS', CONTENT_X, CONTENT_Y + 10)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('My Score & Certificate', CONTENT_X, CONTENT_Y + 32)

            // Performance Card
            const scoreCardY = CONTENT_Y + 44
            drawRoundedRect(CONTENT_X, scoreCardY, CONTENT_W, 148, 14, '#FFFFFF', '#E2E8F0', 1.5)

            // Gold Medal Ribbon Header
            drawRoundedRect(CONTENT_X + 12, scoreCardY + 12, CONTENT_W - 24, 40, 8, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10.5px Inter, sans-serif'
            ctx.fillText('1ST PLACE · GOLD MEDAL CHAMPION', CONTENT_X + 22, scoreCardY + 36)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 24px Space Grotesk, Inter, sans-serif'
            ctx.fillText('682', CONTENT_X + 16, scoreCardY + 92)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('Total Qualification Score (72 Arrows)', CONTENT_X + 70, scoreCardY + 82)
            ctx.fillText('Accuracy: 38X · 42 Tens · Rank #1', CONTENT_X + 70, scoreCardY + 98)

            // Elimination Record
            drawRoundedRect(CONTENT_X + 12, scoreCardY + 108, CONTENT_W - 24, 28, 6, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#0F172A'
            ctx.font = '600 10.5px Inter, sans-serif'
            ctx.fillText('Gold Medal Matchplay: Won 6 - 3 against Riau Ega', CONTENT_X + 20, scoreCardY + 126)

            // E-Certificate Download Card
            const isDownloaded = loopT >= 14.8
            const certBoxY = scoreCardY + 162
            drawRoundedRect(CONTENT_X, certBoxY, CONTENT_W, 140, 14, '#0F172A', '#D9FF00', 1.5)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 9.5px Inter, sans-serif'
            ctx.fillText('OFFICIAL DIGITAL E-CERTIFICATE', CONTENT_X + 16, certBoxY + 24)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 15px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Certificate of Excellence', CONTENT_X + 16, certBoxY + 48)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Issued by Archeris National Open · QR Verified', CONTENT_X + 16, certBoxY + 68)

            // Status Pill
            if (isDownloaded) {
                drawRoundedRect(CONTENT_X + 14, certBoxY + 86, CONTENT_W - 28, 38, 8, '#D9FF00')
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11.5px Inter, sans-serif'
                ctx.fillText('✓ Certificate Saved to Phone & Apple Wallet', CONTENT_X + 26, certBoxY + 110)
            } else {
                drawRoundedRect(CONTENT_X + 14, certBoxY + 86, CONTENT_W - 28, 38, 8, '#1E293B', '#334155', 1)
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 11.5px Inter, sans-serif'
                ctx.fillText('Download Official PDF & Wallet Pass', CONTENT_X + 46, certBoxY + 110)
            }

            // Bottom Action Button
            const certBtnY = certBoxY + 154
            drawRoundedRect(CONTENT_X, certBtnY, CONTENT_W, 50, 16, '#0F172A')
            
            if (isDownloaded) {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Certificate Saved Successfully', CONTENT_X + 70, certBtnY + 31)
            } else {
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 13.5px Space Grotesk, Inter, sans-serif'
                ctx.fillText('Download E-Certificate', CONTENT_X + 90, certBtnY + 31)
            }
        }

        // ── FLOATING BOTTOM DOCK ──
        const DOCK_Y = SCREEN_Y + SCREEN_H - 64
        const DOCK_W = SCREEN_W - 32
        const DOCK_X = SCREEN_X + 16
        drawRoundedRect(DOCK_X, DOCK_Y, DOCK_W, 48, 24, '#0F172A', '#334155', 1)

        const dockItems = [
            { label: 'Events', active: sceneIndex === 0 },
            { label: 'Checkout', active: sceneIndex === 1 },
            { label: 'My Pass', active: sceneIndex === 2 },
            { label: 'Scorecard', active: sceneIndex === 3 }
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

        // Scene 1: Click "Register for Tournament"
        if (loopT < 4.0) {
            const targetX = PHONE_X + 195
            const targetY = CONTENT_Y + 400
            if (loopT < 1.0) {
                const p = easeOutCubic(loopT / 1.0)
                mouseX = 780 - p * (780 - targetX)
                mouseY = 600 - p * (600 - targetY)
            } else if (loopT < 2.4) {
                mouseX = targetX
                mouseY = targetY
            } else if (loopT < 2.8) {
                mouseX = targetX
                mouseY = targetY
                isPressed = true
                rippleProgress = (loopT - 2.4) / 0.4
            } else {
                const p = easeInOutCubic((loopT - 2.8) / 1.2)
                mouseX = targetX + p * 30
                mouseY = targetY + p * 40
            }
        }
        // Scene 2: Click "Confirm Instant Payment"
        else if (loopT < 8.0) {
            const targetX = PHONE_X + 195
            const targetY = CONTENT_Y + 410
            const tInScene = loopT - 4.0
            if (tInScene < 1.4) {
                const p = easeOutCubic(tInScene / 1.4)
                mouseX = (PHONE_X + 225) - p * 30
                mouseY = (CONTENT_Y + 450) - p * 40
            } else if (tInScene < 2.4) {
                mouseX = targetX
                mouseY = targetY
            } else if (tInScene < 2.8) {
                mouseX = targetX
                mouseY = targetY
                isPressed = true
                rippleProgress = (tInScene - 2.4) / 0.4
            } else {
                const p = easeInOutCubic((tInScene - 2.8) / 1.2)
                mouseX = targetX - p * 20
                mouseY = targetY + p * 30
            }
        }
        // Scene 3: Idle hover over pass QR
        else if (loopT < 12.2) {
            const targetX = PHONE_X + 195
            const targetY = CONTENT_Y + 280
            const tInScene = loopT - 8.0
            if (tInScene < 1.2) {
                const p = easeOutCubic(tInScene / 1.2)
                mouseX = (PHONE_X + 175) + p * 20
                mouseY = (CONTENT_Y + 380) - p * 100
            } else {
                mouseX = targetX + Math.sin(tInScene * 1.5) * 8
                mouseY = targetY + Math.cos(tInScene * 1.5) * 6
            }
        }
        // Scene 4: Click "Download E-Certificate"
        else {
            const targetX = PHONE_X + 195
            const targetY = CONTENT_Y + 385
            const tInScene = loopT - 12.2
            if (tInScene < 1.2) {
                const p = easeOutCubic(tInScene / 1.2)
                mouseX = (PHONE_X + 200) - p * 5
                mouseY = (CONTENT_Y + 300) + p * 85
            } else if (tInScene < 2.4) {
                mouseX = targetX
                mouseY = targetY
            } else if (tInScene < 2.8) {
                mouseX = targetX
                mouseY = targetY
                isPressed = true
                rippleProgress = (tInScene - 2.4) / 0.4
            } else {
                const p = easeInOutCubic((tInScene - 2.8) / 1.5)
                mouseX = targetX + p * 50
                mouseY = targetY + p * 80
            }
        }

        // Draw Ripple & Cursor
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
