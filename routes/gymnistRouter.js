var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

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

classRouter.rout('/update/gymist/:gid')
.post(function(req,res,next) {
  console.log('Uppdating Class with new gymist');

});
