const ABTest = require("../models/ABTest");
const { nanoid } = require("nanoid");

exports.createABTest = async (req, res) => {
  const { name, urlA, urlB } = req.body;
  if (!name || !urlA || !urlB) return res.status(400).json({ message: "Name, URL A and URL B are required" });
  try {
    const shortCode = "ab_" + nanoid(6);
    const test = await ABTest.create({ user: req.user._id, name, shortCode, urlA, urlB });
    res.status(201).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getABTests = async (req, res) => {
  try {
    const tests = await ABTest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteABTest = async (req, res) => {
  try {
    await ABTest.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: "Test deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.handleABRedirect = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const test = await ABTest.findOne({ shortCode, isActive: true });
    if (!test) return res.status(404).json({ message: "A/B test not found" });
    const goToA = Math.random() < 0.5;
    if (goToA) {
      await ABTest.findByIdAndUpdate(test._id, { $inc: { clicksA: 1 } });
      return res.redirect(302, test.urlA);
    } else {
      await ABTest.findByIdAndUpdate(test._id, { $inc: { clicksB: 1 } });
      return res.redirect(302, test.urlB);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};