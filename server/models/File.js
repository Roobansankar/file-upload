const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  name: String,
  url: String,
  type: String,
  size: Number,
});

module.exports = mongoose.model("File", FileSchema);
