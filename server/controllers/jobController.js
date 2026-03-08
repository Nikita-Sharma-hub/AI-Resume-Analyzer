import Job from "../models/Job.js";

import Resume from "../models/Resume.js";

import { extractJobEntities, compareResumeWithJob, extractResumeEntities } from "../services/geminiService.js";

import { extractTextFromFile, cleanExtractedText } from "../services/resumeTextExtractor.js";



export const createJob = async (req, res) => {

    try {

        const jobData = { ...req.body, postedBy: req.user };





        if (jobData.description) {

            try {

                const jobEntities = await extractJobEntities(jobData.description);

                jobData.aiAnalysis = {

                    requiredSkills: jobEntities.requiredSkills || [],

                    preferredSkills: jobEntities.preferredSkills || [],

                    experienceLevel: jobEntities.experienceLevel || 'mid-level',

                    keywords: jobEntities.keywords || [],

                    industry: jobEntities.industry || 'General',

                    complexity: jobEntities.complexity || 'medium'

                };

            } catch (aiError) {

                console.warn('AI analysis failed, using basic data:', aiError.message);



            }

        }



        const job = await Job.create(jobData);

        res.status(201).json(job);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};



export const getJobs = async (req, res) => {

    try {

        const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });

        res.status(200).json(jobs);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};



export const getMyJobs = async (req, res) => {

    try {

        const jobs = await Job.find({ postedBy: req.user }).sort({ createdAt: -1 });

        res.status(200).json(jobs);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};



export const getJobById = async (req, res) => {

    try {

        const job = await Job.findById(req.params.id);

        if (!job) {

            return res.status(404).json({ message: "Job not found" });

        }

        res.status(200).json(job);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};



export const updateJob = async (req, res) => {

    try {

        const job = await Job.findById(req.params.id);

        if (!job) {

            return res.status(404).json({ message: "Job not found" });

        }





        if (job.postedBy.toString() !== req.user.toString()) {

            return res.status(403).json({ message: "Not authorized to update this job" });

        }



        const updatedJob = await Job.findByIdAndUpdate(

            req.params.id,

            { ...req.body, updatedAt: new Date() },

            { new: true }

        );



        res.status(200).json(updatedJob);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};



export const deleteJob = async (req, res) => {

    try {

        const job = await Job.findById(req.params.id);

        if (!job) {

            return res.status(404).json({ message: "Job not found" });

        }





        if (job.postedBy.toString() !== req.user.toString()) {

            return res.status(403).json({ message: "Not authorized to delete this job" });

        }



        await Job.findByIdAndDelete(req.params.id);

        res.json({ message: "Job deleted successfully" });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};



export const getJobApplicants = async (req, res) => {

    try {

        const jobId = req.params.id;





        const job = await Job.findById(jobId);

        if (!job) {

            return res.status(404).json({ message: "Job not found" });

        }





        if (job.postedBy.toString() !== req.user.toString()) {

            return res.status(403).json({ message: "Not authorized to view applicants for this job" });

        }





        const allResumes = await Resume.find()

            .populate('user', 'name email')

            .sort({ createdAt: -1 });





        const applicants = [];



        for (const resume of allResumes) {

            try {



                const extractedText = await extractTextFromFile(resume.fileUrl);

                const cleanedText = cleanExtractedText(extractedText);





                const comparison = await compareResumeWithJob(cleanedText, job.description);



                applicants.push({

                    resumeId: resume._id,

                    candidate: resume.user,

                    fileName: resume.fileName,

                    analysis: resume.analysis,

                    matchScore: comparison.matchScore || 0,

                    matchingSkills: comparison.matchingSkills || [],

                    missingSkills: comparison.missingSkills || [],

                    recommendation: comparison.recommendation || 'Consider',

                    experienceScore: comparison.experienceScore || 0,

                    skillsScore: comparison.skillsScore || 0,

                    culturalFit: comparison.culturalFit || 0,

                    interviewScore: comparison.interviewScore || 0,

                    appliedAt: resume.createdAt

                });

            } catch (error) {

                console.error(`Error processing resume ${resume._id}:`, error);



                applicants.push({

                    resumeId: resume._id,

                    candidate: resume.user,

                    fileName: resume.fileName,

                    analysis: resume.analysis,

                    matchScore: 0,

                    matchingSkills: [],

                    missingSkills: [],

                    recommendation: 'Not Recommended',

                    experienceScore: 0,

                    skillsScore: 0,

                    culturalFit: 0,

                    interviewScore: 0,

                    appliedAt: resume.createdAt,

                    error: 'Analysis failed'

                });

            }

        }





        applicants.sort((a, b) => b.matchScore - a.matchScore);





        job.matchingAnalytics = {

            totalApplications: applicants.length,

            averageMatchScore: applicants.reduce((sum, app) => sum + app.matchScore, 0) / applicants.length || 0,

            topCandidates: applicants.slice(0, 10).map(app => app.resumeId)

        };

        await job.save();



        res.status(200).json({

            jobId,

            jobTitle: job.title,

            totalApplicants: applicants.length,

            averageMatchScore: job.matchingAnalytics.averageMatchScore,

            applicants: applicants

        });



    } catch (error) {

        console.error('Get job applicants error:', error);

        res.status(500).json({ message: error.message });

    }

};



export const getJobRecommendations = async (req, res) => {

    try {



        const jobs = await Job.find({ status: 'active' })

            .populate('postedBy', 'name company')

            .sort({ createdAt: -1 })

            .limit(20);





        const userResumes = await Resume.find({ user: req.user })

            .sort({ createdAt: -1 })

            .limit(3);



        if (userResumes.length === 0) {

            return res.status(200).json({

                message: "No resumes found. Please upload a resume to get personalized recommendations.",

                recommendations: jobs.slice(0, 10).map(job => ({

                    job,

                    matchScore: 50,

                    matchReason: "General recommendation - upload resume for better matching"

                }))

            });

        }





        const latestResume = userResumes[0];

        let userSkills = [];

        let userExperience = "";



        try {

            const extractedText = await extractTextFromFile(latestResume.fileUrl);

            const cleanedText = cleanExtractedText(extractedText);

            const entities = await extractResumeEntities(cleanedText);

            userSkills = entities.skills?.technical || [];

            userExperience = entities.experience?.map(exp => exp.description).join(" ") || "";

        } catch (error) {

            console.warn('Failed to extract resume data for recommendations:', error.message);

        }





        const recommendations = [];



        for (const job of jobs) {

            let matchScore = 30;

            let matchReasons = [];





            const jobSkills = job.skillsRequired || [];

            const matchingSkills = userSkills.filter(skill =>

                jobSkills.some(jobSkill =>

                    jobSkill.toLowerCase().includes(skill.toLowerCase()) ||

                    skill.toLowerCase().includes(jobSkill.toLowerCase())

                )

            );



            if (matchingSkills.length > 0) {

                matchScore += (matchingSkills.length / Math.max(jobSkills.length, 1)) * 40;

                matchReasons.push(`${matchingSkills.length} matching skills`);

            }





            if (job.aiAnalysis?.experienceLevel) {

                const jobLevel = job.aiAnalysis.experienceLevel.toLowerCase();

                if (userExperience.toLowerCase().includes('senior') && jobLevel.includes('senior')) {

                    matchScore += 15;

                    matchReasons.push('Experience level matches');

                } else if (userExperience.toLowerCase().includes('junior') && jobLevel.includes('junior')) {

                    matchScore += 15;

                    matchReasons.push('Experience level matches');

                }

            }





            const daysSincePosted = (Date.now() - job.createdAt) / (1000 * 60 * 60 * 24);

            if (daysSincePosted < 7) {

                matchScore += 10;

                matchReasons.push('Recently posted');

            }



            recommendations.push({

                job,

                matchScore: Math.min(matchScore, 100),

                matchReason: matchReasons.length > 0 ? matchReasons.join(', ') : "General recommendation",

                matchingSkills

            });

        }





        recommendations.sort((a, b) => b.matchScore - a.matchScore);



        res.status(200).json({

            message: "Job recommendations generated successfully",

            totalJobs: jobs.length,

            recommendations: recommendations.slice(0, 10)

        });



    } catch (error) {

        console.error('Get job recommendations error:', error);

        res.status(500).json({ message: error.message });

    }

};



export const rankApplicants = async (req, res) => {

    try {

        const jobId = req.params.id;





        const job = await Job.findById(jobId);

        if (!job) {

            return res.status(404).json({ message: "Job not found" });

        }





        if (job.postedBy.toString() !== req.user.toString()) {

            return res.status(403).json({ message: "Not authorized to rank applicants for this job" });

        }



        const applicantsResponse = await getJobApplicants({ params: { id: jobId }, user: req.user }, res);



    } catch (error) {

        console.error('Rank applicants error:', error);

        res.status(500).json({ message: error.message });

    }

};