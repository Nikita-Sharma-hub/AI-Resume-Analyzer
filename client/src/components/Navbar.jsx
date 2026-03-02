import Button from './ui/Button.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useTheme } from '../hooks/useTheme.jsx'

function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconSun(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 2v2m0 16v2m10-10h-2M4 12H2m17.07-7.07-1.41 1.41M8.34 15.66l-1.41 1.41m12.14 0-1.41-1.41M8.34 8.34 6.93 6.93"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21 13.1A8 8 0 1 1 10.9 3a6.5 6.5 0 0 0 10.1 10.1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth()
  const { resolvedTheme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/20 backdrop-blur-xl">
      <div className="app-container h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            className="lg:hidden"
            onClick={onMenu}
            aria-label="Open sidebar"
          >
            <IconMenu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {user?.role === 'recruiter' ? 'Recruiter Dashboard' : 'Candidate Dashboard'}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 truncate">
              {user?.name} • {user?.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={toggle} aria-label="Toggle theme">
            {resolvedTheme === 'dark' ? (
              <IconSun className="h-5 w-5" />
            ) : (
              <IconMoon className="h-5 w-5" />
            )}
          </Button>
          <Button type="button" variant="secondary" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}

