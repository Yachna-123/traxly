const APIKey = require("../models/APIKey");
const crypto = require("crypto");

exports.generateAPIKey = async (req, res) => {
  try {
    const existing = await APIKey.findOne({ user: req.user._id, isActive: true });
    if (existing) {
      await APIKey.deleteOne({ _id: existing._id });
    }
    const key = "trx_" + crypto.randomBytes(24).toString("hex");
    const apiKey = await APIKey.create({ user: req.user._id, key, name: req.body.name || "My API Key" });
    res.status(201).json({ success: true, apiKey: { key: apiKey.key, name: apiKey.name, createdAt: apiKey.createdAt } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAPIKey = async (req, res) => {
  try {
    const apiKey = await APIKey.findOne({ user: req.user._id, isActive: true });
    if (!apiKey) return res.json({ success: true, apiKey: null });
    res.json({ success: true, apiKey: { key: apiKey.key, name: apiKey.name, lastUsed: apiKey.lastUsed, createdAt: apiKey.createdAt } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteAPIKey = async (req, res) => {
  try {
    await APIKey.deleteOne({ user: req.user._id });
    res.json({ success: true, message: "API key deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};