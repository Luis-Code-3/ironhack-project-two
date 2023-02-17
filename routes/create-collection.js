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

  const {collectionName, description, nftName, size, price, blockchain, logoUrl, backgroundHeader, nftImage, nftImageTwo, nftImageThree, nftImageFour, nftImageFive} = req.body;

  if (!collectionName || !description || !nftName || !size || !price || !blockchain || !logoUrl || !backgroundHeader || !nftImage) {
    res.render('collections/create-collection', {
      errorMessage: "Must Provide Required Fields.",
      userInSession: req.session.currentUser
    })
    return;
  }

  let imageArray = [nftImage,nftImageTwo,nftImageThree,nftImageFour,nftImageFive];
  const sortArray = imageArray.filter((el) => {
    return Boolean(el);
  })

  console.log(sortArray);
  console.log('RANDOM IMAGE:',sortArray[Math.floor(Math.random() * sortArray.length)])

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
        imageUrl: sortArray[Math.floor(Math.random() * sortArray.length)],
        price,
        blockchain,
        forSale: true
      })
      .then((createdNft) => {
        Collection.findByIdAndUpdate(createdCollection._id, {
          $push: {items: createdNft._id}
        }, {new: true})
        .then((updatedCollection) => {
          console.log(updatedCollection);
        })
        .catch((err) => {
          console.log(err);
        })
        return createdNft;
      })
      .then((createdNft) => {
        User.findByIdAndUpdate(createdCollection.owner, {
          $push: {itemsOwned: createdNft._id}
        })
        .then((foundUser) => {
          console.log(foundUser);
        })
        .catch((err) => {
          console.log(err);
        })
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
