const mongoose = require("mongoose");
const clickSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  device: {
    type: String,
    default: "unknown",
  },
  browser: {
    type: String,
    default: "unknown",
  },
  os: {
    type: String,
    default: "unknown",
  },
  referrer: {
    type: String,
    default: "direct",
  },
  ip: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: "Unknown",
  },
  city: {
    type: String,
    default: "Unknown",
  },
});
module.exports = mongoose.model("Click", clickSchema);