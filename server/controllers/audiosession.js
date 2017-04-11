const Experts = require('../models/experts');
        const ExpertsSubcategories = require('../models/expertssubcategories');
        const AudioSession = require('../models/audiosession');
        const User = require('../models/user');
        const config = require('../config/main');
//included opentok api files
        var OpenTok = require('../lib_opentok/opentok');

// Initialize OpenTok
var opentok = new OpenTok(config.opentok_apiKey, config.opentok_apiSecret);

/* API endpoint to create audio session  */
exports.createAudioSession = function (req, res, next) {

    const expertEmail = req.body.expertEmail;
            const userEmail = req.body.userEmail;
            //const sessionOwner = req.body.sessionOwner;

            AudioSession.findOne({expertEmail: expertEmail, sessionId: {$ne: ''}}, function (err, sessionInfo) {
                if (sessionInfo) {
                    var token = opentok.generateToken(sessionInfo.sessionId);
                    return res.json({sessionId: sessionInfo.sessionId, token: token, err: ""});
                } else {

                    var date1 = new Date(),
                            expireTime = new Date(date1);
                    expireTime.setMinutes(date1.getMinutes() + 5600);

                    opentok.createSession(function (err, session) {

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
                                return res.json({err: err, sessionId: "", token: ""});
                            } else {
                                console.log("else 1");
                                return res.json({err: "", sessionId: session.sessionId, token: token});
                            }
                        });
                    });

                }

            });
};

exports.requestForToken = function(req, res, next) {
    const email = req.params.email;
    
    AudioSession.findOne({  expertEmail : email, sessionId : { $ne : ''} }, function(err, sessionInfo){
    if (sessionInfo) {
    var token = opentok.generateToken(sessionInfo.sessionId);
            return res.json({ sessionId: sessionInfo.sessionId, token : token, err : "" });
    } else{
        return res.json({ sessionId: "", token : "", err : "error" });
    }

});
};
