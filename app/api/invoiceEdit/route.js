import dbConnect from "@/lib/databaseconnect";
import invoiceSchema from "@/models/invoice";

export async function PUT(request){
  let data=await request.json();
  dbConnect();
  let invoiceNum=data.invoiceNum;
 try{
  let invoice=await invoiceSchema.findOne({invoiceNum});
  if(!invoice){
    return Response.json({data:'Invoice With This Number Not Found!!!'},{status:400});
  }
  invoice.products=data.products;
  invoice.totalAmount=data.totalAmount;
  invoice.status=data.status;
  invoice.paidAmount=data.paidAmount;
 await invoice.save();
  return Response.json({data:'Invoice Edited Successfully...'},{status:200});

 }
 catch(err){
  return Response.json({data:'Some Internal Error Occurred...'},{status:400})
 }
}