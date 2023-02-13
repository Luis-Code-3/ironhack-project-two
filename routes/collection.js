var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

/* GET home page. */
router.get('/', function(req, res, next) {

  Collection.find()
  .populate('items')
  .then((allCollections) => {
    console.log(allCollections);
    res.render('collections/all-collections', {allCollections});
  })
  .catch((err) => {
    console.log(err);
  })




});

//

router.get('/:id', function(req, res, next) {

  Collection.findById(req.params.id)
  .populate('owner')
  .populate('items')
  .then((foundCollection) => {
    //console.log(foundCollection);
    res.render('collections/collection-details', foundCollection);
  })
  .catch((err) => {
    console.log(err);
  })
});

//

router.get('/:id/add-nft', (req,res) => {
  res.render('nfts/add-nft',{collectionId: req.params.id})
});

router.post('/:id/add-nft', (req,res) => {

  const {imageUrl, price} = req.body;

  Collection.findById(req.params.id)
  .populate('items')
  .then((foundCollection) => {
    Nft.create({
      owner: foundCollection.owner,
      fromCollection: foundCollection._id,
      nftName: foundCollection.items[0].nftName,
      numberId: foundCollection.size + 1,
      imageUrl,
      price,
      blockchain: foundCollection.blockchain
    })
    .then((createdNft) => {
      return Collection.findByIdAndUpdate(createdNft.fromCollection, {
        $push: {items: createdNft._id},
        $inc: {size: 1}
      }, {new: true})
    })
    .then((updatedCollection) => {
      res.redirect(`/collection/${updatedCollection._id}`)
    })
    .catch((err) => {
      console.log(err);
    })
  })
  .catch((err) => {
    console.log(err);
  })
  
});

//

router.post('/:id/delete-collection', (req,res) => {

});

//

router.get('/:id/edit-details', (req,res) => {

  Collection.findById(req.params.id)
  .then((foundCollection) => {
    res.render('collections/edit-collection', foundCollection)
  })
  .catch((err) => {
    console.log(err);
  })

});

router.post('/:id/edit-details', (req,res) => {
  
  const {collectionName, description, logoUrl, backgroundHeader} = req.body;

  Collection.findByIdAndUpdate(req.params.id, {
    collectionName,
    description,
    logoUrl,
    backgroundHeader
  }, {new: true})
  .then((updatedCollection) => {
    console.log(updatedCollection);
    res.redirect(`/collection/${updatedCollection._id}`)
  })
  .catch((err) => {
    console.log(err);
  })

});

module.exports = router;
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

