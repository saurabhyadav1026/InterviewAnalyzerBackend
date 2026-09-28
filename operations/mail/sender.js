import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { Resend } from "resend";


dotenv.config();


const resend = new Resend(process.env.MAIL_PASS);




export default resend;