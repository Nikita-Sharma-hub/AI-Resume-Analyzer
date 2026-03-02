import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ MIDDLEWARES
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("API is running");
});

// ✅ API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);