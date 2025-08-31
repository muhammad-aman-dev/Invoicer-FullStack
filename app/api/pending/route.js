import dbConnect from "@/lib/databaseconnect";
import invoice from "@/models/invoice";

export async function GET(){
dbConnect();
try{
let data=await invoice.find({status:'Not Paid'});
return Response.json({data},{status:200});
}
catch(err){
return Response.json({data:err},{status:400});
}
}