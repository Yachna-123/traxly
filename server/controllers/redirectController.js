const Link = require("../models/Link");
const Click = require("../models/Click");
const UAParser = require("ua-parser-js");
const bcrypt = require("bcryptjs");
const redis = require("../config/redis");

const CACHE_TTL = 60 * 60;

const getLocationFromIP = async (ip) => {
  try {
    if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168") || ip.startsWith("10.")) {
      return { country: "Local", city: "Local" };
    }
    const cleanIP = ip.replace("::ffff:", "");
    const response = await fetch(`http://ip-api.com/json/${cleanIP}?fields=country,city,status`);
    const data = await response.json();
    if (data.status === "success") {
      return { country: data.country || "Unknown", city: data.city || "Unknown" };
    }
    return { country: "Unknown", city: "Unknown" };
  } catch (err) {
    console.error("Geolocation error:", err.message);
    return { country: "Unknown", city: "Unknown" };
  }
};

exports.handleRedirect = async (req, res) => {
  const { shortCode } = req.params;

  try {
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

      await redis.setex(`link:${shortCode}`, CACHE_TTL, JSON.stringify(link));
    }

    if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
      await redis.del(`link:${shortCode}`);
      return res.status(410).json({ message: "This link has expired" });
    }

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

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    const { country, city } = await getLocationFromIP(ip);

    Click.create({
      link: link._id,
      device: result.device.type || "desktop",
      browser: result.browser.name || "unknown",
      os: result.os.name || "unknown",
      referrer: req.headers.referer || "direct",
      ip,
      country,
      city,
    }).catch((err) => console.error("Click log error:", err));

    Link.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } }).catch((err) =>
      console.error("Click count error:", err)
    );

    return res.redirect(302, link.originalUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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