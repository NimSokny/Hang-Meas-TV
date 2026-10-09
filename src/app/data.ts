// MOCK DATA: clearly identified preview content. Swap for real API data when available.
export type Kind = 'live' | 'replay' | 'highlight' | 'movie'

export interface Item {
  id: string
  kind: Kind
  title: string
  description: string
  category: string
  image: string
  date?: string
  duration?: string
  free?: boolean
  teams?: [string, string]
  score?: string
  channel?: string
  streamUrl?: string
}

const u = (id: string, w = 1280) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${Math.round((w * 9) / 16)}&fit=crop&auto=format&q=80`

const IMG = {
  pitch: u('1522778119026-d647f0596c20'),
  arena: u('1434648957308-5e6a859697e8'),
  match: u('1431324155629-1a6deb1dec8d'),
  night: u('1629217855633-79a6925d6c47'),
  stadium: u('1550413231-202a9d53a331').replace('photo-', 'flagged/photo-'),
  crowd: u('1473976345543-9ffc928e648d'),
  bowl: u('1679391029864-d46f366a456b'),
  duel: u('1494177310973-4841f7d5a882'),
  women: u('1567989995326-46ed902b0494'),
  kick: u('1667842501559-6c03ae022505'),
  neon: u('1706830027380-bef6760836e4'),
  theater: u('1761819952025-73c0398c2ec9'),
}

export const ITEMS: Item[] = [
  { id: 'r1', kind: 'replay', title: 'France vs England | Full Match | FIFA World Cup 2026', description: 'Les Bleus and the Three Lions meet in a knockout thriller. Full 90 minutes with Khmer commentary from the Hang Meas studio.', category: 'Football', image: IMG.bowl, date: '19 Jul 2026', duration: '1:52:40', free: true, teams: ['France', 'England'] },
  { id: 'r2', kind: 'replay', title: 'Argentina vs Spain | Full Match | Finalissima', description: 'A heavyweight clash of continental champions, replayed in full with post-match analysis.', category: 'Football', image: IMG.crowd, date: '16 Jul 2026', duration: '1:49:12', teams: ['Argentina', 'Spain'] },
  { id: 'r3', kind: 'replay', title: 'Brazil vs Germany | Full Match | Group Stage', description: 'Samba against precision. Every pass, every goal, start to finish.', category: 'Football', image: IMG.night, date: '14 Jul 2026', duration: '1:50:03', free: true, teams: ['Brazil', 'Germany'] },
  { id: 'r4', kind: 'replay', title: 'Phnom Penh Crown vs Angkor Tiger | League Round 12', description: 'The Cambodian League derby that decided the top of the table.', category: 'Football', image: IMG.arena, date: '11 Jul 2026', duration: '1:47:30', teams: ['Phnom Penh Crown', 'Angkor Tiger'] },
  { id: 'r5', kind: 'replay', title: 'SEA Games Final | Women\'s Football', description: 'Southeast Asia\'s best go head to head for gold in front of a sold-out crowd.', category: 'Women\'s Football', image: IMG.women, date: '08 Jul 2026', duration: '1:55:20', free: true },
  { id: 'r6', kind: 'replay', title: 'Portugal vs Netherlands | Quarter Final', description: 'Extra time, penalties and a goalkeeper hero. Relive the full tie.', category: 'Football', image: IMG.stadium, date: '05 Jul 2026', duration: '2:14:08', teams: ['Portugal', 'Netherlands'] },

  { id: 'l1', kind: 'live', title: 'Hang Meas Sports 1', description: 'Live football, boxing and regional leagues, 24 hours a day.', category: 'Sports', image: IMG.pitch, channel: 'HM Sports 1', free: false, date: 'Now: Cambodian League Live' },
  { id: 'l2', kind: 'live', title: 'Hang Meas Football HD', description: 'Dedicated 24/7 football channel with live matches, magazine shows and classic replays.', category: 'Football', image: IMG.kick, channel: 'HM Football', date: 'Now: Match Day Live' },
  { id: 'l3', kind: 'live', title: 'Hang Meas Movies', description: 'Blockbuster movies and series dubbed in Khmer.', category: 'Movies', image: IMG.neon, channel: 'HM Movies', free: true, date: 'Now: Night Run' },
  { id: 'l4', kind: 'live', title: 'Hang Meas Studio', description: 'Talk shows, pre-match analysis and behind-the-scenes content.', category: 'Entertainment', image: IMG.theater, channel: 'HM Studio', free: true, date: 'Now: Kickoff Talk' },
  { id: 'l5', kind: 'live', title: 'Hang Meas Sports 2', description: 'Overflow channel for simultaneous matches and special events.', category: 'Sports', image: IMG.match, channel: 'HM Sports 2', date: 'Now: Basketball Night' },

  { id: 'h1', kind: 'highlight', title: 'England 3-1 France | Highlights', description: 'Every goal and big moment from a seven-minute cut of the knockout classic.', category: 'Football', image: IMG.duel, date: '19 Jul 2026', duration: '7:42', free: true, teams: ['England', 'France'], score: '3 - 1' },
  { id: 'h2', kind: 'highlight', title: 'Spain 2-2 Argentina | Highlights', description: 'Late drama and a pair of stunning free kicks.', category: 'Football', image: IMG.crowd, date: '16 Jul 2026', duration: '6:15', teams: ['Spain', 'Argentina'], score: '2 - 2' },
  { id: 'h3', kind: 'highlight', title: 'Germany 0-2 Brazil | Highlights', description: 'Brazil\'s counter-attacking masterclass in six minutes.', category: 'Football', image: IMG.bowl, date: '14 Jul 2026', duration: '6:58', free: true, teams: ['Germany', 'Brazil'], score: '0 - 2' },
  { id: 'h4', kind: 'highlight', title: 'Angkor Tiger 1-1 Crown | Highlights', description: 'Derby day goals, saves and tempers.', category: 'Football', image: IMG.arena, date: '11 Jul 2026', duration: '5:20', teams: ['Angkor Tiger', 'Phnom Penh Crown'], score: '1 - 1' },
  { id: 'h5', kind: 'highlight', title: 'Top 10 Goals of the Week', description: 'The ten best strikes from around the world, ranked.', category: 'Compilation', image: IMG.match, date: '20 Jul 2026', duration: '9:03', free: true },

  { id: 'm1', kind: 'movie', title: 'Night Run', description: 'A courier races across a neon city to deliver one package before dawn.', category: 'Action', image: IMG.neon, date: '2025', duration: '1:48:00', free: true },
  { id: 'm2', kind: 'movie', title: 'The Last Curtain', description: 'An aging stage actor gets one final night on Broadway.', category: 'Drama', image: IMG.theater, date: '2024', duration: '2:02:00' },
]

export const byId = (id?: string) => ITEMS.find((i) => i.id === id)
export const ofKind = (k: Kind) => ITEMS.filter((i) => i.kind === k)
export const KIND_LABEL: Record<Kind, string> = { live: 'LIVE', replay: 'REPLAY', highlight: 'HIGHLIGHT', movie: 'MOVIE' }
export const ACTION_LABEL: Record<Kind, string> = { live: 'Watch Live', replay: 'Watch Replay', highlight: 'Play Highlight', movie: 'Watch Now' }

export const related = (item: Item) =>
  ITEMS.filter((i) => i.id !== item.id && (i.kind === item.kind || i.category === item.category)).slice(0, 8)
