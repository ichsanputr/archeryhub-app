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

    // ── Master 17.0-Second Seamless Loop (Calm Pacing & HD Crisp Typography) ──
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

        let isAllocated = false
        let btnAllocScale = 1.0
        let isSeeded = false
        let btnSeedScale = 1.0
        let isBracketAdvanced = false
        let btnBracketScale = 1.0
        let isCertIssued = false
        let btnCertScale = 1.0

        let cursorVisible = false
        let cursorX = 0, cursorY = 0
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        if (elapsed < 4.2) {
            // ── STEP 1: TARGET BUTT ALLOCATION (0.0s - 4.2s) ──
            tabSliderPos = 0
            screenSlideOffset = 0

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
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (elapsed >= 2.4) {
                    isAllocated = true
                    if (elapsed >= 2.4 && elapsed <= 2.85) {
                        cursorPressed = true
                        btnAllocScale = 0.94
                        tapRipple = (elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 8.4) {
            // ── STEP 2: LIVE STANDINGS & TEAM CALCULATION (4.2s - 8.4s) ──
            isAllocated = true
            const step2Elapsed = elapsed - 4.2

            if (step2Elapsed < 0.8) {
                const transT = easeInOutCubic(step2Elapsed / 0.8)
                tabSliderPos = transT
                screenSlideOffset = transT
                camZoom = 1.45 + (1.35 - 1.45) * transT
                camPanY = -85 + (-40 - (-85)) * transT
            } else if (step2Elapsed < 2.0) {
                tabSliderPos = 1
                screenSlideOffset = 1
                camZoom = 1.35
                camPanY = -40
            } else if (step2Elapsed < 2.8) {
                tabSliderPos = 1
                screenSlideOffset = 1
                const ct = easeInOutCubic((step2Elapsed - 2.0) / 0.8)
                camZoom = 1.35 + (1.46 - 1.35) * ct
                camPanY = -40 + (-85 - (-40)) * ct
            } else {
                tabSliderPos = 1
                screenSlideOffset = 1
                camZoom = 1.46
                camPanY = -85
            }

            const targetBtnY = 620
            if (step2Elapsed >= 1.4) {
                cursorVisible = true
                if (step2Elapsed < 2.5) {
                    const mt = easeInOutCubic((step2Elapsed - 1.4) / 1.1)
                    cursorX = 540
                    cursorY = 520 + (targetBtnY - 520) * mt
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (step2Elapsed >= 2.5) {
                    isSeeded = true
                    if (step2Elapsed >= 2.5 && step2Elapsed <= 2.95) {
                        cursorPressed = true
                        btnSeedScale = 0.94
                        tapRipple = (step2Elapsed - 2.5) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 12.6) {
            // ── STEP 3: WORLD ARCHERY BRACKETS (8.4s - 12.6s) ──
            isAllocated = true
            isSeeded = true
            const step3Elapsed = elapsed - 8.4

            if (step3Elapsed < 0.8) {
                const transT = easeInOutCubic(step3Elapsed / 0.8)
                tabSliderPos = 1 + transT
                screenSlideOffset = 1 + transT
                camZoom = 1.46 + (1.35 - 1.46) * transT
                camPanY = -85 + (-20 - (-85)) * transT
            } else if (step3Elapsed < 1.8) {
                tabSliderPos = 2
                screenSlideOffset = 2
                camZoom = 1.35
                camPanY = -20
            } else if (step3Elapsed < 2.6) {
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

            const targetBtnY = 620
            if (step3Elapsed >= 1.6) {
                cursorVisible = true
                if (step3Elapsed < 2.8) {
                    const mt = easeInOutCubic((step3Elapsed - 1.6) / 1.2)
                    cursorX = 540
                    cursorY = 530 + (targetBtnY - 530) * mt
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (step3Elapsed >= 2.8) {
                    isBracketAdvanced = true
                    if (step3Elapsed >= 2.8 && step3Elapsed <= 3.25) {
                        cursorPressed = true
                        btnBracketScale = 0.94
                        tapRipple = (step3Elapsed - 2.8) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 16.0) {
            // ── STEP 4: BATCH E-CERTIFICATES (12.6s - 16.0s) ──
            isAllocated = true
            isSeeded = true
            isBracketAdvanced = true
            const step4Elapsed = elapsed - 12.6

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

            const targetBtnY = 620
            if (step4Elapsed >= 1.4) {
                cursorVisible = true
                if (step4Elapsed < 2.4) {
                    const mt = easeInOutCubic((step4Elapsed - 1.4) / 1.0)
                    cursorX = 540
                    cursorY = targetBtnY
                } else {
                    cursorX = 540
                    cursorY = targetBtnY
                }

                if (step4Elapsed >= 2.4) {
                    isCertIssued = true
                    if (step4Elapsed >= 2.4 && step4Elapsed <= 2.85) {
                        cursorPressed = true
                        btnCertScale = 0.94
                        tapRipple = (step4Elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else {
            // ── STEP 5: FINALE OVERVIEW & SEAMLESS RESET (16.0s - 17.0s) ──
            isAllocated = true
            isSeeded = true
            isBracketAdvanced = true
            isCertIssued = true

            const finElapsed = elapsed - 16.0
            const finT = easeInOutCubic(finElapsed / 1.0)

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

        // ── 5. Smartphone Screen Glass Viewport ──
        const screenW = 348
        const screenH = 738
        const screenX = 540 - screenW / 2
        const screenY = 540 - screenH / 2

        ctx.save()
        drawRoundedRect(screenX, screenY, screenW, screenH, 40)
        ctx.clip()

        ctx.fillStyle = '#F8FAFC'
        ctx.fillRect(screenX, screenY, screenW, screenH)

        // ── Segmented Tab Switcher ──
        const segW = screenW - 24
        const segH = 34
        const segX = screenX + 12
        const segY = screenY + 54

        drawRoundedRect(segX, segY, segW, segH, 10, '#E2E8F0')

        const pillW = (segW - 6) / 4
        const pillX = segX + 3 + tabSliderPos * pillW
        drawRoundedRect(pillX, segY + 3, pillW, segH - 6, 8, '#0F172A')

        const tabLabels = ['Targets', 'Standings', 'Brackets', 'Certificates']
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

        // ── SCREEN 1: TARGET BUTT ALLOCATION ──
        ctx.save()
        ctx.translate(screenX - screenSlideOffset * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Tournament Operations', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Target Butt Allocation', 20, 38)

        const sc1HeroW = screenW - 40
        const sc1HeroY = 54
        drawRoundedRect(20, sc1HeroY, sc1HeroW, 64, 14, '#FFFFFF', '#E2E8F0', 1.2)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Recurve Men Open 70m', 34, sc1HeroY + 26)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('40 Targets · 160 Archers', 34, sc1HeroY + 46)

        drawRoundedRect(20 + sc1HeroW - 68, sc1HeroY + 18, 54, 24, 6, '#F1F5F9')
        ctx.fillStyle = '#334155'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Round 1', 20 + sc1HeroW - 60, sc1HeroY + 34)

        const targetsY = sc1HeroY + 76
        const targetList = [
            { lane: 'Target 01', a: 'Arif Dwi (Fast AC)', b: 'Riau Ega (Eagle AC)' },
            { lane: 'Target 02', a: 'Diananda C. (Fast AC)', b: 'Rezza O. (Focus)' },
            { lane: 'Target 03', a: 'Fathur R. (Alpha)', b: 'Kenzo A. (Fast AC)' }
        ]

        targetList.forEach((t, idx) => {
            const ty = targetsY + idx * 62
            drawRoundedRect(20, ty, sc1HeroW, 54, 12, '#FFFFFF', '#E2E8F0', 1.2)

            drawRoundedRect(30, ty + 12, 60, 30, 8, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(t.lane, 36, ty + 31)

            ctx.fillStyle = isAllocated ? '#0F172A' : '#94A3B8'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(isAllocated ? `A: ${t.a}` : 'A: Unassigned', 100, ty + 24)

            ctx.fillStyle = isAllocated ? '#64748B' : '#CBD5E1'
            ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(isAllocated ? `B: ${t.b}` : 'B: Unassigned', 100, ty + 42)
        })

        const sc1BtnY = 328
        const sc1BtnW = screenW - 40
        const sc1BtnH = 46
        const sc1BtnCX = 20 + sc1BtnW / 2
        const sc1BtnCY = sc1BtnY + sc1BtnH / 2

        ctx.save()
        ctx.translate(sc1BtnCX, sc1BtnCY)
        ctx.scale(btnAllocScale, btnAllocScale)
        ctx.translate(-sc1BtnCX, -sc1BtnCY)

        drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = isAllocated ? '#D9FF00' : '#FFFFFF'
        ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isAllocated ? '✔ All 40 Targets Allocated' : 'Auto-Allocate Target Lanes', sc1BtnCX, sc1BtnY + 28)
        ctx.restore()

        ctx.restore() // End Screen 1

        // ── SCREEN 2: LIVE STANDINGS & TEAM CALCULATION ──
        ctx.save()
        ctx.translate(screenX - (screenSlideOffset - 1) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Live Qualification', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Leaderboard & Teams', 20, 38)

        const sc2StatW = (screenW - 50) / 2
        drawRoundedRect(20, 54, sc2StatW, 56, 12, '#FFFFFF', '#E2E8F0', 1.2)
        ctx.fillStyle = '#64748B'
        ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Completed Ends', 32, 72)
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 16px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('12 / 12 (100%)', 32, 96)

        drawRoundedRect(30 + sc2StatW, 54, sc2StatW, 56, 12, '#FFFFFF', '#E2E8F0', 1.2)
        ctx.fillStyle = '#64748B'
        ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Team Calculation', 42 + sc2StatW, 72)
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 16px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('16 Clubs Seeded', 42 + sc2StatW, 96)

        const teamsY = 120
        const teamsW = screenW - 40
        drawRoundedRect(20, teamsY, teamsW, 196, 14, '#FFFFFF', '#E2E8F0', 1.2)

        const teamRows = [
            { rank: '1', name: 'Fast Archery Club', score: '1,980 pts', gold: true },
            { rank: '2', name: 'Eagle Archery Club', score: '1,945 pts', gold: false },
            { rank: '3', name: 'Focus Target Team', score: '1,910 pts', gold: false }
        ]

        teamRows.forEach((r, idx) => {
            const ry = teamsY + 12 + idx * 60
            if (idx > 0) {
                ctx.strokeStyle = '#F1F5F9'
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(34, ry - 6)
                ctx.lineTo(20 + teamsW - 14, ry - 6)
                ctx.stroke()
            }

            drawRoundedRect(32, ry + 2, 24, 24, 6, r.gold ? '#D9FF00' : '#F1F5F9')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(r.rank, 44, ry + 18)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(r.name, 66, ry + 14)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(`Top 3 Total · ${r.score}`, 66, ry + 30)

            drawRoundedRect(20 + teamsW - 56, ry + 8, 44, 20, 6, '#F8FAFC')
            ctx.fillStyle = '#334155'
            ctx.textAlign = 'center'
            ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Auto Sum', 20 + teamsW - 34, ry + 21)
        })

        ctx.save()
        ctx.translate(sc1BtnCX, sc1BtnCY)
        ctx.scale(btnSeedScale, btnSeedScale)
        ctx.translate(-sc1BtnCX, -sc1BtnCY)

        drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = isSeeded ? '#D9FF00' : '#FFFFFF'
        ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isSeeded ? '✔ Brackets Seeded Automatically' : 'Generate Elimination Brackets', sc1BtnCX, sc1BtnY + 28)
        ctx.restore()

        ctx.restore() // End Screen 2

        // ── SCREEN 3: WORLD ARCHERY BRACKETS ──
        ctx.save()
        ctx.translate(screenX - (screenSlideOffset - 2) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Matchplay Engine', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('WA Elimination Bracket', 20, 38)

        const bHeroW = screenW - 40
        const matches = [
            { archer1: 'Arif Dwi P. (1)', s1: '6', archer2: 'Hendra W. (8)', s2: '2', win: 1 },
            { archer1: 'Diananda C. (4)', s1: '7', archer2: 'Linda S. (5)', s2: '3', win: 1 },
            { archer1: 'Riau Ega A. (3)', s1: isBracketAdvanced ? '6' : '0', archer2: 'Bagas P. (6)', s2: isBracketAdvanced ? '4' : '0', win: isBracketAdvanced ? 1 : 0 }
        ]

        matches.forEach((m, idx) => {
            const my = 54 + idx * 86
            drawRoundedRect(20, my, bHeroW, 76, 12, '#FFFFFF', '#E2E8F0', 1.2)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(`Quarterfinal Match 0${idx + 1}`, 32, my + 18)

            ctx.fillStyle = m.win === 1 ? '#0F172A' : '#64748B'
            ctx.font = m.win === 1 ? '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif' : '500 11px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(m.archer1, 32, my + 40)

            drawRoundedRect(20 + bHeroW - 38, my + 26, 26, 20, 5, m.win === 1 ? '#D9FF00' : '#F1F5F9')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(m.s1, 20 + bHeroW - 25, my + 40)

            ctx.textAlign = 'left'
            ctx.fillStyle = m.win === 2 ? '#0F172A' : '#64748B'
            ctx.font = m.win === 2 ? '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif' : '500 11px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(m.archer2, 32, my + 64)

            drawRoundedRect(20 + bHeroW - 38, my + 50, 26, 20, 5, m.win === 2 ? '#D9FF00' : '#F1F5F9')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(m.s2, 20 + bHeroW - 25, my + 64)
        })

        ctx.save()
        ctx.translate(sc1BtnCX, sc1BtnCY)
        ctx.scale(btnBracketScale, btnBracketScale)
        ctx.translate(-sc1BtnCX, -sc1BtnCY)

        drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = isBracketAdvanced ? '#D9FF00' : '#FFFFFF'
        ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isBracketAdvanced ? '✔ Winners Advanced to Semifinals' : 'Advance Winners to Semifinals', sc1BtnCX, sc1BtnY + 28)
        ctx.restore()

        ctx.restore() // End Screen 3

        // ── SCREEN 4: BATCH E-CERTIFICATES ──
        ctx.save()
        ctx.translate(screenX - (screenSlideOffset - 3) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Official Accreditations', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Batch E-Certificates', 20, 38)

        const cHeroW = screenW - 40
        const cHeroH = 252
        drawRoundedRect(20, 54, cHeroW, cHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

        drawRoundedRect(34, 70, cHeroW - 28, 48, 10, '#0F172A')
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Official Certificate of Excellence', 48, 92)

        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('National Archery Championship 2026', 48, 108)

        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Awarded To:', 36, 144)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 15px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Arif Dwi Pangestu', 36, 166)

        ctx.fillStyle = '#0F172A'
        ctx.font = '600 11.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('1st Place · Gold Medalist (Recurve Men)', 36, 186)

        drawRoundedRect(34, 204, cHeroW - 28, 86, 10, '#F8FAFC', '#E2E8F0', 1)
        
        drawRoundedRect(46, 214, 46, 46, 6, '#FFFFFF', '#CBD5E1', 1)
        ctx.fillStyle = '#0F172A'
        ctx.fillRect(52, 220, 10, 10)
        ctx.fillRect(72, 220, 10, 10)
        ctx.fillRect(52, 240, 10, 10)
        ctx.fillRect(66, 234, 8, 8)
        ctx.fillRect(74, 242, 8, 8)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Cryptographically Verified', 104, 232)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Hash ID: #ARCH-2026-9921', 104, 248)
        ctx.fillText('Instant PDF & WhatsApp Dispatch', 104, 262)

        ctx.save()
        ctx.translate(sc1BtnCX, sc1BtnCY)
        ctx.scale(btnCertScale, btnCertScale)
        ctx.translate(-sc1BtnCX, -sc1BtnCY)

        drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = isCertIssued ? '#D9FF00' : '#FFFFFF'
        ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isCertIssued ? '✔ 160 Certificates Dispatched' : 'Issue & Distribute All Certificates', sc1BtnCX, sc1BtnY + 28)
        ctx.restore()

        ctx.restore() // End Screen 4

        ctx.restore() // End Screen Content Clip

        // ── Top Status Bar & Notch Overlays ──
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

        ctx.restore() // End Screen Glass Clip

        // ── Ripple & Mouse Cursor ──
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

        if (cursorVisible && cursorX > 0) {
            drawMouseCursor(cursorX, cursorY, cursorPressed)
        }

        ctx.restore() // End Camera Framing

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
