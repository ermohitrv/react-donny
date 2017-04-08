const stripeConfig = require('../config/stripe');
const config = require('../config/main');
const stripe = require('stripe')(config.stripeApiKey);
const User = require('../models/user');
const Videosession = require('../models/videosession');

/*
function to recharge account before starting session
percentage amount to admin will be transferred at same time
*/
exports.rechargeVideoSession = function (req, res, next) {
  var token = req.body.stripeToken.id; // Using Express
  var expertEmail = req.body.expertEmail;
  var amount = req.body.amount;

  console.log('** ** ** expertEmail: '+expertEmail);
  if (token) {

    var percentageAmount = (config.stripePaymentAdminPercentage / 100) * amount;

    stripe.charges.create({
     amount: amount,
     currency: config.stripePaymentCurrencyCode,
     source: token,
     application_fee: percentageAmount,
    }, {
     stripe_account: "acct_1A3GaLILYsSoYQ7A", //expert connected account id  :donny
    }, function(err, charge){
      if(err){
        res.json(err);
      } else {
        res.status(200).json(charge);
      }
    });
  }else{
    res.status(400).json({"error":"empty parameters"});
  }
};

/*
function to check whether user has made the payment before going to start session
*/
exports.checkBeforeSessionStart = function (req, res, next) {
  var expertEmail = req.body.expertEmail;
  var userEmail = req.body.userEmail;

  console.log('** ** ** expertEmail: '+expertEmail);
  console.log('** ** ** userEmail: '+userEmail);

  if (expertEmail && userEmail) {
    Videosession.findOne({'expertEmail': expertEmail, 'userEmail': userEmail, 'sessionCompletionStatus' : "UNCOMPLETED" },function(err, session){
      if(!err && ( session != null && session != undefined ) ){
        res.json({'session':session});
      }else{
        res.json({'session':session, 'error': err});
      }
    })
  }else{
    res.status(400).json({"error":"empty parameters"});
  }
};
