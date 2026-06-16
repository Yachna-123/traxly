const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  key: { type: String, required: true, unique: true },
  name: { type: String, default: "My API Key" },
  lastUsed: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("APIKey", apiKeySchema);