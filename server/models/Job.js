import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    skillsRequired: [String],
    description: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'closed'],
        default: 'active'
    },
    aiAnalysis: {
        requiredSkills: [String],
        preferredSkills: [String],
        experienceLevel: String,
        keywords: [String],
        industry: String,
        complexity: String
    },
    matchingAnalytics: {
        totalApplications: Number,
        averageMatchScore: Number,
        topCandidates: [mongoose.Schema.Types.ObjectId]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("Job", jobSchema);