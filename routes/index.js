var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var bcryptjs = require('bcryptjs');
const saltRounds = 10;

const {isLoggedIn, isLoggedOut} = require('../middleware/route-guard')


const User = require('../models/User.model');
const Collection = require('../models/Collection.model');
const Nft = require('../models/Nft.model');

/* GET home page. */
router.get('/', async function(req, res, next) {

  try {
    const allCollectionsArray = await Collection.find().limit(8)
    const allNftsArray = await Nft.find().limit(12)
    res.render('index', {
      userInSession: req.session.currentUser,
      allNfts: allNftsArray,
      allCollections: allCollectionsArray
    });
  } catch (err) {
    console.log(err);
  }
});

//

router.get('/signup',isLoggedOut, function(req, res, next) {
  res.render('user/signup');
});

router.post('/signup',isLoggedOut, (req,res) => {

  const { username, email, password } = req.body;

  if(!username || !email || !password) {
    res.render('user/signup', {errorMessage: "All Fields are Required."});
    return;
  }

  bcryptjs
  .genSalt(saltRounds)
  .then((salt) => {
    return bcryptjs.hash(password, salt);
  })
  .then((hashedPassword) => {
    return User.create({
      username,
      email,
      password: hashedPassword,
      ethereumBalance: 10
    });
  })
  .then((newUser) => {
    console.log(`Created New User: ${newUser}`);
    res.redirect('/login')
  })
  .catch((err) => {
    //what is this thing here?
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(500).render('user/signup', { errorMessage: err.message });
    } else if (err.keyPattern.hasOwnProperty('email')) {
      res.status(500).render('user/signup', {errorMessage: "Email is already in use. Try Again"})
    } else if (err.keyPattern.hasOwnProperty('username')) {
      res.status(500).render('user/signup', {errorMessage: "Username is already in use. Try Again"})
    } else {
      console.log(err)
    }
  })

})

//

router.get('/login',isLoggedOut, function(req, res, next) {
  res.render('user/login');
});

router.post('/login',isLoggedOut, (req,res) => {
  
  const { username, password } = req.body;

  if(!username || !password) {
    res.render('user/login', {errorMessage: "Please enter both username and password to login."});
    return;
  }

  User.findOne({username})
  .then((foundUser) => {
    if(!foundUser) {
      res.render('user/login', {errorMessage: "Username is not registered. Try Again"});
      return;
    } else if(bcryptjs.compareSync(password, foundUser.password)) {
      //console.log(req.session);
      req.session.currentUser = foundUser;
      console.log(req.session);
      res.redirect('/');
    } else {
      res.render('user/login', {errorMessage: "Password is incorrect. Try Again"})
    }
  })
  .catch((err) => {
    console.log(err);
  })

})

//

router.get('/logout',isLoggedIn, function(req, res, next) {
  req.session.destroy((err) => {
    if(err) {
      console.log(err);
    }
    res.redirect('/')
  })
});

//

router.get('/add-balance', (req,res) => {

  User.findById(req.session.currentUser._id)
  .then((foundUser) => {
    res.render('user/addBalanceProfile', {
      foundUser,
      userInSession: req.session.currentUser
    })
  })
  .catch((err) => {
    console.log(err);
  })
})

router.post('/add-balance', (req,res) => {

  const {balanceAdd} = req.body;

  User.findByIdAndUpdate(req.session.currentUser._id, {
    $inc: {ethereumBalance: balanceAdd}
  }, {new: true})
  .then((updatedUser) => {
    console.log(updatedUser);
    res.redirect(`/profile`)
  })
  .catch((err) => {
    console.log(err);
  })

})


module.exports = router;
