import express from "express"
import { logoutUser } from "../controllers/logoutController.js";
import loginUser from "../controllers/student-controller/loginController.js";
import registerUser from "../controllers/student-controller/registerController.js";
import updateProfie from "../controllers/student-controller/updateProfile.js";

const userRoute=express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/logout",logoutUser);
userRoute.put("/updateProfile",updateProfie);



export default userRoute;