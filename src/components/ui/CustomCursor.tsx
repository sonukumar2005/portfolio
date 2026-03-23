import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mx = useRef(0); const my = useRef(0)
  const rx = useRef(0); const ry = useRef(0)
  const TRAIL = 12

  useEffect(() => {
    const trails: HTMLDivElement[] = []
    const trailPos = Array.from({ length: TRAIL }, () => ({ x: 0, y: 0 }))
    for (let i = 0; i < TRAIL; i++) {
      const d = document.createElement('div')
      const size = Math.max(1, 7.5 - i * 0.62)
      const opacity = Math.max(0.03, 0.58 - i * 0.05)
      const hue = 185 + i * 7
      d.style.cssText = `position:fixed;width:${size}px;height:${size}px;border-radius:50%;pointer-events:none;z-index:99996;transform:translate(-50%,-50%);background:hsl(${hue},100%,72%);opacity:${opacity};mix-blend-mode:screen;box-shadow:0 0 ${4+i}px hsl(${hue},100%,68%);`
      document.body.appendChild(d)
      trails.push(d)
    }
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX; my.current = e.clientY
      if (dotRef.current) { dotRef.current.style.left = e.clientX+'px'; dotRef.current.style.top = e.clientY+'px' }
    }
    window.addEventListener('mousemove', onMove)
    let raf: number
    const animate = () => {
      rx.current += (mx.current - rx.current) * 0.1
      ry.current += (my.current - ry.current) * 0.1
      if (ringRef.current) { ringRef.current.style.left = rx.current+'px'; ringRef.current.style.top = ry.current+'px' }
      trailPos[0] = { x: mx.current, y: my.current }
      for (let i = 1; i < TRAIL; i++) {
        trailPos[i] = { x: trailPos[i].x+(trailPos[i-1].x-trailPos[i].x)*0.28, y: trailPos[i].y+(trailPos[i-1].y-trailPos[i].y)*0.28 }
        if (trails[i]) { trails[i].style.left = trailPos[i].x+'px'; trails[i].style.top = trailPos[i].y+'px' }
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    const onEnter = () => {
      if (dotRef.current) { dotRef.current.style.width='22px'; dotRef.current.style.height='22px'; dotRef.current.style.background='var(--purple)'; dotRef.current.style.boxShadow='0 0 25px var(--purple),0 0 55px rgba(157,78,221,.65)' }
      if (ringRef.current) { ringRef.current.style.width='72px'; ringRef.current.style.height='72px'; ringRef.current.style.borderColor='rgba(157,78,221,.7)' }
      trails.forEach((t,i) => { t.style.background=`hsl(${280+i*5},90%,68%)` })
    }
    const onLeave = () => {
      if (dotRef.current) { dotRef.current.style.width='8px'; dotRef.current.style.height='8px'; dotRef.current.style.background='var(--cyan)'; dotRef.current.style.boxShadow='0 0 18px var(--cyan),0 0 38px var(--cyan)' }
      if (ringRef.current) { ringRef.current.style.width='44px'; ringRef.current.style.height='44px'; ringRef.current.style.borderColor='rgba(0,212,255,.5)' }
      trails.forEach((t,i) => { t.style.background=`hsl(${185+i*7},100%,72%)` })
    }
    const els = document.querySelectorAll('a,button,.tag,.pc,.sc,.ac2,.ec,.cc,.cstat,.soc,.btn,.ct-link')
    els.forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave) })
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); trails.forEach(t=>t.remove()); els.forEach(el => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave) }) }
  }, [])

  return (<><div ref={dotRef} className="cursor-dot" /><div ref={ringRef} className="cursor-ring" /></>)
}
