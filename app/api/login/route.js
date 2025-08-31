import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/databaseconnect";
import User from "@/models/user.js";

const JWT_SECRET=process.env.JWT_SECRET;

export async function POST(req){
    try{
        await dbConnect();
        const {email,password}=await req.json();
        const user=await User.findOne({email});
        if(!user){
            return NextResponse.json({error:'Invalid Credentials'},{status:401});
        }
       const isValid=await bcrypt.compare(password,user.password);
       if(!isValid){
        return NextResponse.json({error:'Invalid Credentials'},{status:401});
       }
       const token=jwt.sign({userID:user._id,email:user.email},JWT_SECRET,{
        expiresIn:"1h",
       })
       const res=NextResponse.json({success:true},{status:200});
       res.cookies.set("auth-token",token,{
        httpOnly:true,
        secure: false,
        path:"/",
        sameSite:"lax"
       })
       return res;
    }
    catch(err){
    return NextResponse.json({error:err.message},{status:500});
    }
}