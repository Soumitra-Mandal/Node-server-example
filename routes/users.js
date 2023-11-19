var express = require('express');
var router = express.Router();
var users = [
  { "id": "1", "name": "Mary" },
  { "id": "2", "name": "John" },
  { "id": "3", "name": "Emily" },
  { "id": "4", "name": "Alex" },
  { "id": "5", "name": "Jessica" }
]

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.isLoggedIn) {
    res.json(users)
  }
  else res.render("login", { error: "Please Login to access users" })

});

router.get('/:id', (req, res, next) => {
  if (req.session.isLoggedIn) {
    var id = req.params.id
    var user = users.find(user => user.id === id)
    if (user) {
      res.json(user)
    }
    res.send(`<b>Could not find user with id ${id}`)
  }
  else res.render("login", { error: "Please Login to access users" })

});
module.exports = router;
