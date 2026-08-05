import express from "express"
import { logoutUser } from "../controllers/user-controller/logoutController.js";
import loginUser from "../controllers/user-controller/loginController.js";
import registerController from "../controllers/user-controller/registerController.js";
import updateProfie from "../controllers/user-controller/updateProfile.js";
import sendPasswordResetLink from "../operations/mail/sendPasswordResetLink.js";
import resetPassword from "../controllers/user-controller/resetPassword.js";
import forgetPassword from "../controllers/user-controller/forgetPassword.js";
import registerWithGoogle from "../controllers/user-controller/reisterWithGoogle.js";
import loginWithGoogle from "../controllers/user-controller/loginWithGoogle.js";

const userRoute=express.Router();



userRoute.post("/register", registerController);
userRoute.post("/login", loginUser);
userRoute.get("/logout",logoutUser);


userRoute.get("/resetmypassword",forgetPassword)        // send   ?email
userRoute.post("/secure/resetpassword",resetPassword)   // send in body   {token ,password}
userRoute.post("/verifyotp",forgetPassword)              //send in body     {otp}

userRoute.post("/registerwithgoogle",registerWithGoogle);
userRoute.post("/loginwithgoogle",loginWithGoogle)


//userRoute.put("/updateProfile",updateProfie);



export default userRoute;