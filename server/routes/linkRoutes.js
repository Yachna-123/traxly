const express = require("express");
const router = express.Router();
const {
  shortenUrl,
  getMyLinks,
  deleteLink,
  getQRCode,
  setLinkPassword,
} = require("../controllers/linkController");
const { protect } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

router.post(
  "/shorten",
  protect,
  [
    body("originalUrl").notEmpty().withMessage("URL is required"),
    body("customAlias")
      .optional()
      .isAlphanumeric()
      .withMessage("Alias must be alphanumeric")
      .isLength({ min: 3, max: 20 })
      .withMessage("Alias must be 3–20 characters"),
  ],
  shortenUrl
);

router.get("/", protect, getMyLinks);
router.delete("/:id", protect, deleteLink);
router.get("/:id/qr", protect, getQRCode);
router.put("/:id/password", protect, setLinkPassword);

module.exports = router;