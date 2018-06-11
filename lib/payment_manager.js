var PaymentManager = {

  calcClassCost: function(classObj) {
    var cost = classObj.cost;
    console.log("This class costs: " + cost + " RMB");
    var sessions = classObj.session_count;
    var sessionsLeft = classObj.sessions_left;
    var proRatedCost = sessionsLeft/sessions * cost;
    console.log("This class's pro rated costs: " + proRatedCost + " RMB\n");
  },

  chargeAccount: function(accountObj) {
    var accountPromise = accountObj.updateBalance(20);
    return accountPromise;
  }
};

module.exports = PaymentManager;
