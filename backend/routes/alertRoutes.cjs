const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController.cjs");

// POST /api/alerts/save
router.post("/save", alertController.saveAlert);

// Alias /add for backward compatibility if needed (optional)
router.post("/add", alertController.saveAlert);

module.exports = router;
