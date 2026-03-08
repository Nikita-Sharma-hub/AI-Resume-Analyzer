import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { cn } from '../utils/cn.jsx'

export default function Register() {
  const { register, busy, error } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('candidate')
  const [localError, setLocalError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    if (!name) return setLocalError('Name is required')
    if (!email) return setLocalError('Email is required')
    if (!password || password.length < 6) return setLocalError('Password must be at least 6 characters')
    try {
      const user = await register({ name, email, password, role })
      navigate(user?.role === 'recruiter' ? '/recruiter' : '/candidate', { replace: true })
    } catch {
    }
  }

  return (
    <div className="min-h-full flex items-center">
      <div className="app-container py-10">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 shadow-sm shadow-indigo-600/20" />
            <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Choose a role to get the right dashboard.
            </p>
          </div>

          <Card className="mt-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                label="Full name"
                autoComplete="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint="At least 6 characters."
              />

              <label className="block">
                <div className="mb-1.5 text-sm font-medium text-slate-800 dark:text-slate-100">
                  Role
                </div>
                <select
                  className={cn(
                    'h-11 w-full rounded-xl px-3 text-sm outline-none transition app-surface',
                    'focus:ring-2 focus:ring-indigo-500/60'
                  )}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="candidate">Candidate</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </label>

              {localError || error ? (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
                  {localError || error}
                </div>
              ) : null}

              <Button type="submit" className="w-full" size="lg" loading={busy}>
                Create account
              </Button>
            </form>
          </Card>

          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{' '}
            <Link className="font-medium text-indigo-700 dark:text-indigo-200" to="/login">
              Sign in
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link className="text-sm text-slate-600 dark:text-slate-300 hover:underline" to="/">
              Back to landing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

