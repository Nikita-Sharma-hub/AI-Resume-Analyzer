import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    fileUrl: String,
    originalName: String,
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);