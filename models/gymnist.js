var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Class = require('./class');
var Account = require('./account');

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
  account_no: {
    type: String,
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
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class'}],
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

GymnistSchema.statics.getOneGymnist = function (data) {
  return Gymnist.findById(data)
         .populate('classes')
         .exec();
}

GymnistSchema.statics.prepareData = function (data) {
  var outputObj = {};
  outputObj.fname = data.fname;
  outputObj.lname = data.lname;
  outputObj.account_no = data.account_no;
  outputObj.emergency_name = data.emergency_name;
  outputObj.emergency_phone = data.emergency_phone;
  outputObj.emergency_relationship = data.emergency_relationship;
  outputObj.notes = data.notes;
  var date_of_birth = new Date(data.b_year, data.b_month,  data.b_day);
  outputObj.dob = date_of_birth.getTime();

  return outputObj;
};

var Gymnist = mongoose.model('Gymnist', GymnistSchema);

module.exports = Gymnist;
