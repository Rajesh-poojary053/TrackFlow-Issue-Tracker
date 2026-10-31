
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const commentRoutes = require("./routes/commentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Home API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TrackFlow Issue Tracker API is running!"
    });
});

// Health Check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy"
    });
});

// Server Configuration
const PORT = process.env.PORT || 5000;

// Start Server
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
