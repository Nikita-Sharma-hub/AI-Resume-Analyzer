import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { getJobApplications } from '../../services/applicationService.jsx'

export default function AppliedJobs() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const data = await getJobApplications()
      // Ensure data is an array
      setApplications(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load applications')
      setApplications([])
    } finally {
      setLoading(false)
    }
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'rejected':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'interview':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.status?.toLowerCase() === filter.toLowerCase()
  })

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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading applications...</p>
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
        <h2 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Error Loading Applications</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
        <Button onClick={loadApplications} className="mt-4">Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applied Jobs</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track the status of your job applications
          </p>
        </div>
        <Button onClick={() => window.location.href = '/candidate/job-search'}>
          Find More Jobs
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {applications.filter(app => app.status === 'review').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Under Review</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {applications.filter(app => app.status === 'interview').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Interviews</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {applications.filter(app => app.status === 'accepted').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accepted</div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {['all', 'review', 'interview', 'accepted', 'rejected'].map((statusFilter) => (
              <button
                key={statusFilter}
                onClick={() => setFilter(statusFilter)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${filter === statusFilter
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                {statusFilter}
                {statusFilter !== 'all' && (
                  <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                    {applications.filter(app => app.status?.toLowerCase() === statusFilter).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No applications found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {filter === 'all'
                ? "You haven't applied to any jobs yet. Start searching for opportunities!"
                : `No ${filter} applications found.`
              }
            </p>
            {filter === 'all' && (
              <Button onClick={() => window.location.href = '/candidate/job-search'} className="mt-4">
                Browse Jobs
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application._id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {application.job?.title || 'Unknown Position'}
                    </h3>
                    <Badge tone={getStatusColor(application.status)} className="flex items-center space-x-1">
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status || 'Pending'}</span>
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2H4v8h12V6z" clipRule="evenodd" />
                      </svg>
                      {application.job?.company || 'Unknown Company'}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {application.job?.location || 'Location not specified'}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Applied on {formatDate(application.appliedAt)}
                    </div>
                  </div>

                  {application.matchScore && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Match Score</span>
                        <span className="font-medium text-gray-900 dark:text-white">{application.matchScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${application.matchScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {application.notes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{application.notes}</p>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `/candidate/job/${application.job?._id}`}
                  >
                    View Job
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
