import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { getMyResumes, optimizeResume } from '../../services/candidateService.jsx'

export default function AIResumeFeedback() {
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [targetRole, setTargetRole] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    loadResumes()
  }, [])

  const loadResumes = async () => {
    try {
      setLoading(true)
      const data = await getMyResumes()
      setResumes(data)
      if (data.length > 0) {
        setSelectedResume(data[0])
      }
    } catch (err) {
      setError(err.message || 'Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }

  const handleGetFeedback = async () => {
    if (!selectedResume) {
      setError('Please select a resume first')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const result = await optimizeResume(null, targetRole || selectedResume.fileName)
      setFeedback(result)
    } catch (err) {
      setError(err.message || 'Failed to get AI feedback')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'emerald'
    if (score >= 70) return 'indigo'
    if (score >= 50) return 'amber'
    return 'rose'
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'neutral'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resumes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Resume Feedback</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Get personalized AI-powered feedback to improve your resume
          </p>
        </div>
        {feedback && (
          <Button onClick={() => window.location.href = '/candidate/upload-resume'}>
            Upload New Resume
          </Button>
        )}
      </div>

      {resumes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Resumes Found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Upload a resume first to get AI feedback
            </p>
            <Button onClick={() => window.location.href = '/candidate/upload-resume'} className="mt-4">
              Upload Resume
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Selection */}
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Resume
              </div>

              <div className="space-y-4">
                <div className="grid gap-3">
                  {resumes.map((resume) => (
                    <div
                      key={resume._id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedResume?._id === resume._id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      onClick={() => setSelectedResume(resume)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {resume.fileName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                        {selectedResume?._id === resume._id && (
                          <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Role (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Senior Frontend Developer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <Button
                  onClick={handleGetFeedback}
                  loading={analyzing}
                  disabled={!selectedResume}
                  className="w-full"
                >
                  {analyzing ? 'Analyzing...' : 'Get AI Feedback'}
                </Button>
              </div>
            </Card>

            {/* Feedback Results */}
            {feedback && (
              <Card>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  AI Feedback Analysis
                </div>

                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 text-white mb-4">
                      <span className="text-2xl font-bold">{feedback.currentScore || 75}%</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Resume Score
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feedback.overallAssessment || 'Your resume shows potential for improvement'}
                    </p>
                  </div>

                  {/* Improvement Suggestions */}
                  {feedback.optimizationSuggestions?.improvements?.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                        Key Improvements
                      </h4>
                      <div className="space-y-3">
                        {feedback.optimizationSuggestions.improvements.map((suggestion, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section Analysis */}
                  {feedback.sectionAnalysis && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                        Section Analysis
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(feedback.sectionAnalysis).map(([section, analysis]) => (
                          <div key={section} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {section.replace(/([A-Z])/g, ' $1').trim()}
                              </h5>
                              <Badge tone={getScoreColor(analysis.score)}>
                                {analysis.score}%
                              </Badge>
                            </div>
                            <ProgressBar value={analysis.score} tone={getScoreColor(analysis.score)} className="mb-2" />
                            {analysis.feedback && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.feedback}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Items */}
                  {feedback.actionItems?.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                        Action Items
                      </h4>
                      <div className="space-y-2">
                        {feedback.actionItems.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Badge tone={getPriorityColor(item.priority)} size="sm">
                              {item.priority}
                            </Badge>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{item.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Tips */}
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resume Tips
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Be Specific</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Use concrete examples and metrics</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Keywords Matter</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Include relevant job-specific terms</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Keep it Clean</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Use clear formatting and structure</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Tailor It</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Customize for each application</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Common Mistakes */}
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Common Mistakes to Avoid
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Typos and grammar errors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Generic descriptions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Too long or too short</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Poor formatting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Outdated information</span>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Next Steps
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => window.location.href = '/candidate/job-search'}
                >
                  Apply for Jobs
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = '/candidate/upload-resume'}
                >
                  Upload New Version
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = '/candidate/profile'}
                >
                  Update Profile
                </Button>
              </div>
            </Card>
          </div>
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
