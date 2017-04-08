const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const sessionpaymentSchema = new Schema({
    expertEmail       : {type: String, default: ''},
    expertSlug        : {type: String, default: ''},
    userEmail         : {type: String, default: ''},
    sessionStatus     : {type: String, enum: ["ACTIVE","INACTIVE"]},
    purchaseDate      : {type: Date, default: Date.now()},
    purchasedDuration : {type: String, default: ''},
    amount            : {type: String, default: ''},
    paymentStatus     : {type: String, default: ''},
    transactionId     : {type: String, default: ''},
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Sessionpayment', sessionpaymentSchema);
