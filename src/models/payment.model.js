const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract', // Reference to the Contract model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  // Additional fields for payment status, payment method, etc.
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
