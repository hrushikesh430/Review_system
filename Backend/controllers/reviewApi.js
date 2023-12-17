const tryCatch = require("../utils/tryCatch");
const AppError = require("../utils/AppError");
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const http = require("https");
const axios = require('axios')
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const { SentimentAnalyzer, PorterStemmer } = natural;
const Vader = require('vader-sentiment');
// const request = require('request');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

exports.getReviewApi = tryCatch(async (req,res,next)=>{


    // console.log(req.body)

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

let productName;

// Example usage
const comment1 = "I love this product! It's amazing.";
const comment2 = "Terrible experience, never buying again.";
const comment3 = "Oh, great! Another fantastic delivery experience. Just what I needed - more delays and damaged goods.";

// console.log("Comment 1 sentiment:", classifySentiment(comment1));
// console.log("Comment 2 sentiment:", classifySentiment(comment2));
// console.log("Comment 3 sentiment:", classifySentiment(comment3)); 

    const productId = req.body.id
    let resData = []
    const url = 'https://ecom.webscrapingapi.com/v1';
const params = {
  type: 'product',
  amazon_domain: 'amazon.in',
  engine: 'amazon',
  api_key: 'HP9XsJX4zkXdEBcuZJ3gJfJNfWfDcJn7',
  product_id: productId,
  gl: 'in',
    };

   await axios.get(url, { params })
  .then((response) => {
    // The response.data will contain the parsed JSON data
    console.log('Response:', response.data.product_results);
    productName = response.data.product_results.title
    mainData = response.data.product_results.reviews;
    title  = mainData.title
    product_Id = mainData.id 
    body = mainData.body
    time = mainData.date
    rating = mainData.rating
    console.log(mainData.length)
   
    for(let i = 0; i < mainData.length ; i++)
    {
        // let reviewStatus = solve(mainData[i].body);
        let temp = {
            title :mainData[i].title,
            product_Id : mainData[i].id, 
            body : mainData[i].body,
            time : mainData[i].date,
            rating : mainData[i].rating,
            // reviewStatus:reviewStatus
        }
        // console.log(reviewStatus)
        resData.push(temp);
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

  for(let i = 0; i < resData.length ; i++)
  {
        let temp = classifySentiment(resData[i].body.toString());
        resData[i].reviewStatus = temp;
        console.log(temp)
  }

  return res.json({
    status:"success",
    productName,
    data:resData
})
})