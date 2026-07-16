import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";

import crypto from "crypto";



const getAndSaveOtp=async(email)=>{

let otp=crypto.randomInt(100000, 1000000).toString();
otp = await bcrypt.hash(otp, 10);

await Otp.create({
  email: email,
  otp,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
});

return otp
}

export default getAndSaveOtp;