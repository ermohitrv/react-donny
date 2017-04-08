const Experts = require('../models/experts');
const ExpertsSubcategories = require('../models/expertssubcategories');
const AudioSession = require('../models/audiosession');
const User = require('../models/user');
const config = require('../config/main');

//included opentok api files
var OpenTok = require('../lib_opentok/opentok');

// Initialize OpenTok
var opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

//= =======================================
// Session Routes
//= =======================================

/* API endpoint to create video session */
exports.createAudioSession = function(req, res, next) {
  console.log(req.body.expertEmail + ' - '+req.body.userEmail);
  const expertEmail = req.body.expertEmail;
  const userEmail   = req.body.userEmail;

  opentok.createSession(function(err, session) {
    if(!err){
      var token = opentok.generateToken(session.sessionId);
      res.json({ session: session, token : token });
    }else{
      res.json({err: err});
    }
  });
  /*
  console.log(req.body.email);
  const expertEmail = req.body.expertEmail;
  const userEmail   = req.body.userEmail;

  User.findOne({ email }, (err, existingUser) => {
    if (err) { return next(err); }

    // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'That email address is already in use.' });
    }

  });*/
};

/* API endpoint to render expert details */
exports.createAudioSession = function(req, res, next) {  console.log(req.body.email); };
