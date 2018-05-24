var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  role: {type: String,
        trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

UserSchema.statics.listUsers = function(callback) {
  console.log('Finding users');
  User.find({}).
    exec(function(error, users) {
     if (error) {
       return callback(error);
     }

     return callback(null, users);
  });
};

UserSchema.statics.listStaff = function() {
  console.log('Finding staff');
  var query = User.find({role: { $in: ['ADMIN', 'STAFF'] } });

  return query.exec();
};

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err);
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          var err = {msg: 'Password is incorrect for the email address.'};
          return callback(err, null);
        }
      });
    });
};

UserSchema.statics.isAdminRole = function (userId, callback) {
  User.findOne({_id: userId})
    .exec(function (err, user) {
      if (err) {
        return callback(err, false);
      }

      if(!user) {
        return callback(null, false);
      } else {
        var result = user.role == 'ADMIN';
        return callback(null, result);
      }
    });
};

UserSchema.pre('save', function (next) {
  var user = this;
  console.log('Presave the user to hash the password');

  if(user.isModified('password')) {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    })
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
