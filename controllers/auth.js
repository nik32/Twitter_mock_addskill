const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {jwt_secret_key} = require('../config/keys');


module.exports.addUser = (req, res) => {

    //NOTE 1 - I am going with the assumption here that a user can have same emails for different usernames so that he gets mail forwarded to same id for diffrent accounts (this can happen if a family uses one email account). 
    //But if otherwise reqired, then add a validation here to check if the email is already there in the DB
    
    //NOTE 2 - Uniquness of user id is maintined on the DB layer. We have set a unique index on the username feild, so any attempt to enter duplicate usernames will result in error (handled in catch block of the promise)
    const {first, last, password, phone, email, username, profile_pic_url} = req.body;

    /*So the promise flow is (read comments in line to understand) -
      First we call the bycrpt method to hash our password. This method is promise based method.*/
    bycrypt.hash(password, 12)//[Note: 12 - specefies the rounds of encryption applied. The higher the value the better it is. 12 is considered secure industry wide]
    .then(hashedPassword => {
        //untill we don't get the hashed password we can't create a user. That is why the below 
        //code (of registering the user is tranferred to this first then block).
        const userObj = new User(first, last, hashedPassword, phone, email, username, profile_pic_url);
        return userObj.save();//Now this will save the created user obj in our DB, but if you see this method is also promise based.
                              //It will return whether we were sucessfull in saving the user or not.
                              //So it can either give a resolved promise (whihc will be handled by the next then() block)
                              //Or it can give us a rejected promise (whihc will be handled by the catch block instead)
    })
    .then(() => res.json({msg :"Registerd Successfully.", toastColor: "#43a047 green darken-1", success: 1}))//toastColor - green for sucess & red for failiure
    .catch(err => {//can get here in 2 situations - if there was an error while hashing the password or the username inputed already exists
        console.log(err);
        res.json({msg :"Failed to Register (B-auth_cont-addUser).", toastColor: "#c62828 red darken-3"});
    });
}

module.exports.authenticate =  async (req, res) => {
    const {username, password} = req.body;
    try {
        let user = await User.findByUsername(username);//Now here either we will get a resolved promise with user obj(handled by first then handler) or rejected promise with an error (handled by the catch handler)
        const passwordsMatch = user ? await bycrypt.compare(password, user.password) : false;//if we get a resolved promise, we compare the hased password with password entered in the form. If the password is matched or failed, we get a resolved promise with the boolean (indicating match or not). If we get an error while comparing, we get rejected promise, again handled by the catch 
        if(passwordsMatch) { //if passowrds matched we store the username in the session and redirect to home
            const token = jwt.sign({_username: username}, jwt_secret_key);
            user = {username: user.username, first:user.first, last:user.last, _id:user._id, profile_pic_url:user.profile_pic_url};
            res.json({msg :"Logged in Successfully", token, user, toastColor: "#43a047 green darken-1", success: 1});//the last param in js is ES6 featuer where token:token (inside an obj) can simply be written as token
        }
        else
            res.json({msg: "The email/password did not match", toastColor: "#c62828 red darken-3"});
    }catch(err){//can get here in 2 situations - either we don't have a user with the username or if we get an "error" while comparing passwords
        console.log("an error occured while comparing the passwords\n" + err);
        res.json({msg: "An error occured while comparing the passwords (B-auth_cont-auth)", toastColor: "#c62828 red darken-3"});
    };
}
