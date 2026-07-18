import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const sender=nodemailer.createTransport({
    port:587,
    host:"smtp.gmail.com",
    //service:'gmail',
    secure:false,

    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS
    },
    connectionTimeout:10000
})


export default sender;