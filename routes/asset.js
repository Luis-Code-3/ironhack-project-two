var express = require('express');
var router = express.Router();

const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('nfts/all-nfts');
});

router.get('/:id/:number', function(req, res, next) {
    Nft.findById(req.params.id)
    .populate('owner')
    .populate('fromCollection')
    .then((foundNft) => {
      res.render('nfts/nft-details', foundNft);
    })
    .catch((err) => {
      console.log(err);
    })
});

//

router.post('/:id/:number/remove', (req,res) => {

});

module.exports = router;