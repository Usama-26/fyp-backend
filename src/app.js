const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cloudinary = require("cloudinary").v2;

const globalErrorHandler = require("./controllers/error.controller");
const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const subCategoryRouter = require("./routes/subCategory.route");
const serviceRouter = require("./routes/service.route");
const reviewRouter = require("./routes/review.route");
const authRouter = require("./routes/auth.route");
const projectRouter = require("./routes/project.route");
const proposalRouter = require("./routes/proposal.route");
const gigRouter = require("./routes/gig.route");
const skillRouter = require("./routes/skill.route");
const AppError = require("./utils/appError");

dotenv.config({ path: `${__dirname}/../config.env` });

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(morgan("dev"));

app.use(cors());
app.options("*", cors());

app.use(helmet());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/proposals", proposalRouter);
app.use("/api/v1/gigs", gigRouter);
app.use("/api/v1/skills", skillRouter);

app.get("/", (req, res) => {
  res.send("Hello from the server. 👋");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}  on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
