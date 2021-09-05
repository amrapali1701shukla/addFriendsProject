var axios = require('axios');
const { name } = require('ejs');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var loacalStrategy = require('passport-local');
var userModel = require('./users');

passport.use(new loacalStrategy (userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register',function(req,res){
  var newUser = new userModel({
    username:req.body.username,
    name:req.body.name
  })
  userModel.register(newUser,req.body.password)
  .then(registeredUser =>{
    passport.authenticate('local')(req,res,function(){
    res.redirect('/profile'); 
    })
  })
});

router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/'
}),function(req,res,next){});

router.get('/profile',isLoggedIn,function(req,res){
  res.render('profile');
});

router.get('/show',isLoggedIn,function(req,res){
  axios.get('https://randomuser.me/api/?results=15')
  .then(function(a){
    var data = a.data.results;
    var val =data.map(c =>{
    var realdata = { name :c.name.first, username: c.login.username, password:c.login.password};
    var newUser = new userModel({
    username:realdata.username,
    name:realdata.name
    })
    userModel.register(newUser,realdata.password)
    .then(function(k){
      res.redirect('/users');
    })
    console.log(realdata);
    }) 
  })
});

router.get('/users',isLoggedIn,function(req,res){
  userModel.find()
  .then(function(allUsers){
    res.render('show',{allUsers:allUsers});
  })
});

router.get('/add/:name',isLoggedIn,isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(user => {
    user.frnds.push(req.params.name)
    user.save()
  }).then(function(a){
    res.redirect('/data');
  })
});

router.get('/data',isLoggedIn,isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(a){
    res.send(a);
  })
});

router.get('/logOut',function(req,res){
  req.logOut();
  res.redirect('/');
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}

module.exports = router;
