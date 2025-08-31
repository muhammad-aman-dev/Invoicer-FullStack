import dbConnect from "@/lib/databaseconnect";
import invoiceSchema from "@/models/invoice.js";
import Customers from "@/models/customerSchema.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  const { customerName, customerPhone, products, paidAmount, totalAmount, status } =
    await request.json();

  if (!customerName || !customerPhone || !products || !totalAmount || !status) {
    return NextResponse.json(
      { error: "Something Missing..." },
      { status: 400 }
    );
  }

 let customer=await Customers.findOne({customerName,customerPhone});
  if(customer){
  customer.invoices=customer.invoices+1;
  await customer.save();
  }
  else{
    let newcustomer=new Customers({
      customerName,
      customerPhone,
      invoices:1
    })
    await newcustomer.save();
  }
  const invoiceNum = Date.now().toString().slice(-8);
  let invoice = new invoiceSchema({
    invoiceNum,
    customerName,
    customerPhone,
    products,
    paidAmount,
    totalAmount,
    status,
  });
  await invoice.save();
  return NextResponse.json({ invoiceNum }, { status: 200 });
}


export async function GET(){
  try{
  let invoices=await invoiceSchema.find({createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000)}}).sort({ createdAt: -1 });
  return NextResponse.json({invoices},{status:200})
  }
  catch(err){
    console.log(err)
    return NextResponse.json({err},{status:400})
  }
}

export async function DELETE(request){
  const {searchParams}=new URL(request.url);
  let id=searchParams.get('id');
  try{
    let invoice=await invoiceSchema.findOne({invoiceNum:id});
    let customer=await Customers.findOne({customerName:invoice.customerName,customerPhone:invoice.customerPhone});
    customer.invoices=customer.invoices-1;
    await customer.save();
    await invoiceSchema.deleteOne({invoiceNum:id})
    return NextResponse.json({data:'Deleted'},{status:200});
  }
  catch(err){
    return NextResponse.json({data:`Some Error Occured!!! ${err}`},{status:400});
  }
}