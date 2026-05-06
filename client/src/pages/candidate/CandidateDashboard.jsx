import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { apiClient } from '../../services/apiClient.jsx'
import { getMyResumes, getJobRecommendations, getMyApplications, getDashboardStats } from '../../services/candidateService.jsx'
import {
  User,
  Briefcase,
  TrendingUp,
  FileText,
  Target,
  Calendar,
  Bell,
  Search,
  Settings,
  Upload,
  Award,
  Users,
  Eye,
  Download,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react'

export default function CandidateDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [resumes, setResumes] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [applications, setApplications] = useState([])
  const [analytics, setAnalytics] = useState({ monthlyData: [] })
  const [stats, setStats] = useState({
    profileViews: 127,
    resumeScore: 85,
    applicationsSent: 12,
    interviewsScheduled: 3,
    profileCompletion: 75
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsData, resumesData, recommendationsData, applicationsData, analyticsData] = await Promise.all([
        getDashboardStats(),
        getMyResumes(),
        getJobRecommendations(),
        getMyApplications(),
        fetchAnalyticsData()
      ])

      // Update stats with real backend data
      if (statsData?.data) {
        setStats({
          profileViews: statsData.data.profileViews || 0,
          resumeScore: statsData.data.resumeScore || 0,
          applicationsSent: statsData.data.applicationsSent || 0,
          interviewsScheduled: statsData.data.interviewsScheduled || 0,
          profileCompletion: statsData.data.profileCompletion || 0
        })
      }

      setResumes(resumesData?.data || [])
      setRecommendations(recommendationsData?.data || [])
      setApplications(applicationsData?.data || [])
      setAnalytics(analyticsData?.data || { monthlyData: [] })
      setLoading(false)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setLoading(false)
    }
  }

  const fetchAnalyticsData = async () => {
    try {
      const response = await apiClient.get('/dashboard/candidate-analytics')
      return response.data
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
      throw error // Re-throw the error to trigger error handling
    }
  }

  const recentApplications = applications.slice(0, 5)
  const topRecommendations = recommendations.slice(0, 6)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="app-container py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-linear-to-br from-indigo-600 to-fuchsia-500 shadow-sm shadow-indigo-600/20" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
            Welcome back, {user?.name || 'Candidate'}!
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Your career journey continues
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.profileViews}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Profile Views</div>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.resumeScore}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Resume Score</div>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.applicationsSent}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Applications Sent</div>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.interviewsScheduled}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Interviews Scheduled</div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Upload Section */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Resume Upload</h3>
                  <Upload className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Upload your latest resume to get AI-powered insights
                </p>
                <Button
                  onClick={() => navigate('/candidate/upload-resume')}
                  className="w-full"
                >
                  Upload Resume
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/candidate/ai-feedback')}
                    className="w-full justify-start"
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Get AI Feedback
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/candidate/job-search')}
                    className="w-full justify-start"
                  >
                    <Search className="h-4 w-4 mr-3" />
                    Browse Jobs
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/candidate/profile')}
                    className="w-full justify-start"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Update Profile
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Application Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analytics.monthlyData.length > 0 ? analytics.monthlyData : [
                    { name: 'Jan', applications: 0 },
                    { name: 'Feb', applications: 0 },
                    { name: 'Mar', applications: 0 },
                    { name: 'Apr', applications: 0 },
                    { name: 'May', applications: 0 },
                    { name: 'Jun', applications: 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ fill: '#6366f1' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Profile Completion</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-slate-900 dark:text-white">{stats.profileCompletion}%</div>
                  <ProgressBar value={stats.profileCompletion} className="mt-2" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Applications</h3>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentApplications.map((app, index) => (
                    <div key={`app-${index}-${app._id}`} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                          <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white text-sm">{app.job?.title}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">{app.company}</div>
                        </div>
                      </div>
                      <Badge tone={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'info'} size="sm">
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/candidate/applied-jobs')}
                  className="w-full"
                >
                  View All Applications
                </Button>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recommended Jobs</h3>
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {topRecommendations.map((job) => (
                    <div key={job._id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => navigate(`/candidate/job/${job._id}`)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-white text-sm">{job.title}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">{job.company} • {job.location}</div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{job.match}%</div>
                          <div className="text-xs text-slate-500 dark:text-slate-300">match</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/candidate/job-search')}
                  className="w-full"
                >
                  Browse More Jobs
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
