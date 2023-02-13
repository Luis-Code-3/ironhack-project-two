var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

/* GET users listing. */
router.get('/:id/:name', function(req, res, next) {

  User.findById(req.params.id)
  .populate('collections')
  .then((foundUser) => {
    console.log(foundUser);
    res.render('user/user', {
      user: foundUser,
      userInSession: req.session.currentUser
    });
  })
  .catch((err) => {
    console.log(err);
  })

});

module.exports = router;
