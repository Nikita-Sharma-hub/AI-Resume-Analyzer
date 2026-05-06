import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

connectDB();

const app = express();

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
            "http://localhost:4173",
            process.env.FRONTEND_URL
        ].filter(Boolean);

        if (
            allowedOrigins.indexOf(origin) !== -1 ||
            process.env.NODE_ENV === "development"
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads folder
app.use("/uploads", express.static("uploads"));

// Ensure all responses are JSON
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "AI Resume Analyzer API",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            resume: "/api/resume",
            job: "/api/job",
            dashboard: "/api/dashboard"
        }
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/application", applicationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.code === "LIMIT_FILE_SIZE") {
        return res
            .status(400)
            .json({ message: "File too large. Maximum size is 5MB." });
    }

    if (
        err.message ===
        "Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed."
    ) {
        return res.status(400).json({ message: err.message });
    }

    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({ message: "CORS policy violation" });
    }

    res.status(err.status || 500).json({
        message: err.message || "Internal server error"
    });
});

// 404 route
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

    if (process.env.GEMINI_API_KEY) {
        console.log("Gemini API KEY: Found");
    } else {
        console.log("Gemini API KEY: Missing");
    }
});