const User = require("./../models/userModel");

async function getAllUsers(req, res) {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      length: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
}

async function createUser(req, res) {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ status: "success", data: { newUser } });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
}

async function deleteAll(req, res) {
  try {
    await User.deleteMany();
    res.status(204).send();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
}

module.exports = {
  getAllUsers,
  createUser,
  deleteAll,
};
