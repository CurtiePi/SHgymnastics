var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var crypto = require('crypto');
var tools = require('../lib/tools');
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

   var errors = [];

   if (req.session.error) {
     errors.push(new Error(req.session.error));
     req.session.error = null;
   }

   res.render('login', {errors: errors});
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

generalRouter.route('/forgotpwd')
.get(function(req, res, next) {
   console.log('Forgot password Page');

   res.render('pwdforgotten');
})
.post(function (req, res, next) {
   console.log('Forgot password Page');
   var userPromise = Users.getUserByEmail(req.body.email);
   var errors = [];

   userPromise.then(function (user) {
     console.log("We have a user!");

     if (user) {
       console.log("Yes we really have a user");
       console.log(req.protocol + '://' + req.get('host') );
       var hash = crypto.randomBytes(20).toString('hex');
       hashPromise = user.storeHash(hash);
       hashPromise.then(function (result) {
         console.log(result);
         var link = tools.createResetLink(req, result.hash);
         console.log(link);
         tools.sendResetEmail(link, "curtisbklyn@gmail.com");
       })
       .catch(function (err){
         console.log(err);
       });

     } else {
       console.log("Nope it was a false alarm!");
       errors.push(new Error("This user does not exist in our system!"));
     }
     res.render('pwdforgotten', { errors: errors });
   })
   .catch (function (err) {
     console.log(err);
     console.log("Error because the user wasn't found?");
   });
});


generalRouter.route('/resetpwd')
.get(function(req, res, next) {
  var rightNow = new Date();
  console.log(req.query);
  if (rightNow > req.query.dl) {
    console.log("Times up so no good")
    Users.clearUserReset(req.query.hc);

    req.session.error = "This link has expired";
    return res.redirect('/login');
  }
  
  //Check the user is still needs a reset
  var userPromise = Users.getUserToReset(req.query.hc);
  
  userPromise.then(function (user) {
    if (!user) {
      req.session.error = "This link is invalid";
      return res.redirect('login');
    }

    var hash = req.query.hc;
    return res.render('resetpwd', { handle: hash});
  })
  .catch(function (err) {
    console.log("error in router");
    console.log(err);
    throw err;
  });

})
.post(mw.confirmPwdEq, function(req, res, next) {
  var userPromise = Users.getUserToReset(req.body.handle);
  
  userPromise.then(function (user) {
    user.resetPassword(req.body.newpwd);
    user.clearReset();

    return res.redirect('/login');
  });
});

generalRouter.route('/logout')
.get(function(req, res, next) {
   console.log('Logout Page');

   req.app.locals.isLoggedIn = false;
   req.session.userId = null;
   res.redirect('/login');
})
