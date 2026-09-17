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

    // Draw authentic World Archery circular Target Face
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
                ctx.lineWidth = 1
                ctx.stroke()
            }
        })
        // Inner X ring
        ctx.beginPath()
        ctx.arc(cx, cy, r * 0.08, 0, Math.PI * 2)
        ctx.strokeStyle = '#CA8A04'
        ctx.lineWidth = 0.8
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

        // 2. Timeline & Varied Camera Dynamics (Direct Action Entry)
        let phaseIndex = 0
        let camZoom = 1.36 // Starts in close-up action instead of distant 1.00x!
        let camPanY = -50

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

        // ── PHASE 1: TARGET BUTT MATRIX ALLOCATION (0.0s - 4.2s) ──
        if (elapsed < 4.2) {
            phaseIndex = 0
            if (elapsed < 1.2) {
                const zt = easeInOutCubic(elapsed / 1.2)
                camZoom = 1.36 + 0.10 * zt
                camPanY = -50 - 35 * zt
            } else {
                camZoom = 1.46
                camPanY = -85
            }

            const targetBtnY = 620
            if (elapsed >= 0.8) {
                cursorVisible = true
                if (elapsed < 2.2) {
                    const mt = easeInOutCubic((elapsed - 0.8) / 1.4)
                    cursorX = 540
                    cursorY = 690 + (targetBtnY - 690) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (elapsed >= 2.2) {
                    isAllocated = true
                    if (elapsed >= 2.2 && elapsed <= 2.65) {
                        cursorPressed = true
                        btnAllocScale = 0.94
                        tapRipple = (elapsed - 2.2) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // ── PHASE 2: LIVE INDIVIDUAL & TEAM AUTO-SUM (4.2s - 8.4s) ──
        else if (elapsed < 8.4) {
            phaseIndex = 1
            isAllocated = true
            const step2Elapsed = elapsed - 4.2

            if (step2Elapsed < 0.8) {
                const transT = easeInOutCubic(step2Elapsed / 0.8)
                camZoom = 1.46 + (1.34 - 1.46) * transT
                camPanY = -85 + (-40 - (-85)) * transT
            } else if (step2Elapsed < 2.0) {
                camZoom = 1.34; camPanY = -40
            } else if (step2Elapsed < 2.8) {
                const ct = easeInOutCubic((step2Elapsed - 2.0) / 0.8)
                camZoom = 1.34 + (1.46 - 1.34) * ct
                camPanY = -40 + (-85 - (-40)) * ct
            } else {
                camZoom = 1.46; camPanY = -85
            }

            const targetBtnY = 620
            if (step2Elapsed >= 1.2) {
                cursorVisible = true
                if (step2Elapsed < 2.4) {
                    const mt = easeInOutCubic((step2Elapsed - 1.2) / 1.2)
                    cursorX = 540
                    cursorY = 510 + (targetBtnY - 510) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step2Elapsed >= 2.4) {
                    isSeeded = true
                    if (step2Elapsed >= 2.4 && step2Elapsed <= 2.85) {
                        cursorPressed = true
                        btnSeedScale = 0.94
                        tapRipple = (step2Elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // ── PHASE 3: DENSE WORLD ARCHERY ELIMINATION TREE (8.4s - 12.6s) ──
        else if (elapsed < 12.6) {
            phaseIndex = 2
            isAllocated = true
            isSeeded = true
            const step3Elapsed = elapsed - 8.4

            if (step3Elapsed < 0.8) {
                const transT = easeInOutCubic(step3Elapsed / 0.8)
                camZoom = 1.46 + (1.30 - 1.46) * transT
                camPanY = -85 + (-25 - (-85)) * transT
            } else if (step3Elapsed < 1.8) {
                camZoom = 1.30; camPanY = -25
            } else if (step3Elapsed < 2.6) {
                const ct = easeInOutCubic((step3Elapsed - 1.8) / 0.8)
                camZoom = 1.30 + (1.46 - 1.30) * ct
                camPanY = -25 + (-85 - (-25)) * ct
            } else {
                camZoom = 1.46; camPanY = -85
            }

            const targetBtnY = 620
            if (step3Elapsed >= 1.4) {
                cursorVisible = true
                if (step3Elapsed < 2.6) {
                    const mt = easeInOutCubic((step3Elapsed - 1.4) / 1.2)
                    cursorX = 540
                    cursorY = 520 + (targetBtnY - 520) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step3Elapsed >= 2.6) {
                    isBracketAdvanced = true
                    if (step3Elapsed >= 2.6 && step3Elapsed <= 3.05) {
                        cursorPressed = true
                        btnBracketScale = 0.94
                        tapRipple = (step3Elapsed - 2.6) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // ── PHASE 4: PODIUM PROTOCOL & BATCH CERTIFICATES (12.6s - 16.0s) ──
        else if (elapsed < 16.0) {
            phaseIndex = 3
            isAllocated = true
            isSeeded = true
            isBracketAdvanced = true
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
                    isCertIssued = true
                    if (step4Elapsed >= 2.4 && step4Elapsed <= 2.85) {
                        cursorPressed = true
                        btnCertScale = 0.94
                        tapRipple = (step4Elapsed - 2.4) / 0.45
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // ── PHASE 5: CINEMATIC OVERVIEW & SEAMLESS RESET (16.0s - 17.0s) ──
        else {
            phaseIndex = 3
            isAllocated = true
            isSeeded = true
            isBracketAdvanced = true
            isCertIssued = true
            const finElapsed = elapsed - 16.0
            const finT = easeInOutCubic(finElapsed / 1.0)
            camZoom = 1.46 - (1.46 - 1.36) * finT
            camPanY = -85 + (-50 - (-85)) * finT
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

        // Command Header Indicator
        const headY = screenY + 46
        drawRoundedRect(screenX + 16, headY, screenW - 32, 34, 8, '#0F172A')
        ctx.textAlign = 'left'
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Tournament Operations Engine', screenX + 28, headY + 21)

        drawRoundedRect(screenX + screenW - 84, headY + 6, 56, 22, 5, '#1E293B')
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Step ' + (phaseIndex + 1) + '/4', screenX + screenW - 56, headY + 20)

        const contentY = headY + 42
        const contentH = screenH - (contentY - screenY) - 20

        ctx.save()
        ctx.beginPath()
        ctx.rect(screenX, contentY, screenW, contentH)
        ctx.clip()

        const sc1BtnY = 328
        const sc1BtnW = screenW - 40
        const sc1BtnH = 46
        const sc1BtnCX = 20 + sc1BtnW / 2
        const sc1BtnCY = sc1BtnY + sc1BtnH / 2

        // ══════════════════════════════════════════════════════════
        // SCENE 1: TARGET BUTT ALLOCATION (Dense Matrix with Target Faces)
        // ══════════════════════════════════════════════════════════
        if (phaseIndex === 0) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Lane Allocation Matrix', 20, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target Butt Allocation', 20, 36)

            const heroW = screenW - 40
            drawRoundedRect(20, 48, heroW, 56, 12, '#FFFFFF', '#E2E8F0', 1.2)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Recurve Men Open 70m', 32, 70)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('40 Targets · 160 Archers (4 / Target)', 32, 88)

            drawRoundedRect(20 + heroW - 74, 60, 62, 22, 6, '#F1F5F9')
            ctx.fillStyle = '#334155'
            ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Session 1', 20 + heroW - 68, 75)

            // Dense Target Cards with Real Target Faces
            const targets = [
                {
                    lane: 'Target 01',
                    archers: isAllocated 
                        ? ['A: Arif Dwi (Fast AC)', 'B: Riau Ega (Eagle AC)', 'C: Bagas P. (Focus)', 'D: Hendra W. (Alpha)'] 
                        : ['A: Unassigned', 'B: Unassigned', 'C: Unassigned', 'D: Unassigned']
                },
                {
                    lane: 'Target 02',
                    archers: isAllocated 
                        ? ['A: Diananda C. (Fast AC)', 'B: Rezza O. (Focus)', 'C: Linda S. (Eagle)', 'D: Nurul H. (Prime)'] 
                        : ['A: Unassigned', 'B: Unassigned', 'C: Unassigned', 'D: Unassigned']
                },
                {
                    lane: 'Target 03',
                    archers: isAllocated 
                        ? ['A: Fathur R. (Alpha)', 'B: Kenzo A. (Fast AC)', 'C: Dimas W. (Focus)', 'D: Gilang P. (Prime)'] 
                        : ['A: Unassigned', 'B: Unassigned', 'C: Unassigned', 'D: Unassigned']
                }
            ]

            targets.forEach((t, idx) => {
                const ty = 112 + idx * 68
                drawRoundedRect(20, ty, heroW, 62, 12, '#FFFFFF', '#E2E8F0', 1.2)

                // Target Face Circle
                drawTargetFace(46, ty + 31, 18)

                // Lane Badge
                drawRoundedRect(72, ty + 8, 62, 20, 5, '#0F172A')
                ctx.fillStyle = '#D9FF00'
                ctx.textAlign = 'center'
                ctx.font = '700 10px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(t.lane, 103, ty + 22)

                // 4 Archers 2x2 Grid inside the card
                ctx.textAlign = 'left'
                ctx.fillStyle = isAllocated ? '#0F172A' : '#94A3B8'
                ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(t.archers[0], 74, ty + 40)
                ctx.fillText(t.archers[1], 194, ty + 40)

                ctx.fillStyle = isAllocated ? '#64748B' : '#CBD5E1'
                ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(t.archers[2], 74, ty + 54)
                ctx.fillText(t.archers[3], 194, ty + 54)
            })

            ctx.save()
            ctx.translate(sc1BtnCX, sc1BtnCY)
            ctx.scale(btnAllocScale, btnAllocScale)
            ctx.translate(-sc1BtnCX, -sc1BtnCY)

            drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isAllocated ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isAllocated ? 'All 40 Target Lanes Allocated' : 'Auto-Allocate Target Lanes', sc1BtnCX, sc1BtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 2: LIVE QUALIFICATION & CLUB TEAM AUTO-SUM
        // ══════════════════════════════════════════════════════════
        else if (phaseIndex === 1) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Live Qualification Engine', 20, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Club Team Auto-Sum', 20, 36)

            const teamsW = screenW - 40
            drawRoundedRect(20, 48, teamsW, 268, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Header info box
            drawRoundedRect(34, 62, teamsW - 28, 48, 10, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Recurve Men Team (Top 3 Aggregate)', 48, 82)
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Live Auto-Sum from Individual Scores', 48, 98)

            // Teams Standings Table Rows
            const teamRows = [
                { rank: '1', name: 'Fast Archery Team', archers: 'Arif (684) + Riau (678) + Bagas (665)', total: '2,027', badge: '#D9FF00' },
                { rank: '2', name: 'Focus Archery Club', archers: 'Dian (670) + Hendra (662) + Ilham (658)', total: '1,990', badge: '#F1F5F9' },
                { rank: '3', name: 'X-Ten Target Club', archers: 'Fajar (664) + Dimas (655) + Ryan (648)', total: '1,967', badge: '#F1F5F9' },
            ]

            teamRows.forEach((r, idx) => {
                const ry = 118 + idx * 62
                drawRoundedRect(34, ry, teamsW - 28, 54, 8, '#F8FAFC', '#E2E8F0', 1)

                drawRoundedRect(44, ry + 12, 28, 28, 6, r.badge === '#D9FF00' ? '#0F172A' : '#E2E8F0')
                ctx.fillStyle = r.badge === '#D9FF00' ? '#D9FF00' : '#475569'
                ctx.textAlign = 'center'
                ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(r.rank, 58, ry + 30)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 12px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(r.name, 82, ry + 22)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(r.archers, 82, ry + 38)

                ctx.textAlign = 'right'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(r.total, 20 + teamsW - 40, ry + 24)
            })

            ctx.save()
            ctx.translate(sc1BtnCX, sc1BtnCY)
            ctx.scale(btnSeedScale, btnSeedScale)
            ctx.translate(-sc1BtnCX, -sc1BtnCY)

            drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isSeeded ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isSeeded ? 'Brackets Seeded Automatically' : 'Generate Elimination Brackets', sc1BtnCX, sc1BtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 3: DENSE WORLD ARCHERY ELIMINATION BRACKET TREE
        // ══════════════════════════════════════════════════════════
        else if (phaseIndex === 2) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Elimination Matchplay Engine', 20, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('World Archery Bracket Tree', 20, 36)

            const treeW = screenW - 36
            const treeH = 268
            const treeY = 48
            drawRoundedRect(18, treeY, treeW, treeH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Column 1: Semifinals Header
            ctx.fillStyle = '#64748B'
            ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Semifinals (Top 4)', 30, treeY + 18)

            // Column 2: Medal Finals Header
            ctx.fillText('Medal Finals', 176, treeY + 18)

            // ── SF Match 1 ──
            const sf1Y = treeY + 26
            drawRoundedRect(28, sf1Y, 126, 94, 8, '#F8FAFC', '#E2E8F0', 1)

            // SF 1 Pill Tag
            drawRoundedRect(34, sf1Y + 8, 80, 16, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 8px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('SF 1 · Recurve Men', 38, sf1Y + 19)

            // Archer 1 (Winner)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('1 Arif Dwi P.', 36, sf1Y + 42)
            drawRoundedRect(124, sf1Y + 31, 22, 16, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '800 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('6', 135, sf1Y + 43)

            // Archer 2
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('4 Diananda C.', 36, sf1Y + 62)
            drawRoundedRect(124, sf1Y + 51, 22, 16, 4, '#E2E8F0')
            ctx.fillStyle = '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9px "Bricolage Grotesque", sans-serif'
            ctx.fillText('4', 135, sf1Y + 63)

            // Sets indicator
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 7.5px "NovaText", sans-serif'
            ctx.fillText('Sets: 29 · 28 · 30 · 29 · 30', 36, sf1Y + 82)

            // ── SF Match 2 ──
            const sf2Y = treeY + 144
            drawRoundedRect(28, sf2Y, 126, 94, 8, '#F8FAFC', '#E2E8F0', 1)

            // SF 2 Pill Tag
            drawRoundedRect(34, sf2Y + 8, 80, 16, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 8px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('SF 2 · Recurve Men', 38, sf2Y + 19)

            // Archer 1 (Winner)
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('2 Riau Ega A.', 36, sf2Y + 42)
            drawRoundedRect(124, sf2Y + 31, 22, 16, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '800 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('6', 135, sf2Y + 43)

            // Archer 2
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('3 Kenzo A.', 36, sf2Y + 62)
            drawRoundedRect(124, sf2Y + 51, 22, 16, 4, '#E2E8F0')
            ctx.fillStyle = '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9px "Bricolage Grotesque", sans-serif'
            ctx.fillText('2', 135, sf2Y + 63)

            // Sets indicator
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 7.5px "NovaText", sans-serif'
            ctx.fillText('Sets: 28 · 29 · 29 · 28', 36, sf2Y + 82)

            // ── Orthogonal Branching Lines ──
            ctx.strokeStyle = '#0F172A'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            // SF1 to Gold Final
            ctx.moveTo(154, sf1Y + 47)
            ctx.lineTo(164, sf1Y + 47)
            ctx.lineTo(164, treeY + 77)
            ctx.lineTo(174, treeY + 77)

            // SF2 to Gold Final
            ctx.moveTo(154, sf2Y + 47)
            ctx.lineTo(164, sf2Y + 47)
            ctx.lineTo(164, treeY + 77)
            ctx.stroke()

            // ── Column 2: Gold Medal Final Match ──
            const goldY = treeY + 26
            const isGoldActive = isBracketAdvanced
            drawRoundedRect(174, goldY, 142, 104, 8, isGoldActive ? '#0F172A' : '#F8FAFC', isGoldActive ? '#D9FF00' : '#CBD5E1', isGoldActive ? 1.5 : 1)

            // Gold Header Pill
            drawRoundedRect(180, goldY + 8, 86, 16, 4, isGoldActive ? '#D9FF00' : '#0F172A')
            ctx.fillStyle = isGoldActive ? '#0F172A' : '#D9FF00'
            ctx.font = '700 8px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Gold Medal Final', 186, goldY + 19)

            // Gold Archer 1
            ctx.fillStyle = isGoldActive ? '#FFFFFF' : '#0F172A'
            ctx.font = '700 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('1 Arif Dwi P.', 182, goldY + 44)
            drawRoundedRect(286, goldY + 32, 22, 16, 4, isGoldActive ? '#D9FF00' : '#0F172A')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '800 10px "Bricolage Grotesque", sans-serif'
            ctx.fillText('6', 297, goldY + 44)

            // Gold Archer 2
            ctx.textAlign = 'left'
            ctx.fillStyle = isGoldActive ? '#94A3B8' : '#64748B'
            ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('2 Riau Ega A.', 182, goldY + 66)
            drawRoundedRect(286, goldY + 54, 22, 16, 4, isGoldActive ? '#1E293B' : '#E2E8F0')
            ctx.fillStyle = isGoldActive ? '#94A3B8' : '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9px "Bricolage Grotesque", sans-serif'
            ctx.fillText('4', 297, goldY + 66)

            // Gold Subtitle
            ctx.textAlign = 'left'
            ctx.fillStyle = isGoldActive ? '#D9FF00' : '#64748B'
            ctx.font = '600 7.5px "NovaText", sans-serif'
            ctx.fillText(isGoldActive ? 'Gold Medal Champion: Arif Dwi' : 'Awaiting Match Advance', 182, goldY + 88)

            // ── Bronze Medal Final Match ──
            const bronzeY = treeY + 144
            drawRoundedRect(174, bronzeY, 142, 94, 8, '#F8FAFC', '#E2E8F0', 1)

            // Bronze Header Pill
            drawRoundedRect(180, bronzeY + 8, 92, 16, 4, '#F1F5F9')
            ctx.fillStyle = '#475569'
            ctx.font = '700 8px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Bronze Medal Final', 186, bronzeY + 19)

            // Bronze Archer 1
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('4 Diananda C.', 182, bronzeY + 42)
            drawRoundedRect(286, bronzeY + 31, 22, 16, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '800 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('7', 297, bronzeY + 43)

            // Bronze Archer 2
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('3 Kenzo A.', 182, bronzeY + 62)
            drawRoundedRect(286, bronzeY + 51, 22, 16, 4, '#E2E8F0')
            ctx.fillStyle = '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9px "Bricolage Grotesque", sans-serif'
            ctx.fillText('3', 297, bronzeY + 63)

            // Bronze Subtitle
            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 7.5px "NovaText", sans-serif'
            ctx.fillText('Bronze Medal Winner: Diananda', 182, bronzeY + 82)

            ctx.save()
            ctx.translate(sc1BtnCX, sc1BtnCY)
            ctx.scale(btnBracketScale, btnBracketScale)
            ctx.translate(-sc1BtnCX, -sc1BtnCY)

            drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isBracketAdvanced ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isBracketAdvanced ? 'Winners Advanced to Finals' : 'Advance Semifinals to Finals', sc1BtnCX, sc1BtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // SCENE 4: PODIUM PROTOCOL & BATCH E-CERTIFICATES
        // ══════════════════════════════════════════════════════════
        else {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Official Accreditations & Podium', 20, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Batch E-Certificates', 20, 36)

            const cHeroW = screenW - 40
            const cHeroH = 268
            drawRoundedRect(20, 48, cHeroW, cHeroH, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Gold Header Banner
            drawRoundedRect(34, 62, cHeroW - 28, 48, 10, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Official Certificate of Excellence', 48, 84)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('National Archery Championship 2026', 48, 100)

            // Recipient Details
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Awarded To:', 36, 134)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Arif Dwi Pangestu', 36, 154)

            ctx.fillStyle = '#0F172A'
            ctx.font = '600 11.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('1st Place · Gold Medalist (Recurve Men)', 36, 174)

            // QR & Cryptographic Hash Box
            drawRoundedRect(34, 192, cHeroW - 28, 86, 10, '#F8FAFC', '#E2E8F0', 1)
            drawRoundedRect(46, 202, 46, 46, 6, '#FFFFFF', '#CBD5E1', 1)
            ctx.fillStyle = '#0F172A'
            ctx.fillRect(52, 208, 10, 10)
            ctx.fillRect(72, 208, 10, 10)
            ctx.fillRect(52, 228, 10, 10)
            ctx.fillRect(66, 222, 8, 8)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Cryptographically Verified', 104, 220)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Hash ID: #ARCH-2026-9921', 104, 236)
            ctx.fillText('Instant PDF & WhatsApp Dispatch', 104, 250)

            ctx.save()
            ctx.translate(sc1BtnCX, sc1BtnCY)
            ctx.scale(btnCertScale, btnCertScale)
            ctx.translate(-sc1BtnCX, -sc1BtnCY)

            drawRoundedRect(20, sc1BtnY, sc1BtnW, sc1BtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isCertIssued ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 12.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isCertIssued ? '160 Certificates Dispatched' : 'Issue & Distribute All Certificates', sc1BtnCX, sc1BtnY + 28)
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

        drawRoundedRect(540 - 55, screenY + screenH - 12, 110, 4, 2, '#CBD5E1')
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
