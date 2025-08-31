import mongoose from "mongoose";

const customerSchema=new mongoose.Schema({
    customerName:{
        type:String,
        required:[true,'Customer Name is Required!']
    },
    customerPhone:{
        type:String,
        required:[true,'Customer Phone is Required!']
    },
    invoices:{
        type:Number,
        required:[true,'Invoices Number is Required!']
    }
})

export default mongoose.models.Customer ||mongoose.model('Customer',customerSchema);