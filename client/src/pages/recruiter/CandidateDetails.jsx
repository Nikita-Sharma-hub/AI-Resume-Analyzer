import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'

export default function CandidateDetails() {
  const { candidateId } = useParams()
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState(null)
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCandidateDetails()
  }, [candidateId])

  const loadCandidateDetails = async () => {
    try {
      setLoading(true)

      // Get candidate details from the API
      const response = await fetch(`/api/application/candidate/${candidateId}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('airesumematch.auth'))?.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch candidate details')
      }

      const data = await response.json()

      if (data.success) {
        setCandidate(data.data.candidate)
        setResume(data.data.resume)
      } else {
        throw new Error(data.message || 'Failed to load candidate details')
      }
    } catch (err) {
      setError(err.message || 'Failed to load candidate details')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'emerald'
    if (score >= 70) return 'indigo'
    if (score >= 50) return 'amber'
    return 'rose'
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading candidate details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 w-16 h-16 mx-auto flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Error Loading Candidate</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
        <Button onClick={loadCandidateDetails} className="mt-4">Try Again</Button>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Candidate not found</h2>
        <Button onClick={() => navigate('/recruiter/manage-jobs')} className="mt-4">
          Back to Jobs
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.name}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Candidate Profile & Resume Analysis
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => window.location.href = `mailto:${candidate.email}`}>
            Contact Candidate
          </Button>
          <Button>Schedule Interview</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</div>
                <div className="mt-1 text-gray-900 dark:text-white">{candidate.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</div>
                <div className="mt-1 text-gray-900 dark:text-white">{candidate.phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</div>
                <div className="mt-1 text-gray-900 dark:text-white">{candidate.location}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</div>
                <div className="mt-1 text-gray-900 dark:text-white">{formatDate(candidate.createdAt)}</div>
              </div>
            </div>

            {candidate.bio && (
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</div>
                <div className="mt-1 text-gray-700 dark:text-gray-300">{candidate.bio}</div>
              </div>
            )}

            <div className="mt-4 flex space-x-4">
              {candidate.linkedin && (
                <a
                  href={candidate.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500 text-sm"
                >
                  LinkedIn Profile
                </a>
              )}
              {candidate.github && (
                <a
                  href={candidate.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500 text-sm"
                >
                  GitHub Profile
                </a>
              )}
            </div>
          </Card>

          {/* Experience */}
          {candidate.experience && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Experience
              </div>
              <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                {candidate.experience}
              </div>
            </Card>
          )}

          {/* Education */}
          {candidate.education && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Education
              </div>
              <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                {candidate.education}
              </div>
            </Card>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} tone="neutral">{skill}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Resume Analysis */}
          {resume?.analysis && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resume Analysis
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white mb-3">
                    <span className="text-xl font-bold">{resume.analysis.score}%</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Overall Score
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Analysis
                  </div>
                  <div className="space-y-2">
                    {resume.analysis.sections.map((section) => (
                      <div key={section.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{section.name}</span>
                        <Badge tone={getScoreColor(section.score)}>{section.score}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {resume.analysis.extractedSkills && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Detected Skills
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {resume.analysis.extractedSkills.slice(0, 8).map((skill) => (
                        <Badge key={skill} tone="info" size="sm">{skill}</Badge>
                      ))}
                      {resume.analysis.extractedSkills.length > 8 && (
                        <Badge tone="info" size="sm">
                          +{resume.analysis.extractedSkills.length - 8}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {resume.analysis.seniorityHint && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Experience Level
                    </div>
                    <Badge tone="success">{resume.analysis.seniorityHint}</Badge>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Resume File */}
          {resume && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resume Document
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {resume.fileName}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Uploaded {formatDate(resume.uploadedAt)}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Download PDF
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {resume?.analysis?.recommendations && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Recommendations
              </div>

              <div className="space-y-2">
                {resume.analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-indigo-500 mt-1">•</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </div>

            <div className="space-y-3">
              <Button className="w-full">Schedule Interview</Button>
              <Button variant="outline" className="w-full">Send Message</Button>
              <Button variant="outline" className="w-full">Add to Favorites</Button>
              <Button variant="outline" className="w-full">Download Resume</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
