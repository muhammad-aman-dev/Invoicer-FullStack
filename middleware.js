import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET=process.env.JWT_SECRET;
const secretKey= new TextEncoder().encode(JWT_SECRET);

export async function middleware(req){
    const token=req.cookies.get("auth-token")?.value;
    if(!token){
        return NextResponse.redirect(new URL("/login",req.url));
    }
    try{
        await jwtVerify(token,secretKey);
        return NextResponse.next();
    }
    catch(err){
        console.log(err);
        return NextResponse.redirect(new URL("/login",req.url));
    }
}

export const config={
    matcher:["/((?!login|api|_next|favicon.ico|public|favicon.ico))","/","/pendinginvoices","/customer/:path*","/editinvoice/:path*"],
};