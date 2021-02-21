const getDbRef = require('../database/dbConnection').getDbRef;

module.exports = class Tweet {

    static getDocCount(username){
        const db = getDbRef();
        const query = username ? {username} : {} ;
        return db.collection('tweets').find(query).count();
    }

    static getAllTweetsPaginated(page, PAGE_SIZE){
        const db = getDbRef();
        const tweets_to_skip = page * PAGE_SIZE;
        //TO-DO - MAKE date_time & username field INDEX for better sorting
        return db.collection('tweets').find({}).sort({date_time: -1}).limit(PAGE_SIZE).skip(tweets_to_skip).toArray();
    }

    static getUserTweetsPaginated(username, page, PAGE_SIZE){
        const db = getDbRef();
        const tweets_to_skip = page * PAGE_SIZE;
        return db.collection('tweets').find({username}).sort({date_time: -1}).limit(PAGE_SIZE).skip(tweets_to_skip).toArray();
    }
    
    static postTweet(username, tweet, profile_pic_url, tweet_pic_url){
        const date_time = new Date();//CHECK - if this converts to ISO DATE TIME for correct sorting results
        const db = getDbRef();
        return db.collection('tweets').insertOne(
            {
                tweet : tweet,
                username : username,
                profile_pic_url,//as we don't provide feature for updating profile pic, this apprach
                                //of adding the propic with tweet is better. But when providing featuer to update the url,change the approach as described in imporvements doc.
                tweet_pic_url, 
                date_time
            });
    }

    static patchTweet(_id, tweet){
        //const date_time = new Date();//CHECK - if this converts to ISO DATE TIME for correct sorting results
        const db = getDbRef();
        return db.collection('tweets').updateOne({_id}, {$set:{tweet}});
    }
}