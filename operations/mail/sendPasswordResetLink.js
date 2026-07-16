import sender from "../../config/mail/sender.js";


const sendPasswordResetLink =async (user, token)=>{

   

    try{
 sender.sendMail(mail(user,token),(err,info)=>{
        if(err){
            console.log("you get error")
            console.log(err);
         //   return false;
        }
        else{
            console.log(" sent ho gya")
            //return true;
        }
    })
    return true;

    }catch(err){

        console.log(err);
        return false;
    }

}

export default sendPasswordResetLink;




const mail=(user, token)=>{

    const userId= user._id;
    const email= user.email;
    const name= user.name;
    

return {

    from:process.env.MAIL_USER,
    to:email,
    subject:"Forget Password :    AbhyasAI",
    html:`<div>
    
    <h2>Hello! ${name}</h2>
    <pre>
    You have reqested to forget password. </b> 
    </pre>
<p> For reset your password click :- <p>

  <a href=${passwordResetLink(token)} style="padding:10px; background:#4285F4; color:white; text-decoration:none; border-radius:5px;">Froget Password </a>
    
  <p>The link will expire within 5 minute. </p>
  <h5>If you not requested then click here:-</h5>

   <a  style="padding:10px; background:#4285F4; color:white; text-decoration:none; border-radius:5px;">Stop It </a>
 
    
    </div>
    `




    
}


}

const passwordResetLink=(token)=>{

let link=process.env.ONLINE_URL+"/user/secure/resetpassword/"+token;

return link;

}