import { useReveal } from '../../hooks/useReveal'

export default function Experience() {
  const ref = useReveal()
  const bullets = [
    {color:'var(--cyan)',bg:'rgba(0,212,255,.03)',border:'rgba(0,212,255,.08)',text:'Learned pointers, memory management, arrays, and file handling.'},
    {color:'var(--purple)',bg:'rgba(157,78,221,.03)',border:'rgba(157,78,221,.08)',text:'Covered linked lists, stacks, queues, trees, and graphs.'},
    {color:'var(--pink)',bg:'rgba(247,37,133,.03)',border:'rgba(247,37,133,.08)',text:'Studied recursion and dynamic programming extensively.'},
    {color:'var(--green)',bg:'rgba(6,255,165,.03)',border:'rgba(6,255,165,.08)',text:'Practiced applying these concepts to solve algorithms and optimize complexity.'},
  ]
  const chips = [
    {label:'C/C++',bg:'rgba(0,212,255,.07)',border:'rgba(0,212,255,.2)',color:'var(--cyan)'},
    {label:'Data Structures',bg:'rgba(157,78,221,.07)',border:'rgba(157,78,221,.2)',color:'var(--purple)'},
    {label:'Algorithms',bg:'rgba(247,37,133,.07)',border:'rgba(247,37,133,.2)',color:'var(--pink)'},
    {label:'DP & Graphs',bg:'rgba(6,255,165,.07)',border:'rgba(6,255,165,.2)',color:'var(--green)'},
  ]
  return (
    <div className="sw" id="experience" ref={ref}>
      <div className="slabel">Experience</div>
      <h2 className="stitle rev"><span className="ac">Training</span></h2>
      <div className="training-card rev">
        <div className="tc-corner tl"/><div className="tc-corner tr"/><div className="tc-corner bl"/><div className="tc-corner br"/>
        <div className="train-badge">TRAINING COMPLETED</div>
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',gap:'1rem',marginBottom:'1rem'}}>
          <div>
            <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'.68rem',color:'var(--cyan)',letterSpacing:'.12em',marginBottom:'.3rem'}}>JUN '25 — JUL '25</div>
            <div style={{fontFamily:'Orbitron,monospace',fontSize:'1rem',fontWeight:700,marginBottom:'.2rem'}}>DSA & C/C++ Training</div>
            <a 
              href="https://drive.google.com/file/d/1Hz8AkQmDkAdsKi20MbuWhn59OWxUEAYf/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{position:'relative',zIndex:10,pointerEvents:'auto',fontSize:'.8rem',color:'var(--purple)',fontWeight:600,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'.3rem',borderBottom:'1px dashed var(--purple)'}}
            >
              Certificate Awarded 🏅
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zm-2 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/></svg>
            </a>
          </div>
          <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
            {chips.map(c=>(
              <span key={c.label} style={{padding:'.25rem .6rem',borderRadius:'4px',background:c.bg,border:`1px solid ${c.border}`,fontFamily:'Share Tech Mono,monospace',fontSize:'.6rem',color:c.color}}>{c.label}</span>
            ))}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'.6rem'}}>
          {bullets.map((b,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'.6rem',padding:'.75rem',background:b.bg,border:`1px solid ${b.border}`,borderRadius:'8px'}}>
              <span style={{color:b.color,fontSize:'.9rem',marginTop:'.05rem'}}>▸</span>
              <span style={{fontSize:'.82rem',color:'#6870a0',lineHeight:1.5}}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
