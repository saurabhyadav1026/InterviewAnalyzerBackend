import express from "express"
import registerUser from "../controllers/student-controller/registerController.js";
import loginUser from "../controllers/student-controller/loginController.js";
import getSubjectList from "../controllers/student-controller/getSubjectList.js";
import authMiddleware from "../middlewares/userAuth.js";
import generateTest from "../controllers/student-controller/generateTest.js";
import updateProfie from "../controllers/student-controller/updateProfile.js";
import getTestHistory from "../controllers/student-controller/getTestHistory.js";
import submitTest from "../controllers/student-controller/submitTest.js";


const v1Route=express.Router();








v1Route.get("/getsubjects",getSubjectList)
v1Route.get("/generateTest",generateTest)
v1Route.post("/submitTest",submitTest)
v1Route.get("testHistory",getTestHistory)










export default v1Route;