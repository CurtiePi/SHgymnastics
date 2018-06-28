var mongoose = require('mongoose');
var Gymnist = require('./gymnist');
var Gymnasium = require('./gymnasium');
var Schedule = require('./schedule');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

var ClassSchema = new Schema({
  title: {
    type: String,
    required: true,
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
  return  Class.find({})
          .populate('gymnasium')
          .exec().catch(function (err){
                     console.log("Error in Class model listClasses function");
                     console.log(err);
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

ClassSchema.statics.marshallData = function (data) {
  var outputObj = {};

  outputObj.title = data.text;
  outputObj.description = data.class_description;
  outputObj.session_count = data.class_sessions;
  outputObj.sessions_left = data.class_sessions;
  outputObj.class_limit = data.class_limit;
  outputObj.class_duration = data.class_duration;
  outputObj.isPending = data.is_pending;
  outputObj.gymnasium = new ObjectID(data.class_gym);
  outputObj.instructor = data.class_instructor;
  outputObj.cost = data.class_cost;

  return outputObj;
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

ClassSchema.statics.removeGymnist = function(class_id, gymnist_id) {
  console.log('removing gymnist to class');
  var cid = new ObjectID(class_id);
  var gid = new ObjectID(gymnist_id);
  var query = Class.findOneAndUpdate({_id: cid}, {"$pull": { "roster": gid}});

  return query.exec();
};

ClassSchema.statics.createAndSchedule = function (data) {
  var classData = Class.marshallData(data);
 
  var createPromise = Class.create(classData);

  return createPromise.then(function (classobj) {
    data.class_id = classobj._id.toString();

    var scheduleData = Schedule.marshallData(data);

    return Schedule.create(scheduleData);
  })
  .catch(function (err) {
    console.log(err);
    throw err;
  });

};

ClassSchema.statics.updateClass = function (class_id, data) {
  var cid = new ObjectID(class_id);

  // Make sure isPending is true or false
  data.isPending = (data.isPending == "on" || data.isPending);

  var findPromise =  Class.findById({_id: cid}) .exec();

  return findPromise.then( function (classobj) {

           if (classobj.title != data.title) {
             classobj.title = data.title;
           }

           if (classobj.description != data.description) {
             classobj.description = data.description;
           }

           if (classobj.gymnasium != data.gymnasium) {
             classobj.gymnasium = data.gymnasium;
           }

           if (classobj.instructor != data.instructor) {
             classobj.instructor = data.instructor;
           }

           if (classobj.class_duration != data.class_duration) {
             classobj.class_duration = data.class_duration;
           }

           if (classobj.session_count != data.session_count) {
             classobj.session_count = data.session_count;
           }

           if (classobj.sessions_left != data.sessions_left) {
             classobj.sessions_left = data.sessions_left;
           }

           if (classobj.class_limit != data.class_limit) {
             classobj.class_limit = data.class_limit;
           }

           if (classobj.cost != data.cost) {
             classobj.cost = data.cost;
           }

           if (classobj.isPending != data.isPending) {
             classobj.isPending = data.isPending;
           }

           if (classobj.color != data.color) {
             classobj.color = data.color;
           }

           return classobj.save();
         })
         .catch(function (err) {
           console.log(err);
         });
}

var Class = mongoose.model('Class', ClassSchema);

module.exports = Class;
