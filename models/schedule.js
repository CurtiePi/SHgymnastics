var mongoose = require('mongoose');
var df = require('dateformat');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

var ScheduleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  class_id: {
    type: String,
    required: true,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  event_pid: {
    type: String,
    trim: true,
    default: 0
  },
  event_length: {
    type: Number
  },
  rec_pattern: {
    type: String,
    trim: true
  },
  rec_type: {
    type: String,
    trim: true
  }
});

ScheduleSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    var sd = ret.start_date.getFullYear() + "-" + (1 + ret.start_date.getMonth()) + "-" + ret.start_date.getDate() + " " + ret.start_date.getHours() + ":" + ret.start_date.getMinutes();

    var ed = ret.end_date.getFullYear() + "-" + (1 + ret.end_date.getMonth()) + "-" + ret.end_date.getDate() + " " + ret.end_date.getHours() + ":" + ret.end_date.getMinutes();

    ret.id = ret._id.toString();
    ret.text = ret.title;
    ret.start_date = sd;
    ret.end_date = ed;
    delete ret._id;
    delete ret.__v;
    delete ret.begin;
    delete ret.finish;
  }
}

ScheduleSchema.statics.updateSchedule = function(sched_id, data) {
  var sid = new ObjectID(sched_id);

  var findPromise = Schedule.findById({_id: sid}).exec();

  return findPromise.then(function (schedule) {

    if (schedule.start_date != data.start_date) {
      schedule.start_date = data.start_date;
    }

    if (schedule.end_date != data.end_date) {
      schedule.end_date = data.end_date;
    }

    if (schedule.event_pid != data.event_pid) {
      schedule.event_pid = data.event_pid;
    }

    if (schedule.event_length != data.event_length) {
      schedule.event_length = data.event_length;
    }

    if (schedule.rec_pattern != data.rec_pattern) {
      schedule.rec_pattern = data.rec_pattern
    }

    if (schedule.rec_type != data.rec_type) {
      schedule.rec_type = data.rec_type;
    }

    if (schedule.class_id != data.class_id) {
      schedule.class_id = data.class_id;
    }

    if (schedule.title != data.title) {
       schedule.title = data.title;
    }

    schedule.save();
  })
  .catch(function (err) {
    console.log(err);
  });
}

ScheduleSchema.statics.marshallData = function (data) {
  var outputObj = {};

  outputObj.title = data.text;
  outputObj.class_id = data.class_id;
  outputObj.start_date = data.start_date;
  outputObj.end_date = data.end_date;
  outputObj.event_pid= data.event_pid;
  outputObj.event_length = data.event_length;
  outputObj.rec_pattern = data.rec_pattern;
  outputObj.rec_type = data.rec_type;

  return outputObj;
};

ScheduleSchema.statics.getScheduledClasses = function() {
  return Schedule.find({})
                 .exec()
                 .catch(function (err){
                   console.log("Error: Schedule model getScheduledClasses function");
                   console.log(err);
                 });
};

ScheduleSchema.statics.removeSchedule = function(sched_id) {
  var sid = new ObjectID(sched_id);

  return Schedule.findByIdAndRemove(sid)
                 .exec();
};

var Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;
