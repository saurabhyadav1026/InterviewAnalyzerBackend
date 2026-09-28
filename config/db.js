
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const dbconnect = async()=>{
   
    await mongoose.connect(process.env.MONGO_URI).then(()=>{
      
    }).catch((errr)=>{
      
        console.error(errr)
    });
}

export default dbconnect;