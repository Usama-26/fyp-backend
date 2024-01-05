const mongoose = require("mongoose");
const app = require("./app");
const { User } = require("./models/user.model");

const DB = { user: process.env.DB_USER, password: process.env.DB_PASSWORD };
const port = +process.env.PORT || 8000;
// `mongodb://${DB.user}:${DB.password}@ac-nrb55mc-shard-00-00.eatlkuz.mongodb.net:27017,ac-nrb55mc-shard-00-01.eatlkuz.mongodb.net:27017,ac-nrb55mc-shard-00-02.eatlkuz.mongodb.net:27017/?ssl=true&replicaSet=atlas-q0qrp1-shard-0&authSource=admin&retryWrites=true&w=majority`
mongoose
  .connect(
    `mongodb+srv://${DB.user}:${DB.password}@fyp-database.eatlkuz.mongodb.net/fyp-database`
  )
  .then((con) =>
    console.log(
      "MongoDB Atlas Server:",
      mongoose.STATES[con.connection.readyState]
    )
  )
  .catch((err) => console.error(err.message));

const server = app.listen(port, () => {
  console.log("App is running at PORT: ", port);
});

// Initialize socket.io and pass the server
const io = require("socket.io")(server);

// Use a Map to store user online status
const onlineUsers = new Map();

io.on("connection", (socket) => {
  // Assuming you have the user ID available in the socket handshake
  const userId = socket.handshake.query.userId;
  const online = "online";
  const offline = "offline";

  // Update the user's online status in MongoDB
  updateUserOnlineStatus(userId, online);

  console.log("User connected:", userId);

  // Listen for a user's online status
  socket.on("online status", (status) => {
    // Update the online status
    updateUserOnlineStatus(userId, status);

    // Notify all clients about the updated online status
    io.emit("online users", Array.from(onlineUsers.entries()));
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);

    // Update the user's online status in MongoDB to 'offline'
    updateUserOnlineStatus(userId, offline);

    // Notify all clients about the updated online status
    io.emit("online users", Array.from(onlineUsers.entries()));
  });
});

// Function to update user's online status in MongoDB
async function updateUserOnlineStatus(userId, status) {
  try {
    // Update the user's online status in MongoDB
    await User.updateOne({ _id: userId }, { $set: { online_status: status } });
  } catch (error) {
    console.error("Error updating user online status:", error.message);
  }
}
