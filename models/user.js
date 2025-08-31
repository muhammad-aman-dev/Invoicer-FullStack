import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Email is Required...']
    },
    password:{
        type:String,
        required:[true,'Password is Required']
    }
});

export default mongoose.models.User || mongoose.model('User',UserSchema);