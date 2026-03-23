import { useEffect, useRef } from 'react'

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll('.rev')
    const io = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => (e.target as HTMLElement).classList.add('on'), i * 60)
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.07 })
    items.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}
