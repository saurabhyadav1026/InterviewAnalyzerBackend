import express from "express"
import v1Route from "./routes/v1Route.js";


const app= express();


app.use("/api/v1",v1Route);



app.listen(3000,()=>{
    console.log("Server is running")
})