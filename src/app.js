const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const reviewRouter = require("./routes/review.route");
const projectRouter = require("./routes/project.route");
const proposalRouter = require("./routes/proposal.route");
const authRouter = require("./Auth/AuthRoute");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(cors());
app.options("*", cors());

app.use(helmet());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/proposal", proposalRouter);
app.use("/api/v1/", authRouter);

app.get("/", (req, res) => {
  res.send("Hello from the server. 👋");
});
module.exports = app;
