import { createBrowserRouter } from 'react-router'
import { Browse, Details, Favorites, Home, NotFound, Player, Profile, SearchPage, Settings, Shell } from './pages'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Shell,
    children: [
      { index: true, Component: Home },
      { path: 'live', element: <Browse kind="live" /> },
      { path: 'replay', element: <Browse kind="replay" /> },
      { path: 'highlights', element: <Browse kind="highlight" /> },
      { path: 'favorites', Component: Favorites },
      { path: 'search', Component: SearchPage },
      { path: 'details/:id', Component: Details },
      { path: 'watch/:id', Component: Player },
      { path: 'profile', Component: Profile },
      { path: 'settings', Component: Settings },
      { path: '*', Component: NotFound },
    ],
  },
])
