const jwt = require('jsonwebtoken');

const {jwt_secret_key} = require('./config/keys');
const User = require('./models/user.js');

module.exports = (req, res, next) =>{
    const {authorization} = req.headers;
    if(!authorization)
        return res.json({msg: "Not authorized to access this route. Log in First. (B-autmiddleware)", toastColor: "#c62828 red darken-3"});
    
    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, jwt_secret_key, (err, payload) => {
        if(err)
            return res.json({msg: "An error occured while verifying credentials. Try again later (B-autmiddleware)", toastColor: "#c62828 red darken-3"});

        //DON'T STORE THE USER DATA HERE if the condition part (!req.use.user_data) is not working.
        //Instead store the data on frontend so that you don't make db call on each request
        const {_username} = payload;
        if(!req.body.username){     //CHECK - done from your side. Check if causes any issue. 
            User.findByUsername(_username)
            .then(user_data => {
                req.body = {...req.body, ...user_data};
                return next() //BEWARE! this next should come here only. To save from getting user_data undefined later
            })
            .catch(() => res.json({msg: "an error occured while fetching user data. (B-autmiddleware)", toastColor: "#c62828 red darken-3"}));
        }
        else
            return next();//BEWARE - this code should come in else block if the above if condition is used
    })
}