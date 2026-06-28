import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import v1Route from "./routes/v1Route.js";
import userRoutes from "./routes/userRoutes.js";
import interviewRoute from "./routes/interviewRoute.js";
import dbconnect from "./config/db.js";
import v1AdminRoute from "./routes/v1AdminRoute.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Connect to Database
dbconnect().catch(err => {
    console.error("Database connection failed:", err);
});

app.use("/api/user", userRoutes);
app.use("/api/v1", v1Route);
app.use("/api/admin/v1",v1AdminRoute)
app.use("/api/v1/interviews", interviewRoute);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

