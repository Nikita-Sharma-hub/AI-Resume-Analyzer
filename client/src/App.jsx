import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import CandidateDashboard from './pages/candidate/CandidateDashboard.jsx'
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard.jsx'
import { useAuth } from './hooks/useAuth.jsx'

// Candidate Pages
import MyProfile from './pages/candidate/MyProfile.jsx'
import UploadResume from './pages/candidate/UploadResume.jsx'
import ResumeAnalysisResult from './pages/candidate/ResumeAnalysisResult.jsx'
import AppliedJobs from './pages/candidate/AppliedJobs.jsx'
import JobSearch from './pages/candidate/JobSearch.jsx'
import JobDetails from './pages/candidate/JobDetails.jsx'
import AIResumeFeedback from './pages/candidate/AIResumeFeedback.jsx'
import CandidateSettings from './pages/candidate/Settings.jsx'

// Recruiter Pages
import PostNewJob from './pages/recruiter/PostNewJob.jsx'
import ManageJobs from './pages/recruiter/ManageJobs.jsx'
import ApplicantsList from './pages/recruiter/ApplicantsList.jsx'
import CandidateDetails from './pages/recruiter/CandidateDetails.jsx'
import RankedCandidates from './pages/recruiter/RankedCandidates.jsx'
import RecruiterProfile from './pages/recruiter/RecruiterProfile.jsx'
import RecruiterSettings from './pages/recruiter/Settings.jsx'

function RoleHomeRedirect() {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    return <Navigate to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} replace />
}

export default function App() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route
                element={
                    <ProtectedRoute roles={['candidate', 'recruiter']}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<RoleHomeRedirect />} />
                <Route
                    path="/candidate"
                    element={
                        <ProtectedRoute roles={['candidate']}>
                            <CandidateDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/profile"
                    element={
                        <ProtectedRoute roles={['candidate']}>
                            <MyProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/upload-resume"
                    element={
                        <ProtectedRoute roles={['candidate']}>
                            <UploadResume />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/resume-analysis/:resumeId?"
                    element={
                        <ProtectedRoute roles={['candidate']}>
                            <ResumeAnalysisResult />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/applied-jobs"
                    element={
                        <ProtectedRoute roles={['candidate']}>
                            <AppliedJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/job-search"
                    element={
                        <ProtectedRoute roles={['candidate']}>
                            <JobSearch />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/job/:jobId"
                    element={
                        <ProtectedRoute roles={['candidate']}>
                            <JobDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/ai-feedback"
                    element={
                        <ProtectedRoute roles={['candidate']}>
                            <AIResumeFeedback />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/settings"
                    element={
                        <ProtectedRoute roles={['candidate']}>
                            <CandidateSettings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter"
                    element={
                        <ProtectedRoute roles={['recruiter']}>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/post-job"
                    element={
                        <ProtectedRoute roles={['recruiter']}>
                            <PostNewJob />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/manage-jobs"
                    element={
                        <ProtectedRoute roles={['recruiter']}>
                            <ManageJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/applicants/:jobId"
                    element={
                        <ProtectedRoute roles={['recruiter']}>
                            <ApplicantsList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/candidate/:candidateId"
                    element={
                        <ProtectedRoute roles={['recruiter']}>
                            <CandidateDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/ranked-candidates/:jobId?"
                    element={
                        <ProtectedRoute roles={['recruiter']}>
                            <RankedCandidates />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/profile"
                    element={
                        <ProtectedRoute roles={['recruiter']}>
                            <RecruiterProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/settings"
                    element={
                        <ProtectedRoute roles={['recruiter']}>
                            <RecruiterSettings />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

