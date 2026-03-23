import { useEffect, useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'
import asapImg    from '../../assets/ASAP!.png'
import trendiioImg from '../../assets/trendiio.png'
import vidflowImg  from '../../assets/VidFlow.png'

const projects = [
  {
    num: '01',
    badge: 'MAR \'26',
    badgeColor: { background:'rgba(0,212,255,.10)', borderColor:'rgba(0,212,255,.35)', color:'var(--cyan)' },
    title: 'Smart GitHub Project Recommender',
    desc: 'Designed a system to recommend GitHub projects based on user interests. Deployed using Streamlit and Kubernetes. Structured a learning-based recommendation flow.',
    tech: ['Python','Scikit-learn','NLP','GitHub API','Streamlit','Pickle'],
    img: asapImg,
    github: 'https://github.com/sonukumar2005',
    live: null,
    accent: '#00d4ff',
  },
  {
    num: '02',
    badge: 'MAR \'26',
    badgeColor: { background:'rgba(6,255,165,.10)', borderColor:'rgba(6,255,165,.38)', color:'var(--green)' },
    title: 'Wi-Fi Auto-Login System',
    desc: 'Automated Wi-Fi login system handling credentials, session maintenance, and connection request automation over public networks.',
    tech: ['HTML','CSS','JavaScript','Python','Auto Scripts'],
    img: trendiioImg,
    github: 'https://github.com/sonukumar2005',
    live: null,
    accent: '#06ffa5',
  }
]

export default function Projects() {
  const ref    = useReveal()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.psc') ?? []
    cards.forEach(card => {
      const el = card as HTMLElement
      card.addEventListener('mousemove', (e: Event) => {
        const me = e as MouseEvent
        const r  = el.getBoundingClientRect()
        el.style.setProperty('--px', ((me.clientX - r.left) / r.width  * 100) + '%')
        el.style.setProperty('--py', ((me.clientY - r.top)  / r.height * 100) + '%')
        const cx = (me.clientX - r.left) / r.width  - 0.5
        const cy = (me.clientY - r.top)  / r.height - 0.5
        el.style.transform = `perspective(1000px) rotateY(${cx*8}deg) rotateX(${-cy*8}deg) translateY(-6px) scale(1.01)`
      })
      card.addEventListener('mouseleave', () => {
        el.style.transform  = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0) scale(1)'
        el.style.transition = 'transform .55s cubic-bezier(.23,1,.32,1)'
      })
      card.addEventListener('mouseenter', () => { el.style.transition = 'transform .08s linear' })
    })
  }, [])

  return (
    <div className="sw" id="projects" ref={ref}>
      <div className="slabel">Portfolio</div>
      <h2 className="stitle rev">Featured <span className="ac">Projects</span></h2>

      <div className="psc-grid" ref={gridRef}>
        {projects.map((p, i) => (
          <div
            key={p.num}
            className="psc rev"
            style={{ transitionDelay: `${i * 0.12}s`, '--accent': p.accent } as React.CSSProperties}
          >
            {/* ── Image Showcase ── */}
            <div className="psc-img-wrap">
              <img src={p.img} alt={p.title} className="psc-img" />
              <div className="psc-img-overlay" />
              <div className="psc-img-shine" />
              {/* floating number */}
              <span className="psc-float-num">// {p.num}</span>
              {/* badge */}
              <span className="psc-float-badge" style={p.badgeColor}>{p.badge}</span>
            </div>

            {/* ── Content ── */}
            <div className="psc-body">
              <h3 className="psc-title">{p.title}</h3>
              <p className="psc-desc">{p.desc}</p>

              <div className="psc-tech">
                {p.tech.map(t => <span key={t} className="tb">{t}</span>)}
              </div>

              <div className="psc-links">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="psc-btn psc-btn-live">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8l7 4-7 4z"/></svg>
                    Live Demo
                  </a>
                )}
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="psc-btn psc-btn-gh">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    GitHub
                  </a>
                )}
                {!p.live && !p.github && (
                  <span className="psc-btn psc-btn-wip">⚙ In Progress</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
