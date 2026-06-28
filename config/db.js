
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const dbconnect = async()=>{
   
    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Mongodb is connected");
    });
}

export default dbconnect;