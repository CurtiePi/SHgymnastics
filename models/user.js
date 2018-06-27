var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;


var PWResetSchema = new Schema ({
  hash: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    trim: true
  }
});

var PWReset = mongoose.model('PWReset', PWResetSchema);

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

UserSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret.__v;
  }
};

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

UserSchema.statics.getCoaches = function() {
  console.log('Finding coaches');
  var query = User.find({role: 'COACH' });

  return query.exec()
              .catch(function (err) {
                console.log("Error: User model getCoaches function");
                console.log(err);
              });
};

UserSchema.statics.getUserByEmail = function(email) {
  console.log('Finding user');
  var query = User.findOne({ email: email });

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

UserSchema.statics.getUserToReset = function (hash) {
  var resetPromise =  PWReset.findOne({hash: hash}).exec();

  return resetPromise.then(function (reset) {
    if (!reset) {
       console.log("Returning a rejection promise");
       return new Promise((resolve, reject) => {
        reject(new Error("User cannot reset password at this time."));
      });
    }

     console.log("Returning a user promise");
     return User.findOne({_id: reset.user_id}).exec();
  })
  .catch (function (err) {
    console.log(err.message);
  });
};

UserSchema.methods.clearReset = function () {
  var resetPromise = PWReset.remove({user_id: this._id}).exec();

  resetPromise.then(function (result) {
    console.log("Reset cleared of user");
  })
  .catch (function (err) {
    console.log("Error while trying to clear reset of user");
    console.log(err);
  });
};

UserSchema.statics.clearUserReset = function (hash) {
  PWReset.remove({hash: hash}).exec();
};

UserSchema.methods.storeHash = function(hash) {
  return PWReset.create({hash: hash,
                         user_id: this._id});
};

UserSchema.methods.resetPassword = function(newpwd) {
  this.password = newpwd;
  this.save();
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
