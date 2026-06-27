<<<<<<< HEAD
import express from 'express'

=======
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
>>>>>>> 7d18dbcb13e4faadc4005ba6227825655b084ec1

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);

<<<<<<< HEAD
import dbconnect  from './config/db.js';


import questionRoutes from "./routes/mcqRoutes.js"

dbconnect();
app.use(express.json())



app.use("/api/v1/question",questionRoutes)
app.listen(5000,()=>{
    console.log("Server is running")
})
=======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
>>>>>>> 7d18dbcb13e4faadc4005ba6227825655b084ec1
