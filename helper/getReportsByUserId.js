const mongoose = require("mongoose");
const Report = require("../model/report");
const Appointment = require("../model/appointment");

async function getReportsByUserId(userId) {
  // try {
  //   const appointments = await Appointment.find({ createdBy: userId }).select(
  //     "_id"
  //   );

  //   if (!appointments.length) {
  //     return [];
  //   }

  //   const appointmentIds = appointments.map((appointment) => appointment._id);

  //   const reports = await Report.find({ appointment: { $in: appointmentIds } });

  //   return reports;
  // } catch (error) {
  //   console.error("Error fetching reports by user ID:", error);
  //   throw error;
  // }

  try {
    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid userId: ${userId}`);
    }

    const appointments = await Appointment.find({ createdBy: userId }).select(
      "_id"
    );

    if (!appointments.length) {
      return [];
    }

    const appointmentIds = appointments.map((appointment) => appointment._id);

    console.log("Appointment IDs:", appointmentIds);

    const reports = await Report.find({ appointment: { $in: appointmentIds } });

    return reports;
  } catch (error) {
    console.error("Error fetching reports by user ID:", error);
    throw error;
  }
}

module.exports = { getReportsByUserId };
