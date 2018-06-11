var mongoose = require('mongoose');
var Gymnist = require('./gymnist');
var Gymnasium = require('./gymnasium');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

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
  sessions_left: {
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
  roster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gymnist'}],
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
};

ClassSchema.statics.getSingleClass = function(class_id) {
  return Class.findOne({ _id: new ObjectID(class_id) })
    .exec();
};

//TODO:  Figure out a way to implement this correctly
ClassSchema.statics.validateEnrollment = function(class_id, gymnist_id) {
  var cid = new ObjectID(class_id);
  var gid = new ObjectID(gymnist_id);
  Class.findOne({_id: cid })
        .exec(function (err, lesson) {
          if (err) {
            throw new Error(err);
          }

          var roster = lesson.roster;
          var limit = lesson.class_limit;
          var result = {
                        isOk: true, 
                        msg: ''};

          if (roster.indexOf(gid) > -1) {
            result.msg = 'Gymnist is already enrolled in this class';
          }

          if (roster.length >= limit) {
            result.msg = 'This class is already fully booked';
          }          

        });
};

ClassSchema.statics.enrollGymnist = function(class_id, gymnist_id) {
  console.log('enrolling gymnist to class');
  var cid = new ObjectID(class_id);
  var gid = new ObjectID(gymnist_id);
  var query = Class.findOneAndUpdate({_id: cid}, {"$push": { "roster": gid}});

  return query.exec();
};

var Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
