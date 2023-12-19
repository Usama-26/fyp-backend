const { default: mongoose, Schema } = require("mongoose");

const languageSchema = new Schema({
  name: String,
  code: String,
});

const Language = mongoose.model("Language", languageSchema);

module.exports = Language;
