import { useMemo, useState } from 'react'
import { Link, Outlet, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Captions, Delete, FastForward, Heart, Pause, Play, Rewind, Search as SearchIcon, User, Volume2, RotateCcw, Eraser } from 'lucide-react'
import { ACTION_LABEL, ITEMS, byId, ofKind, related, type Item, type Kind } from './data'
import { useStore } from './store'
import { useRemote } from './remote'
import {
  CategoryChip, ConfirmDialog, ContentCard, ContentSection, EmptyStateView, ErrorStateView, FeaturedContentBanner, FreeTag, Img,
  PageHeader, PrimaryActionButton, SecondaryActionButton, Tag, TvNavigationBar,
} from './ui'

export function Shell() {
  useRemote()
  return (
    <div className="min-h-screen bg-black">
      <TvNavigationBar />
      <main className="px-6 pb-20">
        <Outlet />
      </main>
    </div>
  )
}

/* ---------- Home ---------- */
export function Home() {
  const { autoplayBanner } = useStore()
  const featured = [byId('r1')!, byId('h1')!, byId('l2')!, byId('m1')!]
  return (
    <>
      <FeaturedContentBanner items={featured} autoplay={autoplayBanner} />
      <ContentSection title="Replay" items={ofKind('replay')} to="/replay" />
      <ContentSection title="Live TV" items={ofKind('live')} to="/live" wide />
      <ContentSection title="Highlights" items={ofKind('highlight')} to="/highlights" />
      <ContentSection title="Popular" items={[byId('m1')!, byId('r3')!, byId('h5')!, byId('m2')!, byId('r2')!]} />
    </>
  )
}

/* ---------- Live / Replay / Highlights ---------- */
const COPY: Record<'live' | 'replay' | 'highlight', { title: string; sub: string; path: string }> = {
  live: { title: 'Live TV', sub: 'Channels streaming right now', path: '/live' },
  replay: { title: 'Replay', sub: 'Catch up on full matches and shows', path: '/replay' },
  highlight: { title: 'Highlights', sub: 'The best moments, in minutes', path: '/highlights' },
}

export function Browse({ kind }: { kind: 'live' | 'replay' | 'highlight' }) {
  const items = ofKind(kind)
  const cats = useMemo(() => ['All', ...Array.from(new Set(items.map((i) => i.category)))], [items])
  const [cat, setCat] = useState('All')
  const shown = items.filter((i) => cat === 'All' || i.category === cat)
  const c = COPY[kind]
  return (
    <>
      <FeaturedContentBanner items={items.slice(0, 3)} />
      <PageHeader title={c.title} sub={c.sub} />
      {cats.length > 2 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {cats.map((x) => (
            <CategoryChip key={x} active={x === cat} onClick={() => setCat(x)}>{x}</CategoryChip>
          ))}
        </div>
      )}
      {kind === 'live' && (
        <p className="mt-6 flex items-center gap-2 text-sm font-bold tracking-wider text-red-500">
          <span className="live-dot size-2 rounded-full bg-red-500" /> ON AIR · {shown.length} CHANNELS
        </p>
      )}
      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-x-6 gap-y-8">
        {shown.map((i) => (
          <div key={i.id} className="[&>a]:w-full"><ContentCard item={i} /></div>
        ))}
      </div>
    </>
  )
}

/* ---------- Favorites ---------- */
export function Favorites() {
  const { favorites } = useStore()
  const items = favorites.map((id) => byId(id)).filter(Boolean) as Item[]
  return (
    <>
      <PageHeader title="Favorites" sub={`${items.length} saved`} />
      {items.length === 0 ? (
        <EmptyStateView title="Nothing saved yet" body="Open any movie, replay or highlight and choose Add to Favorites. It will show up here." action={<Link to="/replay" data-initial className="tv rounded-2xl bg-gold px-7 py-3.5 font-bold text-gold-ink">Browse replays</Link>} />
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-x-6 gap-y-8">
          {items.map((i) => (
            <div key={i.id} className="[&>a]:w-full"><ContentCard item={i} /></div>
          ))}
        </div>
      )}
    </>
  )
}

/* ---------- Search ---------- */
const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')

export function SearchPage() {
  const [q, setQ] = useState('')
  const term = q.trim().toLowerCase()
  const results = term ? ITEMS.filter((i) => [i.title, i.category, i.channel, ...(i.teams ?? [])].join(' ').toLowerCase().includes(term)) : []
  const k = 'tv grid h-12 place-items-center rounded-xl bg-surface-2 text-lg font-bold ring-1 ring-white/10'
  return (
    <div className="mt-8 grid grid-cols-[26rem_1fr] gap-10 max-[1000px]:grid-cols-1">
      <div>
        <div className="flex h-16 items-center gap-3 rounded-2xl border border-line bg-surface px-5 text-2xl" aria-live="polite">
          <SearchIcon className="size-6 text-gold" />
          <span className={q ? 'text-white' : 'text-mute'}>{q || 'Search teams, matches, channels'}</span>
          <span className="ml-0.5 h-7 w-0.5 animate-pulse bg-gold" />
        </div>
        <div className="mt-4 grid grid-cols-6 gap-2">
          {KEYS.map((c, idx) => (
            <button key={c} data-initial={idx === 0 ? true : undefined} className={k} onClick={() => setQ((v) => (v + c.toLowerCase()).slice(0, 40))}>{c}</button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button className={`${k} text-sm`} onClick={() => setQ((v) => v + ' ')}>SPACE</button>
          <button className={`${k} gap-1 text-sm`} aria-label="Delete" onClick={() => setQ((v) => v.slice(0, -1))}><Delete className="size-5" /></button>
          <button className={`${k} text-sm`} disabled={!q} aria-label="Clear search" onClick={() => setQ('')}><Eraser className="size-5" /></button>
        </div>
      </div>
      <div>
        {!term ? (
          <EmptyStateView icon={<SearchIcon className="size-7" />} title="Start typing" body="Use the on-screen keyboard. Results appear as you type." />
        ) : results.length === 0 ? (
          <EmptyStateView icon={<SearchIcon className="size-7" />} title={`No results for "${q.trim()}"`} body="Check the spelling or try a team, channel or category." action={<SecondaryActionButton icon={<RotateCcw className="size-4" />} onClick={() => setQ('')}>Clear search</SecondaryActionButton>} />
        ) : (
          <>
            <p className="mb-4 text-mute">{results.length} result{results.length > 1 && 's'}</p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-x-6 gap-y-8">
              {results.map((i) => (
                <div key={i.id} className="[&>a]:w-full"><ContentCard item={i} /></div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- Details ---------- */
const META_LABEL: Record<Kind, string> = { live: 'Channel', replay: 'Broadcast', highlight: 'Match', movie: 'Released' }

export function Details() {
  const { id } = useParams()
  const item = byId(id)
  const nav = useNavigate()
  const { isFav, toggleFav } = useStore()
  const [confirm, setConfirm] = useState(false)
  if (!item)
    return <div className="mt-24"><ErrorStateView title="Content not found" body="This item may have been removed." action={<PrimaryActionButton data-initial icon={<ArrowLeft className="size-5" />} onClick={() => nav('/')}>Back home</PrimaryActionButton>} /></div>
  const fav = isFav(item.id)
  const meta: [string, string | undefined][] = [
    [META_LABEL[item.kind], item.kind === 'live' ? item.channel : item.date],
    [item.kind === 'live' ? 'On now' : 'Duration', item.kind === 'live' ? item.date?.replace('Now: ', '') : item.duration],
    ['Category', item.category],
    ['Score', item.score],
  ]
  return (
    <>
      <div className="relative mt-4 aspect-[21/9] overflow-hidden rounded-3xl">
        <Img src={item.image.replace('w=1280&h=720', 'w=1920&h=820')} alt={item.title} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-[60%] flex-col justify-end gap-4 p-10">
          <div className="flex gap-2"><Tag item={item} solid />{item.free && <FreeTag />}</div>
          <h1 className="text-[2.6rem] font-black leading-[1.1]">{item.title}</h1>
          {item.teams && <p className="text-xl font-bold text-gold">{item.teams[0]} <span className="text-white/60">vs</span> {item.teams[1]}</p>}
          <p className="max-w-2xl text-[1.05rem] text-white/80">{item.description}</p>
          <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {meta.filter(([, v]) => v).map(([k, v]) => (
              <div key={k}><dt className="text-mute">{k}</dt><dd className="font-bold">{v}</dd></div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-4 pt-1">
            <PrimaryActionButton data-initial onClick={() => nav(`/watch/${item.id}`)}>{ACTION_LABEL[item.kind]}</PrimaryActionButton>
            <SecondaryActionButton icon={<Heart className={`size-5 ${fav ? 'fill-gold text-gold' : ''}`} />} onClick={() => (fav ? setConfirm(true) : toggleFav(item.id))}>
              {fav ? 'Remove from Favorites' : 'Add to Favorites'}
            </SecondaryActionButton>
            <SecondaryActionButton icon={<ArrowLeft className="size-5" />} onClick={() => nav(-1)}>Back</SecondaryActionButton>
          </div>
        </div>
      </div>
      <ContentSection title={item.kind === 'live' ? 'More channels' : item.kind === 'replay' ? 'Related replays' : item.kind === 'highlight' ? 'Related highlights' : 'You may also like'} items={related(item)} />
      {confirm && <ConfirmDialog title="Remove from Favorites?" body={`"${item.title}" will be removed from your saved list.`} confirm="Remove" onCancel={() => setConfirm(false)} onConfirm={() => (toggleFav(item.id), setConfirm(false))} />}
    </>
  )
}

/* ---------- Player ---------- */
export function Player() {
  const { id } = useParams()
  const item = byId(id)
  const nav = useNavigate()
  if (!item) return <div className="mt-24"><ErrorStateView title="Content not found" body="Nothing to play." action={<PrimaryActionButton data-initial onClick={() => nav('/')}>Back home</PrimaryActionButton>} /></div>
  const ctl = 'tv grid size-14 place-items-center rounded-full bg-white/10 text-white disabled:opacity-40'
  const live = item.kind === 'live'
  const hasStream = Boolean(item.streamUrl)
  return (
    <div className="mt-4">
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-surface">
        {hasStream ? (
          <video src={item.streamUrl} poster={item.image} className="size-full" autoPlay playsInline />
        ) : (
          <>
            <Img src={item.image} alt="" className="absolute inset-0 opacity-30 blur-sm" />
            <div className="absolute inset-0 grid place-items-center bg-black/60">
              <ErrorStateView
                title="Stream unavailable"
                body="No playback source is connected to this item in the preview build. When a stream URL is provided, the video will load here."
                action={<SecondaryActionButton icon={<RotateCcw className="size-5" />} onClick={() => location.reload()}>Try again</SecondaryActionButton>}
              />
            </div>
          </>
        )}
        <div className="absolute inset-x-0 top-0 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent p-6">
          <button data-initial className="tv grid size-12 place-items-center rounded-full bg-white/15" aria-label="Back" onClick={() => nav(-1)}><ArrowLeft className="size-6" /></button>
          <div><Tag item={item} solid /><h1 className="mt-1 text-xl font-bold">{item.title}</h1></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-16">
          <div className="h-1.5 rounded-full bg-white/20"><div className="h-full w-0 rounded-full bg-gold" /></div>
          <div className="mt-2 flex justify-between text-sm text-mute"><span>{live ? 'LIVE' : '0:00'}</span><span>{live ? '' : item.duration}</span></div>
          <div className="mt-3 flex items-center justify-center gap-5">
            <button className={ctl} disabled={!hasStream || live} aria-label="Back 10 seconds"><Rewind className="size-6" /></button>
            <button className={`${ctl} !size-16 !bg-gold !text-gold-ink`} disabled={!hasStream} aria-label="Play or pause"><Play className="size-7 fill-current" /></button>
            <button className={ctl} disabled={!hasStream || live} aria-label="Forward 10 seconds"><FastForward className="size-6" /></button>
            <span className="mx-3 h-8 w-px bg-white/20" />
            <button className={ctl} disabled={!hasStream} aria-label="Audio"><Volume2 className="size-6" /></button>
            <button className={ctl} disabled={!hasStream} aria-label="Subtitles"><Captions className="size-6" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Profile & Settings ---------- */
export function Profile() {
  const { favorites } = useStore()
  const nav = useNavigate()
  const rows = [['Plan', 'PRO'], ['Member since', 'March 2025'], ['Favorites saved', String(favorites.length)], ['Email', 'sokha.chan@example.com']]
  return (
    <>
      <PageHeader title="Profile" sub="Demo account · mock data" />
      <div className="mt-6 grid max-w-3xl gap-6 rounded-3xl border border-line bg-surface p-8">
        <div className="flex items-center gap-6">
          <span className="grid size-24 place-items-center rounded-full bg-surface-2 text-gold"><User className="size-10" /></span>
          <div><h2 className="text-3xl font-black">Sokha Chan</h2><span className="mt-1 inline-block rounded-md bg-gold px-2.5 py-1 text-xs font-black text-gold-ink">PRO</span></div>
        </div>
        <dl className="grid grid-cols-2 gap-4">
          {rows.map(([k, v]) => <div key={k} className="rounded-2xl bg-surface-2 p-4"><dt className="text-sm text-mute">{k}</dt><dd className="mt-1 font-bold">{v}</dd></div>)}
        </dl>
        <div className="flex gap-4">
          <PrimaryActionButton data-initial icon={<Heart className="size-5" />} onClick={() => nav('/favorites')}>My favorites</PrimaryActionButton>
          <SecondaryActionButton onClick={() => nav('/settings')}>Settings</SecondaryActionButton>
        </div>
      </div>
    </>
  )
}

export function Settings() {
  const { lang, setLang, autoplayBanner, setAutoplayBanner } = useStore()
  const row = 'tv flex w-full items-center justify-between rounded-2xl bg-surface-2 px-6 py-5 text-left ring-1 ring-white/10'
  const Toggle = ({ on }: { on: boolean }) => <span className={`h-7 w-12 rounded-full p-1 transition ${on ? 'bg-gold' : 'bg-white/20'}`}><span className={`block size-5 rounded-full bg-white transition ${on ? 'translate-x-5' : ''}`} /></span>
  return (
    <>
      <PageHeader title="Settings" />
      <div className="mt-6 grid max-w-3xl gap-3">
        <button data-initial className={row} onClick={() => setLang(lang === 'EN' ? 'KH' : 'EN')}>
          <span><span className="block font-bold">Language</span><span className="text-sm text-mute">Changes navigation labels</span></span>
          <span className="font-bold text-gold">{lang === 'EN' ? 'English' : 'ខ្មែរ'}</span>
        </button>
        <button className={row} role="switch" aria-checked={autoplayBanner} onClick={() => setAutoplayBanner(!autoplayBanner)}>
          <span><span className="block font-bold">Auto-rotate featured banner</span><span className="text-sm text-mute">Switch featured titles every 7 seconds</span></span>
          <Toggle on={autoplayBanner} />
        </button>
      </div>
    </>
  )
}

export function NotFound() {
  return <div className="mt-24"><ErrorStateView title="Page not found" body="That screen does not exist." action={<Link to="/" data-initial className="tv rounded-2xl bg-gold px-7 py-3.5 font-bold text-gold-ink">Back home</Link>} /></div>
}

