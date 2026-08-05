

import { OAuth2Client } from 'google-auth-library';
import { setLoginUser } from './loginController.js';
import User from '../../models/User.js';


const client=new OAuth2Client(process.env.GOOGLE_O_AUTH_CLINT_ID);


const loginWithGoogle=async(req,res)=>{

    
    const {token}=req.body

  const ticket= await client.verifyIdToken({idToken:token,audience:process.env.GOOGLE_O_AUTH_CLINT_ID});

  if(!ticket)return {status:false,msg:"ticket not verified"}
    const payloade=ticket.getPayload();
    
    
    
    
     let user= await User.findOne({email:payloade.email.toLowerCase()})
    
    if(!user){
    

        res.status(401).send({status:false,message:"User not registered."})
   return;
    }
  
   return setLoginUser(res,user)

  
}

export default loginWithGoogle;