import express from "express"
import { logoutUser } from "../controllers/user-controller/logoutController.js";
import loginUser from "../controllers/user-controller/loginController.js";
import registerController from "../controllers/user-controller/registerController.js";
import updateProfie from "../controllers/user-controller/updateProfile.js";

const userRoute=express.Router();


userRoute.post("/register", registerController);
userRoute.post("/login", loginUser);
userRoute.get("/logout",logoutUser);
//userRoute.put("/updateProfile",updateProfie);



export default userRoute;