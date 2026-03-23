import { useEffect, useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'

const skillBars = [
  {name:'JavaScript / TypeScript',pct:92,grad:'linear-gradient(90deg,var(--cyan),var(--purple))'},
  {name:'React / Next.js',pct:88,grad:'linear-gradient(90deg,var(--purple),var(--pink))'},
  {name:'Node.js / Express',pct:85,grad:'linear-gradient(90deg,var(--green),var(--cyan))'},
  {name:'MongoDB / MySQL',pct:82,grad:'linear-gradient(90deg,var(--yellow),var(--pink))'},
  {name:'C++ / DSA',pct:80,grad:'linear-gradient(90deg,var(--cyan),var(--green))'},
  {name:'Java',pct:75,grad:'linear-gradient(90deg,var(--pink),var(--yellow))'},
  {name:'Python',pct:68,grad:'linear-gradient(90deg,var(--purple),var(--cyan))'},
]

const commits = [
  {hash:'f3a9c21',branch:'(main)',msg:'feat: ',high:'Smart GitHub Project Recommender'},
  {hash:'b812e44',branch:'(feat)',msg:'feat: ',high:'Wi-Fi Auto-Login System'},
  {hash:'c9d3b17',branch:'(dsa)',msg:'solve: ',high:'350+ LeetCode problems'},
  {hash:'e2f8a30',branch:'(rank)',msg:'achieve: ',high:'Code-A-Haunt Rank 2'},
  {hash:'a17c5d9',branch:'(cert)',msg:'cert: ',high:'GEN AI NASSCOM'},
  {hash:'8b3f1c6',branch:'(cert)',msg:'cert: ',high:'TCP/IP Advanced'},
  {hash:'d4e92b8',branch:'(init)',msg:'init: ',high:'B.Tech CSE @ LPU — CGPA 7.31'},
]

export default function CodingSection() {
  const ref = useReveal()
  const barsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = barsRef.current
    if (!el) return
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.querySelectorAll('.sbar-fill').forEach((b, i) => {
          setTimeout(() => (b as HTMLElement).classList.add('active'), i * 120)
        })
        io.disconnect()
      }
    }, {threshold:.2})
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="code-section" id="coding" ref={ref}>
      <div className="slabel">Dev Mode</div>
      <h2 className="stitle rev">Thinking in <span className="ac">Code</span></h2>
      <div className="code-stats-row rev">
        <div className="cstat"><div className="cstat-n">350+</div><div className="cstat-l">Problems Solved</div></div>
        <div className="cstat"><div className="cstat-n">2</div><div className="cstat-l">Major Projects</div></div>
        <div className="cstat"><div className="cstat-n">5</div><div className="cstat-l">Certifications</div></div>
      </div>
      <div className="code-grid rev" style={{transitionDelay:'.1s'}}>
        <div className="terminal">
          <div className="tbar">
            <div className="tdot" style={{background:'#ff5f56'}}/>
            <div className="tdot" style={{background:'#ffbd2e'}}/>
            <div className="tdot" style={{background:'#27c93f'}}/>
            <span className="ttitle">sonu@portfolio ~ portfolio/index.js</span>
          </div>
          <div className="tbody">{`\
`}<span className="cm">// ── Sonu Kumar · Developer ──</span>{`
`}<span className="kw">const</span> <span className="va">sonu</span> <span className="op">=</span> <span className="op">{'{'}</span>{`
  `}<span className="fn">name</span><span className="op">:</span> <span className="str">"Sonu Kumar"</span><span className="op">,</span>{`
  `}<span className="fn">role</span><span className="op">:</span> <span className="str">"Student & Aspiring Developer"</span><span className="op">,</span>{`
  `}<span className="fn">uni</span><span className="op">:</span> <span className="str">"LPU · B.Tech CSE"</span><span className="op">,</span>{`
  `}<span className="fn">cgpa</span><span className="op">:</span> <span className="num">7.31</span><span className="op">,</span>{`
  `}<span className="fn">stack</span><span className="op">: [</span><span className="str">"C++"</span><span className="op">,</span> <span className="str">"Python"</span><span className="op">,</span> <span className="str">"React"</span><span className="op">],</span>{`
  `}<span className="fn">dsa</span><span className="op">:</span> <span className="str">"350+ problems solved"</span><span className="op">,</span>{`
  `}<span className="fn">rank</span><span className="op">:</span> <span className="str">"Code-A-Haunt 2nd 🥷"</span><span className="op">,</span>{`
  `}<span className="fn">status</span><span className="op">:</span> <span className="str">"Open to work ✅"</span>{`
`}<span className="op">{'}'}</span><span className="op">;</span>{`

`}<span className="kw">async function</span> <span className="fn">hire</span><span className="op">(</span><span className="va">dev</span><span className="op">{') {'}</span>{`
  `}<span className="kw">return</span> <span className="str">"🚀 Let's build something epic!"</span><span className="op">;</span>{`
`}<span className="op">{'}'}</span>
          </div>
        </div>
        <div className="skillbars" ref={barsRef}>
          <div className="sbars-title">Proficiency Levels</div>
          {skillBars.map(s=>(
            <div key={s.name} className="sbar-row">
              <div className="sbar-meta"><span className="sbar-name">{s.name}</span><span className="sbar-pct">{s.pct}%</span></div>
              <div className="sbar-track"><div className="sbar-fill" style={{'--w':s.pct+'%',background:s.grad} as React.CSSProperties}/></div>
            </div>
          ))}
        </div>
      </div>
      <div className="gitlog rev" style={{transitionDelay:'.2s'}}>
        <div className="tbar">
          <div className="tdot" style={{background:'#ff5f56'}}/>
          <div className="tdot" style={{background:'#ffbd2e'}}/>
          <div className="tdot" style={{background:'#27c93f'}}/>
          <span className="ttitle">sonu@portfolio ~ git log --oneline --graph</span>
        </div>
        <div className="gitlog-body">
          {commits.map(c=>(
            <div key={c.hash} className="commit-row">
              <span className="commit-hash">{c.hash}</span>
              <span className="commit-branch">{c.branch}</span>
              <span className="commit-msg">{c.msg}<span className="chigh">{c.high}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
