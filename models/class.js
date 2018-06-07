var mongoose = require('mongoose');
var Gymnist = require('./gymnist');
var Gymnasium = require('./gymnasium');
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
  class_duration: {
    type: Number,
    required: true
  },
  roster: [Gymnist.schema],
  gymnasium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gymnasium'
  }, 
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
    default: "#FABC02"
  }
});

ClassSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
}

ClassSchema.statics.listClasses = function(callback) {
  console.log('Finding classes');
  Class.find({}).populate('gymnasium')
    .exec(function(error, classes) {
     if (error) {
       return callback(error);
     }

     return callback(null, classes);
  });
};

ClassSchema.statics.getClasses = function() {
  return Class.find({}, {__v : 0})
       .populate('gymnasium')
       .exec();
}

var Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
