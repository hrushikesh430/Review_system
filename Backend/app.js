require("dotenv").config()
const express = require('express');
const PORT = 3000 || process.env.PORT;
const app = express();
const mongoose = require('mongoose')
const { spawn } = require('child_process');
const routes = require('./routes/route')
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



app.get('/',(req,res)=>{
    
  
    const Vader = require('vader-sentiment');

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
    
    // Example usage
    const comment1 = "I love this product! It's amazing.";
    const comment2 = "Terrible experience, never buying again.";
    const comment3 = "Oh, great! Another fantastic delivery experience. Just what I needed - more worst and damaged, worst, bad,amazing,wow,best";
    
    let ans = [];

    ans.push(classifySentiment(comment1));
    ans.push(classifySentiment(comment2));
    ans.push(classifySentiment(comment3));
    
    res.json({
        status:"success",
        data : ans
    })
})

app.use(routes)
// process.on('uncaughtException',()=>{
//     console.log("SOmething went wrong")
// })
  
mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log("DB Connected")
}).catch((e)=>{
    console.log("DB Not connected")
})

app.listen(PORT,()=>{
    console.log(`Server is listning at PORt ${PORT}`)
})