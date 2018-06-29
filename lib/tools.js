var nodemail = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../config');
module.exports = {

  sendResetEmail: function (content, recipients) {
    var transporter = nodemail.createTransport(smtpTransport({
        service: 'SendGrid',
        auth: {
            user: config.sgUser,
            pass: config.sgPass
        }
    }));

    var mailOptions = {
        from: 'noreply@shanghaigymnastics.com;',
        to: recipients,
        subject: 'Password Reset',
        html: content,
    };

    transporter.sendMail(mailOptions, function (error, info) {
           if (error){
               console.log('Error: ' + error);
           }

           console.log('Message %s sent: %s', info.messageId, info.response);
    })
  },

  createResetLink: function(req, hash) {
       var link = req.protocol + '://' + req.get('host') + '/resetpwd?';
       link += 'hc=' + hash;
       var today = new Date();
       today.setHours(today.getHours() + 1);
       link += '&dl=' + today.getTime();

       return link;
  }

}
