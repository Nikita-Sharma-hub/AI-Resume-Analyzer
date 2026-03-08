import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

console.log("Gemini API KEY:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
console.log("Gemini initialized:", !!genAI);


// ================= RESUME ANALYSIS =================

export const analyzeResumeWithGemini = async (resumeText) => {
    try {

        if (!genAI) {
            throw new Error("Gemini API not initialized. Check API key.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Analyze the following resume and return ONLY valid JSON.

Resume:
${resumeText}

Return response STRICTLY in this format:

{
 "score": number,
 "strengths": [],
 "weaknesses": [],
 "improvementSuggestions": [],
 "extractedSkills": [],
 "role": "",
 "seniorityHint": "",
 "summary": "",
 "careerTrajectory": ""
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini raw response:", text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Invalid JSON returned from Gemini");
        }

        return JSON.parse(jsonMatch[0]);

    } catch (error) {

        console.error("Gemini Resume Analysis Error:", error);

        return {
            score: Math.floor(Math.random() * 30) + 60,
            strengths: ["Resume structure detected"],
            weaknesses: ["AI analysis failed"],
            improvementSuggestions: ["Try re-uploading resume"],
            extractedSkills: [],
            role: "Unknown",
            seniorityHint: "Unknown",
            summary: "AI analysis unavailable",
            careerTrajectory: "Unknown"
        };
    }
};


// ================= RESUME ENTITY EXTRACTION =================

export const extractResumeEntities = async (resumeText) => {
    try {

        if (!genAI) {
            throw new Error("Gemini API not initialized.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Extract resume information and return ONLY JSON.

Resume:
${resumeText}

Return format:

{
 "personalInfo": {},
 "skills": {
   "technical": [],
   "soft": []
 },
 "experience": [],
 "education": [],
 "projects": [],
 "summary": "",
 "experienceLevel": "",
 "industry": ""
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Entity Extraction:", text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Invalid JSON returned");
        }

        return JSON.parse(jsonMatch[0]);

    } catch (error) {

        console.error("Gemini Entity Extraction Error:", error);

        return {
            personalInfo: {},
            skills: { technical: [], soft: [] },
            experience: [],
            education: [],
            projects: [],
            summary: "",
            experienceLevel: "Unknown",
            industry: "Unknown"
        };
    }
};


// ================= JOB DESCRIPTION ANALYSIS =================

export const extractJobEntities = async (jobDescription) => {
    try {

        if (!genAI) {
            throw new Error("Gemini API not initialized.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Analyze the following job description and return ONLY JSON.

Job Description:
${jobDescription}

Return format:

{
 "requiredSkills": [],
 "preferredSkills": [],
 "experienceLevel": "",
 "keywords": [],
 "industry": "",
 "complexity": ""
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Job Entity Extraction:", text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Invalid JSON returned");
        }

        return JSON.parse(jsonMatch[0]);

    } catch (error) {

        console.error("Job Entity Extraction Error:", error);

        return {
            requiredSkills: [],
            preferredSkills: [],
            experienceLevel: "mid-level",
            keywords: [],
            industry: "General",
            complexity: "medium"
        };
    }
};


// ================= RESUME VS JOB MATCH =================

export const compareResumeWithJob = async (resumeText, jobDescription) => {
    try {

        if (!genAI) {
            throw new Error("Gemini API not initialized.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Compare the resume and job description.

Resume:
${resumeText}

Job:
${jobDescription}

Return ONLY JSON:

{
 "matchScore": number,
 "matchingSkills": [],
 "missingSkills": [],
 "strengths": [],
 "improvements": [],
 "recommendation": "",
 "experienceScore": number,
 "skillsScore": number,
 "culturalFit": number,
 "interviewScore": number
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Job Match Response:", text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Invalid JSON returned");
        }

        return JSON.parse(jsonMatch[0]);

    } catch (error) {

        console.error("Gemini Job Match Error:", error);

        return {
            matchScore: 50,
            matchingSkills: [],
            missingSkills: [],
            strengths: [],
            improvements: [],
            recommendation: "Consider",
            experienceScore: 50,
            skillsScore: 50,
            culturalFit: 50,
            interviewScore: 50
        };
    }
};