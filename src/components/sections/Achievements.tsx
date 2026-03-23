import { useReveal } from '../../hooks/useReveal'

const achievements = [
  {icon:'💻',title:'350+ DSA Problems Solved',desc:'Solved 350+ Data Structures and Algorithms problems on LeetCode.'},
  {icon:'🏆',title:'Rank 2nd — Code-A-Haunt',desc:"Secured 2nd position in a 24-hour hackathon \"Code-A-Haunt\"."},
]

export default function Achievements() {
  const ref = useReveal()
  return (
    <div className="sw" id="achievements" ref={ref}>
      <div className="slabel">Recognition</div>
      <h2 className="stitle rev"><span className="ac">Achievements</span> &amp; Awards</h2>
      <div className="ag">
        {achievements.map((a,i)=>(
          <div key={i} className="ac2 rev" style={{transitionDelay:`${i*.1}s`}}>
            <div className="ai">{a.icon}</div>
            <div><div className="at">{a.title}</div><div className="ad">{a.desc}</div></div>
          </div>
        ))}
      </div>
    </div>
  )
}
