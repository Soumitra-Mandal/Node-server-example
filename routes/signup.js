var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/auth.db');
var error
router.get('/', (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect("/users");
    }
    error = false;
    res.render('signup', { error });
});

router.post('/', async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var isAdmin = req.body.isAdmin; // Assuming isAdmin is a boolean

    // Convert boolean to 0 or 1 for SQLite
    var isAdminValue = isAdmin === "on" ? 1 : 0;
    // Hash password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Assuming you have a SQLite database connection named 'db'
    db.run(
        'INSERT INTO auth (name, password, isAdmin) VALUES (?, ?, ?)',
        [username, hashedPassword, isAdminValue],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.json({
                message: 'User added successfully',
                id: this.lastID
            });
        }
    );
});

module.exports = router;