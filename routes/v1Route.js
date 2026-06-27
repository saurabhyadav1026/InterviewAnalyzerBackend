import express from "express"

const v1Route=express.Router();


v1Route.get("/hello",(req,res)=>{

    res.send("hello buddy");
})


export default v1Route;