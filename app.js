//////////////////////////////////////////////////////////////////////
//--------------------------Includes--------------------------------\\
//////////////////////////////////////////////////////////////////////
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    config = require('./src/config/config.js'),
    session = require('express-session'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    localMongoose = require('passport-local-mongoose'),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    User = require('./src/models/user'),
    mongoose = require('mongoose');

//////////////////////////////////////////////////////////////////////
//----------------------App Settings--------------------------------\\
//////////////////////////////////////////////////////////////////////
// mongoose location
mongoose.connect(config.mongoLocation_dev); // change to mongoLocation_production for production || mongoLocation_dev for dev

// template setting
app.set('view engine', 'jade');

// find the view folders
app.set('views', 'src/views/');

// make express look in the public directory for assets (css/js/img)
app.use(express.static('src/public/'));

// Express Session Settings
app.use(session({ // this is a way of requiring a module and passing functions to app
        secret: 'this can be anything',   // all these options are needed for express-session to work
        resave: false,
        saveUninitialized: false
}));

// Passport Settings
app.use(passport.initialize());    // needed to use passport
app.use(passport.session());       // needed to use passport
app.use(bodyParser.urlencoded({extended: true})); // needed for body parser to work
passport.use(new localStrategy({ usernameField: 'email' }, User.authenticate())); // creating a new local startegy coming from the passport-local-mongoose we exported functions
passport.serializeUser(User.serializeUser());   // passport uses this to encode the session info
passport.deserializeUser(User.deserializeUser());  // passport uses this to decode the session info

//////////////////////////////////////////////////////////////////////
//------------------------Routes------------------------------------\\
//////////////////////////////////////////////////////////////////////
app.get('/', (req, res) =>{
  res.render('index');
});

/////////////////////////////////////////////////////////////
//----------------------Login------------------------------\\
/////////////////////////////////////////////////////////////
app.post('/login', passport.authenticate('local', { // this middleware is checking if the login in a sucess or not using the local strategy
    successRedirect: '/success',
    failureRedirect: '/'
}), function(req, res){
});

app.get('/success', isLoggedIn, function(req, res){ // using my custom middleware to tell if the req is authenticated if so keep going if not redirect to home
    res.render('success');
});

// custom middle ware that check it a user is already logged in or not
function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next(); // allows route to go to the next function in its list
    else
        res.redirect('/login');
}

app.get('/login-page', (req, res) =>{
  res.render('login');
});

////////////////////////////////////////////////////////////////////////
//----------------------Create Account--------------------------------\\
////////////////////////////////////////////////////////////////////////
app.post('/create', existsNdelete, function(req, res){
  req.body.email = req.body.email.toLowerCase();

  User.register(new User({username: req.body.email}), req.body.password,  function(err, user){ // creates a new user and salt/hash password
    if(err){
      console.log(err);
      return;
    }

    passport.authenticate('local')(req, res, function(){ // using local strat and hash password
      res.render('success');
    })
  })
});

//custom middle ware to find if a user is exists if so delete it so it can be reregistered And if info is incorrect
function existsNdelete(req, res, next){
    req.body.email = req.body.email.toLowerCase();

    User.find({ username: req.body.email }, function(err, user) {
      if (err)
          throw err;

        if(user.length == 0){
          res.redirect('/');
        }else{
          User.remove({ username: user[0].username }, function(err){
            if(err)
              throw err;
          });

          console.log('User successfully deleted!');
          return next();
        }
    })
};

app.get('*', (req, res) =>{
  res.render('index');
});

app.listen(port, ()=>{
  console.log(`app running on port ${port}`);
});
