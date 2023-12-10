const mongoose = require("mongoose")


const product = new mongoose.Schema({
    
    email:{
        type:String,
        required :[true,"Please provide your email"]  
    },
    review:{
        type:String,
        
    },
    model:{
        type:String
    },
    category:{
        type:String
    }
},
    {timestamps:true}
);
const SamsungProduct = mongoose.model("Samsung",product); 
module.exports = SamsungProduct