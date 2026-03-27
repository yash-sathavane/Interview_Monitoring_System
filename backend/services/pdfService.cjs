const PDFDocument = require('pdfkit');

/**
 * Generates a PDF report for the given report data.
 * @param {object} report - The report object from the database.
 * @param {object} res - Express response object to stream the PDF to.
 */
exports.generateReportPDF = (report, res) => {
  const doc = new PDFDocument();

  // Pipe the PDF to the response
  doc.pipe(res);

  // Title
  doc.fontSize(20).text('Interview Integrity Report', { align: 'center' });
  doc.moveDown();

  // Meta Info
  doc.fontSize(12).text(`Candidate: ${report.candidateName || 'Unknown'}`);
  doc.text(`Session ID: ${report.sessionId}`);
  doc.text(`Date: ${new Date(report.generatedAt).toLocaleDateString()}`);
  doc.text(`Duration: ${report.duration}`);
  doc.moveDown();

  // Risk Level
  doc.fontSize(14).text(`Risk Level: ${report.riskLevel}`, {
    underline: true,
    color: report.riskLevel === 'HIGH' ? 'red' : (report.riskLevel === 'MEDIUM' ? 'orange' : 'green')
  });
  doc.fontSize(12).text(`Suspicion Score: ${report.suspicionScore}/100`);
  doc.moveDown();

  // Metrics Table (Simulated with text for simplicity in pdfkit, or using simple layout)
  doc.fontSize(14).text('Detailed Metrics', { underline: true, color: 'black' });
  doc.moveDown(0.5);

  const metrics = [
    { label: 'Tab Switches', value: report.tabSwitchCount },
    { label: 'Looking Away', value: `${report.eyeMovementStats?.away || 0}%` },
    { label: 'Head Movement (Down/Side)', value: `${(report.headPositionStats?.down || 0) + (report.headPositionStats?.side || 0)}%` },
    { label: 'Keyboard Events', value: report.keyboardEvents },
    { label: 'Mouse Events', value: report.mouseEvents },
  ];

  metrics.forEach(metric => {
    doc.fontSize(12).text(`${metric.label}: ${metric.value}`);
  });

  doc.moveDown();
  
  // Footer
  doc.fontSize(10).text('Interview Integrity Monitoring System', {
    align: 'center',
    valign: 'bottom'
  });

  // Finalize PDF file
  doc.end();
};
