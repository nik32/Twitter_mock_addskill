const Tweet = require('../models/tweet');
const People = require('../models/people');
const ObjectId = require('mongodb').ObjectId;

const PAGE_SIZE = 10;


module.exports.getAllTweets = async (req, res) => {

    //TO DO THIS IN ONE QUERY - https://stackoverflow.com/questions/20348093/mongodb-aggregation-how-to-get-total-records-count
    const page = parseInt(req.query.page || 0);
    const {username} = req.query;
    try{    
        let pages = await Tweet.getDocCount();
        let posts_arr = await Tweet.getAllTweetsPaginated(page, PAGE_SIZE);
        
        let followings_arr = await People.followingsOf(username);
        for(let i = 0 ; i < followings_arr.length ; i++)
            followings_arr[i] = followings_arr[i].follower;
        
        let followings = new Set(followings_arr);
        for(let i = 0 ; i < posts_arr.length; i++){
            if(followings.has(posts_arr[i].username) || posts_arr[i].username === username)
                continue;    
            posts_arr[i].not_following = true;
        }
        return res.json({pages:Math.ceil(pages/PAGE_SIZE), posts: posts_arr, msg: `tweets for page-${req.query.page} fetched sucessfully`, success: 1});
    }catch(err){
        console.log(err);
        return res.json({msg: `Error while fetching tweets for page-${req.query.page}. (B-tweetController)`, toastColor: "#c62828 red darken-3"});
    }
}

module.exports.getUserTweets = async (req, res) => {
    const page = parseInt(req.query.page || 0);
    const username = req.query.username;
    try{    
        if(!username)
            throw new Error('Could not find the username!')
        let pages = await Tweet.getDocCount(username);
        let posts_arr = await Tweet.getUserTweetsPaginated(username, page, PAGE_SIZE);
        return res.json({pages:Math.ceil(pages/PAGE_SIZE), posts: posts_arr, msg: `${req.body.username}'s tweet fetched sucessfully`, success: 1});
    }catch(err) {
        console.log(err);
        res.json({msg: `Error while fetching tweet.(B-tweetController)`, toastColor: "#c62828 red darken-3"})
    };
}

module.exports.postTweet = (req, res) => {
    const {username, tweet, profile_pic_url, tweet_pic_url} = req.body;
                                                    //as we don't provide feature for updating profile pic, this apprach
                                                    //of adding the pro pic with tweet is better. But when providing featuer to update the url,change the approach as described in imporvements doc. 
    // console.log(username + tweet);
    if(!username || !tweet)
        return res.json({msg: `Required feilds missing`, toastColor: "#c62828 red darken-3"});

    Tweet.postTweet(username, tweet, profile_pic_url, tweet_pic_url)
    .then(() => res.json({msg: `Tweet posted sucessfully`, toastColor: "#43a047 green darken-1", success: 1}))
    .catch(err => res.json({msg: `error while fetching ${username}'s  (B-tweetContoller)`, toastColor: "#c62828 red darken-3"}));
}

module.exports.patchTweet = (req, res) => {
    const {tweet_id, tweet} = req.body;
    // console.log(tweet_id + tweet);
    
    if(!tweet)
        return res.json({msg: `Could not fetch the edited tweet. Failed to save Permanently`, toastColor: "#c62828 red darken-3"});

    Tweet.patchTweet(new ObjectId(tweet_id), tweet)
    .then(() => res.json({msg: `Tweet edit Saved Permanently`, toastColor: "#43a047 green darken-1", success: 1}))
    .catch(err => res.json({msg: `error while editing ${username}'s tweet (B-tweetContoller)`, toastColor: "#c62828 red darken-3"}));
}