/**
 * UnifiedCanvas — ONE requestAnimationFrame loop for everything.
 * Replaces ParticleBackground + StarField + SpiderManMCU.
 * 
 * Andrew Garfield "Amazing Spider-Man" suit:
 *   - Darker, more saturated crimson red
 *   - Larger hexagonal eye lenses (not almond — wide angular hexagons)
 *   - Raised web pattern lines
 *   - Blue is deeper navy
 *   - Belt / utility look
 */

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── QUIPS ─────────────────────────────────────────────────────────────────
const QUIPS = [
  "You know what's\ncooler than magic?\nCoding. 💻",
  "Sonu's portfolio >\nOscorp's website, easy 😤",
  "With great power comes\ngreat responsibility! 🕷️",
  "THWIP! Nice portfolio! 🕸️",
  "I'm not your\nfriendly neighbourhood...\nI'm THE Spider-Man 😏",
  "Gwen would've loved\nthis design 🥺",
  "My spider-sense says\nhire this developer! 🔥",
  "404 bugs not found —\nSonu ate them all ✅",
  "Hey! Personal space! 😤",
  "This site is\nelectrifyingly good ⚡",
  "I make this look good 😎",
  "Better portfolio than\nDaily Bugle's for sure 🗞️",
]

// ─── ANDREW GARFIELD SUIT COLOURS ──────────────────────────────────────────
const R_DARK   = '#7a0000'
const R_MID    = '#b01010'
const R_BRIGHT = '#d01818'
const R_LIGHT  = '#e83030'
const B_DARK   = '#060820'
const B_MID    = '#0e1545'
// const B_RIM    = '#162066'
const BLACK    = '#080808'
const WEB_COL  = '#220000'   // very dark web lines on red
const LENS_W   = '#d8eeff'
const LENS_B   = '#b0d4ff'

// ─── DRAW AMAZING SPIDER-MAN ───────────────────────────────────────────────
function drawAmazingSpiderMan(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  scale: number,
  facing: number,
  pose: 'swing' | 'crawl' | 'run' | 'shoot',
  t: number,
) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(facing * scale, scale)

  const s = Math.sin, c = Math.cos

  // ── Pose-dependent limb targets ────────────────────────────────
  const isSwing  = pose === 'swing'
  const isCrawl  = pose === 'crawl'
  // const isRun    = pose === 'run'
  const isShoot  = pose === 'shoot'

  const bob = isSwing ? s(t) * 2.2 : isCrawl ? Math.abs(s(t * 2.8)) * 2.5 : 0

  // arm angles
  const laRot = isShoot ? -1.55
              : isSwing  ? -0.75 + s(t) * 0.18
              : isCrawl  ? -0.35 + s(t * 2) * 0.28
              : -0.55 + s(t * 3) * 0.38
  const raRot = isShoot ? 1.55
              : isSwing  ? 0.75 + s(t + 1) * 0.18
              : isCrawl  ? 0.35 + s(t * 2 + 1) * 0.28
              : 0.55 + s(t * 3 + 1.5) * 0.38
  const llRot = isSwing  ? 0.52 + s(t * 0.85) * 0.12
              : isCrawl  ? 0.28 + s(t * 2) * 0.35
              : 0.42 + s(t * 3) * 0.45
  const rlRot = isSwing  ? -0.45 + s(t * 0.85 + .5) * 0.12
              : isCrawl  ? -0.28 + s(t * 2 + 1) * 0.35
              : -0.42 + s(t * 3 + 1.5) * 0.45

  // ── Helper: capsule limb ────────────────────────────────────────
  const limb = (
    x1: number, y1: number,
    angle: number, len: number, thick: number,
    dark: string, bright: string,
  ) => {
    const x2 = x1 + c(angle) * len
    const y2 = y1 + s(angle) * len
    // shadow
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
    ctx.strokeStyle = dark; ctx.lineWidth = thick + 1.5
    ctx.lineCap = 'round'; ctx.stroke()
    // main
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
    ctx.strokeStyle = bright; ctx.lineWidth = thick; ctx.stroke()
    // highlight
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
    ctx.strokeStyle = 'rgba(255,100,100,0.18)'; ctx.lineWidth = thick * 0.28; ctx.stroke()
    return { x: x2, y: y2 }
  }

  const by = bob  // body bob offset

  // ─────────────────────────────────────────────────────────────────
  // LEGS  (drawn behind body)
  // ─────────────────────────────────────────────────────────────────
  // left upper
  const lk = limb(-10, 18 + by, Math.PI/2 + llRot, 22, 10, B_DARK, B_MID)
  // left lower
  const lf = limb(lk.x, lk.y, Math.PI/2 + llRot * .35, 20, 9, R_DARK, R_MID)
  // left boot
  ctx.beginPath()
  ctx.ellipse(lf.x, lf.y + 3, 11, 6.5, llRot * .15, 0, Math.PI*2)
  const bg1 = ctx.createLinearGradient(lf.x-11, lf.y, lf.x+11, lf.y)
  bg1.addColorStop(0, R_DARK); bg1.addColorStop(.5, R_MID); bg1.addColorStop(1, R_DARK)
  ctx.fillStyle = bg1; ctx.fill()
  ctx.strokeStyle = BLACK; ctx.lineWidth = .8; ctx.stroke()

  // right upper
  const rk = limb(10, 18 + by, Math.PI/2 + rlRot, 22, 10, B_DARK, B_MID)
  // right lower
  const rf = limb(rk.x, rk.y, Math.PI/2 + rlRot * .35, 20, 9, R_DARK, R_MID)
  // right boot
  ctx.beginPath()
  ctx.ellipse(rf.x, rf.y + 3, 11, 6.5, rlRot * .15, 0, Math.PI*2)
  const bg2 = ctx.createLinearGradient(rf.x-11, rf.y, rf.x+11, rf.y)
  bg2.addColorStop(0, R_DARK); bg2.addColorStop(.5, R_MID); bg2.addColorStop(1, R_DARK)
  ctx.fillStyle = bg2; ctx.fill()
  ctx.strokeStyle = BLACK; ctx.lineWidth = .8; ctx.stroke()

  // ─────────────────────────────────────────────────────────────────
  // TORSO
  // ─────────────────────────────────────────────────────────────────
  // blue sides / back
  ctx.beginPath(); ctx.ellipse(0, by, 19, 23, 0, 0, Math.PI*2)
  const tg = ctx.createLinearGradient(-19, by, 19, by)
  tg.addColorStop(0, B_DARK); tg.addColorStop(.4, B_MID)
  tg.addColorStop(.6, B_MID); tg.addColorStop(1, B_DARK)
  ctx.fillStyle = tg; ctx.fill()

  // red chest panel
  ctx.beginPath()
  ctx.moveTo(-15, -18 + by)
  ctx.bezierCurveTo(-17, -6 + by, -17, 8 + by, -11, 21 + by)
  ctx.lineTo(11, 21 + by)
  ctx.bezierCurveTo(17, 8 + by, 17, -6 + by, 15, -18 + by)
  ctx.closePath()
  const cg = ctx.createRadialGradient(-3, -6 + by, 1, 0, by, 24)
  cg.addColorStop(0, R_LIGHT); cg.addColorStop(.3, R_BRIGHT)
  cg.addColorStop(.75, R_MID); cg.addColorStop(1, R_DARK)
  ctx.fillStyle = cg; ctx.fill()

  // ── RAISED WEB PATTERN on torso (Amazing SM has very visible webs) ──
  ctx.save()
  ctx.translate(0, by)
  ctx.strokeStyle = WEB_COL; ctx.lineWidth = .85; ctx.globalAlpha = .55

  // vertical center
  ctx.beginPath(); ctx.moveTo(0, -23); ctx.lineTo(0, 23); ctx.stroke()
  // horizontal arcs
  for (let i = -3; i <= 3; i++) {
    const ry = i * 7
    ctx.beginPath()
    ctx.moveTo(-14, ry)
    ctx.quadraticCurveTo(0, ry - Math.sign(ry) * 2, 14, ry)
    ctx.stroke()
  }
  // radials from neckline
  const radials = [-0.7, -0.42, -0.18, 0, 0.18, 0.42, 0.7]
  radials.forEach(a => {
    ctx.beginPath()
    ctx.moveTo(0, -23)
    ctx.lineTo(Math.sin(a) * 18, 23)
    ctx.stroke()
  })
  ctx.globalAlpha = 1
  ctx.restore()

  // ── Belt detail (Andrew Garfield suit has a belt) ───────────────
  ctx.save()
  ctx.translate(0, 16 + by)
  ctx.fillStyle = B_DARK
  ctx.beginPath()
  ctx.ellipse(0, 0, 17, 4, 0, 0, Math.PI*2); ctx.fill()
  // belt buckle
  ctx.fillStyle = '#222'
  ctx.fillRect(-5, -3, 10, 6)
  ctx.strokeStyle = '#444'; ctx.lineWidth = .7; ctx.strokeRect(-5, -3, 10, 6)
  ctx.restore()

  // ── Spider emblem — Amazing SM has a LARGER spider ──────────────
  ctx.save()
  ctx.translate(0, 2 + by)
  ctx.fillStyle = BLACK; ctx.globalAlpha = .82
  // body segments
  ctx.beginPath(); ctx.ellipse(0, -3, 4, 3, 0, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(0, 3.5, 3.5, 4.5, 0, 0, Math.PI*2); ctx.fill()
  // legs (Amazing SM spider has longer legs)
  const spiderLegs = [
    [-3,-2, -11,-7], [-3,0, -12,0], [-3,2, -10,7], [-3,4, -8,11],
    [3,-2, 11,-7],   [3,0, 12,0],   [3,2, 10,7],   [3,4, 8,11],
  ]
  ctx.lineWidth = 1; ctx.strokeStyle = BLACK
  spiderLegs.forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke()
  })
  ctx.globalAlpha = 1
  ctx.restore()

  // ─────────────────────────────────────────────────────────────────
  // ARMS (drawn in front of torso)
  // ─────────────────────────────────────────────────────────────────
  const la  = { x: -17, y: -10 + by }
  const lel = limb(la.x, la.y, laRot, 22, 9, R_DARK, R_MID)
  const lh  = limb(lel.x, lel.y, laRot - .25, 18, 8, R_DARK, R_BRIGHT)
  // left glove (darker for AG suit)
  ctx.beginPath(); ctx.arc(lh.x, lh.y, 7, 0, Math.PI*2)
  ctx.fillStyle = isShoot ? '#1a1a1a' : '#111'; ctx.fill()
  ctx.strokeStyle = '#333'; ctx.lineWidth = .7; ctx.stroke()

  const ra  = { x: 17, y: -10 + by }
  const rel = limb(ra.x, ra.y, raRot, 22, 9, R_DARK, R_MID)
  const rh  = limb(rel.x, rel.y, raRot + .25, 18, 8, R_DARK, R_BRIGHT)
  ctx.beginPath(); ctx.arc(rh.x, rh.y, 7, 0, Math.PI*2)
  ctx.fillStyle = isShoot ? '#1a1a1a' : '#111'; ctx.fill()
  ctx.strokeStyle = '#333'; ctx.lineWidth = .7; ctx.stroke()

  // web shooter (mechanical look for AG suit)
  const drawShooter = (hx: number, hy: number, angle: number) => {
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(angle)
    ctx.fillStyle = '#555'
    ctx.fillRect(-5, -3, 10, 3)
    ctx.fillStyle = '#888'
    ctx.fillRect(-3, -5, 6, 3)
    // nozzle
    if (isShoot) {
      ctx.fillStyle = '#aaa'
      ctx.fillRect(-1, -8, 2, 4)
    }
    ctx.restore()
  }
  drawShooter(lh.x, lh.y, laRot - .5)
  drawShooter(rh.x, rh.y, raRot + .5)

  // ─────────────────────────────────────────────────────────────────
  // NECK
  // ─────────────────────────────────────────────────────────────────
  ctx.beginPath(); ctx.ellipse(0, -21 + by, 6.5, 5.5, 0, 0, Math.PI*2)
  const ng = ctx.createLinearGradient(-6, -21+by, 6, -21+by)
  ng.addColorStop(0, R_DARK); ng.addColorStop(.5, R_BRIGHT); ng.addColorStop(1, R_DARK)
  ctx.fillStyle = ng; ctx.fill()

  // ─────────────────────────────────────────────────────────────────
  // HEAD
  // ─────────────────────────────────────────────────────────────────
  const hx = 0, hy = -40 + by

  // Head base
  ctx.beginPath(); ctx.ellipse(hx, hy, 19, 21, 0, 0, Math.PI*2)
  const hg = ctx.createRadialGradient(hx-5, hy-9, 2, hx, hy, 23)
  hg.addColorStop(0, R_LIGHT); hg.addColorStop(.3, R_BRIGHT)
  hg.addColorStop(.72, R_MID); hg.addColorStop(1, R_DARK)
  ctx.fillStyle = hg; ctx.fill()
  ctx.strokeStyle = R_DARK; ctx.lineWidth = .8; ctx.stroke()

  // Blue side panels on head (AG has deeper blue side panels)
  ctx.fillStyle = B_DARK; ctx.globalAlpha = .5
  ctx.beginPath(); ctx.ellipse(hx-14, hy+1, 7, 13, -.18, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(hx+14, hy+1, 7, 13, .18, 0, Math.PI*2); ctx.fill()
  ctx.globalAlpha = 1

  // Web lines on head
  ctx.strokeStyle = WEB_COL; ctx.lineWidth = .9; ctx.globalAlpha = .52
  ctx.beginPath(); ctx.moveTo(hx, hy-21); ctx.lineTo(hx, hy+21); ctx.stroke()
  for (let a = -.65; a <= .65; a += .22) {
    ctx.beginPath(); ctx.moveTo(hx, hy-21)
    ctx.lineTo(hx + Math.sin(a)*21, hy+21); ctx.stroke()
  }
  for (let r = 5; r <= 19; r += 5) {
    ctx.beginPath(); ctx.arc(hx, hy-21, r, .25, Math.PI-.25); ctx.stroke()
  }
  ctx.globalAlpha = 1

  // ── AMAZING SPIDER-MAN EYES ────────────────────────────────────
  // AG eyes are WIDE, HEXAGONAL, slightly angled — very iconic
  // Left eye
  const drawAGEye = (ex: number, ey: number, skew: number) => {
    ctx.save()
    ctx.translate(ex, ey)
    ctx.rotate(skew)

    // Black recess shadow
    ctx.beginPath()
    ctx.moveTo(-9.5, 1); ctx.lineTo(-5, -7.5); ctx.lineTo(5, -7.5)
    ctx.lineTo(9.5, 1); ctx.lineTo(5, 7); ctx.lineTo(-5, 7)
    ctx.closePath()
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fill()

    // White lens with blue tint (AG lenses have a slightly cold white)
    ctx.beginPath()
    ctx.moveTo(-8.5, .5); ctx.lineTo(-4.5, -6.5); ctx.lineTo(4.5, -6.5)
    ctx.lineTo(8.5, .5); ctx.lineTo(4.5, 6); ctx.lineTo(-4.5, 6)
    ctx.closePath()
    const eg = ctx.createRadialGradient(-2, -2, 1, 0, 0, 9)
    eg.addColorStop(0, '#ffffff')
    eg.addColorStop(.5, LENS_W)
    eg.addColorStop(1, LENS_B)
    ctx.fillStyle = eg; ctx.fill()
    ctx.strokeStyle = BLACK; ctx.lineWidth = 1.2; ctx.stroke()

    // Highlight streak (AG lenses have a sharp highlight)
    ctx.beginPath()
    ctx.moveTo(-3, -5.5); ctx.lineTo(2.5, -5.5); ctx.lineTo(3.5, -3)
    ctx.lineTo(-2, -3); ctx.closePath()
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill()

    // Subtle blue inner glow
    ctx.shadowColor = 'rgba(140,200,255,0.8)'; ctx.shadowBlur = 6
    ctx.fillStyle = 'rgba(180,220,255,0.1)'
    ctx.beginPath()
    ctx.moveTo(-7.5, .5); ctx.lineTo(-4, -6); ctx.lineTo(4, -6)
    ctx.lineTo(7.5, .5); ctx.lineTo(4, 5.5); ctx.lineTo(-4, 5.5)
    ctx.closePath(); ctx.fill()
    ctx.shadowBlur = 0

    ctx.restore()
  }

  drawAGEye(hx - 7.5, hy - 3.5, -.22)
  drawAGEye(hx + 7.5, hy - 3.5,  .22)

  ctx.restore()
}

// ─── WEB LINE ──────────────────────────────────────────────────────────────
function drawWebLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  sag: number, alpha: number,
) {
  const mx = (x1+x2)/2, my = (y1+y2)/2 + sag
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(mx,my,x2,y2)
  ctx.strokeStyle = `rgba(200,80,80,${alpha})`  // AG web is slightly warm toned
  ctx.lineWidth = 1.3; ctx.lineCap = 'round'; ctx.stroke()
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(mx,my-1,x2,y2)
  ctx.strokeStyle = `rgba(255,180,180,${alpha*.45})`; ctx.lineWidth = .4; ctx.stroke()
}

// ─── STAR ──────────────────────────────────────────────────────────────────
interface Star { x:number; y:number; vx:number; vy:number; life:number; maxLife:number; trail:{x:number,y:number}[]; w:number; col:string }
function newStar(W: number, H: number, init=false): Star {
  const cols = ['220,60,60','157,78,221','247,37,133','200,220,255']
  return {
    x: Math.random()*W*(init?.9:.6) - W*.05,
    y: Math.random()*H*(init?.5:.3) - 50,
    vx: Math.cos(.22*Math.PI + (Math.random()-.5)*.18) * (Math.random()*5+3),
    vy: Math.sin(.22*Math.PI + (Math.random()-.5)*.18) * (Math.random()*5+3),
    life: init ? Math.floor(Math.random()*60) : 0,
    maxLife: Math.random()*65+40,
    trail: [], w: Math.random()*1.1+.35,
    col: cols[Math.floor(Math.random()*cols.length)],
  }
}

// ─── PARTICLE ──────────────────────────────────────────────────────────────
interface Particle { x:number; y:number; vx:number; vy:number; r:number; o:number; phase:number }
function newParticle(W: number, H: number): Particle {
  return {
    x: Math.random()*W, y: Math.random()*H,
    vx: (Math.random()-.5)*.11, vy: (Math.random()-.5)*.11,
    r: Math.random()*.8+.15, o: Math.random()*.32+.07,
    phase: Math.random()*Math.PI*2,
  }
}

// ─── WEB TRAIL ─────────────────────────────────────────────────────────────
interface WebTrail { x1:number; y1:number; x2:number; y2:number; sag:number; alpha:number }

// ─── SPIDER STATE ──────────────────────────────────────────────────────────
type SpideyMode = 'swing'|'crawl'|'follow'|'flee'|'shoot'

// ═══════════════════════════════════════════════════════════════════════════
export default function UnifiedCanvas() {
  const cvRef     = useRef<HTMLCanvasElement>(null)
  const offRef    = useRef<HTMLCanvasElement | null>(null)
  const rafRef    = useRef(0)
  const mouseRef  = useRef({ nx:.5, ny:.35 })
  const activeRef = useRef(false)

  const [spideyOn, setSpideyOn] = useState(false)
  const [bubble, setBubble]     = useState({ text:'', visible:false, x:0, y:0 })
  const [btnPulse, setBtnPulse] = useState(false)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showBubble = useCallback((sx:number, sy:number, text?:string) => {
    const msg = text ?? QUIPS[Math.floor(Math.random()*QUIPS.length)]
    const bx  = Math.max(10, Math.min(sx-95, window.innerWidth-220))
    const by  = Math.max(10, sy-125)
    setBubble({ text:msg, visible:true, x:bx, y:by })
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
    bubbleTimer.current = setTimeout(()=>setBubble(b=>({...b,visible:false})), 4200)
  }, [])

  // Button pulse hint after 3s
  useEffect(()=>{
    const t1=setTimeout(()=>setBtnPulse(true),3000)
    const t2=setTimeout(()=>setBtnPulse(false),9000)
    return ()=>{clearTimeout(t1);clearTimeout(t2)}
  },[])

  // Keep activeRef in sync
  useEffect(()=>{ activeRef.current = spideyOn },[spideyOn])

  // ── THE UNIFIED LOOP ───────────────────────────────────────────────────
  useEffect(()=>{
    const cv  = cvRef.current!
    const ctx = cv.getContext('2d',{alpha:true})!

    // Off-screen canvas for Spider-Man body (prevents repaints bleeding)
    const off = document.createElement('canvas')
    off.width=170; off.height=190
    offRef.current = off
    const offCtx = off.getContext('2d')!

    let W = cv.width  = window.innerWidth
    let H = cv.height = window.innerHeight

    const onResize = ()=>{
      W = cv.width  = window.innerWidth
      H = cv.height = window.innerHeight
    }
    window.addEventListener('resize', onResize, {passive:true})

    // ── Mouse — throttled to 30fps ───────────────────────────────
    let lastMT = 0
    const onMouse=(e:MouseEvent)=>{
      const now=Date.now(); if(now-lastMT<33) return; lastMT=now
      mouseRef.current={nx:e.clientX/W, ny:e.clientY/H}
    }
    window.addEventListener('mousemove', onMouse, {passive:true})

    // ── Particles — created once ─────────────────────────────────
    const PCNT = 20
    const particles: Particle[] = Array.from({length:PCNT},()=>newParticle(W,H))

    // ── Stars ────────────────────────────────────────────────────
    const SCNT = 2
    const stars: Star[] = Array.from({length:SCNT},()=>newStar(W,H,true))

    // ── Spider-Man state ─────────────────────────────────────────
    const sp = {
      x:.5, y:.35,
      mode:'swing' as SpideyMode,
      angle:.32, angVel:-.02, ropeFrac:.35,
      anchorX:.5, facing:1,
      animT:0, modeTimer:240,
      frame:0,
      cfx:.5, cfy:.35, ctx2:.5, cty:.35, ct:0,  // crawl from/to
      webs:[] as WebTrail[],
      lastWX:0, lastWY:0,
    }
    sp.lastWX=sp.x*W; sp.lastWY=sp.y*H

    // ── Grid — draw to an ImageBitmap once, reuse ─────────────────
    let gridBitmap: ImageBitmap|null = null
    let gridW=0, gridH=0
    const buildGrid = async (w:number, h:number) => {
      const tmp = document.createElement('canvas')
      tmp.width=w; tmp.height=h
      const tc = tmp.getContext('2d')!
      const G=100
      tc.strokeStyle='rgba(0,212,255,0.002)'; tc.lineWidth=0.4
      tc.beginPath()
      for(let x=0;x<w;x+=G){tc.moveTo(x,0);tc.lineTo(x,h)}
      for(let y=0;y<h;y+=G){tc.moveTo(0,y);tc.lineTo(w,y)}
      tc.stroke()
      gridBitmap = await createImageBitmap(tmp)
      gridW=w; gridH=h
    }
    buildGrid(W,H)

    // ── Main loop counter ─────────────────────────────────────────
    let frame=0

    const loop=()=>{
      rafRef.current = requestAnimationFrame(loop)
      frame++
      ctx.clearRect(0,0,W,H)

      // Rebuild grid if size changed
      if(gridW!==W||gridH!==H) buildGrid(W,H)

      // ── Grid (every 8th frame) ────────────────────────────────
      if(frame%8===0 && gridBitmap) ctx.drawImage(gridBitmap,0,0)

      // ── Mouse glow ────────────────────────────────────────────
      const mx=mouseRef.current.nx*W, my=mouseRef.current.ny*H
      const ga=ctx.createRadialGradient(mx,my,0,mx,my,190)
      ga.addColorStop(0,'rgba(0,212,255,0.012)'); ga.addColorStop(1,'rgba(0,212,255,0)')
      ctx.fillStyle=ga; ctx.fillRect(mx-190,my-190,380,380)

      // ── Particles ─────────────────────────────────────────────
      const t2=frame*.00013
      for(let i=0;i<particles.length;i++){
        const p=particles[i]
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0)p.x=W; else if(p.x>W)p.x=0
        if(p.y<0)p.y=H; else if(p.y>H)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(0,212,255,${p.o*(0.25+0.35*Math.sin(t2+p.phase))})`;ctx.fill()
      }
      // Connections — O(n/2 * n/2) with early exit
      for(let i=0;i<particles.length-1;i+=2){
        for(let j=i+2;j<particles.length;j+=2){
          const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y
          if(Math.abs(dx)>120||Math.abs(dy)>120) continue
          const d=Math.sqrt(dx*dx+dy*dy)
          if(d<120){
            ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y)
            ctx.lineTo(particles[j].x,particles[j].y)
            ctx.strokeStyle=`rgba(0,212,255,${.012*(1-d/120)})`
            ctx.lineWidth=.4; ctx.stroke()
          }
        }
      }

      // ── Shooting stars ────────────────────────────────────────
      for(let i=0;i<stars.length;i++){
        const st=stars[i]
        st.x+=st.vx; st.y+=st.vy
        st.trail.unshift({x:st.x,y:st.y})
        if(st.trail.length>18) st.trail.pop()
        st.life++
        if(st.life>st.maxLife||st.x>W+50||st.y>H+50) {
          stars[i]=newStar(W,H); continue
        }
        const alpha=st.life<8?st.life/8:st.life>st.maxLife-8?(st.maxLife-st.life)/8:1
        for(let k=0;k<st.trail.length;k++){
          const a=alpha*(1-k/st.trail.length)*.8
          const r=Math.max(st.w*(1-k/st.trail.length*.85),.08)
          ctx.beginPath(); ctx.arc(st.trail[k].x,st.trail[k].y,r,0,Math.PI*2)
          ctx.fillStyle=`rgba(${st.col},${a})`; ctx.fill()
        }
      }

      // ── Spider-Man ────────────────────────────────────────────
      if(activeRef.current){
        sp.frame++; sp.animT+=.052; sp.modeTimer--

        const nmx=mouseRef.current.nx, nmy=mouseRef.current.ny

        // State machine
        if(sp.mode==='swing'){
          sp.angVel+=-.005*Math.sin(sp.angle); sp.angVel*=.9975
          sp.angle+=sp.angVel
          sp.angle=Math.max(-1.05,Math.min(1.05,sp.angle))
          if(Math.abs(sp.angle)>=1.05) sp.angVel*=-.78
          const rl=sp.ropeFrac*(H/W)
          sp.x=sp.anchorX+Math.sin(sp.angle)*rl
          sp.y=sp.ropeFrac*(1-Math.cos(Math.abs(sp.angle)))*.28+.18
          sp.facing=sp.angVel>0?1:-1
          if(sp.modeTimer<=0){
            const r=Math.random()
            if(r<.22){
              sp.mode='crawl'; sp.cfx=sp.x; sp.cfy=sp.y; sp.ct=0
              const e=Math.floor(Math.random()*4)
              if(e===0){sp.ctx2=Math.random()*.6+.2;sp.cty=.15}
              else if(e===1){sp.ctx2=Math.random()*.6+.2;sp.cty=.82}
              else if(e===2){sp.ctx2=.04;sp.cty=Math.random()*.6+.15}
              else{sp.ctx2=.96;sp.cty=Math.random()*.6+.15}
            } else if(r<.37){sp.mode='follow';sp.modeTimer=160}
            else if(r<.48){sp.mode='flee';sp.modeTimer=120}
            else if(r<.55){sp.mode='shoot';sp.modeTimer=52}
            else{sp.modeTimer=240+Math.floor(Math.random()*130)}
          }

        } else if(sp.mode==='crawl'){
          sp.ct+=.014
          const t=Math.min(sp.ct,1), e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2
          sp.x=sp.cfx+(sp.ctx2-sp.cfx)*e
          sp.y=sp.cfy+(sp.cty-sp.cfy)*e
          sp.facing=sp.ctx2>sp.cfx?1:-1
          if(t>=1){
            showBubble(sp.x*W, sp.y*H)
            sp.mode='swing'
            sp.angle=(sp.x-sp.anchorX)/(sp.ropeFrac*(H/W))
            sp.angVel=.016*sp.facing; sp.modeTimer=200+Math.floor(Math.random()*110)
          }

        } else if(sp.mode==='follow'){
          sp.x+=(nmx-sp.x)*.042; sp.y+=(nmy-sp.y)*.042
          sp.facing=nmx>sp.x?1:-1
          if(sp.modeTimer<=0){
            showBubble(sp.x*W,sp.y*H,"Caught up! 🕸️")
            sp.mode='swing'; sp.angle=(sp.x-sp.anchorX)/(sp.ropeFrac*(H/W))
            sp.angVel=.016*sp.facing; sp.modeTimer=220
          }

        } else if(sp.mode==='flee'){
          const dx=sp.x-nmx, dy=sp.y-nmy
          const d=Math.sqrt(dx*dx+dy*dy)||.01
          sp.x=Math.max(.03,Math.min(.97,sp.x+(dx/d)*.042))
          sp.y=Math.max(.05,Math.min(.92,sp.y+(dy/d)*.042))
          sp.facing=dx>0?1:-1
          if(sp.modeTimer<=0){
            showBubble(sp.x*W,sp.y*H,"Back off! 😤")
            sp.mode='swing'; sp.angle=(sp.x-sp.anchorX)/(sp.ropeFrac*(H/W))
            sp.angVel=.016*sp.facing; sp.modeTimer=220
          }

        } else if(sp.mode==='shoot'){
          if(sp.modeTimer<=0){
            showBubble(sp.x*W,sp.y*H,"THWIP! 🕸️")
            sp.webs.push({x1:sp.x*W,y1:sp.y*H,x2:nmx*W,y2:nmy*H,sag:45,alpha:.7})
            sp.mode='swing'; sp.modeTimer=210
          }
        }

        sp.x=Math.max(.03,Math.min(.97,sp.x))
        sp.y=Math.max(.05,Math.min(.92,sp.y))

        const sx=sp.x*W, sy=sp.y*H

        // Web trails
        const dwx=sx-sp.lastWX, dwy=sy-sp.lastWY
        if(Math.sqrt(dwx*dwx+dwy*dwy)>38 && frame%5===0){
          sp.webs.push({x1:sp.lastWX,y1:sp.lastWY,x2:sx,y2:sy,sag:18,alpha:.5})
          sp.lastWX=sx; sp.lastWY=sy
          if(sp.webs.length>16) sp.webs.shift()
        }
        sp.webs.forEach(w=>{w.alpha-=.0022})
        sp.webs=sp.webs.filter(w=>w.alpha>.01)

        // Draw swing rope
        if(sp.mode==='swing'){
          const ax=sp.anchorX*W
          drawWebLine(ctx,ax,0,sx,sy,30+Math.abs(sp.angle)*22,.82)
          ctx.beginPath(); ctx.arc(ax,2,3,0,Math.PI*2)
          ctx.fillStyle='rgba(200,80,80,0.85)'; ctx.fill()
        }

        // Web trails
        sp.webs.forEach(w=>drawWebLine(ctx,w.x1,w.y1,w.x2,w.y2,w.sag,w.alpha))

        // Draw Spider-Man on offscreen then blit
        offCtx.clearRect(0,0,170,190)
        const pose: 'swing'|'crawl'|'run'|'shoot' =
          sp.mode==='shoot'?'shoot': sp.mode==='crawl'?'crawl':
          (sp.mode==='follow'||sp.mode==='flee')?'run':'swing'

        drawAmazingSpiderMan(offCtx,85,95,.8,sp.facing,pose,sp.animT)

        // Shadow glow on main canvas
        ctx.save()
        ctx.shadowColor='rgba(180,20,20,0.3)'; ctx.shadowBlur=20
        ctx.drawImage(off,sx-85,sy-95)
        ctx.shadowBlur=0
        ctx.restore()
      }
    }

    loop()

    return ()=>{
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize',onResize)
      window.removeEventListener('mousemove',onMouse)
    }
  },[showBubble])

  // First-time bubble
  useEffect(()=>{
    if(!spideyOn) return
    const t=setTimeout(()=>
      showBubble(window.innerWidth*.58,window.innerHeight*.2,
        "Amazing Spider-Man\nis on the case! 🕷️"), 700)
    return ()=>clearTimeout(t)
  },[spideyOn,showBubble])

  // Periodic quips
  useEffect(()=>{
    if(!spideyOn) return
    const iv=setInterval(()=>{
      if(Math.random()<.38){
        const W=window.innerWidth,H=window.innerHeight
        // read pos directly from ref
        const cv=cvRef.current
        if(cv) showBubble(W*.55,H*.22)
      }
    },11000)
    return ()=>clearInterval(iv)
  },[spideyOn,showBubble])

  return (
    <>
      {/* Single unified canvas */}
      <canvas
        ref={cvRef}
        onClick={()=>{ if(spideyOn) showBubble(window.innerWidth*.5,window.innerHeight*.3) }}
        style={{
          position:'fixed', inset:0, zIndex:0,
          pointerEvents: spideyOn ? 'auto' : 'none',
          width:'100vw', height:'100vh',
          willChange:'transform',
        }}
      />

      {/* Speech bubble */}
      {spideyOn && bubble.visible && (
        <div style={{
          position:'fixed', left:bubble.x, top:bubble.y,
          zIndex:1001, pointerEvents:'none',
          animation:'agPop .26s cubic-bezier(.34,1.56,.64,1)',
        }}>
          <div style={{
            background:'#fff', color:'#111',
            padding:'10px 14px', borderRadius:13,
            fontSize:13, fontWeight:700,
            fontFamily:"'Comic Sans MS','Chalkboard SE',cursive",
            lineHeight:1.55, maxWidth:205,
            boxShadow:'0 6px 26px rgba(0,0,0,.5), 0 0 0 2.5px #b01010',
            whiteSpace:'pre-line', position:'relative',
          }}>
            {bubble.text}
            <div style={{position:'absolute',bottom:-10,left:20,
              borderLeft:'9px solid transparent',borderRight:'9px solid transparent',
              borderTop:'11px solid #fff'}}/>
            <div style={{position:'absolute',bottom:-14,left:17,
              borderLeft:'12px solid transparent',borderRight:'12px solid transparent',
              borderTop:'14px solid #b01010',zIndex:-1}}/>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={()=>setSpideyOn(v=>!v)}
        title={spideyOn?'Send Spider-Man away':'Summon Amazing Spider-Man! 🕷️'}
        style={{
          position:'fixed', bottom:28, right:28, zIndex:1002,
          width:58, height:58, borderRadius:'50%', border:'none',
          cursor:'pointer', padding:0, overflow:'hidden',
          background: spideyOn
            ? 'linear-gradient(135deg,#7a0000,#b01010)'
            : 'linear-gradient(135deg,#060820,#0e1545)',
          boxShadow: spideyOn
            ? '0 0 0 3px rgba(176,16,16,.5), 0 8px 28px rgba(176,16,16,.65)'
            : btnPulse
              ? '0 0 0 8px rgba(14,21,69,.2), 0 8px 30px rgba(14,21,69,.6)'
              : '0 0 0 2.5px rgba(14,21,69,.4), 0 6px 20px rgba(0,0,0,.55)',
          transform: btnPulse&&!spideyOn?'scale(1.1)':'scale(1)',
          transition:'all .22s ease',
          animation: btnPulse&&!spideyOn?'agBtn 1.3s ease-in-out infinite':'none',
        }}
      >
        {/* AG-style button icon — hexagonal eyes */}
        <svg viewBox="0 0 58 58" width="58" height="58">
          {[0,45,90,135,180,225,270,315].map((a,i)=>(
            <line key={i} x1="29" y1="29"
              x2={29+Math.cos(a*Math.PI/180)*27} y2={29+Math.sin(a*Math.PI/180)*27}
              stroke="rgba(255,255,255,0.13)" strokeWidth=".8"/>
          ))}
          {[9,16,23].map((r,i)=>(
            <circle key={i} cx="29" cy="29" r={r}
              fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth=".8"/>
          ))}
          {/* AG hexagonal left eye */}
          <polygon points="13,17 18,14 24,14 27,17 24,22 18,22"
            fill={spideyOn?'white':'rgba(255,255,255,0.72)'}/>
          {/* AG hexagonal right eye */}
          <polygon points="31,17 34,14 40,14 45,17 40,22 34,22"
            fill={spideyOn?'white':'rgba(255,255,255,0.72)'}/>
          {/* Eye sheens */}
          <polygon points="13.5,17.5 16,15.5 20,15.5 22,17.5"
            fill="rgba(255,255,255,0.6)"/>
          <polygon points="31.5,17.5 33.5,15.5 37,15.5 39,17.5"
            fill="rgba(255,255,255,0.6)"/>
          {/* Spider */}
          <ellipse cx="29" cy="37" rx="3.5" ry="5" fill="white" opacity=".82"/>
          <ellipse cx="29" cy="44" rx="3" ry="4" fill="white" opacity=".82"/>
          {[[-4,36,-11,31],[-4,39,-12,39],[-4,42,-10,47],
            [4,36,11,31],[4,39,12,39],[4,42,10,47]].map(([x1,y1,x2,y2],i)=>(
            <line key={i} x1={x1+29} y1={y1} x2={x2+29} y2={y2}
              stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity=".78"/>
          ))}
        </svg>
      </button>

      {/* Tooltip */}
      {!spideyOn && btnPulse && (
        <div style={{
          position:'fixed', bottom:94, right:14, zIndex:1002,
          background:'rgba(6,8,32,.92)', color:'white',
          padding:'6px 13px', borderRadius:8,
          fontSize:12, fontFamily:'Share Tech Mono,monospace',
          whiteSpace:'nowrap', pointerEvents:'none',
          border:'1px solid rgba(176,16,16,.55)',
          animation:'agPop .28s ease',
          boxShadow:'0 4px 14px rgba(0,0,0,.55)',
        }}>
          🕷️ Summon Amazing Spider-Man!
        </div>
      )}

      <style>{`
        @keyframes agPop {
          from{transform:scale(.4) translateY(8px);opacity:0}
          to{transform:scale(1) translateY(0);opacity:1}
        }
        @keyframes agBtn {
          0%,100%{box-shadow:0 0 0 2.5px rgba(14,21,69,.4),0 6px 20px rgba(0,0,0,.55)}
          50%{box-shadow:0 0 0 11px rgba(14,21,69,.1),0 8px 32px rgba(14,21,69,.5)}
        }
      `}</style>
    </>
  )
}
