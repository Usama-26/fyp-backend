const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');

// Get All Users
const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    length: users.length,
    data: { users },
  });
});

// Get users by ID
const getUserById = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// Create a new User
const createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json({ status: 'success', data: { newUser } });
});

// Update a user
const updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({ status: 'success', data: { user } });
});

// Delete a user
const deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
};
