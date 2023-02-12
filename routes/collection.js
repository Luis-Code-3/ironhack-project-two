var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('collections/all-collections', {userInSession: req.session.currentUser});
});

router.get('/:id', function(req, res, next) {
    res.render('collections/collection-details');
  });

module.exports = router;