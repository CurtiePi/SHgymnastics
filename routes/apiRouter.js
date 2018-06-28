var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Users = require('../models/user');
var Classes = require('../models/class');
var Gymnasiums = require('../models/gymnasium');
var Accounts = require('../models/account');
var Gymnists = require('../models/gymnist');
var Schedules = require('../models/schedule');

const PaymentManager = require('../lib/payment_manager');

var apiRouter= express.Router();
module.exports = apiRouter;

apiRouter.use(bodyParser.json());


/*
 * General Routes
 */

/**
 * Create an account
 *
 * Return a message and account information
 *
 */
apiRouter.route('/account/create')
.post(function (req, res, next) {
  console.log('Creating an account');

  var createPromise = Accounts.createAccount(req.body);

  createPromise.then(function (account) {
    var gymPromise = Gymnasiums.insertAccount(account.gymnasiums, account._id);

    gymPromise.then(function (result) {
      var returnData = {};
      returnData.name = account.fname + " " + account.lname;
      returnData.account_no = account.account_no;
      returnData.account_id = account._id.toString();
      returnData.message = "Your account has been created successfully";

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(returnData));

    })
    .catch( function(err) {
      console.log('An error has occured');
      throw (err);
    });
  })
  .catch(function (err) {
    console.log(err);
    next(err);
  });
;
});

/**
 * Enroll a gymnist
 *
 * Return a message and information
 *
 */
apiRouter.route('/gymnist/enroll')
.post(function(req, res, next) {
  console.log('Enroll a gymnist with an account');
  var preparedData = Gymnists.prepareData(req.body);

  var createPromise = Gymnists.enrollGymnist(preparedData);

  createPromise.then(function (gymnist) {                                                     
    var acctPromise = Accounts.addGymnist(gymnist.account, gymnist.id);           

    console.log('Enrolled gymnist to an account');

    acctPromise.then(function (account) {
      console.log("In the account promise");
      console.log(account);
      console.log("About to go to the payment manager");

      var payPromise = PaymentManager.chargeGymnistEnrollment(account);           
      
      payPromise.then(function (account) {
        var returnData = {};
        var name = gymnist.fname + " " + gymnist.lname;

        returnData.name = name;
        returnData.account_no = account.account_no;
        returnData.account_id = account._id.toString();
        returnData.gymnist_id = gymnist._id.toString();
        returnData.message = "Your account has enrolled " + name + " successfully";

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(returnData));
      })
      .catch(function (err) {                                                     
        console.log("Error for pay promise");
        throw new Error(err);                                                     
      });                                                                         
    })
    .catch(function (err) {                                                       
      console.log("Error for account promise");
      throw new Error(err);                                                       
    });                                                                           
  })
  .catch(function (err) {
    console.log("Error for create promise");
    throw new Error(err);
  });
});

/**
 * Sign up an gymnist in a class
 *
 * Return a message confirming the acceptance in the class
 *
 */
apiRouter.route('/gymnist/signup')
.post(function (req, res, next) {
  console.log('Signup a gymnist for a class');
});

/**
 * Get the schedule
 *
 * Return the schedules
 *
 */
apiRouter.route('/schedule')
.get(function(req, res, next) {

  console.log('Retrieve class schedule');
});

/**
 * Get the gymnasiums
 *
 * Return the gymnasiums
 *
 */
apiRouter.route('/gymnasiums')
.get(function(req, res, next) {

  console.log('Retrieve gymnasiums');
});

/**
 * Get the classes 
 *
 * Return the classes
 *
 */
apiRouter.route('/classes')
.get(function(req, res, next) {

  console.log('Retrieve classes');
});

/**
 * Transfer Classes
 *
 * Return a message confirming the transfer
 *
 */
apiRouter.route('/classes/transfer/gymnist')
.post(function(req, res, next) {
  
  var gymnistPromise = Gymnists.getOneGymnist(req.body.gid);
  var removePromise = Classes.removeGymnist(req.body.cid, req.body.gid);
  var enrollPromise = Classes.enrollGymnist(req.body.ncid, req.body.gid);

  var promises = [gymnistPromise, removePromise, enrollPromise];

  Promise.all(promises).then(function (results) {
    var gymnistObj = results[0];
    var oldClassObj = results[1];
    var newClassObj = results[2];

    var payPromise = PaymentManager.chargeTransferClass(gymnistObj, oldClassObj, newClassObj);

    payPromise.then(function (account) {

      var returnData = {};
      var name = gymnistObj.fname + " " + gymnistObj.lname;

      returnData.name = name;
      returnData.account_no = account.account_no;
      returnData.account_id = account._id.toString();
      returnData.gymnist_id = gymnistObj._id.toString();
      returnData.message = "Gymnist " + name + "  has successfully transferred from " + oldClassObj.title + " to " + newClassObj.title;

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(returnData));
    })
    .catch(function(err){
      console.log(err);
    });
  })
  .catch(function(err){
    console.log(err);
  });

});

/**
 * Payoff balance
 *
 * Return a message acknowledging the payment
 *
 */
apiRouter.route('/update/:cid')
.post(function(req, res, next) {
  console.log('Paying off the balance');
});

