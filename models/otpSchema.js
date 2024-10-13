const mongoose=require('mongoose');

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    otp:{
        type:Number,
        required:true
    },
    otpexpire:{
        type:Number,
        required:true
    }
})

const otps=mongoose.model("otp",otpSchema);
module.exports=otps;