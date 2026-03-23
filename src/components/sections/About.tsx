import { useReveal } from '../../hooks/useReveal'

export default function About() {
  const ref = useReveal()
  return (
    <section id="about" className="sw" ref={ref} style={{paddingTop: '6rem', paddingBottom: '6rem'}}>
      <div className="slabel">Introduction</div>
      <h2 className="stitle rev"><span className="ac">About Me</span></h2>
      <div className="rev" style={{
        marginTop: '2rem',
        fontSize: '1.05rem',
        color: '#a0a8d0',
        lineHeight: '1.8',
        maxWidth: '800px',
        padding: '2rem',
        background: 'rgba(10, 20, 34, 0.4)',
        border: '1px solid rgba(0, 212, 255, 0.1)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <p>
          I am a <strong>Computer Science student</strong> with strong skills in Data Analysis, Machine Learning, and Software Development. I enjoy building scalable systems and solving real-world problems using technology.
        </p>
        <p style={{ marginTop: '1rem' }}>
          I have hands-on experience with <strong>Python, C++, JavaScript</strong>, and modern frameworks like <strong>Django and React</strong>. I actively practice Data Structures and Algorithms and have solved <strong>350+ problems on LeetCode</strong>.
        </p>
      </div>
    </section>
  )
}
