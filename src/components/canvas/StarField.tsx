import { useEffect, useRef } from 'react'

class Star {
  x=0; y=0; speed=0; angle=0; life=0; maxLife=0
  trail: {x:number,y:number}[]=[]; w=0; col='0,212,255'
  reset(init=false) {
    this.x = Math.random() * window.innerWidth * (init ? .9 : .6) - window.innerWidth * .05
    this.y = Math.random() * window.innerHeight * (init ? .5 : .3) - 50
    this.speed = Math.random() * 6 + 3
    this.angle = Math.PI * .22 + Math.random() * .18
    this.life = 0; this.maxLife = Math.random() * 70 + 45
    this.trail = []; this.w = Math.random() * 1.2 + .4
    const cols = ['0,212,255','157,78,221','247,37,133','180,220,255']
    this.col = cols[Math.floor(Math.random() * cols.length)]
  }
  update() {
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed
    this.trail.unshift({x:this.x, y:this.y})
    if (this.trail.length > 22) this.trail.pop()
    this.life++
    if (this.life > this.maxLife) this.reset()
  }
  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.life < 10 ? this.life/10
                : this.life > this.maxLife-10 ? (this.maxLife-this.life)/10 : 1
    for (let i = 0; i < this.trail.length; i++) {
      const a = alpha * (1 - i / this.trail.length) * 0.85
      const r = Math.max(this.w * (1 - i / this.trail.length * .8), .1)
      ctx.beginPath()
      ctx.arc(this.trail[i].x, this.trail[i].y, r, 0, Math.PI*2)
      ctx.fillStyle = `rgba(${this.col},${a})`
      ctx.fill()
    }
  }
}

export default function StarField() {
  const cvRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = cvRef.current!
    const ctx = cv.getContext('2d', { alpha: true })!
    cv.width = window.innerWidth; cv.height = window.innerHeight
    const onResize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    window.addEventListener('resize', onResize, { passive: true })
    const stars = Array.from({ length: 8 }, () => {
      const s = new Star(); s.reset(true)
      s.life = Math.floor(Math.random() * s.maxLife)
      return s
    })
    let raf: number
    const anim = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)
      stars.forEach(s => { s.update(); s.draw(ctx) })
      raf = requestAnimationFrame(anim)
    }
    anim()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={cvRef} style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none', willChange:'transform' }} />
}
