import User from "../../models/User.js";
import jwt from 'jsonwebtoken'
import sendPasswordResetLink from "../../operations/mail/sendPasswordResetLink.js";


const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "5m"
    });
};

const forgetPassword= async (req,res)=>{

const email = req.query.email.toLowerCase();
console.log(email)



 const user = await User.findOne({email},{_id:1,name:1,email:1});
 console.log(user)
if(!user){
    res.status(401).send({status:false, message:"User not  found"});
    return;
}
else{
   

    const token=generateToken({email:user.email,userId:user._id})
const isSent =  await sendPasswordResetLink(token,{name:user.name},user.email)
    if(isSent){
        console.log("true hai")
 res.status(200).send({status:true, message:"password reset link is sent on your email."});
 return;
    }
 else {
    console.log("galat hai")
    res.status(500).send({status:false, message:"Something error , try again later."});
    }
}

}



export default forgetPassword