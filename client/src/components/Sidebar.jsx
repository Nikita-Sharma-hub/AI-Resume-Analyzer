import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { cn } from '../utils/cn.jsx'
import {
  Home,
  User,
  FileText,
  Briefcase,
  Search,
  Settings,
  Upload,
  BarChart3,
  Users,
  Calendar,
  Target,
  Plus,
  Star,
  ChevronRight,
  Building
} from 'lucide-react'

function IconSparkles(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2l1.2 4.2L17 7.4l-3.8 1.2L12 13l-1.2-4.4L7 7.4l3.8-1.2L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M5 14l.8 2.6L8 17.4l-2.2.8L5 21l-.8-2.8L2 17.4l2.2-.8L5 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const linkBase =
  'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition'

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()

  const candidateLinks = [
    { to: '/candidate', label: 'Dashboard', icon: Home },
    { to: '/candidate/profile', label: 'My Profile', icon: User },
    { to: '/candidate/upload-resume', label: 'Upload Resume', icon: Upload },
    { to: '/candidate/resume-analysis', label: 'Resume Analysis', icon: FileText },
    { to: '/candidate/ai-feedback', label: 'AI Feedback', icon: BarChart3 },
    { to: '/candidate/job-search', label: 'Job Search', icon: Search },
    { to: '/candidate/applied-jobs', label: 'Applied Jobs', icon: Briefcase },
    { to: '/candidate/settings', label: 'Settings', icon: Settings }
  ]

  const recruiterLinks = [
    { to: '/recruiter', label: 'Dashboard', icon: Home },
    { to: '/recruiter/post-job', label: 'Post New Job', icon: Plus },
    { to: '/recruiter/manage-jobs', label: 'Manage Jobs', icon: Briefcase },
    { to: '/recruiter/applicants', label: 'All Applicants', icon: Users },
    { to: '/recruiter/ranked-candidates', label: 'Ranked Candidates', icon: Star },
    { to: '/recruiter/profile', label: 'Recruiter Profile', icon: User },
    { to: '/recruiter/settings', label: 'Settings', icon: Settings }
  ]

  const links = user?.role === 'recruiter' ? recruiterLinks : candidateLinks

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden',
          open ? 'block' : 'hidden'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/60 dark:border-slate-800/60',
          'bg-white/40 dark:bg-slate-950/20 backdrop-blur-xl',
          'transform transition lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-16 px-4 flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-indigo-600 to-fuchsia-500 text-white flex items-center justify-center shadow-sm shadow-indigo-600/20">
            <IconSparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              AI Resume Match
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 truncate">
              {user?.role === 'recruiter' ? 'Recruiter' : 'Candidate'} workspace
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  linkBase,
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-700 dark:text-indigo-200 border border-indigo-500/20'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/40'
                )
              }
              onClick={onClose}
              end
            >
              <l.icon className="h-5 w-5" />
              <span className="truncate">{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <div className="app-surface rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Pro tip
            </div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Use demo credentials if no API is connected.
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

