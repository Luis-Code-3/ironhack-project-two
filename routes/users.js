var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

/* GET users listing. */
router.get('/:id/:name', function(req, res, next) {
  res.render('user/user');
});

module.exports = router;