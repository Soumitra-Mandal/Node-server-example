var express = require('express');
var router = express.Router();
var error
router.get('/', (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect("/users");
    }
    error = false;
    res.render('login', { error });
});
router.post('/', (req, res, next) => {
    var username = req.body.username
    var password = req.body.password
    if (username === "abc" && password === "pass") {
        req.session.isLoggedIn = true
        res.redirect("/users");
    }
    else {
        res.render("login", { error: "Invalid Username or Password" })
    }
});
module.exports = router;
