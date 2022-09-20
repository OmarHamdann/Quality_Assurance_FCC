'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'pug');
app.set('views', './views/pug');

fccTesting(app); // For fCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.route('/').get((req, res) => {
  // Change the response to render the Pug template
  res.render('index', {
    title: 'Connected to Database',
    message: 'Please login',
    showLogin: true,
    showRegistration: true
  });


});
myDB(async (client) => {
  const myDataBase = await client.db('database').collection('users');

  // Be sure to change the title



  app.post('/login',
    bodyParser.urlencoded({ extended: false }),
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/profile');
    });

  app.get('/profile', ensureAuthenticated, (req, res) => {
    res.render(process.cwd() + '/views/pug/profile', { name: req.user.name });
  });

  //logout user and redirect to home page
  app.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });

  //registration new user and redirect to profile page
app.route('/register').post(
    (req, res, next) => {
        myDataBase.findOne({
            username: req.body.username
        }, function(err, user) {
            if (err) {
                next(err);
            } else if (user) {
                res.redirect('/');
            } else {
                myDataBase.insertOne({
                    username: req.body.username,
                    password: req.body.password,
                    name:  req.body.name
                }, (err, doc) => {
                    if (err) {
                        res.redirect('/');
                    } else {
                        next(null, doc.ops[0]);
                    }
                });
            }
        });
    },
    passport.authenticate('local', {
        failureRedirect: '/'
    }), (req, res, next) => {
        res.redirect('/profile');
    }
);
  // page not found 
  app.use("*", (req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });

  // Serialization and deserialization here...
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      done(null, doc);
    });
  });

  const findUserDocumnet = new LocalStrategy((username, password, done) => {
    myDataBase.findOne({ username: username }, (err, user) => {
      console.log('User ' + username + ' attempted to log in.');
      if (err) return done(err);
      if (!user) return done(null, false);
      if (password !== user.password) return done(null, false);
      return done(null, user);
    });
  });

  passport.use(findUserDocumnet);


  // Be sure to add this...
}).catch((e) => {
  app.route('/').get((req, res) => {
    res.render('index', { title: e, message: 'Unable to login' });
  });
});




// Be sure to add this... (middleware) to make sure the user is authenticated when calling the /profile route 
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

// app.listen out here...

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + process.env.PORT);
});