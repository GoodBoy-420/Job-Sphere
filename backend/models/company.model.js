import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String, 
    },
    website:{
        type:String 
    },
    location:{
        type:String 
    },
    logo:{
        type:String // URL to company logo
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationStatus:{
        type:String,
        enum:['pending', 'approved', 'rejected'],
        default:'pending'
    }
},{timestamps:true,versionKey: false})
export const Company = mongoose.model("Company", companySchema);