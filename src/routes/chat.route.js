const express = require("express");
const { createChatUser } = require("../controllers/chat.controller");
const { protect } = require("../controllers/auth.controller");
const router = express.Router();

router.get("/create_chat_user", protect, createChatUser);

module.exports = router;
