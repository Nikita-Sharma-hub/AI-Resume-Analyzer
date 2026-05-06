import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Badge from '../../components/ui/Badge.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getMyJobs, getJobApplicants, rankApplicants, getRecruiterStats } from '../../services/recruiterService.jsx'
import { apiClient } from '../../services/apiClient.jsx'
import {
  Building,
  Users,
  TrendingUp,
  Briefcase,
  Target,
  Calendar,
  Bell,
  Search,
  Settings,
  Plus,
  Eye,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  UserCheck,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316']

export default function RecruiterDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [myJobs, setMyJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [analytics, setAnalytics] = useState({ monthlyData: [], statusData: [] })
  const [stats, setStats] = useState({
    totalJobs: 24,
    totalApplicants: 156,
    shortlistedCandidates: 23,
    activeJobs: 18,
    hiringRate: 12
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    loadApplicantsForSelectedJob()
  }, [selectedJob])

  const loadApplicantsForSelectedJob = async () => {
    if (selectedJob && selectedJob.id) {
      try {
        const applicantsData = await getJobApplicants(selectedJob.id)
        setApplicants(applicantsData?.applicants || [])
      } catch (error) {
        console.error('Failed to load applicants:', error)
        setApplicants([])
      }
    } else {
      setApplicants([])
    }
  }

  const loadDashboardData = async () => {
    try {
      const [statsData, jobsData, analyticsData] = await Promise.all([
        getRecruiterStats(),
        getMyJobs(),
        fetchAnalyticsData()
      ])

      // Only load applicants if we have a selected job
      let applicantsData = { applicants: [] }
      if (selectedJob && selectedJob.id) {
        applicantsData = await getJobApplicants(selectedJob.id)
      }

      // Update stats with real backend data
      if (statsData?.data) {
        setStats({
          totalJobs: statsData.data.totalJobs || 0,
          totalApplicants: statsData.data.totalApplicants || 0,
          shortlistedCandidates: statsData.data.shortlistedCandidates || 0,
          activeJobs: statsData.data.activeJobs || 0,
          hiringRate: statsData.data.hiringRate || 0
        })
      }

      setMyJobs(jobsData?.data || [])
      setApplicants(applicantsData?.applicants || [])
      setAnalytics(analyticsData?.data || { monthlyData: [], statusData: [] })
      setLoading(false)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setLoading(false)
    }
  }

  const fetchAnalyticsData = async () => {
    try {
      const response = await apiClient.get('/dashboard/recruiter-analytics')
      return response.data
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return { data: { monthlyData: [], statusData: [] } }
    }
  }

  const recentApplicants = applicants.slice(0, 5)
  const topCandidates = applicants
    .filter(a => a.matchScore >= 80)
    .slice(0, 6)
    .sort((a, b) => b.matchScore - a.matchScore)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="app-container py-8">
        {/* Company Overview */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-linear-to-br from-indigo-600 to-fuchsia-500 shadow-sm shadow-indigo-600/20" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">
            {user?.company || 'Tech Corp'}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Enterprise Hiring Dashboard
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalJobs}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Total Jobs Posted</div>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalApplicants}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Total Applicants</div>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.shortlistedCandidates}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Shortlisted Candidates</div>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeJobs}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Active Positions</div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
                  <Plus className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/recruiter/post-job')}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Post New Job
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/recruiter/manage-jobs')}
                    className="w-full justify-start"
                  >
                    <Briefcase className="h-4 w-4 mr-3" />
                    Manage Jobs
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/recruiter/ranked-candidates')}
                    className="w-full justify-start"
                  >
                    <Star className="h-4 w-4 mr-3" />
                    View Candidates
                  </Button>
                </div>
              </div>
            </Card>

            {/* Active Jobs */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Active Jobs</h3>
                <div className="space-y-3">
                  {myJobs.slice(0, 4).map((job) => (
                    <div
                      key={job._id}
                      className={`p-3 rounded-lg border cursor-pointer transition ${selectedJob?._id === job._id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                        : 'border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300'
                        }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="font-medium text-slate-900 dark:text-white text-sm">{job.title}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">{job.applicants || 0} applicants</div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/recruiter/manage-jobs')}
                  className="w-full"
                >
                  View All Jobs
                </Button>
              </div>
            </Card>
          </div>

          {/* Analytics */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Hiring Analytics</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={analytics.monthlyData.length > 0 ? analytics.monthlyData : [
                    { month: 'Jan', applications: 0, hires: 0 },
                    { month: 'Feb', applications: 0, hires: 0 },
                    { month: 'Mar', applications: 0, hires: 0 },
                    { month: 'Apr', applications: 0, hires: 0 },
                    { month: 'May', applications: 0, hires: 0 },
                    { month: 'Jun', applications: 0, hires: 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="hires"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Application Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.statusData.length > 0 ? analytics.statusData : [
                    { status: 'Screening', count: 0, color: '#6366f1' },
                    { status: 'Interview', count: 0, color: '#8b5cf6' },
                    { status: 'Shortlisted', count: 0, color: '#ec4899' },
                    { status: 'Accepted', count: 0, color: '#10b981' },
                    { status: 'Rejected', count: 0, color: '#f59e0b' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="status" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1">
                      {analytics.statusData.length > 0 ? analytics.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      )) : [
                        { status: 'Screening', count: 0, color: '#6366f1' },
                        { status: 'Interview', count: 0, color: '#8b5cf6' },
                        { status: 'Shortlisted', count: 0, color: '#ec4899' },
                        { status: 'Accepted', count: 0, color: '#10b981' },
                        { status: 'Rejected', count: 0, color: '#f59e0b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Applicants</h3>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentApplicants.map((applicant) => (
                    <div key={applicant._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                          <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white text-sm">{applicant.candidate?.name}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">{applicant.candidate?.email}</div>
                        </div>
                      </div>
                      <Badge tone={applicant.matchScore >= 80 ? 'success' : applicant.matchScore >= 60 ? 'info' : 'warning'} size="sm">
                        {applicant.matchScore}%
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/recruiter/applicants')}
                  className="w-full"
                >
                  View All Applicants
                </Button>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Candidates</h3>
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {topCandidates.map((candidate, index) => (
                    <div key={candidate._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer" onClick={() => navigate(`/recruiter/candidate/${candidate._id}`)}>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-linear-to-r from-indigo-500 to-fuchsia-500 rounded-full text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-white text-sm">{candidate.candidate?.name}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">{candidate.experience} • {candidate.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge tone="success" size="sm">{candidate.matchScore}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/recruiter/ranked-candidates')}
                  className="w-full"
                >
                  View All Candidates
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
