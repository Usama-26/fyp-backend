const express = require("express");
const morgan = require("morgan");

const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const reviewRouter = require("./routes/review.route");
const projectRouter = require("./routes/project.route");
const proposalRouter = require("./routes/proposal.route");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/proposal", proposalRouter);

app.get("/", (req, res) => {
  res.send("Hello from the server. 👋");
});
module.exports = app;
