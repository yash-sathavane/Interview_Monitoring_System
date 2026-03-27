const Monitoring = require("../models/Monitoring.cjs");

// Save Monitoring Data Snapshot
exports.saveMonitoringData = async (req, res) => {
  try {
    const { 
      sessionId, 
      userId, 
      eyeMovement, 
      headPosition, 
      tabStatus, 
      keyboardStatus, 
      mouseStatus,
      image
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const newRecord = new Monitoring({
      sessionId,
      userId,
      eyeMovement: eyeMovement || "Normal",
      headPosition: headPosition || "Normal",
      tabStatus: tabStatus || "Same Tab",
      keyboardStatus: keyboardStatus || "Normal",
      mouseStatus: mouseStatus || "Normal",
      image
    });

    await newRecord.save();
    res.status(201).json({ message: "Data saved" });

  } catch (error) {
    console.error("Save Monitoring Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Monitoring Data for a Session (Dashboard)
exports.getSessionMonitoring = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Fetch latest 50 records for real-time feel, sorted by newest first
    const data = await Monitoring.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(data);

  } catch (error) {
    console.error("Get Monitoring Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
