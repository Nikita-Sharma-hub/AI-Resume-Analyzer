import express from "express";
import { getMyApplications, getCandidateDetails, applyToJob, getJobApplicants } from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all applications for the current user
router.get("/my", protect, getMyApplications);

// Apply to a job
router.post("/apply", protect, applyToJob);

// Get job applicants (for recruiters)
router.get("/job/:jobId/applicants", protect, getJobApplicants);

// Get candidate details (for recruiters viewing applicants)
router.get("/candidate/:candidateId", protect, getCandidateDetails);

export default router;
