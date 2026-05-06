import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { getMyJobs, deleteJob, updateJob } from '../../services/recruiterService.jsx'

export default function ManageJobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingJob, setEditingJob] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(null)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const data = await getMyJobs()
      setJobs(data)
    } catch (err) {
      setError(err.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId)
      setJobs(jobs.filter(job => job._id !== jobId))
      setShowDeleteModal(null)
    } catch (err) {
      setError(err.message || 'Failed to delete job')
    }
  }

  const handleToggleStatus = async (job) => {
    try {
      const updatedJob = await updateJob(job._id, {
        ...job,
        status: job.status === 'active' ? 'inactive' : 'active'
      })
      setJobs(jobs.map(j => j._id === job._id ? updatedJob : j))
    } catch (err) {
      setError(err.message || 'Failed to update job status')
    }
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
  }

  const handleSaveEdit = async () => {
    try {
      const updatedJob = await updateJob(editingJob._id, editingJob)
      setJobs(jobs.map(j => j._id === editingJob._id ? updatedJob : j))
      setEditingJob(null)
    } catch (err) {
      setError(err.message || 'Failed to update job')
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && job.status === 'active') ||
                         (filter === 'inactive' && job.status === 'inactive')

    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'neutral'
  }

  const getApplicantCount = (job) => {
    return job.applicants?.length || 0
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Jobs</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your job postings and track applications
          </p>
        </div>
        <Button onClick={() => navigate('/recruiter/post-job')}>
          Post New Job
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {jobs.filter(job => job.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {jobs.reduce((total, job) => total + getApplicantCount(job), 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Applicants</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {jobs.filter(job => getApplicantCount(job) > 0).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Jobs with Applicants</div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex space-x-2">
            {['all', 'active', 'inactive'].map((statusFilter) => (
              <button
                key={statusFilter}
                onClick={() => setFilter(statusFilter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === statusFilter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {statusFilter === 'all' && 'All Jobs'}
                {statusFilter === 'active' && 'Active'}
                {statusFilter === 'inactive' && 'Inactive'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {jobs.length === 0 ? "You haven't posted any jobs yet." : "No jobs match your search criteria."}
            </p>
            {jobs.length === 0 && (
              <Button onClick={() => navigate('/recruiter/post-job')} className="mt-4">
                Post Your First Job
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition-shadow">
              {editingJob?._id === job._id ? (
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={editingJob.title}
                          onChange={(e) => setEditingJob(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editingJob.location}
                          onChange={(e) => setEditingJob(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingJob.description}
                        onChange={(e) => setEditingJob(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setEditingJob(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {job.title}
                        </h3>
                        <Badge tone={getStatusColor(job.status)}>
                          {job.status || 'active'}
                        </Badge>
                        {job.remote && <Badge tone="info">Remote</Badge>}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2H4v8h12V6z" clipRule="evenodd" />
                          </svg>
                          {job.company}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {job.location}
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Posted {formatDate(job.postedAt)}
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills?.slice(0, 5).map((skill) => (
                          <Badge key={skill} tone="neutral" size="sm">{skill}</Badge>
                        ))}
                        {job.skills?.length > 5 && (
                          <Badge tone="neutral" size="sm">+{job.skills.length - 5} more</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {getApplicantCount(job)}
                            </span>{' '}
                            applicants
                          </div>
                          {job.salary && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {job.salary}
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                          >
                            View Applicants
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditJob(job)}
                          >
                            Edit
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(job)}
                          >
                            {job.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setShowDeleteModal(job._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Delete Job Posting
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this job posting? This action cannot be undone and all applicant data will be lost.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteJob(showDeleteModal)}
                  className="flex-1"
                >
                  Delete Job
                </Button>
              </div>
            </div>
          </Card>
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
