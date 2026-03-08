import Resume from "../models/Resume.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalResumes = await Resume.countDocuments();
        const resumesAnalyzed = totalResumes;
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
