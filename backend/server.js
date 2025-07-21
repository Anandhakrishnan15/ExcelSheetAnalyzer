require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routers/authRoutes");
const getuserRouter = require("./routers/getUserInfo");
const upload = require("./routers/upload");
const savedGraphRoutes = require("./routers/savedGraphRoutes");
const aiReportRoutes = require("./routers/aiReportRoutes");
const dashboardRoutes = require("./routers/dashboard");
const alldashboardRoutes = require("./routers/alldashboardRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Allowed origins
const allowedOrigins = [
    "https://chartmate.netlify.app", // Replace this with your deployed frontend URL
    "http://localhost:5173",
    // "https://your-backend-domain.up.railway.app",
];

// Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);
app.use(helmet());
app.use(express.json());

// API Routes
app.use("/Auth", authRoutes);
app.use("/api/users", getuserRouter);
app.use("/api/uploads", upload);
app.use("/api/saved-graphs", savedGraphRoutes);
app.use("/api/ai-summary", aiReportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", alldashboardRoutes);

// Serve React frontend (Vite build)
app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
