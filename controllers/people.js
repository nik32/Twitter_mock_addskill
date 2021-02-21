const People = require('../models/people');

module.exports.getPeople = async (req, res) => {

    const username = req.query.username;
    // console.log(username);
    if(!username)
        return res.json({msg: `Required feilds missing (B-getPeople-cont)`, toastColor: "#c62828 red darken-3"});

    People.getPeople(username)
    .then((people) => res.json({people, msg: `People for ${username} fetched sucessfully`, success: 1}))
    .catch(err => {
        console.log(err);
        res.json({msg: `Error while fetching poeple in your network (B-getPeople-cont)`, toastColor: "#c62828 red darken-3"})
    });
}

// module.exports.followingsOf = async (req, res) => {

//     const {username} = req.query;
//     // console.log(username);
//     if(!username)
//         return res.json({msg: `Required feilds missing (B-followingsOf-cont)`, toastColor: "#c62828 red darken-3"});

//     People.followingsOf(username)
//     .then((people) => res.json({people, msg: `Followings of ${username} fetched sucessfully`, success: 1}))
//     .catch(err => {
//         console.log(err);
//         res.json({msg: `Error while fetching list of people you follow (B-followingsOf-cont)`, toastColor: "#c62828 red darken-3"})
//     });
// }

module.exports.follow = (req, res) => {

    const {followee, follower} = req.body;
    const pics = {...req.body.pics};
    // console.log(followee + follower);
    if(!followee || !follower)
        return res.json({msg: `Required feilds missing (B-addFollower-cont)`, toastColor: "#c62828 red darken-3"});

    People.follow(followee, follower, pics)
    .then(() => res.json({msg: `You are now following ${follower}`, toastColor: "#43a047 green darken-1", success: 1}))
    .catch(err => {
        console.log(err);
        res.json({msg: `Error while adding ${follower} to your network (B-addFollower-cont)`, toastColor: "#c62828 red darken-3"})
    });
}