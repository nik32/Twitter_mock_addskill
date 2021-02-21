
const router = require('express').Router();

const authContoller = require('../controllers/auth');

// router.get("/signout", isAuth, 
//             (req, res) => req.session.destroy( err => {
//                 if(err) 
//                     return next();
//                 return res.redirect("/signin"); 
//             }),
// );

router.post("/api/addUser", authContoller.addUser);

router.post("/api/authenticate", authContoller.authenticate);


module.exports = router;