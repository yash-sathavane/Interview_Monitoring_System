const express = require("express");
const router = express.Router();
const monitoringController = require("../controllers/monitoringController.cjs");

// POST /api/monitoring/save
router.post("/save", monitoringController.saveMonitoringData);

// GET /api/monitoring/:sessionId
router.get("/:sessionId", monitoringController.getSessionMonitoring);

module.exports = router;
