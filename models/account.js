var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Gymnist = require('./gymnist');
var Gymnasium = require('./gymnasium');

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
    type: String,
    unique: true,
    required: true,
  },
  contact_address: {
    type: String,
    required: true,
    trim: true
  },
  contact_phone_1: {
    type: String,
    required: true,
    trim: true
  },
  contact_phone_2: {
    type: String,
    trim: true
  },
  contact_email: {
    type: String,
    required: true,
    trim: true
  },
  gymnists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gymnist'}],
  gymnasiums: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gymnasium'
  },
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

AccountSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
}

AccountSchema.statics.getAccounts = function() {
  console.log('Finding accounts');
  var query = Account.find({})
                     .populate('gymnasiums');

  return query.exec();
};

var Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
