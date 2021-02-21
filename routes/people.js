const router = require('express').Router();

const peopleContoller = require('../controllers/people');
const isAuth = require('../RBACMiddleware');

//API related to fetching all the people realated to looged in user - for people tab/route in frontend
router.get("/api/people", peopleContoller.getPeople);

//API related to fetching all the people, the logged in user is following - for showing the follow icon/button on a tweet
// router.get("/api/followings", peopleContoller.followingsOf);

//API related to add a person to the logged in users network (i.e. allow user to follow a person) - when a person click the follow icon/button on a tweet
router.post("/api/follow", isAuth, peopleContoller.follow);


module.exports = router;