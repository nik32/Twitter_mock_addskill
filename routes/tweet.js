const router = require('express').Router();

const tweetContoller = require('../controllers/tweet');
const isAuth = require('../RBACmiddleware.js');

//API related to fetching all the tweets in our app in paginated way - for home page
router.get("/api/getAllTweets", tweetContoller.getAllTweets);

//API related to fetching all the tweets of a user - for userTimeline page
router.get("/api/getUserTweets", tweetContoller.getUserTweets);

//API related to posting the tweet
router.post("/api/postTweet", isAuth, tweetContoller.postTweet);

//API related to editing the tweet
router.patch("/api/patchTweet", isAuth, tweetContoller.patchTweet);


module.exports = router;