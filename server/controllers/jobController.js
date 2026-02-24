import Job from "../models/Job.js";


export const createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            user: req.user.id,
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.id });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};