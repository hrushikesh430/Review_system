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

exports.postCompareReview = tryCatch(async (req,res,next)=>{


    // console.log(req.body)
    let id1= req.body.id1;
    let id2 = req.body.id2;
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
const comment3 = "Oh, great! Another fantastic delivery experience. Just what I needed - more delays and damaged goods.";

// console.log("Comment 1 sentiment:", classifySentiment(comment1));
// console.log("Comment 2 sentiment:", classifySentiment(comment2));
// console.log("Comment 3 sentiment:", classifySentiment(comment3)); 

    let productId = req.body.id1
    let resData1 = []
    let resData2 = []
    let finData1 = {
        positive :0,
        neutral:0,
        negative:0
    }
    let finData2 = {
        positive :0,
        neutral:0,
        negative:0
    }
    const url = 'https://ecom.webscrapingapi.com/v1';
let params = {
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
    // console.log('Response:', response.data.product_results.reviews);
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
        resData1.push(temp);
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

  for(let i = 0; i < resData1.length ; i++)
  {
        let temp = classifySentiment(resData1[i].body.toString());
        resData1[i].reviewStatus = temp;
        if(temp=='positive')
        finData1['positive'] += 1;
        else if (temp=='neutral')
        finData1['neutral'] += 1;
        else if(temp=='negative')
        finData1['negative'] += 1;

        console.log(temp)
  }


   productId = req.body.id2
//   const url = 'https://ecom.webscrapingapi.com/v1';
   params = {
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
      // console.log('Response:', response.data.product_results.reviews);
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
          resData2.push(temp);
      }
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
  
    for(let i = 0; i < resData2.length ; i++)
    {
          let temp = classifySentiment(resData2[i].body.toString());
          resData2[i].reviewStatus = temp;
          console.log(temp)
          if(temp=='positive')
        finData2['positive'] += 1;
        else if (temp=='neutral')
        finData2['neutral'] += 1;
        else if(temp=='negative')
        finData2['negative'] += 1;
    }

  return res.json({
    status:"success",
    data:[{
        id1:id1,
        data1:finData1
    },
    {
        id2:id2,
        data2:finData2
    }]
})
})