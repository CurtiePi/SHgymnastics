module.exports = {
  validateNewUserInfo: function (req, res, next) {
    console.log('Checking parameters now.');
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email address').isEmail().trim().normalizeEmail();
    req.checkBody('password', 'Password must be from 8 and 10 characters, and contain at least one digit and one alphabetic character, and must not contain special characters').matches(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,10})$/);

    var errors = req.validationErrors();
    console.log('Parameters have been checked.');
    if(errors) {
    console.log('Errors have been found. Redirect!');
      req.session.errors = errors;
      res.redirect('back');
    } else {

      console.log('No errors have been found. Continue!');
      next();
    }
  },

  protect: function (req, res, next) {
    //TODO: change this check to something better!!!!
    console.log(req.path);
    if (req.session && req.session.userId) {
      console.log('Not going where I should not be going!');
      return next();
    } else {
      console.log('Going where I do not belong!');
      res.redirect('/login');
    }
  }
}
