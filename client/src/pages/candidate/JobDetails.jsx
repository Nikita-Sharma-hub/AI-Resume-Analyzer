import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { getJobById } from '../../services/jobService.jsx'
import { applyToJob } from '../../services/applicationService.jsx'
import { matchResumeWithJob } from '../../services/candidateService.jsx'

export default function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [applying, setApplying] = useState(false)
  const [matching, setMatching] = useState(false)
  const [matchResult, setMatchResult] = useState(null)

  useEffect(() => {
    loadJob()
  }, [jobId])

  const loadJob = async () => {
    try {
      setLoading(true)
      const data = await getJobById(jobId)
      setJob(data)
    } catch (err) {
      setError(err.message || 'Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    try {
      setApplying(true)
      await applyToJob(jobId)
      // Refresh job data to update application status
      await loadJob()
    } catch (err) {
      setError(err.message || 'Failed to apply to job')
    } finally {
      setApplying(false)
    }
  }

  const handleMatchResume = async () => {
    try {
      setMatching(true)
      // TODO: Get current resume ID from user context
      const resumeId = 'current-resume-id'
      const result = await matchResumeWithJob(resumeId, jobId)
      setMatchResult(result)
    } catch (err) {
      setError(err.message || 'Failed to match resume')
    } finally {
      setMatching(false)
    }
  }

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'full-time': return 'success'
      case 'part-time': return 'info'
      case 'contract': return 'warning'
      case 'internship': return 'neutral'
      default: return 'neutral'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Error Loading Job</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
        <div className="mt-6 space-x-3">
          <Button onClick={loadJob}>Try Again</Button>
          <Button variant="secondary" onClick={() => navigate('/candidate/job-search')}>
            Back to Jobs
          </Button>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Job not found</h2>
        <Button onClick={() => navigate('/candidate/job-search')} className="mt-4">
          Back to Jobs
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => navigate('/candidate/job-search')} className="mb-4">
            ← Back to Jobs
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
          <div className="mt-2 flex items-center space-x-4">
            <span className="text-lg text-gray-600 dark:text-gray-400">{job.company}</span>
            <Badge tone={getJobTypeColor(job.type)} className="capitalize">
              {job.type}
            </Badge>
            {job.remote && <Badge tone="info">Remote</Badge>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Description
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
              {job.description}
            </div>
          </Card>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key Responsibilities
              </div>
              <ul className="space-y-2">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Requirements
              </div>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Required Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} tone="neutral">{skill}</Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Benefits & Perks
              </div>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Job Info */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Information
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</div>
                <div className="mt-1 text-gray-900 dark:text-white">{job.location}</div>
              </div>

              {job.salary && (
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Salary</div>
                  <div className="mt-1 text-gray-900 dark:text-white">{job.salary}</div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience Level</div>
                <div className="mt-1">
                  <Badge tone="info" className="capitalize">{job.experienceLevel}</Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Posted Date</div>
                <div className="mt-1 text-gray-900 dark:text-white">{formatDate(job.postedAt)}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Application Deadline</div>
                <div className="mt-1 text-gray-900 dark:text-white">
                  {job.deadline ? formatDate(job.deadline) : 'No deadline'}
                </div>
              </div>
            </div>
          </Card>

          {/* Resume Match */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Resume Match
            </div>

            {!matchResult ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  See how well your resume matches this job
                </p>
                <Button
                  onClick={handleMatchResume}
                  loading={matching}
                  className="w-full"
                >
                  {matching ? 'Matching...' : 'Check Match'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Match Score</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {matchResult.matchScore}%
                    </span>
                  </div>
                  <ProgressBar
                    value={matchResult.matchScore}
                    tone={matchResult.matchScore >= 85 ? 'emerald' : matchResult.matchScore >= 70 ? 'indigo' : 'amber'}
                  />
                </div>

                {matchResult.matchingSkills && matchResult.matchingSkills.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Matching Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.matchingSkills.map((skill) => (
                        <Badge key={skill} tone="success" size="sm">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills to Develop</div>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.missingSkills.map((skill) => (
                        <Badge key={skill} tone="warning" size="sm">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Recommendation:</strong> {matchResult.recommendation}
                </div>
              </div>
            )}
          </Card>

          {/* Apply Section */}
          <Card>
            <div className="space-y-4">
              {!job.hasApplied ? (
                <>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Ready to Apply?
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Submit your application and let recruiters find you
                    </p>
                  </div>

                  <Button
                    onClick={handleApply}
                    loading={applying}
                    className="w-full"
                    size="lg"
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-3">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Application Submitted
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You've successfully applied to this position
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => navigate('/candidate/applied-jobs')}>
                  View My Applications
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/candidate/upload-resume')}>
                  Update Resume
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
