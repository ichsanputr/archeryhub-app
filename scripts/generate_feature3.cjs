const fs = require('fs');
const path = require('path');

const code = `<template>
    <div class="stage-wrapper" id="stageWrapper" @dblclick="togglePause">
        <canvas ref="canvasRef" width="1080" height="1080" class="stage-canvas" :style="{ transform: \`scale(\${scale})\` }"></canvas>
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

    const CYCLE_DURATION = 17.0
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

        // 2. Timeline States
        let sceneIndex = 0
        let bottomNavActive = 0 // 0: Events, 1: Passes, 2: Scores
        let sheetSlideProgress = 0
        let camZoom = 1.00
        let camPanY = 0

        let isRegistered = false
        let btnRegScale = 1.0
        let isPaid = false
        let btnPayScale = 1.0
        let isCheckedIn = false
        let btnCheckScale = 1.0
        let isDownloaded = false
        let btnDlScale = 1.0

        let cursorVisible = false
        let cursorX = 0, cursorY = 0
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        if (elapsed < 4.2) {
            sceneIndex = 0
            bottomNavActive = 0
            if (elapsed < 1.4) {
                const zt = easeInOutCubic(elapsed / 1.4)
                camZoom = 1.00 + 0.45 * zt
                camPanY = -85 * zt
            } else {
                camZoom = 1.45
                camPanY = -85
            }

            const targetBtnY = 620
            if (elapsed >= 1.0) {
                cursorVisible = true
                if (elapsed < 2.4) {
                    const mt = easeInOutCubic((elapsed - 1.0) / 1.4)
                    cursorX = 540
                    cursorY = 720 + (targetBtnY - 720) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (elapsed >= 2.4) {
                    isRegistered = true
                    if (elapsed >= 2.4 && elapsed <= 2.85) {
                        cursorPressed = true
                        btnRegScale = 0.94
                        tapRipple = (elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 8.4) {
            sceneIndex = 1
            isRegistered = true
            bottomNavActive = 0
            const step2Elapsed = elapsed - 4.2

            if (step2Elapsed < 0.6) {
                sheetSlideProgress = easeOutCubic(step2Elapsed / 0.6)
            } else {
                sheetSlideProgress = 1.0
            }

            if (step2Elapsed < 0.8) {
                const transT = easeInOutCubic(step2Elapsed / 0.8)
                camZoom = 1.45 + (1.35 - 1.45) * transT
                camPanY = -85 + (-40 - (-85)) * transT
            } else if (step2Elapsed < 2.0) {
                camZoom = 1.35; camPanY = -40
            } else if (step2Elapsed < 2.8) {
                const ct = easeInOutCubic((step2Elapsed - 2.0) / 0.8)
                camZoom = 1.35 + (1.46 - 1.35) * ct
                camPanY = -40 + (-85 - (-40)) * ct
            } else {
                camZoom = 1.46; camPanY = -85
            }

            const targetBtnY = 620
            if (step2Elapsed >= 1.4) {
                cursorVisible = true
                if (step2Elapsed < 2.5) {
                    const mt = easeInOutCubic((step2Elapsed - 1.4) / 1.1)
                    cursorX = 540
                    cursorY = 520 + (targetBtnY - 520) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step2Elapsed >= 2.5) {
                    isPaid = true
                    if (step2Elapsed >= 2.5 && step2Elapsed <= 2.95) {
                        cursorPressed = true
                        btnPayScale = 0.94
                        tapRipple = (step2Elapsed - 2.5) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 12.6) {
            sceneIndex = 2
            isRegistered = true
            isPaid = true
            bottomNavActive = 1 // My Passes tab
            const step3Elapsed = elapsed - 8.4

            if (step3Elapsed < 0.8) {
                const transT = easeInOutCubic(step3Elapsed / 0.8)
                camZoom = 1.46 + (1.35 - 1.46) * transT
                camPanY = -85 + (-20 - (-85)) * transT
            } else if (step3Elapsed < 1.8) {
                camZoom = 1.35; camPanY = -20
            } else if (step3Elapsed < 2.6) {
                const ct = easeInOutCubic((step3Elapsed - 1.8) / 0.8)
                camZoom = 1.35 + (1.46 - 1.35) * ct
                camPanY = -20 + (-85 - (-20)) * ct
            } else {
                camZoom = 1.46; camPanY = -85
            }

            const targetBtnY = 620
            if (step3Elapsed >= 1.6) {
                cursorVisible = true
                if (step3Elapsed < 2.8) {
                    const mt = easeInOutCubic((step3Elapsed - 1.6) / 1.2)
                    cursorX = 540
                    cursorY = 530 + (targetBtnY - 530) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step3Elapsed >= 2.8) {
                    isCheckedIn = true
                    if (step3Elapsed >= 2.8 && step3Elapsed <= 3.25) {
                        cursorPressed = true
                        btnCheckScale = 0.94
                        tapRipple = (step3Elapsed - 2.8) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 16.0) {
            sceneIndex = 3
            isRegistered = true
            isPaid = true
            isCheckedIn = true
            bottomNavActive = 2 // Scores tab
            const step4Elapsed = elapsed - 12.6

            if (step4Elapsed < 0.8) {
                const transT = easeInOutCubic(step4Elapsed / 0.8)
                camZoom = 1.46 + (1.35 - 1.46) * transT
                camPanY = -85 + (-20 - (-85)) * transT
            } else if (step4Elapsed < 1.6) {
                camZoom = 1.35; camPanY = -20
            } else if (step4Elapsed < 2.3) {
                const ct = easeInOutCubic((step4Elapsed - 1.6) / 0.7)
                camZoom = 1.35 + (1.46 - 1.35) * ct
                camPanY = -20 + (-85 - (-20)) * ct
            } else {
                camZoom = 1.46; camPanY = -85
            }

            const targetBtnY = 620
            if (step4Elapsed >= 1.4) {
                cursorVisible = true
                if (step4Elapsed < 2.4) {
                    const mt = easeInOutCubic((step4Elapsed - 1.4) / 1.0)
                    cursorX = 540; cursorY = targetBtnY
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step4Elapsed >= 2.4) {
                    isDownloaded = true
                    if (step4Elapsed >= 2.4 && step4Elapsed <= 2.85) {
                        cursorPressed = true
                        btnDlScale = 0.94
                        tapRipple = (step4Elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else {
            sceneIndex = 3
            isRegistered = true
            isPaid = true
            isCheckedIn = true
            isDownloaded = true
            bottomNavActive = 0
            const finElapsed = elapsed - 16.0
            const finT = easeInOutCubic(finElapsed / 1.0)
            camZoom = 1.46 - (1.46 - 1.00) * finT
            camPanY = -85 * (1 - finT)
            cursorVisible = false
        }

        // 3. Camera Transform
        ctx.save()
        ctx.translate(540, 540 + camPanY)
        ctx.scale(camZoom, camZoom)
        ctx.translate(-540, -540)

        // 4. Chassis
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
        ctx.fillText('Archer Mobile Experience', screenX + 20, appHeadY)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(bottomNavActive === 1 ? 'Digital Athlete Pass' : (bottomNavActive === 2 ? 'Live Scorecard & Rank' : 'Discover Tournaments'), screenX + 20, appHeadY + 22)

        const contentY = appHeadY + 34
        const contentH = screenH - 140

        ctx.save()
        ctx.beginPath()
        ctx.rect(screenX, contentY, screenW, contentH)
        ctx.clip()

        const sc1BtnY = 328
        const sc1BtnW = screenW - 40
        const sc1BtnH = 46
        const sc1BtnCX = 20 + sc1BtnW / 2
        const sc1BtnCY = sc1BtnY + sc1BtnH / 2

        // SCENE 1 & 2 BASE: EVENT DISCOVERY
        if (sceneIndex === 0 || sceneIndex === 1) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const sc1CardW = screenW - 40
            const sc1CardY = 0
            const sc1CardH = 262
            drawRoundedRect(20, sc1CardY, sc1CardW, sc1CardH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            const bannerH = 86
            ctx.save()
            ctx.beginPath()
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(20, sc1CardY, sc1CardW, bannerH, [14, 14, 0, 0])
            } else {
                ctx.rect(20, sc1CardY, sc1CardW, bannerH)
            }
            ctx.clip()

            if (isBannerLoaded && bannerImage.complete) {
                ctx.drawImage(bannerImage, 20, sc1CardY, sc1CardW, bannerH)
                ctx.fillStyle = 'rgba(15, 23, 42, 0.42)'
                ctx.fillRect(20, sc1CardY, sc1CardW, bannerH)
            } else {
                ctx.fillStyle = '#1E293B'
                ctx.fillRect(20, sc1CardY, sc1CardW, bannerH)
            }

            drawRoundedRect(30, sc1CardY + 12, 70, 20, 6, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Open Entry', 36, sc1CardY + 26)
            ctx.restore()

            const cardTextY = sc1CardY + bannerH + 16
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('National Archery 2026', 32, cardTextY)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Senayan Stadium · 24-26 Oct', 32, cardTextY + 18)

            drawRoundedRect(32, cardTextY + 30, sc1CardW - 24, 46, 10, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Recurve Men Open 70m', 44, cardTextY + 48)

            ctx.fillStyle = '#059669'
            ctx.font = '700 11px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Rp 350.000', 44, cardTextY + 66)

            drawRoundedRect(32 + sc1CardW - 110, cardTextY + 38, 76, 22, 6, '#F1F5F9')
            ctx.fillStyle = '#334155'
            ctx.textAlign = 'center'
            ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('42 Slots Left', 32 + sc1CardW - 72, cardTextY + 53)

            ctx.save()
            ctx.translate(sc1BtnCX, sc1BtnCY)
            ctx.scale(btnRegScale, btnRegScale)
            ctx.translate(-sc1BtnCX, -sc1BtnCY)

            drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isRegistered ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isRegistered ? '✔ Registration Confirmed' : 'Register for Tournament', sc1BtnCX, sc1BtnY + 28)
            ctx.restore()
            ctx.restore()

            // SCENE 2 OVERLAY: SLIDE-UP BOTTOM SHEET (QRIS CHECKOUT)
            if (sceneIndex === 1 && sheetSlideProgress > 0) {
                const sheetY = contentY + (1 - sheetSlideProgress) * 380
                ctx.fillStyle = \`rgba(15, 23, 42, \${0.45 * sheetSlideProgress})\`
                ctx.fillRect(screenX, contentY, screenW, contentH)

                // White Sheet
                drawRoundedRect(screenX, sheetY + 30, screenW, 360, 24, '#FFFFFF', '#E2E8F0', 1.5)

                // Handle bar
                drawRoundedRect(screenX + screenW / 2 - 20, sheetY + 42, 40, 4, 2, '#CBD5E1')

                ctx.textAlign = 'left'
                ctx.fillStyle = '#64748B'
                ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText('Instant Checkout', screenX + 24, sheetY + 66)

                ctx.fillStyle = '#0F172A'
                ctx.font = '700 16px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('QRIS Payment Gateway', screenX + 24, sheetY + 86)

                // Amount Header
                drawRoundedRect(screenX + 20, sheetY + 98, screenW - 40, 44, 10, '#0F172A')
                ctx.fillStyle = '#94A3B8'
                ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText('Total Payment', screenX + 34, sheetY + 114)
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 15px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('Rp 350.000', screenX + 34, sheetY + 132)

                // QR Mini box
                const qbY = sheetY + 150
                drawRoundedRect(screenX + 20, qbY, screenW - 40, 100, 10, '#F8FAFC', '#E2E8F0', 1)

                drawRoundedRect(screenX + 32, qbY + 12, 54, 54, 6, '#FFFFFF', '#CBD5E1', 1)
                ctx.fillStyle = '#0F172A'
                ctx.fillRect(screenX + 38, qbY + 18, 12, 12)
                ctx.fillRect(screenX + 66, qbY + 18, 12, 12)
                ctx.fillRect(screenX + 38, qbY + 46, 12, 12)
                ctx.fillRect(screenX + 58, qbY + 36, 10, 10)

                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('QRIS Instant Settlement', screenX + 98, qbY + 28)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText('GOPAY · OVO · BCA · Mandiri', screenX + 98, qbY + 44)
                ctx.fillText('Expires in 14:59', screenX + 98, qbY + 58)

                // Bottom CTA Button in Sheet
                ctx.save()
                ctx.translate(screenX + screenW / 2, sheetY + 276)
                ctx.scale(btnPayScale, btnPayScale)
                ctx.translate(-(screenX + screenW / 2), -(sheetY + 276))

                drawRoundedRect(screenX + 20, sheetY + 258, screenW - 40, 44, 12, '#0F172A')
                ctx.textAlign = 'center'
                ctx.fillStyle = isPaid ? '#D9FF00' : '#FFFFFF'
                ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(isPaid ? '✔ Payment Verified & Settled' : 'Confirm & Pay with QRIS', screenX + screenW / 2, sheetY + 285)
                ctx.restore()
            }
        }
        // SCENE 3: APPLE WALLET DIGITAL ATHLETE PASS
        else if (sceneIndex === 2) {
            ctx.save()
            ctx.translate(screenX, contentY)

            const pHeroW = screenW - 40
            drawRoundedRect(20, 0, pHeroW, 262, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Pass Black Header
            drawRoundedRect(34, 14, pHeroW - 28, 42, 10, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Archeris Athlete Pass', 48, 32)
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Verified Accreditation 2026', 48, 46)

            const pMidY = 66
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 14px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Arif Dwi Pangestu', 36, pMidY + 14)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Fast Archery Club · Recurve Men', 36, pMidY + 30)

            drawRoundedRect(34, pMidY + 42, pHeroW - 28, 62, 10, '#F8FAFC', '#E2E8F0', 1)
            ctx.fillStyle = '#64748B'
            ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Assigned Target', 48, pMidY + 62)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 22px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target 04A', 48, pMidY + 90)

            drawRoundedRect(34 + pHeroW - 98, pMidY + 52, 62, 42, 8, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '700 10px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('70 Meters', 34 + pHeroW - 67, pMidY + 70)
            ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Session 1', 34 + pHeroW - 67, pMidY + 84)

            // Barcode lines
            ctx.textAlign = 'left'
            ctx.fillStyle = '#CBD5E1'
            for (let bx = 36; bx < 20 + pHeroW - 20; bx += 6) {
                ctx.fillRect(bx, 224, 3, 16)
            }

            ctx.save()
            ctx.translate(sc1BtnCX, sc1BtnCY)
            ctx.scale(btnCheckScale, btnCheckScale)
            ctx.translate(-sc1BtnCX, -sc1BtnCY)

            drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isCheckedIn ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isCheckedIn ? '✔ Venue Check-in Completed' : 'Scan Pass at Venue Gate', sc1BtnCX, sc1BtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // SCENE 4: LIVE SCORECARD & CERTIFICATE
        else {
            ctx.save()
            ctx.translate(screenX, contentY)

            const sHeroW = screenW - 40
            drawRoundedRect(20, 0, sHeroW, 262, 14, '#FFFFFF', '#E2E8F0', 1.2)

            drawRoundedRect(34, 14, sHeroW - 28, 52, 10, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Rank #1 · Gold Medalist', 48, 36)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Qualification Total: 684 / 720 pts (38 10s · 18 Xs)', 48, 54)

            const endY = 78
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('End Progression (72 Arrows):', 36, endY)

            const ends = [
                { no: 'E1', val: '30' }, { no: 'E2', val: '29' }, { no: 'E3', val: '28' },
                { no: 'E4', val: '30' }, { no: 'E5', val: '29' }, { no: 'E6', val: '30' }
            ]

            ends.forEach((e, idx) => {
                const ex = 34 + idx * 42
                drawRoundedRect(ex, endY + 10, 38, 38, 8, '#F8FAFC', '#E2E8F0', 1)
                ctx.fillStyle = '#64748B'
                ctx.textAlign = 'center'
                ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(e.no, ex + 19, endY + 24)

                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(e.val, ex + 19, endY + 40)
            })

            drawRoundedRect(34, endY + 58, sHeroW - 28, 48, 10, '#F1F5F9')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Official E-Certificate Ready', 48, endY + 78)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Signed & Cryptographically Verified PDF', 48, endY + 94)

            ctx.save()
            ctx.translate(sc1BtnCX, sc1BtnCY)
            ctx.scale(btnDlScale, btnDlScale)
            ctx.translate(-sc1BtnCX, -sc1BtnCY)

            drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isDownloaded ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isDownloaded ? '✔ Certificate Saved to Device' : 'Download Verified E-Certificate', sc1BtnCX, sc1BtnY + 28)
            ctx.restore()
            ctx.restore()
        }

        ctx.restore() // Content clip

        // ── Authentic Bottom Navigation Bar ──
        const bNavH = 58
        const bNavY = screenY + screenH - bNavH
        drawRoundedRect(screenX, bNavY, screenW, bNavH, 0, '#FFFFFF', '#E2E8F0', 1)

        const navItems = [
            { name: 'Events', icon: '🎯' },
            { name: 'My Pass', icon: '🎟' },
            { name: 'Scores', icon: '📊' },
            { name: 'Profile', icon: '👤' }
        ]

        const nItemW = screenW / 4
        navItems.forEach((n, idx) => {
            const nx = screenX + idx * nItemW
            const isNavActive = idx === bottomNavActive

            if (isNavActive) {
                drawRoundedRect(nx + nItemW / 2 - 16, bNavY + 6, 32, 22, 6, '#0F172A')
            }

            ctx.textAlign = 'center'
            ctx.fillStyle = isNavActive ? '#D9FF00' : '#64748B'
            ctx.font = isNavActive ? '700 10.5px "Bricolage Grotesque", "NovaText", sans-serif' : '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(n.name, nx + nItemW / 2, bNavY + 38)
        })

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
            ctx.fillStyle = \`rgba(217, 255, 0, \${0.5 * (1 - tapRipple)})\`
            ctx.fill()
            ctx.strokeStyle = \`rgba(15, 23, 42, \${0.4 * (1 - tapRipple)})\`
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
`;

fs.writeFileSync(path.join(__dirname, '../pages/graphics/feature-archer.vue'), code, 'utf8');
console.log('feature-archer.vue written successfully');
