
import dotenv from 'dotenv'
import resend from './sender.js'
import User from '../../models/User.js'

dotenv.config()

const sendRegisterUserEmail=async(user_mail,name,OTP)=>{

 const  checkuniqEmail=await User.find({email:user_mail.toLowerCase()}).collation({locale:'en',strength:2})

  if(checkuniqEmail.length>0){
    return {status:false,message:' account email id already exist'};
  }
 


const otp_mail={

    from:"Matrices <noreply@sbhtechhub.matrices.me>",
    to:user_mail,
    subject:"OTP VERIFICATION from AbhyasAI",
    html:"<h5> Your otp   is: </h5><h1>  "+OTP+"</h1> </br></br> <h4>Thankyou</h4> "

}



return new Promise(async (resolve) => {
  try {
    await resend.emails.send(otp_mail);

    resolve({ status: true });
  } catch (err) {
    console.error(err);
    resolve({
      status: false,
      message: "Check your email address or try again later.",
    });
  }
});
}


export default sendRegisterUserEmail;







 export  const createOtpCode=()=>{
 let otp_code=Math.floor(Math.random()*99999);
    return otp_code;
}
