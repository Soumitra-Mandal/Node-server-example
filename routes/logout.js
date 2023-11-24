var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    req.session.isLoggedIn = false
    res.render("login", { error: "You have been logged out. Login to continue" })

});

module.exports = router;
