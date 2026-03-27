const mongoose = require("mongoose");

const MonitoringSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String, // Candidate ID or Name
    required: false
  },
  eyeMovement: {
    type: String,
    default: "Normal"
  },
  headPosition: {
    type: String,
    default: "Normal"
  },
  tabStatus: {
    type: String,
    enum: ["Same Tab", "Switched"],
    default: "Same Tab"
  },
  keyboardStatus: {
    type: String,
    enum: ["Typing", "Normal"],
    default: "Normal"
  },
  mouseStatus: {
    type: String,
    enum: ["Moving", "Normal"],
    default: "Normal"
  },
  image: {
    type: String, // Base64 encoded image
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Monitoring", MonitoringSchema);
