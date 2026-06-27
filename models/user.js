import mongoose from "mongoose";

const userSchema=new mongoose.Schema({

    userId :{
    type:Number,
    required:true,
    unique:true
    },

    username :{
    type:String,
    required:true
    },

    name:{
    type:String,
    required:true
    },

    
    email:String,
    npassword:String,
    role:String

});

const User = mongoose.model("User",userSchema);

export default User;
