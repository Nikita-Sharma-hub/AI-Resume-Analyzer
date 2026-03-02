import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { createJob, listApplicants } from '../../services/recruiterService.jsx'

export default function RecruiterDashboard() {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [seniority, setSeniority] = useState('Mid-level')
  const [summary, setSummary] = useState('')
  const [job, setJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!job?.id) return
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const list = await listApplicants(job.id)
        if (active) setApplicants(list)
      } catch (e) {
        if (active) setError(e?.message || 'Failed to load applicants.')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [job?.id])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!title) return setError('Job title is required.')
    try {
      const created = await createJob({ title, location, seniority, summary })
      setJob(created)
    } catch (e) {
      setError(e?.message || 'Failed to create job.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            Job posts & applicants
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Create a role and review ranked candidates by AI match score.
          </div>
        </div>
        {job ? (
          <Badge tone="info">Active job: {job.title}</Badge>
        ) : (
          <Badge tone="neutral">No job created yet</Badge>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)]">
        <Card>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            Post a job
          </div>
          <form onSubmit={onSubmit} className="mt-3 space-y-3">
            <Input
              label="Job title"
              placeholder="Senior Frontend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label="Location"
              placeholder="Remote • Europe"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Seniority"
              placeholder="Mid-level, Senior, Lead..."
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
            />
            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-slate-800 dark:text-slate-100">
                Summary / must-haves
              </div>
              <textarea
                rows={4}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none transition app-surface focus:ring-2 focus:ring-indigo-500/60"
                placeholder="React, TypeScript, testing, performance, design systems..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </label>
            {error ? (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
                {error}
              </div>
            ) : null}
            <Button type="submit" loading={loading}>
              {job ? 'Update job details' : 'Create job'}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Applicants
              </div>
              <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Ranked by AI match score.
              </div>
            </div>
            <Badge tone="neutral">
              {applicants.length ? `${applicants.length} applicants` : 'Waiting for applicants'}
            </Badge>
          </div>

          {loading && !applicants.length ? (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Loading ranked candidates...
            </p>
          ) : null}

          <div className="mt-4 space-y-3">
            {applicants.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-950/20 px-3 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {a.name}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {a.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        a.status === 'shortlisted'
                          ? 'success'
                          : a.status === 'review'
                            ? 'info'
                            : 'neutral'
                      }
                    >
                      {a.status}
                    </Badge>
                    <div className="w-28">
                      <ProgressBar value={a.matchScore} tone="emerald" />
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 text-right">
                        {a.matchScore}%
                      </div>
                    </div>
                  </div>
                </div>
                {a.highlights?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {a.highlights.map((h) => (
                      <Badge key={h} tone="neutral">
                        {h}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {!applicants.length && !loading ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Once your ATS or API is connected, applicants will be ranked here automatically.
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  )
}

