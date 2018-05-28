var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var options = { discriminatorKey: 'ctype' };

var ContactSchema = new Schema({
  email: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
  }
}, options);

var Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
