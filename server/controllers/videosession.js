const Experts = require('../models/experts');
const ExpertsSubcategories = require('../models/expertssubcategories');
const VideoSession = require('../models/videosession');
const AudioSession = require('../models/audiosession');
const User = require('../models/user');
const config = require('../config/main');
var nodemailer = require("nodemailer");
var moment = require("moment")

//included opentok api files
var OpenTok = require('../lib_opentok/opentok');

// Initialize OpenTok
var opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

//= =======================================
// Session Routes
//= =======================================

/* API endpoint to create video session by expert */
exports.createVideoSession = function(req, res, next) {
  console.log(req.body.expertEmail);
  const expertEmail = req.body.expertEmail;
  const userEmail = req.body.userEmail;
  const sessionOwner = req.body.sessionOwner;

  if(sessionOwner === true){

    User.findOne({ email : expertEmail, role : 'Expert', enableAccount : true }, (err, existingUser) => {
      if (err) {
        console.log('err if 1');
        return next(err);
      }
      //console.log('existingUser: '+existingUser+' ------- end existingUser');

      if (existingUser && !err) {

        VideoSession.findOne({  expertEmail : expertEmail, sessionStatus : 'ACTIVE', sessionId : { $not : { $type : 10 }, $exists : true } },function(err, sessionInfo){
          if (sessionInfo && !err) {

            res.json({ sessionId: sessionInfo.sessionId, token : sessionInfo.sessionExpertToken, err : "" });

          }else{

            var date1 = new Date (),
              expireTime = new Date ( date1 );
              expireTime.setMinutes ( date1.getMinutes() + 5600 );

            opentok.createSession(function(err, session) {

                //  Use the role value appropriate for the user:
                var tokenOptions = {};
                tokenOptions.role = "publisher";
                tokenOptions.data = "username="+existingUser.slug;
                tokenOptions.expireTime = moment(expireTime).unix();  //30 minutes expirty set to token

                // Generate a token.
                var token = opentok.generateToken(session.sessionId,tokenOptions);

                //addition of new record to table
                var newConVideo = new VideoSession();
                newConVideo.sessionId = session.sessionId;
                newConVideo.sessionExpertToken = token;
                newConVideo.sessionStatus = "ACTIVE";
                newConVideo.expertEmail = expertEmail;
                newConVideo.userEmail = userEmail;

                newConVideo.save(function (err) {
                    if (err) {
                        console.log("error: " + err);
                        res.json({ err : err, sessionId : "", token : ""});
                    } else {
                        console.log("else 1");
                        res.json({ err : "", sessionId : session.sessionId, token : token});
                    }
                });
            });

          }

        });

      }
    });

  } else {

    VideoSession.findOne({expertEmail : expertEmail, sessionId : { $not : { $type : 10 }, $exists : true } },function(err, sessionInfo){
      if(!err && sessionInfo ){

        var date1 = new Date (),
          expireTime = new Date ( date1 );
          expireTime.setMinutes ( date1.getMinutes() + 5600 );

        //  Use the role value appropriate for the user:
        var tokenOptions = {};
        tokenOptions.role = "publisher";
        tokenOptions.expireTime = moment(expireTime).unix();  //30 minutes expirty set to token

        // Generate a token.
        var token = opentok.generateToken(sessionInfo.sessionId,tokenOptions);

        res.json({ sessionId: sessionInfo.sessionId, token : token, err : "" });

      }else{

        console.log("else 3");
        res.status(400).json({ err : "session is not active from expert end", sessionId : "", token : ""});
      }
    });
  }
};

/* API endpoint to extend video session by user for specific time based on timestamp */
exports.extendSession = function(req, res, next) {
  const expertEmail = req.body.expertEmail;
  const userEmail = req.body.userEmail;
  const sessionOwner = req.body.sessionOwner;
  const sessionExtendTime = req.body.sessionExtendTime;

  VideoSession.findOne({expertEmail : expertEmail, userEmail : userEmail, sessionId : { $not : { $type : 10 }, $exists : true } },function(err, sessionInfo){
    if(!err && sessionInfo ){

      var date1 = new Date (),
        expireTime = new Date ( date1 );
        expireTime.setMinutes ( date1.getMinutes() + 5600 );

      var tokenOptions = {};
      tokenOptions.role = "publisher";
      tokenOptions.expireTime = moment(expireTime).unix();  //30 minutes expirty set to token

      var token = opentok.generateToken(sessionInfo.sessionId,tokenOptions);
      sessionInfo.sessionUserToken = token;
      sessionInfo.sessionPurchasedDuration = '30 min';
      sessionInfo.save(function (err) {
        if(!err){
          console.log('if 3');
          res.json({ sessionId: session.sessionId, token : token, err : "" });
        }else{
          res.json({err: 'error while saving token to database', sessionId: '', token : '' });
        }
      });
    }
  });

  if( ( sessionExtendTime != undefined && sessionExtendTime != "" ) && ( sessionId != undefined && sessionId != "" ) ){

    User.findOne({ email : expertEmail, role : 'Expert', enableAccount : true }, (err, user) => {
      if (err) {
        return next(err);
      }
      if(user){
        // Generate a token.

        user.sessionId      = sessionId;
        user.sessionToken   = token;
        user.sessionStatus  = "ACTIVE";
        user.save(function (err) {
          if(!err){
            console.log('if 3');
            res.json({ sessionId: session.sessionId, token : token, err : "" });
          }else{
            res.json({err: err});
          }
        });
      }
    });
  }else{
    res.json({err: 'missing parameters'});
  }
};

/* API endpoint to join video session by user */
exports.joinVideoSession = function(req, res, next) {

  console.log('expertSlug: '+req.body.slug);
  const expertSlug = req.body.slug;

  User.findOne({ slug : expertSlug, role : 'Expert', enableAccount : true  }, (err, expert) => {
    if (err) {
      return next(err);
    }

    if (expert) {

      console.log('if 1');
      if( expert.sessionId ){
          //opentok.createSession(function(err, expert.sessionId) {
            console.log('if 2 join : '+expert.sessionId);
            //if(!err){
              var token = opentok.generateToken(expert.sessionId);
              /*existingUser.sessionId      = session.sessionId;
              existingUser.sessionToken   = token;
              existingUser.sessionStatus  = "ACTIVE";
              existingUser.save(function (err) {
                if(!err){
                  console.log('if 3');
                  res.json({ session: session, token : token, err : "" });
                }else{
                    res.json({err: err});
                }
              });*/
              res.json({ session: expert.sessionId, token : token, err : "" });
              //res.json({ session: "", token : "", err : "" });
            //}else{
            //  res.json({err: err});
            //}
          //});
      }else{
        console.log('else 1');
        res.json({sessionId:'',token:'',err: '2 error'});
      }
    }else{
      console.log('else 2');
      res.json({sessionId:'',token:'',err: '1 error'});
    }
  });
};

/* API endpoint to create audio session */
exports.createAudioSession = function(req, res, next) {

  const expertEmail = req.body.expertEmail;
  const userEmail = req.body.userEmail;
  //const sessionOwner = req.body.sessionOwner;

  AudioSession.findOne({  expertEmail : expertEmail, sessionId : { $ne : ''} },function(err, sessionInfo){
      if (sessionInfo) {
        var token = opentok.generateToken(sessionInfo.sessionId);
        return res.json({ sessionId: sessionInfo.sessionId, token : token, err : "" });
      }else{

        var date1 = new Date (),
          expireTime = new Date ( date1 );
          expireTime.setMinutes ( date1.getMinutes() + 5600 );

        opentok.createSession(function(err, session) {

            //  Use the role value appropriate for the user:
//                var tokenOptions = {};
//                tokenOptions.role = "publisher";
//                tokenOptions.data = "username="+existingUser.slug;
//                tokenOptions.expireTime = moment(expireTime).unix();  //30 minutes expirty set to token

            // Generate a token.
            var token = opentok.generateToken(session.sessionId);

            //addition of new record to table
            var newConAudio = new AudioSession();
            newConAudio.sessionId = session.sessionId;
            newConAudio.sessionExpertToken = token;
            newConAudio.sessionStatus = "ACTIVE";
            newConAudio.expertEmail = expertEmail;
            newConAudio.userEmail = userEmail;

            newConAudio.save(function (err) {
                if (err) {
                    console.log("error: " + err);
                    return res.json({ err : err, sessionId : "", token : ""});
                } else {
                    console.log("else 1");
                    return res.json({ err : "", sessionId : session.sessionId, token : token});
                }
            });
        });

      }

    });
};