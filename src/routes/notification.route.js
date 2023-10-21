const express = require('express');
const router = express.Router();
const {
  createNotification,
  getAllNotificationsForUser,
  markNotificationAsRead
} = require('../controllers/notification.controller');

// Create a new notification
router.post('/notifications', createNotification);

// Get all notifications for a specific user
router.get('/notifications/user/:userId', getAllNotificationsForUser);

// Mark a notification as read
router.patch('/notifications/:id', markNotificationAsRead);

module.exports = router;
