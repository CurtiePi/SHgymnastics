var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dateFormat = require('dateformat');
var mw = require('../lib/middlewares');

var Users = require('../models/user');
var Classes = require('../models/class');
var Gymnasiums = require('../models/gymnasium');
var Schedules = require('../models/schedule');

const PaymentManager = require('../lib/payment_manager');
var classRouter= express.Router();
module.exports = classRouter;

classRouter.use(bodyParser.json());


/*
 * General Routes
 */
classRouter.route('/list')
.get(function (req, res, next) {
  console.log('Getting a list of Classes');
  var classPromise = Classes.listClasses();
  classPromise.then (function (classes) {
    return res.render('class/classlist', {classes: classes });
  })
  .catch(function (err) {
    console.log(err);
    return next(err);
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

classRouter.route('/schedule')
.get(function (req, res, next) {
  var classPromise = Classes.listClasses();
  var SchedulePromise = Schedules.getScheduledClasses();
  var data = {};

  classPromise.then(function (classes) {
    data.classes = classes;

    return SchedulePromise;
  })
  .then(function (schedule) {

    data.schedule = schedule;

    return res.render('class/schedule', data );
  })
  .catch(function (err) {
   console.log('Scheduling a Class');
    return next(err);
  });
})
.put(function (req, res, next) {
  var scheduleData = Schedules.marshallData(req.body); 

  var updatePromise = Schedules.updateSchedule(req.body.id, scheduleData);

  updatePromise.then(function (schedule) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(res.statusCode);
    res.write('#');
    res.end();
  })
  .catch(function (err) {
   console.log('Scheduling a Class');
    return next(err);
  });
})
.post(function (req, res, next) {
  console.log("Posting a schedule!");
  var scheduleData = Schedules.marshallData(req.body); 

  Schedules.create(scheduleData, function (err, schedule) {
    if (err) {
      console.log(err);
      next(err);
    }
 
    var data = req.body.id + ":" +  schedule.id; 
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(res.statusCode);
    res.write(data);
    res.end();
  });
})
.delete(function (req, res, next) {
  console.log("Deleting a class");

  var deletePromise = Schedules.removeSchedule(req.body.id);

  deletePromise.then(function (schedule) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(res.statusCode);
    res.write('/class/schedule');
    res.end();
  })
  .catch (function (err) {
    return next(err);
  });
});

classRouter.route('/profile/:cid')
.get(function(req, res, next) {
  var classPromise = Classes.getSingleClass(req.params.cid);

  classPromise.then( function (classresult) {
    return res.render('class/profile', {classobj : classresult});
 })
 .catch( function (err) {
   console.log(err);
   next(err);
 });

});

classRouter.route('/update/:cid')
.get(function(req, res, next) {
  console.log('Get form to update class');
  var content = {coaches: [], gymnasiums: [], classobj: {}};

  var classPromise = Classes.getSingleClass(req.params.cid);
  var coachPromise = Users.getCoaches();
  var gymPromise = Gymnasiums.getGymnasiums();
  
  gymPromise.then(function (result) {
    content.gymnasiums = result;
    return coachPromise;
  })
  .then(function(result) {
    content.coaches = result;
   
    return classPromise;
  })
  .then(function(classobj){
    content.classobj = classobj;

    res.render('class/update', content );
   })
  .catch(function (err) {
     console.log('An error was happened upon');
     throw (err);
   }); 
})
.post(function(req,res,next) {
  console.log('Updating Class');

  var updatePromise = Classes.updateClass(req.params.cid, req.body);

  updatePromise.then(function (classobj) {
    return res.redirect('/class/profile/' + classobj.id);
  })
  .catch(function (err) {
   console.log(err);
    return next(err);
  });
});

classRouter.route('/update/gymist')
.get(function(req, res, next) {
  console.log('Get form to update class with new gymnist');
});

classRouter.route('/update/gymist/:gid')
.post(function(req,res,next) {
  console.log('Uppdating Class with new gymist');

});
