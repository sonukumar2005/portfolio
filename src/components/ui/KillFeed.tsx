import { useEffect, useRef } from 'react'

const kfData = [
  {icon:'🎯',name:'SONU',verb:'eliminated',target:'BUG_404',tag:'AWM'},
  {icon:'🚀',name:'SONU',verb:'deployed',target:'GitHub Recommender',tag:'AI'},
  {icon:'💡',name:'SONU',verb:'solved',target:'LeetCode Hard',tag:'#412'},
  {icon:'🏆',name:'SONU',verb:'ranked',target:'Code-A-Haunt',tag:'2nd'},
  {icon:'⚔️',name:'SONU',verb:'shipped',target:'Wi-Fi Auto-Login',tag:'JS'},
  {icon:'🎖️',name:'SONU',verb:'earned',target:'TCP/IP',tag:'CERT'},
  {icon:'💥',name:'SONU',verb:'crushed',target:'350+ DSA',tag:'LC'},
  {icon:'🔥',name:'SONU',verb:'built',target:'Gen AI Project',tag:'PYTHON'},
  {icon:'⚡',name:'SONU',verb:'mastered',target:'C++',tag:'C++'},
  {icon:'🥷',name:'SONU',verb:'dominated',target:'Hackathons',tag:'WIN'},
  {icon:'🌐',name:'SONU',verb:'completed',target:'NASSCOM Cert',tag:'CERT'},
  {icon:'🎓',name:'SONU',verb:'pursuing',target:'B.Tech CSE',tag:'LPU'},
]

function shuffle<T>(a: T[]) {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function KillFeed() {
  const feedRef = useRef<HTMLDivElement>(null)
  const poolRef = useRef([...kfData])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const spawn = () => {
      if (!feedRef.current) return
      if (poolRef.current.length === 0) poolRef.current = shuffle(kfData)
      const d = poolRef.current.pop()!
      const el = document.createElement('div')
      el.className = 'kf'
      el.innerHTML = `<span class="kf-icon">${d.icon}</span><span class="kf-name">${d.name}</span><span class="kf-verb">${d.verb}</span><span class="kf-target">${d.target}</span><span class="kf-tag">[${d.tag}]</span>`
      feedRef.current.appendChild(el)
      const all = feedRef.current.querySelectorAll('.kf')
      if (all.length > 4) {
        const oldest = all[0] as HTMLElement
        oldest.classList.remove('in')
        oldest.classList.add('out')
        setTimeout(() => oldest.remove(), 500)
      }
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')))
      setTimeout(() => {
        el.classList.remove('in'); el.classList.add('out')
        setTimeout(() => { if (el.parentNode) el.remove() }, 500)
      }, 5000)
      timerRef.current = setTimeout(spawn, 1800 + Math.random() * 1700)
    }
    timerRef.current = setTimeout(spawn, 1500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return <div id="killfeed" ref={feedRef} />
}
