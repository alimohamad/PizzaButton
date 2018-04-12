// THIS IS PROMISELESS

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://sara:123456@ds255797.mlab.com:55797/pizza-button-db';
const twilio = require('twilio');
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;


exports.mongo = function(action){ // I AM A FUCKING GOD, THIS METHOD DOES EVERYTHING FOR MONGO
    
    //THESE FUNCTIONS ARE WHAT TWILIO NEEDS
    if(action.name == 'numExists'){ // Checks User Action (Number Query); 
         MongoClient.connect(url, function(err, db) { // Mongo Client
             var pizzaButtonDB = db.db('pizza-button-db');
             assert.equal(null, err);
             console.log("Connected correctly to server: Checking Num");
        
             findUser(pizzaButtonDB, function(array){ // THIS IS THE CALLBACK FROM METHOD OF GET REQUEST
                    numberExists(array); // Call numberExists and check if phone number is not in database and send appropriate TWIML code
                 db.close(); //Close DB
             });
         });    
     }    
    else if(action.name == 'addNewUser'){ //Checks User Action (Add User);
         MongoClient.connect(url, function(err, db) {
             var pizzaButtonDB = db.db('pizza-button-db');
             assert.equal(null, err);
             console.log("Connected correctly to server: Inserting User");
             
             addUser(pizzaButtonDB, function(){ // THIS IS THE CALLBACK FROM THE POST REQUEST (Will probably need to add TWIML thing here for new user confirmeation);
                 //Insert New User Confirmation helper call here
                 db.close(); //Close DB
             });         
         });    
    }
    
    //THESE FUNCTIONS ARE GENERAL HELPERS
    var numberExists = function(x){ // X is the array of queries returned
    
        if(x.length > 0){
            twiml.message('Your tastes have changed? Update your order now!');
            req.session.userAction = 'update';
        }
        else{
            twiml.message('Thanks for joining PizzaButton! Please reply with your first and last name and your default pizza order.');
            req.session.userAction = 'register';    
        }
    
}
    var userConfirmation = function(){}
    
    //THESE FUNCTIONS CARRY OUT MONGO'S DOING
    var findUser = function(db, callback) { // FIND DOCUMENTS
        //PUT THE SESSION SET HERE
        var customers = db.collection('customers');
        customers.find({phoneNumber: action.param}).toArray(function(err, docs) { // Mongo Find Calll
            assert.equal(err, null);
            callback(docs);
        });
    }
    var addUser = function(db, callback) { // ADD DOCUMENT
        var customers = db.collection('customers');
        customers.insertOne(action.param, function(err, result) { // Mongo Insert Call
            assert.equal(err, null);
            console.log("Inserted " + action.param.phoneNumber);
            callback(result);
        });
    }

    
}

