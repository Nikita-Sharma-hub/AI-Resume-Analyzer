import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { createJob, getJobApplicants, getMyJobs, rankApplicants } from '../../services/recruiterService.jsx'

export default function RecruiterDashboard() {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('mid-level')
  const [skillsRequired, setSkillsRequired] = useState('')
  const [job, setJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(() => {
    loadMyJobs()
  }, [])

  useEffect(() => {
    if (!selectedJob?.id) return
    loadApplicants()
  }, [selectedJob?.id])

  const loadMyJobs = async () => {
    try {
      const jobs = await getMyJobs()
      setMyJobs(jobs)
      if (jobs.length > 0) {
        setSelectedJob(jobs[0])
      }
    } catch (err) {
      console.error('Failed to load jobs:', err)
    }
  }

  const loadApplicants = async () => {
    setLoading(true)
    try {
      const list = await getJobApplicants(selectedJob.id)
      setApplicants(list.applicants || [])
    } catch (e) {
      setError(e?.message || 'Failed to load applicants.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!title || !description) return setError('Job title and description are required.')
    try {
      const jobData = {
        title,
        location,
        description,
        experienceLevel,
        skillsRequired: skillsRequired.split(',').map(s => s.trim()).filter(s => s)
      }
      const created = await createJob(jobData)
      setJob(created)
      setSelectedJob(created)
      setMyJobs([created, ...myJobs])
    } catch (e) {
      setError(e?.message || 'Failed to create job.')
    }
  }

  const onRankApplicants = async () => {
    if (!selectedJob?.id) return
    setLoading(true)
    try {
      await rankApplicants(selectedJob.id)
      await loadApplicants()
    } catch (e) {
      setError(e?.message || 'Failed to rank applicants.')
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationTone = (score) => {
    if (score >= 85) return 'success'
    if (score >= 70) return 'info'
    return 'neutral'
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            AI-Powered Recruiting
          </div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Create jobs and review AI-ranked candidates with match scores.
          </div>
        </div>
        <Badge tone="info">
          {applicants.length} Applicants
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)]">
        <div className="space-y-4">
          <Card>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Create Job Post
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
                label="Experience Level"
                placeholder="entry-level, junior, mid-level, senior, lead"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              />
              <label className="block">
                <div className="mb-1.5 text-sm font-medium text-slate-800 dark:text-slate-100">
                  Job Description
                </div>
                <textarea
                  rows={4}
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none transition app-surface focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="We're looking for a talented frontend engineer with experience in React, TypeScript, and modern web technologies..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <Input
                label="Required Skills (comma-separated)"
                placeholder="React, TypeScript, Node.js, CSS, Testing"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
              />
              {error ? (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
                  {error}
                </div>
              ) : null}
              <Button type="submit" loading={loading}>
                {job ? 'Update Job' : 'Create Job'}
              </Button>
            </form>
          </Card>


          {myJobs.length > 1 && (
            <Card>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Your Job Posts
              </div>
              <div className="mt-3 space-y-2">
                {myJobs.map((job) => (
                  <div
                    key={job._id}
                    className={`p-2 rounded-lg border cursor-pointer transition ${selectedJob?._id === job._id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                      : 'border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300'
                      }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {job.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      {job.location}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  AI-Ranked Applicants
                </div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Ranked by AI match score for: {selectedJob?.title || 'Select a job'}
                </div>
              </div>
              <div className="flex gap-2">
                <Badge tone="neutral">
                  {applicants.length} Total
                </Badge>
                {applicants.length > 0 && (
                  <Badge tone="success">
                    {applicants.filter(a => a.matchScore >= 70).length} Qualified
                  </Badge>
                )}
              </div>
            </div>

            {selectedJob && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={onRankApplicants}
                  loading={loading}
                  disabled={applicants.length === 0}
                >
                  Re-rank with AI
                </Button>
              </div>
            )}

            {loading && !applicants.length ? (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Analyzing and ranking applicants with AI...
              </p>
            ) : null}

            {applicants.length > 0 ? (
              <div className="mt-4 space-y-3">
                {applicants.map((applicant) => (
                  <div
                    key={applicant.resumeId}
                    className="rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-950/20 px-3 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {applicant.candidate?.name || 'Candidate'}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {applicant.candidate?.email || 'No email'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone={getRecommendationTone(applicant.matchScore)}>
                          {applicant.matchScore}% Match
                        </Badge>
                        <Badge tone="info">
                          {applicant.recommendation || 'Consider'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Match Score
                        </div>
                        <ProgressBar value={applicant.matchScore} tone="emerald" />
                        <div className="mt-1 text-slate-600 dark:text-slate-300">
                          {applicant.matchScore}% AI Match
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Skills Analysis
                        </div>
                        {applicant.matchingSkills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {applicant.matchingSkills.slice(0, 5).map((skill) => (
                              <Badge key={skill} tone="success" size="sm">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {applicant.missingSkills?.length > 0 && (
                          <div>
                            <div className="text-xs text-slate-600 dark:text-slate-300 mb-1">
                              Missing Skills:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {applicant.missingSkills.slice(0, 3).map((skill) => (
                                <Badge key={skill} tone="warning" size="sm">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>


                    <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-slate-600 dark:text-slate-300">Experience Score</div>
                          <div className="font-medium">{applicant.experienceScore || 0}%</div>
                        </div>
                        <div>
                          <div className="text-slate-600 dark:text-slate-300">Skills Score</div>
                          <div className="font-medium">{applicant.skillsScore || 0}%</div>
                        </div>
                        <div>
                          <div className="text-slate-600 dark:text-slate-300">Cultural Fit</div>
                          <div className="font-medium">{applicant.culturalFit || 0}%</div>
                        </div>
                        <div>
                          <div className="text-slate-600 dark:text-slate-300">Interview Score</div>
                          <div className="font-medium">{applicant.interviewScore || 0}%</div>
                        </div>
                      </div>
                    </div>

                    {applicant.error && (
                      <div className="mt-2 text-xs text-rose-600 dark:text-rose-300">
                        Analysis failed: {applicant.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {selectedJob
                  ? 'No applicants yet. AI will rank candidates as they apply.'
                  : 'Create a job post to start receiving AI-ranked applicants.'
                }
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
