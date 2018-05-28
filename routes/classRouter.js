var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Users = require('../models/user');
var Classes = require('../models/class');

var classRouter= express.Router();
module.exports = classRouter;

classRouter.use(bodyParser.json());


/*
 * General Routes
 */
classRouter.route('/list')
.get(function (req, res, next) {
  console.log('Getting a list of Classes');

  return res.render('class/classlist', {classes: [] });


});

classRouter.route('/create')
.get(function(req, res, next) {
  console.log('Get form to create new class');
  //get users who are staff members
  var coaches = [];

  var coachPromise = Users.getCoaches();

  coachPromise.then(function(result) {
    coaches = result;
   
    res.render('class/create', { coaches: coaches } );
   })
  .catch(function (err) {
     console.log('An error was happened upon');
     throw (err);
   }); 
})
.post(function(req,res,next) {
  console.log('Creating new Class');

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
