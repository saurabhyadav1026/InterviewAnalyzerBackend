const mongoose = require("mongoose");

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

module.exports = mongoose.model("User",userSchema);