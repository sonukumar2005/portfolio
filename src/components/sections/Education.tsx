import { useReveal } from '../../hooks/useReveal'

const edu = [
  {deg:'B.Tech — Computer Science & Engineering',sch:'Lovely Professional University, Punjab',score:'7.31',unit:'CGPA'},
  {deg:'Intermediate (Class XII)',sch:'Prince Academy, Sikar',score:'83.40%',unit:'2022'},
  {deg:'Matriculation (Class X)',sch:'Tagore Public School, Sikar',score:'93.50%',unit:'2020'},
]

export default function Education() {
  const ref = useReveal()
  return (
    <div className="sw" id="education" ref={ref}>
      <div className="slabel">Background</div>
      <h2 className="stitle rev"><span className="ac">Education</span></h2>
      <div className="eg">
        {edu.map((e,i)=>(
          <div key={i} className="ec rev" style={{transitionDelay:`${i*.1}s`}}>
            <div><div className="ede">{e.deg}</div><div className="esc">{e.sch}</div></div>
            <div><div className="esc2">{e.score}</div><div className="eyr">{e.unit}</div></div>
          </div>
        ))}
      </div>
    </div>
  )
}
