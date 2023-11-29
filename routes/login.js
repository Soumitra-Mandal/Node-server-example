var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('data/auth.db');
var error
router.get('/', (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect("/users");
    }
    error = false;
    res.render('login', { error });
});

router.post('/', async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    db.get('SELECT * FROM auth WHERE name = ?', [username], async (err, user) => {
        if (err) {
            return res.render("login", { error: err });
        }
        if (user == null) {
            return res.render("login", { error: "User does not exist" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            req.session.isLoggedIn = true;
            req.session.username = user.username
            req.session.isAdmin = user.isAdmin
            req.session.id = user.id
            if (user.isAdmin)
                return res.redirect("/users");
            else return res.redirect(`/users/${user.id}`)
        }

        return res.render("login", { error: "Wrong Password" });
    });
});
module.exports = router;
