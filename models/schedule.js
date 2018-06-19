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
  begin: {
    type: Date,
    required: true
  },
  finish: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
});

ScheduleSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    var sd = ret.begin.getFullYear() + "-" + (1 + ret.begin.getMonth()) + "-" + ret.begin.getDate() + " " + ret.begin.getHours() + ":" + ret.begin.getMinutes();

    var ed = ret.finish.getFullYear() + "-" + (1 + ret.finish.getMonth()) + "-" + ret.finish.getDate() + " " + ret.finish.getHours() + ":" + ret.finish.getMinutes();

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

    if (schedule.begin != data.begin) {
      schedule.begin = data.begin;
    }

    if (schedule.finish != data.finish) {
      schedule.finish = data.finish;
    }

    if (schedule.notes != data.notes) {
      schedule.notes = data.notes;
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
  outputObj.begin = data.start_date;
  outputObj.finish = data.end_date;
  outputObj.notes = data.notes;

  return outputObj;
};

ScheduleSchema.statics.getScheduledClasses = function() {
  return Schedule.find({}).exec();
};

ScheduleSchema.statics.removeSchedule = function(sched_id) {
  var sid = new ObjectID(sched_id);

  return Schedule.findByIdAndRemove(sid)
                 .exec();
};

var Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;
