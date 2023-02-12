var express = require('express');
var router = express.Router();

const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard')

const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {
  res.render('collections/create-collection', {userInSession: req.session.currentUser});
});

module.exports = router;