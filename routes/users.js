var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/mydata.db');

/* GET users listing. */
router.get('/', function (req, res, next) {
  // Check if the user is logged in
  if (req.session && req.session.isLoggedIn) {
    // Retrieve users from the database
    db.all('SELECT * FROM users', (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(data);
      }
    });
  } else {
    // User is not logged in, render the login page
    res.render('login', { error: 'Please log in to access users' });
  }
});

router.get('/:id', (req, res, next) => {
  if (req.session.isLoggedIn) {
    var id = req.params.id
    db.get(`SELECT * from users where id=${id}`, (err, data)=>{
      if(err) {
        res.status(500).json({ error: err.message });
      }
      res.json(data)
    });
  }
  else res.render("login", { error: "Please Login to access users" })
});
module.exports = router;
