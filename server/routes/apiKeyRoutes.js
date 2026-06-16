const express = require("express");
const router = express.Router();
const { generateAPIKey, getAPIKey, deleteAPIKey } = require("../controllers/apiKeyController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, generateAPIKey);
router.get("/", protect, getAPIKey);
router.delete("/", protect, deleteAPIKey);

module.exports = router;