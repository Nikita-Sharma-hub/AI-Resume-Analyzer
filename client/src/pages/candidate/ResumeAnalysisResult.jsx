import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { getMyResumes, analyzeResume, getResumeAnalysis } from '../../services/candidateService.jsx'

export default function ResumeAnalysisResult() {
  const { resumeId } = useParams()
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadResumeAnalysis()
  }, [resumeId])

  const loadResumeAnalysis = async () => {
    try {
      setLoading(true)

      if (!resumeId) {
        // If no resumeId provided, get the latest resume
        const resumes = await getMyResumes()
        if (resumes.length === 0) {
          setError('No resumes found. Please upload a resume first.')
          return
        }

        const latestResume = resumes[0] // Already sorted by createdAt desc
        setResume(latestResume)

        if (!latestResume.analysis) {
          // No analysis available
          setAnalysis(null)
          return
        }

        setAnalysis(latestResume.analysis)
        return
      }

      // Get specific resume analysis
      const analysisResult = await getResumeAnalysis(resumeId)

      if (!analysisResult.hasAnalysis) {
        setResume(analysisResult.resume)
        setAnalysis(null)
        return
      }

      setResume(analysisResult.resume)
      setAnalysis(analysisResult)
    } catch (err) {
      setError(err.message || 'Failed to load resume analysis')
    } finally {
      setLoading(false)
    }
  }

  const handleReanalyze = async () => {
    try {
      setLoading(true)
      const targetResumeId = resume?._id || resumeId
      if (!targetResumeId) {
        setError('No resume ID available for reanalysis')
        return
      }

      // For reanalysis, we need to trigger a new analysis
      // This would require the file to be uploaded again, so for now we'll reload
      await loadResumeAnalysis()
    } catch (err) {
      setError(err.message || 'Failed to reanalyze resume')
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

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Fair'
    return 'Needs Improvement'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    const isNoResumeError = error.includes('No resumes found') || error.includes('Please upload a resume')

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className={`rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center ${isNoResumeError
            ? 'bg-blue-100 dark:bg-blue-900/20'
            : 'bg-red-100 dark:bg-red-900/20'
            }`}>
            <svg className={`w-8 h-8 ${isNoResumeError
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-red-600 dark:text-red-400'
              }`} fill="currentColor" viewBox="0 0 20 20">
              {isNoResumeError ? (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {isNoResumeError ? 'No Resume Found' : 'Error Loading Analysis'}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          <div className="mt-6 space-x-3">
            {!isNoResumeError && (
              <Button onClick={loadResumeAnalysis}>Try Again</Button>
            )}
            <Button
              variant={isNoResumeError ? 'primary' : 'secondary'}
              onClick={() => navigate('/candidate/upload-resume')}
            >
              {isNoResumeError ? 'Upload Your First Resume' : 'Upload New Resume'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-3 w-16 h-16 mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Analysis Available</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {resume
              ? `Your resume "${resume.fileName}" hasn't been analyzed yet.`
              : 'This resume hasn\'t been analyzed yet.'
            }
          </p>
          <div className="mt-6 space-y-3">
            <div className="max-w-md mx-auto bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">To analyze your resume:</h3>
              <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 text-left">
                <li>1. Go to Upload Resume page</li>
                <li>2. Upload your resume file</li>
                <li>3. Analysis will start automatically</li>
                <li>4. Return here to view results</li>
              </ol>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/candidate/upload-resume')}>
                Upload Resume for Analysis
              </Button>
              {resume && (
                <Button variant="secondary" onClick={loadResumeAnalysis}>
                  Check Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Analysis</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Detailed analysis for {resume?.fileName || 'Resume'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleReanalyze} loading={loading}>
            Reanalyze
          </Button>
          <Button onClick={() => navigate('/candidate/upload-resume')}>
            Upload New
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      <Card>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white mb-4">
            <span className="text-2xl font-bold">{analysis.score}%</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {getScoreLabel(analysis.score)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {analysis.summary || 'Your resume has been analyzed and scored based on various factors including skills, experience, and formatting.'}
          </p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Analysis */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Detailed Analysis
            </div>

            <div className="space-y-4">
              {analysis.sections?.map((section, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{section.name}</h4>
                    <Badge tone={section.score >= 80 ? 'success' : section.score >= 60 ? 'info' : 'warning'}>
                      {section.score}%
                    </Badge>
                  </div>
                  <ProgressBar value={section.score} tone={getScoreColor(section.score)} className="mb-2" />
                  {section.feedback && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{section.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Skills Analysis */}
          {analysis.extractedSkills && analysis.extractedSkills.length > 0 && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Skills Analysis
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detected Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.extractedSkills.map((skill) => (
                      <Badge key={skill} tone="neutral">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {analysis.skillCategories && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Skill Categories</h4>
                    <div className="space-y-2">
                      {Object.entries(analysis.skillCategories).map(([category, skills]) => (
                        <div key={category} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{category}</h5>
                          <div className="flex flex-wrap gap-1">
                            {skills.map((skill) => (
                              <Badge key={skill} tone="info" size="sm">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recommendations
              </div>

              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Experience Level */}
          {analysis.seniorityHint && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Experience Level
              </div>
              <div className="text-center">
                <Badge tone="info" size="lg">{analysis.seniorityHint}</Badge>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Based on your resume content and skills
                </p>
              </div>
            </Card>
          )}

          {/* Key Metrics */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Key Metrics
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Skills</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analysis.extractedSkills?.length || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Readability Score</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analysis.readabilityScore || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completeness</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analysis.completenessScore || 'N/A'}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Format Score</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analysis.formatScore || 'N/A'}%
                </span>
              </div>
            </div>
          </Card>

          {/* Action Items */}
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Next Steps
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => navigate('/candidate/job-search')}
              >
                Find Matching Jobs
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/candidate/ai-feedback')}
              >
                Get AI Feedback
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/candidate/profile')}
              >
                Update Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
