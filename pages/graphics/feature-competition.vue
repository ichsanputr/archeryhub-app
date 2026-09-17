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

    // ── Master 30.0-Second Seamless Loop (6 Modules x 5.0s, Matching Feature 01 Pacing) ──
    const CYCLE_DURATION = 30.0
    let startTime = null

    function renderFrame(now) {
        if (typeof window !== 'undefined' && window.__forcedTime !== undefined) {
            now = window.__forcedTime
            startTime = 0
            totalPausedDuration = 0
        }
        if (startTime === null) startTime = now
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

        // 2. Camera Framing & Timeline
        let phaseIndex = 0
        let camZoom = 1.00
        let camPanY = 0

        let isAllocated = false
        let btnAllocScale = 1.0
        let isQualLocked = false
        let btnQualScale = 1.0
        let isSeeded = false
        let btnSeedScale = 1.0
        let isBracketAdvanced = false
        let btnBracketScale = 1.0
        let isScoresheetOpen = false
        let isScoresheetPrinted = false
        let btnScoresheetScale = 1.0
        let isCertIssued = false
        let btnCertScale = 1.0
        let activeTargetIndex = 0
        let activeQualIndex = 0

        let cursorVisible = false
        let cursorX = 0, cursorY = 0
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        const STEP_TIME = 5.0

        // ── MODULE 1: TARGET ALLOCATION (0.0s - 5.0s) ──
        if (elapsed < STEP_TIME) {
            phaseIndex = 0
            if (elapsed < 1.4) {
                const zt = easeInOutCubic(elapsed / 1.4)
                camZoom = 1.00 + 0.44 * zt
                camPanY = -85 * zt
            } else {
                camZoom = 1.44
                camPanY = -85
            }

            const cardTarget02Y = 551
            const targetBtnY = 824

            activeTargetIndex = 0

            if (elapsed >= 0.8) {
                cursorVisible = true
                if (elapsed < 1.8) {
                    // Move cursor to Target 02 card
                    const mt = easeInOutCubic((elapsed - 0.8) / 1.0)
                    cursorX = 540
                    cursorY = 320 + (cardTarget02Y - 320) * mt
                } else if (elapsed < 2.3) {
                    // Tap on Target 02 card
                    cursorX = 540; cursorY = cardTarget02Y
                    cursorPressed = true
                    tapRipple = (elapsed - 1.8) / 0.5
                    tapX = 540; tapY = cardTarget02Y
                    activeTargetIndex = 1
                } else if (elapsed < 3.3) {
                    // Move cursor down to Auto-Allocate button
                    activeTargetIndex = 1
                    const bt = easeInOutCubic((elapsed - 2.3) / 1.0)
                    cursorX = 540
                    cursorY = cardTarget02Y + (targetBtnY - cardTarget02Y) * bt
                } else {
                    // Dock at Auto-Allocate button
                    activeTargetIndex = 1
                    cursorX = 540; cursorY = targetBtnY
                    if (elapsed >= 3.3) {
                        isAllocated = true
                        if (elapsed >= 3.3 && elapsed <= 3.85) {
                            cursorPressed = true
                            btnAllocScale = 0.94
                            tapRipple = (elapsed - 3.3) / 0.55
                            tapX = 540; tapY = targetBtnY
                        }
                    }
                }
            }
        }
        // ── MODULE 2: QUALIFICATION LEADERBOARD (5.0s - 10.0s) ──
        else if (elapsed < STEP_TIME * 2) {
            phaseIndex = 1
            isAllocated = true
            const step2Elapsed = elapsed - STEP_TIME

            if (step2Elapsed < 1.0) {
                const transT = easeInOutCubic(step2Elapsed / 1.0)
                camZoom = 1.44 + (1.35 - 1.44) * transT
                camPanY = -85 + (-40 - (-85)) * transT
            } else if (step2Elapsed < 2.6) {
                camZoom = 1.35; camPanY = -40
            } else if (step2Elapsed < 3.6) {
                const ct = easeInOutCubic((step2Elapsed - 2.6) / 1.0)
                camZoom = 1.35 + (1.44 - 1.35) * ct
                camPanY = -40 + (-85 - (-40)) * ct
            } else {
                camZoom = 1.44; camPanY = -85
            }

            const cardRiauEgaY = 540
            const targetBtnY = 824

            // Initial active card is 0 (Arif); after clicking Riau Ega at 1.8s, it switches to 1
            activeQualIndex = 0

            if (step2Elapsed >= 0.8) {
                cursorVisible = true
                if (step2Elapsed < 1.8) {
                    // Move cursor directly to Riau Ega Agatha's card (Rank 2)
                    const mt = easeInOutCubic((step2Elapsed - 0.8) / 1.0)
                    cursorX = 540
                    cursorY = 280 + (cardRiauEgaY - 280) * mt
                } else if (step2Elapsed < 2.3) {
                    // Tap on Riau Ega Agatha's card
                    cursorX = 540; cursorY = cardRiauEgaY
                    cursorPressed = true
                    tapRipple = (step2Elapsed - 1.8) / 0.5
                    tapX = 540; tapY = cardRiauEgaY
                    activeQualIndex = 1
                } else if (step2Elapsed < 3.3) {
                    // Move cursor down to Lock button
                    activeQualIndex = 1
                    const bt = easeInOutCubic((step2Elapsed - 2.3) / 1.0)
                    cursorX = 540
                    cursorY = cardRiauEgaY + (targetBtnY - cardRiauEgaY) * bt
                } else {
                    // Dock at Lock button
                    activeQualIndex = 1
                    cursorX = 540; cursorY = targetBtnY
                    if (step2Elapsed >= 3.3) {
                        isQualLocked = true
                        if (step2Elapsed >= 3.3 && step2Elapsed <= 3.85) {
                            cursorPressed = true
                            btnQualScale = 0.94
                            tapRipple = (step2Elapsed - 3.3) / 0.55
                            tapX = 540; tapY = targetBtnY
                        }
                    }
                }
            }
        }
        // ── MODULE 3: CLUB TEAM AUTO-SUM (10.0s - 15.0s) ──
        else if (elapsed < STEP_TIME * 3) {
            phaseIndex = 2
            isAllocated = true
            isQualLocked = true
            const step3Elapsed = elapsed - STEP_TIME * 2

            if (step3Elapsed < 1.0) {
                const transT = easeInOutCubic(step3Elapsed / 1.0)
                camZoom = 1.44 + (1.35 - 1.44) * transT
                camPanY = -85 + (-40 - (-85)) * transT
            } else if (step3Elapsed < 2.6) {
                camZoom = 1.35; camPanY = -40
            } else if (step3Elapsed < 3.6) {
                const ct = easeInOutCubic((step3Elapsed - 2.6) / 1.0)
                camZoom = 1.35 + (1.44 - 1.35) * ct
                camPanY = -40 + (-85 - (-40)) * ct
            } else {
                camZoom = 1.44; camPanY = -85
            }

            const targetBtnY = 824
            if (step3Elapsed >= 1.6) {
                cursorVisible = true
                if (step3Elapsed < 3.2) {
                    const mt = easeInOutCubic((step3Elapsed - 1.6) / 1.6)
                    cursorX = 540
                    cursorY = 520 + (targetBtnY - 520) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step3Elapsed >= 3.2) {
                    isSeeded = true
                    if (step3Elapsed >= 3.2 && step3Elapsed <= 3.75) {
                        cursorPressed = true
                        btnSeedScale = 0.94
                        tapRipple = (step3Elapsed - 3.2) / 0.55
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // ── MODULE 4: WORLD ARCHERY BRACKETS (15.0s - 20.0s) ──
        else if (elapsed < STEP_TIME * 4) {
            phaseIndex = 3
            isAllocated = true
            isQualLocked = true
            isSeeded = true
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

            const targetBtnY = 824
            if (step4Elapsed >= 1.6) {
                cursorVisible = true
                if (step4Elapsed < 3.2) {
                    const mt = easeInOutCubic((step4Elapsed - 1.6) / 1.6)
                    cursorX = 540
                    cursorY = 520 + (targetBtnY - 520) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step4Elapsed >= 3.2) {
                    isBracketAdvanced = true
                    if (step4Elapsed >= 3.2 && step4Elapsed <= 3.75) {
                        cursorPressed = true
                        btnBracketScale = 0.94
                        tapRipple = (step4Elapsed - 3.2) / 0.55
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // ── MODULE 5: OFFICIAL PRINTOUTS & SCORESHEET SUITE (20.0s - 25.0s) ──
        else if (elapsed < STEP_TIME * 5) {
            phaseIndex = 4
            isAllocated = true
            isQualLocked = true
            isSeeded = true
            isBracketAdvanced = true
            const step5Elapsed = elapsed - STEP_TIME * 4

            if (step5Elapsed < 1.0) {
                const transT = easeInOutCubic(step5Elapsed / 1.0)
                camZoom = 1.44 + (1.35 - 1.44) * transT
                camPanY = -85 + (-40 - (-85)) * transT
            } else if (step5Elapsed < 2.6) {
                camZoom = 1.35; camPanY = -40
            } else if (step5Elapsed < 3.6) {
                const ct = easeInOutCubic((step5Elapsed - 2.6) / 1.0)
                camZoom = 1.35 + (1.44 - 1.35) * ct
                camPanY = -40 + (-85 - (-40)) * ct
            } else {
                camZoom = 1.44; camPanY = -85
            }

            const docCardY = 418
            const targetBtnY = 824

            if (step5Elapsed >= 0.8) {
                cursorVisible = true
                if (step5Elapsed < 1.8) {
                    // Move cursor to Qualification Scoresheet Card
                    const mt = easeInOutCubic((step5Elapsed - 0.8) / 1.0)
                    cursorX = 540
                    cursorY = 260 + (docCardY - 260) * mt
                } else if (step5Elapsed < 2.3) {
                    // Tap to open Printable Scoresheet PDF
                    cursorX = 540; cursorY = docCardY
                    cursorPressed = true
                    tapRipple = (step5Elapsed - 1.8) / 0.5
                    tapX = 540; tapY = docCardY
                    isScoresheetOpen = true
                } else if (step5Elapsed < 3.3) {
                    // Move cursor down to Print PDF button
                    isScoresheetOpen = true
                    const bt = easeInOutCubic((step5Elapsed - 2.3) / 1.0)
                    cursorX = 540
                    cursorY = docCardY + (targetBtnY - docCardY) * bt
                } else {
                    // Dock at Print PDF button
                    isScoresheetOpen = true
                    cursorX = 540; cursorY = targetBtnY
                    if (step5Elapsed >= 3.3) {
                        isScoresheetPrinted = true
                        if (step5Elapsed >= 3.3 && step5Elapsed <= 3.85) {
                            cursorPressed = true
                            btnScoresheetScale = 0.94
                            tapRipple = (step5Elapsed - 3.3) / 0.55
                            tapX = 540; tapY = targetBtnY
                        }
                    }
                }
            }
        }
        // ── MODULE 6: OFFICIAL E-CERTIFICATE (25.0s - 30.0s) ──
        else {
            phaseIndex = 5
            isAllocated = true
            isQualLocked = true
            isSeeded = true
            isBracketAdvanced = true
            isScoresheetPrinted = true
            const step6Elapsed = elapsed - STEP_TIME * 5

            if (step6Elapsed < 1.0) {
                const transT = easeInOutCubic(step6Elapsed / 1.0)
                camZoom = 1.44 + (1.32 - 1.44) * transT
                camPanY = -85 + (-35 - (-85)) * transT
            } else if (step6Elapsed < 2.6) {
                camZoom = 1.32; camPanY = -35
            } else if (step6Elapsed < 3.6) {
                const ct = easeInOutCubic((step6Elapsed - 2.6) / 1.0)
                camZoom = 1.32 + (1.44 - 1.32) * ct
                camPanY = -35 + (-85 - (-35)) * ct
            } else {
                camZoom = 1.44; camPanY = -85
            }

            const targetBtnY = 824
            if (step6Elapsed >= 1.6) {
                cursorVisible = true
                if (step6Elapsed < 3.2) {
                    const mt = easeInOutCubic((step6Elapsed - 1.6) / 1.6)
                    cursorX = 540
                    cursorY = 520 + (targetBtnY - 520) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step6Elapsed >= 3.2) {
                    isCertIssued = true
                    if (step6Elapsed >= 3.2 && step6Elapsed <= 3.75) {
                        cursorPressed = true
                        btnCertScale = 0.94
                        tapRipple = (step6Elapsed - 3.2) / 0.55
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }

        // 3. Render Smartphone Chassis
        ctx.save()
        ctx.translate(540, 540 + camPanY)
        ctx.scale(camZoom, camZoom)
        ctx.translate(-540, -540)

        const phoneW = 370
        const phoneH = 760
        const phoneX = 540 - phoneW / 2
        const phoneY = 540 - phoneH / 2

        ctx.shadowColor = 'rgba(15, 23, 42, 0.16)'
        ctx.shadowBlur = 40
        ctx.shadowOffsetY = 24
        drawRoundedRect(phoneX, phoneY, phoneW, phoneH, 48, '#FFFFFF')
        ctx.shadowColor = 'transparent'

        drawRoundedRect(phoneX, phoneY, phoneW, phoneH, 48, '#FFFFFF', '#2D3139', 7)

        const screenW = 348
        const screenH = 738
        const screenX = 540 - screenW / 2
        const screenY = 540 - screenH / 2

        ctx.save()
        drawRoundedRect(screenX, screenY, screenW, screenH, 40)
        ctx.clip()

        ctx.fillStyle = '#F8FAFC'
        ctx.fillRect(screenX, screenY, screenW, screenH)

        // Clean app content area starting right below status bar (No generic top step header)
        const contentY = screenY + 44
        const contentH = screenH - 56

        ctx.save()
        ctx.beginPath()
        ctx.rect(screenX, contentY, screenW, contentH)
        ctx.clip()

        // Dock button at bottom
        const scBtnW = screenW - 32
        const scBtnH = 46
        const scBtnX = 16
        const scBtnY = 586
        const scBtnCX = scBtnX + scBtnW / 2
        const scBtnCY = scBtnY + scBtnH / 2

        // ══════════════════════════════════════════════════════════
        // MODULE 1: TARGET & LANE ALLOCATION
        // ══════════════════════════════════════════════════════════
        if (phaseIndex === 0) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Target Assignment', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target & Lane Setup', 16, 36)

            const tCardW = screenW - 32
            const targetCards = [
                {
                    no: 'Target 01',
                    category: 'Recurve Men 70m',
                    archers: [
                        { lane: '1A', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club' },
                        { lane: '1B', name: 'Riau Ega Agatha', club: 'Eagle Archery Club' },
                        { lane: '1C', name: 'Hendra Wijaya', club: 'Alpha Archery Team' },
                        { lane: '1D', name: 'Bagas Prastyo', club: 'Focus Target Team' }
                    ]
                },
                {
                    no: 'Target 02',
                    category: 'Recurve Men 70m',
                    archers: [
                        { lane: '2A', name: 'Diananda Choirunisa', club: 'Focus Archery Club' },
                        { lane: '2B', name: 'Linda Sartika', club: 'Eagle Archery Club' },
                        { lane: '2C', name: 'Kenzo Adhitama', club: 'Alpha Archery Team' },
                        { lane: '2D', name: 'Fajar Rahman', club: 'X-Ten Target Club' }
                    ]
                }
            ]

            targetCards.forEach((t, idx) => {
                const isTargetActive = (idx === activeTargetIndex)
                const isTargetAlloc = isAllocated
                const ty = 52 + idx * 260
                drawRoundedRect(16, ty, tCardW, 250, 12, '#FFFFFF', isTargetActive ? '#0F172A' : '#E2E8F0', isTargetActive ? 1.8 : 1.0)

                // Target Card Header
                drawRoundedRect(24, ty + 8, tCardW - 16, 32, 6, isTargetActive ? '#F8FAFC' : '#FFFFFF', '#E2E8F0', 0.8)
                drawTargetFace(40, ty + 24, 10)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(t.no, 58, ty + 28)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText('· ' + t.category, 122, ty + 28)

                // Status pill
                drawRoundedRect(16 + tCardW - 88, ty + 10, 76, 22, 5, isTargetAlloc ? (isTargetActive ? '#D9FF00' : '#0F172A') : '#F1F5F9')
                ctx.fillStyle = isTargetAlloc ? (isTargetActive ? '#0F172A' : '#D9FF00') : '#64748B'
                ctx.textAlign = 'center'
                ctx.font = '700 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(isTargetAlloc ? 'Assigned' : 'Unassigned', 16 + tCardW - 50, ty + 24)

                // 4 Lane Rows
                t.archers.forEach((a, aidx) => {
                    const ay = ty + 46 + aidx * 49
                    drawRoundedRect(24, ay, tCardW - 16, 44, 8, isTargetActive ? '#F8FAFC' : '#FFFFFF', isTargetActive ? '#CBD5E1' : '#E2E8F0', 0.8)

                    drawRoundedRect(28, ay + 6, 28, 32, 5, isTargetAlloc ? (isTargetActive ? '#0F172A' : '#1E293B') : '#F1F5F9')
                    ctx.fillStyle = isTargetAlloc ? (isTargetActive ? '#D9FF00' : '#94A3B8') : '#94A3B8'
                    ctx.textAlign = 'center'
                    ctx.font = '800 12px "Bricolage Grotesque", sans-serif'
                    ctx.fillText(a.lane, 42, ay + 26)

                    ctx.textAlign = 'left'
                    if (isTargetAlloc) {
                        ctx.fillStyle = '#0F172A'
                        ctx.font = '700 12px "NovaText", "Plus Jakarta Sans", sans-serif'
                        ctx.fillText(a.name, 64, ay + 19)

                        ctx.fillStyle = '#64748B'
                        ctx.font = '500 9.5px "NovaText", sans-serif'
                        ctx.fillText(a.club, 64, ay + 34)

                        ctx.textAlign = 'right'
                        ctx.fillStyle = isTargetActive ? '#059669' : '#64748B'
                        ctx.font = '700 9.5px "NovaText", sans-serif'
                        ctx.fillText('70m Lane', 16 + tCardW - 28, ay + 26)
                    } else {
                        ctx.fillStyle = '#94A3B8'
                        ctx.font = '600 12px "NovaText", "Plus Jakarta Sans", sans-serif'
                        ctx.fillText('Unassigned Lane', 64, ay + 19)

                        ctx.fillStyle = '#CBD5E1'
                        ctx.font = '500 9.5px "NovaText", sans-serif'
                        ctx.fillText('Tap or auto-assign from roster', 64, ay + 34)

                        ctx.textAlign = 'right'
                        ctx.fillStyle = '#94A3B8'
                        ctx.font = '600 9.5px "NovaText", sans-serif'
                        ctx.fillText('Pending', 16 + tCardW - 28, ay + 26)
                    }
                })
            })

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnAllocScale, btnAllocScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isAllocated ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isAllocated ? 'All 40 Target Lanes Assigned' : 'Auto-Assign Target Lanes', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // MODULE 2: LIVE QUALIFICATION SCORES
        // ══════════════════════════════════════════════════════════
        else if (phaseIndex === 1) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Qualification Session 1 · 72 Arrows', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Live Qualification Scores', 16, 36)

            const qStatW = (screenW - 38) / 3
            const stats = [
                { title: 'Division', val: 'Recurve Men' },
                { title: 'Live Archers', val: '160 Active' },
                { title: 'Avg Score', val: '9.32 / arrow' }
            ]
            stats.forEach((st, idx) => {
                const sx = 16 + idx * (qStatW + 3)
                drawRoundedRect(sx, 48, qStatW, 46, 8, '#FFFFFF', '#E2E8F0', 1)
                ctx.fillStyle = '#64748B'
                ctx.font = '500 8.5px "NovaText", sans-serif'
                ctx.fillText(st.title, sx + 8, 62)
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(st.val, sx + 8, 82)
            })

            const qualArchers = [
                { rank: '1', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club', ends: ['30', '29', '30', '29', '30', '29'], total: '684 pts', tens: '38 10s · 18 Xs' },
                { rank: '2', name: 'Riau Ega Agatha', club: 'Eagle Archery Club', ends: ['29', '30', '29', '29', '29', '29'], total: '678 pts', tens: '34 10s · 14 Xs' },
                { rank: '3', name: 'Diananda Choirunisa', club: 'Focus Archery Club', ends: ['29', '28', '30', '29', '29', '29'], total: '672 pts', tens: '31 10s · 12 Xs' }
            ]

            const qCardW = screenW - 32
            qualArchers.forEach((a, idx) => {
                const isActive = (idx === activeQualIndex)
                const ay = 104 + idx * 156
                drawRoundedRect(16, ay, qCardW, 146, 10, '#FFFFFF', isActive ? '#0F172A' : '#E2E8F0', isActive ? 1.8 : 1)

                // Rank Badge
                drawRoundedRect(24, ay + 10, 28, 28, 6, isActive ? '#D9FF00' : '#F1F5F9')
                ctx.fillStyle = isActive ? '#0F172A' : '#475569'
                ctx.textAlign = 'center'
                ctx.font = '800 13px "Bricolage Grotesque", sans-serif'
                ctx.fillText(a.rank, 38, ay + 28)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(a.name, 60, ay + 21)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9.5px "NovaText", sans-serif'
                ctx.fillText(a.club, 60, ay + 34)

                // Total Score Pill
                drawRoundedRect(16 + qCardW - 78, ay + 8, 68, 30, 6, isActive ? '#0F172A' : '#F1F5F9')
                ctx.fillStyle = isActive ? '#D9FF00' : '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '800 14px "Bricolage Grotesque", sans-serif'
                ctx.fillText(a.total, 16 + qCardW - 44, ay + 28)

                const endBoxW = (qCardW - 28) / 6
                a.ends.forEach((evalScore, eidx) => {
                    const ex = 22 + eidx * endBoxW
                    const ey = ay + 48
                    drawRoundedRect(ex, ey, endBoxW - 4, 46, 5, isActive ? '#FFFFFF' : '#F8FAFC', isActive ? '#CBD5E1' : '#E2E8F0', 0.8)

                    ctx.fillStyle = '#64748B'
                    ctx.font = '600 8.5px "NovaText", sans-serif'
                    ctx.fillText('E' + (eidx + 1), ex + (endBoxW - 4) / 2, ey + 15)

                    ctx.fillStyle = '#0F172A'
                    ctx.font = '700 13px "Bricolage Grotesque", sans-serif'
                    ctx.fillText(evalScore, ex + (endBoxW - 4) / 2, ey + 36)
                })

                ctx.textAlign = 'left'
                ctx.fillStyle = isActive ? '#0F172A' : '#64748B'
                ctx.font = isActive ? '600 9.5px "NovaText", sans-serif' : '500 9.5px "NovaText", sans-serif'
                ctx.fillText('Official Tiebreaker: ' + a.tens, 24, ay + 128)
            })

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnQualScale, btnQualScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isQualLocked ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isQualLocked ? 'Qualification Scores Saved' : 'Save Qualification Scores', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // MODULE 3: CLUB TEAM STANDINGS & AUTO-SUM (No Top/Bottom Banners)
        // ══════════════════════════════════════════════════════════
        else if (phaseIndex === 2) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Club Team Standings', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Club Team Scores', 16, 36)

            const tHeroW = screenW - 32
            const teamRows = [
                {
                    rank: '1',
                    name: 'Fast Archery Club',
                    archers: 'Arif (684) + Dimas (675) + Gilang (668)',
                    seed: 'Team Seed #1 · Gold Bracket Qualified',
                    total: '2,027 pts',
                    highlight: true
                },
                {
                    rank: '2',
                    name: 'Focus Archery Club',
                    archers: 'Diananda (672) + Hendra (662) + Bagas (656)',
                    seed: 'Team Seed #2 · Gold Bracket Qualified',
                    total: '1,990 pts',
                    highlight: false
                },
                {
                    rank: '3',
                    name: 'Eagle Archery Team',
                    archers: 'Riau Ega (678) + Linda (648) + Ryan (641)',
                    seed: 'Team Seed #3 · Bronze Bracket Qualified',
                    total: '1,967 pts',
                    highlight: false
                }
            ]

            teamRows.forEach((r, idx) => {
                const ry = 52 + idx * 174
                drawRoundedRect(16, ry, tHeroW, 164, 10, '#FFFFFF', r.highlight ? '#0F172A' : '#E2E8F0', r.highlight ? 1.5 : 1)

                drawRoundedRect(24, ry + 12, 28, 28, 6, r.highlight ? '#D9FF00' : '#F1F5F9')
                ctx.fillStyle = r.highlight ? '#0F172A' : '#475569'
                ctx.textAlign = 'center'
                ctx.font = '800 13px "Bricolage Grotesque", sans-serif'
                ctx.fillText(r.rank, 38, ry + 30)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 14px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(r.name, 60, ry + 24)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9.5px "NovaText", sans-serif'
                ctx.fillText('Top 3 Archers Total', 60, ry + 37)

                drawRoundedRect(16 + tHeroW - 84, ry + 10, 74, 30, 6, r.highlight ? '#0F172A' : '#F1F5F9')
                ctx.fillStyle = r.highlight ? '#D9FF00' : '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '800 13.5px "Bricolage Grotesque", sans-serif'
                ctx.fillText(r.total, 16 + tHeroW - 47, ry + 30)

                // Formula Breakdown Box
                drawRoundedRect(24, ry + 50, tHeroW - 24, 52, 6, '#F8FAFC', '#E2E8F0', 0.8)
                ctx.textAlign = 'left'
                ctx.fillStyle = '#64748B'
                ctx.font = '600 8.5px "NovaText", sans-serif'
                ctx.fillText('Top 3 Archers Scores:', 32, ry + 66)

                ctx.fillStyle = '#1E293B'
                ctx.font = '700 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(r.archers, 32, ry + 88)

                // Qualification Badge Tag
                drawRoundedRect(24, ry + 114, tHeroW - 24, 38, 6, '#F1F5F9', '#E2E8F0', 0.8)
                ctx.beginPath()
                ctx.arc(36, ry + 133, 4, 0, Math.PI * 2)
                ctx.fillStyle = r.highlight ? '#059669' : '#0284C7'
                ctx.fill()

                ctx.fillStyle = '#0F172A'
                ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(r.seed, 46, ry + 137)
            })

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnSeedScale, btnSeedScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isSeeded ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isSeeded ? 'Elimination Brackets Ready' : 'Create Elimination Brackets', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // MODULE 4: WORLD ARCHERY ELIMINATION MATCHPLAY
        // ══════════════════════════════════════════════════════════
        else if (phaseIndex === 3) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Matchplay Brackets', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Elimination Brackets', 16, 36)

            const treeW = screenW - 32
            const treeH = 524
            const treeY = 48
            drawRoundedRect(16, treeY, treeW, treeH, 12, '#FFFFFF', '#E2E8F0', 1.2)

            ctx.fillStyle = '#64748B'
            ctx.font = '700 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Semifinals (Top 4)', 26, treeY + 22)
            ctx.fillText('Medal Finals', 174, treeY + 22)

            // SF Match 1
            const sf1Y = treeY + 34
            drawRoundedRect(24, sf1Y, 130, 108, 8, '#F8FAFC', '#E2E8F0', 1)

            drawRoundedRect(30, sf1Y + 8, 96, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Semifinal 1 · Recurve', 34, sf1Y + 20)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('1 Arif Dwi P.', 32, sf1Y + 47)
            drawRoundedRect(126, sf1Y + 35, 22, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('6', 137, sf1Y + 48)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('4 Diananda C.', 32, sf1Y + 72)
            drawRoundedRect(126, sf1Y + 60, 22, 18, 4, '#E2E8F0')
            ctx.fillStyle = '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('4', 137, sf1Y + 73)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8px "NovaText", sans-serif'
            ctx.fillText('Sets: 29 · 28 · 30 · 29 · 30', 32, sf1Y + 95)

            // SF Match 2
            const sf2Y = treeY + 154
            drawRoundedRect(24, sf2Y, 130, 108, 8, '#F8FAFC', '#E2E8F0', 1)

            drawRoundedRect(30, sf2Y + 8, 96, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Semifinal 2 · Recurve', 34, sf2Y + 20)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('2 Riau Ega A.', 32, sf2Y + 47)
            drawRoundedRect(126, sf2Y + 35, 22, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('6', 137, sf2Y + 48)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('3 Kenzo A.', 32, sf2Y + 72)
            drawRoundedRect(126, sf2Y + 60, 22, 18, 4, '#E2E8F0')
            ctx.fillStyle = '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('2', 137, sf2Y + 73)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8px "NovaText", sans-serif'
            ctx.fillText('Sets: 28 · 29 · 29 · 28', 32, sf2Y + 95)

            // Connectors
            ctx.strokeStyle = '#0F172A'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(154, sf1Y + 54)
            ctx.lineTo(164, sf1Y + 54)
            ctx.lineTo(164, treeY + 90)
            ctx.lineTo(172, treeY + 90)

            ctx.moveTo(154, sf2Y + 54)
            ctx.lineTo(164, sf2Y + 54)
            ctx.lineTo(164, treeY + 90)
            ctx.stroke()

            // Gold Medal Match
            const goldY = treeY + 34
            const isGoldActive = isBracketAdvanced
            drawRoundedRect(172, goldY, 142, 118, 8, isGoldActive ? '#0F172A' : '#F8FAFC', isGoldActive ? '#D9FF00' : '#CBD5E1', isGoldActive ? 1.5 : 1)

            drawRoundedRect(178, goldY + 8, 92, 18, 4, isGoldActive ? '#D9FF00' : '#0F172A')
            ctx.fillStyle = isGoldActive ? '#0F172A' : '#D9FF00'
            ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Gold Medal Final', 184, goldY + 20)

            ctx.fillStyle = isGoldActive ? '#FFFFFF' : '#0F172A'
            ctx.font = '700 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('1 Arif Dwi P.', 180, goldY + 50)
            drawRoundedRect(286, goldY + 38, 22, 18, 4, isGoldActive ? '#D9FF00' : '#0F172A')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('6', 297, goldY + 51)

            ctx.textAlign = 'left'
            ctx.fillStyle = isGoldActive ? '#94A3B8' : '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('2 Riau Ega A.', 180, goldY + 75)
            drawRoundedRect(286, goldY + 63, 22, 18, 4, isGoldActive ? '#1E293B' : '#E2E8F0')
            ctx.fillStyle = isGoldActive ? '#94A3B8' : '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('4', 297, goldY + 76)

            ctx.textAlign = 'left'
            ctx.fillStyle = isGoldActive ? '#D9FF00' : '#64748B'
            ctx.font = '600 8.5px "NovaText", sans-serif'
            ctx.fillText(isGoldActive ? 'Gold Champion: Arif Dwi' : 'Awaiting Next Match', 180, goldY + 102)

            // Bronze Medal Match
            const bronzeY = treeY + 162
            drawRoundedRect(172, bronzeY, 142, 100, 8, '#F8FAFC', '#E2E8F0', 1)

            drawRoundedRect(178, bronzeY + 8, 98, 18, 4, '#F1F5F9')
            ctx.fillStyle = '#475569'
            ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Bronze Medal Final', 184, bronzeY + 20)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('4 Diananda C.', 180, bronzeY + 47)
            drawRoundedRect(286, bronzeY + 35, 22, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('7', 297, bronzeY + 48)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('3 Kenzo A.', 180, bronzeY + 70)
            drawRoundedRect(286, bronzeY + 58, 22, 18, 4, '#E2E8F0')
            ctx.fillStyle = '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('3', 297, bronzeY + 71)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8px "NovaText", sans-serif'
            ctx.fillText('Bronze Winner: Diananda', 180, bronzeY + 91)

            // Schedule Box
            const fopY = treeY + 274
            drawRoundedRect(24, fopY, treeW - 16, 236, 10, '#0F172A')

            drawRoundedRect(34, fopY + 12, treeW - 36, 28, 6, '#1E293B')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Match Schedule', 44, fopY + 30)

            const schedule = [
                { time: '14:00', match: 'Recurve Men Gold Final · Target 01', status: 'Completed' },
                { time: '14:30', match: 'Recurve Women Gold Final · Target 02', status: 'In Progress' },
                { time: '15:00', match: 'Compound Team Finals · Target 03', status: 'Upcoming' },
                { time: '15:45', match: 'Official Medal Awarding Ceremony', status: 'Scheduled' }
            ]

            schedule.forEach((sc, sidx) => {
                const scY = fopY + 48 + sidx * 44
                drawRoundedRect(34, scY, treeW - 36, 38, 6, '#1E293B')

                drawRoundedRect(40, scY + 8, 38, 22, 4, '#0F172A')
                ctx.fillStyle = '#94A3B8'
                ctx.textAlign = 'center'
                ctx.font = '700 9px "NovaText", sans-serif'
                ctx.fillText(sc.time, 59, scY + 22)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#FFFFFF'
                ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(sc.match, 86, scY + 22)

                drawRoundedRect(16 + treeW - 90, scY + 9, 56, 20, 4, sc.status === 'Completed' ? '#D9FF00' : '#334155')
                ctx.fillStyle = sc.status === 'Completed' ? '#0F172A' : '#94A3B8'
                ctx.textAlign = 'center'
                ctx.font = '700 8.5px "NovaText", sans-serif'
                ctx.fillText(sc.status, 16 + treeW - 62, scY + 22)
            })

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnBracketScale, btnBracketScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isBracketAdvanced ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isBracketAdvanced ? 'Finals Matchplay Ready' : 'Advance to Finals', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // MODULE 5: OFFICIAL PRINTOUTS & SCORESHEETS
        // ══════════════════════════════════════════════════════════
        else if (phaseIndex === 4) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Printable Forms & Sheets', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Scoresheets & Printouts', 16, 36)

            const docW = screenW - 32

            if (!isScoresheetOpen) {
                // Category Tabs Bar
                const docTabs = [
                    { name: 'All Documents (8)', active: true },
                    { name: 'Scoresheets', active: false },
                    { name: 'Start Lists', active: false }
                ]
                const tabW = (docW - 8) / 3
                docTabs.forEach((tb, tidx) => {
                    const tbx = 16 + tidx * (tabW + 4)
                    drawRoundedRect(tbx, 48, tabW, 32, 6, tb.active ? '#0F172A' : '#FFFFFF', tb.active ? null : '#E2E8F0', 1)
                    ctx.fillStyle = tb.active ? '#D9FF00' : '#64748B'
                    ctx.textAlign = 'center'
                    ctx.font = '700 9px "NovaText", sans-serif'
                    ctx.fillText(tb.name, tbx + tabW / 2, 68)
                })

                // 3 Document Cards
                const docs = [
                    {
                        title: 'WA Qualification Scoresheet',
                        desc: 'Official A4 scoresheet for scoring and signatures',
                        badge: 'Print-Ready PDF',
                        highlight: true
                    },
                    {
                        title: 'Target Butt Start List & Labels',
                        desc: 'Archer lane assignments 1A-1D and bow stand adhesive stickers',
                        badge: 'Ready to Print',
                        highlight: false
                    },
                    {
                        title: 'Elimination Bracket Poster',
                        desc: 'A3/A4 venue tree chart for notice board matchplay announcements',
                        badge: 'Ready to Print',
                        highlight: false
                    }
                ]

                docs.forEach((dc, didx) => {
                    const dy = 90 + didx * 160
                    drawRoundedRect(16, dy, docW, 148, 10, '#FFFFFF', dc.highlight ? '#0F172A' : '#E2E8F0', dc.highlight ? 1.8 : 1)

                    drawRoundedRect(24, dy + 10, 32, 32, 8, dc.highlight ? '#0F172A' : '#F1F5F9')
                    drawTargetFace(40, dy + 26, 9)

                    ctx.textAlign = 'left'
                    ctx.fillStyle = '#0F172A'
                    ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
                    ctx.fillText(dc.title, 64, dy + 24)

                    drawRoundedRect(16 + docW - 84, dy + 10, 74, 22, 5, dc.highlight ? '#D9FF00' : '#F1F5F9')
                    ctx.fillStyle = '#0F172A'
                    ctx.textAlign = 'center'
                    ctx.font = '700 8.5px "NovaText", sans-serif'
                    ctx.fillText(dc.badge, 16 + docW - 47, dy + 24)

                    ctx.textAlign = 'left'
                    ctx.fillStyle = '#64748B'
                    ctx.font = '500 9.5px "NovaText", sans-serif'
                    ctx.fillText(dc.desc, 24, dy + 62)

                    // Action buttons inside card
                    drawRoundedRect(24, dy + 92, docW - 16, 42, 6, dc.highlight ? '#0F172A' : '#F8FAFC', dc.highlight ? null : '#E2E8F0', 1)
                    ctx.fillStyle = dc.highlight ? '#D9FF00' : '#0F172A'
                    ctx.textAlign = 'center'
                    ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
                    ctx.fillText(dc.highlight ? 'Preview Printable Scoresheet' : 'Download PDF', 16 + docW / 2, dy + 118)
                })
            } else {
                // Printable WA Scoresheet Document Preview (Official Blank Printout Template)
                const sheetW = docW
                const sheetH = 524
                const sheetY = 48

                drawRoundedRect(16, sheetY, sheetW, sheetH, 10, '#FFFDF9', '#0F172A', 1.5)

                // Sheet Header
                drawRoundedRect(24, sheetY + 8, sheetW - 16, 44, 6, '#0F172A')
                drawTargetFace(42, sheetY + 30, 10)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('Official WA Qualification Scoresheet', 60, sheetY + 25)

                ctx.fillStyle = '#94A3B8'
                ctx.font = '500 9px "NovaText", sans-serif'
                ctx.fillText('Target 01-A · Recurve Men 70m · Session 1', 60, sheetY + 41)

                // Archer info bar
                drawRoundedRect(24, sheetY + 58, sheetW - 16, 36, 6, '#F8FAFC', '#E2E8F0', 0.8)
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 11px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText('Archer: Arif Dwi Pangestu', 32, sheetY + 74)
                ctx.fillStyle = '#64748B'
                ctx.font = '500 9px "NovaText", sans-serif'
                ctx.fillText('Club: Fast Archery Club · ID: AH-2026-9921', 32, sheetY + 87)

                // Target lane tag
                drawRoundedRect(16 + sheetW - 74, sheetY + 64, 58, 22, 4, '#0F172A')
                ctx.fillStyle = '#D9FF00'
                ctx.textAlign = 'center'
                ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
                ctx.fillText('Lane 1A', 16 + sheetW - 45, sheetY + 79)

                // Score Table (6 Ends x 3 Arrows - Blank Official Printable Grid)
                const tblY = sheetY + 100
                drawRoundedRect(24, tblY, sheetW - 16, 272, 6, '#FFFFFF', '#CBD5E1', 1)

                // Table Header
                drawRoundedRect(24, tblY, sheetW - 16, 26, 4, '#F1F5F9')
                ctx.fillStyle = '#475569'
                ctx.font = '700 8.5px "NovaText", sans-serif'
                ctx.textAlign = 'center'
                ctx.fillText('End', 40, tblY + 17)
                ctx.fillText('Arrow 1', 84, tblY + 17)
                ctx.fillText('Arrow 2', 114, tblY + 17)
                ctx.fillText('Arrow 3', 144, tblY + 17)
                ctx.fillText('Sum', 194, tblY + 17)
                ctx.fillText('Total', 238, tblY + 17)
                ctx.fillText('10+X', 282, tblY + 17)

                const blankEnds = ['1', '2', '3', '4', '5', '6']

                blankEnds.forEach((endNum, eidx) => {
                    const rowY = tblY + 28 + eidx * 33
                    drawRoundedRect(28, rowY, sheetW - 24, 29, 4, eidx % 2 === 0 ? '#FFFFFF' : '#F8FAFC')
                    
                    // End Number
                    ctx.fillStyle = '#0F172A'
                    ctx.textAlign = 'center'
                    ctx.font = '700 10px "NovaText", sans-serif'
                    ctx.fillText(endNum, 40, rowY + 19)

                    // 3 Blank Arrow Score Boxes (Empty ready for pen entry)
                    drawRoundedRect(72, rowY + 4, 24, 21, 4, '#FFFFFF', '#CBD5E1', 0.8)
                    drawRoundedRect(102, rowY + 4, 24, 21, 4, '#FFFFFF', '#CBD5E1', 0.8)
                    drawRoundedRect(132, rowY + 4, 24, 21, 4, '#FFFFFF', '#CBD5E1', 0.8)

                    // Sum, Total, 10+X Blank Boxes
                    drawRoundedRect(182, rowY + 4, 24, 21, 4, '#FFFFFF', '#CBD5E1', 0.8)
                    drawRoundedRect(226, rowY + 4, 24, 21, 4, '#FFFFFF', '#CBD5E1', 0.8)
                    drawRoundedRect(270, rowY + 4, 24, 21, 4, '#FFFFFF', '#CBD5E1', 0.8)
                })

                // Total Summary Row inside Table (Blank Template)
                const sumRowY = tblY + 228
                drawRoundedRect(28, sumRowY, sheetW - 24, 38, 4, '#0F172A')
                ctx.textAlign = 'left'
                ctx.fillStyle = '#D9FF00'
                ctx.font = '700 11px "Bricolage Grotesque", sans-serif'
                ctx.fillText('Grand Total (72 Arrows):', 36, sumRowY + 23)

                // Blank Total and 10+X Score Holders
                drawRoundedRect(16 + sheetW - 138, sumRowY + 7, 58, 24, 4, '#1E293B', '#D9FF00', 0.8)
                ctx.fillStyle = '#94A3B8'
                ctx.textAlign = 'center'
                ctx.font = '600 9px "NovaText", sans-serif'
                ctx.fillText('Score: ___', 16 + sheetW - 109, sumRowY + 22)

                drawRoundedRect(16 + sheetW - 74, sumRowY + 7, 54, 24, 4, '#1E293B', '#D9FF00', 0.8)
                ctx.fillStyle = '#94A3B8'
                ctx.fillText('10+X: __', 16 + sheetW - 47, sumRowY + 22)

                // Signatures & Scorekeeper Verification (Clean & Spacious)
                const sigBoxY = sheetY + 380
                drawRoundedRect(24, sigBoxY, sheetW - 16, 134, 6, '#F8FAFC', '#E2E8F0', 0.8)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#64748B'
                ctx.font = '700 8.5px "NovaText", sans-serif'
                ctx.fillText('SIGNATURES & VERIFICATION', 34, sigBoxY + 16)

                // Archer Signature Field
                ctx.fillStyle = '#475569'
                ctx.font = '600 8.5px "NovaText", sans-serif'
                ctx.fillText('Archer Signature:', 34, sigBoxY + 34)

                // Blank Signature Underline
                drawRoundedRect(34, sigBoxY + 54, 115, 1, 0, '#94A3B8')

                ctx.fillStyle = '#0F172A'
                ctx.font = '600 9px "NovaText", sans-serif'
                ctx.fillText('Arif Dwi Pangestu', 34, sigBoxY + 68)

                // Scorekeeper Signature Field
                const skX = 172
                ctx.fillStyle = '#475569'
                ctx.font = '600 8.5px "NovaText", sans-serif'
                ctx.fillText('Scorekeeper Signature:', skX, sigBoxY + 34)

                // Blank Signature Underline
                drawRoundedRect(skX, sigBoxY + 54, 115, 1, 0, '#94A3B8')

                ctx.fillStyle = '#0F172A'
                ctx.font = '600 9px "NovaText", sans-serif'
                ctx.fillText('Official Judge / Scorekeeper', skX, sigBoxY + 68)

                // Official World Archery Standard Notice (Replaces the scorecard audit banner)
                drawRoundedRect(32, sigBoxY + 84, sheetW - 32, 38, 4, '#FFFFFF', '#E2E8F0', 0.8)
                drawTargetFace(46, sigBoxY + 103, 8)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 9.5px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText('Official World Archery Scoresheet Template', 60, sigBoxY + 98)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 8px "NovaText", sans-serif'
                ctx.fillText('Official scoresheet signed after end 6', 60, sigBoxY + 112)
            }

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnScoresheetScale, btnScoresheetScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isScoresheetPrinted ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isScoresheetPrinted ? '160 Scoresheets Downloaded' : 'Download All Scoresheets (PDF)', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // MODULE 6: AWARDS & WINNER CERTIFICATES
        // ══════════════════════════════════════════════════════════
        else {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Awards & Certificates', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Winner Certificates', 16, 36)

            const certCardW = screenW - 32
            const certCardH = 524
            const certY = 48

            drawRoundedRect(16, certY, certCardW, certCardH, 12, '#FFFFFF', '#E2E8F0', 1.2)
            drawRoundedRect(24, certY + 8, certCardW - 16, certCardH - 16, 8, '#FFFDF7', '#D97706', 1.5)
            drawRoundedRect(28, certY + 12, certCardW - 24, certCardH - 24, 6, null, '#0F172A', 0.8)

            const crestCX = 16 + certCardW / 2
            const crestCY = certY + 40

            drawRoundedRect(crestCX - 22, crestCY - 14, 44, 28, 6, '#0F172A')
            drawTargetFace(crestCX, crestCY, 9)

            ctx.textAlign = 'center'
            ctx.fillStyle = '#D97706'
            ctx.font = '700 9.5px "NovaText", sans-serif'
            ctx.fillText('Federation of Archery Indonesia', crestCX, crestCY + 26)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 17px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Certificate of Excellence', crestCX, crestCY + 46)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('National Archery Championship 2026', crestCX, crestCY + 60)

            drawRoundedRect(36, crestCY + 74, certCardW - 40, 116, 8, '#F8FAFC', '#E2E8F0', 0.8)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 9px "NovaText", sans-serif'
            ctx.fillText('This Certificate is Awarded to:', crestCX, crestCY + 90)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 17px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Arif Dwi Pangestu', crestCX, crestCY + 116)

            drawRoundedRect(crestCX - 90, crestCY + 126, 180, 24, 12, '#D9FF00', '#0F172A', 1)
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 10px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('1st Place · Gold Medalist', crestCX, crestCY + 141)

            ctx.fillStyle = '#475569'
            ctx.font = '600 8.5px "NovaText", sans-serif'
            ctx.fillText('Recurve Men Individual 70m · Final Score: 684 pts', crestCX, crestCY + 172)

            // Redesigned Official Verification Stamp & Seal
            const sealCX = 68
            const sealCY = crestCY + 236

            ctx.save()
            ctx.translate(sealCX, sealCY)
            ctx.rotate(-0.12)

            // Ribbon tails
            ctx.beginPath()
            ctx.moveTo(-10, 12)
            ctx.lineTo(-16, 38)
            ctx.lineTo(-8, 32)
            ctx.lineTo(-2, 38)
            ctx.lineTo(-2, 12)
            ctx.fillStyle = '#DC2626'
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(10, 12)
            ctx.lineTo(16, 38)
            ctx.lineTo(8, 32)
            ctx.lineTo(2, 38)
            ctx.lineTo(2, 12)
            ctx.fillStyle = '#B91C1C'
            ctx.fill()

            // Gold Outer & Inner Seal
            ctx.beginPath()
            ctx.arc(0, 0, 22, 0, Math.PI * 2)
            ctx.fillStyle = '#F59E0B'
            ctx.fill()
            ctx.strokeStyle = '#D97706'
            ctx.lineWidth = 1.6
            ctx.stroke()

            ctx.beginPath()
            ctx.arc(0, 0, 18, 0, Math.PI * 2)
            ctx.strokeStyle = '#FFFFFF'
            ctx.lineWidth = 0.8
            ctx.stroke()

            drawTargetFace(0, 0, 12)

            ctx.restore()

            // Redesigned Calligraphic Handwritten Signatures
            // Signature 1: Ir. Bambang Triyono (Chief Judge)
            const sig1X = 132
            const sig1Y = crestCY + 212

            ctx.save()
            ctx.strokeStyle = '#0F172A'
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            // Main flourish
            ctx.lineWidth = 1.8
            ctx.beginPath()
            ctx.moveTo(sig1X, sig1Y + 24)
            ctx.bezierCurveTo(sig1X + 8, sig1Y - 4, sig1X + 18, sig1Y + 28, sig1X + 32, sig1Y + 8)
            ctx.bezierCurveTo(sig1X + 44, sig1Y - 2, sig1X + 52, sig1Y + 22, sig1X + 68, sig1Y + 6)
            ctx.stroke()

            // Calligraphy loop & underline sweep
            ctx.lineWidth = 1.2
            ctx.beginPath()
            ctx.moveTo(sig1X + 22, sig1Y + 12)
            ctx.bezierCurveTo(sig1X + 40, sig1Y + 30, sig1X + 60, sig1Y + 26, sig1X + 82, sig1Y + 16)
            ctx.moveTo(sig1X - 2, sig1Y + 28)
            ctx.bezierCurveTo(sig1X + 30, sig1Y + 30, sig1X + 65, sig1Y + 27, sig1X + 86, sig1Y + 28)
            ctx.stroke()
            ctx.restore()

            drawRoundedRect(sig1X - 2, sig1Y + 33, 90, 1, 0, '#CBD5E1')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Ir. Bambang Triyono', sig1X, sig1Y + 44)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 7.5px "NovaText", sans-serif'
            ctx.fillText('Chief Judge International', sig1X, sig1Y + 54)

            // Signature 2: Drs. Suryanto, M.Si. (Technical Delegate)
            const sig2X = sig1X + 104
            const sig2Y = sig1Y

            ctx.save()
            ctx.strokeStyle = '#0F172A'
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'

            // Executive loop & flourish
            ctx.lineWidth = 1.8
            ctx.beginPath()
            ctx.moveTo(sig2X, sig2Y + 22)
            ctx.bezierCurveTo(sig2X + 12, sig2Y - 2, sig2X + 20, sig2Y + 26, sig2X + 34, sig2Y + 4)
            ctx.bezierCurveTo(sig2X + 46, sig2Y - 4, sig2X + 56, sig2Y + 20, sig2X + 70, sig2Y + 10)
            ctx.stroke()

            // Swash underline
            ctx.lineWidth = 1.2
            ctx.beginPath()
            ctx.moveTo(sig2X + 8, sig2Y + 18)
            ctx.bezierCurveTo(sig2X + 30, sig2Y + 28, sig2X + 54, sig2Y + 22, sig2X + 74, sig2Y + 18)
            ctx.moveTo(sig2X - 2, sig2Y + 28)
            ctx.bezierCurveTo(sig2X + 24, sig2Y + 30, sig2X + 50, sig2Y + 27, sig2X + 76, sig2Y + 28)
            ctx.stroke()
            ctx.restore()

            drawRoundedRect(sig2X - 2, sig2Y + 33, 80, 1, 0, '#CBD5E1')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Drs. Suryanto, M.Si.', sig2X, sig2Y + 44)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 7.5px "NovaText", sans-serif'
            ctx.fillText('Technical Delegate', sig2X, sig2Y + 54)

            // Certificate Verification QR & Sending Notice
            const footY = crestCY + 300
            drawRoundedRect(36, footY, certCardW - 40, 80, 6, '#0F172A')

            drawRoundedRect(44, footY + 10, 60, 60, 4, '#FFFFFF')
            ctx.fillStyle = '#0F172A'
            ctx.fillRect(50, footY + 16, 14, 14)
            ctx.fillRect(82, footY + 16, 14, 14)
            ctx.fillRect(50, footY + 48, 14, 14)
            ctx.fillRect(74, footY + 38, 12, 12)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Official Verified Certificate', 114, footY + 26)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '500 8.5px "NovaText", sans-serif'
            ctx.fillText('Certificate ID: Arch-2026-Cert-9921-ID', 114, footY + 42)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8px "NovaText", sans-serif'
            ctx.fillText('Send via WhatsApp & Email to all 160 participants', 114, footY + 56)

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnCertScale, btnCertScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isCertIssued ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isCertIssued ? '160 Certificates Sent' : 'Send All 160 Certificates', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }

        ctx.restore() // Content clip

        // Top Status Bar
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

        // Cursor & Interactive Ripple
        if (tapRipple > 0 && tapRipple <= 1) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(tapX, tapY, tapRipple * 40, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(217, 255, 0, ${0.5 * (1 - tapRipple)})`
            ctx.fill()
            ctx.restore()
        }

        if (cursorVisible) {
            drawMouseCursor(cursorX, cursorY, cursorPressed)
        }

        ctx.restore() // Phone transform

        if (!isPaused.value) {
            animationFrameId = requestAnimationFrame(renderFrame)
        }
    }

    renderFrameFunc = renderFrame
    if (typeof window !== 'undefined') {
        window.__renderAtTime = (t) => {
            window.__forcedTime = t
            renderFrame(t)
        }
    }
    animationFrameId = requestAnimationFrame(renderFrame)
})

onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
    }
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
