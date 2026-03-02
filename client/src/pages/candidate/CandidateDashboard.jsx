import { useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import Button from '../../components/ui/Button.jsx'
import Dropzone from '../../components/Dropzone.jsx'
import { analyzeResume } from '../../services/candidateService.jsx'

export default function CandidateDashboard() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume first.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const data = await analyzeResume(file)
      setResult(data)
    } catch (e) {
      setError(e?.message || 'Failed to analyze resume.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            Resume analyzer
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Upload your resume to get match scores and actionable AI feedback.
          </div>
        </div>
        {result?.matchScore != null ? (
          <Badge tone={result.matchScore >= 85 ? 'success' : 'info'}>
            Match score: {result.matchScore}%
          </Badge>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <div className="space-y-4">
          <Dropzone file={file} onFile={setFile} disabled={loading} />
          <div className="flex justify-end">
            <Button onClick={onAnalyze} loading={loading}>
              Analyze resume
            </Button>
          </div>
          {error ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          {result ? (
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Match overview
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Target role: {result.role || 'Not specified'}
                  </div>
                </div>
                <div className="w-full max-w-xs">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Match score</span>
                    <span>{result.matchScore}%</span>
                  </div>
                  <ProgressBar
                    value={result.matchScore}
                    className="mt-1.5"
                    tone={result.matchScore >= 85 ? 'emerald' : 'indigo'}
                  />
                </div>
              </div>
              {result.summary ? (
                <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
                  {result.summary}
                </p>
              ) : null}
            </Card>
          ) : null}
        </div>

        <div className="space-y-4">
          <Card>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              AI feedback
            </div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Structured suggestions to improve your resume.
            </div>
            {result?.feedback?.length ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {result.feedback.map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-400" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Run an analysis to see prioritized suggestions.
              </p>
            )}
          </Card>

          <Card>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Skills & seniority
            </div>
            {result?.extracted ? (
              <>
                {result.extracted.seniorityHint ? (
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    Estimated seniority: {result.extracted.seniorityHint}
                  </div>
                ) : null}
                {result.extracted.skills?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {result.extracted.skills.map((s) => (
                      <Badge key={s} tone="neutral">
                        {s}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Once analyzed, we’ll surface key skills detected in your resume.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

