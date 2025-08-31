import mongoose from "mongoose";

const invoiceSchema=new mongoose.Schema({
   invoiceNum:{
    type:String,
    required:[true,'Invoice Number is Mandatory']
   },
   customerName:{
    type:String,
    required:[true,'Customer Name is Required']
   },
   customerPhone:{
    type:String,
    required:[true,'Customer Phone is Required']
   },
   products: [
    {
    name:{
        type:String,
        required:[true,'Product Name is Required']
    },
    quantity:{
        type:Number,
        required:[true,'Quantity Is Required']
    },
    priceforone:{
      type:Number,
      required:[true,'Price For One Piece is Required']
    },
    totalPOP:{
    type:Number,
    required:[true,'Total Price Of Product is Required']
    }
   }
   ], 
   paidAmount:{
    type:Number,
    required:[true,'Paid Amount is Required...']
   },
   totalAmount:{
    type:Number,
    required:[true,'Total Amount is Required...']
   },
   status:{
    type:String,
    required:[true,'Status is Required...']
   },
},{ timestamps: true }) 

export default mongoose.models.Invoice||mongoose.model('Invoice',invoiceSchema);