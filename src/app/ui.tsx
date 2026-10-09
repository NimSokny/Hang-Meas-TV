import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { Check, Globe, Info, Play, Search, User, ChevronDown, Heart, AlertTriangle, Loader2, Tv, X } from 'lucide-react'
import { ACTION_LABEL, KIND_LABEL, type Item } from './data'
import { useStore, type Lang } from './store'

export const route = (i: Item) => `/details/${i.id}`

/* ---------- Brand + nav ---------- */
export function Logo() {
  return (
    <Link to="/" className="tv flex items-center gap-3 rounded-xl px-2 py-1" aria-label="Hang Meas TV home">
      <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-amber-400">
        <Play className="size-5 fill-white text-white" />
      </span>
      <span className="leading-tight">
        <span className="block text-[0.95rem] font-black tracking-wide text-gold">HANG MEAS TV</span>
        <span className="block text-[0.7rem] font-bold tracking-[0.3em] text-white/80">PLAY</span>
      </span>
    </Link>
  )
}

const NAV: { to: string; en: string; kh: string }[] = [
  { to: '/', en: 'Home', kh: 'ទំព័រដើម' },
  { to: '/live', en: 'Live TV', kh: 'ផ្សាយផ្ទាល់' },
  { to: '/replay', en: 'Replay', kh: 'ទស្សនាឡើងវិញ' },
  { to: '/highlights', en: 'Highlights', kh: 'ចំណុចសំខាន់' },
  { to: '/favorites', en: 'Favorites', kh: 'ចំណូលចិត្ត' },
]

export function TvNavigationBar() {
  const { lang, setLang } = useStore()
  const [menu, setMenu] = useState(false)
  const nav = useNavigate()
  const icon = 'tv grid size-11 place-items-center rounded-full text-white hover:bg-white/10'
  return (
    <header className="sticky top-0 z-40 px-6 pt-4">
      <div className="flex items-center justify-between rounded-3xl border border-line bg-surface/95 px-5 py-2.5 backdrop-blur">
        <Logo />
        <nav className="flex items-center gap-2" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                `tv relative rounded-xl px-4 py-2.5 text-[1.05rem] font-medium ${isActive ? 'text-gold' : 'text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  {lang === 'KH' ? n.kh : n.en}
                  {isActive && <span className="absolute inset-x-3 -bottom-2 h-[3px] rounded-full bg-gold" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="relative flex items-center gap-1">
          <button className={icon} aria-label="Search" onClick={() => nav('/search')}>
            <Search className="size-5" />
          </button>
          <button className={`${icon} !w-auto gap-1.5 px-3 text-sm font-bold`} aria-label="Language" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <Globe className="size-5" />
            {lang}
            <ChevronDown className="size-4 text-white/60" />
          </button>
          <button className={`${icon} bg-white/10`} aria-label="Profile" onClick={() => nav('/profile')}>
            <User className="size-5" />
          </button>
          {menu && (
            <div data-modal className="absolute right-12 top-14 z-50 w-44 rounded-2xl border border-line bg-surface-2 p-2 shadow-2xl" onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), setMenu(false))}>
              {(['EN', 'KH'] as Lang[]).map((l) => (
                <button
                  key={l}
                  autoFocus={l === lang}
                  className="tv flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left"
                  onClick={() => (setLang(l), setMenu(false))}
                >
                  {l === 'EN' ? 'English' : 'ខ្មែរ (Khmer)'}
                  {l === lang && <Check className="size-4 text-gold" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

/* ---------- Buttons, chips ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode }
export function PrimaryActionButton({ icon, children, className = '', ...p }: BtnProps) {
  return (
    <button {...p} className={`tv inline-flex items-center gap-2.5 rounded-2xl bg-gold px-8 py-4 text-[1.1rem] font-bold text-gold-ink ${className}`}>
      {icon ?? <Play className="size-5 fill-current" />}
      {children}
    </button>
  )
}
export function SecondaryActionButton({ icon, children, className = '', ...p }: BtnProps) {
  return (
    <button {...p} className={`tv inline-flex items-center gap-2.5 rounded-2xl bg-surface-2 px-7 py-4 text-[1.1rem] font-bold text-white ring-1 ring-white/10 ${className}`}>
      {icon}
      {children}
    </button>
  )
}
export function CategoryChip({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={active} className={`tv rounded-full px-5 py-2 text-[0.95rem] font-medium ${active ? 'bg-gold text-gold-ink' : 'bg-surface-2 text-white ring-1 ring-white/10'}`}>
      {children}
    </button>
  )
}

export function Tag({ item, solid }: { item: Item; solid?: boolean }) {
  return (
    <span className={`rounded-md px-2.5 py-1 text-[0.72rem] font-black tracking-wider ${item.kind === 'live' ? 'bg-red-600 text-white' : solid ? 'bg-gold text-gold-ink' : 'bg-black/70 text-white'}`}>
      {item.kind === 'live' && <span className="live-dot mr-1.5 inline-block size-1.5 rounded-full bg-white align-middle" />}
      {KIND_LABEL[item.kind]}
    </span>
  )
}
export const FreeTag = () => <span className="rounded-md bg-gold px-2.5 py-1 text-[0.72rem] font-black tracking-wider text-gold-ink">FREE</span>

/* ---------- Image with fallback ---------- */
export function Img({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [state, setState] = useState<'load' | 'ok' | 'err'>('load')
  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
      {state !== 'err' && (
        <img src={src} alt={alt} loading="lazy" onLoad={() => setState('ok')} onError={() => setState('err')} className={`size-full object-cover transition-opacity duration-500 ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`} />
      )}
      {state === 'err' && (
        <div className="absolute inset-0 grid place-items-center text-white/30">
          <Tv className="size-10" />
        </div>
      )}
    </div>
  )
}

/* ---------- Cards, sections ---------- */
export function ContentCard({ item, wide }: { item: Item; wide?: boolean }) {
  const { isFav } = useStore()
  return (
    <Link to={route(item)} className={`tv tv-card group block shrink-0 rounded-2xl ${wide ? 'w-[26rem]' : 'w-[22rem]'}`}>
      <div className="relative">
        <Img src={item.image} alt={item.title} className="aspect-video rounded-2xl" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Tag item={item} />
          {item.free && <FreeTag />}
        </div>
        {isFav(item.id) && <Heart className="absolute right-3 top-3 size-5 fill-gold text-gold" aria-label="In favorites" />}
        {item.duration && item.kind !== 'live' && <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2 py-0.5 text-xs font-medium">{item.duration}</span>}
        {item.score && <span className="absolute bottom-3 left-3 rounded bg-gold px-2.5 py-0.5 text-sm font-black text-gold-ink">{item.score}</span>}
      </div>
      <div className="px-1 pb-1 pt-3">
        <h3 className="line-clamp-2 text-[1.02rem] font-bold leading-snug">{item.title}</h3>
        <p className="mt-1 truncate text-sm text-mute">{[item.kind === 'live' ? item.date : item.date, item.category].filter(Boolean).join(' · ')}</p>
      </div>
    </Link>
  )
}

export function ContentCarousel({ items, wide }: { items: Item[]; wide?: boolean }) {
  return (
    <div className="no-scrollbar -mx-6 flex gap-5 overflow-x-auto px-6 py-4">
      {items.map((i) => (
        <ContentCard key={i.id} item={i} wide={wide} />
      ))}
    </div>
  )
}

export function ContentSection({ title, items, to, wide }: { title: string; items: Item[]; to?: string; wide?: boolean }) {
  if (!items.length) return null
  return (
    <section className="mt-6">
      <div className="flex items-end justify-between">
        <h2 className="text-[1.5rem] font-black uppercase tracking-wide">{title}</h2>
        {to && (
          <Link to={to} className="tv rounded-lg px-3 py-1 text-sm font-bold text-gold">
            See all
          </Link>
        )}
      </div>
      <ContentCarousel items={items} wide={wide} />
    </section>
  )
}

/* ---------- Featured banner ---------- */
export function FeaturedContentBanner({ items, autoplay = true }: { items: Item[]; autoplay?: boolean }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const nav = useNavigate()
  const { isFav } = useStore()
  const n = items.length
  useEffect(() => {
    if (!autoplay || paused || n < 2) return
    const t = setInterval(() => setI((v) => (v + 1) % n), 7000)
    return () => clearInterval(t)
  }, [autoplay, paused, n])
  const item = items[i]
  if (!item) return null
  const step = (d: number) => setI((v) => (v + d + n) % n)
  return (
    <div
      data-banner
      className="relative mt-4 aspect-[21/9] overflow-hidden rounded-3xl bg-surface"
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault()
          step(e.key === 'ArrowRight' ? 1 : -1)
        }
      }}
    >
      {items.map((it, idx) => (
        <img key={it.id} src={it.image.replace('w=1280&h=720', 'w=1920&h=820')} alt={it.title} className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${idx === i ? 'opacity-100' : 'opacity-0'}`} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute inset-y-0 left-0 flex max-w-[55%] flex-col justify-end gap-4 p-10">
        <div className="flex gap-2">
          <Tag item={item} solid />
          {item.free && <FreeTag />}
        </div>
        <h1 className="line-clamp-2 text-[2.6rem] font-black leading-[1.1]">{item.title}</h1>
        <p className="line-clamp-2 max-w-xl text-[1.05rem] text-white/75">{item.description}</p>
        <p className="text-sm text-mute">
          {[item.channel ?? 'Hang Meas TV', item.category, item.date, item.duration].filter(Boolean).join(' · ')}
        </p>
        <div className="flex gap-4 pt-1">
          <PrimaryActionButton data-initial onClick={() => nav(`/watch/${item.id}`)}>
            {ACTION_LABEL[item.kind]}
          </PrimaryActionButton>
          <SecondaryActionButton icon={<Info className="size-5" />} onClick={() => nav(route(item))}>
            More details
          </SecondaryActionButton>
        </div>
      </div>
      <div className="absolute bottom-6 right-8 flex items-center gap-2" aria-hidden>
        {items.map((it, idx) => (
          <span key={it.id} className={`h-2 rounded-full transition-all ${idx === i ? 'w-8 bg-gold' : 'w-2 bg-white/40'}`} />
        ))}
      </div>
      {isFav(item.id) && <Heart className="absolute right-8 top-6 size-6 fill-gold text-gold" />}
    </div>
  )
}

/* ---------- Page shell ---------- */
export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mt-8 flex items-end justify-between gap-6">
      <div>
        <h1 className="text-[2.4rem] font-black uppercase tracking-wide">{title}</h1>
        {sub && <p className="mt-1 text-mute">{sub}</p>}
      </div>
      <div className="flex gap-3">{children}</div>
    </div>
  )
}

/* ---------- States ---------- */
export function EmptyStateView({ icon, title, body, action }: { icon?: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="mx-auto mt-16 flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-dashed border-line px-8 py-14 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-surface-2 text-gold">{icon ?? <Heart className="size-7" />}</div>
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="text-mute">{body}</p>
      {action}
    </div>
  )
}
export function LoadingStateView({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="grid place-items-center gap-3 py-20 text-mute" role="status">
      <Loader2 className="size-9 animate-spin text-gold" />
      {label}
    </div>
  )
}
export function ErrorStateView({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 px-8 text-center" role="alert">
      <AlertTriangle className="size-12 text-gold" />
      <h2 className="text-2xl font-black">{title}</h2>
      <p className="max-w-md text-mute">{body}</p>
      {action}
    </div>
  )
}

/* ---------- Confirm dialog ---------- */
export function ConfirmDialog({ title, body, confirm, onConfirm, onCancel }: { title: string; body: string; confirm: string; onConfirm: () => void; onCancel: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    return () => prev?.focus()
  }, [])
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6" onKeyDown={(e) => (e.key === 'Escape' || e.key === 'Backspace') && (e.preventDefault(), onCancel())}>
      <div ref={ref} data-modal role="alertdialog" aria-label={title} className="w-full max-w-lg rounded-3xl border border-line bg-surface p-8">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-black">{title}</h2>
          <X className="size-5 text-mute" />
        </div>
        <p className="mt-3 text-mute">{body}</p>
        <div className="mt-8 flex gap-4">
          <SecondaryActionButton autoFocus onClick={onCancel}>Cancel</SecondaryActionButton>
          <PrimaryActionButton icon={<Heart className="size-5" />} onClick={onConfirm}>{confirm}</PrimaryActionButton>
        </div>
      </div>
    </div>
  )
}
