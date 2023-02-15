var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

const {isLoggedIn, isLoggedOut, isCollectionOwner, isNftCreator, checkBalance} = require('../middleware/route-guard')

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

router.post('/:id/:number/sell', (req,res) => {
  const {price} = req.body;

  Nft.findByIdAndUpdate(req.params.id, {
    price,
    forSale: true
  }, {new: true})
  .then((updatedNft) => {
    console.log("Listed and Price Adjusted", updatedNft);
    res.redirect(`/asset/${updatedNft._id}/${updatedNft.numberId}`)
  })
  .catch((err) => {
    console.log(err);
  })
})

router.get('/:id/:number/buy',isLoggedIn,checkBalance, (req,res) => {

  Nft.findById(req.params.id)
  .then((foundNft) => {
    User.findByIdAndUpdate(foundNft.owner, {
      $pull: {itemsOwned: foundNft._id},
      $inc: {ethereumBalance: foundNft.price}
    }, {new: true})
    .then((updatedSeller) => {
      console.log("Updated Seller After Item Sold:", updatedSeller);
    })
    .catch((err) => {
      console.log(err);
    })
    return foundNft;
  })
  .then((foundNft) => {
    User.findByIdAndUpdate(req.session.currentUser._id, {
      $push: {itemsOwned: foundNft._id},
      $inc: {ethereumBalance: -(foundNft.price)}
    }, {new: true})
    .then((updatedBuyer) => {
      console.log("Updated Buyer After Item Bought:", updatedBuyer);
    })
    .catch((err) => {
      console.log(err);
    })
    return foundNft;
  })
  .then((foundNft) => {
    Nft.findByIdAndUpdate(req.params.id, {
      owner: req.session.currentUser._id,
      $set: {forSale: false}
    }, {new: true})
    .then((updatedNft) => {
      console.log("Updated NFT After Sale:", updatedNft);
      res.redirect(`/asset/${req.params.id}/${req.params.number}`)
    })
  })
  .catch((err) => {
    console.log(err);
  })

  // Nft.findByIdAndUpdate(req.params.id, {

  // }, {new: true})
})

module.exports = router;