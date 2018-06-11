var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EnrollmentSchema = new Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  enrollment_date: {
    type: Date,
    required: true
  }
});

var Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

module.exports = Enrollment;
