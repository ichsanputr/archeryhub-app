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
const clamp01 = (x) => Math.max(0, Math.min(1, x))
const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3)
const easeInOutCubic = (x) => {
    const t = clamp01(x)
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
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

    // ── Preload Payment Proof & Hero Banner Images ──
    const receiptImage = new Image()
    receiptImage.src = '/payment-proof-sample.jpg'
    let isReceiptLoaded = false
    receiptImage.onload = () => {
        isReceiptLoaded = true
    }

    const bannerImage = new Image()
    bannerImage.src = '/hero-homepage.jpeg'
    let isBannerLoaded = false
    bannerImage.onload = () => {
        isBannerLoaded = true
    }

    // ── Helper: Draw Rounded Rectangle ──
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

    // ── Standard OS Mouse Cursor Renderer ──
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

    // ── Master 17.0-Second Seamless Loop (Relaxed Pacing & Clear Readability) ──
    const CYCLE_DURATION = 17.0
    let startTime = null

    function renderFrame(now) {
        if (!startTime) startTime = now
        const effectiveNow = isPaused.value ? (pausedAt - totalPausedDuration) : (now - totalPausedDuration)
        const elapsed = ((effectiveNow - startTime) / 1000) % CYCLE_DURATION

        // ── 1. Stage Background (Warm Architectural Neutral) ──
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

        // ── 2. Timeline States & Camera Calculations ──
        let tabSliderPos = 0
        let screenSlideOffset = 0
        let camZoom = 1.00
        let camPanY = 0

        let isPublished = false
        let btnPublishScale = 1.0
        let quotaVal = 0
        let isParticipantClicked = false
        let isPaymentVerified = false
        let btnVerifyScale = 1.0
        let isCheckinDone = false
        let btnCheckinScale = 1.0

        let cursorVisible = false
        let cursorX = 0, cursorY = 0
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        if (elapsed < 4.2) {
            // ── STEP 1: PUBLISH TOURNAMENT (0.0s - 4.2s) ──
            tabSliderPos = 0
            screenSlideOffset = 0

            // Dramatic Zoom in from 1.00x to 1.45x focusing on Publish CTA
            if (elapsed < 1.4) {
                const zt = easeInOutCubic(elapsed / 1.4)
                camZoom = 1.00 + 0.45 * zt
                camPanY = -85 * zt
            } else {
                camZoom = 1.45
                camPanY = -85
            }

            // Target: Publish Button at (540, 620)
            const targetBtnY = 620
            if (elapsed >= 1.0) {
                cursorVisible = true
                if (elapsed < 2.4) {
                    const mt = easeInOutCubic((elapsed - 1.0) / 1.4)
                    cursorX = 540
                    cursorY = 720 + (targetBtnY - 720) * mt
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (elapsed >= 2.4) {
                    isPublished = true
                    if (elapsed >= 2.4 && elapsed <= 2.85) {
                        cursorPressed = true
                        btnPublishScale = 0.94
                        tapRipple = (elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 8.4) {
            // ── STEP 2: PARTICIPANTS ROSTER (4.2s - 8.4s) ──
            isPublished = true
            const step2Elapsed = elapsed - 4.2

            // Slide transition Screen 1 to Screen 2
            if (step2Elapsed < 0.8) {
                const transT = easeInOutCubic(step2Elapsed / 0.8)
                tabSliderPos = transT
                screenSlideOffset = transT
                // Camera shifts from bottom CTA to top quota hero card
                camZoom = 1.45 + (1.30 - 1.45) * transT
                camPanY = -85 + (40 - (-85)) * transT
            } else if (step2Elapsed < 2.0) {
                // Focus on Quota counter rolling up
                tabSliderPos = 1
                screenSlideOffset = 1
                camZoom = 1.30
                camPanY = 40
            } else if (step2Elapsed < 2.8) {
                // Camera tilts down to participant 2 (Arif)
                tabSliderPos = 1
                screenSlideOffset = 1
                const ct = easeInOutCubic((step2Elapsed - 2.0) / 0.8)
                camZoom = 1.30 + (1.42 - 1.30) * ct
                camPanY = 40 + (-35 - 40) * ct
            } else {
                tabSliderPos = 1
                screenSlideOffset = 1
                camZoom = 1.42
                camPanY = -35
            }

            // Quota counter smoothly rolls up
            const qT = easeOutCubic(clamp((step2Elapsed - 0.4) / 1.6, 0, 1))
            quotaVal = Math.round(qT * 148)

            // Target: Participant 2 (Arif Dwi Pangestu) at exact center (540, 531)
            const targetPartY = 531
            if (step2Elapsed >= 1.8) {
                cursorVisible = true
                if (step2Elapsed < 3.0) {
                    const mt = easeInOutCubic((step2Elapsed - 1.8) / 1.2)
                    cursorX = 540
                    cursorY = 620 + (targetPartY - 620) * mt
                } else {
                    cursorX = 540
                    cursorY = targetPartY
                }

                if (step2Elapsed >= 3.0) {
                    isParticipantClicked = true
                    if (step2Elapsed >= 3.0 && step2Elapsed <= 3.45) {
                        cursorPressed = true
                        tapRipple = (step2Elapsed - 3.0) / 0.45
                        tapX = 540; tapY = targetPartY
                    }
                }
            }
        } else if (elapsed < 12.6) {
            // ── STEP 3: PAYMENT VERIFICATION (8.4s - 12.6s) ──
            isPublished = true
            quotaVal = 148
            isParticipantClicked = true
            const step3Elapsed = elapsed - 8.4

            // Slide transition Screen 2 to Screen 3
            if (step3Elapsed < 0.8) {
                const transT = easeInOutCubic(step3Elapsed / 0.8)
                tabSliderPos = 1 + transT
                screenSlideOffset = 1 + transT
                camZoom = 1.42 + (1.35 - 1.42) * transT
                camPanY = -35 + (-20 - (-35)) * transT
            } else if (step3Elapsed < 1.8) {
                tabSliderPos = 2
                screenSlideOffset = 2
                camZoom = 1.35
                camPanY = -20
            } else if (step3Elapsed < 2.6) {
                // Push in closer to verify button
                tabSliderPos = 2
                screenSlideOffset = 2
                const ct = easeInOutCubic((step3Elapsed - 1.8) / 0.8)
                camZoom = 1.35 + (1.46 - 1.35) * ct
                camPanY = -20 + (-85 - (-20)) * ct
            } else {
                tabSliderPos = 2
                screenSlideOffset = 2
                camZoom = 1.46
                camPanY = -85
            }

            // Target: Click Verify Payment Button at (540, 620)
            const targetVerifyY = 620
            if (step3Elapsed >= 1.6) {
                cursorVisible = true
                if (step3Elapsed < 2.8) {
                    const mt = easeInOutCubic((step3Elapsed - 1.6) / 1.2)
                    cursorX = 540
                    cursorY = 531 + (targetVerifyY - 531) * mt
                } else {
                    cursorX = 540
                    cursorY = targetVerifyY
                }

                if (step3Elapsed >= 2.8) {
                    isPaymentVerified = true
                    if (step3Elapsed >= 2.8 && step3Elapsed <= 3.25) {
                        cursorPressed = true
                        btnVerifyScale = 0.94
                        tapRipple = (step3Elapsed - 2.8) / 0.45
                        tapX = 540; tapY = targetVerifyY
                    }
                }
            }
        } else if (elapsed < 16.0) {
            // ── STEP 4: ON-SITE CHECK-IN (12.6s - 16.0s) ──
            isPublished = true
            quotaVal = 148
            isParticipantClicked = true
            isPaymentVerified = true
            const step4Elapsed = elapsed - 12.6

            // Slide transition Screen 3 to Screen 4
            if (step4Elapsed < 0.8) {
                const transT = easeInOutCubic(step4Elapsed / 0.8)
                tabSliderPos = 2 + transT
                screenSlideOffset = 2 + transT
                camZoom = 1.46 + (1.35 - 1.46) * transT
                camPanY = -85 + (-20 - (-85)) * transT
            } else if (step4Elapsed < 1.6) {
                tabSliderPos = 3
                screenSlideOffset = 3
                camZoom = 1.35
                camPanY = -20
            } else if (step4Elapsed < 2.3) {
                // Push in to Check-in button
                tabSliderPos = 3
                screenSlideOffset = 3
                const ct = easeInOutCubic((step4Elapsed - 1.6) / 0.7)
                camZoom = 1.35 + (1.46 - 1.35) * ct
                camPanY = -20 + (-85 - (-20)) * ct
            } else {
                tabSliderPos = 3
                screenSlideOffset = 3
                camZoom = 1.46
                camPanY = -85
            }

            // Target: Click Complete Check-in Button at (540, 620)
            const targetCheckinY = 620
            if (step4Elapsed >= 1.4) {
                cursorVisible = true
                if (step4Elapsed < 2.4) {
                    const mt = easeInOutCubic((step4Elapsed - 1.4) / 1.0)
                    cursorX = 540
                    cursorY = targetCheckinY
                } else {
                    cursorX = 540
                    cursorY = targetCheckinY
                }

                if (step4Elapsed >= 2.4) {
                    isCheckinDone = true
                    if (step4Elapsed >= 2.4 && step4Elapsed <= 2.85) {
                        cursorPressed = true
                        btnCheckinScale = 0.94
                        tapRipple = (step4Elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetCheckinY
                    }
                }
            }
        } else {
            // ── STEP 5: FINALE OVERVIEW & SEAMLESS RESET (16.0s - 17.0s) ──
            isPublished = true
            quotaVal = 148
            isParticipantClicked = true
            isPaymentVerified = true
            isCheckinDone = true

            const finElapsed = elapsed - 16.0
            const finT = easeInOutCubic(finElapsed / 1.0)

            // Grand cinematic zoom-out back to 1.00x overview
            camZoom = 1.46 - (1.46 - 1.00) * finT
            camPanY = -85 * (1 - finT)
            tabSliderPos = 3 * (1 - finT)
            screenSlideOffset = 3 * (1 - finT)
            cursorVisible = false
        }

        // ── 3. Master Camera Transform (Keeps Phone inside 1080x1080) ──
        ctx.save()
        ctx.translate(540, 540 + camPanY)
        ctx.scale(camZoom, camZoom)
        ctx.translate(-540, -540)

        // ── 4. Smartphone Chassis (370 x 760 px) ──
        const phoneW = 370
        const phoneH = 760
        const phoneX = 540 - phoneW / 2
        const phoneY = 540 - phoneH / 2

        // Soft ambient realistic drop shadow
        ctx.save()
        ctx.shadowColor = 'rgba(15, 23, 42, 0.14)'
        ctx.shadowBlur = 42
        ctx.shadowOffsetY = 22
        drawRoundedRect(phoneX, phoneY, phoneW, phoneH, 48, '#181A1D')
        ctx.restore()

        // Metallic Side Buttons
        drawRoundedRect(phoneX - 3, phoneY + 140, 3.5, 42, 1.5, '#8E95A2')
        drawRoundedRect(phoneX - 3, phoneY + 195, 3.5, 42, 1.5, '#8E95A2')
        drawRoundedRect(phoneX + phoneW - 0.5, phoneY + 170, 3.5, 58, 1.5, '#8E95A2')

        // Titanium Outer Bezel
        drawRoundedRect(phoneX, phoneY, phoneW, phoneH, 48, '#181A1D', '#2D3139', 2)

        // ── 5. Smartphone Screen Glass Viewport ──
        const screenW = 348
        const screenH = 738
        const screenX = 540 - screenW / 2
        const screenY = 540 - screenH / 2

        ctx.save()
        drawRoundedRect(screenX, screenY, screenW, screenH, 40)
        ctx.clip()

        // Clean Screen Backdrop
        ctx.fillStyle = '#F8FAFC'
        ctx.fillRect(screenX, screenY, screenW, screenH)

        // ── Segmented Tab Switcher (4 Authentic Tabs in Title Case) ──
        const segW = screenW - 24 // 324px
        const segH = 34
        const segX = screenX + 12
        const segY = screenY + 54

        drawRoundedRect(segX, segY, segW, segH, 10, '#E2E8F0')

        // Sliding Indicator Pill
        const pillW = (segW - 6) / 4 // 79.5px
        const pillX = segX + 3 + tabSliderPos * pillW
        drawRoundedRect(pillX, segY + 3, pillW, segH - 6, 8, '#0F172A')

        const tabLabels = ['Publish', 'Roster', 'Verify', 'Check-in']
        for (let i = 0; i < 4; i++) {
            const tx = segX + 3 + i * pillW + pillW / 2
            const activeRatio = Math.max(0, 1 - Math.abs(tabSliderPos - i))
            ctx.textAlign = 'center'
            ctx.font = activeRatio > 0.5 ? '700 10px "NovaText", "Plus Jakarta Sans", sans-serif' : '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillStyle = activeRatio > 0.5 ? '#D9FF00' : '#64748B'
            ctx.fillText(tabLabels[i], tx, segY + 21)
        }

        // ── Screen Content Layer Carousel ──
        const contentY = segY + segH + 16
        const contentH = screenH - (contentY - screenY) - 20
        const layerW = screenW

        ctx.save()
        ctx.beginPath()
        ctx.rect(screenX, contentY, screenW, contentH)
        ctx.clip()

        // ══════════════════════════════════════════════════════════
        // SCREEN 1: PUBLISH TOURNAMENT (DRAFT → PUBLISHED)
        // ══════════════════════════════════════════════════════════
        ctx.save()
        ctx.translate(screenX - screenSlideOffset * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Event Management', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Publish Tournament', 20, 38)

        // Event Card with Top Cover Thumbnail
        const sc1CardW = screenW - 40
        const sc1CardY = 54
        const sc1CardH = 252
        drawRoundedRect(20, sc1CardY, sc1CardW, sc1CardH, 14, '#FFFFFF', '#E2E8F0', 1.2)

        // Top Cover Image Banner
        const bannerH = 80
        ctx.save()
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(20, sc1CardY, sc1CardW, bannerH, [14, 14, 0, 0])
        } else {
            ctx.rect(20, sc1CardY, sc1CardW, bannerH)
        }
        ctx.clip()

        if (isBannerLoaded) {
            ctx.drawImage(bannerImage, 20, sc1CardY, sc1CardW, bannerH)
        } else {
            ctx.fillStyle = '#1E293B'
            ctx.fillRect(20, sc1CardY, sc1CardW, bannerH)
        }

        // Ambient Dark Gradient Overlay on Banner
        const bannerGrad = ctx.createLinearGradient(20, sc1CardY, 20, sc1CardY + bannerH)
        bannerGrad.addColorStop(0, 'rgba(15, 23, 42, 0.25)')
        bannerGrad.addColorStop(1, 'rgba(15, 23, 42, 0.75)')
        ctx.fillStyle = bannerGrad
        ctx.fillRect(20, sc1CardY, sc1CardW, bannerH)
        ctx.restore()

        // Floating Badges Over Banner
        drawRoundedRect(30, sc1CardY + 10, 88, 20, 5, 'rgba(15, 23, 42, 0.85)', 'rgba(255, 255, 255, 0.25)', 1)
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('National Series', 30 + 44, sc1CardY + 23)

        // Draft / Published Floating Badge
        ctx.textAlign = 'right'
        if (isPublished) {
            drawRoundedRect(screenW - 98, sc1CardY + 10, 68, 20, 5, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('Published', screenW - 98 + 34, sc1CardY + 23)
        } else {
            drawRoundedRect(screenW - 80, sc1CardY + 10, 50, 20, 5, 'rgba(15, 23, 42, 0.85)', 'rgba(255, 255, 255, 0.25)', 1)
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('Draft', screenW - 80 + 25, sc1CardY + 23)
        }

        // Event Title & Location (Below Banner)
        ctx.textAlign = 'left'
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 14px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Archeris National Open 2026', 30, sc1CardY + 100)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Senayan Archery Field, Jakarta', 30, sc1CardY + 114)

        // 2-Col Stat Bento Inside Card
        const subStatY = sc1CardY + 124
        const subStatW = (sc1CardW - 30) / 2

        drawRoundedRect(30, subStatY, subStatW, 52, 8, '#F8FAFC', '#E2E8F0')
        ctx.fillStyle = '#64748B'
        ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Total Quota', 38, subStatY + 17)
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('160 Archers', 38, subStatY + 37)

        drawRoundedRect(30 + subStatW + 10, subStatY, subStatW, 52, 8, '#F8FAFC', '#E2E8F0')
        ctx.fillStyle = '#64748B'
        ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Entry Fee', 38 + subStatW + 10, subStatY + 17)
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Rp 150,000', 38 + subStatW + 10, subStatY + 37)

        // Division Tags Row
        const divPills = ['Recurve', 'Compound', 'Barebow']
        let divX = 30
        for (let di = 0; di < divPills.length; di++) {
            const dw = 58
            drawRoundedRect(divX, sc1CardY + 186, dw, 18, 4, '#F1F5F9')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '600 8px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(divPills[di], divX + dw / 2, sc1CardY + 198)
            divX += dw + 6
        }

        // Info Note Line
        ctx.textAlign = 'left'
        ctx.fillStyle = isPublished ? '#0F172A' : '#64748B'
        ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText(isPublished ? '● Online registration open for all clubs' : '○ Draft mode (not visible to public)', 30, sc1CardY + 226)

        // Action CTA: Publish Tournament
        ctx.save()
        const b1X = 20, b1Y = 322, b1W = screenW - 40, b1H = 46
        ctx.translate(b1X + b1W / 2, b1Y + b1H / 2)
        ctx.scale(btnPublishScale, btnPublishScale)

        if (isPublished) {
            drawRoundedRect(-b1W / 2, -b1H / 2, b1W, b1H, 12, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('Tournament Published', 0, 5)
        } else {
            drawRoundedRect(-b1W / 2, -b1H / 2, b1W, b1H, 12, '#0F172A')
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 13px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('Publish Tournament', 0, 5)
        }
        ctx.restore()

        ctx.restore() // End Screen 1

        // ══════════════════════════════════════════════════════════
        // SCREEN 2: PARTICIPANTS ROSTER & MONITORING
        // ══════════════════════════════════════════════════════════
        ctx.save()
        ctx.translate(screenX + (1 - screenSlideOffset) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Event Monitoring', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Registered Participants', 20, 38)

        // Quota Progress Card
        const sc2HeroY = 56
        const sc2HeroH = 84
        drawRoundedRect(20, sc2HeroY, screenW - 40, sc2HeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Total Registered', 34, sc2HeroY + 24)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 24px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(String(quotaVal), 34, sc2HeroY + 50)

        ctx.fillStyle = '#64748B'
        ctx.font = '600 13px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('/ 160 Archers', 84, sc2HeroY + 50)

        ctx.textAlign = 'right'
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 11px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('92% Quota', screenW - 34, sc2HeroY + 50)

        // Progress Bar with Slate Accent
        const barX = 34, barY = sc2HeroY + 64, barW = screenW - 40 - 28, barH = 5
        drawRoundedRect(barX, barY, barW, barH, 2.5, '#F1F5F9')
        drawRoundedRect(barX, barY, barW * (quotaVal / 160), barH, 2.5, '#0F172A')

        // Participants List Section
        ctx.textAlign = 'left'
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Recent Entries', 20, 160)

        const pListY = 172
        const participants = [
            { name: 'Diananda Choirunisa', club: 'Fast Archery Club', cat: 'Recurve Women', status: 'Paid', isVolt: true },
            { name: 'Arif Dwi Pangestu', club: 'Surabaya Archery Team', cat: 'Recurve Men', status: 'Pending', isVolt: false },
            { name: 'Riau Ega Agatha', club: 'Jakarta Barebow Hub', cat: 'Barebow Open', status: 'Paid', isVolt: true }
        ]

        for (let pi = 0; pi < participants.length; pi++) {
            const p = participants[pi]
            const py = pListY + pi * 58
            const isHover = isParticipantClicked && pi === 1
            const cardBg = isHover ? '#F8FAFC' : '#FFFFFF'
            const cardStroke = isHover ? '#0F172A' : '#E2E8F0'

            drawRoundedRect(20, py, screenW - 40, 52, 10, cardBg, cardStroke, isHover ? 1.5 : 1)

            // Avatar circle
            drawRoundedRect(30, py + 10, 32, 32, 16, '#F1F5F9')
            ctx.textAlign = 'center'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(p.name.charAt(0), 30 + 16, py + 29)

            // Name & Club
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(p.name, 70, py + 22)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(p.club + ' · ' + p.cat, 70, py + 36)

            // Status Pill (Volt for paid, soft slate for pending)
            ctx.textAlign = 'center'
            if (p.isVolt) {
                drawRoundedRect(screenW - 74, py + 16, 44, 20, 5, '#D9FF00')
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(p.status, screenW - 74 + 22, py + 30)
            } else {
                drawRoundedRect(screenW - 88, py + 16, 58, 20, 5, '#F1F5F9')
                ctx.fillStyle = '#64748B'
                ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(p.status, screenW - 88 + 29, py + 30)
            }
        }

        ctx.restore() // End Screen 2

        // ══════════════════════════════════════════════════════════
        // SCREEN 3: REGISTRATION DETAIL & PAYMENT VERIFICATION
        // ══════════════════════════════════════════════════════════
        ctx.save()
        ctx.translate(screenX + (2 - screenSlideOffset) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Payment Verification', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Athlete Registration Detail', 20, 38)

        // Athlete Profile Compact Bento Strip
        const sc3Card1Y = 54
        drawRoundedRect(20, sc3Card1Y, screenW - 40, 54, 12, '#FFFFFF', '#E2E8F0', 1.2)

        drawRoundedRect(30, sc3Card1Y + 9, 36, 36, 10, '#F1F5F9')
        ctx.textAlign = 'center'
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 14px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('A', 30 + 18, sc3Card1Y + 32)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Arif Dwi Pangestu', 74, sc3Card1Y + 23)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Surabaya Archery Team · Recurve Men', 74, sc3Card1Y + 39)

        ctx.textAlign = 'right'
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('ID: ARC-088', screenW - 32, sc3Card1Y + 23)

        // Payment Proof & Verification Container Card
        const sc3Card2Y = 116
        const sc3Card2H = 196
        drawRoundedRect(20, sc3Card2Y, screenW - 40, sc3Card2H, 14, '#FFFFFF', '#E2E8F0', 1.2)

        // Left Column: Real Receipt Image Preview Card
        const rcX = 30
        const rcY = sc3Card2Y + 12
        const rcW = 98
        const rcH = 172

        drawRoundedRect(rcX, rcY, rcW, rcH, 8, '#F8FAFC', '#CBD5E1', 1.2)

        if (isReceiptLoaded) {
            ctx.save()
            drawRoundedRect(rcX + 2, rcY + 2, rcW - 4, rcH - 4, 6)
            ctx.clip()
            ctx.drawImage(receiptImage, rcX + 2, rcY + 2, rcW - 4, rcH - 4)
            ctx.restore()
        } else {
            // Skeleton while loading
            drawRoundedRect(rcX + 4, rcY + 4, rcW - 8, rcH - 8, 4, '#E2E8F0')
        }

        // Receipt Proof Badge at bottom of thumbnail
        drawRoundedRect(rcX + 6, rcY + rcH - 22, rcW - 12, 16, 4, 'rgba(15, 23, 42, 0.88)')
        ctx.textAlign = 'center'
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '700 8px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Receipt Proof', rcX + rcW / 2, rcY + rcH - 11)

        // Right Column: Payment Details Metadata Bento
        const metaX = rcX + rcW + 10
        const metaW = (screenW - 30) - metaX

        const drawMetaBox = (my, label, val, isVoltBadge = false) => {
            drawRoundedRect(metaX, my, metaW, 52, 8, '#F8FAFC', '#E2E8F0', 1)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(label, metaX + 8, my + 17)

            if (isVoltBadge) {
                if (isPaymentVerified) {
                    drawRoundedRect(metaX + 8, my + 25, metaW - 16, 20, 4, '#D9FF00')
                    ctx.fillStyle = '#0F172A'
                    ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                    ctx.textAlign = 'center'
                    ctx.fillText('Verified', metaX + metaW / 2, my + 39)
                } else {
                    drawRoundedRect(metaX + 8, my + 25, metaW - 16, 20, 4, '#F1F5F9')
                    ctx.fillStyle = '#64748B'
                    ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                    ctx.textAlign = 'center'
                    ctx.fillText('Pending Verification', metaX + metaW / 2, my + 39)
                }
            } else {
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(val, metaX + 8, my + 38)
            }
        }

        drawMetaBox(sc3Card2Y + 12, 'Payment Method', 'QRIS / DANA Transfer')
        drawMetaBox(sc3Card2Y + 72, 'Amount Paid', 'Rp 235,000')
        drawMetaBox(sc3Card2Y + 132, 'Status', '', true)

        // Action CTA: Verify Payment
        ctx.save()
        const b3X = 20, b3Y = 322, b3W = screenW - 40, b3H = 46
        ctx.translate(b3X + b3W / 2, b3Y + b3H / 2)
        ctx.scale(btnVerifyScale, btnVerifyScale)

        if (isPaymentVerified) {
            drawRoundedRect(-b3W / 2, -b3H / 2, b3W, b3H, 12, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('Payment Verified', 0, 5)
        } else {
            drawRoundedRect(-b3W / 2, -b3H / 2, b3W, b3H, 12, '#0F172A')
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 13px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('Verify Payment', 0, 5)
        }
        ctx.restore()

        ctx.restore() // End Screen 3

        // ══════════════════════════════════════════════════════════
        // SCREEN 4: ON-SITE CHECK-IN (CHECK-IN DESK)
        // ══════════════════════════════════════════════════════════
        ctx.save()
        ctx.translate(screenX + (3 - screenSlideOffset) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('On-site Check-in', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Tournament Check-in Desk', 20, 38)

        // Check-in Hero Card
        const sc4CardY = 56
        drawRoundedRect(20, sc4CardY, screenW - 40, 250, 16, '#FFFFFF', '#E2E8F0', 1.2)

        // Target Butt Badge
        drawRoundedRect(34, sc4CardY + 14, 114, 22, 6, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Target Butt A-01', 34 + 57, sc4CardY + 29)

        // Check-in Status Badge
        ctx.textAlign = 'right'
        if (isCheckinDone) {
            drawRoundedRect(screenW - 110, sc4CardY + 14, 76, 22, 6, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Checked In', screenW - 34 - 12, sc4CardY + 29)
        } else {
            drawRoundedRect(screenW - 126, sc4CardY + 14, 92, 22, 6, '#F1F5F9')
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Not Checked In', screenW - 34 - 8, sc4CardY + 29)
        }

        // Name & Category
        ctx.textAlign = 'left'
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 16px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Arif Dwi Pangestu', 34, sc4CardY + 68)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 11px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Surabaya Archery Team · Recurve Men Open', 34, sc4CardY + 86)

        // Check-in detail pills
        const drawCheckinPill = (cy, label, value) => {
            drawRoundedRect(34, cy, screenW - 68, 32, 8, '#F8FAFC', '#F1F5F9')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(label, 44, cy + 20)

            ctx.textAlign = 'right'
            ctx.fillStyle = '#0F172A'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(value, screenW - 44, cy + 20)
        }

        drawCheckinPill(sc4CardY + 104, 'Payment Status', 'Verified')
        drawCheckinPill(sc4CardY + 144, 'Documents', 'ID & Profile Verified')
        drawCheckinPill(sc4CardY + 184, 'Check-in Time', isCheckinDone ? '07:45 WIB · Ready' : 'Waiting at Venue')

        // Action CTA: Complete Check-in
        ctx.save()
        const b4X = 20, b4Y = 322, b4W = screenW - 40, b4H = 46
        ctx.translate(b4X + b4W / 2, b4Y + b4H / 2)
        ctx.scale(btnCheckinScale, btnCheckinScale)

        if (isCheckinDone) {
            drawRoundedRect(-b4W / 2, -b4H / 2, b4W, b4H, 12, '#D9FF00')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 13px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('Checked In (Ready to Shoot)', 0, 5)
        } else {
            drawRoundedRect(-b4W / 2, -b4H / 2, b4W, b4H, 12, '#0F172A')
            ctx.fillStyle = '#FFFFFF'
            ctx.font = '700 13px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('Complete Check-in', 0, 5)
        }
        ctx.restore()

        ctx.restore() // End Screen 4

        ctx.restore() // End Layer Carousel Clip

        // ── 6. Status Bar & Dynamic Island ──
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 12px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText('9:41', screenX + 28, screenY + 28)

        // Battery / WiFi Icons
        const iconRightX = screenX + screenW - 28
        drawRoundedRect(iconRightX - 22, screenY + 18, 22, 11, 3, null, '#0F172A', 1.2)
        drawRoundedRect(iconRightX - 20, screenY + 20, 14, 7, 1.5, '#0F172A')
        drawRoundedRect(iconRightX, screenY + 21.5, 1.5, 4, 1, '#0F172A')

        ctx.beginPath()
        ctx.arc(iconRightX - 32, screenY + 27, 7, Math.PI * 1.25, Math.PI * 1.75)
        ctx.strokeStyle = '#0F172A'; ctx.lineWidth = 1.4; ctx.stroke()
        ctx.beginPath()
        ctx.arc(iconRightX - 32, screenY + 27, 4, Math.PI * 1.25, Math.PI * 1.75)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(iconRightX - 32, screenY + 27, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = '#0F172A'; ctx.fill()

        // Dynamic Island Pill
        const diW = 96, diH = 24
        const diX = screenX + screenW / 2 - diW / 2
        const diY = screenY + 14
        drawRoundedRect(diX, diY, diW, diH, 12, '#000000')

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.beginPath()
        ctx.arc(diX + diW - 16, diY + diH / 2, 3.5, 0, Math.PI * 2)
        ctx.fill()

        // Home Indicator Bar
        drawRoundedRect(screenX + screenW / 2 - 55, screenY + screenH - 12, 110, 4, 2, '#0F172A')

        ctx.restore() // End Screen Glass Clip

        // ── 7. Touch Ripple & Standard Mouse Pointer Rendering ──
        if (tapRipple >= 0 && tapRipple <= 1) {
            ctx.save()
            ctx.translate(tapX, tapY)
            ctx.beginPath()
            ctx.arc(0, 0, 6 + tapRipple * 28, 0, Math.PI * 2)
            ctx.strokeStyle = 'rgba(15, 23, 42, ' + (0.4 * Math.max(0, 1 - tapRipple)) + ')'
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.restore()
        }

        if (cursorVisible && cursorX > 0) {
            drawMouseCursor(cursorX, cursorY, cursorPressed)
        }

        ctx.restore() // End Camera Framing

        // ── Floating Pause Overlay Badge ──
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

        if (!isPaused.value) {
            animationFrameId = requestAnimationFrame(renderFrame)
        }
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

