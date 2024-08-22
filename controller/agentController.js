const APIFeatures = require("../helper/apifeature");
const Agents = require("../model/agents");
const Appointment = require("../model/appointment");
const DiagnosticLab = require("../model/diagnosticLabs");
const Franchise = require("../model/franchise");
const Location = require("../model/location");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");

// Create an agent
// exports.createAgent = async (req, res) => {
//   try {
//     const { name, email, password, contact, location, franchise } = req.body;

//     const newAgent = new Agents({
//       name,
//       email,
//       password,
//       contact,
//       location,
//       franchise,
//     });

//     await newAgent.save();
//     res.status(201).json(newAgent);
//   } catch (error) {
//     console.error("Error creating agent:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.createAgent = async (req, res) => {
  try {
    const { name, email, password, contact, location, franchise } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newLocation = new Location({
      address: location.address,
      city: location.city,
      state: location.state,
      pinCode: location.pinCode,
    });
    await newLocation.save();

    const newAgent = new Agents({
      name,
      email,
      password: hashedPassword,
      contact,
      location: newLocation._id,
      franchise,
    });

    await newAgent.save();
    res.status(201).json(newAgent);
  } catch (error) {
    console.error("Error creating agent:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an agent
exports.updateAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { name, email, contact, address, franchise, password } = req.body;

    // Find the agent by ID
    const agent = await Agents.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Update the location if provided
    if (address) {
      const locationId = agent.location;
      await Location.findByIdAndUpdate(locationId, {
        address: address.address,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
      });
    }

    // Prepare updated fields
    const updateFields = {
      name,
      email,
      contact,
      franchise,
    };

    // Hash the new password if provided
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateFields.password = hashedPassword;
    }

    // Update the agent information
    const updatedAgent = await Agents.findByIdAndUpdate(agentId, updateFields, {
      new: true,
    }).select("-password"); // Exclude password from the response

    res.json(updatedAgent);
  } catch (error) {
    console.error("Error updating agent:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an agent
exports.deleteAgent = async (req, res) => {
  try {
    const { agentId } = req.params;

    const deletedAgent = await Agents.findByIdAndDelete(agentId);

    if (!deletedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting agent:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create appointment by agent
exports.createAppointmentByAgent = async (req, res) => {
  try {
    const {
      userId,
      labId,
      type,
      age,
      gender,
      problem,
      problemDescription,
      appointmentDate,
    } = req.body;

    const createdBy = req.account; // Assuming agent's ID is in req.user._id
    const role = req.user.role;

    if (role !== "agent") {
      return res.status(403).send("Permission denied");
    }

    const appointment = new Appointment({
      createdBy,
      user: userId,
      lab: labId,
      type,
      age,
      gender,
      problem,
      problemDescription,
      appointmentDate,
    });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment by agent:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get appointments for the lab managed by the agent
exports.getAppointmentsForAgent = async (req, res) => {
  try {
    const role = req.role;

    if (role !== "agent") {
      return res.status(403).send("Permission denied");
    }

    // Assuming agent has a specific lab assigned to them
    const agentLab = await DiagnosticLab.findOne({ userId: req.user._id });

    if (!agentLab) {
      return res.status(404).json({ message: "Agent lab not found" });
    }

    const appointments = await Appointment.find({ lab: agentLab._id }).populate(
      "user lab"
    );

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments for agent:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAgentsByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;

    // Create a base query
    const baseQuery = Agents.find()
      .populate({
        path: "location",
        match: { pinCode: pincode },
      })
      .populate("franchise");

    // Create a new instance of APIFeatures
    const features = new APIFeatures(baseQuery, req.query)
      .search()
      .filter()
      .sort()
      .limitFields();

    // Execute the query
    const agents = await features.query;

    // Filter out agents whose location didn't match the pincode
    const matchingAgents = agents.filter((agent) => agent.location !== null);

    // Get total count for pagination info
    const totalMatchingAgents = matchingAgents.length;

    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedAgents = matchingAgents.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      results: paginatedAgents.length,
      totalMatchingAgents,
      data: paginatedAgents,
      pagination: {
        currentPage: page,
        limit: limit,
        totalPages: Math.ceil(totalMatchingAgents / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching agents by pincode:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAgentsByFranchiseId = async (req, res) => {
  try {
    const { franchiseId } = req.params;
    console.log(franchiseId);

    // Create a base query
    const baseQuery = Agents.find({ franchise: franchiseId })
      .populate("location")
      .populate("franchise");

    // Create a new instance of APIFeatures
    const features = new APIFeatures(baseQuery, req.query)
      .search()
      .filter()
      .sort()
      .limitFields();

    // Execute the query
    const agents = await features.query;

    // Get total count for pagination info
    const totalMatchingAgents = agents.length;

    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedAgents = agents.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      results: paginatedAgents.length,
      totalMatchingAgents,
      data: paginatedAgents,
      pagination: {
        currentPage: page,
        limit: limit,
        totalPages: Math.ceil(totalMatchingAgents / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching agents by franchise ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// exports.getAppointmentsByAgentsId = async (req, res) => {
//   try {
//     const { agentId } = req.params;
//     // Create a base query
//     const baseQuery = Appointment.find({ referral: agentId })
//       .populate({
//         path: "labs.lab",
//         model: "DiagnosticLab",
//       })
//       .populate({
//         path: "labs.tests.test",
//         model: "DiagnosticTest",
//         populate: {
//           path: "labCategory",
//           model: "LabCategories",
//         },
//       })
//       .populate({
//         path: "labs.tests.updatedBy",
//         model: "User",
//       })
//       .populate({
//         path: "createdBy",
//       });

//     // Create a new instance of APIFeatures
//     const features = new APIFeatures(baseQuery, req.query)
//       .search()
//       .filter()
//       .sort()
//       .limitFields();

//     // Extract pagination info from query
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // Execute the query with pagination
//     const appointments = await features.query.skip(skip).limit(limit);

//     // Get total count for pagination info
//     const totalAppointments = await Appointment.countDocuments({
//       referral: agentId,
//     });

//     res.status(200).json({
//       success: true,
//       results: appointments.length,
//       totalAppointments,
//       data: appointments,
//       pagination: {
//         currentPage: page,
//         limit: limit,
//         totalPages: Math.ceil(totalAppointments / limit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching appointments by agent ID:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.getAppointmentsByAgentsId = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Create a base query
    const baseQuery = Appointment.find({ referral: agentId });

    // Create a new instance of APIFeatures
    const features = new APIFeatures(baseQuery, req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query with initial population
    const appointments = await features.query
      .populate({
        path: "referral",
        model: "Agent",
      })
      .populate({
        path: "labs.lab",
        model: "DiagnosticLab",
      })
      .populate({
        path: "labs.tests.test",
        model: "DiagnosticTest",
        populate: {
          path: "labCategory",
          model: "LabCategories",
        },
      })
      .populate({
        path: "createdBy",
      })
      .exec();

    // Manually populate the updatedBy field
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const testsWithUpdatedBy = await Promise.all(
          appointment.labs.tests.map(async (test) => {
            let updatedByModel = null;
            if (test.updatedByModel === "User") {
              updatedByModel = await User.findById(test.updatedBy);
            } else if (test.updatedByModel === "DiagnosticLab") {
              updatedByModel = await DiagnosticLab.findById(test.updatedBy);
            } else if (test.updatedByModel === "SuperAdmin") {
              updatedByModel = await User.findById(test.updatedBy);
            }
            return { ...test.toObject(), updatedBy: updatedByModel };
          })
        );

        return {
          ...appointment.toObject(),
          labs: {
            ...appointment.labs.toObject(),
            tests: testsWithUpdatedBy,
          },
        };
      })
    );

    // Get total count for pagination info
    const totalAppointments = await Appointment.countDocuments({
      referral: agentId,
      ...features.query._conditions,
    });

    res.status(200).json({
      success: true,
      results: populatedAppointments.length,
      totalAppointments,
      data: populatedAppointments,
      pagination: {
        currentPage: features.queryString.page * 1 || 1,
        limit: features.queryString.limit * 1 || 10,
        totalPages: Math.ceil(
          totalAppointments / (features.queryString.limit * 1 || 10)
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching appointments by agent ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppointmentsByFranchiseAndDateRange = async (req, res) => {
  const { franchiseId, startDate, endDate } = req.query;
  // If no dates are provided, default to the last 28 days
  if (!startDate || !endDate) {
    endDate = new Date();
    startDate = new Date(endDate.getTime() - 28 * 24 * 60 * 60 * 1000);
  }

  // Get all agents belonging to the franchise
  const agents = await Agent.find({ franchise: franchiseId });
  const agentIds = agents.map((agent) => agent._id);

  // Get all appointments for these agents within the date range
  const appointments = await Appointment.find({
    referral: { $in: agentIds },
    createdAt: { $gte: startDate, $lte: endDate },
  })
    .populate("referral")
    .populate("labs.lab")
    .populate("labs.tests.test");

  // Group appointments by agent
  const appointmentsByAgent = {};
  appointments.forEach((appointment) => {
    const agentId = appointment.referral._id.toString();
    if (!appointmentsByAgent[agentId]) {
      appointmentsByAgent[agentId] = [];
    }
    appointmentsByAgent[agentId].push(appointment);
  });

  return appointmentsByAgent;
};

exports.setCommissionForSelectedAgents = async (req, res) => {
  try {
    const { agentIds, commissionPercentage } = req.body;

    // Validate input
    if (!Array.isArray(agentIds) || agentIds.length === 0) {
      return res.status(400).json({ message: "No agents selected." });
    }
    if (
      typeof commissionPercentage !== "number" ||
      commissionPercentage < 0 ||
      commissionPercentage > 100
    ) {
      return res
        .status(400)
        .json({ message: "Invalid commission percentage." });
    }

    // Update commission for selected agents
    const result = await Agents.updateMany(
      { _id: { $in: agentIds } },
      { $set: { commissionPercentage } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: "No agents found to update." });
    }

    return res
      .status(200)
      .json({ message: "Commission updated successfully." });
  } catch (error) {
    console.error("Error setting commission:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating commissions." });
  }
};
