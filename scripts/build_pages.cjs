const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// 1. FEATURE 02: PRECISION OPERATIONS & LIVE MATCH ENGINE
// ═══════════════════════════════════════════════════════════════
const competitionCode = `<template>
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
            ctx.fillText(isAllocated ? \`A: \${t.a}\` : 'A: Unassigned', 100, ty + 24)

            ctx.fillStyle = isAllocated ? '#64748B' : '#CBD5E1'
            ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(isAllocated ? \`B: \${t.b}\` : 'B: Unassigned', 100, ty + 42)
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
            ctx.fillText(\`Top 3 Total · \${r.score}\`, 66, ry + 30)

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
            ctx.fillText(\`Quarterfinal Match 0\${idx + 1}\`, 32, my + 18)

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
            ctx.fillStyle = \`rgba(217, 255, 0, \${0.5 * (1 - tapRipple)})\`
            ctx.fill()
            ctx.strokeStyle = \`rgba(15, 23, 42, \${0.4 * (1 - tapRipple)})\`
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
`;

fs.writeFileSync(path.join(__dirname, '../pages/graphics/feature-competition.vue'), competitionCode, 'utf8');
console.log('feature-competition.vue generated');

// ═══════════════════════════════════════════════════════════════
// 2. FEATURE 03: DEDICATED ARCHER EXPERIENCE & DIGITAL PASS
// ═══════════════════════════════════════════════════════════════
const archerCode = `<template>
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

    // Preload Hero Banner
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

    // ── Master 17.0-Second Seamless Loop ──
    const CYCLE_DURATION = 17.0
    let startTime = null

    function renderFrame(now) {
        if (!startTime) startTime = now
        const effectiveNow = isPaused.value ? (pausedAt - totalPausedDuration) : (now - totalPausedDuration)
        const elapsed = ((effectiveNow - startTime) / 1000) % CYCLE_DURATION

        // ── 1. Stage Background (Warm Architectural Neutral) ──
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

        // ── 2. Timeline States & Camera Calculations ──
        let tabSliderPos = 0
        let screenSlideOffset = 0
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
            // ── STEP 1: DISCOVER & REGISTER (0.0s - 4.2s) ──
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
            // ── STEP 2: INSTANT QRIS CHECKOUT (4.2s - 8.4s) ──
            isRegistered = true
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
            // ── STEP 3: OFFICIAL DIGITAL ATHLETE PASS (8.4s - 12.6s) ──
            isRegistered = true
            isPaid = true
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
            // ── STEP 4: LIVE SCORECARD & CERTIFICATE (12.6s - 16.0s) ──
            isRegistered = true
            isPaid = true
            isCheckedIn = true
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
            // ── STEP 5: FINALE OVERVIEW & SEAMLESS RESET (16.0s - 17.0s) ──
            isRegistered = true
            isPaid = true
            isCheckedIn = true
            isDownloaded = true

            const finElapsed = elapsed - 16.0
            const finT = easeInOutCubic(finElapsed / 1.0)

            camZoom = 1.46 - (1.46 - 1.00) * finT
            camPanY = -85 * (1 - finT)
            tabSliderPos = 3 * (1 - finT)
            screenSlideOffset = 3 * (1 - finT)
            cursorVisible = false
        }

        // ── 3. Master Camera Transform ──
        ctx.save()
        ctx.translate(540, 540 + camPanY)
        ctx.scale(camZoom, camZoom)
        ctx.translate(-540, -540)

        // ── 4. Smartphone Chassis ──
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

        const tabLabels = ['Discover', 'Checkout', 'Pass', 'Scorecard']
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

        // ── SCREEN 1: DISCOVER TOURNAMENT ──
        ctx.save()
        ctx.translate(screenX - screenSlideOffset * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Archer Portal', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Discover Tournaments', 20, 38)

        const sc1CardW = screenW - 40
        const sc1CardY = 54
        const sc1CardH = 252
        drawRoundedRect(20, sc1CardY, sc1CardW, sc1CardH, 14, '#FFFFFF', '#E2E8F0', 1.2)

        const bannerH = 78
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

        drawRoundedRect(30, sc1CardY + 12, 64, 20, 6, '#D9FF00')
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('OPEN ENTRY', 36, sc1CardY + 26)
        ctx.restore()

        const cardTextY = sc1CardY + bannerH + 16
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('National Archery 2026', 32, cardTextY)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Senayan Stadium · 24-26 Oct', 32, cardTextY + 18)

        // Bento Info Row
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

        const sc1BtnY = 328
        const sc1BtnW = screenW - 40
        const sc1BtnH = 46
        const sc1BtnCX = 20 + sc1BtnW / 2
        const sc1BtnCY = sc1BtnY + sc1BtnH / 2

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

        ctx.restore() // End Screen 1

        // ── SCREEN 2: INSTANT QRIS CHECKOUT ──
        ctx.save()
        ctx.translate(screenX - (screenSlideOffset - 1) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Instant Checkout', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('QRIS Payment Gateway', 20, 38)

        const qHeroW = screenW - 40
        drawRoundedRect(20, 54, qHeroW, 252, 14, '#FFFFFF', '#E2E8F0', 1.2)

        // Total Amount Header
        drawRoundedRect(34, 68, qHeroW - 28, 48, 10, '#0F172A')
        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Total Amount to Pay', 48, 86)

        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 16px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Rp 350.000', 48, 106)

        // QRIS Code Mock Box
        const qrBoxY = 126
        drawRoundedRect(34, qrBoxY, qHeroW - 28, 164, 10, '#F8FAFC', '#E2E8F0', 1)

        drawRoundedRect(48, qrBoxY + 12, 60, 60, 8, '#FFFFFF', '#CBD5E1', 1)
        ctx.fillStyle = '#0F172A'
        ctx.fillRect(56, qrBoxY + 20, 14, 14)
        ctx.fillRect(82, qrBoxY + 20, 14, 14)
        ctx.fillRect(56, qrBoxY + 46, 14, 14)
        ctx.fillRect(76, qrBoxY + 38, 10, 10)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('QRIS Instant Settlement', 120, qrBoxY + 28)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('GOPAY · OVO · BCA · Mandiri', 120, qrBoxY + 44)
        ctx.fillText('Expires in: 14:59', 120, qrBoxY + 58)

        // Breakdown lines
        ctx.strokeStyle = '#E2E8F0'
        ctx.beginPath()
        ctx.moveTo(48, qrBoxY + 84)
        ctx.lineTo(20 + qHeroW - 28, qrBoxY + 84)
        ctx.stroke()

        ctx.fillStyle = '#64748B'
        ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Entry Fee (Recurve Men)', 48, qrBoxY + 106)
        ctx.fillText('Admin / Service Fee', 48, qrBoxY + 124)

        ctx.textAlign = 'right'
        ctx.fillStyle = '#0F172A'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Rp 350.000', 20 + qHeroW - 28, qrBoxY + 106)
        ctx.fillText('Free', 20 + qHeroW - 28, qrBoxY + 124)

        ctx.save()
        ctx.translate(sc1BtnCX, sc1BtnCY)
        ctx.scale(btnPayScale, btnPayScale)
        ctx.translate(-sc1BtnCX, -sc1BtnCY)

        drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = isPaid ? '#D9FF00' : '#FFFFFF'
        ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isPaid ? '✔ Payment Verified & Settled' : 'Confirm & Pay with QRIS', sc1BtnCX, sc1BtnY + 28)
        ctx.restore()

        ctx.restore() // End Screen 2

        // ── SCREEN 3: OFFICIAL DIGITAL ATHLETE PASS ──
        ctx.save()
        ctx.translate(screenX - (screenSlideOffset - 2) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Athlete Accreditation', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Official Digital Pass', 20, 38)

        const pHeroW = screenW - 40
        drawRoundedRect(20, 54, pHeroW, 252, 14, '#FFFFFF', '#E2E8F0', 1.2)

        // Pass Top Header
        drawRoundedRect(34, 68, pHeroW - 28, 42, 10, '#0F172A')
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('ARCHERIS ATHLETE PASS', 48, 86)
        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Verified Accreditation 2026', 48, 100)

        // Athlete Profile & Target Lane Bento
        const pMidY = 120
        ctx.fillStyle = '#0F172A'
        ctx.font = '700 14px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Arif Dwi Pangestu', 36, pMidY + 14)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Fast Archery Club · Recurve Men', 36, pMidY + 30)

        // Target Lane Highlight Box
        drawRoundedRect(34, pMidY + 42, pHeroW - 28, 62, 10, '#F8FAFC', '#E2E8F0', 1)

        ctx.fillStyle = '#64748B'
        ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('ASSIGNED TARGET', 48, pMidY + 62)

        ctx.fillStyle = '#0F172A'
        ctx.font = '800 22px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Target 04A', 48, pMidY + 90)

        drawRoundedRect(34 + pHeroW - 98, pMidY + 52, 62, 42, 8, '#D9FF00')
        ctx.fillStyle = '#0F172A'
        ctx.textAlign = 'center'
        ctx.font = '700 10px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('70 METERS', 34 + pHeroW - 67, pMidY + 70)
        ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Session 1', 34 + pHeroW - 67, pMidY + 84)

        // Venue Barcode
        ctx.textAlign = 'left'
        ctx.fillStyle = '#CBD5E1'
        for (let bx = 36; bx < 20 + pHeroW - 20; bx += 6) {
            ctx.fillRect(bx, 276, 3, 16)
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

        ctx.restore() // End Screen 3

        // ── SCREEN 4: LIVE SCORECARD & CERTIFICATE ──
        ctx.save()
        ctx.translate(screenX - (screenSlideOffset - 3) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Performance Record', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Live Scorecard & Rank', 20, 38)

        const sHeroW = screenW - 40
        drawRoundedRect(20, 54, sHeroW, 252, 14, '#FFFFFF', '#E2E8F0', 1.2)

        // Rank Hero Pill
        drawRoundedRect(34, 68, sHeroW - 28, 52, 10, '#0F172A')
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Rank #1 · Gold Medalist', 48, 90)

        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Qualification Total: 684 / 720 pts (38 10s · 18 Xs)', 48, 108)

        // End Progress Matrix
        const endY = 132
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

        // Certificate Ready Banner
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
            ctx.fillStyle = \`rgba(217, 255, 0, \${0.5 * (1 - tapRipple)})\`
            ctx.fill()
            ctx.strokeStyle = \`rgba(15, 23, 42, \${0.4 * (1 - tapRipple)})\`
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
`;

fs.writeFileSync(path.join(__dirname, '../pages/graphics/feature-archer.vue'), archerCode, 'utf8');
console.log('feature-archer.vue generated');

// ═══════════════════════════════════════════════════════════════
// 3. FEATURE 04: CERTIFIED PAPERLESS ON-FIELD SCORING
// ═══════════════════════════════════════════════════════════════
const scorekeeperCode = `<template>
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

    // ── Master 17.0-Second Seamless Loop ──
    const CYCLE_DURATION = 17.0
    let startTime = null

    function renderFrame(now) {
        if (!startTime) startTime = now
        const effectiveNow = isPaused.value ? (pausedAt - totalPausedDuration) : (now - totalPausedDuration)
        const elapsed = ((effectiveNow - startTime) / 1000) % CYCLE_DURATION

        // ── 1. Stage Background (Warm Architectural Neutral) ──
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

        // ── 2. Timeline States & Camera Calculations ──
        let tabSliderPos = 0
        let screenSlideOffset = 0
        let camZoom = 1.00
        let camPanY = 0

        let isRosterSelected = false
        let btnRosterScale = 1.0
        let isEndSubmitted = false
        let btnKeypadScale = 1.0
        let isStandingsAudited = false
        let btnAuditedScale = 1.0
        let isJudgeLocked = false
        let btnLockScale = 1.0

        let cursorVisible = false
        let cursorX = 0, cursorY = 0
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        if (elapsed < 4.2) {
            // ── STEP 1: TARGET 12 ROSTER (0.0s - 4.2s) ──
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
                    isRosterSelected = true
                    if (elapsed >= 2.4 && elapsed <= 2.85) {
                        cursorPressed = true
                        btnRosterScale = 0.94
                        tapRipple = (elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 8.4) {
            // ── STEP 2: ERGONOMIC KEYPAD ENTRY (4.2s - 8.4s) ──
            isRosterSelected = true
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
                    isEndSubmitted = true
                    if (step2Elapsed >= 2.5 && step2Elapsed <= 2.95) {
                        cursorPressed = true
                        btnKeypadScale = 0.94
                        tapRipple = (step2Elapsed - 2.5) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 12.6) {
            // ── STEP 3: CLOUD LEADERBOARD SYNC (8.4s - 12.6s) ──
            isRosterSelected = true
            isEndSubmitted = true
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
                    isStandingsAudited = true
                    if (step3Elapsed >= 2.8 && step3Elapsed <= 3.25) {
                        cursorPressed = true
                        btnAuditedScale = 0.94
                        tapRipple = (step3Elapsed - 2.8) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else if (elapsed < 16.0) {
            // ── STEP 4: ATHLETE SIGN & JUDGE LOCK (12.6s - 16.0s) ──
            isRosterSelected = true
            isEndSubmitted = true
            isStandingsAudited = true
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
                    isJudgeLocked = true
                    if (step4Elapsed >= 2.4 && step4Elapsed <= 2.85) {
                        cursorPressed = true
                        btnLockScale = 0.94
                        tapRipple = (step4Elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        } else {
            // ── STEP 5: FINALE OVERVIEW & SEAMLESS RESET (16.0s - 17.0s) ──
            isRosterSelected = true
            isEndSubmitted = true
            isStandingsAudited = true
            isJudgeLocked = true

            const finElapsed = elapsed - 16.0
            const finT = easeInOutCubic(finElapsed / 1.0)

            camZoom = 1.46 - (1.46 - 1.00) * finT
            camPanY = -85 * (1 - finT)
            tabSliderPos = 3 * (1 - finT)
            screenSlideOffset = 3 * (1 - finT)
            cursorVisible = false
        }

        // ── 3. Master Camera Transform ──
        ctx.save()
        ctx.translate(540, 540 + camPanY)
        ctx.scale(camZoom, camZoom)
        ctx.translate(-540, -540)

        // ── 4. Smartphone Chassis ──
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

        const tabLabels = ['Roster', 'Keypad', 'Standings', 'Sign & Lock']
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

        // ── SCREEN 1: TARGET 12 ROSTER ──
        ctx.save()
        ctx.translate(screenX - screenSlideOffset * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Scorekeeper Field App', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Target 12 Roster', 20, 38)

        const rHeroW = screenW - 40
        const rHeroY = 54
        drawRoundedRect(20, rHeroY, rHeroW, 58, 14, '#FFFFFF', '#E2E8F0', 1.2)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Target 12 · Recurve Men', 34, rHeroY + 24)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Qualification Round · End 1 / 12', 34, rHeroY + 42)

        drawRoundedRect(20 + rHeroW - 68, rHeroY + 16, 54, 24, 6, '#0F172A')
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 10px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('70M', 20 + rHeroW - 52, rHeroY + 32)

        const lanes = [
            { lane: '12A', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club', active: true },
            { lane: '12B', name: 'Riau Ega Agatha', club: 'Eagle Archery Club', active: false },
            { lane: '12C', name: 'Bagas Prastyo', club: 'Focus Target Team', active: false },
            { lane: '12D', name: 'Hendra Wijaya', club: 'Alpha Archery Team', active: false }
        ]

        lanes.forEach((l, idx) => {
            const ly = rHeroY + 68 + idx * 48
            drawRoundedRect(20, ly, rHeroW, 42, 10, '#FFFFFF', l.active ? '#0F172A' : '#E2E8F0', l.active ? 1.5 : 1)

            drawRoundedRect(28, ly + 9, 32, 24, 6, l.active ? '#D9FF00' : '#F1F5F9')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(l.lane, 44, ly + 25)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(l.name, 68, ly + 18)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(l.club, 68, ly + 32)

            drawRoundedRect(20 + rHeroW - 52, ly + 11, 42, 20, 5, l.active ? '#0F172A' : '#F8FAFC')
            ctx.fillStyle = l.active ? '#D9FF00' : '#94A3B8'
            ctx.textAlign = 'center'
            ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(l.active ? 'Ready' : 'Pending', 20 + rHeroW - 31, ly + 24)
        })

        const sc1BtnY = 328
        const sc1BtnW = screenW - 40
        const sc1BtnH = 46
        const sc1BtnCX = 20 + sc1BtnW / 2
        const sc1BtnCY = sc1BtnY + sc1BtnH / 2

        ctx.save()
        ctx.translate(sc1BtnCX, sc1BtnCY)
        ctx.scale(btnRosterScale, btnRosterScale)
        ctx.translate(-sc1BtnCX, -sc1BtnCY)

        drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = isRosterSelected ? '#D9FF00' : '#FFFFFF'
        ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isRosterSelected ? '✔ Target 12A Selected' : 'Input Scores for End 1', sc1BtnCX, sc1BtnY + 28)
        ctx.restore()

        ctx.restore() // End Screen 1

        // ── SCREEN 2: ERGONOMIC KEYPAD ENTRY ──
        ctx.save()
        ctx.translate(screenX - (screenSlideOffset - 1) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Field Scoring Entry', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Target 12A · End 1', 20, 38)

        const kHeroW = screenW - 40
        drawRoundedRect(20, 54, kHeroW, 252, 14, '#FFFFFF', '#E2E8F0', 1.2)

        // Arrow Slots
        const arrowSlotsY = 66
        drawRoundedRect(32, arrowSlotsY, kHeroW - 24, 52, 10, '#0F172A')

        const arrows = [
            { label: 'Arrow 1', val: isEndSubmitted ? 'X' : 'X', fill: '#D9FF00' },
            { label: 'Arrow 2', val: isEndSubmitted ? '10' : '10', fill: '#D9FF00' },
            { label: 'Arrow 3', val: isEndSubmitted ? '10' : '10', fill: '#D9FF00' }
        ]

        arrows.forEach((a, idx) => {
            const ax = 42 + idx * 56
            drawRoundedRect(ax, arrowSlotsY + 10, 48, 32, 8, a.fill)
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(a.val, ax + 24, arrowSlotsY + 31)
        })

        // End Total
        ctx.textAlign = 'right'
        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('End Total', 20 + kHeroW - 20, arrowSlotsY + 24)

        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 15px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('30 / 30', 20 + kHeroW - 20, arrowSlotsY + 44)

        // 8-Key WA Dial Grid
        const gridY = arrowSlotsY + 62
        const keys = [
            { k: 'X', bg: '#FEF08A', fg: '#713F12' },
            { k: '10', bg: '#FEF08A', fg: '#713F12' },
            { k: '9', bg: '#FEF08A', fg: '#713F12' },
            { k: '8', bg: '#FECACA', fg: '#7F1D1D' },
            { k: '7', bg: '#FECACA', fg: '#7F1D1D' },
            { k: '6', bg: '#BFDBFE', fg: '#1E3A8A' },
            { k: '5', bg: '#BFDBFE', fg: '#1E3A8A' },
            { k: 'M', bg: '#CBD5E1', fg: '#0F172A' }
        ]

        keys.forEach((key, idx) => {
            const row = Math.floor(idx / 4)
            const col = idx % 4
            const kx = 32 + col * (kHeroW - 24) / 4
            const ky = gridY + row * 54
            const kw = (kHeroW - 36) / 4

            drawRoundedRect(kx, ky, kw, 46, 8, key.bg, '#E2E8F0', 1)
            ctx.fillStyle = key.fg
            ctx.textAlign = 'center'
            ctx.font = '800 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(key.k, kx + kw / 2, ky + 29)
        })

        ctx.save()
        ctx.translate(sc1BtnCX, sc1BtnCY)
        ctx.scale(btnKeypadScale, btnKeypadScale)
        ctx.translate(-sc1BtnCX, -sc1BtnCY)

        drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = isEndSubmitted ? '#D9FF00' : '#FFFFFF'
        ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isEndSubmitted ? '✔ End 1 Synced to Cloud' : 'Submit End 1 Scores', sc1BtnCX, sc1BtnY + 28)
        ctx.restore()

        ctx.restore() // End Screen 2

        // ── SCREEN 3: CLOUD LEADERBOARD SYNC ──
        ctx.save()
        ctx.translate(screenX - (screenSlideOffset - 2) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Live Cloud Sync', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Target Leaderboard', 20, 38)

        const sHeroW = screenW - 40
        drawRoundedRect(20, 54, sHeroW, 252, 14, '#FFFFFF', '#E2E8F0', 1.2)

        // Live Sync Status
        drawRoundedRect(34, 68, sHeroW - 28, 38, 8, '#0F172A')
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('● LIVE SYNC ACTIVE', 48, 88)

        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Latency: 12ms · Cloud Engine', 48, 100)

        // Target Standings Table
        const stRows = [
            { rank: '1', lane: '12A Arif Dwi', score: '30 pts (2X, 10)', gold: true },
            { rank: '2', lane: '12B Riau Ega', score: '29 pts (1X, 10, 9)', gold: false },
            { rank: '3', lane: '12C Bagas P.', score: '28 pts (10, 9, 9)', gold: false },
            { rank: '4', lane: '12D Hendra W.', score: '27 pts (9, 9, 9)', gold: false }
        ]

        stRows.forEach((r, idx) => {
            const ry = 118 + idx * 44
            drawRoundedRect(34, ry, sHeroW - 28, 38, 8, '#F8FAFC', '#E2E8F0', 1)

            drawRoundedRect(42, ry + 7, 24, 24, 6, r.gold ? '#D9FF00' : '#F1F5F9')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(r.rank, 54, ry + 23)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(r.lane, 74, ry + 16)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText(r.score, 74, ry + 30)
        })

        ctx.save()
        ctx.translate(sc1BtnCX, sc1BtnCY)
        ctx.scale(btnAuditedScale, btnAuditedScale)
        ctx.translate(-sc1BtnCX, -sc1BtnCY)

        drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = isStandingsAudited ? '#D9FF00' : '#FFFFFF'
        ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isStandingsAudited ? '✔ Standings Verified' : 'Proceed to Athlete Signatures', sc1BtnCX, sc1BtnY + 28)
        ctx.restore()

        ctx.restore() // End Screen 3

        // ── SCREEN 4: ATHLETE SIGN & JUDGE LOCK ──
        ctx.save()
        ctx.translate(screenX - (screenSlideOffset - 3) * layerW, contentY)

        ctx.textAlign = 'left'
        ctx.fillStyle = '#64748B'
        ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Official Score Audit', 20, 16)

        ctx.fillStyle = '#0F172A'
        ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Athlete Sign & Lock', 20, 38)

        const lHeroW = screenW - 40
        drawRoundedRect(20, 54, lHeroW, 252, 14, '#FFFFFF', '#E2E8F0', 1.2)

        // Archer Audit Box
        drawRoundedRect(34, 68, lHeroW - 28, 48, 10, '#0F172A')
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Target 12A · Arif Dwi Pangestu', 48, 88)

        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Official Final Qualification Score: 684 pts', 48, 104)

        // Signature Canvas Box
        const sigY = 126
        drawRoundedRect(34, sigY, lHeroW - 28, 76, 10, '#F8FAFC', '#E2E8F0', 1)

        ctx.fillStyle = '#64748B'
        ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('ATHLETE DIGITAL SIGNATURE', 46, sigY + 18)

        // Realistic Drawn Signature
        ctx.strokeStyle = '#0F172A'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(56, sigY + 54)
        ctx.bezierCurveTo(72, sigY + 32, 88, sigY + 68, 110, sigY + 42)
        ctx.bezierCurveTo(124, sigY + 28, 140, sigY + 58, 168, sigY + 48)
        ctx.stroke()

        // Judge Seal
        drawRoundedRect(34, sigY + 84, lHeroW - 28, 38, 8, isJudgeLocked ? '#0F172A' : '#F1F5F9')
        ctx.fillStyle = isJudgeLocked ? '#D9FF00' : '#334155'
        ctx.font = '700 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isJudgeLocked ? '🔒 SEALED & LOCKED BY CHIEF JUDGE' : 'Awaiting Chief Judge Seal', 48, sigY + 107)

        ctx.save()
        ctx.translate(sc1BtnCX, sc1BtnCY)
        ctx.scale(btnLockScale, btnLockScale)
        ctx.translate(-sc1BtnCX, -sc1BtnCY)

        drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
        ctx.textAlign = 'center'
        ctx.fillStyle = isJudgeLocked ? '#D9FF00' : '#FFFFFF'
        ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText(isJudgeLocked ? '🔒 Scores Officially Sealed & Locked' : 'Lock & Seal Target 12 Scores', sc1BtnCX, sc1BtnY + 28)
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
            ctx.fillStyle = \`rgba(217, 255, 0, \${0.5 * (1 - tapRipple)})\`
            ctx.fill()
            ctx.strokeStyle = \`rgba(15, 23, 42, \${0.4 * (1 - tapRipple)})\`
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
`;

fs.writeFileSync(path.join(__dirname, '../pages/graphics/feature-scorekeeper.vue'), scorekeeperCode, 'utf8');
console.log('feature-scorekeeper.vue generated');

