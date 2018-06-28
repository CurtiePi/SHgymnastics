var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

var Class = require('./class');
var Account = require('./account');
var Enrollment = require('./enrollment');

var GymnistSchema = new Schema({
  fname: {
    type: String,
    required: true,
    trim: true
  },
  lname: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  enrollment_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  emergency_name: {
    type: String,
    required: true,
    trim: true
  },
  emergency_phone: {
    type: String,
    required: true,
    trim: true
  },
  emergency_relationship: {
    type: String,
    required: true,
    trim: true
  },
  enrollments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment'}],
  notes: {
    type: String,
    trim: true
  }
});

GymnistSchema.statics.listGymnists = function(callback) {
  console.log('Finding gymnists');
  Gymnist.find({}).
    exec(function(error, gymnists) {
     if (error) {
       return callback(error);
     }

     return callback(null, gymnists);
  });
};

GymnistSchema.statics.getOneGymnist = function (gymnist_id) {
  var gid = new ObjectID(gymnist_id);

  var query =  Gymnist.findOne({ "_id": gid})
         .populate('classes')
         .populate('account')
         .populate('enrollments')
         .populate({ path: 'enrollments', populate: {path: 'class_id'}});

  return query.exec();
}

GymnistSchema.statics.prepareData = function (data) {
  var outputObj = {};
  outputObj.fname = data.fname;
  outputObj.lname = data.lname;
  outputObj.account = new ObjectID(data.account);
  outputObj.emergency_name = data.emergency_name;
  outputObj.emergency_phone = data.emergency_phone;
  outputObj.emergency_relationship = data.emergency_relationship;
  outputObj.notes = data.notes;
  var date_of_birth = new Date(data.b_year, data.b_month,  data.b_day);
  outputObj.dob = date_of_birth.getTime();

  return outputObj;
};

GymnistSchema.statics.enrollGymnist = function(data) {
  return Gymnist.create(data);
};

GymnistSchema.statics.addClassEnrollment = function (gymnist_id, class_id, date) {
  var cid = new ObjectID(class_id);
  var gid = new ObjectID(gymnist_id);
  
  var enrollPromise = Enrollment.create({"class_id": cid, "enrollment_date": date });

  return enrollPromise.then(function (enrollment) {
    var query =  Gymnist.findOneAndUpdate({"_id": gid}, {"$push": {"enrollments": enrollment._id} }).populate('account');
    return query.exec();
  });
};

GymnistSchema.statics.updateGymnist = function (gymnist_id, data) {
  var gid = new ObjectID(gymnist_id);

  var findPromise =  Gymnist.findById({_id: gid}).exec();

  return findPromise.then( function (gymnist) {

           if (gymnist.fname != data.fname) {
             gymnist.fname = data.fname;
           }

           if (gymnist.lname != data.lname) {
             gymnist.lname = data.lname;
           }

           var old_acct_id;
           var needTransfer = false;
           if (gymnist.account.id != data.account.toString()) {
             old_acct_id = gymnist.account;
             var needTransfer = true;
             gymnist.account = data.account;
           }

           if (gymnist.dob != data.dob) {
             gymnist.dob = data.dob;
           }

           if (gymnist.emergency_name != data.emergency_name) {
             gymnist.emergency_name = data.emergency_name
           }

           if (gymnist.emergency_phone != data.emergency_phone) {
             gymnist.emergency_phone = data.emergency_phone;
           }

           if (gymnist.emergency_relationship != data.emergency_relationship) {
             gymnist.emergency_relationship = data.emergency_relationship;
           }

           if (gymnist.notes != data.notes) {
             gymnist.notes = data.notes;
           }

           gymnist.save();
           if (needTransfer) {
             transgerPromise = Account.transferGymnist(old_acct_id, data.account, gymnist.id);
           }
         })
         .catch(function (err) {
           console.log(err);
         });
}

//Testing the use of hooks
var autoPopulateAccount = function(next) {
  this.populate('account');
  next();
};

GymnistSchema.
  pre('findOne', autoPopulateAccount).
  pre('find', autoPopulateAccount);

var Gymnist = mongoose.model('Gymnist', GymnistSchema);

module.exports = Gymnist;
