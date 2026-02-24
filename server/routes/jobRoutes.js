import express from "express";
import { createJob, getJobs, getMyJobs } from "../controllers/jobController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", getJobs);
router.get("/my", protect, getMyJobs);

export default router;