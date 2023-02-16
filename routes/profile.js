var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard')


const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');



router.get('/',isLoggedIn, function(req, res, next) {

    User.findById(req.session.currentUser._id)
    .populate('collections')
    .populate('itemsOwned')
    .then((foundUser) => {
      console.log(foundUser);
      res.render('user/profile', {
        profileUser: foundUser,
        userInSession: req.session.currentUser
      });
    })
    .catch((err) => {
      console.log(err);
    })
  
});

router.get('/nfts', (req,res) => {
    User.findById(req.session.currentUser._id)
    .populate('itemsOwned')
    .then((foundUser) => {
      console.log(foundUser);
      res.render('user/profileNfts', {
        profileUser: foundUser,
        userInSession: req.session.currentUser
      });
    })
    .catch((err) => {
      console.log(err);
    })
})

router.get('/collections', (req,res) => {
    User.findById(req.session.currentUser._id)
    .populate('collections')
    .populate({
        path: "collections",
        populate: {path: "items"}
      })
    .then((foundUser) => {
      console.log(foundUser);
      res.render('user/profileCollections', {
        profileUser: foundUser,
        userInSession: req.session.currentUser
      });
    })
    .catch((err) => {
      console.log(err);
    })
})











module.exports = router;