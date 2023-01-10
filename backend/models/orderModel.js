const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: { 
            type: String,
             required: true 
            },
        city: { 
            type: String,
             required: true 
            },
        state: { 
            type: String,
             required: true 
            },
        country: {
             type: String, required: true 
            },
        pinCode: {
            type: Number,
            required: true,
        },
        phoneNo: {
            type: Number,
            required: true,
        }
    },

    orderItems:[
        {        
            name:{
                type:String,
                require:true,
            },
            price:{
                type:String,
                require:true,
            },
            quantity:{
                type:String,
                require:true,
            },
            image:{
                type:String,
                require:true
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:"Product",
                required:true
            }
         }
        ],

        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true,
        },
        paymentInfo:{
            id:{
                type:String,
                require:true,
            },
            status:{
                type:String,
                require:true,
            }   
        },
        paidAt:{
            type:Date,
            require:true,
        },
        itemsPrice:{
            type:Number,
            require:true,
            default:0,
        },
        taxPrice:{
            type:Number,
            require:true,
            default:0,
        },
        transportPrice:{
            type:Number,
            require:true,
            default:0,
        },
        totalPrice:{
            type:Number,
            require:true,
            default:0,
        }, 
        orderStatus:{
            type:String,
            require:true,
            default:"processing",
        },
        deliveredAt:Date,
        createdAt:{ 
            type: Date,
             default: Date.now,
            },

});

module.exports = mongoose.model("Order",orderSchema);