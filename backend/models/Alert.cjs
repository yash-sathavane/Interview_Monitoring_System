const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  keyboard: {
    type: String, // e.g., "Typing", "Idle"
    default: "Unknown"
  },
  mouse: {
    type: String, // e.g., "Moving", "Idle"
    default: "Unknown"
  },
  tab: {
    type: String, // e.g., "Active", "Switched"
    default: "Unknown"
  },
  severity: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "LOW"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Alert", AlertSchema);
