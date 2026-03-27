const Session = require("../models/Session.cjs");
const Alert = require("../models/Alert.cjs");
const Report = require("../models/Report.cjs");

// Get All Sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Alerts for a Session
exports.getSessionAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ sessionId: req.params.sessionId }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Report for a Session
exports.getSessionReport = async (req, res) => {
  try {
    const report = await Report.findOne({ sessionId: req.params.sessionId });
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
