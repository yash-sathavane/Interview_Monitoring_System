const mongoose = require("mongoose");
const Monitoring = require("../models/Monitoring.cjs");

/**
 * Analyzes monitoring logs and generates report metrics.
 * @param {string} sessionId 
 * @param {object} sessionData - Session object (start/end times)
 * @returns {object} Analysis results
 */
exports.generateReportData = async (sessionId, sessionData) => {
  // 1. Fetch all monitoring logs
  const logs = await Monitoring.find({ sessionId }).sort({ timestamp: 1 });
  
  // 2. Calculate Durations
  const startTime = sessionData.createdAt; 
  const endTime = sessionData.endedAt || new Date();
  const durationMs = endTime - startTime;

  // 3. Analyze Logs
  let totalLogs = logs.length || 1;
  let eyeCenter = 0, eyeAway = 0;
  let headCenter = 0, headDown = 0, headSide = 0;
  let tabSwitchCount = 0;
  let keyboardEvents = 0;
  let mouseEvents = 0;

  let lastTabStatus = "Same Tab";

  logs.forEach(log => {
    // Eye
    if (log.eyeMovement === "Looking Center") eyeCenter++;
    else eyeAway++;

    // Head
    if (log.headPosition === "Center") headCenter++;
    else if (log.headPosition === "Down") headDown++;
    else headSide++;

    // Tab (Detect transitions to avoid counting every second)
    if (log.tabStatus === "Switched" && lastTabStatus !== "Switched") {
      tabSwitchCount++;
    }
    lastTabStatus = log.tabStatus;

    // Input
    if (log.keyboardStatus === "Typing") keyboardEvents++;
    if (log.mouseStatus === "Moving") mouseEvents++;
  });

  // 4. Calculate Stats
  const eyeCenterPct = Math.round((eyeCenter / totalLogs) * 100);
  const eyeAwayPct = Math.round((eyeAway / totalLogs) * 100);
  
  const headCenterPct = Math.round((headCenter / totalLogs) * 100);
  const headDownPct = Math.round((headDown / totalLogs) * 100);
  const headSidePct = Math.round((headSide / totalLogs) * 100);

  // 5. Calculate Suspicion Score (Heuristic)
  // Base: 0
  // +10 per tab switch
  // +0.5 per % looking away
  // +0.5 per % head down/side
  let score = 0;
  score += tabSwitchCount * 10;
  score += eyeAwayPct * 0.5;
  score += (headDownPct + headSidePct) * 0.5;
  score = Math.min(100, Math.round(score)); // Cap at 100

  // 6. Risk Level
  let risk = "SAFE";
  if (score > 50) risk = "HIGH";
  else if (score > 20) risk = "MEDIUM";

  return {
    duration: formatDuration(durationMs),
    startTime,
    endTime,
    totalAlerts: score,
    tabSwitchCount,
    eyeMovementStats: { center: eyeCenterPct, away: eyeAwayPct },
    headPositionStats: { center: headCenterPct, down: headDownPct, side: headSidePct },
    keyboardEvents,
    mouseEvents,
    suspicionScore: score,
    riskLevel: risk
  };
};

// Helper: Format Duration
function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + "m " + (seconds < 10 ? "0" : "") + seconds + "s";
}
