const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    //orders linking with the users and creating new schema for the orders
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    items:{
        type:Object,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },

    paymentType:{
        type:String,
        default:'COD'
    },
    status:{
        type:String,
        default:'order_placed'
    }
    
},{timestamps:true})

const Order = mongoose.model('Order',orderSchema)
module.exports = Order;