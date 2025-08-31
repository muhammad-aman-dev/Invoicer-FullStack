import dbConnect from "@/lib/databaseconnect";
import invoice from "@/models/invoice";
import { NextResponse } from "next/server";

export async function GET(request){
    const {searchParams}=new URL(request.url);
    let id=searchParams.get('id');
 try{
 let invoicedetail=await invoice.findOne({invoiceNum:id});
 if(!invoicedetail){
return NextResponse.json({data:'Not Found'},{status:400})
 }
 return NextResponse.json({invoicedetail},{status:200})
 }
 catch(err){
 return NextResponse.json({err},{status:400})
 }
}