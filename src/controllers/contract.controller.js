const catchAsync = require('../utils/catchAsync');
const Contract = require('../models/contract.model');

// Create a new contract
const createContract = catchAsync(async (req, res) => {
  const contractData = req.body;
  const contract = await Contract.create(contractData);

  res.status(201).json({
    status: 'success',
    data: contract,
  });
});

// Get all contracts for a specific project or user (client/freelancer)
const getAllContractsForUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const contracts = await Contract.find({ $or: [{ client: userId }, { freelancer: userId }] });

  res.status(200).json({
    status: 'success',
    length: contracts.length,
    data: { contracts },
  });
});

// Get a contract by its ID
const getContractById = catchAsync(async (req, res) => {
  const contractId = req.params.id;
  const contract = await Contract.findById(contractId);

  if (!contract) {
    return res.status(404).json({
      status: 'fail',
      message: 'Contract not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: contract,
  });
});

module.exports = {
  createContract,
  getAllContractsForUser,
  getContractById,
};
