import dbConnect from "@/lib/databaseconnect";
import invoice from "@/models/invoice";
import customerSchema from "@/models/customerSchema";

export async function GET(request){
     dbConnect();
    const {searchParams}=new URL(request.url);
    let id=searchParams.get('id');
    if(!id){
        return Response.json({data:'Request Not Contain The Required Parameters...'},{status:400});
    }
    try{
     let customer=await customerSchema.findOne({_id:id});
     let invoices=await invoice.find({customerName:customer.customerName,customerPhone:customer.customerPhone});
     let data={
        customer,
        customerInvoices:invoices
     }
     return Response.json({data},{status:200});
    }
    catch(err){
     return Response.json({data:err},{status:400});
    }
}

export async function POST(request){
 dbConnect();
let {id}=await request.json();
if(!id){
return Response.json({data:"please give id"},{status:400});
}
try{
 await customerSchema.deleteOne({_id:id});
return Response.json({data:"deleted"},{status:200});
}
catch(err){
console.log(err);
return Response.json({data:err},{status:400});
}
}