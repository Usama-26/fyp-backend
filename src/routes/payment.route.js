const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllPaymentsForContract,
  getPaymentById
} = require('../controllers/payment.controller');

// Create a new payment
router.post('/payments', createPayment);

// Get all payments for a specific contract
router.get('/payments/contract/:contractId', getAllPaymentsForContract);

// Get a payment by its ID
router.get('/payments/:id', getPaymentById);

module.exports = router;
