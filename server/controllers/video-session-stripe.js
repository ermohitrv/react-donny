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
  var userEmail = req.body.userEmail;
  var amount = req.body.amount;
  var durationBought = 0;
  if (token) {

    var percentageAmount = (config.stripePaymentAdminPercentage / 100) * amount;
    durationBought = amount;
    amount = amount*100;    //cents
    percentageAmount = percentageAmount*100;  //cents

    console.log('****** ****** amount: '+amount);
    console.log('****** ****** percentageAmount: '+percentageAmount);

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

        var videoObj = new Videosession();
        videoObj.userEmail = userEmail;
        videoObj.stripePaymentStatus = charge.status;
        videoObj.stripePaymentAmount = (charge.status/100);
        videoObj.stripePaymentId = charge.id;
        videoObj.stripePaymentCreationTime = charge.created;
        videoObj.stripePaymentCardLast4 = charge.source.last4;
        videoObj.stripePaymentApplication = charge.application;
        videoObj.stripePaymentApplicationFee = charge.application_fee;
        videoObj.stripePaymentBalanceTransaction = charge.balance_transaction;
        videoObj.sessionCompletionStatus = "UNCOMPLETED";
        videoObj.save(function (err, saved) {
            if (err) {
                res.status(200).json({error:err,response:null});
            } else {
                res.status(200).json({error:null,response:saved});
            }
        });
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
  var userEmail = req.body.userEmail;
  if (userEmail) {
    Videosession.findOne({'userEmail': userEmail, 'sessionCompletionStatus' : "UNCOMPLETED" },function(err, session){
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
