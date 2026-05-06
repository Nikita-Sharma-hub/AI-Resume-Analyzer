import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { getJobApplicants, rankApplicants } from '../../services/recruiterService.jsx'

export default function ApplicantsList() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState([])
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ranking, setRanking] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('matchScore')

  useEffect(() => {
    loadApplicants()
  }, [jobId])

  const loadApplicants = async () => {
    try {
      setLoading(true)
      const data = await getJobApplicants(jobId)
      setApplicants(data.applicants || [])
      setJob(data.job)
    } catch (err) {
      setError(err.message || 'Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  const handleRankApplicants = async () => {
    try {
      setRanking(true)
      await rankApplicants(jobId)
      await loadApplicants()
    } catch (err) {
      setError(err.message || 'Failed to rank applicants')
    } finally {
      setRanking(false)
    }
  }

  const getRecommendationTone = (score) => {
    if (score >= 85) return 'success'
    if (score >= 70) return 'info'
    return 'neutral'
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'success'
      case 'rejected':
        return 'danger'
      case 'interview':
        return 'info'
      case 'review':
        return 'warning'
      default:
        return 'neutral'
    }
  }

  const filteredAndSortedApplicants = applicants
    .filter(applicant => {
      if (filter === 'all') return true
      return applicant.status?.toLowerCase() === filter.toLowerCase()
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'matchScore':
          return (b.matchScore || 0) - (a.matchScore || 0)
        case 'experience':
          return (b.experienceScore || 0) - (a.experienceScore || 0)
        case 'skills':
          return (b.skillsScore || 0) - (a.skillsScore || 0)
        case 'name':
          return (a.candidate?.name || '').localeCompare(b.candidate?.name || '')
        default:
          return 0
      }
    })

  const handleStatusChange = async (applicantId, newStatus) => {
    // TODO: Add API call to update applicant status
    setApplicants(applicants.map(app => 
      app._id === applicantId ? { ...app, status: newStatus } : app
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading applicants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => navigate('/recruiter/manage-jobs')} className="mb-4">
            ← Back to Jobs
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Applicants for {job?.title || 'Job'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Review and manage AI-ranked candidates
          </p>
        </div>
        <Button onClick={handleRankApplicants} loading={ranking}>
          {ranking ? 'Ranking...' : 'Re-rank with AI'}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{applicants.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Applicants</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {applicants.filter(a => a.matchScore >= 85).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Excellent Match</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {applicants.filter(a => a.matchScore >= 70 && a.matchScore < 85).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Good Match</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {applicants.filter(a => a.status === 'interview').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Interviews</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(applicants.reduce((sum, a) => sum + (a.matchScore || 0), 0) / applicants.length) || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Match Score</div>
          </div>
        </Card>
      </div>

      {/* Filters and Sorting */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All</option>
                <option value="review">Under Review</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="matchScore">Match Score</option>
                <option value="experience">Experience</option>
                <option value="skills">Skills</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedApplicants.length} of {applicants.length} applicants
          </div>
        </div>
      </Card>

      {/* Applicants List */}
      {filteredAndSortedApplicants.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No applicants found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {applicants.length === 0 
                ? "No one has applied to this job yet."
                : "No applicants match your current filter."
              }
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedApplicants.map((applicant, index) => (
            <Card key={applicant._id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {applicant.candidate?.name || 'Unknown Candidate'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {applicant.candidate?.email || 'No email'}
                      </p>
                      {applicant.candidate?.location && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📍 {applicant.candidate.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge tone={getRecommendationTone(applicant.matchScore)}>
                      {applicant.matchScore || 0}% Match
                    </Badge>
                    <Badge tone={getStatusColor(applicant.status)}>
                      {applicant.status || 'Review'}
                    </Badge>
                  </div>
                </div>

                {/* Match Score Breakdown */}
                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Match</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {applicant.matchScore || 0}%
                      </span>
                    </div>
                    <ProgressBar 
                      value={applicant.matchScore || 0} 
                      tone={applicant.matchScore >= 85 ? 'emerald' : applicant.matchScore >= 70 ? 'indigo' : 'amber'}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {applicant.experienceScore || 0}%
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {applicant.skillsScore || 0}%
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {applicant.culturalFit || 0}%
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Culture Fit</div>
                    </div>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="mb-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {applicant.matchingSkills?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Matching Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {applicant.matchingSkills.slice(0, 6).map((skill) => (
                            <Badge key={skill} tone="success" size="sm">{skill}</Badge>
                          ))}
                          {applicant.matchingSkills.length > 6 && (
                            <Badge tone="success" size="sm">
                              +{applicant.matchingSkills.length - 6}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {applicant.missingSkills?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Missing Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {applicant.missingSkills.slice(0, 4).map((skill) => (
                            <Badge key={skill} tone="warning" size="sm">{skill}</Badge>
                          ))}
                          {applicant.missingSkills.length > 4 && (
                            <Badge tone="warning" size="sm">
                              +{applicant.missingSkills.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Recommendation */}
                {applicant.recommendation && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Recommendation</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                          {applicant.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Applied {formatDate(applicant.appliedAt)}
                  </div>

                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/recruiter/candidate/${applicant.candidate?._id}`)}
                    >
                      View Profile
                    </Button>

                    <select
                      value={applicant.status || 'review'}
                      onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="review">Under Review</option>
                      <option value="interview">Schedule Interview</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
