import express from "express"
import takeTest from "../controllers/student-controller/takeTest.js";
import submitTest from "../controllers/student-controller/submitTest.js";
import getConductedTest from "../controllers/student-controller/getConductedTest.js";

//import getSubjectList from "../controllers/student-controller/getSubjectList.js";
//import generatePraticeTest, { getTest } from "../controllers/student-controller/generatePraticeTest.js";
//import getTestHistory from "../controllers/student-controller/getTestHistory.js";
//import submitTest from "../controllers/student-controller/submitPraticeTest.js";


const v1Route=express.Router();


v1Route.get("/getConductedTest",getConductedTest);
v1Route.get("/getTest/:testId",takeTest);
v1Route.post("/submitTest",submitTest)





/* v1Route.get("/getsubjects",getSubjectList)
v1Route.get("/generateTest",generatePraticeTest)
v1Route.post("/submitTest",submitTest)
v1Route.get("/getTestHistory",getTestHistory)
v1Route.get("/getTest",async(req,res)=>{
 try{ const test=  await getTest(req.query.testId);
    res.status(200).send({status:true,test})
 }catch(err){
    console.log(err);
    res.status(500).send({"status":false,message:"something error. try again later"});
 }
}) */









export default v1Route;