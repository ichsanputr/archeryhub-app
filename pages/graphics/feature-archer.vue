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
        let isRegistered = false
        let isPaid = false
        let isDownloaded = false

        let cursorVisible = false
        let cursorX = 540, cursorY = 700
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        // Scene 1: Event Discovery & Category Selection (0.0s - 4.4s)
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
                    isRegistered = true
                    if (loopT >= 2.4 && loopT <= 2.9) {
                        cursorPressed = true
                        tapRipple = (loopT - 2.4) / 0.5
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // Scene 2: Instant QRIS Payment (4.4s - 8.8s)
        else if (loopT < 8.8) {
            sceneIndex = 1
            isRegistered = true
            const t2 = loopT - 4.4

            if (t2 < 1.2) {
                const zt = easeInOutCubic(t2 / 1.2)
                camZoom = 1.38 + (1.40 - 1.38) * zt
                camPanY = -70 + (-60 - (-70)) * zt
            } else {
                camZoom = 1.40
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
                    isPaid = true
                    if (t2 >= 2.2 && t2 <= 2.7) {
                        cursorPressed = true
                        tapRipple = (t2 - 2.2) / 0.5
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // Scene 3: Digital Ticket & Archer Pass (8.8s - 13.2s)
        else if (loopT < 13.2) {
            sceneIndex = 2
            isRegistered = true
            isPaid = true
            const t3 = loopT - 8.8

            if (t3 < 1.2) {
                const zt = easeInOutCubic(t3 / 1.2)
                camZoom = 1.40 + (1.34 - 1.40) * zt
                camPanY = -60 + (-40 - (-60)) * zt
            } else {
                camZoom = 1.34
                camPanY = -40
            }

            // Gentle inspection hover over ticket QR
            if (t3 >= 0.8) {
                cursorVisible = true
                cursorX = 540 + Math.sin(t3 * 1.5) * 10
                cursorY = 520 + Math.cos(t3 * 1.5) * 8
            }
        }
        // Scene 4: Live Scorecard & Verified E-Certificate (13.2s - 17.5s)
        else {
            sceneIndex = 3
            isRegistered = true
            isPaid = true
            const t4 = loopT - 13.2

            if (t4 < 1.2) {
                const zt = easeInOutCubic(t4 / 1.2)
                camZoom = 1.34 + (1.38 - 1.34) * zt
                camPanY = -40 + (-65 - (-40)) * zt
            } else if (t4 > 3.2) {
                const ot = easeInOutCubic((t4 - 3.2) / 1.1)
                camZoom = 1.38 + (1.00 - 1.38) * ot
                camPanY = -65 * (1 - ot)
            } else {
                camZoom = 1.38
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
                    isDownloaded = true
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
        // SCENE 1: DISCOVER TOURNAMENTS (0.0s - 4.4s)
        // ========================================================
        if (sceneIndex === 0) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Archer Event Discovery', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Discover Tournaments', CONTENT_X, CONTENT_Y + 38)

            // Tournament Banner Card
            const eventCardY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, eventCardY, CONTENT_W, 236, 16, '#FFFFFF', '#E2E8F0', 1.5)

            if (isBannerLoaded) {
                ctx.save()
                drawRoundedRect(CONTENT_X, eventCardY, CONTENT_W, 94, 16)
                ctx.clip()
                ctx.drawImage(bannerImage, CONTENT_X, eventCardY, CONTENT_W, 94)
                ctx.restore()
            } else {
                drawRoundedRect(CONTENT_X, eventCardY, CONTENT_W, 94, 16, '#0F172A')
            }

            // Floating Badges on Banner
            drawRoundedRect(CONTENT_X + 12, eventCardY + 12, 100, 24, 12, 'rgba(15, 23, 42, 0.85)')
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '600 10px Inter, sans-serif'
            ctx.fillText('National Series', CONTENT_X + 20, eventCardY + 28)

            drawRoundedRect(CONTENT_X + CONTENT_W - 88, eventCardY + 12, 76, 24, 12, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px Inter, sans-serif'
            ctx.fillText('Open Entry', CONTENT_X + CONTENT_W - 77, eventCardY + 28)

            // Tournament Info
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 15px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Archeris National Open 2026', CONTENT_X + 16, eventCardY + 122)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('Senayan Archery Field, Jakarta · 24-26 Oct', CONTENT_X + 16, eventCardY + 140)

            // 2-Column Bento Stat Cards
            const statCardW = (CONTENT_W - 36) / 2
            drawRoundedRect(CONTENT_X + 12, eventCardY + 154, statCardW, 44, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px Inter, sans-serif'
            ctx.fillText('Quota Remaining', CONTENT_X + 20, eventCardY + 170)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12.5px Space Grotesk, Inter, sans-serif'
            ctx.fillText('18 / 160 Slots Left', CONTENT_X + 20, eventCardY + 187)

            drawRoundedRect(CONTENT_X + 24 + statCardW, eventCardY + 154, statCardW, 44, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px Inter, sans-serif'
            ctx.fillText('Registration Fee', CONTENT_X + 32 + statCardW, eventCardY + 170)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12.5px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Rp 150,000', CONTENT_X + 32 + statCardW, eventCardY + 187)

            // Division Selection Box
            const divBoxY = eventCardY + 248
            drawRoundedRect(CONTENT_X, divBoxY, CONTENT_W, 94, 16, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px Inter, sans-serif'
            ctx.fillText('Selected Division Category', CONTENT_X + 16, divBoxY + 22)

            drawRoundedRect(CONTENT_X + 14, divBoxY + 32, CONTENT_W - 28, 48, 10, 'rgba(217, 255, 0, 0.28)', '#0F172A', 1.5)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Recurve Men Open 70m', CONTENT_X + 26, divBoxY + 54)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px Inter, sans-serif'
            ctx.fillText('Fast Archery Club Affiliation', CONTENT_X + 26, divBoxY + 70)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12px Inter, sans-serif'
            ctx.fillText('✓ Selected', CONTENT_X + CONTENT_W - 94, divBoxY + 60)

            // Bottom CTA: Register Now
            const btnY = divBoxY + 108
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Register for Tournament', CONTENT_X + 80, btnY + 32)
        }

        // ========================================================
        // SCENE 2: INSTANT QRIS PAYMENT CHECKOUT (4.4s - 8.8s)
        // ========================================================
        else if (sceneIndex === 1) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Instant Online Checkout', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Payment Confirmation', CONTENT_X, CONTENT_Y + 38)

            // Order Summary Card
            const orderCardY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, orderCardY, CONTENT_W, 114, 16, '#FFFFFF', '#E2E8F0', 1.5)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Archeris National Open 2026', CONTENT_X + 16, orderCardY + 26)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('1x Recurve Men Open 70m Entry', CONTENT_X + 16, orderCardY + 44)

            ctx.fillStyle = '#F1F5F9'
            ctx.fillRect(CONTENT_X + 16, orderCardY + 58, CONTENT_W - 32, 1)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11.5px Inter, sans-serif'
            ctx.fillText('Total Payment:', CONTENT_X + 16, orderCardY + 88)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 18px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Rp 150,000', CONTENT_X + CONTENT_W - 114, orderCardY + 90)

            // QRIS Payment Method Card
            const qrisCardY = orderCardY + 128
            drawRoundedRect(CONTENT_X, qrisCardY, CONTENT_W, 204, 16, '#FFFFFF', '#E2E8F0', 1.5)

            drawRoundedRect(CONTENT_X + 16, qrisCardY + 16, 64, 24, 6, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '800 11px Inter, sans-serif'
            ctx.fillText('QRIS', CONTENT_X + 30, qrisCardY + 32)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Instant QRIS Payment', CONTENT_X + 88, qrisCardY + 32)

            // Mock QR Box
            const qrBoxY = qrisCardY + 48
            const qrX = CONTENT_X + (CONTENT_W - 90) / 2
            drawRoundedRect(qrX, qrBoxY, 90, 90, 8, '#F8FAFC', '#E2E8F0', 1)

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

            if (isPaid) {
                drawRoundedRect(CONTENT_X + 14, qrisCardY + 152, CONTENT_W - 28, 36, 8, 'rgba(217, 255, 0, 0.28)', '#0F172A', 1)
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 12px Inter, sans-serif'
                ctx.fillText('✓ Payment Confirmed Instantly', CONTENT_X + 64, qrisCardY + 175)
            } else {
                ctx.fillStyle = '#64748B'
                ctx.font = '500 11px Inter, sans-serif'
                ctx.fillText('Scan with any Bank or E-Wallet App', CONTENT_X + 68, qrisCardY + 174)
            }

            // Bottom CTA: Pay Now
            const btnY = qrisCardY + 218
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            if (isPaid) {
                ctx.fillText('Payment Successful · Pass Ready', CONTENT_X + 52, btnY + 32)
            } else {
                ctx.fillText('Confirm Instant Payment', CONTENT_X + 80, btnY + 32)
            }
        }

        // ========================================================
        // SCENE 3: DIGITAL TICKET & ARCHER PASS (8.8s - 13.2s)
        // ========================================================
        else if (sceneIndex === 2) {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Digital Accreditation', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('My Tournament Pass', CONTENT_X, CONTENT_Y + 38)

            // Pass Card
            const passCardY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, passCardY, CONTENT_W, 368, 16, '#FFFFFF', '#E2E8F0', 1.5)

            // Header of Pass
            drawRoundedRect(CONTENT_X, passCardY, CONTENT_W, 64, 16, '#0F172A')
            ctx.fillRect(CONTENT_X, passCardY + 30, CONTENT_W, 34)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10.5px Inter, sans-serif'
            ctx.fillText('Official Athlete Pass', CONTENT_X + 16, passCardY + 24)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 15px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Archeris National Open 2026', CONTENT_X + 16, passCardY + 48)

            // Athlete Info
            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Archer Name', CONTENT_X + 16, passCardY + 86)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Arif Dwi Pangestu', CONTENT_X + 16, passCardY + 104)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Category & Club', CONTENT_X + 16, passCardY + 128)
            ctx.fillStyle = '#0F172A'
            ctx.font = '600 12.5px Inter, sans-serif'
            ctx.fillText('Recurve Men Open 70m · Fast Archery', CONTENT_X + 16, passCardY + 146)

            // Assigned Target Lane
            drawRoundedRect(CONTENT_X + 14, passCardY + 164, CONTENT_W - 28, 56, 10, 'rgba(217, 255, 0, 0.28)', '#0F172A', 1.5)
            ctx.fillStyle = '#64748B'
            ctx.font = '600 9.5px Inter, sans-serif'
            ctx.fillText('Assigned Target Lane', CONTENT_X + 24, passCardY + 184)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 16px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Target 04A · Morning Wave', CONTENT_X + 24, passCardY + 206)

            // QR Box
            const checkInBoxY = passCardY + 232
            drawRoundedRect(CONTENT_X + 14, checkInBoxY, CONTENT_W - 28, 78, 8, '#F8FAFC', '#E2E8F0', 1)

            const tQrX = CONTENT_X + 24
            const tQrY = checkInBoxY + 11
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
            ctx.font = '700 11.5px Inter, sans-serif'
            ctx.fillText('Gate Check-in QR', tQrX + 68, tQrY + 22)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px Inter, sans-serif'
            ctx.fillText('Pass ID: ARC-88401', tQrX + 68, tQrY + 38)
            ctx.fillText('Valid for Official Field Entry', tQrX + 68, tQrY + 52)

            // Status Pill
            drawRoundedRect(CONTENT_X + 14, passCardY + 322, CONTENT_W - 28, 34, 8, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 12.5px Space Grotesk, Inter, sans-serif'
            ctx.fillText('✓ Ready for Official Check-in', CONTENT_X + 78, passCardY + 344)
        }

        // ========================================================
        // SCENE 4: LIVE SCORECARD & E-CERTIFICATE (13.2s - 17.5s)
        // ========================================================
        else {
            ctx.fillStyle = '#64748B'
            ctx.font = '600 11px Inter, sans-serif'
            ctx.fillText('Performance & Awards', CONTENT_X, CONTENT_Y + 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 20px Space Grotesk, Inter, sans-serif'
            ctx.fillText('My Score & Certificate', CONTENT_X, CONTENT_Y + 38)

            // Performance Card
            const scoreCardY = CONTENT_Y + 52
            drawRoundedRect(CONTENT_X, scoreCardY, CONTENT_W, 154, 16, '#FFFFFF', '#E2E8F0', 1.5)

            drawRoundedRect(CONTENT_X + 14, scoreCardY + 14, CONTENT_W - 28, 38, 8, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11px Inter, sans-serif'
            ctx.fillText('1st Place · Gold Medal Champion', CONTENT_X + 24, scoreCardY + 38)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 26px Space Grotesk, Inter, sans-serif'
            ctx.fillText('682', CONTENT_X + 18, scoreCardY + 98)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 11px Inter, sans-serif'
            ctx.fillText('Total Qualification Score (72 Arrows)', CONTENT_X + 76, scoreCardY + 88)
            ctx.fillText('Accuracy: 38X · 42 Tens · Rank #1', CONTENT_X + 76, scoreCardY + 104)

            drawRoundedRect(CONTENT_X + 14, scoreCardY + 114, CONTENT_W - 28, 28, 6, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#0F172A'
            ctx.font = '600 10.5px Inter, sans-serif'
            ctx.fillText('Gold Medal Matchplay: Won 6 - 3 against Riau Ega', CONTENT_X + 22, scoreCardY + 132)

            // E-Certificate Download Card
            const certBoxY = scoreCardY + 168
            drawRoundedRect(CONTENT_X, certBoxY, CONTENT_W, 144, 16, '#0F172A', '#D9FF00', 1.5)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10px Inter, sans-serif'
            ctx.fillText('Official Digital E-Certificate', CONTENT_X + 18, certBoxY + 26)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 16px Space Grotesk, Inter, sans-serif'
            ctx.fillText('Certificate of Excellence', CONTENT_X + 18, certBoxY + 50)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 10.5px Inter, sans-serif'
            ctx.fillText('Issued by Archeris National Open · QR Verified', CONTENT_X + 18, certBoxY + 70)

            if (isDownloaded) {
                drawRoundedRect(CONTENT_X + 16, certBoxY + 88, CONTENT_W - 32, 40, 8, '#D9FF00')
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 12px Inter, sans-serif'
                ctx.fillText('✓ Certificate Saved to Phone & Apple Wallet', CONTENT_X + 24, certBoxY + 113)
            } else {
                drawRoundedRect(CONTENT_X + 16, certBoxY + 88, CONTENT_W - 32, 40, 8, '#1E293B', '#334155', 1)
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 11.5px Inter, sans-serif'
                ctx.fillText('Download Official PDF & Wallet Pass', CONTENT_X + 44, certBoxY + 113)
            }

            // Bottom CTA: Download Cert
            const btnY = certBoxY + 158
            drawRoundedRect(CONTENT_X, btnY, CONTENT_W, 52, 16, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 14px Space Grotesk, Inter, sans-serif'
            if (isDownloaded) {
                ctx.fillText('Certificate Saved Successfully', CONTENT_X + 66, btnY + 32)
            } else {
                ctx.fillText('Download E-Certificate', CONTENT_X + 90, btnY + 32)
            }
        }

        // ── FLOATING BOTTOM DOCK ──
        const DOCK_Y = SCREEN_Y + SCREEN_H - 58
        const DOCK_W = SCREEN_W - 32
        const DOCK_X = SCREEN_X + 16
        drawRoundedRect(DOCK_X, DOCK_Y, DOCK_W, 44, 22, '#0F172A', '#334155', 1)

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
