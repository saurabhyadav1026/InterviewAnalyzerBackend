import express from "express"
import v1Route from "./routes/v1Route.js";
import dbconnect from "./config/db.js";


const app= express();

dbconnect();
app.use("/api/v1",v1Route);



app.listen(3000,()=>{
    console.log("Server is running")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

