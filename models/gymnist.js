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
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  emergency_contact_name: {
    type: String,
    required: true,
    trim: true
  },
  emergency_contact_phone: {
    type: String,
    required: true,
    trim: true
  },
  emergency_contact_email: {
    type: String,
    required: true,
    trim: true
  },
  emergency_contact_relationship: {
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

var Gymnist = mongoose.model('Gymnist', GymnistSchema);

module.exports = Gymnist;
