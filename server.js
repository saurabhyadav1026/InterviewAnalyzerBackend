import express from 'express'


const app= express();




import dbconnect  from './config/db.js';


import questionRoutes from "./routes/mcqRoutes.js"

dbconnect();
app.use(express.json())



app.use("/api/v1/question",questionRoutes)
app.listen(5000,()=>{
    console.log("Server is running")
})