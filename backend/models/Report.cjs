const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  candidateName: {
    type: String,
    required: true
  },
  duration: {
    type: String, // e.g., "45m 30s"
    required: true
  },
  startTime: Date,
  endTime: Date,
  totalAlerts: {
    type: Number,
    default: 0
  },
  tabSwitchCount: {
    type: Number,
    default: 0
  },
  eyeMovementStats: {
    center: { type: Number, default: 0 }, // Percentage
    away: { type: Number, default: 0 }    // Percentage
  },
  headPositionStats: {
    center: { type: Number, default: 0 }, // Percentage
    down: { type: Number, default: 0 },   // Percentage
    side: { type: Number, default: 0 }    // Percentage
  },
  keyboardEvents: {
    type: Number,
    default: 0
  },
  mouseEvents: {
    type: Number,
    default: 0
  },
  suspicionScore: {
    type: Number,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ["SAFE", "MEDIUM", "HIGH"],
    default: "SAFE"
  },
  finalDecision: {
    type: String,
    default: "Pending"
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Report", ReportSchema);
