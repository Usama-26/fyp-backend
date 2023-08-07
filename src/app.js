const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello from the server. 👋");
});
module.exports = app;
