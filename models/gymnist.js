var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Class = require('./class');
var Account = require('./account');
var Contact = require('./contact');
var EmergencyContact = require('./emergency_contact');

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
  contact: [Contact.schema],
  emergency_contact: [EmergencyContact.schema],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class'}],
  notes: {
    type: String,
    trim: true
  }
});

var Gymnists = mongoose.model('Gymnist', GymnistSchema);

module.exports = Gymnists;
