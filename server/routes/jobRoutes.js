import express from "express";
import {
    createJob,
    getJobs,
    getMyJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobApplicants,
    rankApplicants,
    getJobRecommendations
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", getJobs);
router.get("/my", protect, getMyJobs);
router.get("/recommendations", protect, getJobRecommendations);
router.get("/:id", getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);


router.get("/:id/applicants", protect, getJobApplicants);
router.post("/:id/rank", protect, rankApplicants);

export default router;