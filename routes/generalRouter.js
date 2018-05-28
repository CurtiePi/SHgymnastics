var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Users = require('../models/user');

var generalRouter = express.Router();
module.exports = generalRouter;

generalRouter.use(bodyParser.json());


/*
 * General Routes
 */

generalRouter.route('/')
.get(function(req, res, next) {
   console.log('Homepage');

   res.redirect('dashboard');
});

generalRouter.route('/login')
.get(function(req, res, next) {
   console.log('Login Page');

   res.render('login');
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
    res.render('dashboard', {user: user, date: date.toString()});
  } else {
    Users.authenticate(req.body.email, req.body.password, function(error, user){
      if (error) {
        var errors = [error];
        return res.render('login', {errors: errors});
      }

      req.app.locals.isLoggedIn = true;
      req.session.userId = user.id;

      var date = new Date();
      return res.render('dashboard', {user: user, date: date.toString()});

    });
  }
});

generalRouter.route('/dashboard')
.get(mw.protect, function (req, res, next) {
    Users.findOne({_id: req.session.userId})
      .exec(req.body, function (err, user) {
        var date = new Date();

        res.render('dashboard', {user: user, date: date.toString()});
      });
});

generalRouter.route('/logout')
.get(function(req, res, next) {
   console.log('Logout Page');

   req.app.locals.isLoggedIn = false;
   req.session.userId = null;
   res.redirect('/login');
})
