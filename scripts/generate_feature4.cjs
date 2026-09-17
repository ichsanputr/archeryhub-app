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

        let activeKeyTap = -1 // 0: X, 1: 10, 2: 9

        let cursorVisible = false
        let cursorX = 0, cursorY = 0
        let cursorPressed = false
        let tapRipple = -1, tapX = 0, tapY = 0

        if (elapsed < 4.2) {
            sceneIndex = 0
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
            sceneIndex = 1
            isRosterSelected = true
            const step2Elapsed = elapsed - 4.2

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
            sceneIndex = 2
            isRosterSelected = true
            isEndSubmitted = true
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
            sceneIndex = 3
            isRosterSelected = true
            isEndSubmitted = true
            isStandingsAudited = true
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
            sceneIndex = 3
            isRosterSelected = true
            isEndSubmitted = true
            isStandingsAudited = true
            isJudgeLocked = true
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

        // Top Tactical Header
        const headY = screenY + 48
        drawRoundedRect(screenX + 16, headY, screenW - 32, 36, 8, '#0F172A')
        ctx.textAlign = 'left'
        ctx.fillStyle = '#D9FF00'
        ctx.font = '700 11px "Bricolage Grotesque", "NovaText", sans-serif'
        ctx.fillText('🎯 Target 12 | Lane 12A', screenX + 28, headY + 22)

        drawRoundedRect(screenX + screenW - 96, headY + 6, 68, 24, 6, '#1E293B')
        ctx.fillStyle = '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.font = '600 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
        ctx.fillText('End 1 / 12', screenX + screenW - 62, headY + 22)

        const contentY = headY + 46
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

        // SCENE 1: TARGET 12 ROSTER
        if (sceneIndex === 0) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Scorekeeper Field App', 20, 16)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target 12 Roster', 20, 38)

            const rHeroW = screenW - 40
            const lanes = [
                { lane: '12A', name: 'Arif Dwi Pangestu', club: 'Fast Archery Club', active: true },
                { lane: '12B', name: 'Riau Ega Agatha', club: 'Eagle Archery Club', active: false },
                { lane: '12C', name: 'Bagas Prastyo', club: 'Focus Target Team', active: false },
                { lane: '12D', name: 'Hendra Wijaya', club: 'Alpha Archery Team', active: false }
            ]

            lanes.forEach((l, idx) => {
                const ly = 52 + idx * 56
                drawRoundedRect(20, ly, rHeroW, 48, 12, '#FFFFFF', l.active ? '#0F172A' : '#E2E8F0', l.active ? 1.5 : 1)

                drawRoundedRect(28, ly + 10, 34, 28, 6, l.active ? '#D9FF00' : '#F1F5F9')
                ctx.fillStyle = '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '700 11.5px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(l.lane, 45, ly + 28)

                ctx.textAlign = 'left'
                ctx.fillStyle = '#0F172A'
                ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(l.name, 72, ly + 21)

                ctx.fillStyle = '#64748B'
                ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(l.club, 72, ly + 36)

                drawRoundedRect(20 + rHeroW - 56, ly + 14, 46, 20, 5, l.active ? '#0F172A' : '#F8FAFC')
                ctx.fillStyle = l.active ? '#D9FF00' : '#94A3B8'
                ctx.textAlign = 'center'
                ctx.font = '600 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
                ctx.fillText(l.active ? 'Active' : 'Pending', 20 + rHeroW - 33, ly + 27)
            })

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
            ctx.restore()
        }
        // SCENE 2: ERGONOMIC 8-KEYPAD ENTRY
        else if (sceneIndex === 1) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Field Scoring Entry', 20, 16)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target 12A · End 1', 20, 38)

            const kHeroW = screenW - 40
            drawRoundedRect(20, 52, kHeroW, 252, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Arrow slots
            const arrowSlotsY = 64
            drawRoundedRect(32, arrowSlotsY, kHeroW - 24, 52, 10, '#0F172A')

            const arrows = [
                { label: 'Arrow 1', val: 'X', fill: '#D9FF00' },
                { label: 'Arrow 2', val: '10', fill: '#D9FF00' },
                { label: 'Arrow 3', val: '9', fill: '#D9FF00' }
            ]

            arrows.forEach((a, idx) => {
                const ax = 42 + idx * 56
                drawRoundedRect(ax, arrowSlotsY + 10, 48, 32, 8, a.fill)
                ctx.fillStyle = '#0F172A'
                ctx.textAlign = 'center'
                ctx.font = '800 13px "Bricolage Grotesque", "NovaText", sans-serif'
                ctx.fillText(a.val, ax + 24, arrowSlotsY + 31)
            })

            ctx.textAlign = 'right'
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 8.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('End Total', 20 + kHeroW - 20, arrowSlotsY + 24)

            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 15px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('29 / 30', 20 + kHeroW - 20, arrowSlotsY + 44)

            // 8-Keypad Grid
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
            ctx.restore()
        }
        // SCENE 3: LIVE CLOUD SYNC & MINI LEADERBOARD
        else if (sceneIndex === 2) {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Live Cloud Engine', 20, 16)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target 12 Standings', 20, 38)

            const sHeroW = screenW - 40
            drawRoundedRect(20, 52, sHeroW, 252, 14, '#FFFFFF', '#E2E8F0', 1.2)

            // Cloud Status Box
            drawRoundedRect(34, 66, sHeroW - 28, 38, 8, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 10.5px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('● LIVE SYNC ACTIVE', 48, 86)
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Latency: 12ms · Cloud Sync Active', 48, 98)

            const stRows = [
                { rank: '1', lane: '12A Arif Dwi', score: '29 pts (1X, 10, 9)', gold: true },
                { rank: '2', lane: '12B Riau Ega', score: '28 pts (1X, 9, 9)', gold: false },
                { rank: '3', lane: '12C Bagas P.', score: '27 pts (9, 9, 9)', gold: false },
                { rank: '4', lane: '12D Hendra W.', score: '26 pts (9, 9, 8)', gold: false }
            ]

            stRows.forEach((r, idx) => {
                const ry = 114 + idx * 44
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
            ctx.fillText(isStandingsAudited ? '✔ Standings Verified' : 'Proceed to Official Audit', sc1BtnCX, sc1BtnY + 28)
            ctx.restore()
            ctx.restore()
        }
        // SCENE 4: ATHLETE SIGN & JUDGE LOCK
        else {
            ctx.save()
            ctx.translate(screenX, contentY)
            ctx.textAlign = 'left'
            ctx.fillStyle = '#64748B'
            ctx.font = '600 10px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Official Score Audit', 20, 16)

            ctx.fillStyle = '#0F172A'
            ctx.font = '700 18px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Athlete Sign & Lock', 20, 38)

            const lHeroW = screenW - 40
            drawRoundedRect(20, 52, lHeroW, 252, 14, '#FFFFFF', '#E2E8F0', 1.2)

            drawRoundedRect(34, 66, lHeroW - 28, 48, 10, '#0F172A')
            ctx.fillStyle = '#D9FF00'
            ctx.font = '700 12px "Bricolage Grotesque", "NovaText", sans-serif'
            ctx.fillText('Target 12A · Arif Dwi Pangestu', 48, 86)
            ctx.fillStyle = '#94A3B8'
            ctx.font = '500 9.5px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('Official Final Qualification Score: 684 pts', 48, 102)

            const sigY = 124
            drawRoundedRect(34, sigY, lHeroW - 28, 76, 10, '#F8FAFC', '#E2E8F0', 1)

            ctx.fillStyle = '#64748B'
            ctx.font = '600 9px "NovaText", "Plus Jakarta Sans", sans-serif'
            ctx.fillText('ATHLETE DIGITAL SIGNATURE', 46, sigY + 18)

            ctx.strokeStyle = '#0F172A'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(56, sigY + 54)
            ctx.bezierCurveTo(72, sigY + 32, 88, sigY + 68, 110, sigY + 42)
            ctx.bezierCurveTo(124, sigY + 28, 140, sigY + 58, 168, sigY + 48)
            ctx.stroke()

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
            ctx.restore()
        }

        ctx.restore() // Content clip

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

fs.writeFileSync(path.join(__dirname, '../pages/graphics/feature-scorekeeper.vue'), code, 'utf8');
console.log('feature-scorekeeper.vue written successfully');
