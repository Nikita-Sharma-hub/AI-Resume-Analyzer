// backend/controllers/dashboardController.js
import Resume from "../models/Resume.js";
import User from "../models/User.js";

// Fetch real dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalResumes = await Resume.countDocuments();

        // Resumes analyzed can be the same as total resumes if analysis is automatic
        const resumesAnalyzed = totalResumes;

        // Jobs matched — if you don't have job API yet, just set 0
        const jobsMatched = 0;

        res.json({
            totalUsers,
            totalResumes,
            resumesAnalyzed,
            jobsMatched,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
