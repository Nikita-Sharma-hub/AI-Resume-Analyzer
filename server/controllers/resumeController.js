import Resume from "../models/Resume.js";

export const uploadResume = async (req, res) => {
    try {
        const resume = await Resume.create({
            user: req.user,
            fileUrl: req.file.path,
            originalName: req.file.originalname,
        });

        res.json(resume);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};