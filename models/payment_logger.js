var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentLogSchema = new Schema({
  account_id: {
    type: String,
    required: true,
    trim: true
  },
  account_name: {
    type: String,
    required: true,
    trim: true
  },
  payment_type: {
    type: String,
    required: true,
    trim: true
  },
  payment_reason: {
    type: String,
    required: true,
    trim: true
  },
  payment_amount: {
    type: Number,
    required: true,
    default: 0.0
  },
  discount_amount: {
    type: Number,
    default: 0.0
  },
  payment_date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

var PaymentLog = mongoose.model('PaymentLog', PaymentLogSchema);

module.exports = PaymentLog;
