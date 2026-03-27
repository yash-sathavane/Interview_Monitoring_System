const Session = require("../models/Session.cjs");
const Monitoring = require("../models/Monitoring.cjs");
const Report = require("../models/Report.cjs");
const User = require("../models/User.cjs");
const analysisService = require("../services/analysisService.cjs");
const pdfService = require("../services/pdfService.cjs");

// Helper: Format Duration (Moved to service, but keeping for reference if needed elsewhere or removing)
// const formatDuration = (ms) => { ... } // Removing locally since service handles it

// 1. Create Session (Interviewer)
exports.createSession = async (req, res) => {
  try {
    const { interviewerId, candidateEmail } = req.body;
    
    // Generate a simple 6-char session ID for easier sharing
    const sessionId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newSession = new Session({
      sessionId,
      interviewerId, // Assumes valid User ObjectId passed from frontend
      candidateEmail,
      status: "created"
    });

    await newSession.save();
    res.status(201).json({ message: "Session created", session: newSession });

  } catch (error) {
    console.error("Create Session Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get All Sessions for an Interviewer
exports.getSessionsByInterviewer = async (req, res) => {
  try {
    const { interviewerId } = req.params;
    const sessions = await Session.find({ interviewerId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error("Get Sessions Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get All Reports for an Interviewer
exports.getReportsByInterviewer = async (req, res) => {
  try {
    const { interviewerId } = req.params;
    // 1. Find all sessions for this interviewer
    const sessions = await Session.find({ interviewerId }).select('sessionId');
    const sessionIds = sessions.map(s => s.sessionId);
    
    // 2. Find all reports for these sessions
    const reports = await Report.find({ sessionId: { $in: sessionIds } }).sort({ generatedAt: -1 });
    
    res.json(reports);
  } catch (error) {
    console.error("Get Reports Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 2. Join Session (Candidate)
exports.joinSession = async (req, res) => {
  try {
    const { sessionId, candidateName } = req.body;
    
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ error: "Session has already ended" });
    }

    // Update status to active if not already
    // Also update candidate name if provided
    let updated = false;
    if (session.status === "created") {
      session.status = "active";
      updated = true;
    }
    
    if (candidateName) {
        session.candidateName = candidateName;
        updated = true;
    }

    if (updated) {
        await session.save();
    }

    res.status(200).json({ message: "Joined session successfully", session });

  } catch (error) {
    console.error("Join Session Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// 3. End Session & Generate Report
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findOneAndUpdate(
      { sessionId },
      { status: "completed", endedAt: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // --- REPORT GENERATION LOGIC ---
    // Delegate to analysis service
    const reportData = await analysisService.generateReportData(sessionId, session);

    // 7. Get Candidate Name
    let candidateName = session.candidateName || "Guest Candidate";
    
    // Fallback to email lookup if name not present (legacy support)
    if (candidateName === "Guest Candidate" && session.candidateEmail) {
        const user = await User.findOne({ email: session.candidateEmail });
        if (user) candidateName = user.name;
        else candidateName = session.candidateEmail.split('@')[0];
    }

    // 8. Create Report
    const newReport = new Report({
      sessionId,
      candidateName,
      ...reportData
    });
    await newReport.save();

    res.status(200).json({ message: "Session ended and report generated", session, reportId: newReport._id });
  } catch (error) {
    console.error("End Session Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Session Details
exports.getSession = async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Report by SessionID
exports.getReport = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const report = await Report.findOne({ sessionId });
    
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    
    res.json(report);
  } catch (error) {
    console.error("Get Report Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Download Report PDF
exports.downloadReport = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const report = await Report.findOne({ sessionId });
    
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report_${sessionId}.pdf`);

    // Generate PDF
    pdfService.generateReportPDF(report, res);

  } catch (error) {
    console.error("Download Report Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get All Sessions for an Interviewer
exports.getSessionsByInterviewer = async (req, res) => {
  try {
    const { interviewerId } = req.params;
    // Find sessions and sort by newest first
    const sessions = await Session.find({ interviewerId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error("Get Sessions Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
