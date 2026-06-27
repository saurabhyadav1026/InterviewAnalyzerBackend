import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});