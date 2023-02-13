var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

const {isLoggedIn, isLoggedOut, isCollectionOwner, isNftCreator} = require('../middleware/route-guard')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('nfts/all-nfts');
});

router.get('/:id/:number', function(req, res, next) {
    Nft.findById(req.params.id)
    .populate('owner')
    .populate('fromCollection')
    .then((foundNft) => {
      res.render('nfts/nft-details', {
        foundNft,
        userInSession: req.session.currentUser
      });
    })
    .catch((err) => {
      console.log(err);
    })
});

//

router.get('/:id/:number/remove',isNftCreator, (req,res) => {

  Nft.findById(req.params.id)
  .then((foundNft) => {
    Collection.findByIdAndUpdate(foundNft.fromCollection, {
      $pull: {items: foundNft._id},
      $inc: {size: -1}
    }, {new: true})
    .then((updatedCollection) => {
      //console.log(updatedCollection);
    })
    .catch((err) => {
      console.log(err);
    })
    return foundNft;
  })
  .then((foundNft) => {
    //console.log('found NFT before delete:', foundNft);
    Nft.findByIdAndDelete(req.params.id)
    .then((confirmation) => {
      //console.log('Confirmation log:', confirmation);
      res.redirect(`/collection/${foundNft.fromCollection}`)
    })
    .catch((err) => {
      console.log(err);
    })
  })
  .catch((err) => {
    console.log(err);
  })
});

module.exports = router;