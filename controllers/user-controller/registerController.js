import User from "../../models/User.js"; 
import getAndSaveOtp from "../../operations/getAndSaveOtp.js";
import sendRegisterUserEmail from "../../operations/mail/sendRegisterUserEmail.js";
import jwt from "jsonwebtoken";



const generateToken = (payloade) => {
    return jwt.sign(payloade, process.env.JWT_SECRET, {
        expiresIn: "5m"
    });
};

export const registerController = async (req, res) => {



  try {
    const {
      rollno,
      name,
      branch,
      passingYear,
      year,
      email,
      password,
    } = req.body;

    // Check if all fields are provided
    if (
      !rollno ||
      !name ||
      !branch ||
      !passingYear ||
      !year||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }



    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { rollno }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Roll number already registered",
      });
    }

    const user={
      rollno,
      name,
      branch,
      passingYear,
      year,
      email,
      password,
    } ;


    
     const otp = await getAndSaveOtp(user.email);
 const otpToken = generateToken({user});

      res.cookie("otpToken", otpToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

    sendRegisterUserEmail(user.email,user.name, otp);

res.status(200).send({status:true, message:" OTP is send on your register email. It will expire  in 5 minute."})

  }catch(err){
console.log(err)
    res.status(500).send({status:false,message:" Failed to register"});

  }

  }




  export const register=async (user)=>{
    // Create new user
    try{
   await User.create(user);

    return {status:true};
  } catch (error) {
    console.error("Register Error:", error);

    return {
      status: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
};

export default registerController;




const generateOtp=()=>{
  return ""
}