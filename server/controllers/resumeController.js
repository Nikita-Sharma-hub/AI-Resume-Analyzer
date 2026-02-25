import Resume from "../models/Resume.js";

export const uploadResume = async (req, res) => {
    try {
        const resume = await Resume.create({
            user: req.user,
            fileUrl: req.file.path,

            skills: ["JavaScript", "React"],
            education: ["B.Tech CSE"],
            experience: ["Fresher"],
        });

        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user });

        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteResume = async (req, res) => {
    try {
        await Resume.findByIdAndDelete(req.params.id);
        res.json({ message: "Resume deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};