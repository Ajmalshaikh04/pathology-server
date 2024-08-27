const mongoose = require("mongoose");
const Report = require("../model/report"); // Adjust the path to where your Report model is located
const Appointment = require("../model/appointment"); // Adjust the path to where your Appointment model is located

async function getReportsByUserId(userId) {
  try {
    // Find all appointments associated with the user
    const appointments = await Appointment.find({ createdBy: userId }).select(
      "_id"
    );

    if (!appointments.length) {
      return []; // No appointments found for this user
    }

    // Extract appointment IDs
    const appointmentIds = appointments.map((appointment) => appointment._id);

    // Find all reports associated with these appointments
    const reports = await Report.find({ appointment: { $in: appointmentIds } });

    return reports;
  } catch (error) {
    console.error("Error fetching reports by user ID:", error);
    throw error;
  }
}

module.exports = { getReportsByUserId };
