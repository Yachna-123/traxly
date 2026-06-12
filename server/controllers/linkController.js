const Link = require("../models/Link");
const Click = require("../models/Click");
const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");
const QRCode = require("qrcode");
const bcrypt = require("bcryptjs");

// @route   POST /api/links/shorten
exports.shortenUrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { originalUrl, customAlias, expiresAt } = req.body;

  try {
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    if (customAlias) {
      const aliasExists = await Link.findOne({ shortCode: customAlias });
      if (aliasExists) {
        return res.status(400).json({ message: "Custom alias already taken" });
      }
    }

    let shortCode = customAlias || nanoid(6);
    let attempts = 0;

    if (!customAlias) {
      while (await Link.findOne({ shortCode })) {
        shortCode = nanoid(6);
        attempts++;
        if (attempts > 5) {
          return res.status(500).json({ message: "Could not generate unique code, try again" });
        }
      }
    }

    const link = await Link.create({
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      user: req.user._id,
      expiresAt: expiresAt || null,
    });

    res.status(201).json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: `${process.env.BASE_URL}/${link.shortCode}`,
        expiresAt: link.expiresAt,
        clicks: link.clicks,
        createdAt: link.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/links
exports.getMyLinks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = {
      user: req.user._id,
      ...(search && {
        $or: [
          { shortCode: { $regex: search, $options: "i" } },
          { originalUrl: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const total = await Link.countDocuments(query);
    const links = await Link.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      links,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   DELETE /api/links/:id
exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    await Link.deleteOne({ _id: req.params.id });
    await Click.deleteMany({ link: req.params.id });

    res.json({ success: true, message: "Link deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/links/:id/qr
exports.getQRCode = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    const shortUrl = `${process.env.BASE_URL}/${link.shortCode}`;

    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    res.json({
      success: true,
      qr: qrDataUrl,
      shortUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/links/:id/password
exports.setLinkPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const link = await Link.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      link.password = await bcrypt.hash(password, salt);
    } else {
      link.password = null;
    }

    await link.save();

    res.json({
      success: true,
      message: password ? "Password set" : "Password removed",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};