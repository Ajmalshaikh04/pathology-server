const Report = require("../model/report");
const Appointment = require("../model/appointment");

async function createReport(req, res) {
  try {
    const { appointmentId, details, file } = req.body;

    const appointment = await Appointment.findById(appointmentId).populate(
      "labs.tests.test"
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if all tests are completed or closed
    const allTestsCompleted = appointment.labs.tests.every((test) =>
      ["Completed", "Closed"].includes(test.status)
    );

    if (!allTestsCompleted) {
      return res.status(400).json({
        message: "All tests must be completed or closed to generate a report",
      });
    }

    const report = new Report({
      appointment: appointmentId,
      details,
      file,
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error creating report", error });
  }
}

async function getReport(req, res) {
  try {
    const report = await Report.findById(req.params.id).populate("appointment");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report", error });
  }
}

async function getAllReports(req, res) {
  try {
    const reports = await Report.find().populate("appointment");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
}

async function updateReport(req, res) {
  try {
    const { details, file } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.details = details !== undefined ? details : report.details;
    report.file = file !== undefined ? file : report.file;

    await report.save();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error updating report", error });
  }
}

async function deleteReport(req, res) {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report", error });
  }
}

module.exports = {
  createReport,
  getReport,
  getAllReports,
  updateReport,
  deleteReport,
};
