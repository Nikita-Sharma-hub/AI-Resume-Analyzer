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
                    path="/recruiter"
                    element={
                        <ProtectedRoute roles={['recruiter']}>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

