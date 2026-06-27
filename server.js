import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import v1Route from "./routes/v1Route.js";
import v1AdminRoute from "./routes/v1AdminRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

// Use both DB connection methods just in case one replaces the other
try {
    dbconnect();
} catch (e) {
    console.log("Using fallback mongo connection");
}

app.use("/api/v1", v1Route);
app.use("/api/admin/v1",v1AdminRoute)




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

