import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Dropzone from '../../components/Dropzone.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { uploadResume, analyzeResume } from '../../services/candidateService.jsx'

export default function UploadResume() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (newFile) => {
    setFile(newFile)
    setError(null)
    setUploadResult(null)
    setAnalysisResult(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const result = await uploadResume(file)
      setUploadResult(result)

      // Automatically analyze after successful upload
      const analysisResult = await handleAnalyze(result.resumeId)

      // Navigate to analysis page after successful analysis
      if (analysisResult && result.resumeId) {
        navigate(`/candidate/resume-analysis/${result.resumeId}`)
      }
    } catch (err) {
      setError(err.message || 'Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async (resumeId = null) => {
    const targetFile = resumeId ? null : file
    if (!targetFile && !resumeId) {
      setError('Please upload a resume first')
      return null
    }

    setError(null)
    setAnalyzing(true)

    try {
      const result = await analyzeResume(targetFile)
      setAnalysisResult(result)
      return result
    } catch (err) {
      setError(err.message || 'Failed to analyze resume')
      return null
    } finally {
      setAnalyzing(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Resume</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Upload your resume for AI-powered analysis and job matching
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload File
            </div>

            <div className="space-y-4">
              <Dropzone
                file={file}
                onFile={handleFileChange}
                disabled={uploading || analyzing}
                accept=".pdf,.doc,.docx"
                maxSize={5 * 1024 * 1024} // 5MB
              />

              {file && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="shrink-0">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleFileChange(null)}
                    disabled={uploading || analyzing}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleUpload}
                  loading={uploading}
                  disabled={!file || uploading || analyzing}
                  className="flex-1"
                >
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </Button>

                {uploadResult && (
                  <Button
                    onClick={() => handleAnalyze()}
                    loading={analyzing}
                    disabled={analyzing}
                    variant="secondary"
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Again'}
                  </Button>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
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
          </Card>

          {uploadResult && (
            <Card>
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">Upload Successful</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Resume ID</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{uploadResult.resumeId || uploadResult._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">File Name</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{uploadResult.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Upload Date</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(uploadResult.uploadedAt || uploadResult.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <Badge tone="success">Active</Badge>
                </div>
              </div>

              {uploadResult.resumeId && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/candidate/resume-analysis/${uploadResult.resumeId}`)}
                  >
                    View Analysis
                  </Button>
                </div>
              )}
            </Card>
          )}

          {analysisResult && (
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Analysis Results
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{analysisResult.score}%</span>
                  </div>
                  <ProgressBar
                    value={analysisResult.score}
                    tone={analysisResult.score >= 85 ? 'emerald' : analysisResult.score >= 70 ? 'indigo' : 'amber'}
                  />
                </div>

                {analysisResult.summary && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Summary</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{analysisResult.summary}</p>
                  </div>
                )}

                {analysisResult.extractedSkills && analysisResult.extractedSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detected Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.extractedSkills.map((skill) => (
                        <Badge key={skill} tone="neutral">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysisResult.seniorityHint && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience Level</h4>
                    <Badge tone="info">{analysisResult.seniorityHint}</Badge>
                  </div>
                )}

                {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-indigo-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              File Guidelines
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Supported Formats</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">PDF, DOC, DOCX</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Maximum Size</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">5MB per file</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Clear Content</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Readable text, no images</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Privacy Note</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Your resume is processed securely</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tips for Better Analysis
            </div>

            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                Include specific skills and technologies
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                Quantify your achievements with numbers
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                Use clear, professional language
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                Keep formatting simple and clean
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                Update contact information
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
