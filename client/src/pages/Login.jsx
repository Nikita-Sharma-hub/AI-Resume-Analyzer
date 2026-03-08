import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Login() {
  const { login, busy, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = useMemo(() => location.state?.from || '/dashboard', [location.state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    if (!email) return setLocalError('Email is required')
    if (!password) return setLocalError('Password is required')
    try {
      const user = await login({ email, password })
      navigate(user?.role === 'recruiter' ? '/recruiter' : '/candidate', { replace: true })
    } catch {

    }
  }

  return (
    <div className="min-h-full flex items-center">
      <div className="app-container py-10">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-linear-to-br from-indigo-600 to-fuchsia-500 shadow-sm shadow-indigo-600/20" />
            <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Sign in to your dashboard.
            </p>
          </div>

          <Card className="mt-6">
            <form onSubmit={onSubmit} className="space-y-4">
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
                autoComplete="current-password"
                placeholder="•••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {localError || error ? (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
                  {localError || error}
                </div>
              ) : null}

              <Button type="submit" className="w-full" size="lg" loading={busy}>
                Sign in
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
              Don&apos;t have an account?{' '}
              <Link className="font-medium text-indigo-700 dark:text-indigo-200" to="/register">
                Create one
              </Link>
            </div>
          </Card>

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

