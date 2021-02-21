const getDbRef = require('../database/dbConnection').getDbRef;


module.exports = class User {

    /*AUTH RELATED API - start*/
    constructor(first, last, password, phone, email, username, profile_pic_url){
        this.first = first;
        this.last = last;
        this.password = password;
        this.phone = phone;
        this.email = email;
        this.username = username;
        this.profile_pic_url = profile_pic_url;
        this.followers = [];
        this.following = [];
    }

    save(){
        const db = getDbRef();
        return db.collection('user').insertOne(this);
    }

    static findByUsername(username){
        const db = getDbRef();
        return db.collection('user').findOne({username});
    }
    /*End*/
}