var express = require('express');
var router = express.Router();

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-config.json');
var ses = new AWS.SES({region: 'eu-west-1', apiVersion: '2010-12-01'});


router.post('/', function(req, res, next) {
  const myEmail = 'rawmarzipan@gmail.com';

  var message = "<h1>From:</h1><h3>Name: " + req.body.name
                    + "</h3><h3>Email: " + req.body.email
                    + "</h3><h1>Message:</h1><p>" +  req.body.message
                    + "</p>";

  ses.sendEmail({
    Source: myEmail,
    Destination: { ToAddresses: [myEmail] },
    Message: {
      Subject: {
        Data: 'marzipan-design.com'
      },
      Body: {
        Html: {
          Data: message
        }
      }
    }
  }, function(err, data) {
    if(err) throw err
      console.log('Email sent');
  });

  setTimeout(function() {
    res.redirect('..');    
  }, 2000);
});


module.exports = router;
