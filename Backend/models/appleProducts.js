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
const AppleProduct = mongoose.model("Apple",product); 
module.exports = AppleProduct