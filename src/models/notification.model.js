const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  // Additional fields for notification type, creation date, etc.
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
