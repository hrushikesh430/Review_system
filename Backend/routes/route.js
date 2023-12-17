const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


const homePage = require('../controllers/homePage');
const AppleProductAnanlyze = require('../controllers/analyzeProduct')
const reviewApi = require('../controllers/reviewApi');

router.get('/home',homePage.homePage)
router.get('/appleProductAnalyze',AppleProductAnanlyze.getAppleAnalyze)
router.get('/reviewApi',reviewApi.getReviewApi)
module.exports = router;   