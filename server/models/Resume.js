import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    fileUrl: String,

    skills: [String],
    education: [String],
    experience: [String],

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Resume", resumeSchema);