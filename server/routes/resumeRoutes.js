import express from "express";
import {
    uploadResume,
    getMyResumes,
    deleteResume,
    analyzeResume,
    getResumeAnalysis,
    matchResumeWithJob,
    optimizeResume,
    getSkillGapAnalysis
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.post("/analyze", protect, upload.single("resume"), analyzeResume);
router.get("/my", protect, getMyResumes);
router.get("/:resumeId/analysis", protect, getResumeAnalysis);
router.delete("/:id", protect, deleteResume);


router.post("/match", protect, matchResumeWithJob);
router.post("/optimize", protect, upload.single("resume"), optimizeResume);
router.get("/skill-gap/:resumeId/:jobId", protect, getSkillGapAnalysis);

export default router;