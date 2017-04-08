const Sessionmessages = require('../models/sessionmessages'),
      User = require('../models/user');

exports.expertsessionchat = function (req, res, next) {
  var messageSenderEmail  = req.body.messageSenderEmail,
  messageReceiverEmail    = req.body.messageReceiverEmail,
  composedMessage         = req.body.composedMessage,
  sessionOwnerUsername    = req.body.sessionOwnerUsername;

  console.log('messageSenderEmail: '+messageSenderEmail);
  console.log('messageReceiverEmail: '+messageReceiverEmail);
  console.log('composedMessage: '+composedMessage);
  console.log('sessionOwnerUsername: '+sessionOwnerUsername);

  if (
        (messageSenderEmail !== undefined && messageSenderEmail !== null)
      &&
        (messageReceiverEmail !== undefined && messageReceiverEmail !== null)
      &&
        (composedMessage !== undefined && composedMessage !== null)
      &&
        (sessionOwnerUsername !== undefined && sessionOwnerUsername !== null)
    )
  {
     /*insertion of new message into database table */
    const reply = new Sessionmessages({
      messageSenderEmail    : messageSenderEmail,
      messageReceiverEmail  : messageReceiverEmail,
      sessionOwnerUsername  : sessionOwnerUsername,
      message               : composedMessage
    });
    reply.save((err, sentReply) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ message: 'Reply successfully sent!' });
    });

  } else {
    console.log('else');
    res.json("[]");
  }
};

exports.fetchSessionChat = function (req, res, next) {
  var sessionOwnerUsername    = req.params.sessionOwnerUsername;
  console.log('** ** ** sessionOwnerUsername '+sessionOwnerUsername);
  if ( sessionOwnerUsername !== undefined && sessionOwnerUsername !== null ){
    Sessionmessages.aggregate([
        {
          $match: {"sessionOwnerUsername": { $regex : new RegExp(sessionOwnerUsername, "i") } }
        },
        {
          $sort: {  'messageTime': 1   }
        }
    ], function (err, messagesList) {
        return res.status(200).json({ conversation: messagesList });
    });
  } else {
    return res.status(200).json({ conversation: "" });
  }
};
