import { useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'

const EMAILJS_SERVICE_ID  = 'service_t2xnhrm'
const EMAILJS_TEMPLATE_ID = 'template_ezl294o'
const EMAILJS_PUBLIC_KEY  = 'R9-dhaO61wZb13fW8'

const links = [
  {href:'mailto:sonuchaudry10062005@gmail.com',icon:<svg width="18" height="18" fill="var(--cyan)" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>,iconStyle:{background:'rgba(0,212,255,.08)',borderColor:'rgba(0,212,255,.2)'},platform:'Gmail',val:'sonuchaudry10062005@gmail'},
  {href:'https://linkedin.com/in/sonukumar2005',icon:<svg width="18" height="18" fill="#0a66c2" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,iconStyle:{background:'rgba(10,102,194,.1)',borderColor:'rgba(10,102,194,.3)'},platform:'LinkedIn',val:'sonukumar2005'},
  {href:'https://github.com/sonukumar2005',icon:<svg width="18" height="18" fill="#fff" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>,iconStyle:{background:'rgba(255,255,255,.05)',borderColor:'rgba(255,255,255,.12)'},platform:'GitHub',val:'sonukumar2005'},
  {href:'https://leetcode.com/u/sonukumar/',icon:<svg width="18" height="18" fill="#ffa116" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>,iconStyle:{background:'rgba(255,161,22,.08)',borderColor:'rgba(255,161,22,.25)'},platform:'LeetCode',val:'350+ problems solved'},
  {href:'tel:+916376135169',icon:<svg width="18" height="18" fill="var(--green)" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>,iconStyle:{background:'rgba(6,255,165,.06)',borderColor:'rgba(6,255,165,.18)'},platform:'Phone',val:'+91-63761-35169'},
]

export default function Contact() {
  const ref = useReveal()
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)
  const msgRef = useRef<HTMLTextAreaElement>(null)
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const sendMail = async () => {
    const name = nameRef.current?.value.trim() ?? ''
    const email = emailRef.current?.value.trim() ?? ''
    const subject = subjectRef.current?.value.trim() ?? ''
    const msg = msgRef.current?.value.trim() ?? ''
    if (!name) { setErrMsg('⚠ Please enter your name.'); setStatus('error'); nameRef.current?.focus(); return }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrMsg('⚠ Please enter a valid email.'); setStatus('error'); emailRef.current?.focus(); return }
    if (!msg) { setErrMsg('⚠ Please write a message.'); setStatus('error'); msgRef.current?.focus(); return }
    setStatus('sending')
    try {
      const emailjs = (window as any).emailjs
      if (!emailjs) throw new Error('EmailJS not loaded')
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {from_name:name,from_email:email,subject:subject||`Portfolio inquiry from ${name}`,message:msg}, EMAILJS_PUBLIC_KEY)
      setStatus('success')
      if(nameRef.current)nameRef.current.value=''
      if(emailRef.current)emailRef.current.value=''
      if(subjectRef.current)subjectRef.current.value=''
      if(msgRef.current)msgRef.current.value=''
      setTimeout(()=>setStatus('idle'),8000)
    } catch {
      setErrMsg('❌ Send failed. Please email: sonuchaudry10062005@gmail.com')
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="contact-section" ref={ref}>
      <div className="contact-inner">
        <div className="contact-header">
          <div className="slabel" style={{justifyContent:'center',marginBottom:'.9rem'}}>Let's Connect</div>
          <h2 className="cbig rev">Ready to Build<br/><span>Something Epic?</span></h2>
          <p className="rev" style={{fontSize:'.95rem',color:'#6870a0',marginBottom:'2.5rem',lineHeight:1.7}}>Open to internships, freelance &amp; full-time roles. Drop me a message below!</p>
        </div>
        <div className="ct-grid rev">
          <div className="ct-form-wrap">
            <div className="ct-form-header">
              <span className="ct-form-tag">// SEND_MESSAGE.tsx</span>
              <span className="ct-status-dot"/>
            </div>
            <div className="ct-field-row">
              <div className="ct-field"><label className="ct-label">NAME</label><input ref={nameRef} className="ct-input" type="text" placeholder="Your full name" onKeyDown={e=>e.key==='Enter'&&sendMail()}/></div>
              <div className="ct-field"><label className="ct-label">EMAIL</label><input ref={emailRef} className="ct-input" type="email" placeholder="your@email.com" onKeyDown={e=>e.key==='Enter'&&sendMail()}/></div>
            </div>
            <div className="ct-field" style={{marginTop:'.9rem'}}>
              <label className="ct-label">SUBJECT</label>
              <input ref={subjectRef} className="ct-input" type="text" placeholder="Internship / Collaboration / Project inquiry..." onKeyDown={e=>e.key==='Enter'&&sendMail()}/>
            </div>
            <div className="ct-field" style={{marginTop:'.9rem'}}>
              <label className="ct-label">MESSAGE</label>
              <textarea ref={msgRef} className="ct-input ct-textarea" placeholder="Hey Sonu, I came across your portfolio and would love to..."/>
            </div>
            <button className="ct-btn" onClick={sendMail} disabled={status==='sending'}>
              <span>{status==='sending'?'⏳':'⚡'}</span>
              <span>{status==='sending'?'SENDING...':'SEND MESSAGE'}</span>
              {status!=='sending'&&<span style={{fontSize:'.9rem',transition:'transform .2s'}}>→</span>}
            </button>
            <div className={`ct-success ${status==='success'?'show':''}`}>✅ Message sent! Sonu will get back to you soon.</div>
            <div className={`ct-error ${status==='error'?'show':''}`}>{errMsg}</div>
          </div>
          <div className="ct-links-wrap">
            <div className="ct-links-title">// REACH_ME_AT</div>
            {links.map((l,i)=>(
              <a key={i} href={l.href} target={l.href.startsWith('http')?'_blank':undefined} className="ct-link">
                <div className="ct-link-icon" style={l.iconStyle as React.CSSProperties}>{l.icon}</div>
                <div className="ct-link-info">
                  <span className="ct-link-platform">{l.platform}</span>
                  <span className="ct-link-val">{l.val}</span>
                </div>
                <span className="ct-link-arr">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
