var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Accounts = require('../models/account');
var Gymnasiums = require('../models/gymnasium');

const PaymentManager = require('../lib/payment_manager');
var accountRouter = express.Router();
module.exports = accountRouter;

accountRouter.use(bodyParser.json());


/*
 * General Routes
 */

accountRouter.route('/list')
.get(function(req, res, next) {
  console.log('Getting the list of users');

  var acctPromise = Accounts.getAccounts();

  acctPromise.then(function (result) {
    var accounts = result;
    return res.render('account/accountlist', {accounts: accounts} );
  })
  .catch( function(err) {
    console.log('An error has occured');
    throw (err);
  });

});

accountRouter.route('/create')
.get(function(req,res,next) {
  console.log('Getting the create account page');
  var gymPromise = Gymnasiums.getGymnasiums();

  gymPromise.then(function (result) {
    res.render('account/create', {gymnasiums: result});
  })
  .catch( function(err) {
    console.log('An error has occured');
    throw (err);
  });
})
.post(function(req, res, next) {
  console.log('Posting to create a account');
  req.body.isActive = req.body.isActive == 'on';
  Accounts.create(req.body, function (err, account) {
    if (err) {
      return next(err);
    } else {
      var gymPromise = Gymnasiums.insertAccount(account.gymnasiums, account._id);
      gymPromise.then(function (result) {

        return res.redirect('/account/list');
      })
      .catch( function(err) {
        console.log('An error has occured');
        throw (err);
      });
    }
  });
});

accountRouter.route('/profile/:aid')
.get(function(req, res, next) {
  console.log('Getting account profile');
  var acctPromise = Accounts.getOneAccount(req.params.aid);
  acctPromise.then( function (account) {
       console.log('Account found!');
       var content = {
                      title: 'Profile for ' + account.fname,
                      account: account
                     }

       return res.render('account/profile', content);
  })
  .catch( function(err) {
    console.log('An error has occured');
    throw (err);
  });
});

accountRouter.route('/update/:aid')
.get(function(req, res, next) {
  console.log('Getting account profile for update');

  var acctPromise = Accounts.getOneAccount(req.params.aid);
  var gymPromise = Gymnasiums.getGymnasiums();
  var content = {};


  gymPromise.then(function (result) {
    content.gymnasiums = result;
    return acctPromise;
  })
  .then( function (account) {
       console.log('Account found!');
       content.title = 'Update Account  for ' + account.fname;
       content.account = account;

       return res.render('account/update', content);
  })
  .catch( function(err) {
    console.log('An error has occured');
    throw (err);
  });

}).post(function(req, res, next) {
  console.log('Updating account information');
  var acctPromise = Accounts.updateAnAccount(req.params.aid, req.body);

  acctPromise.then(function (account) {

    return res.redirect('/account/list');
  })
  .catch(function (err) {
    console.log('An error has occured');
    throw (err);
  });
});

accountRouter.route('/delete/:aid')
.get(function(req, res, next) {
  console.log('Getting account profile to confirm delete');
  Accounts.findById(req.params.aid)
       .exec(req.body, function (err, account) {
       if (err) throw err;

       console.log('Account found!');

       return res.render('account/profile', {title: 'Delete account ' + accountf.name, account: account });
  });
})
.post(function(req, res, next) {
  console.log('Removing  Accountinformation');
  Accounts.findByIdAndRemove(req.params.aid)
       .exec(req.body, function (err, account) {
       if (err) throw err;

       console.log('Account Removed!');

       return res.redirect('/account/accountlist');
  });
});
