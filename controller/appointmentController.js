const APIFeatures = require("../helper/apifeature");
const Appointment = require("../model/appointment");

const createAppointment = async (req, res) => {
  try {
    const {
      type,
      age,
      gender,
      problem,
      problemDescription,
      user,
      lab,
      appointmentDate,
      tests,
    } = req.body;

    const newAppointment = new Appointment({
      type,
      age,
      gender,
      problem,
      problemDescription,
      user,
      lab,
      appointmentDate,
      tests,
      createdBy: req.account,
      createdByModel: req.role.charAt(0).toUpperCase() + req.role.slice(1),
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    Object.assign(appointment, updateData);
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    // const { appointmentId, labId, testId } = req.params;
    const { appointmentId, labId, testId, status } = req.body;

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Find the specific lab within the appointment
    const labIndex = appointment.labs.findIndex(
      (lab) => lab._id.toString() === labId
    );
    if (labIndex === -1) {
      return res
        .status(404)
        .json({ message: "Lab not found in the appointment" });
    }

    // Find the specific test within the lab
    const testIndex = appointment.labs[labIndex].tests.findIndex(
      (test) => test.test.toString() === testId
    );
    if (testIndex === -1) {
      return res.status(404).json({ message: "Test not found in the lab" });
    }

    // Update the test status
    appointment.labs[labIndex].tests[testIndex].status = status;
    await appointment.save();

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.remove();

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointmentsByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const appointments = await Appointment.find({
      createdBy: agentId,
      createdByModel: "Agent",
    })
      .populate("user")
      .populate("lab")
      .populate("tests");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointmentsByFranchise = async (req, res) => {
  try {
    const { franchiseId } = req.params;
    const appointments = await Appointment.find({
      createdBy: franchiseId,
      createdByModel: "Franchise",
    })
      .populate("user")
      .populate("lab")
      .populate("tests");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointmentsBySuperAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      createdByModel: "SuperAdmin",
    })
      .populate("user")
      .populate("lab")
      .populate("tests");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getAllAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({})
//       .populate("user")
// .populate("lab")
// .populate("tests");
//     res.status(200).json(appointments);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getAllAppointments = async (req, res) => {
  try {
    // Create a new instance of APIFeatures
    const features = new APIFeatures(Appointment.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields();

    // Apply pagination after other operations
    const paginatedFeatures = features.paginate();

    // Execute the query with population
    const appointments = await paginatedFeatures.query
      .populate("user")
      .populate("createdBy")
      .populate({
        path: "labs.lab",
        model: "DiagnosticLab",
      })
      .populate({
        path: "labs.tests.test",
        model: "DiagnosticTest",
      });

    // Get total count for pagination info
    const totalAppointments = await Appointment.countDocuments(
      features.query._conditions
    );

    res.status(200).json({
      success: true,
      results: appointments.length,
      totalAppointments,
      data: appointments,
      pagination: {
        currentPage: paginatedFeatures.queryString.page * 1 || 1,
        limit: paginatedFeatures.queryString.limit * 1 || 20,
        totalPages: Math.ceil(
          totalAppointments / (paginatedFeatures.queryString.limit * 1 || 20)
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ user: userId })
      .populate("user")
      .populate("createdBy")
      .populate({
        path: "labs.lab",
        model: "DiagnosticLab",
      })
      .populate({
        path: "labs.tests.test",
        model: "DiagnosticTest",
      });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const approveAppointment = async (req, res) => {
//   const { appointmentId } = req.params;

//   try {
//     const appointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { "labs.lab.status": "Approve" },
//       { new: true } // Return the updated document
//     );

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     return res
//       .status(200)
//       .json({ message: "Appointment approved", appointment });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
// const rejectAppointment = async (req, res) => {
//   const { appointmentId } = req.params;

//   try {
//     const appointment = await Appointment.findByIdAndUpdate(
//       appointmentId,
//       { "labs.lab.status": "Reject" },
//       { new: true } // Return the updated document
//     );

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     return res
//       .status(200)
//       .json({ message: "Appointment approved", appointment });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

const approveAppointment = async (req, res) => {
  const { appointmentId, labId } = req.params;

  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, "labs.lab": labId },
      { $set: { "labs.$.status": "Approve" } },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment or lab not found" });
    }

    return res.status(200).json({ message: "Lab approved", appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const rejectAppointment = async (req, res) => {
  const { appointmentId, labId } = req.params;

  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, "labs.lab": labId },
      { $set: { "labs.$.status": "Reject" } },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment or lab not found" });
    }

    return res.status(200).json({ message: "Lab rejected", appointment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAllAppointmentsByAgent,
  getAllAppointmentsByFranchise,
  getAllAppointmentsBySuperAdmin,
  getAllAppointments,
  getAppointmentsByUserId,
  approveAppointment,
  rejectAppointment,
};
