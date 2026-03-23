import { useReveal } from '../../hooks/useReveal'

const certs = [
  {icon:'🌐',name:'TCP/IP and Advanced Topics',issuer:'FEB \'26',link:'#'},
  {icon:'🤖',name:'GEN AI NASSCOM',issuer:'FEB \'26',link:'#'},
  {icon:'💻',name:'The Bits and Bytes of Computer Networking',issuer:'APR \'25',link:'#'},
  {icon:'☕',name:'Java Programming',issuer:'NOV \'24',link:'#'},
  {icon:'🎨',name:'Free Code Camp Web Development Certificates-Self Paced',issuer:'NOV \'23',link:'#'},
]

export default function Certifications() {
  const ref = useReveal()
  return (
    <div className="sw" ref={ref}>
      <div className="slabel">Credentials</div>
      <h2 className="stitle rev"><span className="ac">Certifications</span> &amp; Badges</h2>
      <div className="cg">
        {certs.map((c,i)=>(
          <div key={i} className="cc rev" style={{transitionDelay:`${i*.08}s`}}>
            <a href={c.link} target="_blank" className="cc-link">
              <div className="ci">{c.icon}</div>
              <div style={{flex:1}}><div className="cn">{c.name}</div><div className="cis">{c.issuer}</div></div>
              <span className="cc-view">VIEW ↗</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
