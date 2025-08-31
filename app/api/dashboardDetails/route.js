import invoiceSchema from '@/models/invoice'
import customerSchema from '@/models/customerSchema'
import dbConnect from '@/lib/databaseconnect'

export async function GET(){
    dbConnect();
    try{
    const invoices=await invoiceSchema.countDocuments({});
    const invoicesNumber=invoices.toString();
    const customers=await customerSchema.countDocuments({});
    const customersNumber=customers.toString();
    const revenueInvoices=await invoiceSchema.find({status:'Paid'});
    let revenue = 0;
    revenueInvoices.forEach(invoice => {
      revenue += invoice.totalAmount;
    });
    const pendingInvoices=await invoiceSchema.find({status:'Not Paid'});
    let pending = 0;
    pendingInvoices.forEach(invoice => {
      pending += invoice.totalAmount;
    });
    let allData={
        invoicesNumber,
        customersNumber,
        revenue,
        pending
    }
    return Response.json({data:allData},{status:200})
}
catch(err){
    return Response.json({data:err},{status:400});
}
}