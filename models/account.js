var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = require('mongodb').ObjectID;

var Gymnist = require('./gymnist');
var Gymnasium = require('./gymnasium');

var AccountSchema = new Schema({
  lname: {
    type: String,
    required: true,
    trim: true
  },
  fname: {
    type: String,
    required: true,
    trim: true
  },
  account_no: {
    type: String,
    unique: true,
    required: true,
  },
  contact_address: {
    type: String,
    required: true,
    trim: true
  },
  contact_phone_1: {
    type: String,
    required: true,
    trim: true
  },
  contact_phone_2: {
    type: String,
    trim: true
  },
  contact_email: {
    type: String,
    required: true,
    trim: true
  },
  gymnists: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gymnist'}],
  gymnasiums: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gymnasium'
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
  latest_enrollment_date: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  balance_due: {
    type: Number,
    default: 0.0
  }
});

AccountSchema.options.toObject = {
  virturals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
}

AccountSchema.statics.getAccounts = function() {
  console.log('Finding accounts');
  var query = Account.find({})
                     .populate('gymnasiums');

  return query.exec();
};

AccountSchema.statics.getOneAccount = function (data) {
  return Account.findById(data)
         .populate('gymnists')
         .populate('gymnasiums')
         .exec();
}

AccountSchema.statics.updateAnAccount = function (acct_id, data) {
  var aid = new ObjectID(acct_id);

  var findPromise =  Account.findById({_id: aid}) .exec();

  return findPromise.then( function (account) {

           if (account.fname != data.fname) {
             account.fname = data.fname;
           }

           if (account.lname != data.lname) {
             account.lname = data.lname;
           }

           if (account.account_no != data.account_no) {
             account.account_no = data.account_no;
           }

           if (account.gymnasiums != data.gymnasiums) {
             account.gymnasiums = data.gymnasiums;
           }

           if (account.contact_address != data.contact_address) {
             account.contact_address = data.contact_address;
           }

           if (account.contact_phone_1 != data.contact_phone_1) {
             account.contact_phone_1 = data.contact_phone_1;
           }

           if (account.contact_phone_2 != data.contact_phone_2) {
             account.contact_phone_2 = data.contact_phone_2;
           }

           if (account.account_no != data.account_no) {
             account.contact_email = data.contact_email;
           }

           data.isActive = data.isActive == "on" || data.isActive;
           if (account.isActive != data.isActive) {
             account.isActive = data.isActive;
           }

           return account.save();
         })
         .catch(function (err) {
           console.log(err);
         });
}

AccountSchema.statics.addGymnist = function (acct_id, gymnist_id) {
  var aid = (typeof acct_id == "String") ? new ObjectID(acct_id) : acct_id;
  var gid = (typeof gymnist_id == "String") ? new ObjectID(gymnist_id): gymnist_id;
  
  var query =  Account.findOneAndUpdate({_id: aid}, {"$push": {gymnists: gid} });
  return query.exec();
};

AccountSchema.statics.removeGymnist = function (acct_id, gymnist_id) {
  var aid = (typeof acct_id == "String") ? new ObjectID(acct_id) : acct_id;
  var gid = (typeof gymnist_id == "String") ? new ObjectID(gymnist_id): gymnist_id;
  
  var query =  Account.findOneAndUpdate({_id: aid}, {"$pull": {gymnists: gid} });
  return query.exec();
};

AccountSchema.statics.transferGymnist = function (old_acct_id, new_acct_id, gymnist_id) {
  
  removePromise = Account.removeGymnist(old_acct_id, gymnist_id);
  addPromise = Account.addGymnist(new_acct_id, gymnist_id);

  removePromise.then(function (account) {
    console.log("Gymnist removed from account");
    return addPromise;
  })
  .then(function (account) {
    console.log("Gymnist added to account");
  })
  .catch(function (err) {
    console.log(err);
  });
  
};

AccountSchema.methods.updateBalance = function(amt) {
  var query = this.model('Account')
                  .updateOne({ "_id": new ObjectID(this.id) }, {$inc: {balance_due: amt } });

  return query.exec();
}

var Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
