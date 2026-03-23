import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onScroll = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100
      if (barRef.current) barRef.current.style.width = Math.min(p, 100) + '%'
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div ref={barRef} className="scroll-progress" />
}
