import { useEffect, useRef, useState } from 'react'

const roles = ['Data Science & Software Developer','Machine Learning Enthusiast','Problem Solver 🧠']

function useTypewriter(words: string[]) {
  const [displayed, setDisplayed] = useState('')
  const [idx, setIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[idx]
    let timeout: ReturnType<typeof setTimeout>
    if (!deleting) {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 95)
      } else {
        timeout = setTimeout(() => setDeleting(true), 2200)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50)
      } else {
        setDeleting(false)
        setIdx((idx + 1) % words.length)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, idx, words])
  return displayed
}

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let c = 0
    const iv = setInterval(() => {
      c = Math.min(c + Math.ceil(target / 50), target)
      setVal(c)
      if (c >= target) clearInterval(iv)
    }, 25)
    return () => clearInterval(iv)
  }, [active, target])
  return val
}

export default function Hero() {
  const role = useTypewriter(roles)
  const robotRef = useRef<HTMLDivElement>(null)
  const photoInnerRef = useRef<HTMLDivElement>(null)
  const rfRef = useRef(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const count400 = useCounter(400, statsVisible)

  // Particles
  const particlesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ph = particlesRef.current
    if (!ph) return
    const colors = ['#00d4ff','#9d4edd','#f72585','#06ffa5','#ffd60a']
    colors.forEach(col => {
      for (let i = 0; i < 6; i++) {
        const d = document.createElement('div')
        d.className = 'hp-dot'
        const s = Math.random() * 3 + 1
        d.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;top:${Math.random()*100}%;background:${col};opacity:${Math.random()*.3+.07};animation:fpA ${4+Math.random()*7}s ${Math.random()*5}s ease-in-out infinite;position:absolute;border-radius:50%;`
        ph.appendChild(d)
      }
    })
  }, [])

  // Stats observer
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setStatsVisible(true); io.disconnect() }
    }, {threshold:.5})
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Robot animation + eye tracking
  useEffect(() => {
    let raf: number
    const animate = () => {
      rfRef.current += 0.016
      if (robotRef.current) robotRef.current.style.transform = `translateY(${Math.sin(rfRef.current)*12}px)`
      const ccore = document.getElementById('ccore')
      if (ccore) ccore.setAttribute('opacity', (0.08+0.16*Math.sin(rfRef.current*2.4)).toString())
      document.querySelectorAll('#mth rect').forEach((b, i) => {
        const h = 4 + Math.abs(Math.sin(rfRef.current*4.5 + i*.65)) * 9
        b.setAttribute('height', h.toString())
        b.setAttribute('y', (128-h+5).toString())
      })
      raf = requestAnimationFrame(animate)
    }
    animate()

    const EL = {cx:100,cy:90}, ER = {cx:160,cy:90}, MAX = 8
    const moveEye = (iris:string,pupil:string,center:string,shine:string,bx:number,by:number,ox:number,oy:number) => {
      [iris,pupil,center].forEach(id => {
        const el = document.getElementById(id)
        if(el){el.setAttribute('cx',(bx+ox).toString());el.setAttribute('cy',(by+oy).toString())}
      })
      const s = document.getElementById(shine)
      if(s){s.setAttribute('cx',(bx+ox+2).toString());s.setAttribute('cy',(by+oy-2.5).toString())}
    }
    const trackEyes = (mX:number, mY:number) => {
      const wrap = robotRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const cx3 = rect.left+rect.width/2, cy3 = rect.top+rect.height*.35
      const dx = mX-cx3, dy = mY-cy3, dist = Math.sqrt(dx*dx+dy*dy)||1
      const fac = Math.min(dist/500,1)
      const nx = dx/dist, ny = dy/dist
      const ox = nx*MAX*fac, oy = ny*MAX*fac
      moveEye('eli','elp','elc','els',EL.cx,EL.cy,ox,oy)
      moveEye('eri','erp','erc','ers',ER.cx,ER.cy,ox,oy)
      const r2=Math.round(157*fac),g2=Math.round(212*(1-fac*.4))
      const elp=document.getElementById('elp'); const erp=document.getElementById('erp')
      if(elp)elp.setAttribute('fill',`rgb(${r2},${g2},255)`)
      if(erp)erp.setAttribute('fill',`rgb(${r2},${g2},255)`)
      const head=document.getElementById('rhead')
      if(head){head.style.transform=`rotate(${nx*4}deg)`;head.style.transformOrigin='130px 90px';head.style.transition='transform 0.22s ease'}
      const ant=document.getElementById('antdot')
      if(ant)ant.setAttribute('fill',`rgb(${r2},${g2},255)`)
    }
    const onMove = (e:MouseEvent) => trackEyes(e.clientX, e.clientY)
    document.addEventListener('mousemove', onMove)

    return () => { cancelAnimationFrame(raf); document.removeEventListener('mousemove', onMove) }
  }, [])

  // Photo 3D tilt
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const inner = photoInnerRef.current
      if (!inner) return
      const rect = inner.parentElement!.getBoundingClientRect()
      const cx = (rect.left+rect.right)/2, cy = (rect.top+rect.bottom)/2
      const dx = (e.clientX-cx)/window.innerWidth*2, dy = (e.clientY-cy)/window.innerHeight*2
      const dist = Math.sqrt(dx*dx+dy*dy)
      if (dist < 2.5) {
        inner.style.transform = `perspective(700px) rotateY(${dx*16}deg) rotateX(${-dy*16}deg) scale(1.04)`
      } else {
        inner.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)'
      }
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section id="hero" style={{position:'relative',zIndex:2,minHeight:'100vh',display:'flex',alignItems:'center',padding:'7rem 4rem 4rem'}}>
      <div ref={particlesRef} style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:1}} />
      <div className="hero-inner" style={{position:'relative',zIndex:2}}>
        {/* LEFT */}
        <div>
          <div className="htag">// <em>HELLO WORLD</em> — Full Stack Developer</div>
          <h1 className="hname reveal">SONU<br/><span className="grad">KUMAR</span></h1>
          <div className="hrole reveal delay-1">{role}<span className="hrole-cursor">|</span></div>
          <p className="hdesc reveal delay-2">Computer Science student with strong skills in Data Analysis, Machine Learning, and Software Development. Passionate about building robust systems and solving real-world problems.</p>

          <div className="hstats" ref={statsRef}>
            <div className="hst"><div className="hst-n">{count400}+</div><div className="hst-l">Problems Solved</div></div>
            <div className="hst"><div className="hst-n">2</div><div className="hst-l">Major Projects</div></div>
            <div className="hst"><div className="hst-n">7.31</div><div className="hst-l">CGPA at LPU</div></div>
            <div className="hst"><div className="hst-n">2<sup>nd</sup></div><div className="hst-l">Code-A-Haunt</div></div>
          </div>

          <div className="hbtns">
            <a href="#projects" className="btn btn-outline hero-cta" onClick={e=>{e.preventDefault();document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}}>View Projects</a>
            <a href="#contact" className="btn btn-grad hero-cta" onClick={e=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}}>Hire Me</a>
          </div>

          <div className="hbtns resume-btns">
            <a
              href="/Sonu_Kumar_Resume.pdf"
              download="Sonu_Kumar_Resume.pdf"
              className="btn btn-resume-download hero-cta"
              title="Download Resume"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{marginRight:'7px',verticalAlign:'middle'}}>
                <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z"/>
              </svg>
              Download Resume
            </a>
            <a
              href="/Sonu_Kumar_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-resume-view hero-cta"
              title="View Resume"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{marginRight:'7px',verticalAlign:'middle'}}>
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              View Resume
            </a>
          </div>

          <div className="socials">
            <a href="https://github.com/sonukumar2005" target="_blank" className="soc" title="GitHub">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>
            <a href="https://linkedin.com/in/sonukumar2005" target="_blank" className="soc" title="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:sonuchaudry10062005@gmail.com" target="_blank" className="soc" title="Email">
              <svg viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
            </a>
            <a href="tel:+916376135169" className="soc" title="Phone">
              <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          {/* Photo */}
          <div className="photo-frame">
            <div className="photo-ring" style={{inset:'-18px',animationDelay:'0s'}}/>
            <div className="photo-ring" style={{inset:'-34px',animationDelay:'1s',borderColor:'rgba(157,78,221,.15)'}}/>
            <div className="photo-ring" style={{inset:'-52px',animationDelay:'2s',borderColor:'rgba(247,37,133,.1)'}}/>
            <div className="photo-spin-border"/>
            <div className="photo-spin-gap"/>
            <div className="photo-img-wrap" ref={photoInnerRef} style={{transition:'transform .15s ease'}}>
              <img className="photo-img" src="https://avatars.githubusercontent.com/sonukumar2005" alt="Sonu Kumar"
                onLoad={e=>(e.target as HTMLImageElement).style.opacity='1'}
                onError={e=>{(e.target as HTMLImageElement).style.display='none'}}
                style={{opacity:0,transition:'opacity .6s'}}
              />
            </div>
            <div className="photo-scan"/>
          </div>

          {/* Robot */}
          <div id="robot-wrap" ref={robotRef}>
            <svg className="robot-svg" viewBox="0 0 260 330" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="gf1"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="gf2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <linearGradient id="bdy" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#0c1828"/><stop offset="100%" stopColor="#060e1a"/></linearGradient>
                <linearGradient id="hdy" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#0e1c35"/><stop offset="100%" stopColor="#060e1e"/></linearGradient>
                <radialGradient id="egl" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#00d4ff" stopOpacity="1"/><stop offset="100%" stopColor="#004455" stopOpacity="0"/></radialGradient>
              </defs>
              <rect x="108" y="138" width="44" height="17" rx="5" fill="#0a1422" stroke="#00d4ff" strokeWidth=".7" opacity=".75"/>
              <line x1="118" y1="140" x2="118" y2="153" stroke="#00d4ff" strokeWidth=".5" opacity=".4"/>
              <line x1="130" y1="140" x2="130" y2="153" stroke="#00d4ff" strokeWidth=".5" opacity=".4"/>
              <line x1="142" y1="140" x2="142" y2="153" stroke="#00d4ff" strokeWidth=".5" opacity=".4"/>
              <rect x="58" y="154" width="144" height="120" rx="18" fill="url(#bdy)" stroke="#00d4ff" strokeWidth="1.1" opacity=".85"/>
              <circle cx="130" cy="188" r="26" fill="#030c19" stroke="#00d4ff" strokeWidth="1" opacity=".9"/>
              <circle cx="130" cy="188" r="18" fill="#091a2e" stroke="#00d4ff" strokeWidth=".5" opacity=".7"/>
              <circle id="ccore" cx="130" cy="188" r="11" fill="#00d4ff" opacity=".12" filter="url(#gf2)"/>
              <circle cx="130" cy="188" r="5" fill="#00d4ff" filter="url(#gf2)"/>
              <rect x="72" y="226" width="30" height="5" rx="2.5" fill="#00d4ff" opacity=".1"/>
              <rect x="72" y="226" width="22" height="5" rx="2.5" fill="#00d4ff" opacity=".65"/>
              <rect x="72" y="234" width="30" height="5" rx="2.5" fill="#9d4edd" opacity=".1"/>
              <rect x="72" y="234" width="19" height="5" rx="2.5" fill="#9d4edd" opacity=".6"/>
              <rect x="72" y="242" width="30" height="5" rx="2.5" fill="#f72585" opacity=".1"/>
              <rect x="72" y="242" width="25" height="5" rx="2.5" fill="#f72585" opacity=".6"/>
              <circle cx="152" cy="229" r="4" fill="#06ffa5" opacity=".8" filter="url(#gf1)"/>
              <circle cx="163" cy="229" r="4" fill="#00d4ff" opacity=".6" filter="url(#gf1)"/>
              <circle cx="174" cy="229" r="4" fill="#9d4edd" opacity=".5" filter="url(#gf1)"/>
              <text x="149" y="247" fill="#00d4ff" fontFamily="Share Tech Mono" fontSize="5.5" opacity=".5">ONLINE</text>
              <rect x="88" y="255" width="84" height="12" rx="4" fill="#030c19" stroke="#00d4ff" strokeWidth=".4" opacity=".5"/>
              <rect x="12" y="158" width="44" height="100" rx="13" fill="url(#bdy)" stroke="#00d4ff" strokeWidth="1" opacity=".75"/>
              <circle cx="34" cy="185" r="9" fill="#030c19" stroke="#00d4ff" strokeWidth=".6" opacity=".75"/>
              <circle cx="34" cy="185" r="5" fill="#9d4edd" opacity=".6" filter="url(#gf1)"/>
              <rect x="14" y="254" width="40" height="13" rx="6" fill="url(#bdy)" stroke="#00d4ff" strokeWidth=".6" opacity=".75"/>
              <rect x="204" y="158" width="44" height="100" rx="13" fill="url(#bdy)" stroke="#00d4ff" strokeWidth="1" opacity=".75"/>
              <circle cx="226" cy="185" r="9" fill="#030c19" stroke="#00d4ff" strokeWidth=".6" opacity=".75"/>
              <circle cx="226" cy="185" r="5" fill="#9d4edd" opacity=".6" filter="url(#gf1)"/>
              <rect x="206" y="254" width="40" height="13" rx="6" fill="url(#bdy)" stroke="#00d4ff" strokeWidth=".6" opacity=".75"/>
              <rect x="82" y="273" width="38" height="42" rx="10" fill="url(#bdy)" stroke="#00d4ff" strokeWidth=".8" opacity=".75"/>
              <rect x="140" y="273" width="38" height="42" rx="10" fill="url(#bdy)" stroke="#00d4ff" strokeWidth=".8" opacity=".75"/>
              <rect x="76" y="310" width="50" height="14" rx="7" fill="url(#bdy)" stroke="#00d4ff" strokeWidth=".7" opacity=".8"/>
              <rect x="134" y="310" width="50" height="14" rx="7" fill="url(#bdy)" stroke="#00d4ff" strokeWidth=".7" opacity=".8"/>
              <g id="rhead">
                <rect x="62" y="38" width="136" height="102" rx="22" fill="url(#hdy)" stroke="#00d4ff" strokeWidth="1.5" opacity=".95"/>
                <rect x="88" y="30" width="84" height="12" rx="5" fill="#0a1828" stroke="#00d4ff" strokeWidth=".8" opacity=".75"/>
                <line x1="130" y1="16" x2="130" y2="32" stroke="#00d4ff" strokeWidth="2" opacity=".9"/>
                <circle id="antdot" cx="130" cy="12" r="6.5" fill="#00d4ff" filter="url(#gf2)" opacity=".95"/>
                <circle cx="130" cy="12" r="3.5" fill="#fff"/>
                <rect x="52" y="58" width="13" height="30" rx="5" fill="#091522" stroke="#00d4ff" strokeWidth=".8" opacity=".8"/>
                <circle cx="58.5" cy="73" r="4" fill="#9d4edd" opacity=".7" filter="url(#gf1)"/>
                <rect x="195" y="58" width="13" height="30" rx="5" fill="#091522" stroke="#00d4ff" strokeWidth=".8" opacity=".8"/>
                <circle cx="201.5" cy="73" r="4" fill="#9d4edd" opacity=".7" filter="url(#gf1)"/>
                <text x="103" y="54.5" fill="#00d4ff" fontFamily="Share Tech Mono" fontSize="6.5" opacity=".65">AI-CORE v3.1</text>
                <ellipse cx="100" cy="90" rx="24" ry="19" fill="#020b18" stroke="#00d4ff" strokeWidth="1.3" opacity=".95"/>
                <ellipse cx="160" cy="90" rx="24" ry="19" fill="#020b18" stroke="#00d4ff" strokeWidth="1.3" opacity=".95"/>
                <ellipse cx="100" cy="90" rx="19" ry="14" fill="url(#egl)" opacity=".22"/>
                <ellipse cx="160" cy="90" rx="19" ry="14" fill="url(#egl)" opacity=".22"/>
                <g id="el">
                  <circle id="eli" cx="100" cy="90" r="12" fill="#002e3d" stroke="#00d4ff" strokeWidth=".6"/>
                  <circle id="elp" cx="100" cy="90" r="8" fill="#00d4ff" filter="url(#gf1)"/>
                  <circle id="elc" cx="100" cy="90" r="4" fill="#ffffff"/>
                  <circle id="els" cx="102" cy="87.5" r="2" fill="rgba(255,255,255,.7)"/>
                </g>
                <g id="er">
                  <circle id="eri" cx="160" cy="90" r="12" fill="#002e3d" stroke="#00d4ff" strokeWidth=".6"/>
                  <circle id="erp" cx="160" cy="90" r="8" fill="#00d4ff" filter="url(#gf1)"/>
                  <circle id="erc" cx="160" cy="90" r="4" fill="#ffffff"/>
                  <circle id="ers" cx="162" cy="87.5" r="2" fill="rgba(255,255,255,.7)"/>
                </g>
                <rect x="88" y="115" width="84" height="17" rx="7" fill="#030c19" stroke="#00d4ff" strokeWidth=".8" opacity=".85"/>
                <g id="mth">
                  <rect x="94"  y="119" width="6" height="8" rx="2" fill="#00d4ff" opacity=".6"/>
                  <rect x="103" y="119" width="6" height="8" rx="2" fill="#00d4ff" opacity=".45"/>
                  <rect x="112" y="119" width="6" height="8" rx="2" fill="#00d4ff" opacity=".85"/>
                  <rect x="121" y="119" width="6" height="8" rx="2" fill="#00d4ff" opacity=".5"/>
                  <rect x="130" y="119" width="6" height="8" rx="2" fill="#00d4ff" opacity=".9"/>
                  <rect x="139" y="119" width="6" height="8" rx="2" fill="#00d4ff" opacity=".35"/>
                  <rect x="148" y="119" width="6" height="8" rx="2" fill="#00d4ff" opacity=".7"/>
                  <rect x="157" y="119" width="6" height="8" rx="2" fill="#00d4ff" opacity=".4"/>
                </g>
              </g>
            </svg>
            <div className="robot-platform"/>
          </div>
        </div>
      </div>
    </section>
  )
}
