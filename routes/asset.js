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

      // if(foundNft.forSale === false && foundNft.owner._id == req.session.currentUser._id) {
      //   res.render('nfts/nft-details', {
      //     foundNft,
      //     userInSession: req.session.currentUser,
      //     NotForSale: "Not for sale",
      //     isNftOwner: "I am owner"
      //   });
      // } else if(!req.session.currentUser || foundNft.owner._id != req.session.currentUser._id) {
      //   res.render('nfts/nft-details', {
      //     foundNft,
      //     userInSession: req.session.currentUser
      //   });
      //   // console.log("Error lol");
      //   // console.log("Current User:",req.session.currentUser);
      //   // console.log("Found Collection Owner:",foundCollection.owner);
      //   // console.log("Current User Id:",req.session.currentUser._id);
      // } else {
      //   res.render('nfts/nft-details', {
      //     foundNft,
      //     userInSession: req.session.currentUser,
      //     isNftOwner: "I am owner"
      //   });
      // }


      if(!req.session.currentUser && foundNft.forSale === false) {
        res.render('nfts/nft-details', {
          foundNft,
          userInSession: req.session.currentUser,
          NotForSale: "Not for sale",
        });
      } else if (!req.session.currentUser && foundNft.forSale === true) {
        res.render('nfts/nft-details', {
          foundNft,
          userInSession: req.session.currentUser
        });
      } else if (foundNft.owner._id != req.session.currentUser._id && foundNft.forSale === false) {
        res.render('nfts/nft-details', {
          foundNft,
          userInSession: req.session.currentUser,
          NotForSale: "Not for sale",
        });
      } else if(foundNft.owner._id != req.session.currentUser._id && foundNft.forSale === true) {
        res.render('nfts/nft-details', {
          foundNft,
          userInSession: req.session.currentUser
        });
      } else if (foundNft.owner._id == req.session.currentUser._id && foundNft.forSale === false) {
        res.render('nfts/nft-details', {
          foundNft,
          userInSession: req.session.currentUser,
          NotForSale: "Not for sale",
          isNftOwner: "I am owner"
        });
      } else if (foundNft.owner._id == req.session.currentUser._id && foundNft.forSale === true) {
        res.render('nfts/nft-details', {
          foundNft,
          userInSession: req.session.currentUser,
          isNftOwner: "I am owner"
        });
      }


      





      // res.render('nfts/nft-details', {
      //   foundNft,
      //   userInSession: req.session.currentUser
      // });
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
    User.findByIdAndUpdate(foundNft.owner, {
      $pull: {itemsOwned: foundNft._id}
    }, {new: true})
    .then((foundUser) => {
      console.log("Updated User After Removal:", foundUser);
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


router.get('/:id/:number/unlist', (req,res) => {
  Nft.findByIdAndUpdate(req.params.id, {
    $set: {forSale: false}
  }, {new: true})
  .then((updatedNft) => {
    console.log(updatedNft);
    res.redirect(`/asset/${updatedNft._id}/${updatedNft.numberId}`)
  })
  .catch((err) => {
    console.log(err);
  })


})

module.exports = router;