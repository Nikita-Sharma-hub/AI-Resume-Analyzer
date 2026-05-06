import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { getJobApplicants, rankApplicants } from '../../services/recruiterService.jsx'

export default function RankedCandidates() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState([])
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ranking, setRanking] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCandidates, setSelectedCandidates] = useState([])

  useEffect(() => {
    loadRankedCandidates()
  }, [jobId])

  const loadRankedCandidates = async () => {
    try {
      setLoading(true)
      const data = await getJobApplicants(jobId)
      setApplicants(data.applicants || [])
      setJob(data.job)
    } catch (err) {
      setError(err.message || 'Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  const handleRankCandidates = async () => {
    try {
      setRanking(true)
      await rankApplicants(jobId)
      await loadRankedCandidates()
    } catch (err) {
      setError(err.message || 'Failed to rank candidates')
    } finally {
      setRanking(false)
    }
  }

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCandidates.length === applicants.length) {
      setSelectedCandidates([])
    } else {
      setSelectedCandidates(applicants.map(app => app._id))
    }
  }

  const handleBulkAction = async (action) => {
    // TODO: Add API calls for bulk actions
    console.log(`Bulk ${action} for candidates:`, selectedCandidates)
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'emerald'
    if (score >= 70) return 'indigo'
    if (score >= 50) return 'amber'
    return 'rose'
  }

  const getRankBadge = (index) => {
    if (index === 0) return { tone: 'success', label: '🥇 #1' }
    if (index === 1) return { tone: 'info', label: '🥈 #2' }
    if (index === 2) return { tone: 'warning', label: '🥉 #3' }
    return { tone: 'neutral', label: `#${index + 1}` }
  }

  const getRecommendationLevel = (score) => {
    if (score >= 85) return 'Highly Recommended'
    if (score >= 70) return 'Recommended'
    if (score >= 50) return 'Consider'
    return 'Not Recommended'
  }

  const sortedApplicants = [...applicants].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading ranked candidates...</p>
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
            AI-Ranked Candidates
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Ranked candidates for {job?.title || 'Job Position'}
          </p>
        </div>
        <div className="flex space-x-3">
          {selectedCandidates.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCandidates.length} selected
              </span>
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                defaultValue=""
              >
                <option value="" disabled>Bulk Actions</option>
                <option value="interview">Schedule Interview</option>
                <option value="reject">Reject</option>
                <option value="favorite">Add to Favorites</option>
              </select>
            </div>
          )}
          <Button onClick={handleRankCandidates} loading={ranking}>
            {ranking ? 'Ranking...' : 'Re-rank All'}
          </Button>
        </div>
      </div>

      {/* Ranking Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{applicants.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Candidates</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {applicants.filter(a => (a.matchScore || 0) >= 85).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Highly Recommended</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {applicants.filter(a => (a.matchScore || 0) >= 70).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Recommended</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(applicants.reduce((sum, a) => sum + (a.matchScore || 0), 0) / applicants.length) || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
          </div>
        </Card>
      </div>

      {/* Selection Controls */}
      <Card>
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCandidates.length === applicants.length && applicants.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Select All Candidates</span>
          </label>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedCandidates.length} of {applicants.length} selected
          </div>
        </div>
      </Card>

      {/* Ranked Candidates List */}
      {sortedApplicants.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No candidates found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              No one has applied to this job yet.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedApplicants.map((applicant, index) => {
            const rankBadge = getRankBadge(index)
            return (
              <Card key={applicant._id} className={`hover:shadow-lg transition-shadow ${index < 3 ? 'border-2 border-indigo-200 dark:border-indigo-800' : ''
                }`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(applicant._id)}
                        onChange={() => handleSelectCandidate(applicant._id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />

                      <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full text-white">
                        <span className="text-lg font-bold">{index + 1}</span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {applicant.candidate?.name || 'Unknown Candidate'}
                          </h3>
                          <Badge tone={rankBadge.tone}>{rankBadge.label}</Badge>
                        </div>
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
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {applicant.matchScore || 0}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Match Score</div>
                      </div>
                      <Badge tone={getScoreColor(applicant.matchScore)}>
                        {getRecommendationLevel(applicant.matchScore)}
                      </Badge>
                    </div>
                  </div>

                  {/* Score Breakdown */}
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
                        tone={getScoreColor(applicant.matchScore)}
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
                      Applied {new Date(applicant.appliedAt).toLocaleDateString()}
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
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        defaultValue=""
                      >
                        <option value="" disabled>Actions</option>
                        <option value="interview">Schedule Interview</option>
                        <option value="contact">Send Message</option>
                        <option value="favorite">Add to Favorites</option>
                        <option value="reject">Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
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
