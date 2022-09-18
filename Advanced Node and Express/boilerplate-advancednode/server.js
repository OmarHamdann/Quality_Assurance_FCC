'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
//pug
const pug = require('pug');
const app = express();
//passport and session
const passport = require('passport');
const session = require('express-session');
//connect-mongo
const ObjectID = require('mongodb').ObjectID;

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//session and passport setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());




//pug setup
app.set('view engine', 'pug');
//pug folder
app.set('views','./views/pug');


app.route('/').get((req, res) => {
  // Change the response to render the Pug template
  res.render('index', {title: 'Hello', message: 'Please login'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});



//save userId to cookie
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//retrieve userId from cookie
passport.deserializeUser((id, done) => {
  myDataBase.findOne({ _id: new ObjectID(id) },
   (err, doc) => {
    done(null, null);
  });
});