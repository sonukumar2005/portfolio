import { useEffect, useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'

export default function Skills() {
  const ref = useReveal()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.sc') ?? []
    cards.forEach(card => {
      const el = card as HTMLElement
      el.addEventListener('mousemove', (e: Event) => {
        const me = e as MouseEvent
        const r = el.getBoundingClientRect()
        const cx = (me.clientX - r.left) / r.width
        const cy = (me.clientY - r.top) / r.height
        el.style.setProperty('--mx', cx * 100 + '%')
        el.style.setProperty('--my', cy * 100 + '%')
        const dx = cx - 0.5, dy = cy - 0.5
        el.style.transform = `perspective(800px) rotateY(${dx*16}deg) rotateX(${-dy*16}deg) scale(1.04) translateZ(8px)`
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = ''; el.style.transition = 'transform .6s cubic-bezier(.23,1,.32,1),border-color .3s,box-shadow .3s'
      })
      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform .08s linear,border-color .3s,box-shadow .3s'
      })
    })
  }, [])

  return (
    <div className="sw" id="skills" ref={ref}>
      <div className="slabel">Tech Arsenal</div>
      <h2 className="stitle rev">My <span className="ac">Skills</span> &amp; Stack</h2>
      <div className="sg" ref={gridRef}>
        {[
          { icon:'⚡', title:'Languages', tags:['C','C++','JavaScript ES6+','Java','Python','PHP','HTML5','CSS3'] },
          { icon:'🚀', title:'Frameworks', tags:['React.js','Next.js','Node.js','Express.js','Tailwind CSS','Bootstrap'] },
          { icon:'🛠️', title:'Tools & Platforms', tags:['MySQL','MongoDB','Git/GitHub','Postman','Figma','Netlify','Cloudinary','REST API'] },
          { icon:'🧠', title:'Soft Skills', tags:['Problem-Solving','Team Player','Project Management','Adaptability'] },
        ].map((s,i) => (
          <div key={i} className="sc rev" style={{transitionDelay:`${i*.1}s`}}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-t">{s.title}</div>
            <div className="tags">{s.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
