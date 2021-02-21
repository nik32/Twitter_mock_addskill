
const express = require('express');
// var cors = require('cors');

const connectToDb = require('./database/dbConnection').connect;
const authRoutes = require('./routes/auth');
const tweetRoutes = require('./routes/tweet');
const peopleRoutes = require('./routes/people');

const app = express();
const PORT = process.env.PORT || 5000; //if we will be in prod env then the first one will give the port number provided by our server. Else we will get 5000

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
 

app.use(authRoutes);
app.use(tweetRoutes);
app.use(peopleRoutes);


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    });
}


connectToDb(() => {
    app.listen(PORT);
    console.log("listening on 5000");
});
