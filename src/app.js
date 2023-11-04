const express = require("express");
const morgan = require("morgan");

const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const subCategoryRouter = require("./routes/subCategory.route");
const serviceRouter = require("./routes/service.route");
const reviewRouter = require("./routes/review.route");
const authRouter = require("./routes/auth.route");
const projectRouter = require("./routes/project.route");
const proposalRouter = require("./routes/proposal.route");
const gigRouter = require("./routes/gig.route");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subCategory", subCategoryRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/proposal", proposalRouter);
app.use("/api/v1/gig", gigRouter);

app.get("/", (req, res) => {
  res.send("Hello from the server. 👋");
});
module.exports = app;
