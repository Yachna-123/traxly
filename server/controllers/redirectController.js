const Link = require("../models/Link");
const Click = require("../models/Click");
const UAParser = require("ua-parser-js");
const bcrypt = require("bcryptjs");
const redis = require("../config/redis");

const CACHE_TTL = 60 * 60; // 1 hour in seconds

// @route   GET /:shortCode
exports.handleRedirect = async (req, res) => {
  const { shortCode } = req.params;

  try {
    // Check Redis cache first
    const cached = await redis.get(`link:${shortCode}`);
    let link;

    if (cached) {
      link = JSON.parse(cached);
      console.log(`Cache HIT for ${shortCode}`);
    } else {
      console.log(`Cache MISS for ${shortCode}`);
      link = await Link.findOne({ shortCode, isActive: true });

      if (!link) {
        return res.status(404).json({ message: "Link not found or inactive" });
      }

      // Store in Redis cache
      await redis.setex(
        `link:${shortCode}`,
        CACHE_TTL,
        JSON.stringify(link)
      );
    }

    // Check expiry
    if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
      await redis.del(`link:${shortCode}`);
      return res.status(410).json({ message: "This link has expired" });
    }

    // Check password protection
    if (link.password) {
      const { pwd } = req.query;

      if (!pwd) {
        return res.status(401).json({
          message: "This link is password protected",
          requiresPassword: true,
          shortCode,
        });
      }

      const isMatch = await bcrypt.compare(pwd, link.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
    }

    // Parse user agent for analytics
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    // Log the click asynchronously
    Click.create({
      link: link._id,
      device: result.device.type || "desktop",
      browser: result.browser.name || "unknown",
      os: result.os.name || "unknown",
      referrer: req.headers.referer || "direct",
      ip: req.ip,
    }).catch((err) => console.error("Click log error:", err));

    // Increment click counter
    Link.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } }).catch((err) =>
      console.error("Click count error:", err)
    );

    // Redirect
    return res.redirect(302, link.originalUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /:shortCode/verify-password
exports.verifyPassword = async (req, res) => {
  const { shortCode } = req.params;
  const { password } = req.body;

  try {
    const link = await Link.findOne({ shortCode, isActive: true });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (!link.password) {
      return res.status(400).json({ message: "Link is not password protected" });
    }

    const isMatch = await bcrypt.compare(password, link.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({ success: true, redirectUrl: link.originalUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};