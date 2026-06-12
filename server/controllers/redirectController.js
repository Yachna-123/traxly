const Link = require("../models/Link");
const Click = require("../models/Click");
const UAParser = require("ua-parser-js");

// @route   GET /:shortCode
exports.handleRedirect = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const link = await Link.findOne({ shortCode, isActive: true });

    if (!link) {
      return res.status(404).json({ message: "Link not found or inactive" });
    }

    // Check expiry
    if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
      return res.status(410).json({ message: "This link has expired" });
    }

    // Parse user agent for analytics
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    // Log the click asynchronously — don't slow down the redirect
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

    // Redirect immediately
    return res.redirect(302, link.originalUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};