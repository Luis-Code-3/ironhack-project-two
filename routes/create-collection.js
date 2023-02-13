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

router.post('/', (req,res) => {

  const {collectionName, description, nftName, size, price, blockchain, logoUrl, backgroundHeader, nftImage} = req.body;

  if (!collectionName || !description || !nftName || !size || !price || !blockchain || !logoUrl || !backgroundHeader || !nftImage) {
    res.render('collections/create-collection', {errorMessage: "All Fields are Required."})
    return;
  }

  Collection.create({
    collectionName,
    owner: req.session.currentUser._id,
    size,
    logoUrl,
    backgroundHeader,
    description,
    blockchain
  })
  .then((createdCollection) => {
    for(let i = 1; i <= size; i++) {
      Nft.create({
        owner: createdCollection.owner,
        fromCollection: createdCollection._id,
        nftName,
        numberId: i,
        imageUrl: nftImage,
        price,
        blockchain
      })
      .then((createdNft) => {
        return Collection.findByIdAndUpdate(createdCollection._id, {
          $push: {items: createdNft._id}
        }, {new: true})
      })
      .catch((err) => {
        console.log(err);
      })
    }
    return createdCollection;
  })
  .then((newCollection) => {
    return User.findByIdAndUpdate(newCollection.owner, {
      $push: {collections: newCollection._id}
    }, {new: true})
    // .then((updatedUser) => {
    //   console.log(updatedUser);
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
  })
  .then((updatedUser) => {
    console.log(updatedUser);
    res.redirect('/')
  })
  .catch((err) => {
    console.log(err);
  })

})

module.exports = router;
// Create HBS
// collectionName
// description
// nftName
// size
// price
// blockchain
// logoUrl
// backgroundHeader
// nftImage

// collectionSchema
// name
// owner
// size
// logoUrl
// backgroundHeader
// description
// blockchain
// items

// nftSchema
// owner
// fromCollection
// nftName
// numberId
// imageUrl
// price
// blockchain
