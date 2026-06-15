const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: [true, "Original URL is required"], trim: true },
    shortCode: { type: String, required: true, unique: true, trim: true },
    customAlias: { type: String, default: null, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, default: null },
    password: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    clicks: { type: Number, default: 0 },
    campaign: { type: String, default: null, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Link", linkSchema);