var express=require('express');
var app=express();
var db=require('./models/index.js');
var bodyParser = require('body-parser'),
methodOverride = require('method-override'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

// Require Lyrics Post model
var db = require("./models"),
lyricsPost = db.lyricsPost,
User = db.User;

// Configure app
app.set('views', __dirname + '/views');      // Views directory
app.use(express.static('public'));          // Static directory
app.use(bodyParser.urlencoded({ extended: true })); // req.body

app.use(methodOverride("_method"));

app.use(cookieParser());
app.use(session({
  secret: "thisisasecret", // change this!
  resave: false,
  saveUninitialized: false,
}));
// app.use(passport.initialize());
// app.use(passport.session());
//
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// Set CORS Headers
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

//basic root route
app.get('/',function(req,res){
    res.render('home');
  });

app.get('/dashboard',function(req,res){
    res.render('dashboard');
  });

app.get('/add_song',function(req,res){
    res.render('dashboard');
  });

  app.post('/home_user', passport.authenticate('local'),function (req,res) {
  if(!req.user){
    res.status(400);
  }else{

    res.render('/home');
  }
  });

app.set("view engine", "ejs");

app.listen(process.env.PORT || 3000,function(){
  console.log('server running');
});
