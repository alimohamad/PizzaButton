/*This is the button we're going to use: https://www.sparkfun.com/products/9181 */

const twilio = require('twilio');
const accountSid = ;
const authToken = ;
const client = new twilio(accountSid, authToken);
const db = require('monk')('mongodb:');
const customers = db.get('customers');
const http = require('http');
const express = require('express');
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var mongo = require('./mongo.js');
//const VoiceResponse = require('twilio').twiml.VoiceResponse;
//const ClientCapability = require('twilio').jwt.ClientCapability;
//var router = require('express').Router();
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }), session({secret: 'pizzabutton'}));




app.get('/token',function (req, res){
  const appSid = 'AP14d251598d5c32dc083bc113f406418';
  const capability = new ClientCapability({
    accountSid: accountSid,
        authToken: authToken,
  });
  capability.addScope(new ClientCapability.OutgoingClientScope({applicationSid: appSid}));
  capability.addScope(new ClientCapability.IncomingClientScope('joey'));
  const token = capability.toJwt();
  res.set('Content-Type', 'application/jwt');
  res.send(token);
});


app.post('/sms', function(req, res){
  var twiml = new MessagingResponse();
  if (req.body.Body.toLowerCase().indexOf('register') === 0)
  {
    req.session.userAction = 'register';
    var numberExists = false;

      if(!numberExists)
      {
        var userMessage = req.body.Body;
        twiml.message('Thanks for joining PizzaButton! Please reply with your first and last name and your default pizza order.');
          req.session.userAction = 'register';
      }
      
      else
      {		
        twiml.message('Your tastes have changed? Update your order now!');
        req.session.userAction = 'update';
      }
	  	
  }

  else if (req.body.Body.toLowerCase().indexOf('order') == 0)
  {
//    req.session.userAction = 'order';
    twiml.message('Hit the button to confirm your order!');  
/* client.calls.create({
url: 'https://handler.twilio.com/twiml/ehcd59a219edb53ebee74edc3cf29c8948', 
to: '',
from: '+17325323298',}).then(call =>process.stdout.write(call.sid));*/
client.calls
  .create({
    url: 'https://handler.twilio.com/twiml/EHcd59a219edb53ebee74edc3cf29c8948',
    to: '',
    from: '+17325323298',
  }, function (err, call)
{
  if (err)
  {console.log(err);
  }
  else
  {
    console.log(call.sid)
  }
});


  
  
  
  }
 
  //user has already texted, this is the follow up action
    else
    {
      console.log(req.session.userAction);
      if (req.session.userAction === 'register')
        {
            //twiml.message('Your pizza profile has been created!')
            var data = req.body.Body.split(' ');
            var phoneNumber = req.body.From;
            var firstName = data[0];
            var lastName = data[1];
            var defaultOrder = "";
            for (i=2; i<data.length; i++)
            {
                defaultOrder += data[i] + " ";
            }

            customers.insert({ 
                "phoneNumber":  phoneNumber,
                "firstName": firstName,
                "lastName": lastName,
                "defaultOrder": defaultOrder,
                "order": "1"
            });    
        }
        else if (req.session.userAction === 'update')
        {
            twiml.message('Your pizza profile has been updated!')
            var defaultOrder = req.body.Body;
           customers.update({"phoneNumber": phoneNumber},{"defaultOrder": defaultOrder});
        }
    }

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});


/*if(req.session.userAction === 'order')
{
      client.calls.create({
url: 'https://handler.twilio.com/twiml/EHcd59a219edb53ebee74edc3cf29c8948', 
to: '+17327591778',
from: '+17325323298',}).then(call =>process.stdout.write(call.sid))};

*/
     

http.createServer(app).listen(1337, function () {
    console.log("Express server listening on port 1337");
});
