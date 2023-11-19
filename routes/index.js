var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Homepage',
    isLoggedIn: req.session.isLoggedIn
  });
});

module.exports = router;
