import express from "express"
import { logoutUser } from "../controllers/user-controller/logoutController.js";
import loginUser from "../controllers/user-controller/loginController.js";
import registerController from "../controllers/user-controller/registerController.js";
import resetPassword from "../controllers/user-controller/resetPassword.js";
import forgetPassword from "../controllers/user-controller/forgetPassword.js";
import registerWithGoogle from "../controllers/user-controller/reisterWithGoogle.js";
import loginWithGoogle from "../controllers/user-controller/loginWithGoogle.js";
import verifyOtp from "../controllers/user-controller/verifyOtp.js";

const userRoute=express.Router();

/**
 * @swagger
 * tags:
 *   name: User Authentication
 *   description: APIs for Student/User registration, authentication, OTP verification, and password resets.
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new student/user
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rollno
 *               - name
 *               - branch
 *               - year
 *               - passingYear
 *               - email
 *               - password
 *             properties:
 *               rollno:
 *                 type: string
 *               name:
 *                 type: string
 *               branch:
 *                 type: string
 *               year:
 *                 type: integer
 *               passingYear:
 *                 type: integer
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification OTP sent to email. Verify to complete registration.
 *       400:
 *         description: Validation or duplication error
 *       500:
 *         description: Server error
 */
userRoute.post("/register", registerController);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login student/user
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful. Sets authentication cookie.
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
userRoute.post("/login", loginUser);

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout user
 *     tags: [User Authentication]
 *     responses:
 *       200:
 *         description: Logout successful. Clears authentication cookie.
 */
userRoute.get("/logout",logoutUser);

/**
 * @swagger
 * /user/resetmypassword:
 *   get:
 *     summary: Request a password reset link email
 *     tags: [User Authentication]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reset email sent successfully
 *       404:
 *         description: User not found
 */
userRoute.get("/resetmypassword",forgetPassword);

/**
 * @swagger
 * /user/secure/resetpassword:
 *   post:
 *     summary: Reset password using the token sent via email
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
userRoute.post("/secure/resetpassword",resetPassword);

/**
 * @swagger
 * /user/verifyotp:
 *   post:
 *     summary: Verify registration OTP to activate account
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - email
 *             properties:
 *               otp:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration and OTP verification successful
 *       400:
 *         description: Invalid OTP
 */
userRoute.post("/verifyotp",verifyOtp);

/**
 * @swagger
 * /user/registerwithgoogle:
 *   post:
 *     summary: Register using Google OAuth credential token
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registered and logged in via Google OAuth successfully
 */
userRoute.post("/registerwithgoogle",registerWithGoogle);

/**
 * @swagger
 * /user/loginwithgoogle:
 *   post:
 *     summary: Login using Google OAuth credential token
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in via Google OAuth successfully
 */
userRoute.post("/loginwithgoogle",loginWithGoogle);

export default userRoute;