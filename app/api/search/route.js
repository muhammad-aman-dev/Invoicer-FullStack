import dbConnect from "@/lib/databaseconnect";
import invoice from "@/models/invoice";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
  
      const docs = await invoice.find({
        invoiceNum: { $regex: "^" + id },
      });
     if(docs){
      return NextResponse.json({ data: docs }, { status: 200 });
     }
     if(!docs){
      return NextResponse.json(
        { data: "cant find invoices"},
        { status: 400 }
      );
     }   
    } catch (err) {
      return NextResponse.json(
        { data: "cant find invoices", error: err.message },
        { status: 400 }
      );
    }
  }
  