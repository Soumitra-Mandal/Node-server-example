var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/mydata.db');
const cache = require("memory-cache");

/* GET users listing. */
router.get('/', function (req, res, next) {
  // Check if the user is logged in
  if (req.session && req.session.isLoggedIn) {
    if(!req.session.isAdmin) {
      return res.send('<h2>User does not have admin rights</h2>')
    }
    const key = req.originalUrl || req.url
    const cacheBody = cache.get(key);
    // Retrieve users from the database
    if (cacheBody) {
      res.setHeader('X-Cache', 'MISS');
      console.log(res.getHeader('X-Cache'));
      return res.json(cacheBody);
    } else {
      db.all('SELECT * FROM users', (err, data) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        } else {
          res.sendResponse = res.json;
          res.json = (body) => {
            cache.put(key, body, 10 * 60 * 1000);
            res.setHeader('X-Cache', 'HIT');
            console.log(res.getHeader('X-Cache'));
            res.sendResponse(body);
          };
          return res.sendResponse(data);
        }
      });
    }
  } else {
    // User is not logged in, render the login page
    return res.render('login', { error: 'Please log in to access users' });
  }
});

/* GET user by ID. */
router.get('/:id', (req, res, next) => {
  if (req.session.isLoggedIn) {
    var id = req.params.id;
    const key = `/users/${id}`;
    const cacheBody = cache.get(key);
    if (cacheBody) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cacheBody);
    } else {
      db.get(`SELECT * from users where id=${id}`, (err, data) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        // Cache the result for future requests
        cache.put(key, data, 10 * 60 * 1000); // Cache for 10 minutes
        res.setHeader('X-Cache', 'MISS');
        return res.json(data);
      });
    }
  } else {
    return res.render('login', { error: 'Please Login to access users' });
  }
});

module.exports = router;
