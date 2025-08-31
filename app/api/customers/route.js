import dbConnect from "@/lib/databaseconnect";
import customerSchema from "@/models/customerSchema";

export async function GET() {
    dbConnect();
    try{
        let data=await customerSchema.find({});
        return Response.json({data},{status:200},{message:'Success!'});
    }
    catch(err){
        return Response.json({data:err},{status:400});
    }
}