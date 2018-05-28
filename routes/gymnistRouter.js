var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Gymnists = require('../models/gymnist');

var gymnistRouter = express.Router();
module.exports = gymnistRouter;

gymnistRouter.use(bodyParser.json());


/*
 * General Routes
 */

gymnistRouter.route('/list')
.get(function(req, res, next) {
  console.log('Getting the list of users');

  Gymnists.listGymnists(function (err, gymnists){
    if (err || !gymnists) {
        var err = new Error('Problem getting gymnist list');
        err.status = 401;
        return next(err);
      } else {
        return res.render('gymnist/gymnistlist', { gymnists: gymnists});
      }
  });
});

gymnistRouter.route('/create')
.get(function(req,res,next) {
  console.log('Getting the create gymnist page');

  res.render('user/create', content);
})
.post(function(req, res, next) {
  console.log('Posting to create a gymnist');
  Gymnists.create(req.body, function (err, gymnist) {
    if (err) {
      return next(err);
    } else {

      return res.redirect('/gymnist/list');
    }
  });
});

gymnistRouter.route('/profile/:gid')
.get(function(req, res, next) {
  console.log('Getting gymnist profile');
  Users.findById(req.params.gid)
       .exec(req.body, function (err, gymnist) {
       if (err) throw err;

       console.log('Gymnist found!');

       return res.render('gymnist/profile', {title: 'Profile for ' + gymnist.fname, gymnist: gymnist });
  });
});

gymnistRouter.route('/update/:gid')
.get(function(req, res, next) {
  console.log('Getting gymnist profile for update');
  Gymnists.findById(req.params.gid)
       .exec(req.body, function (err, gymnist) {
       if (err) throw err;

       console.log('Gymnist found!');

       return res.render('gymnist/update', {title: 'Update gymnist ' + gymnist.fname, gymnist: gymnist });
  });
}).post(function(req, res, next) {
  console.log('Updating gymnist information');
  Gymnists.findById(req.params.gid)
       .exec(req.body, function (err, gymnist) {
       if (err) throw err;

         console.log('Gymnist found!');

         gymnist.save(function (err, gymnist) {
            if (err) throw err;
            console.log('Gymnist updated and saved');

            return res.redirect('/gymnist/gymnistlist');
        });
  });
});

gymnistRouter.route('/delete/:gid')
.get(function(req, res, next) {
  console.log('Getting gymnist profile to confirm delete');
  Gymnists.findById(req.params.gid)
       .exec(req.body, function (err, gymnist) {
       if (err) throw err;

       console.log('Gymnist found!');

       return res.render('gymnist/profile', {title: 'Delete gymnist ' + gymnistf.name, gymnist: gymnist });
  });
})
.post(function(req, res, next) {
  console.log('Removing  Gymnistinformation');
  Gymnists.findByIdAndRemove(req.params.gid)
       .exec(req.body, function (err, gymnist) {
       if (err) throw err;

       console.log('Gymnist Removed!');

       return res.redirect('/gymnist/gymnistlist');
  });
});
