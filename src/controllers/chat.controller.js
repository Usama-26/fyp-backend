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

  const { users } = await streamChat.upsertUser({
    id: user.id,
    image: user.profile_photo,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
  });
  if (!users) {
    new AppError("A Chat User can't be created.", 500);
  }
  const chatToken = streamChat.createToken(`${users[user.id].id}`);

  res.status(200).json({ status: "success", chatToken, data: req.user });
});
