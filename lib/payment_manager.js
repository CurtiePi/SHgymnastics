var PaymentLog = require('../models/payment_logger');
var PaymentManager = {

  calcClassCost: function(classObj) {
    var cost = classObj.cost;

    var sessions = classObj.session_count;
    var sessionsLeft = classObj.sessions_left;
    var proRatedCost = sessionsLeft/sessions * cost;

    return proRatedCost.toFixed(2);
  },

  getDiscountAmount: function(accountObj, fee) {
    //TODO get the limit from db for now set to 1
    var threshold = 1;
    var discount_pct = 0;

    if (accountObj.gymnists.length > threshold) {
      var discount_pct = .3;
    }   

    var discount_amt = discount_pct * fee;
    return discount_amt.toFixed(2);   
  },

  chargeAccount: function(accountObj, amount) {
    var accountPromise = accountObj.updateBalance(amount);
    return accountPromise;
  },

  chargeClassSignup: function(gymnistObj, classObj) {
    var class_fee = this.calcClassCost(classObj);
    var discount_amt = 0;

    var accountObj = gymnistObj.account;

    discount_amt = this.getDiscountAmount(accountObj, class_fee);      

    class_fee -= discount_amt; 

    accountObj.updateBalance(class_fee);

    var data = {account_id: accountObj._id.toString(),
                account_name: accountObj.fname + ' ' + accountObj.lname,
                payment_type: 'DEBIT',
                payment_reason: 'CLASS',
                payment_amount: class_fee,
                discount_amount: discount_amt};

    return PaymentLog.create(data);
  },

  chargeTransferClass: function(gymnistObj, oldClassObj, newClassObj) {
    var old_class_fee = this.calcClassCost(oldClassObj);
    var new_class_fee = this.calcClassCost(newClassObj);

    var accountObj = gymnistObj.account;

    var discount_amt = 0;
    discount_amt = this.getDiscountAmount(accountObj, new_class_fee);
    new_class_fee -= discount_amt;
      
    var class_fee = new_class_fee - old_class_fee;

    accountObj.updateBalance(class_fee);

    var data = {account_id: accountObj._id.toString(),
                account_name: accountObj.fname + ' ' + accountObj.lname,
                payment_type: 'DEBIT',
                payment_reason: 'XFERCLASS',
                payment_amount: class_fee,
                discount_amount: discount_amt};

    return PaymentLog.create(data);
  },

  chargeGymnistEnrollment: function(accountObj) {
    //TODO: Get enrollment fee; for now set to 250
    var enrollment_fee = 250;

    
    accountObj.updateBalance(enrollment_fee);


    var data = {account_id: accountObj._id.toString(),
                account_name: accountObj.fname + ' ' + accountObj.lname,
                payment_type: 'DEBIT',
                payment_reason: 'ENROLL',
                payment_amount: enrollment_fee};

    return PaymentLog.create(data);
  }
};

module.exports = PaymentManager;
