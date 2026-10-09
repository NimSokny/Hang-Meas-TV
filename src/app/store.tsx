import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'EN' | 'KH'

interface Store {
  favorites: string[]
  isFav: (id: string) => boolean
  toggleFav: (id: string) => void
  lang: Lang
  setLang: (l: Lang) => void
  autoplayBanner: boolean
  setAutoplayBanner: (v: boolean) => void
}

const Ctx = createContext<Store | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => load('hm.fav', ['r1', 'h1']))
  const [lang, setLang] = useState<Lang>(() => load('hm.lang', 'EN'))
  const [autoplayBanner, setAutoplayBanner] = useState<boolean>(() => load('hm.autoplay', true))

  useEffect(() => localStorage.setItem('hm.fav', JSON.stringify(favorites)), [favorites])
  useEffect(() => localStorage.setItem('hm.lang', JSON.stringify(lang)), [lang])
  useEffect(() => localStorage.setItem('hm.autoplay', JSON.stringify(autoplayBanner)), [autoplayBanner])

  const toggleFav = useCallback(
    (id: string) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    [],
  )
  const value = useMemo<Store>(
    () => ({ favorites, isFav: (id) => favorites.includes(id), toggleFav, lang, setLang, autoplayBanner, setAutoplayBanner }),
    [favorites, toggleFav, lang, autoplayBanner],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('StoreProvider missing')
  return v
}
