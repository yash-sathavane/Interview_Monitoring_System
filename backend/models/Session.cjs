const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  interviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  candidateName: {
    type: String,
    required: false
  },
  candidateEmail: {
    type: String,
    required: false // Optional if link is shared generally
  },
  status: {
    type: String,
    enum: ["created", "active", "completed"],
    default: "created"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  }
});

module.exports = mongoose.model("Session", SessionSchema);
