
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const sender=nodemailer.createTransport({

    service: 'gmail',        // 👈 Host ki jagah service: 'gmail' likhein
  port: 465,               // 👈 Port strictly 465 rakhein
  secure: true,            // 👈 Yeh true hona chahiye
  family: 4,               // IPv4 force karein
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // 👈 Yeh aapka 16-digit "App Password" hona chahiye
  },
  connectionTimeout: 15000, // Timeout limits ko badha dein
  socketTimeout: 15000
  
   /*  port:465,
    host:"smtp.gmail.com",
    //service:'gmail',
     connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
    secure:true,

    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
    },
    connectionTimeout:10000 */
})


export default sender;