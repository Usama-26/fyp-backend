const catchAsync = require('../utils/catchAsync');
const Payment = require('../models/payment.model');

// Create a new payment
const createPayment = catchAsync(async (req, res) => {
  const paymentData = req.body;
  const payment = await Payment.create(paymentData);

  res.status(201).json({
    status: 'success',
    data: payment,
  });
});

// Get all payments for a specific contract
const getAllPaymentsForContract = catchAsync(async (req, res) => {
  const contractId = req.params.contractId;
  const payments = await Payment.find({ contract: contractId });

  res.status(200).json({
    status: 'success',
    length: payments.length,
    data: { payments },
  });
});

// Get a payment by its ID
const getPaymentById = catchAsync(async (req, res) => {
  const paymentId = req.params.id;
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Payment not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: payment,
  });
});

module.exports = {
  createPayment,
  getAllPaymentsForContract,
  getPaymentById,
};
