import express from "express";
import { getDashboardStats, getRecruiterStats, getCandidateStats, getRecruiterAnalytics, getCandidateAnalytics } from "../controllers/dashboardController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDashboardStats);

// Candidate dashboard stats
router.get("/stats", protect, getCandidateStats);

// Recruiter dashboard stats  
router.get("/recruiter-stats", protect, getRecruiterStats);

// Analytics endpoints
router.get("/recruiter-analytics", protect, getRecruiterAnalytics);
router.get("/candidate-analytics", protect, getCandidateAnalytics);

export default router;