import Resume from "../models/Resume.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalResumes = await Resume.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        const resumesAnalyzed = totalResumes;
        const jobsMatched = 0;

        res.json({
            totalUsers,
            totalResumes,
            totalJobs,
            totalApplications,
            resumesAnalyzed,
            jobsMatched,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecruiterStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get recruiter's jobs
        const myJobs = await Job.find({ postedBy: userId });
        const totalJobs = myJobs.length;
        const activeJobs = myJobs.filter(job => job.status === 'active').length;

        // Get applications for recruiter's jobs
        const jobIds = myJobs.map(job => job._id);
        const applications = await Application.find({ jobId: { $in: jobIds } });
        const totalApplicants = applications.length;
        const shortlistedCandidates = applications.filter(app => app.status === 'shortlisted').length;

        // Calculate hiring rate
        const acceptedCandidates = applications.filter(app => app.status === 'accepted').length;
        const hiringRate = totalApplicants > 0 ? Math.round((acceptedCandidates / totalApplicants) * 100) : 0;

        // Recent applications (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentApplications = applications.filter(app => app.appliedAt >= sevenDaysAgo).length;

        res.json({
            success: true,
            data: {
                totalJobs,
                activeJobs,
                totalApplicants,
                shortlistedCandidates,
                hiringRate,
                recentApplications
            }
        });
    } catch (error) {
        console.error('Error fetching recruiter stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recruiter statistics',
            error: error.message
        });
    }
};

export const getCandidateStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get candidate's resumes
        const resumes = await Resume.find({ user: userId });
        const totalResumes = resumes.length;

        // Get candidate's applications
        const applications = await Application.find({ userId });
        const applicationsSent = applications.length;

        // Calculate interview status
        const interviewsScheduled = applications.filter(app =>
            ['screening', 'interview', 'shortlisted'].includes(app.status)
        ).length;

        // Calculate profile completion based on user data
        const user = await User.findById(userId);
        const profileFields = ['name', 'email', 'phone', 'location', 'bio', 'skills', 'experience', 'education'];
        const completedFields = profileFields.filter(field => user && user[field]).length;
        const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

        // Resume score (average of all resume analysis scores)
        const resumeScores = resumes
            .filter(resume => resume.analysis && resume.analysis.score)
            .map(resume => resume.analysis.score);
        const resumeScore = resumeScores.length > 0
            ? Math.round(resumeScores.reduce((a, b) => a + b, 0) / resumeScores.length)
            : 0;

        // Profile views (mock for now - could be implemented with analytics)
        const profileViews = Math.floor(Math.random() * 100) + 50;

        res.json({
            success: true,
            data: {
                totalResumes,
                applicationsSent,
                interviewsScheduled,
                profileCompletion,
                resumeScore,
                profileViews
            }
        });
    } catch (error) {
        console.error('Error fetching candidate stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch candidate statistics',
            error: error.message
        });
    }
};

export const getRecruiterAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get recruiter's jobs
        const myJobs = await Job.find({ postedBy: userId });
        const jobIds = myJobs.map(job => job._id);

        // Get applications for recruiter's jobs
        const applications = await Application.find({ jobId: { $in: jobIds } });

        // Generate monthly data for the last 6 months
        const monthlyData = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date();
            monthDate.setMonth(monthDate.getMonth() - i);
            const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
            const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

            const monthApplications = applications.filter(app =>
                app.appliedAt >= monthStart && app.appliedAt <= monthEnd
            );

            const monthHires = monthApplications.filter(app => app.status === 'accepted').length;

            monthlyData.push({
                month: months[5 - i],
                applications: monthApplications.length,
                hires: monthHires
            });
        }

        // Application status distribution
        const statusData = [
            { status: 'Screening', count: applications.filter(app => app.status === 'screening').length, color: '#6366f1' },
            { status: 'Interview', count: applications.filter(app => app.status === 'interview').length, color: '#8b5cf6' },
            { status: 'Shortlisted', count: applications.filter(app => app.status === 'shortlisted').length, color: '#ec4899' },
            { status: 'Accepted', count: applications.filter(app => app.status === 'accepted').length, color: '#10b981' },
            { status: 'Rejected', count: applications.filter(app => app.status === 'rejected').length, color: '#f59e0b' }
        ];

        res.json({
            success: true,
            data: {
                monthlyData,
                statusData
            }
        });
    } catch (error) {
        console.error('Error fetching recruiter analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recruiter analytics',
            error: error.message
        });
    }
};

export const getCandidateAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get candidate's applications
        const applications = await Application.find({ userId });

        // Generate monthly application data
        const monthlyData = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date();
            monthDate.setMonth(monthDate.getMonth() - i);
            const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
            const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

            const monthApplications = applications.filter(app =>
                app.appliedAt >= monthStart && app.appliedAt <= monthEnd
            );

            monthlyData.push({
                name: months[5 - i],
                applications: monthApplications.length
            });
        }

        res.json({
            success: true,
            data: {
                monthlyData
            }
        });
    } catch (error) {
        console.error('Error fetching candidate analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch candidate analytics',
            error: error.message
        });
    }
};
