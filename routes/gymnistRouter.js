var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Gymnists = require('../models/gymnist');
var Gymnasiums = require('../models/gymnasium');
var Classes = require('../models/class');
var Accounts = require('../models/account');

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
  var acctPromise = Accounts.getAccounts();
 
  acctPromise.then( function(result) {
    var accounts = result;

    res.render('gymnist/create', { accounts: accounts });
  })
  .catch(function (err) {
    console.log('An error has occured');
    throw (err);
  });
})
.post(function(req, res, next) {
  console.log('Posting to create a gymnist');
  console.log(req.body);
  var gymnistData = Gymnists.prepareData(req.body);

  Gymnists.create(gymnistData, function (err, gymnist) {
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

  var content = {isDelete: false,
                 lessons: [],
                 gynnasiums: [],
                 gymnist: {},
                 title: ''
                };

  var gymnistPromise = Gymnists.getOneGymnist(req.params.gid);
  var gymnasiumPromise = Gymnasiums.getGymnasiums();
  var classPromise = Classes.getClasses();

 classPromise.then(function (lessons) {
    content.lessons =  lessons;

    return gymnasiumPromise;
  }).then(function (gymnasiums) {
    content.gymnasiums = gymnasiums;

    return gymnistPromise;
  }).then(function (gymnist) {
    content.gymnist = gymnist;
    content.title = 'Profile for ' + gymnist.fname;
    
    return res.render('gymnist/profile', content);
  }).catch( function (err) {
    throw(err);
  });
});

gymnistRouter.route('/enroll')
.post(function (req, res, next) {
  console.log(req.body);
  //put the gymnist_id in the class
  //put the class_id in the gymnist
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
