const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model')

const isLoggedIn = (req,res,next) => {
    if(!req.session.currentUser) {
        return res.redirect('/login')
    }
    next();
}

const isLoggedOut = (req,res,next) => {
    if(req.session.currentUser) {
        return res.redirect('/')
    }
    next();
}

const isCollectionOwner = (req,res,next) => {
    Collection.findById(req.params.id)
    .populate('items')
    .then((foundCollection) => {
        if(!req.session.currentUser || req.session.currentUser._id != foundCollection.owner) {
            // res.render('collections/collection-details', {
            //     errorMessage: 'You are not authorized.',
            //     foundCollection
            // })
            res.redirect(`/collection/${foundCollection._id}`)
        } else {
            next();
        }
    })
    .catch((err) => {
        console.log(err);
    })
}

const isNftCreator = (req,res,next) => {
    Nft.findById(req.params.id)
    .populate('fromCollection')
    .then((foundNft) => {
        if(!req.session.currentUser || req.session.currentUser._id != foundNft.fromCollection.owner) {
            // res.render('collections/collection-details', {
            //     errorMessage: 'You are not authorized.',
            //     foundCollection: foundNft.fromCollection
            // })
            res.redirect(`/collection/${foundNft.fromCollection._id}`)
        } else {
            next();
        }
    })
}


module.exports = {
    isLoggedIn,
    isLoggedOut,
    isCollectionOwner,
    isNftCreator
}