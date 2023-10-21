const catchAsync = require('./../utils/catchAsync');
const Notification = require('../models/notification.model');

// Create a new notification
const createNotification = catchAsync(async (req, res) => {
  const notificationData = req.body;
  const notification = await Notification.create(notificationData);

  res.status(201).json({
    status: 'success',
    data: notification,
  });
});

// Get all notifications for a specific user
const getAllNotificationsForUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const notifications = await Notification.find({ user: userId });

  res.status(200).json({
    status: 'success',
    length: notifications.length,
    data: { notifications },
  });
});

// Mark a notification as read
const markNotificationAsRead = catchAsync(async (req, res) => {
  const notificationId = req.params.id;
  const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });

  if (!notification) {
    return res.status(404).json({
      status: 'fail',
      message: 'Notification not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: notification,
  });
});

module.exports = {
  createNotification,
  getAllNotificationsForUser,
  markNotificationAsRead,
};
