import Resume from "../models/Resume.js";

export const uploadResume = async (req, res) => {
    try {
        const resume = await Resume.create({
            user: req.user._id,
            fileUrl: req.file.path,

            skills: ["JavaScript", "React"],   // dummy for now
            education: ["B.Tech CSE"],
            experience: ["Fresher"],
        });

        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};