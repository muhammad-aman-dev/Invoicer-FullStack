import { NextResponse } from "next/server";
export async function POST(){
    const res=NextResponse.json({success:true},{status:200});
    res.cookies.set("auth-token","",{
        httpOnly:true,
        secure: false,
        path:"/",
        sameSite:"lax"
    })
    return res;
}