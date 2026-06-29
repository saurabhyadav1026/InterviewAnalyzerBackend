import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import v1Route from "./routes/v1Route.js";
import dbconnect from "./config/db.js";
import mcqRoutes from './routes/mcqRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Use both DB connection methods just in case one replaces the other
try {
    dbconnect();
} catch (e) {
    console.log("Using fallback mongo connection");
}



app.use("/api/auth", authRoutes);
app.use("/api/v1", v1Route);
app.use("/api/v1/question",mcqRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

