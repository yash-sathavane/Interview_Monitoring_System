const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController.cjs");

// POST /api/sessions/create
router.post("/create", sessionController.createSession);

// POST /api/sessions/join
router.post("/join", sessionController.joinSession);

// POST /api/sessions/end
router.post("/end", sessionController.endSession);

// GET /api/sessions/interviewer/:interviewerId
router.get("/interviewer/:interviewerId", sessionController.getSessionsByInterviewer);

router.get("/reports/interviewer/:interviewerId", sessionController.getReportsByInterviewer);

// GET /api/sessions/report/:sessionId
router.get("/report/:sessionId", sessionController.getReport);

// GET /api/sessions/report/:sessionId/download
router.get("/report/:sessionId/download", sessionController.downloadReport);

// GET /api/sessions/:sessionId
router.get("/:sessionId", sessionController.getSession);

module.exports = router;
