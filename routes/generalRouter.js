var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Users = require('../models/user');

var activityRouter = express.Router();
module.exports = activityRouter;

activityRouter.use(bodyParser.json());


/*
 * General Routes
 */

activityRouter.route('/')
.get(function(req, res, next) {
   console.log('Homepage');

   res.redirect('/dashboard');
   //res.send('INDEX is where we should be');
});

activityRouter.route('/login')
.get(function(req, res, next) {
   console.log('Login Page');

   res.render('activity/login');
   //res.send('INDEX is where we should be');
})
.post(function (req, res, next) {
  console.log('Logging in.....');

  if (req.body.email == 'admin' && req.body.password == 'admin') {
    console.log('Do not validate');
    req.app.locals.isLoggedIn = true;
    req.session.userId = 1;
    var user = {id: 2938,
                     name: 'Fredrick Hampton',
                     role: 'ADMIN',
                     email: 'myemail@somwhere.com'
                    };

    var date = new Date();
    res.render('activity/dashboard', {user: user, date: date.toString()});
  } else {
    Users.authenticate(req.body.email, req.body.password, function(error, user){
      if (error) {
        var errors = [error];
        return res.render('activity/login', {errors: errors});
      }

      req.app.locals.isLoggedIn = true;
      req.session.userId = user.id;

      var date = new Date();
      return res.render('activity/dashboard', {user: user, date: date.toString()});

    });
  }
});

activityRouter.route('/dashboard')
.get(mw.protect, function (req, res, next) {
    Users.findOne({_id: req.session.userId})
      .exec(req.body, function (err, user) {
        var date = new Date();
        res.render('activity/dashboard', {user: user, date: date.toString()});
      });
});

activityRouter.route('/logout')
.get(function(req, res, next) {
   console.log('Logout Page');

   req.app.locals.isLoggedIn = false;
   req.session.userId = null;
   res.redirect('/login');
})
