var PaymentLog = require('../models/payment_logger');
var PaymentManager = {

  calcClassCost: function(classObj) {
    var cost = classObj.cost;

    var sessions = classObj.session_count;
    var sessionsLeft = classObj.sessions_left;
    var proRatedCost = sessionsLeft/sessions * cost;

    return proRatedCost.toFixed(2);
  },

  qualifyForEnrollDiscount: function(accountObj) {
    //TODO get the limit from db for now set to 1
    var threshold = 1;
    return accountObj.gymnists.length > threshold;
  },

  chargeAccount: function(accountObj, amount) {
    var accountPromise = accountObj.updateBalance(amount);
    return accountPromise;
  },

  chargeClassSignup: function(gymnistObj, classObj) {
    var class_fee = this.calcClassCost(classObj);

    var accountObj = gymnistObj.account;
    accountObj.updateBalance(class_fee);


    var data = {account_id: accountObj._id.toString(),
                account_name: accountObj.fname + ' ' + accountObj.lname,
                payment_type: 'DEBIT',
                payment_reason: 'CLASS',
                payment_amount: class_fee};

    return PaymentLog.create(data);

  },

  chargeGymnistEnrollment: function(accountObj) {
    //TODO: Get enrollment fee; for now set to 250
    var enrollment_fee = 250;
    var discount_amt = 0;

    //TODO: Check if this is the first gymnist for the account
    //TODO: If not the first student for account apply discountd
    if ( this.qualifyForEnrollDiscount(accountObj) ) {
      //TODO: Get discount percentage; for now set to 30%
      var discount_pct = .3;
      discount_amt = discount_pct * enrollmentFee;      
    }

    enrollment_fee -= discount_amt; 
    
    accountObj.updateBalance(enrollment_fee);


    var data = {account_id: accountObj._id.toString(),
                account_name: accountObj.fname + ' ' + accountObj.lname,
                payment_type: 'DEBIT',
                payment_reason: 'ENROLL',
                payment_amount: enrollment_fee,
                discount_amount: discount_amt};

    return PaymentLog.create(data);
  }
};

module.exports = PaymentManager;
