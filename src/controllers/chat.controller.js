const dotenv = require("dotenv");
const { StreamChat } = require("stream-chat");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

dotenv.config({ path: `${__dirname}/../../config.env` });

const streamChat = StreamChat.getInstance(
  process.env.GETSTREAM_API_KEY,
  process.env.GETSTREAM_API_SECRET
);

exports.createChatUser = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (user.profile_completion !== 100) {
    return next(
      new AppError("Complete you profile to 100% to unlock your inbox", 400)
    );
  }

  let chatToken = "";

  const existingUser = await streamChat.queryUsers({ id: user.id });

  if (existingUser.users.length > 0) {
    chatToken = streamChat.createToken(existingUser.users[0].id);
    return res.status(200).json({
      status: "success",
      chatToken: chatToken,
      data: existingUser.users[0],
    });
  }

  const newUser = await streamChat.upsertUser({
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
  });

  if (!newUser) {
    new AppError("A Chat User can't be created.", 500);
  }

  chatToken = streamChat.createToken(newUser.users[0].id);

  res.status(200).json({ status: "success", data: req.user });
});
