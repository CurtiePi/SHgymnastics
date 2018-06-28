var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Gymnists = require('../models/gymnist');
var Gymnasiums = require('../models/gymnasium');
var Classes = require('../models/class');
var Accounts = require('../models/account');

const PaymentManager = require('../lib/payment_manager');
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
  var gymnistData = Gymnists.prepareData(req.body);

  Gymnists.create(gymnistData, function (err, gymnist) {
    if (err) {
      return next(err);
    } else {

      var acctPromise = Accounts.addGymnist(gymnist.account, gymnist.id);
      acctPromise.then(function (account) {
        var payPromise = PaymentManager.chargeGymnistEnrollment(account);

        payPromise.then(function (account) {
          return res.redirect('/gymnist/list');
        })
        .catch(function (err) {
          throw new Error(err);
        });
      })
      .catch(function (err) {
        throw new Error(err);
      });

    }
  });
});

gymnistRouter.route('/create/:aid')
.get(function(req,res,next) {
  console.log('Getting the create gymnist page for one specific account');
  var acctPromise = Accounts.getOneAccount(req.params.aid);
 
  acctPromise.then( function(result) {
    var accounts = [];
    accounts.push(result);

    res.render('gymnist/create', { accounts: accounts });
  })
  .catch(function (err) {
    console.log('An error has occured');
    throw (err);
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
    console.log("SHOULD HAVE FOUND THE GYMNIST");
    console.log(gymnist);

    content.gymnist = gymnist;
    content.title = 'Profile for ' + gymnist.fname;
    
    return res.render('gymnist/profile', content);
  }).catch( function (err) {
    throw(err);
  });
});

gymnistRouter.route('/signup')
.post(function (req, res, next) {
  var gymnist_id = req.body.gymnist_id;
  var class_id = req.body.class_id;
  var gym_id = req.body.gym_id;
  var errorArray = [];

  var classPromise = Classes.getSingleClass(class_id);
  var gymnistPromise = Gymnists.getOneGymnist(gymnist_id);

  classPromise.then(function(lesson) {
      if (lesson.roster.length >= lesson.class_limit) {
        errorArray.push(new Error('This class is fully booked!'));
      }
      if (lesson.roster.indexOf(gymnist_id) > -1) {
        errorArray.push(new Error('Gymnist already enrolled in this class'));
      }
      if (errorArray.length > 0) {
        var content = {isDelete: false,
                 lessons: [],
                 gynnasiums: [],
                 gymnist: {},
                 title: '',
                 req: req.body,
                 errors: errorArray   
                };

        var gymnistPromise = Gymnists.getOneGymnist(gymnist_id);
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
      }
      /**
       * use the gymnistPromise and create the class and gymnaium promises
       * to go back to the profile with a message of the class is full
       */
      
      
     var rightnow = new Date();
     var classEnrollPromise = Classes.enrollGymnist(lesson.id, gymnist_id);
     var gymnistEnrollPromise = Gymnists.addClassEnrollment(gymnist_id, lesson.id, rightnow.getTime());
     var promises = [classEnrollPromise, gymnistEnrollPromise];

     Promise.all(promises).then(function (results) {
       // Results object match order of parameters in the Promise.all call
       var classObj = results[0];
       var gymnistObj = results[1];

       var payPromise = PaymentManager.chargeClassSignup(gymnistObj, classObj);


       payPromise.then(function (account) {
         return res.redirect('/gymnist/profile/' + gymnist_id);
       })
       .catch(function (err) {
         throw new Error(err);
       });
     })
     .catch(function (err){
       console.log(err);
     });
  })
  .catch(function (err){
     console.log(err);
  });
});

gymnistRouter.route('/update/:gid')
.get(function(req, res, next) {
  console.log('Getting gymnist profile for update');
  var acctPromise = Accounts.getAccounts();
  var gymnistPromise = Gymnists.getOneGymnist(req.params.gid);
  var content =  {};

  gymnistPromise.then(function (gymnist) {
    content.gymnist = gymnist;
    content.title = 'Update for ' + gymnist.fname;
    return acctPromise;
  })
  .then(function (accounts) {
    content.accounts = accounts
    res.render('gymnist/update', content);
  })
  .catch(function (err) {
    console.log(err);
  });    
})
.post(function(req, res, next) {
  console.log('Updating gymnist information');
  var gymnistData = Gymnists.prepareData(req.body);
  var gymnistPromise = Gymnists.updateGymnist(req.params.gid, gymnistData);
  gymnistPromise.then(function (result) {
    return res.redirect('/gymnist/list');
  })
  .catch(function (err) {
    console.log(err);
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
