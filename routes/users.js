var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

/* GET users listing. */
router.get('/:id/:name', function(req, res, next) {

  User.findById(req.params.id)
  .populate('collections')
  .populate('itemsOwned')
  .then((foundUser) => {
    console.log(foundUser);
    const limitedNfts = foundUser.itemsOwned.slice(0, 8);
    const limitedCollections = foundUser.collections.slice(0, 4);
    res.render('user/user', {
      user: foundUser,
      userInSession: req.session.currentUser,
      limitedNfts,
      limitedCollections
    });
  })
  .catch((err) => {
    console.log(err);
  })

});

router.get('/:id/:name/collections', function(req, res, next) {

  User.findById(req.params.id)
  .populate('collections')
  .populate({
    path: "collections",
    populate: {path: "items"}
  })
  .then((foundUser) => {
    console.log("FOUND USER HERE:",foundUser);
    res.render('user/userCollections', {
      user: foundUser,
      userInSession: req.session.currentUser
    });
  })
  .catch((err) => {
    console.log(err);
  })

});

router.get('/:id/:name/nfts', function(req, res, next) {

  User.findById(req.params.id)
  .populate('itemsOwned')
  .then((foundUser) => {
    console.log(foundUser);
    res.render('user/userNfts', {
      user: foundUser,
      userInSession: req.session.currentUser
    });
  })
  .catch((err) => {
    console.log(err);
  })

});

module.exports = router;
