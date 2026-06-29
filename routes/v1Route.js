import express from "express"
import registerUser from "../controllers/student-controller/registerController.js";
import loginUser from "../controllers/student-controller/loginController.js";
import getSubjectList from "../controllers/student-controller/getSubjectList.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import generateTest from "../controllers/student-controller/generateTest.js";

const v1Route=express.Router();




v1Route.post("/register", registerUser);
v1Route.post("/login",authMiddleware, loginUser);



v1Route.get("/getsubjects",getSubjectList)
v1Route.get("/generateTest",generateTest)










export default v1Route;