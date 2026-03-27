const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.cjs");

// GET /api/admin/sessions
router.get("/sessions", adminController.getAllSessions);

// GET /api/admin/alerts/:sessionId
router.get("/alerts/:sessionId", adminController.getSessionAlerts);

// GET /api/admin/report/:sessionId
router.get("/report/:sessionId", adminController.getSessionReport);

module.exports = router;
