const express = require('express');
const router = express.Router();
const {
  createContract,
  getAllContractsForUser,
  getContractById
} = require('../controllers/contract.controller');

// Create a new contract
router.post('/contracts', createContract);

// Get all contracts for a specific user (client/freelancer)
router.get('/contracts/user/:userId', getAllContractsForUser);

// Get a contract by its ID
router.get('/contracts/:id', getContractById);

module.exports = router;
