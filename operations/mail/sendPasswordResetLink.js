import sender from "../../config/mail/sender.js";





    
import resend from "./sender.js";
import dotenv from 'dotenv'
dotenv.config()


const sendPasswordResetLink=async(token,userInfo,emailId)=>{
let status= new Promise(async (resolve) => {
  try {
    await resend.emails.send(mail(token,userInfo,emailId));

    resolve(true);
  } catch (err) {
    console.error(err);
    resolve(false);
  }
});
    return status;
}

export default sendPasswordResetLink;







const mail=(token,user_info,emailId)=>{

    

return {

    from:"AbhyasAI<noreply@sbhtechhub.matrices.me>",
    to:emailId,
    subject:"Forget Password :    AbhyasAI",
    html:`<div>
    
    <h2>Hello! ${user_info.name}</h2>
    <pre>
    You have reqested to forget password 
    </pre>
<b> For reset your password click :- </b>

  <a href=${passwordResetLink(token)} style="padding:10px; background:#4285F4; color:white; text-decoration:none; border-radius:5px;">Froget Password </a>
    
  <p>The link will expire within 5 minute. </p>
    </div>
    `




    
}


}

const passwordResetLink=(token)=>{

let link=process.env.ONLINE_URL+"/resetpassword/"+token;

return link;

}


