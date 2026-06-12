const Link = require("../models/Link");
const Click = require("../models/Click");
const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");

// @route   POST /api/links/shorten
exports.shortenUrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { originalUrl, customAlias, expiresAt } = req.body;

  try {
    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Handle custom alias
    if (customAlias) {
      const aliasExists = await Link.findOne({ shortCode: customAlias });
      if (aliasExists) {
        return res.status(400).json({ message: "Custom alias already taken" });
      }
    }

    // Generate unique short code with collision handling
    let shortCode = customAlias || nanoid(6);
    let attempts = 0;

    if (!customAlias) {
      while (await Link.findOne({ shortCode })) {
        shortCode = nanoid(6);
        attempts++;
        if (attempts > 5) {
          return res
            .status(500)
            .json({ message: "Could not generate unique code, try again" });
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