import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";

import crypto from "crypto";



const getAndSaveOtp=async(email)=>{

let _otp=crypto.randomInt(100000, 1000000).toString();
const otp = await bcrypt.hash(_otp, 10);
await Otp.deleteMany({email});
await Otp.create({
  email: email,
  otp,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
});

return _otp
}

export default getAndSaveOtp;