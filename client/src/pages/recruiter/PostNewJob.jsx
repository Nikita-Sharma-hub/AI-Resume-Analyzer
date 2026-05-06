import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { createJob } from '../../services/recruiterService.jsx'

export default function PostNewJob() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    experienceLevel: 'mid-level',
    salary: '',
    description: '',
    requirements: [],
    responsibilities: [],
    skills: [],
    benefits: [],
    remote: false,
    deadline: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({ ...prev, [field]: items }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.length > 0),
        responsibilities: formData.responsibilities.filter(resp => resp.length > 0),
        skills: formData.skills.filter(skill => skill.length > 0),
        benefits: formData.benefits.filter(benefit => benefit.length > 0)
      }

      await createJob(jobData)
      navigate('/recruiter/manage-jobs')
    } catch (err) {
      setError(err.message || 'Failed to create job posting')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.company && formData.location
      case 2:
        return formData.description && formData.responsibilities.length > 0
      case 3:
        return formData.requirements.length > 0 && formData.skills.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post New Job</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Create a new job posting to attract qualified candidates
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/recruiter/manage-jobs')}>
          View All Jobs
        </Button>
      </div>

      {/* Progress Steps */}
      <Card>
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {stepNumber}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-medium ${
                  step >= stepNumber ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {stepNumber === 1 && 'Basic Info'}
                  {stepNumber === 2 && 'Description'}
                  {stepNumber === 3 && 'Requirements'}
                  {stepNumber === 4 && 'Review & Post'}
                </div>
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-px mx-4 ${
                  step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </div>
            
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Job Title"
                  placeholder="e.g., Senior Frontend Developer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
                <Input
                  label="Company Name"
                  placeholder="e.g., Tech Corp"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Location"
                  placeholder="e.g., New York, NY or Remote"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid-level">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
                <Input
                  label="Salary Range"
                  placeholder="e.g., $80,000 - $120,000"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Application Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={formData.remote}
                    onChange={(e) => handleInputChange('remote', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="remote" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    This is a remote position
                  </label>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Job Description */}
        {step === 2 && (
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Description
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Description
                </label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the role, company culture, and what makes this position exciting..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Key Responsibilities (one per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.responsibilities.join('\n')}
                  onChange={(e) => handleInputChange('responsibilities', e.target.value.split('\n'))}
                  placeholder="• Lead frontend development projects&#10;• Collaborate with cross-functional teams&#10;• Write clean, maintainable code"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Requirements */}
        {step === 3 && (
          <Card>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Requirements & Skills
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Requirements (one per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.requirements.join('\n')}
                  onChange={(e) => handleInputChange('requirements', e.target.value.split('\n'))}
                  placeholder="• 5+ years of experience with React&#10;• Strong TypeScript skills&#10;• Experience with modern CSS frameworks"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleArrayInput('skills', e.target.value)}
                  placeholder="React, TypeScript, Node.js, CSS, Testing"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Benefits & Perks (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.benefits.join(', ')}
                  onChange={(e) => handleArrayInput('benefits', e.target.value)}
                  placeholder="Health insurance, 401(k), Remote work, Flexible hours"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-6">
            <Card>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Review Job Posting
              </div>
              
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Title</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{formData.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{formData.company}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{formData.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h3>
                    <div className="mt-1">
                      <Badge tone="info" className="capitalize">{formData.type}</Badge>
                      {formData.remote && <Badge tone="success" className="ml-2">Remote</Badge>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience Level</h3>
                    <p className="mt-1 text-gray-900 dark:text-white capitalize">{formData.experienceLevel}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Salary</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{formData.salary || 'Not specified'}</p>
                  </div>
                </div>

                {formData.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{formData.description}</p>
                  </div>
                )}

                {formData.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.responsibilities.map((resp, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.requirements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.requirements.map((req, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} tone="neutral">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.benefits.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.benefits.map((benefit) => (
                        <Badge key={benefit} tone="success">{benefit}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-3">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ready to Post
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your job posting will be live immediately and candidates can start applying right away.
                </p>
                <Button type="submit" loading={loading} size="lg">
                  {loading ? 'Posting...' : 'Post Job Now'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid()}
            >
              Next
            </Button>
          ) : null}
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
      </form>
    </div>
  )
}
