import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";


// init port
const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
await connectDB();

app.use(express.json());
app.use(cors());

// Handle routing for API on /api/users|resumes|ai endpoints
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => {
    res.send("Server is Live...");
});

app.get("/health", (req, res) => {
    res.send("Server is healthy..");
});


// execute port listening
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
