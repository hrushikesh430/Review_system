const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/AppError");
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


const Apple = require("../models/appleProducts");
const Vader = require('vader-sentiment');


exports.getAppleAnalyze = tryCatch(async (req,res,next)=>{


    // Function to classify sentiment
    function classifySentiment(comment) {
        const result = Vader.SentimentIntensityAnalyzer.polarity_scores(comment);
    
        // VADER sentiment analysis gives a compound score
        const compoundScore = result.compound;
    
        // Classify as positive, negative, or neutral based on the compound score
        if (compoundScore >= 0.05) {
            return 'positive';
        } else if (compoundScore <= -0.05) {
            return 'negative';
        } else {
            return 'neutral';
        }
    }


    const data = await Apple.find({});
    console.log(data);
    
    // Example usage
    // const comment1 = "I love this product! It's amazing.";
    // const comment2 = "Terrible experience, never buying again.";
    // const comment3 = "Oh, great! Another fantastic delivery experience. Just what I needed - more worst and damaged, worst, bad,amazing,wow,best";
    
    // let ans = [];

    // ans.push(classifySentiment(comment1));
    // ans.push(classifySentiment(comment2));
    // ans.push(classifySentiment(comment3));

    return res.json({
        status:"success"
    })

})