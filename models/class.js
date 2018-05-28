var mongoose = require('mongoose');
var Gymnist = require('./gymnist');
var Schema = mongoose.Schema;

var ClassSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  session_count: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: true,
  },
  class_limit: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: true 
  },
  roster: [Gymnist.schema],
  waiting_list: [Gymnist.schema],
  instructor: {
    type: String,
    trim: true
  },
  isPending: {
    type: Boolean,
    default: true
  },
  cost: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: "#C0C0C0"
  }
});

var Classes = mongoose.model('Class', ClassSchema);

module.exports = Classes;
