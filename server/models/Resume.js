import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    analysis: {
        score: {
            type: Number,
            min: 0,
            max: 100,
        },
        strengths: [String],
        weaknesses: [String],
        improvementSuggestions: [String],
        extractedSkills: [String],
        role: String,
        summary: String,
        seniorityHint: String,
    },
    skills: [String],
    education: [String],
    experience: [String],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Resume", resumeSchema);