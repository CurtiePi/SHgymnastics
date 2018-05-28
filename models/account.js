var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contact = require('./contact');
var Gymnist = require('./gymnist');

var AccountSchema = new Schema({
  lname: {
    type: String,
    required: true,
    trim: true
  },
  fname: {
    type: String,
    required: true,
    trim: true
  },
  account_no: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: true,
  },
  contact: [Contact.schema],
  gymnists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gymnist'}],
  creation_date: {
    type: Date,
    default: Date.now
  },
  latest_enrollment_date: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  balance_due: {
    type: Number,
    default: 0.0
  }
});
