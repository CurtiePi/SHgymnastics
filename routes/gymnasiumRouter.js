var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Gymnasiums = require('../models/gymnasium');

var gymnasiumRouter = express.Router();
module.exports = gymnasiumRouter;

gymnasiumRouter.use(bodyParser.json());


/*
 * General Routes
 */

gymnasiumRouter.route('/list')
.get(function(req, res, next) {
  console.log('Getting the list of gymnasiums');

  var acctPromise = Gymnasiums.getGymnasiums();

  acctPromise.then(function (result) {
    var gymnasiums = result;

    return res.render('gymnasium/gymlist', { gymnasiums: gymnasiums});
  })
  .catch( function(err) {
    console.log('An error has occured');
    throw (err);
  });

});

gymnasiumRouter.route('/create')
.get(function(req,res,next) {
  console.log('Getting the create gymnasium page');

  res.render('gymnasium/create');
})
.post(function(req, res, next) {
  console.log('Posting to create a gymnasium');
  req.body.isActive = req.body.isActive == 'on';
  Gymnasiums.create(req.body, function (err, gymnasium) {
    if (err) {
      return next(err);
    } else {

      return res.redirect('/gymnasium/list');
    }
  });
});

gymnasiumRouter.route('/profile/:gid')
.get(function(req, res, next) {
  console.log('Getting gymnasium profile');
  Gymnasiums.findById(req.params.gid)
       .exec(req.body, function (err, gymnasium) {
       if (err) throw err;

       console.log('Account found!');

       return res.render('gymnasium/profile', {title: 'Profile for ' + gymnasium.name, gymnasium: gymnasium });
  });
});

gymnasiumRouter.route('/update/:gid')
.get(function(req, res, next) {
  console.log('Getting gymnasium profile for update');
  Gymnasiums.findById(req.params.aid)
       .exec(req.body, function (err, gymnasium) {
       if (err) throw err;

       console.log('Account found!');

       return res.render('gymnasium/update', {title: 'Update gymnasium ' + gymnasium.name, gymnasium: gymnasium });
  });
}).post(function(req, res, next) {
  console.log('Updating gymnasium information');
  Gymnasiums.findById(req.params.aid)
       .exec(req.body, function (err, gymnasium) {
       if (err) throw err;

         console.log('Account found!');

         gymnasium.save(function (err, gymnasium) {
            if (err) throw err;
            console.log('Account updated and saved');

            return res.redirect('/gymnasium/gymlist');
        });
  });
});

gymnasiumRouter.route('/delete/:gid')
.get(function(req, res, next) {
  console.log('Getting gymnasium profile to confirm delete');
  Gymnasiums.findById(req.params.gid)
       .exec(req.body, function (err, gymnasium) {
       if (err) throw err;

       console.log('Account found!');

       return res.render('gymnasium/profile', {title: 'Delete gymnasium ' + gymnasium.name, gymnasium: gymnasium });
  });
})
.post(function(req, res, next) {
  console.log('Removing  Accountinformation');
  Gymnasiums.findByIdAndRemove(req.params.aid)
       .exec(req.body, function (err, gymnasium) {
       if (err) throw err;

       console.log('Account Removed!');

       return res.redirect('/gymnasium/gymlist');
  });
});
