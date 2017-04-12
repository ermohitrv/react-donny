const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const VideosessionSchema = new Schema({
    expertEmail               : {type: String, default: ''},
    expertSlug                : {type: String, default: ''},
    userEmail                 : {type: String, default: ''},
    sessionExpertToken        : {type: String, default: ''},
    sessionUserToken          : {type: String, default: ''},
    sessionStatus             : {type: String, enum: ["ACTIVE","INACTIVE"]},
    sessionCompletionStatus   : {type: String, enum: ["COMPLETED","UNCOMPLETED"]},
    sessionCreationDate       : {type: Date, default: Date.now()},
    sessionPurchasedDuration  : {type: String, default: ''},

    stripePaymentStatus       : {type: String, enum: ["succeeded","failed"]},
    stripePaymentAmount       : {type: String, default: ''},
    stripePaymentId           : {type: String, default: ''},
    stripePaymentCreationTime : {type: String, default: ''},
    stripePaymentCardLast4    : {type: String, default: ''},
    stripePaymentApplication  : {type: String, default: ''},
    stripePaymentApplicationFee : {type: String, default: ''},
    stripePaymentBalanceTransaction : {type: String, default: ''}
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Videosession', VideosessionSchema);
