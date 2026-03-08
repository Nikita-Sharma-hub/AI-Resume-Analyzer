import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import Button from '../../components/ui/Button.jsx'
import Dropzone from '../../components/Dropzone.jsx'
import { analyzeResume, matchResumeWithJob, optimizeResume, getJobRecommendations } from '../../services/candidateService.jsx'

export default function CandidateDashboard() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [matchResult, setMatchResult] = useState(null)
  const [optimizationResult, setOptimizationResult] = useState(null)
  const [targetRole, setTargetRole] = useState('')

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    try {
      const jobs = await getJobRecommendations()
      setRecommendations(jobs)
    } catch (err) {
      console.error('Failed to load recommendations:', err)
    }
  }

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

  const onOptimize = async () => {
    if (!file || !targetRole) {
      setError('Please upload a resume and specify target role.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const data = await optimizeResume(file, targetRole)
      setOptimizationResult(data)
    } catch (e) {
      setError(e?.message || 'Failed to optimize resume.')
    } finally {
      setLoading(false)
    }
  }

  const onMatchWithJob = async (jobId) => {
    if (!result?.resumeId) {
      setError('Please analyze your resume first.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const data = await matchResumeWithJob(result.resumeId, jobId)
      setMatchResult(data)
    } catch (e) {
      setError(e?.message || 'Failed to match resume with job.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (newFile) => {
    setFile(newFile)
    setError(null)
    setResult(null)
    setMatchResult(null)
    setOptimizationResult(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            AI Resume Analyzer
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Upload your resume to get AI-powered analysis, job matching, and optimization.
          </div>
        </div>
        {result?.score != null ? (
          <Badge tone={result.score >= 85 ? 'success' : 'info'}>
            Match score: {result.score}%
          </Badge>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
        <div className="space-y-4">
          <Card>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Resume Analysis
            </div>
            <div className="mt-3 space-y-3">
              <Dropzone file={file} onFile={handleFileChange} disabled={loading} />

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Target role (e.g., Senior Frontend Developer)"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none transition app-surface focus:ring-2 focus:ring-indigo-500/60"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={onAnalyze} loading={loading} disabled={!file}>
                  Analyze Resume
                </Button>
                <Button onClick={onOptimize} loading={loading} disabled={!file || !targetRole}>
                  Optimize for Role
                </Button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
                {error}
              </div>
            ) : null}
          </Card>

          {result ? (
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Analysis Results
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Target role: {result.role || 'Not specified'}
                  </div>
                </div>
                <div className="w-full max-w-xs">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Match score</span>
                    <span>{result.score}%</span>
                  </div>
                  <ProgressBar
                    value={result.score}
                    className="mt-1.5"
                    tone={result.score >= 85 ? 'emerald' : 'indigo'}
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

          {optimizationResult ? (
            <Card>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Resume Optimization
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Current Score: {optimizationResult.currentScore}%
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Target Role: {optimizationResult.targetRole}
                  </div>
                </div>

                {optimizationResult.optimizationSuggestions?.improvements?.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Improvement Suggestions:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {optimizationResult.optimizationSuggestions.improvements.map((suggestion, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-400" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ) : null}
        </div>

        <div className="space-y-4">
          {result ? (
            <Card>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Skills & Analysis
              </div>
              {result?.extractedSkills?.length ? (
                <>
                  {result.seniorityHint ? (
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      Estimated Seniority: {result.seniorityHint}
                    </div>
                  ) : null}
                  <div className="mt-3">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Extracted Skills:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.extractedSkills.map((s) => (
                        <Badge key={s} tone="neutral">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              ) : result?.extracted?.skills?.length ? (
                <>
                  {result.extracted.seniorityHint ? (
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      Estimated Seniority: {result.extracted.seniorityHint}
                    </div>
                  ) : null}
                  <div className="mt-3">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Extracted Skills:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.extracted.skills.map((s) => (
                        <Badge key={s} tone="neutral">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Once analyzed, we'll surface key skills detected in your resume.
                </p>
              )}
            </Card>
          ) : null}

          {matchResult ? (
            <Card>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Job Matching Results
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">Match Score:</span>
                  <Badge tone={matchResult.matchScore >= 85 ? 'success' : matchResult.matchScore >= 70 ? 'info' : 'neutral'}>
                    {matchResult.matchScore}%
                  </Badge>
                </div>

                {matchResult.matchingSkills?.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Matching Skills:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.matchingSkills.map((skill) => (
                        <Badge key={skill} tone="success">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {matchResult.missingSkills?.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Skills to Develop:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.missingSkills.map((skill) => (
                        <Badge key={skill} tone="warning">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Recommendation:</strong> {matchResult.recommendation}
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Job Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            AI Job Recommendations
          </div>
          <div className="mt-3 space-y-3">
            {recommendations.map((job) => (
              <div key={job._id} className="border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {job.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {job.company} • {job.location}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onMatchWithJob(job._id)}
                    disabled={!result}
                  >
                    Match Resume
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

