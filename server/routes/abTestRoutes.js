const express = require("express");
const router = express.Router();
const { createABTest, getABTests, deleteABTest } = require("../controllers/abTestController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createABTest);
router.get("/", protect, getABTests);
router.delete("/:id", protect, deleteABTest);

module.exports = router;