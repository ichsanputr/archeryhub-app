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

    // ── Master 25.0-Second Seamless Loop (5 Steps x 5.0s, Matching Feature 01 Pacing) ──
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
        let isCertIssued = false
        let btnCertScale = 1.0

        let cursorVisible = false
        let cursorX = 0, cursorY = 0
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        const STEP_TIME = 5.0

        // ── STEP 1: TARGET ALLOCATION (0.0s - 5.0s) ──
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

            const targetBtnY = 628
            if (elapsed >= 1.6) {
                cursorVisible = true
                if (elapsed < 3.2) {
                    const mt = easeInOutCubic((elapsed - 1.6) / 1.6)
                    cursorX = 540
                    cursorY = 720 + (targetBtnY - 720) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (elapsed >= 3.2) {
                    isAllocated = true
                    if (elapsed >= 3.2 && elapsed <= 3.75) {
                        cursorPressed = true
                        btnAllocScale = 0.94
                        tapRipple = (elapsed - 3.2) / 0.55
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // ── STEP 2: QUALIFICATION LEADERBOARD (5.0s - 10.0s) ──
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

            const targetBtnY = 628
            if (step2Elapsed >= 1.6) {
                cursorVisible = true
                if (step2Elapsed < 3.2) {
                    const mt = easeInOutCubic((step2Elapsed - 1.6) / 1.6)
                    cursorX = 540
                    cursorY = 520 + (targetBtnY - 520) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step2Elapsed >= 3.2) {
                    isQualLocked = true
                    if (step2Elapsed >= 3.2 && step2Elapsed <= 3.75) {
                        cursorPressed = true
                        btnQualScale = 0.94
                        tapRipple = (step2Elapsed - 3.2) / 0.55
                        tapX = 540; tapY = targetBtnY
                    }
                }
            }
        }
        // ── STEP 3: CLUB TEAM AUTO-SUM (10.0s - 15.0s) ──
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

            const targetBtnY = 628
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
        // ── STEP 4: WORLD ARCHERY BRACKETS (15.0s - 20.0s) ──
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

            const targetBtnY = 628
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
        // ── STEP 5: E-CERTIFICATE (20.0s - 25.0s) ──
        else {
            phaseIndex = 4
            isAllocated = true
            isQualLocked = true
            isSeeded = true
            isBracketAdvanced = true
            const step5Elapsed = elapsed - STEP_TIME * 4

            if (step5Elapsed < 1.0) {
                const transT = easeInOutCubic(step5Elapsed / 1.0)
                camZoom = 1.44 + (1.32 - 1.44) * transT
                camPanY = -85 + (-35 - (-85)) * transT
            } else if (step5Elapsed < 2.6) {
                camZoom = 1.32; camPanY = -35
            } else if (step5Elapsed < 3.6) {
                const ct = easeInOutCubic((step5Elapsed - 2.6) / 1.0)
                camZoom = 1.32 + (1.44 - 1.32) * ct
                camPanY = -35 + (-85 - (-35)) * ct
            } else {
                camZoom = 1.44; camPanY = -85
            }

            const targetBtnY = 628
            if (step5Elapsed >= 1.6) {
                cursorVisible = true
                if (step5Elapsed < 3.2) {
                    const mt = easeInOutCubic((step5Elapsed - 1.6) / 1.6)
                    cursorX = 540
                    cursorY = 520 + (targetBtnY - 520) * mt
                } else {
                    cursorX = 540; cursorY = targetBtnY
                }

                if (step5Elapsed >= 3.2) {
                    isCertIssued = true
                    if (step5Elapsed >= 3.2 && step5Elapsed <= 3.75) {
                        cursorPressed = true
                        btnCertScale = 0.94
                        tapRipple = (step5Elapsed - 3.2) / 0.55
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

        // Top Header
        const headY = screenY + 44
        drawRoundedRect(screenX + 16, headY, screenW - 32, 34, 8, '#0F172A')
        ctx.textAlign = 'left'
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('Tournament Operations Engine', screenX + 28, headY + 21)

        drawRoundedRect(screenX + screenW - 84, headY + 6, 56, 22, 5, '#1E293B')
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('Step ' + (phaseIndex + 1) + '/5', screenX + screenW - 56, headY + 20)

        const contentY = headY + 40
        const contentH = screenH - (contentY - screenY) - 16

        ctx.save()
        ctx.beginPath()
        ctx.rect(screenX, contentY, screenW, contentH)
        ctx.clip()

        // Dock button at bottom cleanly
        const scBtnW = screenW - 32
        const scBtnH = 46
        const scBtnX = 16
        const scBtnY = 552
        const scBtnCX = scBtnX + scBtnW / 2
        const scBtnCY = scBtnY + scBtnH / 2

        // ══════════════════════════════════════════════════════════
        // STEP 1: TARGET BUTT ALLOCATION MATRIX (Dense, Crisp & Clear)
        // ══════════════════════════════════════════════════════════
        if (phaseIndex === 0) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Target & Lane Assignment', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target Butt Allocation Matrix', 16, 36)

            // Top Category Overview Bar
            const tCardW = screenW - 32
            drawRoundedRect(16, 48, tCardW, 36, 8, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11px "Bricolage Grotesque", sans-serif'
            ctx.fillText('Recurve Men Open 70m', 28, 70)
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px "NovaText", sans-serif'
            ctx.fillText('40 Targets Active · 160 Archers', 168, 70)

            // 2 Large Detailed Target Butt Cards
            const targetCards = [
                {
                    no: 'Target 01',
                    category: 'Recurve Men 70m',
                    archers: [
                        { lane: 'A', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club' },
                        { lane: 'B', name: 'Riau Ega Agatha', club: 'Eagle Archery Club' },
                        { lane: 'C', name: 'Hendra Wijaya', club: 'Alpha Archery Team' },
                        { lane: 'D', name: 'Bagas Prastyo', club: 'Focus Target Team' }
                    ]
                },
                {
                    no: 'Target 02',
                    category: 'Recurve Men 70m',
                    archers: [
                        { lane: 'A', name: 'Diananda Choirunisa', club: 'Focus Archery Club' },
                        { lane: 'B', name: 'Linda Sartika', club: 'Eagle Archery Club' },
                        { lane: 'C', name: 'Kenzo Adhitama', club: 'Alpha Archery Team' },
                        { lane: 'D', name: 'Fajar Rahman', club: 'X-Ten Target Club' }
                    ]
                }
            ]

            targetCards.forEach((t, idx) => {
                const ty = 92 + idx * 192
                drawRoundedRect(16, ty, tCardW, 184, 12, '#FFFFFF', '#E2E8F0', 1.2)

                // Header
                drawRoundedRect(24, ty + 8, tCardW - 16, 28, 6, '#F8FAFC', '#E2E8F0', 0.8)
                drawTargetFace(40, ty + 22, 10)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(t.no, 58, ty + 26)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText('· ' + t.category, 120, ty + 26)

                drawRoundedRect(16 + tCardW - 84, ty + 9, 72, 22, 5, isAllocated ? '#D9FF00' : '#E2E8F0')
                ctx.fillStyle = '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '700 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(isAllocated ? 'Allocated' : 'Ready', 16 + tCardW - 48, ty + 23)

                // 4 Archers Rows
                t.archers.forEach((a, aidx) => {
                    const ay = ty + 42 + aidx * 34
                    drawRoundedRect(24, ay, tCardW - 16, 30, 6, '#F8FAFC', '#E2E8F0', 0.8)

                    drawRoundedRect(28, ay + 4, 22, 22, 4, isAllocated ? '#0F172A' : '#CBD5E1')
                    ctx.fillStyle = isAllocated ? '#D9FF00' : '#475569'
                    ctx.textAlign = 'center'
                    ctx.font = '800 11px "Bricolage Grotesque", sans-serif'
                    ctx.fillText(a.lane, 39, ay + 19)

                    ctx.textAlign = 'left'
                    ctx.fillStyle = '#0F172A'
                    ctx.font = '700 11px "NovaText", "Plus Jakarta Sans", sans-serif'
                    ctx.fillText(a.name, 58, ay + 15)

                    ctx.fillStyle = '#64748B'
                    ctx.font = '500 9px "NovaText", sans-serif'
                    ctx.fillText(a.club, 58, ay + 26)

                    ctx.textAlign = 'right'
                    ctx.fillStyle = '#059669'
                    ctx.font = '700 9px "NovaText", sans-serif'
                    ctx.fillText('70m Lane', 16 + tCardW - 32, ay + 19)
                })
            })

            // Summary Metrics Box
            const sBoxY = 482
            drawRoundedRect(16, sBoxY, tCardW, 58, 10, '#0F172A')
            ctx.textAlign = 'left'
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('160 / 160 Archers Allocated', 28, sBoxY + 24)
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Zero lane conflicts detected across 40 target butts', 28, sBoxY + 42)

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnAllocScale, btnAllocScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isAllocated ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isAllocated ? 'All 40 Target Lanes Allocated' : 'Auto-Allocate Target Lanes', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // STEP 2: LIVE QUALIFICATION ENGINE & LEADERBOARD
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
            ctx.fillText('Live Qualification Leaderboard', 16, 36)

            // Top Stats
            const qStatW = (screenW - 38) / 3
            const stats = [
                { title: 'Division', val: 'Recurve Men' },
                { title: 'Archers Live', val: '160 Synced' },
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

            // 3 Large Detailed Archer Cards
            const qualArchers = [
                { rank: '1', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club', ends: ['30', '29', '30', '29', '30', '29'], total: '684 pts', tens: '38 10s · 18 Xs', highlight: true },
                { rank: '2', name: 'Riau Ega Agatha', club: 'Eagle Archery Club', ends: ['29', '30', '29', '29', '29', '29'], total: '678 pts', tens: '34 10s · 14 Xs', highlight: false },
                { rank: '3', name: 'Diananda Choirunisa', club: 'Focus Archery Club', ends: ['29', '28', '30', '29', '29', '29'], total: '672 pts', tens: '31 10s · 12 Xs', highlight: false }
            ]

            const qCardW = screenW - 32
            qualArchers.forEach((a, idx) => {
                const ay = 104 + idx * 126
                drawRoundedRect(16, ay, qCardW, 118, 10, '#FFFFFF', a.highlight ? '#0F172A' : '#E2E8F0', a.highlight ? 1.5 : 1)

                drawRoundedRect(24, ay + 10, 26, 26, 6, a.highlight ? '#D9FF00' : '#0F172A')
                ctx.fillStyle = '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '800 13px "Bricolage Grotesque", sans-serif'
                ctx.fillText(a.rank, 37, ay + 28)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(a.name, 58, ay + 21)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9.5px "NovaText", sans-serif'
                ctx.fillText(a.club, 58, ay + 33)

                drawRoundedRect(16 + qCardW - 78, ay + 8, 68, 30, 6, a.highlight ? '#0F172A' : '#F1F5F9')
                ctx.fillStyle = a.highlight ? '#D9FF00' : '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '800 14px "Bricolage Grotesque", sans-serif'
                ctx.fillText(a.total, 16 + qCardW - 44, ay + 28)

                // Ends Matrix row
                const endBoxW = (qCardW - 28) / 6
                a.ends.forEach((evalScore, eidx) => {
                    const ex = 22 + eidx * endBoxW
                    const ey = ay + 44
                    drawRoundedRect(ex, ey, endBoxW - 4, 38, 4, '#F8FAFC', '#E2E8F0', 0.8)

                    ctx.fillStyle = '#64748B'
                    ctx.font = '600 8px "NovaText", sans-serif'
                    ctx.fillText('E' + (eidx + 1), ex + (endBoxW - 4) / 2, ey + 13)

                    ctx.fillStyle = '#0F172A'
                    ctx.font = '700 12px "Bricolage Grotesque", sans-serif'
                    ctx.fillText(evalScore, ex + (endBoxW - 4) / 2, ey + 30)
                })

                ctx.textAlign = 'left'
                ctx.fillStyle = '#64748B'
                ctx.font = '500 9px "NovaText", sans-serif'
                ctx.fillText('Official Tiebreaker: ' + a.tens, 24, ay + 104)
            })

            // Summary Status Box
            const qFootY = 488
            drawRoundedRect(16, qFootY, qCardW, 52, 10, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Real-Time Scorekeeper Sync Active', 28, qFootY + 22)
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('160 scorecards audited & ready for elimination brackets', 28, qFootY + 38)

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnQualScale, btnQualScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isQualLocked ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isQualLocked ? 'Qualification Leaderboard Certified' : 'Lock Qualification Scores', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // STEP 3: CLUB TEAM STANDINGS & AUTO-SUM (Σ Top 3)
        // ══════════════════════════════════════════════════════════
        else if (phaseIndex === 2) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Club Team Aggregate Engine', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Club Team Auto-Sum Standings', 16, 36)

            const tHeroW = screenW - 32
            drawRoundedRect(16, 48, tHeroW, 52, 10, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Recurve Men Team (Top 3 Aggregate)', 28, 68)
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Sum of Top 3 Qualification Archers per Club', 28, 86)

            const teamRows = [
                {
                    rank: '1',
                    name: 'Fast Archery Club',
                    archers: 'Arif (684) + Dimas (675) + Gilang (668)',
                    seed: 'Team Seed #1 · Gold Bracket',
                    total: '2,027 pts',
                    highlight: true
                },
                {
                    rank: '2',
                    name: 'Focus Archery Club',
                    archers: 'Diananda (672) + Hendra (662) + Bagas (656)',
                    seed: 'Team Seed #2 · Gold Bracket',
                    total: '1,990 pts',
                    highlight: false
                },
                {
                    rank: '3',
                    name: 'Eagle Archery Team',
                    archers: 'Riau Ega (678) + Linda (648) + Ryan (641)',
                    seed: 'Team Seed #3 · Bronze Bracket',
                    total: '1,967 pts',
                    highlight: false
                }
            ]

            teamRows.forEach((r, idx) => {
                const ry = 108 + idx * 124
                drawRoundedRect(16, ry, tHeroW, 116, 10, '#FFFFFF', r.highlight ? '#0F172A' : '#E2E8F0', r.highlight ? 1.5 : 1)

                drawRoundedRect(24, ry + 10, 26, 26, 6, r.highlight ? '#D9FF00' : '#0F172A')
                ctx.fillStyle = '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '800 13px "Bricolage Grotesque", sans-serif'
                ctx.fillText(r.rank, 37, ry + 28)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(r.name, 58, ry + 23)

                drawRoundedRect(16 + tHeroW - 78, ry + 8, 68, 30, 6, r.highlight ? '#0F172A' : '#F1F5F9')
                ctx.fillStyle = r.highlight ? '#D9FF00' : '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '800 13px "Bricolage Grotesque", sans-serif'
                ctx.fillText(r.total, 16 + tHeroW - 44, ry + 28)

                drawRoundedRect(24, ry + 44, tHeroW - 24, 36, 6, '#F8FAFC', '#E2E8F0', 0.8)
                ctx.textAlign = 'left'
                ctx.fillStyle = '#334155'
                ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(r.archers, 32, ry + 66)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9px "NovaText", sans-serif'
                ctx.fillText(r.seed, 24, ry + 100)
            })

            // Summary Footer
            const tFootY = 488
            drawRoundedRect(16, tFootY, tHeroW, 52, 10, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Automatic Seeding Completed', 28, tFootY + 22)
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('All clubs qualified for Individual and Team matchplay trees', 28, tFootY + 38)

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnSeedScale, btnSeedScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isSeeded ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isSeeded ? 'Brackets Seeded Automatically' : 'Generate Team & Individual Brackets', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // STEP 4: WORLD ARCHERY ELIMINATION MATCHPLAY
        // ══════════════════════════════════════════════════════════
        else if (phaseIndex === 3) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Elimination Matchplay Engine', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('World Archery Bracket Tree', 16, 36)

            const treeW = screenW - 32
            const treeH = 492
            const treeY = 48
            drawRoundedRect(16, treeY, treeW, treeH, 12, '#FFFFFF', '#E2E8F0', 1.2)

            ctx.fillStyle = '#64748B'
            ctx.font = '700 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Semifinals (Top 4)', 26, treeY + 22)
            ctx.fillText('Medal Finals', 174, treeY + 22)

            // SF Match 1
            const sf1Y = treeY + 34
            drawRoundedRect(24, sf1Y, 130, 104, 8, '#F8FAFC', '#E2E8F0', 1)

            drawRoundedRect(30, sf1Y + 8, 86, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('SF 1 · Recurve Men', 34, sf1Y + 20)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('1 Arif Dwi P.', 32, sf1Y + 46)
            drawRoundedRect(126, sf1Y + 34, 22, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('6', 137, sf1Y + 47)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('4 Diananda C.', 32, sf1Y + 70)
            drawRoundedRect(126, sf1Y + 58, 22, 18, 4, '#E2E8F0')
            ctx.fillStyle = '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('4', 137, sf1Y + 71)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8px "NovaText", sans-serif'
            ctx.fillText('Sets: 29 · 28 · 30 · 29 · 30', 32, sf1Y + 92)

            // SF Match 2
            const sf2Y = treeY + 148
            drawRoundedRect(24, sf2Y, 130, 104, 8, '#F8FAFC', '#E2E8F0', 1)

            drawRoundedRect(30, sf2Y + 8, 86, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('SF 2 · Recurve Men', 34, sf2Y + 20)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('2 Riau Ega A.', 32, sf2Y + 46)
            drawRoundedRect(126, sf2Y + 34, 22, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('6', 137, sf2Y + 47)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('3 Kenzo A.', 32, sf2Y + 70)
            drawRoundedRect(126, sf2Y + 58, 22, 18, 4, '#E2E8F0')
            ctx.fillStyle = '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('2', 137, sf2Y + 71)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8px "NovaText", sans-serif'
            ctx.fillText('Sets: 28 · 29 · 29 · 28', 32, sf2Y + 92)

            // Connectors
            ctx.strokeStyle = '#0F172A'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(154, sf1Y + 52)
            ctx.lineTo(164, sf1Y + 52)
            ctx.lineTo(164, treeY + 86)
            ctx.lineTo(172, treeY + 86)

            ctx.moveTo(154, sf2Y + 52)
            ctx.lineTo(164, sf2Y + 52)
            ctx.lineTo(164, treeY + 86)
            ctx.stroke()

            // Gold Medal Match
            const goldY = treeY + 34
            const isGoldActive = isBracketAdvanced
            drawRoundedRect(172, goldY, 142, 114, 8, isGoldActive ? '#0F172A' : '#F8FAFC', isGoldActive ? '#D9FF00' : '#CBD5E1', isGoldActive ? 1.5 : 1)

            drawRoundedRect(178, goldY + 8, 92, 18, 4, isGoldActive ? '#D9FF00' : '#0F172A')
            ctx.fillStyle = isGoldActive ? '#0F172A' : '#D9FF00'
            ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Gold Medal Final', 184, goldY + 20)

            ctx.fillStyle = isGoldActive ? '#FFFFFF' : '#0F172A'
            ctx.font = '700 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('1 Arif Dwi P.', 180, goldY + 48)
            drawRoundedRect(286, goldY + 36, 22, 18, 4, isGoldActive ? '#D9FF00' : '#0F172A')
            ctx.fillStyle = '#0F172A'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('6', 297, goldY + 49)

            ctx.textAlign = 'left'
            ctx.fillStyle = isGoldActive ? '#94A3B8' : '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('2 Riau Ega A.', 180, goldY + 72)
            drawRoundedRect(286, goldY + 60, 22, 18, 4, isGoldActive ? '#1E293B' : '#E2E8F0')
            ctx.fillStyle = isGoldActive ? '#94A3B8' : '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('4', 297, goldY + 73)

            ctx.textAlign = 'left'
            ctx.fillStyle = isGoldActive ? '#D9FF00' : '#64748B'
            ctx.font = '600 8.5px "NovaText", sans-serif'
            ctx.fillText(isGoldActive ? 'Gold Champion: Arif Dwi' : 'Awaiting Match Advance', 180, goldY + 98)

            // Bronze Medal Match
            const bronzeY = treeY + 158
            drawRoundedRect(172, bronzeY, 142, 94, 8, '#F8FAFC', '#E2E8F0', 1)

            drawRoundedRect(178, bronzeY + 8, 98, 18, 4, '#F1F5F9')
            ctx.fillStyle = '#475569'
            ctx.font = '700 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Bronze Medal Final', 184, bronzeY + 20)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('4 Diananda C.', 180, bronzeY + 44)
            drawRoundedRect(286, bronzeY + 32, 22, 18, 4, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.textAlign = 'center'
            ctx.font = '800 10.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('7', 297, bronzeY + 45)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('3 Kenzo A.', 180, bronzeY + 66)
            drawRoundedRect(286, bronzeY + 54, 22, 18, 4, '#E2E8F0')
            ctx.fillStyle = '#475569'
            ctx.textAlign = 'center'
            ctx.font = '700 9.5px "Bricolage Grotesque", sans-serif'
            ctx.fillText('3', 297, bronzeY + 67)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8px "NovaText", sans-serif'
            ctx.fillText('Bronze Winner: Diananda', 180, bronzeY + 86)

            // Schedule Box
            const fopY = treeY + 262
            drawRoundedRect(24, fopY, treeW - 16, 216, 10, '#0F172A')

            drawRoundedRect(34, fopY + 10, treeW - 36, 26, 6, '#1E293B')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Field of Play Match Schedule', 44, fopY + 27)

            const schedule = [
                { time: '14:00', match: 'Recurve Men Gold Final · Target 01', status: 'Completed' },
                { time: '14:30', match: 'Recurve Women Gold Final · Target 02', status: 'In Progress' },
                { time: '15:00', match: 'Compound Team Finals · Target 03', status: 'Upcoming' },
                { time: '15:45', match: 'Official Medal Awarding Ceremony', status: 'Scheduled' }
            ]

            schedule.forEach((sc, sidx) => {
                const scY = fopY + 44 + sidx * 40
                drawRoundedRect(34, scY, treeW - 36, 34, 6, '#1E293B')

                drawRoundedRect(40, scY + 7, 36, 20, 4, '#0F172A')
                ctx.fillStyle = '#94A3B8'
                ctx.textAlign = 'center'
                ctx.font = '700 8.5px "NovaText", sans-serif'
                ctx.fillText(sc.time, 58, scY + 20)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#FFFFFF'
                ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(sc.match, 84, scY + 20)

                drawRoundedRect(16 + treeW - 88, scY + 8, 54, 18, 4, sc.status === 'Completed' ? '#D9FF00' : '#334155')
                ctx.fillStyle = sc.status === 'Completed' ? '#0F172A' : '#94A3B8'
                ctx.textAlign = 'center'
                ctx.font = '700 8px "NovaText", sans-serif'
                ctx.fillText(sc.status, 16 + treeW - 61, scY + 20)
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
            ctx.fillText(isBracketAdvanced ? 'Winners Advanced to Finals' : 'Advance Semifinals to Finals', scBtnCX, scBtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // ══════════════════════════════════════════════════════════
        // STEP 5: PODIUM PROTOCOL & GRAPHIC E-CERTIFICATE
        // ══════════════════════════════════════════════════════════
        else {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Podium Protocol & Verified Accreditations', 16, 14)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Official E-Certificate & Accreditations', 16, 36)

            const certCardW = screenW - 32
            const certCardH = 492
            const certY = 48

            drawRoundedRect(16, certY, certCardW, certCardH, 12, '#FFFFFF', '#E2E8F0', 1.2)
            drawRoundedRect(24, certY + 8, certCardW - 16, certCardH - 16, 8, '#FFFDF7', '#D97706', 1.5)
            drawRoundedRect(28, certY + 12, certCardW - 24, certCardH - 24, 6, null, '#0F172A', 0.8)

            const crestCX = 16 + certCardW / 2
            const crestCY = certY + 36

            drawRoundedRect(crestCX - 22, crestCY - 14, 44, 28, 6, '#0F172A')
            drawTargetFace(crestCX, crestCY, 9)

            ctx.textAlign = 'center'
            ctx.fillStyle = '#D97706'
            ctx.font = '700 9px "NovaText", sans-serif'
            ctx.fillText('FEDERATION OF ARCHERY INDONESIA', crestCX, crestCY + 26)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 17px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Certificate of Excellence', crestCX, crestCY + 46)

            ctx.fillStyle = '#64748B'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('National Archery Championship 2026', crestCX, crestCY + 60)

            drawRoundedRect(36, crestCY + 72, certCardW - 40, 110, 8, '#F8FAFC', '#E2E8F0', 0.8)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 9px "NovaText", sans-serif'
            ctx.fillText('This Official Accreditation Is Proudly Awarded To:', crestCX, crestCY + 88)

            ctx.fillStyle = '#0F172A'
            ctx.font = '800 17px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Arif Dwi Pangestu', crestCX, crestCY + 112)

            drawRoundedRect(crestCX - 90, crestCY + 122, 180, 24, 12, '#D9FF00', '#0F172A', 1)
            ctx.fillStyle = '#0F172A'
            ctx.font = '800 10px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('1st Place · Gold Medalist', crestCX, crestCY + 137)

            ctx.fillStyle = '#475569'
            ctx.font = '600 8.5px "NovaText", sans-serif'
            ctx.fillText('Recurve Men Individual 70m · Final Score: 684 pts', crestCX, crestCY + 168)

            const sealCX = 74
            const sealCY = crestCY + 232

            ctx.beginPath()
            ctx.moveTo(sealCX - 8, sealCY + 10)
            ctx.lineTo(sealCX - 14, sealCY + 36)
            ctx.lineTo(sealCX - 6, sealCY + 32)
            ctx.lineTo(sealCX - 2, sealCY + 36)
            ctx.lineTo(sealCX - 2, sealCY + 10)
            ctx.fillStyle = '#D97706'
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(sealCX + 8, sealCY + 10)
            ctx.lineTo(sealCX + 14, sealCY + 36)
            ctx.lineTo(sealCX + 6, sealCY + 32)
            ctx.lineTo(sealCX + 2, sealCY + 36)
            ctx.lineTo(sealCX + 2, sealCY + 10)
            ctx.fillStyle = '#B45309'
            ctx.fill()

            ctx.beginPath()
            ctx.arc(sealCX, sealCY, 22, 0, Math.PI * 2)
            ctx.fillStyle = '#F59E0B'
            ctx.fill()
            ctx.strokeStyle = '#D97706'
            ctx.lineWidth = 1.5
            ctx.stroke()

            drawTargetFace(sealCX, sealCY, 14)

            const sigX = 140
            const sigY = crestCY + 208

            ctx.textAlign = 'left'
            ctx.strokeStyle = '#0F172A'
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(sigX, sigY + 20)
            ctx.bezierCurveTo(sigX + 16, sigY + 4, sigX + 28, sigY + 32, sigX + 48, sigY + 12)
            ctx.bezierCurveTo(sigX + 60, sigY + 2, sigX + 72, sigY + 26, sigX + 90, sigY + 18)
            ctx.stroke()

            drawRoundedRect(sigX, sigY + 24, 94, 1, 0, '#94A3B8')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9px "NovaText", sans-serif'
            ctx.fillText('Ir. Bambang Tri', sigX, sigY + 36)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 7.5px "NovaText", sans-serif'
            ctx.fillText('Chief Judge International', sigX, sigY + 46)

            const sig2X = sigX + 104
            ctx.beginPath()
            ctx.moveTo(sig2X, sigY + 18)
            ctx.bezierCurveTo(sig2X + 12, sigY + 2, sig2X + 24, sigY + 28, sig2X + 40, sigY + 10)
            ctx.bezierCurveTo(sig2X + 50, sigY + 4, sig2X + 60, sigY + 22, sig2X + 72, sigY + 16)
            ctx.stroke()

            drawRoundedRect(sig2X, sigY + 24, 76, 1, 0, '#94A3B8')
            ctx.fillStyle = '#0F172A'
            ctx.font = '700 9px "NovaText", sans-serif'
            ctx.fillText('Drs. Suryanto M.', sig2X, sigY + 36)
            ctx.fillStyle = '#64748B'
            ctx.font = '500 7.5px "NovaText", sans-serif'
            ctx.fillText('Technical Delegate', sig2X, sigY + 46)

            const footY = crestCY + 276
            drawRoundedRect(36, footY, certCardW - 40, 78, 6, '#0F172A')

            drawRoundedRect(44, footY + 10, 58, 58, 4, '#FFFFFF')
            ctx.fillStyle = '#0F172A'
            ctx.fillRect(50, footY + 16, 14, 14)
            ctx.fillRect(80, footY + 16, 14, 14)
            ctx.fillRect(50, footY + 46, 14, 14)
            ctx.fillRect(72, footY + 38, 12, 12)

            ctx.textAlign = 'left'
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Cryptographically Verified & Sealed', 112, footY + 26)

            ctx.fillStyle = '#FFFFFF'
            ctx.font = '500 8.5px "NovaText", sans-serif'
            ctx.fillText('Certificate ID: ARCH-2026-CERT-9921-ID', 112, footY + 40)

            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8px "NovaText", sans-serif'
            ctx.fillText('Instant PDF & WhatsApp Dispatch to 160 Participants', 112, footY + 54)

            // Bottom CTA Button
            ctx.save()
            ctx.translate(scBtnCX, scBtnCY)
            ctx.scale(btnCertScale, btnCertScale)
            ctx.translate(-scBtnCX, -scBtnCY)

            drawRoundedRect(scBtnX, scBtnY, scBtnW, scBtnH, 12, '#0F172A')
            ctx.textAlign = 'center'
            ctx.fillStyle = isCertIssued ? '#D9FF00' : '#FFFFFF'
            ctx.font = '700 13px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText(isCertIssued ? '160 Certificates Dispatched' : 'Issue & Distribute All 160 Certificates', scBtnCX, scBtnY + 28)
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
