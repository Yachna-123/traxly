const jwt = require("jsonwebtoken");
const User = require("../models/User");
const APIKey = require("../models/APIKey");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // Check if it is an API key
    if (token.startsWith("trx_")) {
      const apiKey = await APIKey.findOne({ key: token, isActive: true });
      if (!apiKey) return res.status(401).json({ message: "Invalid API key" });

      await APIKey.findByIdAndUpdate(apiKey._id, { lastUsed: new Date() });

      const user = await User.findById(apiKey.user).select("-password");
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;
      return next();
    }

    // Regular JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};