import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

const SEL = 'a[href], button:not([disabled]), [data-focus]'

function visible(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 && el.offsetParent !== null
}

function move(dir: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') {
  const modal = document.querySelector<HTMLElement>('[data-modal]')
  const root: ParentNode = modal ?? document
  const all = Array.from(root.querySelectorAll<HTMLElement>(SEL)).filter(visible)
  const cur = document.activeElement as HTMLElement | null
  if (!cur || !all.includes(cur)) {
    all[0]?.focus()
    return
  }
  const c = cur.getBoundingClientRect()
  const cx = c.left + c.width / 2
  const cy = c.top + c.height / 2
  let best: HTMLElement | null = null
  let bestScore = Infinity
  for (const el of all) {
    if (el === cur) continue
    const r = el.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const dx = x - cx
    const dy = y - cy
    const horiz = dir === 'ArrowLeft' || dir === 'ArrowRight'
    const sign = dir === 'ArrowLeft' || dir === 'ArrowUp' ? -1 : 1
    const primary = (horiz ? dx : dy) * sign
    if (primary <= 4) continue
    const secondary = Math.abs(horiz ? dy : dx)
    const score = primary + secondary * 2.5
    if (score < bestScore) {
      bestScore = score
      best = el
    }
  }
  if (best) {
    best.focus({ preventScroll: true })
    best.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
    const r = best.getBoundingClientRect()
    if (r.top < 140 || r.bottom > window.innerHeight - 40) best.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
}

export function useRemote() {
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (e.key.startsWith('Arrow')) {
        e.preventDefault()
        move(e.key as 'ArrowUp')
      } else if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'BrowserBack' || e.key === 'GoBack') {
        if (document.querySelector('[data-modal]')) return
        e.preventDefault()
        if (loc.pathname !== '/') nav(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nav, loc.pathname])

  // Sensible initial focus on every route change: first thing in main content.
  useEffect(() => {
    const t = setTimeout(() => {
      const first = document.querySelector<HTMLElement>('[data-initial]') ?? document.querySelector<HTMLElement>('main ' + SEL)
      first?.focus({ preventScroll: true })
      window.scrollTo({ top: 0 })
    }, 60)
    return () => clearTimeout(t)
  }, [loc.pathname])
}
