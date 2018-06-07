var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Users = require('../models/user');
var Classes = require('../models/class');
var Gymnasiums = require('../models/gymnasium');

var classRouter= express.Router();
module.exports = classRouter;

classRouter.use(bodyParser.json());


/*
 * General Routes
 */
classRouter.route('/list')
.get(function (req, res, next) {
  console.log('Getting a list of Classes');
  Classes.listClasses(function (err, classes) {
    if (err || !classes) {
      var err = new Error('Problem getting class list');
      err.status = 401;
      return next(err);
    }

    return res.render('class/classlist', {classes: classes });
  });

});

classRouter.route('/create')
.get(function(req, res, next) {
  console.log('Get form to create new class');
  //get users who are staff members
  var content = {coaches: [], gymnasiums: []};

  var coachPromise = Users.getCoaches();
  var gymPromise = Gymnasiums.getGymnasiums();
  
  gymPromise.then(function (result) {
    content.gymnasiums = result;
    return coachPromise;
  })
  .then(function(result) {
    content.coaches = result;
   
    res.render('class/create', content );
   })
  .catch(function (err) {
     console.log('An error was happened upon');
     throw (err);
   }); 
})
.post(function (req,res,next) {
  console.log('Creating new Class');
  console.log(req.body);
  Classes.create(req.body, function (err, user) { 
    if (err) {
      return next(err);
    }

    return res.redirect('/class/list');
  });
});

classRouter.route('/profile/:cid')
.get(function(req, res, next) {

});

classRouter.route('/update')
.get(function(req, res, next) {
  console.log('Get form to update class');
})
.post(function(req,res,next) {
  console.log('Uppdating Class');

});

classRouter.route('/update/gymist')
.get(function(req, res, next) {
  console.log('Get form to update class with new gymnist');
});

classRouter.route('/update/gymist/:gid')
.post(function(req,res,next) {
  console.log('Uppdating Class with new gymist');

});
