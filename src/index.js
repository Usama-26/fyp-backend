const mongoose = require("mongoose");
const app = require("./app");

const DB = { user: process.env.DB_USER, password: process.env.DB_PASSWORD };
const port = +process.env.PORT || 8000;
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

app.listen(port, () => {
  console.log("App is running at PORT: ", port);
});
