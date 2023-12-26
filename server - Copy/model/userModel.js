import mongoose from "mongoose";

export const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'please provide  username'],
        unique:[true,'username exist']
    },
    password:{
        type:String,
        required:[true,'please provide Password'],
        unique:false
    },
    email:{
        type:String,
        required:[true,'please provide  email'],
        unique:true
    },
    firstname:{type:String},
    lastname:{type:String},
    mobile:{type:Number},
    address:{type:String},
    profile:{type:String}
})

export default mongoose.model.RegisterUsers || mongoose.model('RegisterUsers',userSchema) 