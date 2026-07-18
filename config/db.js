
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const dbconnect = async()=>{
   
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("db connected succefully")
    }).catch((errr)=>{
        console.log("db error hai")
        console.log(errr)
    });
}

export default dbconnect;