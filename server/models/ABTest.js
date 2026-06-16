const mongoose = require("mongoose");

const abTestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
  shortCode: { type: String, required: true, unique: true, trim: true },
  urlA: { type: String, required: true },
  urlB: { type: String, required: true },
  clicksA: { type: Number, default: 0 },
  clicksB: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("ABTest", abTestSchema);