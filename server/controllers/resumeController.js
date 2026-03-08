import Resume from "../models/Resume.js";

import fs from 'fs';

import path from 'path';

import { analyzeResumeWithGemini, compareResumeWithJob, extractResumeEntities } from "../services/geminiService.js";

import { extractTextFromFile, cleanExtractedText, validateExtractedText } from "../services/resumeTextExtractor.js";

import Job from "../models/Job.js";



export const uploadResume = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({ message: "No resume file uploaded" });

        }



        const resume = await Resume.create({

            user: req.user,

            fileName: req.file.originalname,

            fileUrl: req.file.path,

            skills: [],

            education: [],

            experience: [],

        });



        res.status(201).json(resume);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};



export const getMyResumes = async (req, res) => {

    try {

        const resumes = await Resume.find({ user: req.user }).sort({ createdAt: -1 });

        res.json(resumes);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};



export const deleteResume = async (req, res) => {

    try {

        const resume = await Resume.findById(req.params.id);



        if (!resume) {

            return res.status(404).json({ message: "Resume not found" });

        }





        if (resume.user.toString() !== req.user.toString()) {

            return res.status(403).json({ message: "Not authorized to delete this resume" });

        }





        if (resume.fileUrl && fs.existsSync(resume.fileUrl)) {

            fs.unlinkSync(resume.fileUrl);

        }



        await Resume.findByIdAndDelete(req.params.id);

        res.json({ message: "Resume deleted successfully" });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};



export const analyzeResume = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({ message: "No resume file uploaded" });

        }





        const extractedText = await extractTextFromFile(req.file.path);

        const cleanedText = cleanExtractedText(extractedText);





        validateExtractedText(cleanedText);





        const analysis = await analyzeResumeWithGemini(cleanedText);





        const entities = await extractResumeEntities(cleanedText);





        const resume = await Resume.create({

            user: req.user,

            fileName: req.file.originalname,

            fileUrl: req.file.path,

            analysis: {

                ...analysis,

                experienceLevel: entities.experienceLevel,

                industry: entities.industry,

                careerTrajectory: analysis.careerTrajectory || "Not specified"

            },

            skills: entities.skills?.technical || [],

            education: entities.education?.map(edu => edu.institution) || [],

            experience: entities.experience?.map(exp => exp.company) || [],

        });





        res.status(200).json({

            message: "Resume analyzed successfully",

            score: analysis.score,

            strengths: analysis.strengths,

            weaknesses: analysis.weaknesses,

            improvementSuggestions: analysis.improvementSuggestions,

            extractedSkills: analysis.extractedSkills,

            role: analysis.role,

            summary: analysis.summary,

            seniorityHint: analysis.seniorityHint,

            matchScore: analysis.score,

            feedback: analysis.improvementSuggestions.map((suggestion, index) => ({

                type: 'action',

                text: suggestion

            })),

            extracted: {

                skills: analysis.extractedSkills,

                seniorityHint: analysis.seniorityHint,

                entities: entities

            }

        });



    } catch (error) {

        console.error('Resume analysis error:', error);

        res.status(500).json({ message: error.message });

    }

};



export const matchResumeWithJob = async (req, res) => {

    try {

        const { resumeId, jobId } = req.body;



        if (!resumeId || !jobId) {

            return res.status(400).json({ message: "Resume ID and Job ID are required" });

        }





        const resume = await Resume.findById(resumeId);

        if (!resume) {

            return res.status(404).json({ message: "Resume not found" });

        }





        if (resume.user.toString() !== req.user.toString()) {

            return res.status(403).json({ message: "Not authorized to access this resume" });

        }





        const job = await Job.findById(jobId);

        if (!job) {

            return res.status(404).json({ message: "Job not found" });

        }





        const extractedText = await extractTextFromFile(resume.fileUrl);

        const cleanedText = cleanExtractedText(extractedText);





        const comparison = await compareResumeWithJob(cleanedText, job.description);



        res.status(200).json({

            message: "Resume matched with job successfully",

            resumeId,

            jobId,

            matchScore: comparison.matchScore,

            matchingSkills: comparison.matchingSkills,

            missingSkills: comparison.missingSkills,

            strengths: comparison.strengths,

            improvements: comparison.improvements,

            recommendation: comparison.recommendation,

            experienceScore: comparison.experienceScore,

            skillsScore: comparison.skillsScore,

            culturalFit: comparison.culturalFit,

            interviewScore: comparison.interviewScore

        });



    } catch (error) {

        console.error('Resume matching error:', error);

        res.status(500).json({ message: error.message });

    }

};



export const optimizeResume = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({ message: "No resume file uploaded" });

        }



        const { targetRole } = req.body;

        if (!targetRole) {

            return res.status(400).json({ message: "Target role is required for optimization" });

        }





        const extractedText = await extractTextFromFile(req.file.path);

        const cleanedText = cleanExtractedText(extractedText);





        const analysis = await analyzeResumeWithGemini(cleanedText);





        const entities = await extractResumeEntities(cleanedText);



        res.status(200).json({

            message: "Resume optimization suggestions generated",

            targetRole,

            currentScore: analysis.score,

            analysis: analysis,

            entities: entities,

            optimizationSuggestions: {

                improvements: analysis.improvementSuggestions,

                highlightSkills: entities.skills?.technical || [],

                emphasizeExperience: entities.experience?.map(exp => exp.position) || [],

                keywords: analysis.extractedSkills || [],

                structureTips: [

                    "Add quantifiable achievements with metrics",

                    "Include specific project outcomes",

                    "Highlight relevant technologies for the target role",

                    "Show problem-solving process and results",

                    "Demonstrate leadership and collaboration experience"

                ]

            }

        });



    } catch (error) {

        console.error('Resume optimization error:', error);

        res.status(500).json({ message: error.message });

    }

};



export const getSkillGapAnalysis = async (req, res) => {

    try {

        const { resumeId, jobId } = req.params;





        const resume = await Resume.findById(resumeId);

        if (!resume) {

            return res.status(404).json({ message: "Resume not found" });

        }





        if (resume.user.toString() !== req.user.toString()) {

            return res.status(403).json({ message: "Not authorized to access this resume" });

        }





        const job = await Job.findById(jobId);

        if (!job) {

            return res.status(404).json({ message: "Job not found" });

        }





        const extractedText = await extractTextFromFile(resume.fileUrl);

        const cleanedText = cleanExtractedText(extractedText);





        const comparison = await compareResumeWithJob(cleanedText, job.description);



        res.status(200).json({

            message: "Skill gap analysis completed",

            resumeId,

            jobId,

            skillGap: {

                missingSkills: comparison.missingSkills || [],

                matchingSkills: comparison.matchingSkills || [],

                skillsScore: comparison.skillsScore || 0,

                experienceScore: comparison.experienceScore || 0,

                overallScore: comparison.matchScore || 0,

                recommendations: comparison.improvements || []

            }

        });



    } catch (error) {

        console.error('Skill gap analysis error:', error);

        res.status(500).json({ message: error.message });

    }

};