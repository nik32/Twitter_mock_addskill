const getDbRef = require('../database/dbConnection').getDbRef;

module.exports = class People {

    static getPeople(username){
        const db = getDbRef();
        return db.collection('people')
                .find( { $or: [ { follower: username }, { followee: username } ] } )
                .toArray();
    }

    static followingsOf(username){
        const db = getDbRef();
        return db.collection('people').find({followee: username}).toArray();
    }

    static follow(followee, follower, pics){
        const db = getDbRef();
        return db.collection('people').insertOne({followee, follower, pics});
    }

    // static unfollowPerson(followee, follower){
    //     const db = getDbRef();
    //     return db.collection('people')
    //              .deleteOne({ $and: [ { follower }, { followee } ] });
    // }
}