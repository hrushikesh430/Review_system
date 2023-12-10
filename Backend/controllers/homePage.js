const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/AppError");
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const Apple = require('../models/appleProducts')

exports.homePage = tryCatch(async (req,res,next)=>{

    const data = new Apple({
        email:"ki2ng@gmail.com",
        review:"Good",
        model:"iphone 14"
    })
    data.save().then((doc)=>{
        console.log(doc.createdAt)
    })
  

    return res.json({
        status:"Success"
    })

})