import { useEffect, useRef } from 'react'

export const ParallaxBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let frame = 0
    let mxT = W/2, myT = H/2, mx = W/2, my = H/2
    let scrollY = 0

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; buildCity() }
    const onMouse  = (e: MouseEvent) => { mxT = e.clientX; myT = e.clientY }
    const onScroll = () => { scrollY = window.scrollY }
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── STARS ──────────────────────────────────────────────────────
    type Star = { x:number; y:number; z:number; r:number; bright:number; spd:number; col:string }
    const COLS = ['255,255,255','200,225,255','255,205,180','180,205,255','255,240,195','195,255,240']
    const stars: Star[] = Array.from({length:420}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      z: Math.random(), r: Math.random()*1.7+0.15,
      bright: Math.random(), spd: Math.random()*0.028+0.008,
      col: COLS[Math.floor(Math.random()*COLS.length)]
    }))

    // ── NEBULA CLOUDS ─────────────────────────────────────────────
    const nebulas = [
      { fx:0.15, fy:0.18, hue:195, r:600, spd:0.0016, ph:0 },
      { fx:0.85, fy:0.30, hue:275, r:650, spd:0.0012, ph:2.1 },
      { fx:0.50, fy:0.55, hue:155, r:520, spd:0.002, ph:4.4 },
      { fx:0.25, fy:0.70, hue:330, r:420, spd:0.0025, ph:1.1 },
      { fx:0.75, fy:0.65, hue:230, r:480, spd:0.0018, ph:3.3 },
    ]

    // ── AURORA BANDS ─────────────────────────────────────────────
    const auroras = [
      { fy:0.10, hue:165, hue2:195, spd:0.0055, w:0.60, ph:0 },
      { fy:0.24, hue:275, hue2:310, spd:0.0042, w:0.50, ph:2.1 },
      { fy:0.06, hue:195, hue2:225, spd:0.007,  w:0.38, ph:4.2 },
      { fy:0.32, hue:145, hue2:175, spd:0.005,  w:0.30, ph:0.9 },
    ]

    // ── SHOOTING STARS ────────────────────────────────────────────
    type SS = { x:number; y:number; vx:number; vy:number; len:number; life:number; max:number; hue:number }
    const shooters: SS[] = []
    let nextShoot = 120

    // ── LENS FLARES ───────────────────────────────────────────────
    const flares = [
      { fx:0.12, fy:0.10, hue:185, size:110, intense:0.45 },
      { fx:0.88, fy:0.08, hue:275, size:95,  intense:0.38 },
      { fx:0.55, fy:0.03, hue:220, size:70,  intense:0.25 },
    ]

    // ── HOLO RINGS ────────────────────────────────────────────────
    type Ring = { x:number; y:number; r:number; maxR:number; alpha:number; hue:number; spd:number; dash:boolean }
    const rings: Ring[] = []
    let nextRing = 180

    // ── FLOATING PARTICLES ────────────────────────────────────────
    type FP = { x:number; y:number; vx:number; vy:number; r:number; hue:number; al:number; ph:number }
    const floats: FP[] = Array.from({length:70}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.4, vy: -Math.random()*0.7-0.1,
      r: Math.random()*2.4+0.3,
      hue: [185,275,330,55,155][Math.floor(Math.random()*5)],
      al: Math.random()*0.55+0.12,
      ph: Math.random()*Math.PI*2
    }))

    // ── CITY SILHOUETTE ───────────────────────────────────────────
    type Win = { wx:number; wy:number; ww:number; wh:number; lit:boolean; hue:number; flicker:number }
    type Bldg = { x:number; w:number; h:number; windows:Win[]; antH:boolean }
    let buildings: Bldg[] = []

    const buildCity = () => {
      buildings = []
      let bx = -20
      while (bx < W + 100) {
        const bw = Math.random()*60+20
        const bh = Math.random()*H*0.30+H*0.05
        const wins: Win[] = []
        const cols = Math.floor(bw/11)
        const rows = Math.floor(bh/15)
        for (let r=0; r<rows; r++) {
          for (let c=0; c<cols; c++) {
            wins.push({
              wx: c*11+3, wy: r*15+4, ww:5, wh:7,
              lit: Math.random()>0.40,
              hue: Math.random()>0.65 ? 185 : Math.random()>0.5 ? 48 : 275,
              flicker: Math.random()
            })
          }
        }
        buildings.push({ x:bx, w:bw, h:bh, windows:wins, antH: bh>H*0.18 })
        bx += bw + Math.random()*5
      }
    }
    buildCity()

    // ── GRID LINES (cyberpunk floor) ──────────────────────────────
    const drawGrid = (px: number) => {
      const gY = H - H*0.16
      ctx.save()
      ctx.globalAlpha = 0.04
      // horizontal lines
      for (let i=0; i<8; i++) {
        const t = i/8
        const y2 = gY + t*(H-gY)*1.8
        const alpha = (1-t)*0.08
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(0,y2); ctx.lineTo(W,y2); ctx.stroke()
      }
      // vertical lines perspective
      const vp = { x: W/2 + px*30, y: gY }
      for (let i=-12; i<=12; i++) {
        const bx2 = W/2 + i*(W/16)
        const alpha = Math.max(0, 0.05 - Math.abs(i)*0.003)
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`
        ctx.lineWidth = 0.4
        ctx.beginPath(); ctx.moveTo(bx2, H); ctx.lineTo(vp.x, vp.y); ctx.stroke()
      }
      ctx.restore()
    }

    const drawLensFlare = (fx: number, fy: number, hue: number, size: number, intense: number) => {
      const pulse = intense * (0.65 + 0.35*Math.sin(frame*0.04))
      // core glow
      const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, size)
      g.addColorStop(0,   `hsla(${hue},100%,95%,${pulse*0.9})`)
      g.addColorStop(0.08,`hsla(${hue},100%,80%,${pulse*0.55})`)
      g.addColorStop(0.3, `hsla(${hue},90%,65%,${pulse*0.18})`)
      g.addColorStop(0.7, `hsla(${hue},80%,55%,${pulse*0.06})`)
      g.addColorStop(1,   `hsla(${hue},70%,45%,0)`)
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(fx, fy, size, 0, Math.PI*2); ctx.fill()
      // cross streaks
      ctx.save(); ctx.globalAlpha = pulse*0.22
      ctx.strokeStyle = `hsl(${hue},100%,90%)`
      for (let a=0; a<4; a++) {
        const angle = a*Math.PI/2 + frame*0.003
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(fx+Math.cos(angle)*6, fy+Math.sin(angle)*6)
        ctx.lineTo(fx+Math.cos(angle)*size*0.9, fy+Math.sin(angle)*size*0.18)
        ctx.stroke()
      }
      // inner white dot
      ctx.globalAlpha = pulse*0.85
      ctx.beginPath(); ctx.arc(fx, fy, 3.5, 0, Math.PI*2)
      ctx.fillStyle = '#ffffff'; ctx.fill()
      ctx.restore()
    }

    const raf = { id: 0 }

    const loop = () => {
      raf.id = requestAnimationFrame(loop)
      frame++

      // smooth mouse
      mx += (mxT-mx)*0.045
      my += (myT-my)*0.045
      const px = (mx/W-0.5), py = (my/H-0.5)
      const sf = Math.min(scrollY/(document.body.scrollHeight-H||1), 1)

      // ── DEEP SPACE BG ─────────────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0,   '#000510')
      bg.addColorStop(0.25,'#010820')
      bg.addColorStop(0.55,'#020518')
      bg.addColorStop(0.80,'#01030e')
      bg.addColorStop(1,   '#000208')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

      // ── NEBULA CLOUDS ─────────────────────────────────────────
      ctx.save()
      nebulas.forEach(n => {
        n.ph += n.spd
        const nx = n.fx*W + Math.sin(n.ph)*60 + px*80*(n.fx+0.3)
        const ny = n.fy*H + Math.cos(n.ph*0.7)*40 + py*50*(n.fy+0.3)
        const h2 = n.hue + Math.sin(n.ph*2)*30
        const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r)
        ng.addColorStop(0,   `hsla(${n.hue},100%,55%,0.045)`)
        ng.addColorStop(0.25,`hsla(${h2},90%,50%,0.03)`)
        ng.addColorStop(0.6, `hsla(${n.hue+40},80%,45%,0.015)`)
        ng.addColorStop(1,   `hsla(${n.hue},70%,40%,0)`)
        ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(nx, ny, n.r, 0, Math.PI*2); ctx.fill()
        // inner bright core
        const nc = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r*0.25)
        nc.addColorStop(0,  `hsla(${n.hue},100%,75%,0.06)`)
        nc.addColorStop(1,  `hsla(${n.hue},80%,60%,0)`)
        ctx.fillStyle = nc; ctx.beginPath(); ctx.arc(nx, ny, n.r*0.25, 0, Math.PI*2); ctx.fill()
      })
      ctx.restore()

      // ── AURORA BOREALIS ────────────────────────────────────────
      ctx.save()
      auroras.forEach(a => {
        a.ph += a.spd
        const ay = a.fy*H + Math.sin(a.ph)*H*0.04 + py*25
        const gh = H*a.w
        for (let x2=0; x2<W; x2+=2) {
          const wave  = Math.sin(x2*0.009+a.ph*2.8)*0.5 + Math.sin(x2*0.003+a.ph)*0.5
          const yS    = wave*gh*0.20 + px*22
          const lal   = (Math.sin(x2*0.005+a.ph*1.8)*0.5+0.5) * 0.065
          if (lal < 0.004) continue
          const hShift = a.hue + wave*35
          const ag = ctx.createLinearGradient(x2, ay+yS-gh*0.12, x2, ay+yS+gh)
          ag.addColorStop(0,   `hsla(${hShift},100%,70%,0)`)
          ag.addColorStop(0.18,`hsla(${hShift},95%,65%,${lal*0.75})`)
          ag.addColorStop(0.50,`hsla(${a.hue2||hShift+25},90%,60%,${lal})`)
          ag.addColorStop(0.80,`hsla(${hShift+50},85%,55%,${lal*0.5})`)
          ag.addColorStop(1,   `hsla(${hShift},80%,45%,0)`)
          ctx.fillStyle = ag
          ctx.fillRect(x2, ay+yS-gh*0.12, 2, gh*1.15)
        }
        // brighter shimmer streaks inside aurora
        ctx.globalAlpha = 0.018
        for (let s=0; s<3; s++) {
          const sx = (x2 => x2)(((frame*0.4+s*280)%W))
          const sg = ctx.createLinearGradient(sx-80, ay, sx+80, ay+gh*0.3)
          sg.addColorStop(0, 'transparent')
          sg.addColorStop(0.5,`hsla(${a.hue},100%,90%,1)`)
          sg.addColorStop(1,  'transparent')
          ctx.fillStyle = sg; ctx.fillRect(sx-80, ay, 160, gh*0.3)
        }
        ctx.globalAlpha = 1
      })
      ctx.restore()

      // ── STARS ─────────────────────────────────────────────────
      for (let i=0; i<stars.length; i++) {
        const s = stars[i]
        const tw   = Math.sin(frame*s.spd + s.bright*9)*0.5+0.5
        const al   = s.bright*0.4 + tw*0.6
        const sx   = s.x + px*s.z*-40
        const sy   = s.y + py*s.z*-24 + sf*s.z*-70
        const dr   = s.r*(0.35+s.z*0.85)
        ctx.beginPath(); ctx.arc(sx, sy, Math.max(0.15,dr), 0, Math.PI*2)
        ctx.fillStyle = `rgba(${s.col},${al*(0.3+s.z*0.7)})`; ctx.fill()
        // sparkle cross for brightest stars
        if (s.r > 1.2 && tw > 0.75 && s.z > 0.6) {
          ctx.save(); ctx.globalAlpha = (tw-0.75)*al*0.6
          ctx.strokeStyle = `rgba(${s.col},1)`; ctx.lineWidth = 0.5
          for (let a=0; a<4; a++) {
            ctx.beginPath()
            ctx.moveTo(sx, sy)
            ctx.lineTo(sx+Math.cos(a*Math.PI/2)*dr*5, sy+Math.sin(a*Math.PI/2)*dr*2.5)
            ctx.stroke()
          }
          ctx.restore()
        }
      }

      // ── SHOOTING STARS ────────────────────────────────────────
      nextShoot--
      if (nextShoot <= 0) {
        shooters.push({
          x: Math.random()*W*1.2-W*0.1, y: Math.random()*H*0.45,
          vx: 5+Math.random()*7, vy: 1.5+Math.random()*4,
          len: 90+Math.random()*110, life:0, max:45+Math.random()*50,
          hue: [185,275,50,0,155][Math.floor(Math.random()*5)]
        })
        nextShoot = 140+Math.random()*220
      }
      for (let i=shooters.length-1; i>=0; i--) {
        const s=shooters[i]; s.life++; s.x+=s.vx; s.y+=s.vy
        if (s.life>s.max||s.x>W+300||s.y>H+200) { shooters.splice(i,1); continue }
        const p=s.life/s.max
        const al=p<0.18?p/0.18 : p>0.65?(1-p)/0.35 : 1
        ctx.save()
        const sg=ctx.createLinearGradient(s.x,s.y,s.x-s.vx/7*s.len,s.y-s.vy/7*s.len)
        sg.addColorStop(0,`hsla(${s.hue},100%,95%,${al*0.95})`)
        sg.addColorStop(0.25,`hsla(${s.hue},90%,75%,${al*0.5})`)
        sg.addColorStop(0.7,`hsla(${s.hue},80%,60%,${al*0.15})`)
        sg.addColorStop(1,`hsla(${s.hue},70%,50%,0)`)
        ctx.strokeStyle=sg; ctx.lineWidth=1.8*al; ctx.lineCap='round'
        ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.vx/7*s.len,s.y-s.vy/7*s.len); ctx.stroke()
        // head spark
        ctx.beginPath(); ctx.arc(s.x,s.y,2.5*al,0,Math.PI*2)
        ctx.fillStyle=`hsla(${s.hue},100%,98%,${al})`; ctx.fill()
        // mini flare at head
        const hg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,18*al)
        hg.addColorStop(0,`hsla(${s.hue},100%,90%,${al*0.4})`)
        hg.addColorStop(1,`hsla(${s.hue},80%,70%,0)`)
        ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(s.x,s.y,18*al,0,Math.PI*2); ctx.fill()
        ctx.restore()
      }

      // ── LENS FLARES ───────────────────────────────────────────
      flares.forEach(f => drawLensFlare(
        f.fx*W + px*-28, f.fy*H + py*-16, f.hue, f.size, f.intense
      ))

      // ── HOLO RINGS ────────────────────────────────────────────
      nextRing--
      if (nextRing<=0) {
        rings.push({
          x:Math.random()*W*0.8+W*0.1, y:Math.random()*H*0.55,
          r:0, maxR:100+Math.random()*200, alpha:0.55,
          hue:[185,275,50,155][Math.floor(Math.random()*4)],
          spd:0.9+Math.random()*1.8, dash:Math.random()>0.5
        })
        nextRing=100+Math.random()*160
      }
      for (let i=rings.length-1; i>=0; i--) {
        const rg=rings[i]; rg.r+=rg.spd; rg.alpha-=0.0038
        if (rg.alpha<=0) { rings.splice(i,1); continue }
        ctx.save(); ctx.globalAlpha=rg.alpha
        ctx.shadowColor=`hsl(${rg.hue},100%,70%)`; ctx.shadowBlur=12
        ctx.strokeStyle=`hsl(${rg.hue},100%,72%)`; ctx.lineWidth=1.5
        if (rg.dash) ctx.setLineDash([4,8])
        ctx.beginPath(); ctx.arc(rg.x,rg.y,rg.r,0,Math.PI*2); ctx.stroke()
        ctx.setLineDash([])
        // inner ring
        if (rg.r>20) {
          ctx.lineWidth=0.6; ctx.globalAlpha=rg.alpha*0.35
          ctx.beginPath(); ctx.arc(rg.x,rg.y,rg.r*0.65,0,Math.PI*2); ctx.stroke()
        }
        ctx.restore()
      }

      // ── FLOATING PARTICLES ────────────────────────────────────
      for (let i=0; i<floats.length; i++) {
        const p=floats[i]
        p.x += p.vx + Math.sin(frame*0.009+p.ph)*0.35
        p.y += p.vy
        if (p.y<-12) { p.y=H+12; p.x=Math.random()*W }
        if (p.x<-12) p.x=W+12
        if (p.x>W+12) p.x=-12
        const pulse=Math.sin(frame*0.022+p.ph)*0.35+0.65
        const gp=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3.5*pulse)
        gp.addColorStop(0,`hsla(${p.hue},100%,75%,${p.al*pulse})`)
        gp.addColorStop(0.5,`hsla(${p.hue},90%,65%,${p.al*pulse*0.4})`)
        gp.addColorStop(1,`hsla(${p.hue},80%,55%,0)`)
        ctx.fillStyle=gp; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*3.5*pulse,0,Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*0.5,0,Math.PI*2)
        ctx.fillStyle=`hsla(${p.hue},100%,92%,${p.al*pulse*0.8})`; ctx.fill()
      }

      // ── CITY SILHOUETTE ───────────────────────────────────────
      const cityY = H - H*0.20
      const cpx   = px*22

      // distant glow behind city
      const cg = ctx.createLinearGradient(0, cityY-80, 0, H)
      cg.addColorStop(0, 'rgba(0,180,255,0)')
      cg.addColorStop(0.3,'rgba(0,120,200,0.055)')
      cg.addColorStop(0.65,'rgba(0,80,170,0.11)')
      cg.addColorStop(1,   'rgba(0,40,130,0.18)')
      ctx.fillStyle=cg; ctx.fillRect(0,cityY-80,W,H-cityY+80)

      // buildings
      buildings.forEach(b => {
        const bTop = H - b.h
        // building body
        const bgrad = ctx.createLinearGradient(b.x,bTop,b.x+b.w,bTop)
        bgrad.addColorStop(0,'#020810')
        bgrad.addColorStop(0.5,'#030c16')
        bgrad.addColorStop(1,'#020810')
        ctx.fillStyle=bgrad; ctx.fillRect(b.x+cpx, bTop, b.w, b.h)
        // edge glow
        ctx.save()
        ctx.globalAlpha=0.25
        const eg=ctx.createLinearGradient(b.x+cpx,bTop,b.x+cpx+2,bTop)
        eg.addColorStop(0,'rgba(0,180,255,0.3)')
        eg.addColorStop(1,'rgba(0,180,255,0)')
        ctx.fillStyle=eg; ctx.fillRect(b.x+cpx,bTop,2,b.h)
        ctx.restore()
        // windows
        b.windows.forEach(w => {
          if (!w.lit) return
          const wink = Math.sin(frame*0.0015+b.x*0.08+w.wy*0.12+w.flicker*10) > 0.97
          if (wink) return
          const al2 = 0.5+0.3*Math.sin(frame*0.006+w.flicker*20)
          ctx.fillStyle=`hsla(${w.hue},75%,78%,${al2})`
          ctx.fillRect(b.x+w.wx+cpx, bTop+w.wy, w.ww, w.wh)
          // window glow
          ctx.save(); ctx.globalAlpha=al2*0.35
          ctx.shadowColor=`hsl(${w.hue},80%,75%)`; ctx.shadowBlur=6
          ctx.fillRect(b.x+w.wx+cpx, bTop+w.wy, w.ww, w.wh)
          ctx.restore()
        })
        // antenna blink
        if (b.antH) {
          const al3 = Math.sin(frame*0.06+b.x*0.015)>0 ? 0.95 : 0.08
          ctx.beginPath(); ctx.arc(b.x+b.w/2+cpx, bTop-5, 2.2, 0, Math.PI*2)
          ctx.fillStyle=`rgba(255,55,55,${al3})`; ctx.fill()
          if (al3>0.5) {
            ctx.save(); ctx.globalAlpha=al3*0.3
            ctx.shadowColor='#ff3333'; ctx.shadowBlur=10
            ctx.beginPath(); ctx.arc(b.x+b.w/2+cpx, bTop-5, 2.2, 0, Math.PI*2)
            ctx.fillStyle='#ff3333'; ctx.fill()
            ctx.restore()
          }
        }
      })

      // cyberpunk grid on floor
      drawGrid(px)

      // city reflection
      ctx.save(); ctx.globalAlpha=0.055
      ctx.transform(1,0,0,-0.28,0,H+H*0.02)
      buildings.forEach(b => {
        const bTop=H-b.h
        ctx.fillStyle='#0a1528'; ctx.fillRect(b.x+cpx,bTop,b.w,b.h)
      })
      ctx.restore()

      // ground fog
      const fog=ctx.createLinearGradient(0,cityY-30,0,H)
      fog.addColorStop(0,'rgba(0,8,22,0)')
      fog.addColorStop(0.35,'rgba(0,5,16,0.55)')
      fog.addColorStop(0.70,'rgba(0,3,12,0.82)')
      fog.addColorStop(1,'rgba(0,1,8,0.97)')
      ctx.fillStyle=fog; ctx.fillRect(0,cityY-30,W,H-cityY+30)

      // ── VIGNETTE ──────────────────────────────────────────────
      const vig=ctx.createRadialGradient(W/2+px*40,H/2+py*25,W*0.18,W/2,H/2,W*0.85)
      vig.addColorStop(0,'rgba(0,0,0,0)')
      vig.addColorStop(0.6,'rgba(0,0,8,0.15)')
      vig.addColorStop(1,'rgba(0,0,10,0.75)')
      ctx.fillStyle=vig; ctx.fillRect(0,0,W,H)
    }

    loop()
    return () => {
      cancelAnimationFrame(raf.id)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position:'fixed', inset:0, zIndex:-1,
      width:'100vw', height:'100vh', display:'block'
    }}/>
  )
}
