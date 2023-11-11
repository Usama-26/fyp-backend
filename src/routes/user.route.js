const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllFreelancers,
  getAllClients,
  getUserById,
  deleteClient,
  deleteFreelancer,
  updateClient,
  updateFreelancer,
  createClient,
  createFreelancer,
  getUserByEmail
} = require('../controllers/user.controller');
const { protect } = require("../controllers/auth.controller");

router.route('/')
  .get(getAllUsers);

router.route('/freelancers')
  .get(getAllFreelancers)
  .post(protect, createFreelancer);

router.route('/clients')
  .get(getAllClients)
  .post(protect, createClient);

router.route('/')

router.route('/:id')
  .get(getUserById)
  .patch(protect, (req, res, next) => {
    const { user_type } = req.body;

    if (user_type === 'freelancer') {
      return updateFreelancer(req, res, next);
    } else if (user_type === 'client') {
      return updateClient(req, res, next);
    }
  })
  .delete(protect, (req, res, next) => {
    // Define the logic to delete either a Freelancer or Client based on user type
    const { user_type } = req.body;

    if (user_type === 'freelancer') {
      return deleteFreelancer(req, res, next);
    } else if (user_type === 'client') {
      return deleteClient(req, res, next);
    }
  });

module.exports = router;

