var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var possibleRoles = ['ADMIN', 'STAFF', 'COACH', 'USER'];
var defaultRole = 'STAFF';

var RoleSchema = new Schema ({
  title: {
    type: String,
    enum: possibleRoles,
    default: defaultRole
  }
});


RoleSchema.statics.getRoles = function(Role) {
  return possibleRoles;
};

RoleSchema.statics.getDefault = function(Role) {
  return defaultRole;
};

var Role = mongoose.model('Role', RoleSchema);
module.exports = Role;
