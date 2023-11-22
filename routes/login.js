var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/auth.db');
var error
router.get('/', (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect("/users");
    }
    error = false;
    res.render('login', { error });
});

router.post('/', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    db.get('SELECT * FROM users_auth WHERE name = ?', [username], (err, user) => {
        if (err) {
            return res.render("login", { error: err });
        }
        if (user == null) {
            return res.render("login", { error: "User does not exist" });
        }
        if (user.password === password) {
            req.session.isLoggedIn = true;
            return res.redirect("/users");
        }

        return res.render("login", { error: "Wrong Password" });
    });
});
module.exports = router;
