import sender from "../../config/mail/sender.js";


const sendRegisterUserEmail =(email,name,otp)=>{



    try{
 sender.sendMail(mail(email,name, otp),(err,info)=>{
     console.log(info)

        if(err){
            console.log("you get error")
            console.log(err);
         //   return false;
        }
        else{
           
            console.log(" hey bro otp is sended "+ email)
        }
    })
    return true;

    }catch(err){

        console.log(err);
        return false;
    }

}

export default sendRegisterUserEmail;






const mail=(email,name , otp)=>{

 
    console.log(" otp will send to "+email)

return {

    from:process.env.MAIL_USER,
    to:email,
    subject:"OTP Verification  :    AbhyasAI",
    html:`<div>
    
    <h2>Hello! ${name}</h2>
    <pre>
    You have reqested to register in <b style="color:blue;">AbhyasAI</b> </b> 
    </pre>
<p> Your OTP is :<p>
<div style="height:50px; padding:5px; color:blue"> <b>${otp}</b> </div>
    
  <p>The Otp will expire within 5 minute. </p>

    </div>
    `




    
}


}