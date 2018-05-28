var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Users = require('../models/user');
var Role = require('../models/role');

var userRouter = express.Router();
module.exports = userRouter;

userRouter.use(bodyParser.json());


/*
 * General Routes
 */

userRouter.route('/create')
.get(function(req,res,next) {
  console.log('Getting the create user page');
  var roles = Role.getRoles();
  var defaultRole = Role.getDefault();

  var content = {roles: roles,
                 defaultRole: defaultRole,
                };

  var errors = null;
  if (req.session && req.session.errors) {
    content.errors = req.session.errors;
    req.session.errors = null;
  }

  res.render('user/create', content);
})
.post(mw.validateNewUserInfo, function(req, res, next) {
  console.log('Posting to create a user');
  Users.create(req.body, function (err, user) {
    if (err) {
      return next(err);
    } else {

      return res.redirect('/user/userlist');
    }
  });
});

userRouter.route('/userlist')
.get(function(req, res, next) {
  console.log('Getting the list of users');

  var isAdmin = false;
/*
  Users.isAdminRole(req.session.userId, function(err, result) {
    if (err) {
      var err = new Error('Problem getting user list');
      err.status = 401;
      return next(err);
    }

    isAdmin = result;
  });
*/
  isAdmin = true;
  Users.listUsers(function (err, users){
    if (err || !users) {
        var err = new Error('Problem getting user list');
        err.status = 401;
        return next(err);
      } else {
        return res.render('user/userlist', { users: users, isAdmin: isAdmin });
      }
  });
});

userRouter.route('/profile/:id')
.get(function(req, res, next) {
  console.log('Getting user profile');
  Users.findById(req.params.id)
       .exec(req.body, function (err, user) {
       if (err) throw err;

       console.log('User found!');

       return res.render('user/profile', {title: 'Profile for ' + user.name, user: user, isDelete: false });
  });
});

userRouter.route('/update/:id')
.get(function(req, res, next) {
  console.log('Getting user profile');
  Users.findById(req.params.id)
       .exec(req.body, function (err, user) {
       if (err) throw err;

       console.log('User found!');
       var roles = Role.getRoles();

       return res.render('user/update', {title: 'Update user ' + user.name, user: user, roles: roles });
  });
}).post(function(req, res, next) {
  console.log('Updating user information');
  Users.findById(req.params.id)
       .exec(req.body, function (err, user) {
       if (err) throw err;

         console.log('User found!');
         if (user.role != req.body.role) {
           user.role = req.body.role;
         }

         if (user.email != req.body.email) {
           user.email = req.body.email;
         }

         if(req.body.password) {
           user.password = req.body.password;
         }

         user.save(function (err, user) {
            if (err) throw err;
            console.log('User updated and saved');

            return res.redirect('/user/userlist');
        });
  });
});

userRouter.route('/delete/:id')
.get(function(req, res, next) {
  console.log('Getting user profile to confirm delete');
  Users.findById(req.params.id)
       .exec(req.body, function (err, user) {
       if (err) throw err;

       console.log('User found!');
       var roles = Role.getRoles();

       return res.render('user/profile', {title: 'Delete user ' + user.name, user: user, isDelete : true });
  });
})
.post(function(req, res, next) {
  console.log('Removing  user information');
  Users.findByIdAndRemove(req.params.id)
       .exec(req.body, function (err, user) {
       if (err) throw err;

       console.log('User Removed!');

       return res.redirect('/user/userlist');
  });
});
