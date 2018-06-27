var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = require('./account');

var GymnasiumSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  branch_name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  accounts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Account'}],
});

GymnasiumSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    var acct = ret.accounts;
    ret.accounts = [];
    for (var idx = 0; idx < acct.length; idx++) {
      ret.accounts.push(acct[idx].toString());
    }
    delete ret._id;
    delete ret.__v;
  }
}

GymnasiumSchema.statics.getGymnasiums = function() {
  console.log('Finding accounts');
  var query = Gymnasium.find({})
                       .populate('accounts');

  return query.exec()
               .catch(function (err){
                  console.log("Error: Gymnasium model getGymnasiums function");
                  console.log(err);
               });
};

GymnasiumSchema.statics.insertAccount = function(gym_id, acct_id) {
  console.log('Finding accounts');
  var query = Gymnasium.findOneAndUpdate({"_id": gym_id}, {"$push": { "accounts": acct_id}});

  return query.exec();
};

var Gymnasium = mongoose.model('Gymnasium', GymnasiumSchema);
module.exports = Gymnasium;
