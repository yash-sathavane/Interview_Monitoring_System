const Alert = require("../models/Alert.cjs");

// In-memory simple rate limiting fallback (though DB query is preferred for persistence)
// For a production system, Redis would be ideal. Here we use DB queries as requested.

exports.saveAlert = async (req, res) => {
  try {
    const { sessionId, keyboard, mouse, tab, severity } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // --- TASK 3: ALERT RATE LIMITING ---

    // 1. Tab Switch: Max once every 5 seconds
    if (tab === "Switched") {
      const lastTabAlert = await Alert.findOne({
        sessionId,
        tab: "Switched"
      }).sort({ createdAt: -1 });

      if (lastTabAlert) {
        const timeDiff = Date.now() - new Date(lastTabAlert.createdAt).getTime();
        if (timeDiff < 5000) {
          return res.status(200).json({ message: "Rate limit: Tab alert skipped" });
        }
      }
    }

    // 2. Keyboard Typing: Debounce (Max once every 2 seconds)
    if (keyboard === "Typing") {
      const lastKeyboardAlert = await Alert.findOne({
        sessionId,
        keyboard: "Typing"
      }).sort({ createdAt: -1 });

      if (lastKeyboardAlert) {
        const timeDiff = Date.now() - new Date(lastKeyboardAlert.createdAt).getTime();
        if (timeDiff < 2000) {
          return res.status(200).json({ message: "Rate limit: Keyboard alert skipped" });
        }
      }
    }

    // 3. Mouse Movement: Threshold/Debounce (Max once every 3 seconds)
    if (mouse === "Moving") {
      const lastMouseAlert = await Alert.findOne({
        sessionId,
        mouse: "Moving"
      }).sort({ createdAt: -1 });

      if (lastMouseAlert) {
        const timeDiff = Date.now() - new Date(lastMouseAlert.createdAt).getTime();
        if (timeDiff < 3000) {
          return res.status(200).json({ message: "Rate limit: Mouse alert skipped" });
        }
      }
    }

    // --- SAVE ALERT ---
    const newAlert = new Alert({
      sessionId,
      keyboard: keyboard || "Unknown",
      mouse: mouse || "Unknown",
      tab: tab || "Unknown",
      severity: severity || "LOW",
      createdAt: new Date()
    });

    const savedAlert = await newAlert.save();
    res.status(201).json(savedAlert);

  } catch (error) {
    console.error("Error saving alert:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
