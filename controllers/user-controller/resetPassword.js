
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";


const resetPassword=async(req,res)=>{

//const token=req.param.token;
let {password, token}=req.body;
if(!token)res.status(401).send({status:false});

   const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
if(!password)res.status(404).send({status:false,message:"Password is required."});
try{
const payloade= jwt.verify(
      token,
      process.env.JWT_SECRET
    );
await User.findOneAndUpdate({_id:payloade.userId},{$set:{password}});
res.status(200).send({status:true,message:"Password reset successfully."})
}

catch(err){
    console.log(err);
    console.log("yha err ba")
    res.status(401).send({status:false})
}

}

export default resetPassword;