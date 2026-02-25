import express from "express";
import {
    uploadResume,
    getMyResumes,
    deleteResume
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/my", protect, getMyResumes);
router.delete("/:id", protect, deleteResume);

export default router;