var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Contact = require('./contact.js');

var EmergencyContactSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  }
});

var EmergencyContact = Contact.discriminator('EmergencyContact', EmergencyContactSchema);

module.exports = mongoose.model('EmergencyContact');
