const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: `${__dirname}/../config.env` });

const DB = { user: process.env.DB_USER, password: process.env.DB_PASSWORD };

mongoose
  .connect(
    `mongodb+srv://${DB.user}:${DB.password}@fyp-database.eatlkuz.mongodb.net/`
  )
  .then((con) =>
    console.log("Mongoose Server:", mongoose.STATES[con.connection.readyState])
  )
  .catch((err) => console.error(err.message));

app.listen(8000, () => {
  console.log("App is running at PORT: 8000");
});
