import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'

function Feature({ title, text }) {
  return (
    <Card className="p-5">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{text}</div>
    </Card>
  )
}

export default function Landing() {
  return (
    <div className="min-h-full">
      <header className="app-container py-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-500" />
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            AI Resume Match
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button as={Link} to="/login" variant="ghost">
            Login
          </Button>
          <Button as={Link} to="/register">
            Get started
          </Button>
        </div>
      </header>

      <main className="app-container pb-14">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="info">AI Feedback</Badge>
              <Badge tone="success">Job Matching</Badge>
              <Badge tone="neutral">Role-based dashboards</Badge>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Resume analysis that feels like a modern SaaS.
            </h1>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
              Upload a resume, get structured insights, and see a transparent match score for a role.
              Recruiters can post jobs, review applicants, and shortlist faster with ranked candidates.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/register" size="lg">
                Create account
              </Button>
              <Button as={Link} to="/login" size="lg" variant="secondary">
                Sign in
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="app-surface rounded-2xl p-4">
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">92</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Avg. match clarity</div>
              </div>
              <div className="app-surface rounded-2xl p-4">
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">4.8</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Feedback quality</div>
              </div>
              <div className="app-surface rounded-2xl p-4 col-span-2 sm:col-span-1">
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">60%</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Faster screening</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-cyan-400/20 blur-2xl" />
            <Card className="relative p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Candidate snapshot
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Example analysis output
                  </div>
                </div>
                <Badge tone="success">Match: 86%</Badge>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="app-surface rounded-2xl p-4">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Strengths
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                    <li>React & API integration</li>
                    <li>Clean component design</li>
                    <li>Strong communication</li>
                  </ul>
                </div>
                <div className="app-surface rounded-2xl p-4">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Improvements
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                    <li>Quantify impact</li>
                    <li>Add testing examples</li>
                    <li>Highlight leadership</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Feature title="Drag & drop upload" text="Fast resume upload with friendly states and validations." />
          <Feature title="Role-based routing" text="Candidate and Recruiter dashboards with protected access." />
          <Feature title="Modern UI system" text="Glass cards, gradients, dark mode, fully responsive layout." />
        </section>
      </main>
    </div>
  )
}

