var express = require('express');
var router = express.Router();


const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup', function(req, res, next) {
  res.render('user/signup');
});

router.get('/login', function(req, res, next) {
  res.render('user/login');
});

router.get('/profile', function(req, res, next) {
  res.render('user/profile');
});

module.exports = router;
