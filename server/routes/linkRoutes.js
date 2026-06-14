const express = require("express");
const router = express.Router();
const {
  shortenUrl,
  getMyLinks,
  deleteLink,
  getQRCode,
  setLinkPassword,
  toggleLink,
  editLink,
  getLinkStats,
  getBioPage,
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

router.get("/bio/:username", getBioPage);
router.get("/", protect, getMyLinks);
router.delete("/:id", protect, deleteLink);
router.get("/:id/qr", protect, getQRCode);
router.get("/:id/stats", protect, getLinkStats);
router.put("/:id/password", protect, setLinkPassword);
router.put("/:id/toggle", protect, toggleLink);
router.put(
  "/:id",
  protect,
  [
    body("originalUrl")
      .optional()
      .notEmpty()
      .withMessage("URL cannot be empty"),
    body("customAlias")
      .optional()
      .isAlphanumeric()
      .withMessage("Alias must be alphanumeric")
      .isLength({ min: 3, max: 20 })
      .withMessage("Alias must be 3–20 characters"),
  ],
  editLink
);

module.exports = router;