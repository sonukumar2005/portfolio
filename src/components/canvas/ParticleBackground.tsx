import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const cvRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = cvRef.current!
    const cx = cv.getContext('2d', { alpha: true })!

    let W = window.innerWidth
    let H = window.innerHeight
    cv.width = W; cv.height = H

    const onResize = () => {
      W = cv.width = window.innerWidth
      H = cv.height = window.innerHeight
    }
    window.addEventListener('resize', onResize, { passive: true })

    // 55 particles instead of 110
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 0.85 + 0.15,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      o: Math.random() * 0.35 + 0.08,
      phase: Math.random() * Math.PI * 2,
    }))

    // Throttled mouse — max 30fps update
    let mpx = W / 2, mpy = H / 2, lastMouseT = 0
    const onMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastMouseT < 33) return
      lastMouseT = now
      mpx = e.clientX; mpy = e.clientY
    }
    document.addEventListener('mousemove', onMove, { passive: true })

    const G = 90
    let raf: number
    let frameCount = 0

    const draw = () => {
      frameCount++
      cx.clearRect(0, 0, W, H)

      // Grid every other frame
      if (frameCount % 2 === 0) {
        cx.strokeStyle = 'rgba(0,212,255,0.018)'
        cx.lineWidth = 1
        cx.beginPath()
        for (let x = 0; x < W; x += G) { cx.moveTo(x, 0); cx.lineTo(x, H) }
        for (let y = 0; y < H; y += G) { cx.moveTo(0, y); cx.lineTo(W, y) }
        cx.stroke()
      }

      const ga = cx.createRadialGradient(mpx, mpy, 0, mpx, mpy, 200)
      ga.addColorStop(0, 'rgba(0,212,255,0.03)')
      ga.addColorStop(1, 'rgba(0,212,255,0)')
      cx.fillStyle = ga
      cx.fillRect(mpx - 200, mpy - 200, 400, 400)

      const t = frameCount * 0.00014
      for (let i = 0; i < pts.length; i++) {
        const s = pts[i]
        s.x += s.vx; s.y += s.vy
        if (s.x < 0) s.x = W; else if (s.x > W) s.x = 0
        if (s.y < 0) s.y = H; else if (s.y > H) s.y = 0
        cx.beginPath()
        cx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        cx.fillStyle = `rgba(0,212,255,${s.o * (0.4 + 0.6 * Math.sin(t + s.phase))})`
        cx.fill()
      }

      // O(n²) but half — skip pairs
      for (let i = 0; i < pts.length - 1; i += 2) {
        for (let j = i + 2; j < pts.length; j += 2) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          if (Math.abs(dx) > 110 || Math.abs(dy) > 110) continue
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            cx.beginPath()
            cx.moveTo(pts[i].x, pts[i].y)
            cx.lineTo(pts[j].x, pts[j].y)
            cx.strokeStyle = `rgba(0,212,255,${0.025 * (1 - d / 110)})`
            cx.lineWidth = 0.5
            cx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={cvRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', willChange: 'transform' }}
    />
  )
}
