import express from "express"
import getSubjectList from "../controllers/student-controller/getSubjectList.js";
import generateTest, { getTest } from "../controllers/student-controller/generateTest.js";
import getTestHistory from "../controllers/student-controller/getTestHistory.js";
import submitTest from "../controllers/student-controller/submitTest.js";


const v1Route=express.Router();








v1Route.get("/getsubjects",getSubjectList)
v1Route.get("/generateTest",generateTest)
v1Route.post("/submitTest",submitTest)
v1Route.get("/getTestHistory",getTestHistory)
v1Route.get("/getTest",async(req,res)=>{
 try{ const test=  await getTest(req.query.testId);
    res.status(200).send({status:true,test})
 }catch(err){
    console.log(err);
    res.status(500).send({"status":false,message:"something error. try again later"});
 }
})









export default v1Route;