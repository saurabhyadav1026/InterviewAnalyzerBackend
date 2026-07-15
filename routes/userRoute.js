import express from "express"
import { logoutUser } from "../controllers/user-controller/logoutController.js";
import loginUser from "../controllers/user-controller/loginController.js";
import registerController from "../controllers/user-controller/registerController.js";
import updateProfie from "../controllers/user-controller/updateProfile.js";
import sendPasswordResetLink from "../operations/mail/sendPasswordResetLink.js";
import resetPassword from "../controllers/user-controller/resetPassword.js";
import forgetPassword from "../controllers/user-controller/forgetPassword.js";

const userRoute=express.Router();

userRoute.get("/kk",(req,res)=>{
    res.send("hello bhai")
})

userRoute.post("/register", registerController);
userRoute.post("/login", loginUser);
userRoute.get("/logout",logoutUser);
userRoute.get("/resetmypassword",forgetPassword)
userRoute.post("/secure/resetpassword/:token",resetPassword)
//userRoute.put("/updateProfile",updateProfie);



export default userRoute;