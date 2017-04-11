const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const AudiosessionSchema = new Schema({
    expertEmail           : {type: String, default: ''},
    userEmail             : {type: String, default: ''},
    sessionId             : {type: String, default: ''},
    sessionExpertToken    : {type: String, default: ''},
    sessionUserToken      : {type: String, default: ''},
    sessionCreationDate   : {type: Date, default: Date.now()},
    sessionDuration       : {type: String, default: ''},
    sessionActiveStatus   : {type: String, enum: ["ACTIVE","INACTIVE"]}
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Audiosession', AudiosessionSchema);
