



import { OAuth2Client } from 'google-auth-library';
import User from '../../models/User.js';

const client=new OAuth2Client(process.env.GOOGLE_O_AUTH_CLINT_ID);

const registerWithGoogle=async(req,res)=>{
const {token}=req.body;
if(!token){
    res.status(402).send({status:false,mesage:"there is no google verification token"})
}
  const ticket= await client.verifyIdToken({idToken:token,audience:process.env.GOOGLE_O_AUTH_CLINT_ID});
  if(!ticket){
    res.status(401).send({status:false,msg:"Failed to verify."})
    return;
    }
    const payloade=ticket.getPayload();
    
    
    
    
    let user= await User.findOne({email:payloade.email.toLowerCase()});
    if(user){
         res.status(401).send({status:false,message:"This gmail is already registered."});
         return;
    }
    
   
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


if(payloade.email.toLowerCase().trim() !==email.toLowerCase().trim()){
    res.status(401).send({status:false,message:"Email not matched"})
}
    // Check if user already exists
    const existingUser = await User.findOne({rollno });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Roll number already registered",
      });
    }

   const user_ = {
      rollno,
      name,
      branch,
      passingYear,
      year,
      email,
      password,
    } ;
    await User.create(user);

    res.status(200).send({status:true,message:"User registered successfully."});

  
}

export default registerWithGoogle;

